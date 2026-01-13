package com.example.ExpenseManagement.entity;

import com.example.ExpenseManagement.enums.PaymentMode;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    private Double amount;
//    private String category;
    @Enumerated(EnumType.STRING)
    private PaymentMode paymentMode;
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
