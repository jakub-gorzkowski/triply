package com.triply.backend.controller;

import com.triply.backend.domain.dto.request.UserRequest;
import com.triply.backend.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PatchMapping(path = "/update")
    public ResponseEntity<Void> updateUser(@RequestBody UserRequest userRequest) {
        userService.updateUser(userRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping(path = "/delete")
    public ResponseEntity<Void> removeUser(@RequestParam("id") Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
