package com.aicareerguidance.services;

import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import com.aicareerguidance.dtos.LoginResponse;
import com.aicareerguidance.dtos.PaginatedResponse;
import com.aicareerguidance.dtos.ProfileRequest;
import com.aicareerguidance.dtos.ProfileResponse;
import com.aicareerguidance.dtos.RegisterRequest;
import com.aicareerguidance.dtos.UserProfileResponse;
import com.aicareerguidance.dtos.UserResponse;

public interface UserService {

    UserResponse register(RegisterRequest request);
    UserProfileResponse getUserById(UUID id);
    UserProfileResponse getUserByEmail(String email);
    PaginatedResponse<UserResponse> getAllUsers(Pageable pageable);
    void deleteUser(UUID id);
    LoginResponse verifyEmail(String email, String code);
    void resendVerificationCode(String email);
    ProfileResponse updateProfile(UUID userId, ProfileRequest request);
    ProfileResponse uploadProfilePicture(UUID userId, MultipartFile file);
}