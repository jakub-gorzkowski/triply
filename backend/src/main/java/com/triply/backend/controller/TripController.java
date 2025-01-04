package com.triply.backend.controller;

import com.triply.backend.domain.dto.item.PlaceItem;
import com.triply.backend.domain.dto.request.TripRequest;
import com.triply.backend.domain.dto.response.TripResponse;
import com.triply.backend.domain.entity.Trip;
import com.triply.backend.domain.entity.User;
import com.triply.backend.domain.mapper.TripMapper;
import com.triply.backend.service.trip.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping(path = "/{id}")
    public ResponseEntity<TripResponse> getTripById(@PathVariable(name = "id") Long id) {
        Trip trip = tripService.getTripById(id);
        return new ResponseEntity<>(TripMapper.mapToResponse(trip), HttpStatus.OK);
    }

    @GetMapping(path = "/upcoming")
    public ResponseEntity<Page<TripResponse>> getUpcomingTrips(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "offset", defaultValue = "0") Integer offset,
            @RequestParam(value = "size", defaultValue = "10") Byte size
    ) {
        Page<TripResponse> upcomingTrips = tripService.getUpcomingTrips(user, offset, size);
        Page<TripResponse> page = new PageImpl<>(
                upcomingTrips.toList(),
                PageRequest.of(offset, size),
                upcomingTrips.getTotalElements()
        );
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @GetMapping(path = "/past")
    public ResponseEntity<Page<TripResponse>> getPastTrips(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "offset", defaultValue = "0") Integer offset,
            @RequestParam(value = "size", defaultValue = "10") Byte size
    ) {
        Page<TripResponse> pastTrips = tripService.getPastTrips(user, offset, size);
        Page<TripResponse> page = new PageImpl<>(
                pastTrips.toList(),
                PageRequest.of(offset, size),
                pastTrips.getTotalElements()
        );
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @GetMapping(path = "/next")
    public ResponseEntity<TripResponse> getNextTrip(@AuthenticationPrincipal User user) {
        TripResponse nextTrip = tripService.getNextTrip(user);
        return new ResponseEntity<>(nextTrip, HttpStatus.OK);
    }

    @GetMapping(path = "/places")
    public ResponseEntity<Page<PlaceItem>> getTripPlaces(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "id") Long id,
            @RequestParam(value = "offset", defaultValue = "0") Integer offset,
            @RequestParam(value = "size", defaultValue = "10") Byte size
    ) {
        Page<PlaceItem> tripPlaces = tripService.getTripPlaces(user, id, offset, size);
        Page<PlaceItem> page = new PageImpl<>(
                tripPlaces.toList(),
                PageRequest.of(offset, size),
                tripPlaces.getTotalElements()
        );
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @PatchMapping(path = "/update")
    public ResponseEntity<TripResponse> updateTrip(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "id") Long id,
            @RequestBody TripRequest tripRequest
    ) {
        TripResponse updatedTrip = tripService.updateTrip(user, id, tripRequest);
        return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
    }

    @PatchMapping(path = "/add-place")
    public ResponseEntity<Void> addPlace(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "trip_id") Long tripId,
            @RequestParam(value = "place_id") Long placeId
    ) {
        tripService.addPlace(user, tripId, placeId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping(path = "/remove-place")
    public ResponseEntity<Void> removePlace(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "trip_id") Long tripId,
            @RequestParam(value = "place_id") Long placeId
    ) {
        tripService.removePlace(user, tripId, placeId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping(path = "/remove")
    public ResponseEntity<Void> deleteTrip(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "id") Long id
    ) {
        tripService.deleteTrip(user, id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
