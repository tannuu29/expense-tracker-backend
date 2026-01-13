package com.example.ExpenseManagement;

import com.example.ExpenseManagement.service.MailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest

public class MailServiceTest {
    @Autowired
    private MailService mailService;

//    @Test
//    void testSendMail(){
//        mailService.sendmail("tanisha.bhardwaj17@gmail.com",
//                "Testing java mail sender",
//                "test");
//    }

//    void testSendMail(){
//        mailService.sendmail("tanisha.bhardwaj17@gmail.com",
//                "");
//    }
}
