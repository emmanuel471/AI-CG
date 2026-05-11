package com.aicareerguidance.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileRequest {

    @NotEmpty(message = "Skills cannot be empty")
    private List<String> skills;

    @NotEmpty(message = "Interests cannot be empty")
    private List<String> interests;

    @NotBlank(message = "Education is required")
    private String education;
}
