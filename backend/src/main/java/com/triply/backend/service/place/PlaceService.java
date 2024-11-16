package com.triply.backend.service.place;

import com.triply.backend.domain.dto.item.PlaceItem;
import com.triply.backend.domain.dto.item.ReviewItem;
import com.triply.backend.domain.dto.request.PlaceRequest;
import com.triply.backend.domain.dto.response.PlaceResponse;
import com.triply.backend.domain.dto.response.RatingResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PlaceService {

    PlaceResponse addPlace(PlaceRequest placeRequest, MultipartFile imageFile);
    Page<PlaceItem> getLatestPlaces(Integer offset, Byte size);
    Page<PlaceItem> getPopularPlaces(Integer offset, Byte size);
    Page<ReviewItem> getReviews(Long id, Integer offset, Byte size);
    List<RatingResponse> getRatingsDistribution(Long id);
    PlaceResponse updatePlace(Long id, PlaceRequest placeRequest, MultipartFile imageFile);
    PlaceResponse approvePlace(Long id);
    void deletePlace(Long id);
}
