package com.aicareerguidance.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private UserResponse user;
    private ProfileResponse profile;
}