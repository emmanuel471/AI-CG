package com.aicareerguidance.dtos;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisMeta {
    
    private String generatedAt;       
    private AIAnalysisRequest profileSnapshot;
    private String modelVersion;
}