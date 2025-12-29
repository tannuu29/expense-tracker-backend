package com.example.ExpenseManagement.repository;

import com.example.ExpenseManagement.entity.User;
import com.example.ExpenseManagement.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByRole(Role role);
    long countByRole(Role role);
//    long countByStatus(UserStatus status);
    long countByCreatedAtAfter(LocalDateTime time);
}
