package com.aicareerguidance.dtos;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Skill {
    private String id;
    private String name;
    private String category;
    private int level;
    private Integer required;
    private boolean trending;
}
