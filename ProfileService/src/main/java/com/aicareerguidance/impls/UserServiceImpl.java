package com.aicareerguidance.impls;

import com.aicareerguidance.dtos.LoginResponse;
import com.aicareerguidance.dtos.PaginatedResponse;
import com.aicareerguidance.dtos.ProfileRequest;
import com.aicareerguidance.dtos.ProfileResponse;
import com.aicareerguidance.dtos.RegisterRequest;
import com.aicareerguidance.dtos.UserProfileResponse;
import com.aicareerguidance.dtos.UserResponse;
import com.aicareerguidance.entities.Profile;
import com.aicareerguidance.entities.User;
import com.aicareerguidance.events.BaseEvent;
import com.aicareerguidance.events.EventPublisher;
import com.aicareerguidance.exeption.DuplicateException;
import com.aicareerguidance.exeption.NotFoundException;
import com.aicareerguidance.mapper.ProfileMapper;
import com.aicareerguidance.mapper.UserMapper;
import com.aicareerguidance.mapper.UserProfileMapper;
import com.aicareerguidance.repositories.ProfileRepository;
import com.aicareerguidance.repositories.UserRepository;
import com.aicareerguidance.services.CredentialGeneratorService;
import com.aicareerguidance.services.JwtService;
import com.aicareerguidance.services.S3Service;
import com.aicareerguidance.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final EventPublisher eventPublisher;
    private final CredentialGeneratorService credentialGeneratorService;
    private final UserMapper userMapper;
    private final ProfileMapper profileMapper;
    private final UserProfileMapper userProfileMapper;
    private final S3Service s3Service;
    private final JwtService jwtService;

    // -------------------- REGISTER USER --------------------
    @Override
    @Transactional
    public UserResponse register(@Valid RegisterRequest request) {

        try {

            if (userRepository.existsByEmail(request.getEmail())) {
                log.warn("Duplicate email detected: {}", request.getEmail());
                throw new DuplicateException("Email already registered: " + request.getEmail());
            }

            User user = userMapper.toEntity(request);

            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setVerificationCode(credentialGeneratorService.generateVerificationCode());
            user.setVerificationExpiry(LocalDateTime.now().plusMinutes(10));
            user.setEmailVerified(false);

            User saved = userRepository.save(user);

            Profile profile = new Profile();
            profile.setUser(saved);
            profile.setSkills(new ArrayList<>());
            profile.setInterests(new ArrayList<>());
            profile.setEducation("");
            profileRepository.save(profile);

            Map<String, String> eventData = new HashMap<>();
            eventData.put("name", saved.getFirstName());
            eventData.put("email", saved.getEmail());
            eventData.put("code", saved.getVerificationCode());

            BaseEvent event = new BaseEvent(
                    "UserRegistered",
                    eventData,
                    "EMAIL_VERIFICATION"
            );

            eventPublisher.publishEvent(event);

            log.info("User registered successfully: {}", saved.getEmail());

            return userMapper.toResponse(saved);

        } catch (DuplicateException ex) {
            log.error("Duplicate error during registration: {}", request.getEmail(), ex);
            throw ex;

        } catch (Exception ex) {
            log.error("Failed to register user: {}", request.getEmail(), ex);
            throw new RuntimeException("Failed to register user");
        }
    }

    // -------------------- GET BY ID --------------------
    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getUserById(UUID id) {

        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("User not found with ID: " + id));

            Profile profile = profileRepository.findByUser_Id(id)
                    .orElseThrow(() -> new NotFoundException("Profile not found for user: " + id));

            return userProfileMapper.toResponse(user, profile);

        } catch (NotFoundException ex) {
            log.error("User not found with ID: {}", id, ex);
            throw ex;

        } catch (Exception ex) {
            log.error("Failed to fetch user by ID: {}", id, ex);
            throw new RuntimeException("Failed to fetch user");
        }
    }

    // -------------------- GET BY EMAIL --------------------
    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getUserByEmail(String email) {

        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new NotFoundException("User not found with email: " + email));

            Profile profile = profileRepository.findByUser_Id(user.getId())
                    .orElseThrow(() -> new NotFoundException("Profile not found for user: " + email));

            return userProfileMapper.toResponse(user, profile);

        } catch (NotFoundException ex) {
            log.error("User not found with email: {}", email, ex);
            throw ex;

        } catch (Exception ex) {
            log.error("Failed to fetch user by email: {}", email, ex);
            throw new RuntimeException("Failed to fetch user");
        }
    }

    // -------------------- PAGINATED USERS --------------------
    @Override
    @Transactional(readOnly = true)
    public PaginatedResponse<UserResponse> getAllUsers(Pageable pageable) {

        try {
            Pageable safePageable = validateAndFixPageable(pageable);

            Page<User> page = userRepository.findAll(safePageable);

            List<UserResponse> users = page.getContent()
                    .stream()
                    .map(userMapper::toResponse)
                    .toList();

            return new PaginatedResponse<>(
                    users,
                    page.getNumber(),
                    page.getSize(),
                    page.getTotalElements(),
                    page.getTotalPages(),
                    page.hasNext(),
                    page.hasPrevious()
            );

        } catch (Exception ex) {
            log.error("Failed to fetch paginated users", ex);
            throw new RuntimeException("Failed to fetch users");
        }
    }

    // -------------------- DELETE USER --------------------
    @Override
    @Transactional
    public void deleteUser(UUID id) {

        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("User not found with ID: " + id));

            userRepository.delete(user);

            log.info("User deleted: {}", user.getEmail());

        } catch (NotFoundException ex) {
            log.error("User not found for deletion: {}", id, ex);
            throw ex;

        } catch (Exception ex) {
            log.error("Failed to delete user: {}", id, ex);
            throw new RuntimeException("Failed to delete user");
        }
    }

    // -------------------- VERIFY EMAIL --------------------
    @Override
    @Transactional
    public LoginResponse verifyEmail(String email, String code) {

        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new NotFoundException("User not found"));

            if (user.isEmailVerified()) {
                log.warn("VERIFY EMAIL FAILED: Email already verified | email={}", user.getEmail());
                throw new IllegalStateException("Email already verified");
            }

            if (user.getVerificationExpiry() == null) {
                log.error("VERIFY EMAIL ERROR: Expiry is null | email={}", user.getEmail());
                throw new IllegalArgumentException("Verification code expired");
            }

            if (user.getVerificationExpiry().isBefore(LocalDateTime.now())) {
                log.warn(
                    "VERIFY EMAIL FAILED: Code expired | email={} | expiry={} | now={}",
                    user.getEmail(),
                    user.getVerificationExpiry(),
                    LocalDateTime.now()
                );
                throw new IllegalArgumentException("Verification code expired");
            }

            if (user.getVerificationCode() == null) {
                log.error("VERIFY EMAIL ERROR: Code is null | email={}", user.getEmail());
                throw new IllegalArgumentException("Invalid verification code");
            }

            if (!user.getVerificationCode().equals(code)) {
                log.warn(
                    "VERIFY EMAIL FAILED: Invalid code | email={} | provided={} | expected={}",
                    user.getEmail(),
                    code,
                    user.getVerificationCode()
                );
                throw new IllegalArgumentException("Invalid verification code");
            }

            user.setEmailVerified(true);
            user.setVerifiedAt(LocalDateTime.now());
            user.setVerificationCode(null);
            user.setVerificationExpiry(null);

            User savedUser = userRepository.save(user);
            try {
                Map<String, String> eventData = new HashMap<>();
                eventData.put("email", savedUser.getEmail());
                eventData.put("name", savedUser.getFirstName());

                BaseEvent event = new BaseEvent(
                        "UserVerified",
                        eventData,
                        "WELCOME_EMAIL"
                );

                eventPublisher.publishEvent(event);

            } catch (Exception ex) {
                log.error("Failed to publish welcome email event for {}", email, ex);
            }

            return buildLoginResponse(user);

        } catch (NotFoundException | IllegalStateException ex) {
            log.error("Verification failed - user not found: {}", email, ex);
            throw ex;

        } catch (Exception ex) {
            log.error("Failed to verify email: {}", email, ex);
            throw new RuntimeException("Failed to verify email");
        }
    }

    // -------------------- RESEND CODE --------------------
    @Override
    @Transactional
    public void resendVerificationCode(String email) {

        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new NotFoundException("User not found"));

            String newCode = credentialGeneratorService.generateVerificationCode();

            user.setVerificationCode(newCode);
            user.setVerificationExpiry(LocalDateTime.now().plusMinutes(10));

            userRepository.save(user);

            Map<String, String> eventData = new HashMap<>();
            eventData.put("email", user.getEmail());
            eventData.put("name", user.getFirstName());
            eventData.put("code", newCode);

            eventPublisher.publishEvent(
                    new BaseEvent("ResendVerificationCode", eventData, "EMAIL_VERIFICATION")
            );

            log.info("Verification code resent: {} (expires in 10 minutes)", email);

        } catch (NotFoundException ex) {
            log.error("User not found for resend code: {}", email, ex);
            throw ex;

        } catch (Exception ex) {
            log.error("Failed to resend verification code: {}", email, ex);
            throw new RuntimeException("Failed to resend verification code");
        }
    }

    // -------------------- UPDATE PROFILE --------------------
    @Override
    @Transactional
    public ProfileResponse updateProfile(UUID userId, ProfileRequest request) {

        try {
            Profile profile = profileRepository.findByUser_Id(userId)
                    .orElseThrow(() -> new NotFoundException("Profile not found for user: " + userId));

            profile.setSkills(request.getSkills());
            profile.setInterests(request.getInterests());
            profile.setEducation(request.getEducation());

            Profile saved = profileRepository.save(profile);

            log.info("Profile updated for user: {}", userId);
            return profileMapper.toResponse(saved);

        } catch (NotFoundException ex) {
            log.error("Profile not found for update, user: {}", userId, ex);
            throw ex;

        } catch (Exception ex) {
            log.error("Failed to update profile for user: {}", userId, ex);
            throw new RuntimeException("Failed to update profile");
        }
    }


    @Override
    @Transactional
    public ProfileResponse uploadProfilePicture(UUID userId, MultipartFile file) {

        try {
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("File cannot be empty");
            }

            if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
                throw new IllegalArgumentException("Only image files are allowed");
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new NotFoundException("User not found with ID: " + userId));

            Profile profile = profileRepository.findByUser_Id(userId)
                    .orElseThrow(() -> new NotFoundException("Profile not found for user: " + userId));

            if (profile.getProfilePicture() != null) {
                try {
                    s3Service.deleteFile(profile.getProfilePicture());
                } catch (Exception ex) {
                    log.warn("Failed to delete old profile picture for user: {}", userId);
                }
            }

            String key = s3Service.uploadProfilePicture(file);

            profile.setProfilePicture(key);
            userRepository.save(user);

            log.info("Profile picture uploaded for user: {}", userId);

            return profileMapper.toResponse(profile);

        } catch (NotFoundException ex) {
            log.error("Upload failed - user/profile not found: {}", userId, ex);
            throw ex;

        } catch (IllegalArgumentException ex) {
            log.warn("Invalid upload attempt for user: {}", userId, ex);
            throw ex;

        } catch (Exception ex) {
            log.error("Failed to upload profile picture for user: {}", userId, ex);
            throw new RuntimeException("Failed to upload profile picture");
        }
    }

    private Pageable validateAndFixPageable(Pageable pageable) {

        List<String> allowedFields = List.of(
                "firstName",
                "lastName",
                "email",
                "createdAt"
        );

        List<Sort.Order> validOrders = new ArrayList<>();

        for (Sort.Order order : pageable.getSort()) {
            if (allowedFields.contains(order.getProperty())) {
                validOrders.add(order);
            } else {
                log.warn("Invalid sort field ignored: {}", order.getProperty());
            }
        }

        Sort sort = validOrders.isEmpty()
                ? Sort.by(Sort.Direction.DESC, "createdAt")
                : Sort.by(validOrders);

        return PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );
    }

    private LoginResponse buildLoginResponse(User user) {

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        String idToken = jwtService.generateIdToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .idToken(idToken)
                .build();
    }
}