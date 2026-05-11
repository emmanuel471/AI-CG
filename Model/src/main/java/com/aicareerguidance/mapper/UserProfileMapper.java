package com.aicareerguidance.mapper;

import com.aicareerguidance.dtos.UserProfileResponse;
import com.aicareerguidance.entities.Profile;
import com.aicareerguidance.entities.User;
import org.springframework.stereotype.Component;

@Component
public class UserProfileMapper {

    private final UserMapper userMapper;
    private final ProfileMapper profileMapper;

    public UserProfileMapper(UserMapper userMapper, ProfileMapper profileMapper) {
        this.userMapper = userMapper;
        this.profileMapper = profileMapper;
    }

    public UserProfileResponse toResponse(User user, Profile profile) {

        UserProfileResponse res = new UserProfileResponse();

        res.setUser(userMapper.toResponse(user));
        res.setProfile(profileMapper.toResponse(profile));

        return res;
    }
}
