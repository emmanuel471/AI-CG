package com.aicareerguidance.services;

import com.aicareerguidance.dtos.AIAnalysisResponse;

public interface AIAnalysisService {

    AIAnalysisResponse getLatestAnalysis(String userId);

    void generateAnalysis(String userId);

    boolean isAnalysisStale(String userId);
}
