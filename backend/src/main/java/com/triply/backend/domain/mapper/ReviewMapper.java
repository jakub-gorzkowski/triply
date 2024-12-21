package com.triply.backend.domain.mapper;

import com.triply.backend.domain.dto.item.ReviewItem;
import com.triply.backend.domain.dto.request.ReviewRequest;
import com.triply.backend.domain.entity.Place;
import com.triply.backend.domain.entity.Review;
import com.triply.backend.domain.entity.User;

import java.time.LocalDateTime;

public class ReviewMapper {

    public static Review mapFromReviewRequest(ReviewRequest reviewRequest, User user, Place place) {
        return Review.builder()
                .user(user)
                .place(place)
                .rating(reviewRequest.getRating())
                .content(reviewRequest.getContent())
                .addedOn(LocalDateTime.now())
                .build();
    }

    public static ReviewItem mapToItem(Review review) {
        return ReviewItem.builder()
                .username(review.getUser().getRealUsername())
                .rating(review.getRating())
                .content(review.getContent())
                .addedOn(LocalDateTime.now())
                .build();
    }
}
