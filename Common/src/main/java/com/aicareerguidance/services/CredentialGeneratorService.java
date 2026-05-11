package com.aicareerguidance.services;

public interface CredentialGeneratorService {

    String generateTempPassword();
    String generateOTP(int length);
    String generateVerificationCode();
}