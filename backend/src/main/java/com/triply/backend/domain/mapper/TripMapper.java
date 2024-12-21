package com.triply.backend.domain.mapper;

import com.triply.backend.domain.dto.response.TripResponse;
import com.triply.backend.domain.entity.Trip;

public class TripMapper {

    public static TripResponse mapToResponse(Trip trip) {
        return TripResponse.builder()
                .id(trip.getId())
                .name(trip.getName())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .build();
    }
}
