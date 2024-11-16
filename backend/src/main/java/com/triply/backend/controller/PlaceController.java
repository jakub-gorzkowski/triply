package com.triply.backend.controller;

import com.triply.backend.domain.dto.item.PlaceItem;
import com.triply.backend.domain.dto.item.ReviewItem;
import com.triply.backend.domain.dto.request.PlaceRequest;
import com.triply.backend.domain.dto.response.PlaceResponse;
import com.triply.backend.domain.dto.response.RatingResponse;
import com.triply.backend.service.place.PlaceService;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/place")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @PostMapping(path = "/add")
    public ResponseEntity<PlaceResponse> addPlaceRequest(
            @RequestParam("name") String name,
            @RequestParam("address") String address,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile imageFile
    ) {
        PlaceRequest placeRequest = new PlaceRequest(name, address, description, null);
        PlaceResponse addedPlace = placeService.addPlace(placeRequest, imageFile);
        return new ResponseEntity<>(addedPlace, HttpStatus.CREATED);
    }

    @GetMapping(path = "/latest")
    public ResponseEntity<Page<PlaceItem>> getLatest(
            @RequestParam(name = "offset") @Nullable Integer offset,
            @RequestParam(name = "size") @Nullable Byte size
    ) {
        offset = (offset != null) ? offset : 0;
        size = (size != null) ? size : 10;
        Page<PlaceItem> places = placeService.getLatestPlaces(offset, size);
        Page<PlaceItem> page = new PageImpl<>(
                places.toList(),
                PageRequest.of(offset, size),
                places.getTotalElements()
        );
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @GetMapping(path = "/popular")
    public ResponseEntity<Page<PlaceItem>> getPopular(
            @RequestParam(name = "offset") @Nullable Integer offset,
            @RequestParam(name = "size") @Nullable Byte size
    ) {
        offset = (offset != null) ? offset : 0;
        size = (size != null) ? size : 10;
        Page<PlaceItem> places = placeService.getPopularPlaces(offset, size);
        Page<PlaceItem> page = new PageImpl<>(
                places.toList(),
                PageRequest.of(offset, size),
                places.getTotalElements()
        );
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @GetMapping(path = "/reviews")
    public ResponseEntity<Page<ReviewItem>> getReviews(
            @RequestParam(name = "id") Long id,
            @RequestParam(name = "offset") @Nullable Integer offset,
            @RequestParam(name = "size") @Nullable Byte size
    ) {
        offset = (offset != null) ? offset : 0;
        size = (size != null) ? size : 10;
        Page<ReviewItem> reviews = placeService.getReviews(id, offset, size);
        Page<ReviewItem> page = new PageImpl<>(
                reviews.toList(),
                PageRequest.of(offset, size),
                reviews.getTotalElements()
        );
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @GetMapping(path = "/ratings")
    public ResponseEntity<List<RatingResponse>> getRatingsDistribution(@RequestParam(name = "id") Long id) {
        List<RatingResponse> distribution = placeService.getRatingsDistribution(id);
        return new ResponseEntity<>(distribution, HttpStatus.OK);
    }

    @PatchMapping(path = "/update")
    public ResponseEntity<PlaceResponse> updatePlace(
            @RequestParam(value = "id") Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) {
        PlaceRequest placeRequest = new PlaceRequest(name, address, description, null);
        PlaceResponse addedPlace = placeService.updatePlace(id, placeRequest, imageFile);
        return new ResponseEntity<>(addedPlace, HttpStatus.OK);
    }

    @PatchMapping(path = "/approve")
    public ResponseEntity<PlaceResponse> approvePlace(@RequestParam(value = "id") Long id) {
        PlaceResponse addedPlace = placeService.approvePlace(id);
        return new ResponseEntity<>(addedPlace, HttpStatus.OK);
    }

    @DeleteMapping(path = "/remove")
    public ResponseEntity<PlaceResponse> removePlace(@RequestParam(value = "id") Long id) {
        placeService.deletePlace(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
