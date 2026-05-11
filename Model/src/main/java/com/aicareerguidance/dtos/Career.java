package com.aicareerguidance.dtos;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Career {
    private String id;
    private String title;
    private String description;
    private int confidence;
    private String salaryRange;
    private String growth; 
    private int demand;
    private List<Skill> skills;
    private List<String> tags;
  }

