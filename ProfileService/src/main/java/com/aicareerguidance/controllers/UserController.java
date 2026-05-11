package com.aicareerguidance.controllers;

import com.aicareerguidance.dtos.ApiResponse;
import com.aicareerguidance.dtos.LoginResponse;
import com.aicareerguidance.dtos.PaginatedResponse;
import com.aicareerguidance.dtos.ProfileRequest;
import com.aicareerguidance.dtos.ProfileResponse;
import com.aicareerguidance.dtos.RegisterRequest;
import com.aicareerguidance.dtos.UserProfileResponse;
import com.aicareerguidance.dtos.UserResponse;
import com.aicareerguidance.services.UserService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // -------------------- REGISTER USER --------------------
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@RequestBody @Valid RegisterRequest request) {

        UserResponse responseData = userService.register(request);

        ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
                .message("User registered successfully")
                .statusCode(HttpStatus.CREATED.value())
                .success(true)
                .data(responseData)
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // -------------------- GET USER BY ID --------------------
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getById(@PathVariable UUID id) {

        UserProfileResponse responseData = userService.getUserById(id);

        ApiResponse<UserProfileResponse> response = ApiResponse.<UserProfileResponse>builder()
                .message("User fetched successfully")
                .statusCode(HttpStatus.OK.value())
                .success(true)
                .data(responseData)
                .build();

        return ResponseEntity.ok(response);
    }

    // -------------------- GET USER BY EMAIL --------------------
    @GetMapping("/email")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getByEmail(@RequestParam String email) {

        UserProfileResponse responseData = userService.getUserByEmail(email);

        ApiResponse<UserProfileResponse> response = ApiResponse.<UserProfileResponse>builder()
                .message("User fetched successfully")
                .statusCode(HttpStatus.OK.value())
                .success(true)
                .data(responseData)
                .build();

        return ResponseEntity.ok(response);
    }

    // -------------------- UPLOAD PROFILE PICTURE --------------------    
    @PostMapping(value = "/{id}/profile-picture", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<ProfileResponse>> uploadProfilePicture(
            @PathVariable UUID id,
            @Parameter(
                description = "Profile picture file",
                content = @Content(mediaType = "multipart/form-data",
                schema = @Schema(type = "string", format = "binary"))
            )
            @RequestParam("file") MultipartFile file) {

        ProfileResponse responseData = userService.uploadProfilePicture(id, file);

        ApiResponse<ProfileResponse> response = ApiResponse.<ProfileResponse>builder()
                .message("Profile picture uploaded successfully")
                .statusCode(HttpStatus.OK.value())
                .success(true)
                .data(responseData)
                .build();

        return ResponseEntity.ok(response);
    }    

    // -------------------- GET ALL USERS (PAGINATED) --------------------
    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<UserResponse>>> getAll(Pageable pageable) {

        PaginatedResponse<UserResponse> responseData = userService.getAllUsers(pageable);

        ApiResponse<PaginatedResponse<UserResponse>> response = ApiResponse
                .<PaginatedResponse<UserResponse>>builder()
                .message("Users fetched successfully")
                .statusCode(HttpStatus.OK.value())
                .success(true)
                .data(responseData)
                .build();

        return ResponseEntity.ok(response);
    }

    // -------------------- VERIFY EMAIL --------------------
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<LoginResponse>> verifyEmail(@RequestParam String email,@RequestParam String code) {

        LoginResponse responseData = userService.verifyEmail(email, code);

        ApiResponse<LoginResponse> response = ApiResponse.<LoginResponse>builder()
                .message("Email verified successfully")
                .statusCode(HttpStatus.OK.value())
                .success(true)
                .data(responseData)
                .build();

        return ResponseEntity.ok(response);
    }

    // -------------------- RESEND VERIFICATION CODE --------------------
    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerification(@RequestParam String email) {

        userService.resendVerificationCode(email);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("Verification code sent successfully")
                .statusCode(HttpStatus.OK.value())
                .success(true)
                .build();

        return ResponseEntity.ok(response);
    }

    // -------------------- UPDATE PROFILE --------------------
    @PutMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(@PathVariable UUID id,@RequestBody @Valid ProfileRequest request) {

        ProfileResponse responseData = userService.updateProfile(id, request);

        ApiResponse<ProfileResponse> response = ApiResponse.<ProfileResponse>builder()
                .message("Profile updated successfully")
                .statusCode(HttpStatus.OK.value())
                .success(true)
                .data(responseData)
                .build();

        return ResponseEntity.ok(response);
    }

    // -------------------- DELETE USER --------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {

        userService.deleteUser(id);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("User deleted successfully")
                .statusCode(HttpStatus.OK.value())
                .success(true)
                .build();

        return ResponseEntity.ok(response);
    }
}