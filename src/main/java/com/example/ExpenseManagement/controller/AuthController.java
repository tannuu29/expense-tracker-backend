package com.example.ExpenseManagement.controller;

import com.example.ExpenseManagement.dto.AuthReqDto;
import com.example.ExpenseManagement.dto.UserReqDto;
import com.example.ExpenseManagement.entity.User;
import com.example.ExpenseManagement.service.UserService;
import com.example.ExpenseManagement.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {
    @Autowired
    private AuthenticationManager manager;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> getToken(@RequestBody AuthReqDto authReqDto){
        try {
            Authentication auth = manager.authenticate(new UsernamePasswordAuthenticationToken(
                    authReqDto.getUsername(),
                    authReqDto.getPassword()
            ));

//            User user = userRepo.findByUsername(authReqDto.getUsername()).orElseThrow(()-> new UsernameNotFoundException("User not found"));
            User user = (User) auth.getPrincipal();

            String token = jwtUtils.generateToken(user.getUsername());

            return ResponseEntity.ok(
                    Map.of("token", token,
                            "role", user.getRole().name()
                    )
            );
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
//            System.out.println(e.getMessage());
//            throw new RuntimeException("user not found");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserReqDto dto) {
        try {
            userService.addUser(dto);
            return ResponseEntity.ok(
                    Map.of("message", "User registered successfully",
                            "username", dto.getUsername()
                    )
            );
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

}
