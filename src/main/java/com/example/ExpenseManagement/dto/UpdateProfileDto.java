package com.example.ExpenseManagement.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UpdateProfileDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String username;

    private String name;
    private String mobile;
    private String email;
}
