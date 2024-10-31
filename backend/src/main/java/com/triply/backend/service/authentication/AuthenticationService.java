package com.triply.backend.service.authentication;

import com.triply.backend.domain.dto.request.AuthenticationRequest;
import com.triply.backend.domain.dto.request.RegisterRequest;
import com.triply.backend.domain.dto.response.AuthenticationResponse;

public interface AuthenticationService {
    AuthenticationResponse register(RegisterRequest request);
    AuthenticationResponse authenticate(AuthenticationRequest request);
}
