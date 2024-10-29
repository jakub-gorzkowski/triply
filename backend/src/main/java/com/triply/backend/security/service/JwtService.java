package com.triply.backend.security.service;

import com.triply.backend.domain.entity.Role;
import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

public interface JwtService {
    String extractUsername(String token);
    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);
    SecretKey getSignInKey();
    boolean isTokenValid(String token, UserDetails userDetails);
    String generateToken(UserDetails userDetails, Set<Role> roles);
    String generateToken(Map<String, Object> extraClaims, UserDetails userDetails);
}
