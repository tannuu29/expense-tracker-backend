package com.example.ExpenseManagement.dto;

import lombok.Data;

@Data
public class AdminDashboardStatsDto {
    private long totalUsers;
    private long totalAdmins;
    private long users;
    private long activeUsers;
    private long blockedUsers;
    private long newUsers;
}
