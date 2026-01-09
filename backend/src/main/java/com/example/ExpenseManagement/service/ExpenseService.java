package com.example.ExpenseManagement.service;

import com.example.ExpenseManagement.dto.ExpenseReqDto;
import com.example.ExpenseManagement.dto.ExpenseResDto;
import com.example.ExpenseManagement.entity.Expense;
import com.example.ExpenseManagement.entity.User;
import com.example.ExpenseManagement.enums.PaymentMode;
import com.example.ExpenseManagement.repository.ExpenseRepo;
import com.example.ExpenseManagement.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepo expRepo;
    @Autowired
    private UserRepo userRepo;

    public String addExpense(ExpenseReqDto expenseReqDto, Principal principal){
        User user = userRepo.findByUsername(principal.getName()).orElseThrow(()-> new UsernameNotFoundException("user not found"));
        Expense expense = new Expense();
        expense.setDescription(expenseReqDto.getDescription());
        expense.setAmount(expenseReqDto.getAmount());
        expense.setPaymentMode(expenseReqDto.getPaymentMode());

        if (expenseReqDto.getDate() != null) {
            expense.setDate(expenseReqDto.getDate());
        } else {
            expense.setDate(LocalDate.now());  // fallback if no date sent
        }

        expense.setUser(user);
        expRepo.save(expense);
        return "Expense successfully added!";
    }

    public List<ExpenseResDto> getAllExp(Principal principal){
        User user = userRepo.findByUsername(principal.getName()).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        List<Expense> expenses = expRepo.findByUser(user);
        List<ExpenseResDto> dtos = new ArrayList<>();
        for (Expense expense : expenses){
            ExpenseResDto expenseResDto = new ExpenseResDto();
            expenseResDto.setId(expense.getId());
            expenseResDto.setDescription(expense.getDescription());
            expenseResDto.setAmount(expense.getAmount());
            expenseResDto.setPaymentMode(expense.getPaymentMode());
            expenseResDto.setDate(expense.getDate());
            dtos.add(expenseResDto);
        }
        return dtos;
    }
    public List<ExpenseResDto> getExpByPaymentMode(String paymentMode, Principal principal){
        User user = userRepo.findByUsername(principal.getName()).orElseThrow(()-> new UsernameNotFoundException("User not found"));

        List<Expense> expenses = expRepo.findByUserAndPaymentMode(user, PaymentMode.valueOf(paymentMode.toUpperCase()));
        List<ExpenseResDto> expenseResDtos = new ArrayList<>();
        for(Expense expense : expenses) {
            ExpenseResDto expenseResDto = new ExpenseResDto();
            expenseResDto.setId(expense.getId());
            expenseResDto.setDescription(expense.getDescription());
            expenseResDto.setAmount(expense.getAmount());
            expenseResDto.setPaymentMode(expense.getPaymentMode());
            expenseResDto.setDate(expense.getDate());
            expenseResDtos.add(expenseResDto);
        }
        return expenseResDtos;
    }

    public ExpenseResDto getExpByName(String description, Principal principal){
        User user = userRepo.findByUsername(principal.getName()).orElseThrow(()-> new UsernameNotFoundException("User not found"));

        Expense expense = expRepo.findByUserAndDescription(user,description).orElseThrow(()-> new RuntimeException("Expense not found"));
        ExpenseResDto expenseResDto = new ExpenseResDto();
        expenseResDto.setDescription(expense.getDescription());
        expenseResDto.setAmount(expense.getAmount());
        expenseResDto.setPaymentMode(expense.getPaymentMode());
        expenseResDto.setDate(expense.getDate());
        return expenseResDto;
    }

    public Double totalExpense(Principal principal){
        User user = userRepo.findByUsername(principal.getName()).orElseThrow(()-> new UsernameNotFoundException("User not found"));

        List<Expense> expenses = expRepo.findByUser(user);
        Double totalExp = 0.0;
        for(Expense expense : expenses){
            totalExp +=expense.getAmount();
        }
        return totalExp;
    }

    public List<ExpenseResDto> getExpByAmount(Double minAmount, Double maxAmount, Principal principal){
        User user = userRepo.findByUsername(principal.getName()).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        List<Expense> expenses = expRepo.findByUserAndAmountBetween(user,minAmount,maxAmount);
        List<ExpenseResDto> dtos = new ArrayList<>();
        for(Expense expense : expenses){
            ExpenseResDto expenseResDto = new ExpenseResDto();
            expenseResDto.setId(expense.getId());
            expenseResDto.setDescription(expense.getDescription());
            expenseResDto.setAmount(expense.getAmount());
            expenseResDto.setPaymentMode(expense.getPaymentMode());
            expenseResDto.setDate(expense.getDate());
            dtos.add(expenseResDto);
        }
        return dtos;
    }

    public List<ExpenseResDto> getExpByDate(LocalDate from, LocalDate to, Principal principal){
        User user = userRepo.findByUsername(principal.getName()).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        List<Expense> expenses = expRepo.findByUserAndDateBetween(user,from,to);
        List<ExpenseResDto> dtos = new ArrayList<>();
        for(Expense expense : expenses){
            ExpenseResDto expenseResDto = new ExpenseResDto();
            expenseResDto.setId(expense.getId());
            expenseResDto.setDescription(expense.getDescription());
            expenseResDto.setAmount(expense.getAmount());
            expenseResDto.setPaymentMode(expense.getPaymentMode());
            expenseResDto.setDate(expense.getDate());
            dtos.add(expenseResDto);
        }
        return dtos;
    }

    public String updateExpense(Long id, ExpenseReqDto expenseReqDto, Principal principal){
        User user = userRepo.findByUsername(principal.getName()).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Expense expense = expRepo.findByIdAndUser(id,user).orElseThrow(()-> new RuntimeException("Expense not found"));
        expense.setId(id);
        expense.setDescription(expenseReqDto.getDescription());
        expense.setAmount(expenseReqDto.getAmount());
        expense.setPaymentMode(expenseReqDto.getPaymentMode());
        expense.setDate(expenseReqDto.getDate());
        expRepo.save(expense);
        return "Expense is successfully updated!";
    }

//    public String deleteExp(Long id){
//        Expense expense = expRepo.findById(id).orElse(null);
//        expRepo.deleteById(id);
//        return "Expense " + expense.getDescription() + " has been successfully deleted!";
//    }
    public void deleteExpense(Long id, Principal principal){
        User user = userRepo.findByUsername(principal.getName()).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Expense expense = expRepo.findByIdAndUser(id,user).orElseThrow(()-> new RuntimeException("Expense Not found"));
        expRepo.delete(expense);
    }
}
