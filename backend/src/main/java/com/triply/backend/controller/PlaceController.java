package com.triply.backend.controller;

import com.triply.backend.domain.dto.item.PlaceItem;
import com.triply.backend.domain.dto.request.PlaceRequest;
import com.triply.backend.domain.dto.response.PlaceResponse;
import com.triply.backend.service.place.PlaceService;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/place")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @PostMapping(path = "/add")
    public ResponseEntity<PlaceResponse> addPlaceRequest(@RequestBody PlaceRequest placeRequest) {
        PlaceResponse addedPlace = placeService.addPlace(placeRequest);
        return new ResponseEntity<>(addedPlace, HttpStatus.CREATED);
    }

    @GetMapping(path = "/latest")
    public ResponseEntity<Page<PlaceItem>> getLatest(
            @RequestHeader(name = "offset") @Nullable Integer offset,
            @RequestHeader(name = "size") @Nullable Byte size
    ) {
        offset = (offset != null) ? offset : 0;
        size = (size != null) ? size : 10;
        List<PlaceItem> placeItemList = placeService.getLatestPlaces(offset, size).stream().toList();
        Page<PlaceItem> page = new PageImpl<>(placeItemList, PageRequest.of(offset, size), size);
        return new ResponseEntity<>(page, HttpStatus.OK);
    }
}
