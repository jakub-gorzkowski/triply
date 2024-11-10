package com.triply.backend.controller;

import com.triply.backend.domain.dto.item.ReviewItem;
import com.triply.backend.domain.dto.request.ReviewRequest;
import com.triply.backend.service.review.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping(path = "/add")
    public ResponseEntity<ReviewItem> addReview(@RequestBody ReviewRequest reviewRequest) {
        ReviewItem reviewItem = reviewService.addReview(reviewRequest);
        return new ResponseEntity<>(reviewItem, HttpStatus.CREATED);
    }

    @DeleteMapping(path = "/remove")
    public ResponseEntity<ReviewItem> removeReview(@RequestParam("id") Long id) {
        reviewService.deleteReview(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
