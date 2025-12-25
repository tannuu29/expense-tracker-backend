package com.example.ExpenseManagement.service;

import com.example.ExpenseManagement.config.SecurityConfig;
import com.example.ExpenseManagement.dto.ChangePasswordDto;
import com.example.ExpenseManagement.dto.UpdateProfileDto;
import com.example.ExpenseManagement.dto.UserReqDto;
import com.example.ExpenseManagement.dto.UserResDto;
import com.example.ExpenseManagement.entity.User;
import com.example.ExpenseManagement.enums.Role;
import com.example.ExpenseManagement.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private SecurityConfig config;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String addUser(UserReqDto userReqDto){
        User user = new User();
        user.setName(userReqDto.getName());
        user.setUsername(userReqDto.getUsername());
        user.setPassword(config.encoder().encode(userReqDto.getPassword()));
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
    public UserResDto mapToDto(User user){
        UserResDto userResDto = new UserResDto();
        userResDto.setUserId(user.getUserId());
        userResDto.setName(user.getName());
        userResDto.setUsername(user.getUsername());
        userResDto.setMobile(user.getMobile());
        userResDto.setEmail(user.getEmail());
        userResDto.setRole(user.getRole().name());
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

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException("User not found"));
    }

}
