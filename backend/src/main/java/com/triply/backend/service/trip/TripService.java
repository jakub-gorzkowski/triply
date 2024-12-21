package com.triply.backend.service.trip;

import com.triply.backend.domain.dto.item.PlaceItem;
import com.triply.backend.domain.dto.request.TripRequest;
import com.triply.backend.domain.dto.response.TripResponse;
import com.triply.backend.domain.entity.User;
import org.springframework.data.domain.Page;

public interface TripService {

    TripResponse createTrip(User user, TripRequest request);

    Page<TripResponse> getUpcomingTrips(User user, Integer offset, Byte size);

    Page<TripResponse> getPastTrips(User user, Integer offset, Byte size);

    TripResponse getNextTrip(User user);

    Page<PlaceItem> getTripPlaces(User user, Long tripId, Integer offset, Byte size);

    TripResponse updateTrip(User user, Long id, TripRequest request);

    void addPlace(User user, Long tripId, Long placeId);

    void removePlace(User user, Long tripId, Long placeId);

    void deleteTrip(User user, Long id);
}
