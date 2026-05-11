package com.aicareerguidance.impls;

import com.anthropic.client.AnthropicClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.aicareerguidance.dtos.AIAnalysisResponse;
import com.aicareerguidance.dtos.ActivityItem;
import com.aicareerguidance.dtos.Skill;
import com.aicareerguidance.entities.AIAnalysis;
import com.aicareerguidance.entities.ActivitySuggestion;
import com.aicareerguidance.entities.CareerRecommendation;
import com.aicareerguidance.entities.Profile;
import com.aicareerguidance.entities.SkillAssessment;
import com.aicareerguidance.entities.User;
import com.aicareerguidance.enums.ActivityType;
import com.aicareerguidance.enums.GrowthLevel;
import com.aicareerguidance.enums.SkillCategory;
import com.aicareerguidance.exeption.NotFoundException;
import com.aicareerguidance.mapper.AIAnalysisMapper;
import com.aicareerguidance.repositories.AIAnalysisRepository;
import com.aicareerguidance.repositories.ProfileRepository;
import com.aicareerguidance.repositories.UserRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIAnalysisServiceImpl implements com.aicareerguidance.services.AIAnalysisService {

    private final AIAnalysisRepository aiAnalysisRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final AIAnalysisMapper aiAnalysisMapper;
    private final AnthropicClient anthropicClient;
    private final ObjectMapper objectMapper;

    @Value("${ai.analysis.stale-after-days}")
    private int staleAfterDays;

    @Value("${ai.analysis.model-version}")
    private String modelVersion;

    // Stable system prompt — cached by Anthropic across requests.
    // Must exceed 2048 tokens on Sonnet 4.6 to activate cache. Expand this prompt
    // with additional domain knowledge and examples as the product matures.
    private static final String SYSTEM_PROMPT = """
            You are an expert career guidance AI. Your role is to analyze a user's educational background,
            existing skills, and stated interests and produce a structured, actionable career guidance report.

            RESPONSE FORMAT — STRICT
            Return ONLY a valid JSON object. No markdown code fences, no preamble, no trailing text.
            The JSON must be parseable directly by a JSON parser without any pre-processing.

            The JSON must match exactly this structure:

            {
              "careers": [
                {
                  "id": "c1",
                  "title": "Career Title",
                  "description": "1-2 sentences describing this career path and specifically why it fits the user's profile.",
                  "confidence": 85,
                  "salaryRange": "R900k - R1.4M",
                  "growth": "HIGH",
                  "demand": 78,
                  "skills": ["s1", "s3", "s6"],
                  "tags": ["Technology", "Data", "Leadership"]
                }
              ],
              "skills": [
                {
                  "id": "s1",
                  "name": "Python",
                  "category": "TECHNICAL",
                  "level": 65,
                  "required": 80,
                  "trending": true
                }
              ],
              "activity": [
                {
                  "id": "a1",
                  "label": "Complete: Machine Learning Specialization on Coursera",
                  "date": "Suggested for next 2 weeks",
                  "type": "COURSE"
                }
              ]
            }

            FIELD DEFINITIONS

            careers[].id — Sequential string IDs: c1, c2, c3...
            careers[].confidence — Integer 0-100. How well this career matches the full user profile.
            careers[].salaryRange — Realistic range for an entry-to-mid level in this career in South African Rand, e.g. "R400k - R800k".
            careers[].growth — Must be exactly one of: HIGH, MEDIUM, LOW (uppercase only).
            careers[].demand — Integer 0-100. Current market demand score for this career globally.
            careers[].skills — Array of skill IDs. MUST reference only IDs defined in the "skills" array.
            careers[].tags — 2-4 short labels categorizing this career, e.g. ["AI", "Strategy", "Product"].

            skills[].id — Sequential string IDs: s1, s2, s3... Generated FIRST before careers.
            skills[].category — Must be exactly one of: TECHNICAL, SOFT, DOMAIN, TOOL (uppercase only).
            skills[].level — Integer 0-100. AI-inferred current proficiency based on the full profile context.
              A user with "BSc Computer Science" and "Data Science" interests should be assessed at ~60/100
              for Python even without explicitly listing their level. Use the full profile holistically.
            skills[].required — Integer 0-100. Proficiency level needed for the highest-confidence career.
              Use null when the skill is not specifically required for any top career.
            skills[].trending — Boolean. true only for skills with genuine, sustained current market demand.

            activity[].id — Sequential string IDs: a1, a2, a3...
            activity[].label — Specific and actionable, e.g. "Build: End-to-end ML pipeline project on GitHub"
              or "Assess: Take the Google Data Analytics Certificate exam".
            activity[].date — Relative time string, e.g. "Suggested for this week", "Within next month".
            activity[].type — Must be exactly one of: COURSE, ASSESSMENT, MILESTONE (uppercase only).

            GENERATION RULES

            1. Generate "skills" FIRST. Use sequential IDs s1, s2, s3...
            2. Generate 8-12 skills. Cover both skills the user already has AND key skills needed for top careers.
            3. Generate 4-6 career recommendations ordered by confidence score (highest first).
            4. Career "skills" arrays MUST reference ONLY IDs present in your "skills" array.
               This cross-reference is validated programmatically — a broken reference causes the whole
               analysis to be rejected. Double-check every skill ID in every career.
            5. Generate 4-6 activity suggestions forming a coherent, ordered learning path.
               Activities should bridge the biggest gaps between current skill levels and required levels.
            6. Salary ranges must be in South African Rand (ZAR), e.g. "R350k - R700k". Reflect realistic South African market rates, not aspirational ones.
            7. "confidence" and "demand" scores should reflect honest, differentiated assessments —
               avoid clustering all careers near 80. Spread them across a meaningful range.
            8. "level" vs "required" gap is what drives the Skills Gap page. Make these numbers
               meaningful — if level=35 and required=80, the user has significant work to do.
            9. Base all assessments on the profile provided. Do not inject information not present.
            """;

    // ------------------------------------------------------------------ public API

    @Override
    @Transactional(readOnly = true)
    public AIAnalysisResponse getLatestAnalysis(String userId) {
        AIAnalysis analysis = aiAnalysisRepository
                .findTopByUserIdOrderByGeneratedAtDesc(userId)
                .orElseThrow(() -> new NotFoundException("No analysis found for user: " + userId));
        return aiAnalysisMapper.toResponse(analysis);
    }

    @Override
    @Transactional
    public void generateAnalysis(String userId) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));
        Profile profile = profileRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new NotFoundException("Profile not found for user: " + userId));

        if (isEmpty(profile.getSkills()) && isEmpty(profile.getInterests()) && profile.getEducation() == null) {
            throw new IllegalStateException("User profile is empty — cannot generate analysis for user: " + userId);
        }

        log.info("Generating AI analysis for user {}", userId);
        RawAnalysis raw = callClaude(profile);
        validate(raw);

        // Delete previous analysis (CASCADE ALL removes children automatically)
        aiAnalysisRepository.deleteByUserId(userId);
        aiAnalysisRepository.flush();

        persist(userId, profile, raw);
        log.info("AI analysis persisted for user {}", userId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isAnalysisStale(String userId) {
        return aiAnalysisRepository
                .findTopByUserIdOrderByGeneratedAtDesc(userId)
                .map(a -> a.getGeneratedAt().isBefore(LocalDateTime.now().minusDays(staleAfterDays)))
                .orElse(true);
    }

    // ------------------------------------------------------------------ Claude API

    private RawAnalysis callClaude(Profile profile) {
        String userMessage = buildUserMessage(profile);

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.of(modelVersion))
                .maxTokens(4096L)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text(SYSTEM_PROMPT)
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage(userMessage)
                .build();

        Message response = anthropicClient.messages().create(params);

        String responseText = response.content().stream()
                .flatMap(block -> block.text().stream())
                .map(com.anthropic.models.messages.TextBlock::text)
                .collect(Collectors.joining());

        log.debug("Claude raw response: {}", responseText);

        String json = responseText.strip();
        if (json.startsWith("```")) {
            json = json.replaceFirst("```[a-zA-Z]*\\n?", "");
            int end = json.lastIndexOf("```");
            if (end != -1) json = json.substring(0, end);
            json = json.strip();
        }

        try {
            return objectMapper.readValue(json, RawAnalysis.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Claude response as JSON: " + e.getMessage(), e);
        }
    }

    private String buildUserMessage(Profile profile) {
        String skills = isEmpty(profile.getSkills()) ? "Not specified" : String.join(", ", profile.getSkills());
        String interests = isEmpty(profile.getInterests()) ? "Not specified" : String.join(", ", profile.getInterests());
        String education = profile.getEducation() != null ? profile.getEducation() : "Not specified";

        return String.format("""
                Analyze this user profile and return career guidance as JSON:

                Education: %s
                Skills: %s
                Interests: %s
                """, education, skills, interests);
    }

    // ------------------------------------------------------------------ validation

    private void validate(RawAnalysis raw) {
        if (isEmpty(raw.careers())) throw new IllegalStateException("AI response missing careers");
        if (isEmpty(raw.skills())) throw new IllegalStateException("AI response missing skills");
        if (isEmpty(raw.activity())) throw new IllegalStateException("AI response missing activity");

        Set<String> skillIds = raw.skills().stream()
                .map(Skill::getId)
                .collect(Collectors.toSet());

        for (RawCareer career : raw.careers()) {
            if (career.title() == null || career.title().isBlank())
                throw new IllegalStateException("Career missing title");
            if (career.description() == null || career.description().isBlank())
                throw new IllegalStateException("Career '" + career.title() + "' missing description");
            if (career.growth() == null)
                throw new IllegalStateException("Career '" + career.title() + "' missing growth");

            if (career.skills() != null) {
                for (String ref : career.skills()) {
                    if (!skillIds.contains(ref))
                        throw new IllegalStateException("Career '" + career.title() + "' references unknown skill ID: " + ref);
                }
            }
        }

        for (Skill skill : raw.skills()) {
            if (skill.getName() == null || skill.getName().isBlank())
                throw new IllegalStateException("Skill missing name");
        }
    }

    // ------------------------------------------------------------------ persistence

    private void persist(String userId, Profile profile, RawAnalysis raw) {
        // Build root entity
        AIAnalysis analysis = AIAnalysis.builder()
                .userId(userId)
                .generatedAt(LocalDateTime.now())
                .modelVersion(modelVersion)
                .profileEducation(profile.getEducation())
                .profileSkills(profile.getSkills() != null ? profile.getSkills() : List.of())
                .profileInterests(profile.getInterests() != null ? profile.getInterests() : List.of())
                .careers(new ArrayList<>())
                .skills(new ArrayList<>())
                .activities(new ArrayList<>())
                .build();

        // Add skills to the collection — JPA @OrderColumn assigns position by list index.
        // We keep a parallel list so we can map raw AI ids → entity objects after the flush.
        List<SkillAssessment> skillEntities = new ArrayList<>();
        for (Skill rawSkill : raw.skills()) {
            SkillAssessment entity = SkillAssessment.builder()
                    .name(rawSkill.getName())
                    .category(parseSkillCategory(rawSkill.getCategory()))
                    .level(rawSkill.getLevel())
                    .required(rawSkill.getRequired())
                    .trending(rawSkill.isTrending())
                    .analysis(analysis)
                    .build();
            analysis.getSkills().add(entity);
            skillEntities.add(entity);
        }

        // First save: persist analysis + skills. Hibernate assigns UUIDs to skill entities
        // in memory before the INSERT, so entity.getId() is populated after this call.
        aiAnalysisRepository.saveAndFlush(analysis);

        // Build AI skill id → persisted UUID map using the now-populated entity ids
        Map<String, String> skillIdMap = new HashMap<>();
        for (int i = 0; i < raw.skills().size(); i++) {
            skillIdMap.put(raw.skills().get(i).getId(), skillEntities.get(i).getId().toString());
        }

        // Add careers with resolved skill references
        for (RawCareer rawCareer : raw.careers()) {
            List<String> resolvedSkills = rawCareer.skills() == null ? List.of() :
                    rawCareer.skills().stream()
                            .map(aiId -> skillIdMap.getOrDefault(aiId, aiId))
                            .toList();

            CareerRecommendation career = CareerRecommendation.builder()
                    .title(rawCareer.title())
                    .description(rawCareer.description())
                    .confidence(rawCareer.confidence())
                    .salaryRange(rawCareer.salaryRange())
                    .growth(parseGrowthLevel(rawCareer.growth()))
                    .demand(rawCareer.demand())
                    .skills(resolvedSkills)
                    .tags(rawCareer.tags() != null ? rawCareer.tags() : List.of())
                    .analysis(analysis)
                    .build();
            analysis.getCareers().add(career);
        }

        // Add activities
        for (ActivityItem rawActivity : raw.activity()) {
            ActivitySuggestion activity = ActivitySuggestion.builder()
                    .label(rawActivity.getLabel())
                    .date(rawActivity.getDate())
                    .type(parseActivityType(rawActivity.getType()))
                    .analysis(analysis)
                    .build();
            analysis.getActivities().add(activity);
        }

        // Second save: persists careers and activities via cascade
        aiAnalysisRepository.save(analysis);
    }

    // ------------------------------------------------------------------ enum parsers

    private SkillCategory parseSkillCategory(String value) {
        try {
            return SkillCategory.valueOf(value.toUpperCase());
        } catch (Exception e) {
            log.warn("Unknown skill category '{}', defaulting to TECHNICAL", value);
            return SkillCategory.TECHNICAL;
        }
    }

    private GrowthLevel parseGrowthLevel(String value) {
        try {
            return GrowthLevel.valueOf(value.toUpperCase());
        } catch (Exception e) {
            log.warn("Unknown growth level '{}', defaulting to MEDIUM", value);
            return GrowthLevel.MEDIUM;
        }
    }

    private ActivityType parseActivityType(String value) {
        try {
            return ActivityType.valueOf(value.toUpperCase());
        } catch (Exception e) {
            log.warn("Unknown activity type '{}', defaulting to COURSE", value);
            return ActivityType.COURSE;
        }
    }

    // ------------------------------------------------------------------ helpers

    private boolean isEmpty(List<?> list) {
        return list == null || list.isEmpty();
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record RawCareer(
            String id, String title, String description,
            int confidence, String salaryRange, String growth, int demand,
            List<String> skills, List<String> tags
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    record RawAnalysis(List<RawCareer> careers, List<Skill> skills, List<ActivityItem> activity) {}
}
