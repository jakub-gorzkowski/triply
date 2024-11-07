package com.triply.backend.domain.mapper;

import com.triply.backend.domain.dto.item.PlaceItem;
import com.triply.backend.domain.entity.Place;

public class PlaceMapper {

    public static PlaceItem mapToItem(Place place) {
        return PlaceItem.builder()
                .name(place.getName())
                .imageUrl(place.getImageUrl())
                .addedOn(place.getAddedOn())
                .build();
    }
}
