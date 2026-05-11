package com.aicareerguidance.dtos;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisResponse {
    private String id;
    private String userId;
    private List<Career> careers;
    private List<Skill> skills;
    private List<ActivityItem> activity;
    private AIAnalysisMeta meta;
  }
