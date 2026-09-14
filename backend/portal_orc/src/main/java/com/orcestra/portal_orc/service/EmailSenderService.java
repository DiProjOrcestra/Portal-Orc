package com.orcestra.portal_orc.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailSenderService {
    
    @Value("${spring.mail.username}")
    private String senderEmail;
    private final JavaMailSender mailSender;
    
    @Async
    public void sendEmail(String receiverEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);
        message.setTo(receiverEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
}
