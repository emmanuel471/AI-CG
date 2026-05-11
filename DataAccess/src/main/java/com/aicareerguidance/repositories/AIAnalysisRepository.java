package com.aicareerguidance.repositories;

import com.aicareerguidance.entities.AIAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AIAnalysisRepository extends JpaRepository<AIAnalysis, UUID> {

    Optional<AIAnalysis> findTopByUserIdOrderByGeneratedAtDesc(String userId);

    List<AIAnalysis> findByUserId(String userId);

    boolean existsByUserId(String userId);

    void deleteByUserId(String userId);

    List<AIAnalysis> findByGeneratedAtBefore(LocalDateTime cutoff);
}
