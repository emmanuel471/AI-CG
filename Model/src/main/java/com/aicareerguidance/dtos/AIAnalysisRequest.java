package com.aicareerguidance.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import java.util.List;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public class AIAnalysisRequest {

      @NotEmpty(message = "Skills list must not be empty")
      private List<String> skills;

      @NotEmpty(message = "Interests list must not be empty")
      private List<String> interests;

      @NotBlank(message = "Education must not be blank")
      private String education;
  }