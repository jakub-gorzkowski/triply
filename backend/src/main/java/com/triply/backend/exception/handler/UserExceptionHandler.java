package com.triply.backend.exception.handler;

import com.triply.backend.exception.throwable.AccessDeniedException;
import com.triply.backend.exception.throwable.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.time.Instant;

@RestControllerAdvice
public class UserExceptionHandler {

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(UserNotFoundException.class)
    public ErrorResponse handleUserNotFoundException(UserNotFoundException exception) {
        return ErrorResponse.builder(exception, HttpStatus.NOT_FOUND, exception.getMessage())
                .type(URI.create(""))
                .title("User not found")
                .property("timestamp", Instant.now())
                .build();
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(AccessDeniedException.class)
    public ErrorResponse handleUserNotFoundException(AccessDeniedException exception) {
        return ErrorResponse.builder(exception, HttpStatus.UNAUTHORIZED, exception.getMessage())
                .type(URI.create(""))
                .title("Access denied")
                .property("timestamp", Instant.now())
                .build();
    }
}
