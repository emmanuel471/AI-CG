package com.aicareerguidance.enums;

  import com.fasterxml.jackson.annotation.JsonCreator;
  import com.fasterxml.jackson.annotation.JsonValue;

  public enum SkillCategory {
      TECHNICAL, SOFT, DOMAIN, TOOL;

      @JsonValue
      public String toJson() {
          return name().charAt(0) +
  name().substring(1).toLowerCase();
      }

      @JsonCreator
      public static SkillCategory fromJson(String value) {
          return valueOf(value.toUpperCase());
      }
  }