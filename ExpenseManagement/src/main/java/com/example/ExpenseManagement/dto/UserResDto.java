package com.example.ExpenseManagement.dto;

import com.example.ExpenseManagement.enums.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResDto {
    private Long userId;
    private String username;
    private String name;
//    private String password;
    private String mobile;
    private String email;
    @Enumerated(EnumType.STRING)
    private String role;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime lastActiveAt;
}
