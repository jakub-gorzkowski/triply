package com.triply.backend.service.place;

import com.triply.backend.domain.dto.item.PlaceItem;
import com.triply.backend.domain.mapper.PlaceMapper;
import com.triply.backend.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlaceServiceImplementation implements PlaceService {

    private final PlaceRepository placeRepository;

    public Page<PlaceItem> getLatestPlaces(Integer offset, Byte size) {
        return placeRepository.findAllByOrderByAddedOnDesc(PageRequest.of(offset, size))
                .map(PlaceMapper::mapToItem);
    }
}
