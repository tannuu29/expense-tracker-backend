package com.example.ExpenseManagement.dto;

import lombok.Data;

@Data
public class UserReqDto {
    private String username;
    private String name;
    private String password;
    private String mobile;
    private String email;
}
