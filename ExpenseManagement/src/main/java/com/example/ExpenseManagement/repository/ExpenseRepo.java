package com.example.ExpenseManagement.repository;

import com.example.ExpenseManagement.dto.ExpenseResDto;
import com.example.ExpenseManagement.entity.Expense;
import com.example.ExpenseManagement.entity.User;
import com.example.ExpenseManagement.enums.PaymentMode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepo extends JpaRepository<Expense, Long> {
    Optional<Expense> findByUserAndDescription(User user, String description);

    List<Expense> findByUser(User user);

    List<Expense> findByUserAndPaymentMode(User user,PaymentMode paymentMode);

    List<Expense> findByUserAndAmountBetween(User user,Double minAmount, Double maxAmount);

    List<Expense> findByUserAndDateBetween(User user, LocalDate from, LocalDate to);

    Optional<Expense> findByIdAndUser(Long id, User user);

}
