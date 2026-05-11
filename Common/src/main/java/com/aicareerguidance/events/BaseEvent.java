package com.aicareerguidance.events;

import lombok.Data;
import java.io.Serializable;
import java.util.Map;

@Data
public class BaseEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    private String eventType;
    private long timestamp;
    private Map<String, String> data;
    private String templateID; 

    public BaseEvent() { }

    public BaseEvent(String eventType, Map<String, String> data, String templateID) {
        this.eventType = eventType;
        this.timestamp = System.currentTimeMillis();
        this.data = data;
        this.templateID = templateID;
    }
}