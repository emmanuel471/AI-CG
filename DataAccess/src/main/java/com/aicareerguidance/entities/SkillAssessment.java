package com.aicareerguidance.entities;

import com.aicareerguidance.enums.SkillCategory;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skill_assessments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillAssessment extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillCategory category;

    @Column(nullable = false)
    private int level;

    @Column
    private Integer required;

    @Column
    private boolean trending;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private AIAnalysis analysis;
  }

