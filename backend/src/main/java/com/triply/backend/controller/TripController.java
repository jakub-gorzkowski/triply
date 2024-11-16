package com.triply.backend.controller;

import com.triply.backend.domain.dto.request.TripRequest;
import com.triply.backend.domain.dto.response.TripResponse;
import com.triply.backend.domain.entity.User;
import com.triply.backend.service.trip.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/trip")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping(path = "/add")
    public ResponseEntity<TripResponse> createTrip(
            @AuthenticationPrincipal User user,
            @RequestBody TripRequest tripRequest
    ) {
        TripResponse createdTrip = tripService.createTrip(user, tripRequest);
        return new ResponseEntity<>(createdTrip, HttpStatus.CREATED);
    }
}
