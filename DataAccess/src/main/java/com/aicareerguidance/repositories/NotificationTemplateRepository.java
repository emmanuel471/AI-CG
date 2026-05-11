package com.aicareerguidance.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aicareerguidance.entities.Notification;

public interface NotificationTemplateRepository extends JpaRepository<Notification, UUID> {
    Notification findByTemplateID(String templateId); 
}
