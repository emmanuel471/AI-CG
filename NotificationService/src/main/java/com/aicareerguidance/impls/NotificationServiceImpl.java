package com.aicareerguidance.impls;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Map;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;
import com.aicareerguidance.config.StorageConfig;
import com.aicareerguidance.dtos.NotificationRequest;
import com.aicareerguidance.entities.Notification;
import com.aicareerguidance.entities.NotificationAudit;
import com.aicareerguidance.repositories.NotificationAuditRepository;
import com.aicareerguidance.repositories.NotificationTemplateRepository;
import com.aicareerguidance.services.NotificationService;
import freemarker.template.Configuration;
import freemarker.template.Template;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;

@Service
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final JavaMailSender mailSender;
    private final FreeMarkerConfigurer freemarkerConfigurer;
    private final NotificationTemplateRepository notificationTemplateRepository;
    private final NotificationAuditRepository notificationAuditRepository;
    private final StorageConfig storageConfig;

    @Value("${application.bucket.name}")
    private String bucketName;

    @Value("${notification.service.template.folder}")
    private String notificationTemplates;

    public NotificationServiceImpl(
            JavaMailSender mailSender,
            FreeMarkerConfigurer freemarkerConfigurer,
            NotificationTemplateRepository notificationTemplateRepository,
            NotificationAuditRepository notificationAuditRepository,
            StorageConfig storageConfig) {

        this.mailSender = mailSender;
        this.freemarkerConfigurer = freemarkerConfigurer;
        this.notificationTemplateRepository = notificationTemplateRepository;
        this.notificationAuditRepository = notificationAuditRepository;
        this.storageConfig = storageConfig;
    }

    @Override
    public void postEmail(NotificationRequest notificationRequest)
            throws MessagingException, IOException {

        try {
            validateRequest(notificationRequest);

            String templateID = notificationRequest.getTemplateID();
            log.debug("Processing email for templateID={}", templateID);

            Notification templateDetails =
                    notificationTemplateRepository.findByTemplateID(templateID);

            if (templateDetails == null) {
                log.error("Template not found for templateID={}", templateID);
                throw new IllegalArgumentException("Notification template not found for templateID: " + templateID);
            }

            Map<String, Object> model = notificationRequest.getModel() != null
                    ? notificationRequest.getModel()
                    : Collections.emptyMap();

            String htmlBody = processTemplate(templateDetails, model);

            sendEmail(templateDetails, notificationRequest.getTo(), htmlBody);

            saveAudit(templateID,
                      templateDetails.getFromAddress(),
                      notificationRequest.getTo(),
                      templateDetails.getSubject(),
                      templateDetails.getTemplateFileName());

        } catch (Exception e) {
            log.error("Failed to send notification for templateID={}: {}", 
                      notificationRequest != null ? notificationRequest.getTemplateID() : "unknown", 
                      e.getMessage(), e);
            // propagate so controller or global handler can return proper 500
            throw e;
        }
    }

    private void validateRequest(NotificationRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("NotificationRequest cannot be null");
        }
        if (request.getTemplateID() == null || request.getTemplateID().isBlank()) {
            throw new IllegalArgumentException("TemplateID is required");
        }
        if (request.getTo() == null || request.getTo().length == 0) {
            throw new IllegalArgumentException("At least one recipient is required");
        }
    }

    private String processTemplate(Notification templateDetails, Map<String, Object> model) {
        String templateKey = notificationTemplates + "/" + templateDetails.getTemplateFileName();
        log.debug("Fetching template from S3 bucket={} key={}", bucketName, templateKey);

        try {
            byte[] bytes = storageConfig.s3Client()
                    .getObject(
                            GetObjectRequest.builder()
                                    .bucket(bucketName)
                                    .key(templateKey)
                                    .build(),
                            ResponseTransformer.toBytes()
                    )
                    .asByteArray();

            log.debug("Fetched template '{}' from S3 ({} bytes)", templateKey, bytes.length);

            Configuration cfg = freemarkerConfigurer.getConfiguration();
            Template template = new Template(
                    templateDetails.getTemplateID(),
                    new String(bytes, StandardCharsets.UTF_8),
                    cfg
            );

            return FreeMarkerTemplateUtils.processTemplateIntoString(template, model);

        } catch (NoSuchKeyException e) {
            log.error("Template not found in S3: bucket={} key={}", bucketName, templateKey, e);
            throw new IllegalArgumentException("Template file not found in S3: " + templateKey, e);

        } catch (Exception e) {
            log.error("Failed to process template '{}' from S3: {}", templateKey, e.getMessage(), e);
            throw new RuntimeException("Failed to process email template: " + templateKey, e);
        }
    }

    private void sendEmail(Notification template, String[] to, String htmlBody) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setFrom(template.getFromAddress());
        helper.setSubject(template.getSubject());

        if (template.getCcAddresses() != null && !template.getCcAddresses().isBlank()) {
            helper.setCc(template.getCcAddresses().split(","));
        }

        helper.setText(htmlBody, true);

        try {
            mailSender.send(message);
            log.info("Email sent successfully to {} for templateID={}", String.join(", ", to), template.getTemplateID());
        } catch (Exception e) {
            log.error("Failed to send email via SMTP for templateID={} to recipients={}: {}",
                      template.getTemplateID(),
                      String.join(", ", to),
                      e.getMessage(), e);
            throw e;
        }
    }

    private void saveAudit(String templateID, String from, String[] to, String subject, String templateFileName) {
        try {
            NotificationAudit audit = new NotificationAudit();
            audit.setTemplateID(templateID);
            audit.setFromAddress(from);
            audit.setToAddress(String.join(", ", to));
            audit.setSubject(subject);
            audit.setTemplateFileName(templateFileName);

            notificationAuditRepository.save(audit);
            log.debug("Notification audit saved for templateID={}", templateID);
        } catch (Exception e) {
            log.error("Failed to save notification audit for templateID={}: {}", templateID, e.getMessage(), e);
        }
    }
}
