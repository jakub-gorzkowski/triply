package com.triply.backend.domain.mapper;

import com.triply.backend.domain.dto.item.PlaceItem;
import com.triply.backend.domain.dto.request.PlaceRequest;
import com.triply.backend.domain.dto.response.PlaceResponse;
import com.triply.backend.domain.entity.Place;

import java.time.LocalDateTime;
import java.util.HashSet;

public class PlaceMapper {

    public static Place mapFromPlaceRequest(PlaceRequest placeRequest) {
        return Place.builder()
                .name(placeRequest.getName())
                .address(placeRequest.getAddress())
                .description(placeRequest.getDescription())
                .imageUrl(placeRequest.getImageUrl())
                .addedOn(LocalDateTime.now())
                .isApproved(false)
                .reviewSet(new HashSet<>())
                .tripSet(new HashSet<>())
                .build();
    }

    public static PlaceItem mapToItem(Place place) {
        return PlaceItem.builder()
                .id(place.getId())
                .name(place.getName())
                .description(place.getDescription())
                .imageUrl(place.getImageUrl())
                .address(place.getAddress())
                .category(place.getCategory().getName())
                .latitude(place.getLatitude())
                .longitude(place.getLongitude())
                .addedOn(place.getAddedOn())
                .build();
    }

    public static PlaceResponse mapToResponse(Place place) {
        return PlaceResponse.builder()
                .id(place.getId())
                .name(place.getName())
                .address(place.getAddress())
                .description(place.getDescription())
                .latitude(place.getLatitude())
                .longitude(place.getLongitude())
                .category(place.getCategory().getName())
                .imageUrl(place.getImageUrl())
                .addedOn(place.getAddedOn())
                .isApproved(place.getIsApproved())
                .build();
    }
}
