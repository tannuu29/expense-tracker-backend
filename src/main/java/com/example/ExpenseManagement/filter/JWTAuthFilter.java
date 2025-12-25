package com.example.ExpenseManagement.filter;

import com.example.ExpenseManagement.repository.UserRepo;
import com.example.ExpenseManagement.utils.JWTUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component

public class JWTAuthFilter extends OncePerRequestFilter {
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private UserRepo userRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        String token = null;
        String name = null;
        if(authorization != null && authorization.startsWith("Bearer ")){
            token = authorization.substring(7).trim();
            name = jwtUtils.getUsername(token);
            System.out.println("AUTH HEADER = " + authorization);

        }

        if (name != null && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = userRepo.findByUsername(name).orElseThrow(()-> new UsernameNotFoundException("User not found"));
            if (jwtUtils.validate(userDetails,token)){
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request,response);
    }
}
