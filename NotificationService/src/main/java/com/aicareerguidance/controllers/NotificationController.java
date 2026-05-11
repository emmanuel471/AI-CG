package com.aicareerguidance.controllers;

import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.aicareerguidance.dtos.NotificationRequest;
import com.aicareerguidance.services.NotificationService;
import lombok.RequiredArgsConstructor;
import jakarta.mail.MessagingException;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/sendMail")
    public HttpStatus postEmail(@RequestBody NotificationRequest request) {
        try {
            notificationService.postEmail(request);
        } catch (IOException | MessagingException e) {
            e.printStackTrace();
            return HttpStatus.BAD_REQUEST;
           
        }

        return HttpStatus.OK;
    }  
}
