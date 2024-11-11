package com.triply.backend.service.user;

import com.triply.backend.domain.dto.request.UserRequest;

public interface UserService {

    void updateUser(UserRequest userRequest);
}
