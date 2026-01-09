package com.example.ExpenseManagement.service;

import com.example.ExpenseManagement.enums.MailType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
public class MailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendmail(String to, MailType type, Map<String ,String> data){
        String subject = "";
        String body = "";

        switch (type) {
            case WELCOME -> {
                subject = "Welcome to MoneyMap";
                body = """
                       Hi %s,

                       Welcome to MoneyMap!
                       We're excited to have you on board.

                       Happy expense tracking 💰
                       """.formatted(data.get("name"));
            }

            case RESET_PASSWORD -> {
                subject = "Reset your MoneyMap password";
                body = """
                       Hi %s,

                       Click the link below to reset your password:
                       %s

                       This link is valid for 15 minutes.
                       If you didn’t request this, please ignore this email.
                       """.formatted(
                        data.get("name"),
                        data.get("link")
                );
            }

            case PASSWORD_CHANGED -> {
                subject = "Password changed successfully";
                body = """
                        Hi %s,
                        
                        Your password was changed successfully.
                        If this wasn't you, please contact support immediately.
                        """.formatted(data.get("name"));
            }

            default -> throw new IllegalArgumentException("Unsupported mail type");
        }
        sendRawMail(to,subject,body);
    }

    private void sendRawMail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
}
