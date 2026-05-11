package com.aicareerguidance.dtos;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityItem {
    private String id;
    private String label;
    private String date;
    private String type;
}