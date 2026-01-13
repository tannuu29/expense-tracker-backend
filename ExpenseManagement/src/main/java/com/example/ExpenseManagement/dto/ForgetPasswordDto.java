package com.example.ExpenseManagement.dto;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class ForgetPasswordDto {
    @Column(nullable = false)
    private String email;
}
