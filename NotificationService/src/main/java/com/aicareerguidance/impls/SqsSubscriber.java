package com.aicareerguidance.impls;

import com.aicareerguidance.dtos.NotificationRequest;
import com.aicareerguidance.events.BaseEvent;
import com.aicareerguidance.services.NotificationService;
import io.awspring.cloud.sqs.annotation.SqsListener;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class SqsSubscriber {

    private final NotificationService notificationService;

    public SqsSubscriber(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @SqsListener("${aws.sqs.queue.user-notification-events}")
    public void receiveMessage(BaseEvent event) {
        try {
            log.info("Received event: {}", event.getEventType());

            Map<String, Object> model = new HashMap<>();
            if (event.getData() != null) {
                model.putAll(event.getData());
            }

            if (event.getData() != null && event.getData().containsKey("email")) {
                String[] to = new String[]{event.getData().get("email")};
                String templateID = event.getTemplateID() != null ? event.getTemplateID() : event.getEventType();

                NotificationRequest request = new NotificationRequest();
                request.setTo(to);
                request.setTemplateID(templateID);
                request.setModel(model);
                request.setNotificationType("email");

                notificationService.postEmail(request);
                log.info("User notification sent for event {} to {}", event.getEventType(), to[0]);
            }

        } catch (Exception e) {
            log.error("Failed to process event {}", event.getEventType(), e);
            throw new RuntimeException(e);
        }
    }
}
