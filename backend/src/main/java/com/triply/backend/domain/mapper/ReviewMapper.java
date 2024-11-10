package com.triply.backend.domain.mapper;

import com.triply.backend.domain.dto.item.ReviewItem;
import com.triply.backend.domain.entity.Review;

public class ReviewMapper {

    public static ReviewItem mapToItem(Review review) {
        return ReviewItem.builder()
                .rating(review.getRating())
                .content(review.getContent())
                .build();
    }
}
