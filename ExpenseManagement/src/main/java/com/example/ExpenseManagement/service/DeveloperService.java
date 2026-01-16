package com.example.ExpenseManagement.service;

import com.example.ExpenseManagement.dto.DeveloperResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeveloperService {
    public DeveloperResponse developerInfo(){
        DeveloperResponse developerResponse = new DeveloperResponse();
        String techStack = String.valueOf(List.of("Java","Spring Boot", "React.js", "MySQL", "Rest APIs"));
        developerResponse.setName("Tanisha Nainwal");
        developerResponse.setProject("Expense Management System");
        developerResponse.setTechStack(techStack);
        return developerResponse ;
    }
}

