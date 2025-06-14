package com.triply.backend.service.review;

import com.triply.backend.domain.dto.item.ReviewItem;
import com.triply.backend.domain.dto.request.ReviewRequest;
import com.triply.backend.domain.entity.Place;
import com.triply.backend.domain.entity.Review;
import com.triply.backend.domain.entity.User;
import com.triply.backend.domain.mapper.ReviewMapper;
import com.triply.backend.exception.throwable.PlaceNotFoundException;
import com.triply.backend.exception.throwable.UserNotFoundException;
import com.triply.backend.repository.PlaceRepository;
import com.triply.backend.repository.ReviewRepository;
import com.triply.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewServiceImplementation implements ReviewService {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final PlaceRepository placeRepository;

    @Override
    @SneakyThrows
    @Transactional
    public ReviewItem addReview(ReviewRequest reviewRequest) {
        Place place = placeRepository.findById(reviewRequest.getPlaceId()).orElseThrow(PlaceNotFoundException::new);
        User user = userRepository.findByEmail(reviewRequest.getUserEmail()).orElseThrow(UserNotFoundException::new);
        Review review = ReviewMapper.mapFromReviewRequest(reviewRequest, user, place);
        return ReviewMapper.mapToItem(reviewRepository.save(review));
    }

    @Override
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
