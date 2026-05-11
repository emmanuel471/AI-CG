package com.aicareerguidance.jobs;

import com.aicareerguidance.entities.User;
import com.aicareerguidance.repositories.UserRepository;
import com.aicareerguidance.services.AIAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AIAnalysisCronJob {

    private final AIAnalysisService aiAnalysisService;
    private final UserRepository userRepository;

    @Scheduled(cron = "${ai.analysis.cron}")
    public void runScheduledAnalysis() {
        log.info("Starting scheduled AI career analysis job");
        List<User> users = userRepository.findAll();
        int processed = 0, skipped = 0, failed = 0;

        for (User user : users) {
            if (!user.isEmailVerified()) {
                skipped++;
                continue;
            }
            String userId = user.getId().toString();
            try {
                if (aiAnalysisService.isAnalysisStale(userId)) {
                    aiAnalysisService.generateAnalysis(userId);
                    processed++;
                } else {
                    skipped++;
                }
            } catch (Exception e) {
                log.error("Failed to generate analysis for user {}: {}", userId, e.getMessage());
                failed++;
            }
        }
        log.info("Scheduled AI analysis complete — processed: {}, skipped: {}, failed: {}", processed, skipped, failed);
    }
}
