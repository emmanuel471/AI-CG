package com.aicareerguidance.entities;

import java.util.UUID;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class Notification{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    private String templateID;

    @NotNull
    private String fromAddress;
    private String ccAddresses;
    @NotNull
    private String subject;
    private String templateFileName;
    private String templatesLocation;
}