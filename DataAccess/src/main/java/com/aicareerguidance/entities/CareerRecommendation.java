package com.aicareerguidance.entities;

import com.aicareerguidance.enums.GrowthLevel;
import com.aicareerguidance.enums.StringListConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

  @Entity
  @Table(name = "career_recommendations")
  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public class CareerRecommendation extends BaseEntity {

      @Column(nullable = false)
      private String title;

      @Column(columnDefinition = "TEXT", nullable = false)
      private String description;

      // AI-confidence match percentage (0–100)
      @Column(nullable = false)
      private int confidence;

      @Column(name = "salary_range")
      private String salaryRange;

      @Enumerated(EnumType.STRING)
      @Column(nullable = false)
      private GrowthLevel growth;

      // Market demand score (0–100)
      @Column(nullable = false)
      private int demand;

      @Column(columnDefinition = "TEXT")
      @Convert(converter = StringListConverter.class)
      private List<String> skills = new ArrayList<>();

      @Column(columnDefinition = "TEXT")
      @Convert(converter = StringListConverter.class)
      private List<String> tags = new ArrayList<>();

      @ManyToOne(fetch = FetchType.LAZY)
      @JoinColumn(name = "analysis_id", nullable = false)
      @JsonIgnore
      @ToString.Exclude
      private AIAnalysis analysis;
  }
