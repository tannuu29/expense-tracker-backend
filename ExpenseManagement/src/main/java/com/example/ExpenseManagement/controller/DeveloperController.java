package com.example.ExpenseManagement.controller;

import com.example.ExpenseManagement.dto.DeveloperResponse;
import com.example.ExpenseManagement.service.DeveloperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController

public class DeveloperController {
    @Autowired
    DeveloperService service;

    @GetMapping("/developer")
    public ResponseEntity<DeveloperResponse> getDeveloperInfo(){
        return new ResponseEntity<>(service.developerInfo(), HttpStatusCode.valueOf(200));

    }
}
