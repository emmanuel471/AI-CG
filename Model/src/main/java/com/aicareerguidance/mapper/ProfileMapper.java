package com.aicareerguidance.mapper;

import com.aicareerguidance.dtos.ProfileRequest;
import com.aicareerguidance.dtos.ProfileResponse;
import com.aicareerguidance.entities.Profile;
import com.aicareerguidance.entities.User;
import com.aicareerguidance.services.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProfileMapper {

    private final S3Service s3Service;

    public Profile toEntity(ProfileRequest request, User user) {
        if (request == null) return null;

        Profile profile = new Profile();
        profile.setUser(user);
        profile.setSkills(request.getSkills());
        profile.setInterests(request.getInterests());
        profile.setEducation(request.getEducation());

        return profile;
    }

    public ProfileResponse toResponse(Profile profile) {
        if (profile == null) return null;

        ProfileResponse res = new ProfileResponse();
        res.setSkills(profile.getSkills());
        res.setInterests(profile.getInterests());
        res.setEducation(profile.getEducation());

        if (profile.getUser() != null && profile.getProfilePicture() != null) {
            String signedUrl = s3Service.generateSignedUrl(
                    profile.getProfilePicture(),
                    24
            );
            res.setProfilePicture(signedUrl);
        } else {
            res.setProfilePicture(null);
        }

        return res;
    }
}