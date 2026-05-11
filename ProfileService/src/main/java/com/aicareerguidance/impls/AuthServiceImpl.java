package com.aicareerguidance.impls;

import com.aicareerguidance.dtos.LoginRequest;
import com.aicareerguidance.dtos.LoginResponse;
import com.aicareerguidance.dtos.PasswordResetRequest;
import com.aicareerguidance.entities.User;
import com.aicareerguidance.events.BaseEvent;
import com.aicareerguidance.events.EventPublisher;
import com.aicareerguidance.exeption.NotFoundException;
import com.aicareerguidance.repositories.UserRepository;
import com.aicareerguidance.services.AuthService;
import com.aicareerguidance.services.JwtService;
import com.aicareerguidance.services.CredentialGeneratorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final EventPublisher eventPublisher;
    private final CredentialGeneratorService credentialGeneratorService;

    // -------------------- LOGIN --------------------
    @Override
    public LoginResponse login(LoginRequest dto) {

        try {
            User user = userRepository.findByEmail(dto.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
                    

            if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
                throw new BadCredentialsException("Invalid credentials");
            }
            if (!user.isEmailVerified()) {
                throw new IllegalArgumentException("Email not verified. Please verify your email.");
            }

            return buildLoginResponse(user);

        } catch (BadCredentialsException ex) {
            log.error("Login failed for {}", dto.getEmail(), ex);
            throw ex;

        } catch (Exception ex) {
            log.error("Unexpected login error", ex);
            throw new RuntimeException("Login failed");
        }
    }

    // -------------------- FORGOT PASSWORD (OTP) --------------------
    @Override
    @Transactional
    public void forgotPassword(String email) {

        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new NotFoundException("User not found"));            if (!user.isEmailVerified()) {
                throw new IllegalArgumentException("Email not verified. Please verify your email before logging in.");
            }

            if (!user.isEmailVerified()) {
                throw new IllegalArgumentException("Email not verified. Please verify your email.");
            }

            String code = credentialGeneratorService.generateVerificationCode();

            user.setVerificationCode(code);
            user.setVerificationExpiry(LocalDateTime.now().plusMinutes(10));

            userRepository.save(user);

            Map<String, String> eventData = new HashMap<>();
            eventData.put("email", user.getEmail());
            eventData.put("name", user.getFirstName());
            eventData.put("code", code);

            eventPublisher.publishEvent(
                    new BaseEvent("PasswordResetRequested", eventData, "RESET_PASSWORD_EMAIL")
            );

            log.info("Password reset OTP sent to {}", email);

        } catch (NotFoundException ex) {
            log.error("Forgot password - user not found {}", email, ex);
            throw ex;

        } catch (Exception ex) {
            log.error("Forgot password failed {}", email, ex);
            throw new RuntimeException("Failed to process forgot password");
        }
    }

    // -------------------- RESET PASSWORD (OTP VERIFY) --------------------
    @Override
    @Transactional
    public void resetPassword(PasswordResetRequest request) {

        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new NotFoundException("User not found"));

            if (user.getVerificationExpiry() == null ||
                user.getVerificationExpiry().isBefore(LocalDateTime.now())) {
                throw new IllegalArgumentException("Code expired");
            }

            if (user.getVerificationCode() == null ||
                !user.getVerificationCode().equals(request.getCode())) {
                throw new IllegalArgumentException("Invalid code");
            }

            if (!user.isEmailVerified()) {
                throw new IllegalArgumentException("Email not verified. Please verify your email.");
            }

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));

            // clear OTP after use
            user.setVerificationCode(null);
            user.setVerificationExpiry(null);

            userRepository.save(user);

            Map<String, String> eventData = new HashMap<>();
            eventData.put("email", user.getEmail());
            eventData.put("name", user.getFirstName());

            eventPublisher.publishEvent(
                    new BaseEvent("PasswordResetSuccessful", eventData, "RESET_CONFIRMATION_EMAIL")
            );

            log.info("Password reset successful for {}", user.getEmail());

        } catch (NotFoundException ex) {
            log.error("Reset password user not found", ex);
            throw ex;

        } catch (IllegalArgumentException ex) {
            log.error("Invalid OTP reset attempt", ex);
            throw ex;

        } catch (Exception ex) {
            log.error("Reset password failed", ex);
            throw new RuntimeException("Failed to reset password");
        }
    }

    // -------------------- REFRESH TOKEN --------------------
    @Override
    public LoginResponse refreshToken(String refreshToken) {

        try {
            String email = jwtService.extractUsername(refreshToken);

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));

            if (!jwtService.isRefreshTokenValid(refreshToken, user)) {
                throw new BadCredentialsException("Invalid refresh token");
            }

            if (!user.isEmailVerified()) {
                throw new IllegalArgumentException("Email not verified. Please verify your email.");
            }

            return buildLoginResponse(user);

        } catch (Exception ex) {
            log.error("Refresh token failed", ex);
            throw new BadCredentialsException("Invalid refresh token");
        }
    }

    // -------------------- LOGIN RESPONSE BUILDER --------------------
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