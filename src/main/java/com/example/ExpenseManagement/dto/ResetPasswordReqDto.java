package com.example.ExpenseManagement.dto;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class ResetPasswordReqDto {
    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private String newPassword;
}
