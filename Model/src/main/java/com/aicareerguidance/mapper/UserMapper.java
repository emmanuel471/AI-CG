package com.aicareerguidance.mapper;

import com.aicareerguidance.dtos.RegisterRequest;
import com.aicareerguidance.dtos.UserResponse;
import com.aicareerguidance.entities.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(RegisterRequest request) {
        if (request == null) return null;

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setEmailVerified(false);

        return user;
    }

    public UserResponse toResponse(User user) {
        if (user == null) return null;

        UserResponse res = new UserResponse();
        res.setId(user.getId().toString());
        res.setFirstName(user.getFirstName());
        res.setLastName(user.getLastName());
        res.setEmail(user.getEmail());
        res.setEmailVerified(user.isEmailVerified());
        res.setVerifiedAt(user.getVerifiedAt());

        return res;
    }
}