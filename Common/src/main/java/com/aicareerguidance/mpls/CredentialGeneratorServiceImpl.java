package com.aicareerguidance.mpls;

import org.springframework.stereotype.Service;

import com.aicareerguidance.services.CredentialGeneratorService;

import java.security.SecureRandom;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CredentialGeneratorServiceImpl implements CredentialGeneratorService {

    private static final SecureRandom random = new SecureRandom();

    @Override
    public String generateVerificationCode() {
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    @Override
    public String generateTempPassword() {
        String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lower = "abcdefghijklmnopqrstuvwxyz";
        String digits = "0123456789";
        String special = "@$!%*?&";
        String allChars = upper + lower + digits + special;

        StringBuilder sb = new StringBuilder(12);
        sb.append(upper.charAt((int) (Math.random() * upper.length())));
        sb.append(lower.charAt((int) (Math.random() * lower.length())));
        sb.append(digits.charAt((int) (Math.random() * digits.length())));
        sb.append(special.charAt((int) (Math.random() * special.length())));

        for (int i = 4; i < 12; i++) {
            sb.append(allChars.charAt((int) (Math.random() * allChars.length())));
        }

        List<Character> chars = sb.chars().mapToObj(c -> (char) c).collect(Collectors.toList());
        Collections.shuffle(chars);

        return chars.stream().map(String::valueOf).collect(Collectors.joining());
    }

    @Override
    public String generateOTP(int length) {
        String digits = "0123456789";
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(digits.charAt((int) (Math.random() * digits.length())));
        }
        return sb.toString();
    }
}
