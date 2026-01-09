package com.example.ExpenseManagement.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Component
public class JWTUtils {
    private final String SECRET = "c6oWcW_JgdIWj7Wk}MV-a^~nu}-}&h[A";
    private final SecretKey KEY = Keys.hmacShaKeyFor(SECRET.getBytes());
    public String generateToken(String username){
        return Jwts.builder()
                .issuedAt(new Date())
                .subject(username)
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))   //1hour
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact();
    }
    public String getUsername(String token){
        Claims body = Jwts.parser()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return body.getSubject();
    }

    public Boolean validate(UserDetails userDetails, String token){
        Claims body = Jwts.parser()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return (userDetails.getUsername().equals(body.getSubject()) && body.getExpiration().after(new Date()));
    }
}
