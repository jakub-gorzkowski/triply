package com.triply.backend.service.place;

import com.triply.backend.domain.dto.item.PlaceItem;
import com.triply.backend.domain.dto.request.PlaceRequest;
import com.triply.backend.domain.dto.response.PlaceResponse;
import org.springframework.data.domain.Page;

public interface PlaceService {

    PlaceResponse addPlace(PlaceRequest placeRequest);
    Page<PlaceItem> getLatestPlaces(Integer offset, Byte size);
}
