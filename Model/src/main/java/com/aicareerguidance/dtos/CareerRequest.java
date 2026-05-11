package com.aicareerguidance.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CareerRequest {

    @NotBlank(message = "Career name is required")
    private String careerName;

    @NotEmpty(message = "Required skills cannot be empty")
    private List<String> requiredSkills;
}
