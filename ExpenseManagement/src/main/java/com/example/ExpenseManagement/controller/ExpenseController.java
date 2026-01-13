package com.example.ExpenseManagement.controller;

import com.example.ExpenseManagement.dto.ExpenseReqDto;
import com.example.ExpenseManagement.dto.ExpenseResDto;
import com.example.ExpenseManagement.enums.PaymentMode;
import com.example.ExpenseManagement.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/expenses")
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;

    @GetMapping("/totalExpenses")
    public ResponseEntity<Double> totalExpense(Principal principal){
        return ResponseEntity.ok(expenseService.totalExpense(principal));
    }

    @GetMapping("/allExpense")
    public ResponseEntity<List<ExpenseResDto>> getAllExp(Principal principal){
        return ResponseEntity.ok(expenseService.getAllExp(principal));
    }
    @PostMapping("/addExpense")
    public ResponseEntity<String> addExpense(@RequestBody ExpenseReqDto expenseReqDto, Principal principal){
        return ResponseEntity.ok(expenseService.addExpense(expenseReqDto, principal));
    }

    @GetMapping("/paymentMode")
    public ResponseEntity<List<ExpenseResDto>> getExpenseByPaymentMode(@RequestParam String paymentMode, Principal principal){
        return ResponseEntity.ok(expenseService.getExpByPaymentMode(paymentMode, principal));
    }

    @GetMapping("/amountFilter")
    public ResponseEntity<List<ExpenseResDto>> getExpByAmount(@RequestParam Double minAmount, @RequestParam Double maxAmount, Principal principal){
        return ResponseEntity.ok(expenseService.getExpByAmount(minAmount, maxAmount, principal));
    }

    @GetMapping("/dateFilter")
    public ResponseEntity<List<ExpenseResDto>> getExpByDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to, Principal principal){
        return ResponseEntity.ok(expenseService.getExpByDate(from,to, principal));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateExpense(@PathVariable Long id, @RequestBody ExpenseReqDto expenseReqDto, Principal principal){
        return new ResponseEntity<>(expenseService.updateExpense(id, expenseReqDto, principal), HttpStatusCode.valueOf(200));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Long id, Principal principal){
        expenseService.deleteExpense(id, principal);
        return ResponseEntity.ok("Deleted successfully");
    }

}
