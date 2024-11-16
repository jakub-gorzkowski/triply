package com.triply.backend.service.trip;

import com.triply.backend.domain.dto.item.PlaceItem;
import com.triply.backend.domain.dto.request.TripRequest;
import com.triply.backend.domain.dto.response.TripResponse;
import com.triply.backend.domain.entity.User;
import org.springframework.data.domain.Page;

public interface TripService {

    TripResponse createTrip(User user, TripRequest request);
}
