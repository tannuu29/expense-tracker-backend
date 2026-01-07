package com.example.ExpenseManagement.dto;

import com.example.ExpenseManagement.enums.PaymentMode;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ExpenseReqDto {
    private String description;
    private Double amount;
//    private String category;
    private PaymentMode paymentMode;
    private LocalDate date;
}
