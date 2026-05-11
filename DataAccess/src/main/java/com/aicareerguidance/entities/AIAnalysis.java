package com.aicareerguidance.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.aicareerguidance.enums.StringListConverter;

  @Entity
  @Table(name = "ai_analyses")
  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public class AIAnalysis extends BaseEntity{

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    @Column(name = "model_version")
    private String modelVersion;

    @Column(name = "profile_education")
    private String profileEducation;

    @Column(name = "profile_skills", columnDefinition ="TEXT")
    @Convert(converter = StringListConverter.class)
    private List<String> profileSkills = new ArrayList<>();

    @Column(name = "profile_interests", columnDefinition ="TEXT")
    @Convert(converter = StringListConverter.class)
    private List<String> profileInterests = new ArrayList<>();

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderColumn(name = "position")
    private List<CareerRecommendation> careers = new ArrayList<>();

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderColumn(name = "position")
    private List<SkillAssessment> skills = new ArrayList<>();

    @OneToMany(mappedBy = "analysis", cascade =
    CascadeType.ALL, orphanRemoval = true)
    @OrderColumn(name = "position")
    private List<ActivitySuggestion> activities = new ArrayList<>();
  }