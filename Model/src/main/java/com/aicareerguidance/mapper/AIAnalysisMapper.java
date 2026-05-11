package com.aicareerguidance.mapper;

import com.aicareerguidance.dtos.*;
import com.aicareerguidance.entities.AIAnalysis;
import com.aicareerguidance.entities.ActivitySuggestion;
import com.aicareerguidance.entities.CareerRecommendation;
import com.aicareerguidance.entities.SkillAssessment;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class AIAnalysisMapper {

    public AIAnalysisResponse toResponse(AIAnalysis analysis) {
        if (analysis == null) return null;

        Map<String, Skill> skillById = analysis.getSkills().stream()
                .map(this::toSkill)
                .collect(Collectors.toMap(Skill::getId, Function.identity()));

        return AIAnalysisResponse.builder()
                .id(analysis.getId().toString())
                .userId(analysis.getUserId())
                .careers(analysis.getCareers().stream().map(c -> toCareer(c, skillById)).toList())
                .skills(List.copyOf(skillById.values()))
                .activity(analysis.getActivities().stream().map(this::toActivityItem).toList())
                .meta(toMeta(analysis))
                .build();
    }

    public Career toCareer(CareerRecommendation entity, Map<String, Skill> skillById) {
        if (entity == null) return null;

        List<Skill> resolvedSkills = entity.getSkills() == null ? List.of() :
                entity.getSkills().stream()
                        .map(skillById::get)
                        .filter(s -> s != null)
                        .toList();

        return Career.builder()
                .id(entity.getId().toString())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .confidence(entity.getConfidence())
                .salaryRange(entity.getSalaryRange())
                .growth(entity.getGrowth().name())
                .demand(entity.getDemand())
                .skills(resolvedSkills)
                .tags(entity.getTags())
                .build();
    }

    public Skill toSkill(SkillAssessment entity) {
        if (entity == null) return null;

        return Skill.builder()
                .id(entity.getId().toString())
                .name(entity.getName())
                .category(entity.getCategory().name())
                .level(entity.getLevel())
                .required(entity.getRequired())
                .trending(entity.isTrending())
                .build();
    }

    public ActivityItem toActivityItem(ActivitySuggestion entity) {
        if (entity == null) return null;

        return ActivityItem.builder()
                .id(entity.getId().toString())
                .label(entity.getLabel())
                .date(entity.getDate())
                .type(entity.getType().name())
                .build();
    }

    private AIAnalysisMeta toMeta(AIAnalysis analysis) {
        return AIAnalysisMeta.builder()
                .generatedAt(analysis.getGeneratedAt().toString())
                .modelVersion(analysis.getModelVersion())
                .profileSnapshot(AIAnalysisRequest.builder()
                        .skills(analysis.getProfileSkills())
                        .interests(analysis.getProfileInterests())
                        .education(analysis.getProfileEducation())
                        .build())
                .build();
    }

    public List<Skill> toSkills(List<SkillAssessment> entities) {
        if (entities == null) return List.of();
        return entities.stream().map(this::toSkill).toList();
    }

    public List<ActivityItem> toActivityItems(List<ActivitySuggestion> entities) {
        if (entities == null) return List.of();
        return entities.stream().map(this::toActivityItem).toList();
    }
}
