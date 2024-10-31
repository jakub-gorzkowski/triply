package com.triply.backend.service.authentication;

import com.triply.backend.domain.dto.request.AuthenticationRequest;
import com.triply.backend.domain.dto.request.RegisterRequest;
import com.triply.backend.domain.dto.response.AuthenticationResponse;
import com.triply.backend.domain.entity.Role;
import com.triply.backend.domain.entity.User;
import com.triply.backend.repository.RoleRepository;
import com.triply.backend.repository.UserRepository;
import com.triply.backend.security.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImplementation implements AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();

        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .roleSet(Set.of(userRole))
                .build();

        userRepository.save(user);

        return AuthenticationResponse.builder()
                .token(jwtService.generateToken(user, user.getRoleSet()))
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
        ));

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        return AuthenticationResponse.builder()
                .token(jwtService.generateToken(user, user.getRoleSet()))
                .build();
    }
}
