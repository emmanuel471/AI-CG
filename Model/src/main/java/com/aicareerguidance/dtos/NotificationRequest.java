package com.aicareerguidance.dtos;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

@Getter
@Setter
@Component
public class NotificationRequest {
    
    private String[] to;
    @NotNull
    private String templateID;
    private String notificationType;
    private Map<String, Object> model;
}