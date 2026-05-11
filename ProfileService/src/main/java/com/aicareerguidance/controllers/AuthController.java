package com.aicareerguidance.controllers;

import com.aicareerguidance.dtos.ApiResponse;
import com.aicareerguidance.dtos.LoginRequest;
import com.aicareerguidance.dtos.LoginResponse;
import com.aicareerguidance.dtos.PasswordResetRequest;
import com.aicareerguidance.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // -------------------- LOGIN --------------------
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody @Valid LoginRequest request) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.<LoginResponse>builder()
                        .message("Login successful")
                        .statusCode(HttpStatus.OK.value())
                        .success(true)
                        .data(response)
                        .build()
        );
    }

    // -------------------- FORGOT PASSWORD (SEND OTP) --------------------
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestParam String email) {

        authService.forgotPassword(email);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("Verification code sent to email")
                        .statusCode(HttpStatus.OK.value())
                        .success(true)
                        .build()
        );
    }

    // -------------------- RESET PASSWORD (VERIFY OTP + SET NEW PASSWORD) --------------------
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody @Valid PasswordResetRequest request) {

        authService.resetPassword(request);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("Password reset successful")
                        .statusCode(HttpStatus.OK.value())
                        .success(true)
                        .build()
        );
    }

    // -------------------- REFRESH TOKEN --------------------
    @PostMapping("/refresh-tokens")
    public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(@RequestParam String refreshToken) {

        LoginResponse response = authService.refreshToken(refreshToken);

        return ResponseEntity.ok(
                ApiResponse.<LoginResponse>builder()
                        .message("Token refreshed successfully")
                        .statusCode(HttpStatus.OK.value())
                        .success(true)
                        .data(response)
                        .build()
        );
    }
}