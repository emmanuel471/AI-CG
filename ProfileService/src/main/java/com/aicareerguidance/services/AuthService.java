package com.aicareerguidance.services;

import com.aicareerguidance.dtos.LoginRequest;
import com.aicareerguidance.dtos.LoginResponse;
import com.aicareerguidance.dtos.PasswordResetRequest;

public interface AuthService {
    void forgotPassword(String email);
    void resetPassword(PasswordResetRequest request);
    LoginResponse login(LoginRequest dto);
    LoginResponse refreshToken(String refreshToken);
}