package com.example.ExpenseManagement.dto;

import com.example.ExpenseManagement.enums.PaymentMode;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class ExpenseResDto {
    private Long id;
    private String description;
    private Double amount;
//    private String category;
    private PaymentMode paymentMode;
    private LocalDate date;
}
