package com.aicareerguidance.events;

import io.awspring.cloud.sqs.operations.SqsTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class EventPublisher {

    private final SqsTemplate sqsTemplate;

    @Value("${aws.sqs.queue.user-notification-events}")
    private String queueName;

    public EventPublisher(SqsTemplate sqsTemplate) {
        this.sqsTemplate = sqsTemplate;
    }

    public void publishEvent(BaseEvent event) {
        sqsTemplate.send(queueName, event);
        log.info("Published event: {} to SQS queue: {}", event.getEventType(), queueName);
    }
}
