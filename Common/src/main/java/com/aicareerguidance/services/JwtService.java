package com.aicareerguidance.services;

import com.aicareerguidance.entities.User;
public interface JwtService {

    String generateAccessToken(User user);
    String generateRefreshToken(User user);
    String generateIdToken(User user);
    boolean isAccessTokenValid(String token, User user);
    boolean isRefreshTokenValid(String token, User user);
    boolean isIdTokenValid(String token, User user);
    String extractUsername(String token);
    String extractRole(String token);
}
