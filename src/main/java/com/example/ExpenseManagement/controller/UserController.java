package com.example.ExpenseManagement.controller;

import com.example.ExpenseManagement.dto.ChangePasswordDto;
import com.example.ExpenseManagement.dto.UpdateProfileDto;
import com.example.ExpenseManagement.dto.UserReqDto;
import com.example.ExpenseManagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/addUser")
    public ResponseEntity<String> addUser(@RequestBody UserReqDto userReqDto){
        return ResponseEntity.ok(userService.addUser(userReqDto));
    }

    @GetMapping("/authenticated")
    public ResponseEntity<String> verified(){
        return ResponseEntity.ok("User Verified");
    }

    @PutMapping("/changePass")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDto passwordDto, Principal principal){
        String username = principal.getName();
        userService.changePassword(username,passwordDto);

        return ResponseEntity.ok(
                Map.of("message", "password changed successfully"));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileDto profileDto, Principal principal){
        String username = principal.getName();

        userService.updateProfile(username, profileDto);

        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @GetMapping("/profile")
    public ResponseEntity<UpdateProfileDto> getProfile(Principal principal){
        String username = principal.getName();
        return ResponseEntity.ok(userService.getProfile(username));
    }

    @GetMapping("/dashboard/users-per-day")
    public ResponseEntity<?> usersPerDay() {
        return ResponseEntity.ok(userService.getUserChart());
    }

}
