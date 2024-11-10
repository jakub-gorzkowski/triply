package com.triply.backend.service.review;

import com.triply.backend.domain.dto.item.ReviewItem;
import com.triply.backend.domain.dto.request.ReviewRequest;

public interface ReviewService {

    ReviewItem addReview(ReviewRequest reviewRequest);
    void deleteReview(Long id);
}
