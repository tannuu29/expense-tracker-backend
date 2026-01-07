package com.example.ExpenseManagement.service;

import com.example.ExpenseManagement.dto.*;
import com.example.ExpenseManagement.entity.User;
import com.example.ExpenseManagement.enums.Role;
import com.example.ExpenseManagement.repository.UserRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String addUser(UserReqDto userReqDto){

        if (userRepo.findByUsername(userReqDto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepo.findByEmail(userReqDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(userReqDto.getName());
        user.setUsername(userReqDto.getUsername());
        user.setPassword(passwordEncoder.encode(userReqDto.getPassword()));
        user.setMobile(userReqDto.getMobile());
        user.setEmail(userReqDto.getEmail());
        user.setRole(Role.USER);
        userRepo.save(user);
        return "User Successfully added";
    }

    public UserResDto getUserById(Long id){
        User user = userRepo.findById(id).orElseThrow(()-> new UsernameNotFoundException("User not found"));

        return mapToDto(user);
    }

    public List<UserResDto> getAllUsers(){

        return userRepo.findAll().stream().map(this::mapToDto).toList();
    }

    public List<UserResDto> getAllAdmins(){
        return userRepo.findByRole(Role.ADMIN).stream().map(this::mapToDto).toList();
    }

    public List<UserResDto> getUsers(){
        return userRepo.findByRole(Role.USER).stream().map(this::mapToDto).toList();
    }

    public UserResDto mapToDto(User user){
        UserResDto userResDto = new UserResDto();
        userResDto.setUserId(user.getUserId());
        userResDto.setName(user.getName());
        userResDto.setUsername(user.getUsername());
        userResDto.setMobile(user.getMobile());
        userResDto.setEmail(user.getEmail());
        userResDto.setRole(user.getRole().name());
        userResDto.setCreatedAt(user.getCreatedAt());
        userResDto.setLastActiveAt(user.getLastActiveAt());

        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);

        String status = user.getLastActiveAt() != null && user.getLastActiveAt().isAfter(fiveMinutesAgo) ? "Online" : "offline";
        userResDto.setStatus(status);

        return userResDto;
    }

    public void changePassword(String username, ChangePasswordDto passwordDto){
        User user = userRepo.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException("User not found"));

        if(!passwordEncoder.matches(passwordDto.getOldPassword(), user.getPassword())){
            throw new RuntimeException("Password is incorrect ");
        }
        user.setPassword(passwordEncoder.encode(passwordDto.getNewPassword()));
        userRepo.save(user);
    }

    public void updateProfile(String username, UpdateProfileDto profileDto){
        User user = userRepo.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        user.setName(profileDto.getName());
        user.setMobile(profileDto.getMobile());

        userRepo.save(user);
    }

    public UpdateProfileDto getProfile(String username) {
        User user = userRepo.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException("User not found"));

        UpdateProfileDto updateProfileDto = new UpdateProfileDto();
        updateProfileDto.setName(user.getName());
        updateProfileDto.setEmail(user.getEmail());
        updateProfileDto.setMobile(user.getMobile());
        updateProfileDto.setUsername(user.getUsername());

        return updateProfileDto;
    }

//    public void updateLastActive(String username) {
//        User user = userRepo.findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//        user.setLastActiveAt(LocalDateTime.now());
//        userRepo.save(user);
//    }

    public AdminDashboardStatsDto getAdminDashboardStats(){
        // TEMP DEBUG
//        userRepo.findAll().forEach(user -> {
//            System.out.println(
//                    "username: " + user.getUsername()
//                            + ", role: " + user.getRole()
//            );
//        });
        long totalUsers = userRepo.count();
        long totalAdmins = userRepo.countByRole(Role.ADMIN);
        long users = userRepo.countByRole(Role.USER);

        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
        long activeUsers = userRepo.countByCreatedAtAfter(fiveMinutesAgo);

        AdminDashboardStatsDto dto = new AdminDashboardStatsDto();
        dto.setTotalUsers(totalUsers);
        dto.setTotalAdmins(totalAdmins);
        dto.setUsers(users);
        dto.setActiveUsers(activeUsers);

        return dto;
    }

    public List<Map<String, Object>> getUserChart() {
        List<Object[]> rows = userRepo.getUsersGroupByDate();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : rows) {
            Map<String, Object> map = new HashMap<>();
            map.put("date", row[0]);
            map.put("count", row[1]);
            result.add(map);
        }
        return result;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException("User not found"));
    }

}
