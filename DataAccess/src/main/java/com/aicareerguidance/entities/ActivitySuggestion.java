package com.aicareerguidance.entities;

import com.aicareerguidance.enums.ActivityType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

  @Entity
  @Table(name = "activity_suggestions")
  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public class ActivitySuggestion extends BaseEntity {

      @Column(nullable = false)
      private String label;

      @Column(nullable = false)
      private String date;

      @Enumerated(EnumType.STRING)
      @Column(nullable = false)
      private ActivityType type;

      @ManyToOne(fetch = FetchType.LAZY)
      @JoinColumn(name = "analysis_id", nullable = false)
      @JsonIgnore
      @ToString.Exclude
      private AIAnalysis analysis;
  }
