package com.triply.backend.service.place;

import com.triply.backend.domain.dto.item.PlaceItem;
import org.springframework.data.domain.Page;

public interface PlaceService {

    Page<PlaceItem> getLatestPlaces(Integer offset, Byte size);
}
