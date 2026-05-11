package com.aicareerguidance.services;

import java.io.IOException;
import com.aicareerguidance.dtos.NotificationRequest;

public interface NotificationService {
   void postEmail(NotificationRequest notificationRequest) throws IOException;
}
