package com.aicareerguidance.controllers;

import com.aicareerguidance.dtos.AIAnalysisResponse;
import com.aicareerguidance.dtos.ApiResponse;
import com.aicareerguidance.services.AIAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class AIAnalysisController {

    private final AIAnalysisService aiAnalysisService;

    // -------------------- GET LATEST ANALYSIS --------------------
    @GetMapping("/{userId}/analysis")
    public ResponseEntity<ApiResponse<AIAnalysisResponse>> getAnalysis(@PathVariable UUID userId) {

        AIAnalysisResponse responseData = aiAnalysisService.getLatestAnalysis(userId.toString());

        ApiResponse<AIAnalysisResponse> response = ApiResponse.<AIAnalysisResponse>builder()
                .message("Analysis fetched successfully")
                .statusCode(HttpStatus.OK.value())
                .success(true)
                .data(responseData)
                .build();

        return ResponseEntity.ok(response);
    }

    // -------------------- TRIGGER ON-DEMAND ANALYSIS --------------------
    @PostMapping("/{userId}/analysis/trigger")
    public ResponseEntity<ApiResponse<Void>> triggerAnalysis(@PathVariable UUID userId) {

        aiAnalysisService.generateAnalysis(userId.toString());

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("Analysis generation started")
                .statusCode(HttpStatus.ACCEPTED.value())
                .success(true)
                .build();

        return ResponseEntity.accepted().body(response);
    }
}
