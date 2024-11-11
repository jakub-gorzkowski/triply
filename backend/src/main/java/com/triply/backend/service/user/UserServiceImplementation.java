package com.triply.backend.service.user;

import com.triply.backend.domain.dto.request.UserRequest;
import com.triply.backend.exception.throwable.UserNotFoundException;
import com.triply.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @SneakyThrows
    public void updateUser(UserRequest userRequest) {
        userRepository.findByEmail(userRequest.getCurrentEmail()).map(existingUser -> {
            Optional.ofNullable(userRequest.getEmail()).ifPresent(existingUser::setEmail);
            Optional.ofNullable(userRequest.getUsername()).ifPresent(existingUser::setUsername);
            if (userRequest.getPassword() != null) {
                Optional.of(passwordEncoder.encode(userRequest.getPassword())).ifPresent(existingUser::setPassword);
            }
            return userRepository.save(existingUser);
        }).orElseThrow(UserNotFoundException::new);
    }
}
