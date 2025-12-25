package com.example.ExpenseManagement.entity;

import com.example.ExpenseManagement.enums.Role;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Data
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long userId;
    @Column(unique = true, nullable = false)
    private String username;
    private String name;
    @Column(nullable = false)
    private String password;
    private String mobile;
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        System.out.println(role.name());
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + role.name())
        );
    }
}
