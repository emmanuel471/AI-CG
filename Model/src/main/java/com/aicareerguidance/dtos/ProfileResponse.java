package com.aicareerguidance.dtos;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {

    private List<String> skills;
    private List<String> interests;
    private String education;
    private String profilePicture;
}