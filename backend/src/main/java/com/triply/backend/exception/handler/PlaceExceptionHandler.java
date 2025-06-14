package com.triply.backend.exception.handler;

import com.triply.backend.exception.throwable.CategoryNotFoundException;
import com.triply.backend.exception.throwable.GeocodingException;
import com.triply.backend.exception.throwable.PlaceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.time.Instant;

@RestControllerAdvice
public class PlaceExceptionHandler {

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(PlaceNotFoundException.class)
    public ErrorResponse handlePlaceNotFoundException(PlaceNotFoundException exception) {
        return ErrorResponse.builder(exception, HttpStatus.NOT_FOUND, exception.getMessage())
                .type(URI.create(""))
                .title("Place not found")
                .property("timestamp", Instant.now())
                .build();
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(CategoryNotFoundException.class)
    public ErrorResponse handleCategoryNotFoundException(CategoryNotFoundException exception) {
        return ErrorResponse.builder(exception, HttpStatus.NOT_FOUND, exception.getMessage())
                .type(URI.create(""))
                .title("Category not found")
                .property("timestamp", Instant.now())
                .build();
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(GeocodingException.class)
    public ErrorResponse handleCategoryNotFoundException(GeocodingException exception) {
        return ErrorResponse.builder(exception, HttpStatus.CONFLICT, exception.getMessage())
                .type(URI.create(""))
                .title("Geocoding issues")
                .property("timestamp", Instant.now())
                .build();
    }
}
