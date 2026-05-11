package com.aicareerguidance.enums;

  import com.fasterxml.jackson.annotation.JsonCreator;
  import com.fasterxml.jackson.annotation.JsonValue;

  public enum ActivityType {
      COURSE, ASSESSMENT, MILESTONE;

      @JsonValue
      public String toJson() {
          return name().toLowerCase();
      }

      @JsonCreator
      public static ActivityType fromJson(String value) {
          return valueOf(value.toUpperCase());
      }
  }