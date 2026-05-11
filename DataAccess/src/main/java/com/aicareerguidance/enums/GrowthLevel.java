package com.aicareerguidance.enums;

  import com.fasterxml.jackson.annotation.JsonCreator;
  import com.fasterxml.jackson.annotation.JsonValue;

  public enum GrowthLevel {
      HIGH, MEDIUM, LOW;

      @JsonValue
      public String toJson() {
          return name().charAt(0) +
  name().substring(1).toLowerCase();
      }

      @JsonCreator
      public static GrowthLevel fromJson(String value) {
          return valueOf(value.toUpperCase());
      }
  }
