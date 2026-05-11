package com.aicareerguidance.dtos;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CareerResponse {

    private String id;

    private String careerName;

    private List<String> requiredSkills;
}
