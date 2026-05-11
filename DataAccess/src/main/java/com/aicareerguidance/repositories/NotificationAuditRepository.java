package com.aicareerguidance.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aicareerguidance.entities.NotificationAudit;


public interface NotificationAuditRepository extends JpaRepository<NotificationAudit, UUID> {
}
