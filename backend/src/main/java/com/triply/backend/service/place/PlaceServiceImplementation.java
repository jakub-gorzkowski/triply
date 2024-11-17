package com.triply.backend.service.place;

import com.triply.backend.domain.dto.item.PlaceItem;
import com.triply.backend.domain.dto.item.ReviewItem;
import com.triply.backend.domain.dto.request.PlaceRequest;
import com.triply.backend.domain.dto.response.PlaceResponse;
import com.triply.backend.domain.dto.response.RatingResponse;
import com.triply.backend.domain.entity.Category;
import com.triply.backend.domain.entity.Place;
import com.triply.backend.domain.mapper.PlaceMapper;
import com.triply.backend.domain.mapper.ReviewMapper;
import com.triply.backend.exception.throwable.CategoryNotFoundException;
import com.triply.backend.exception.throwable.PlaceNotFoundException;
import com.triply.backend.repository.CategoryRepository;
import com.triply.backend.repository.PlaceRepository;
import com.triply.backend.repository.ReviewRepository;
import jakarta.transaction.Transactional;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class PlaceServiceImplementation implements PlaceService {

    private final PlaceRepository placeRepository;
    private final ReviewRepository reviewRepository;
    private final CategoryRepository categoryRepository;
    private final Path fileStorageLocation = Paths.get("data/uploads/places").toAbsolutePath().normalize();

    @SneakyThrows
    public PlaceServiceImplementation(
            PlaceRepository placeRepository,
            ReviewRepository reviewRepository,
            CategoryRepository categoryRepository
    ) {
        this.placeRepository = placeRepository;
        this.reviewRepository = reviewRepository;
        this.categoryRepository = categoryRepository;
        Files.createDirectories(this.fileStorageLocation);
    }

    @Override
    @SneakyThrows
    @Transactional
    public PlaceResponse addPlace(PlaceRequest placeRequest, MultipartFile imageFile) {
        String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(Objects.requireNonNull(imageFile.getOriginalFilename())).replace(" ", "-");
        Path targetLocation = fileStorageLocation.resolve(fileName);
        Files.copy(imageFile.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        placeRequest.setImageUrl("/data/uploads/places/" + fileName);
        Place place = PlaceMapper.mapFromPlaceRequest(placeRequest);
        Long categoryId = placeRequest.getCategoryId();

        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId).orElseThrow(CategoryNotFoundException::new);
            place.setCategory(category);
        }

        Place savedPlace = placeRepository.save(place);
        return PlaceMapper.mapToResponse(savedPlace);
    }

    @Override
    @SneakyThrows
    public Place getPlaceById(Long id) {
        return placeRepository.findById(id).orElseThrow(PlaceNotFoundException::new);
    }

    @Override
    public Page<PlaceItem> getLatestPlaces(Integer offset, Byte size) {
        return placeRepository.findByIsApprovedTrueOrderByAddedOnDesc(PageRequest.of(offset, size))
                .map(PlaceMapper::mapToItem);
    }

    @Override
    public Page<PlaceItem> getPopularPlaces(Integer offset, Byte size) {
        return placeRepository.findAllApprovedOrderByReviewCountDesc(PageRequest.of(offset, size))
                .map(PlaceMapper::mapToItem);
    }

    @Override
    @SneakyThrows
    public Page<ReviewItem> getReviews(Long id, Integer offset, Byte size) {
        return reviewRepository.findAllByPlaceId(id,
                        PageRequest.of(offset, size, Sort.by(Sort.Direction.DESC, "addedOn")))
                .map(ReviewMapper::mapToItem);
    }

    @Override
    public Page<PlaceItem> searchPlaces(Long categoryId, String city, Integer offset, Byte size) {
        return placeRepository.findBySearchCriteria(
                categoryId,
                city,
                PageRequest.of(offset, size)
        ).map(PlaceMapper::mapToItem);
    }

    @Override
    @SneakyThrows
    public List<RatingResponse> getRatingsDistribution(Long id) {
        placeRepository.findById(id).orElseThrow(PlaceNotFoundException::new);
        List<RatingResponse> distribution = new ArrayList<>();
        Long total = reviewRepository.countReviewsByPlaceId(id);

        for (Byte rating = 1; rating <= 5; rating++) {
            Long ratings = reviewRepository.countReviewsByPlaceIdAndRating(id, rating);
            Double ratingPercentage = BigDecimal.valueOf(100 * Double.valueOf(ratings) / total)
                    .setScale(2, RoundingMode.HALF_UP)
                    .doubleValue();

            distribution.add(RatingResponse.builder()
                    .rate(rating.toString())
                    .percentage(ratingPercentage)
                    .build()
            );
        }
        return distribution;
    }

    @Override
    @SneakyThrows
    @Transactional
    public PlaceResponse updatePlace(Long id, PlaceRequest placeRequest, MultipartFile imageFile) {
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(Objects.requireNonNull(imageFile.getOriginalFilename())).replace(" ", "-");
            Path targetLocation = fileStorageLocation.resolve(fileName);
            Files.copy(imageFile.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            placeRequest.setImageUrl("/data/uploads/places/" + fileName);
        }

        Category category = categoryRepository.findById(placeRequest.getCategoryId())
                .orElseThrow(CategoryNotFoundException::new);

        Place updatedPlace = placeRepository.findById(id).map(existingPlace -> {
            Optional.ofNullable(placeRequest.getAddress()).ifPresent(existingPlace::setAddress);
            Optional.ofNullable(placeRequest.getName()).ifPresent(existingPlace::setName);
            Optional.ofNullable(placeRequest.getDescription()).ifPresent(existingPlace::setDescription);
            Optional.ofNullable(placeRequest.getCategoryId()).ifPresent(categoryId -> existingPlace.setCategory(category));
            Optional.ofNullable(placeRequest.getImageUrl()).ifPresent(place -> {
                deleteImageIfExists(existingPlace.getImageUrl());
                existingPlace.setImageUrl(placeRequest.getImageUrl());
            });
            return placeRepository.save(existingPlace);
        }).orElseThrow(PlaceNotFoundException::new);

        return PlaceMapper.mapToResponse(updatedPlace);
    }

    @Override
    @SneakyThrows
    public PlaceResponse approvePlace(Long id) {
        Place approvedPlace = placeRepository.findById(id).map(existingPlace -> {
            Optional.of(id).ifPresent(existingPlace::setId);
            Optional.of(true).ifPresent(existingPlace::setIsApproved);
            Optional.of(LocalDateTime.now()).ifPresent(existingPlace::setAddedOn);
            return placeRepository.save(existingPlace);
        }).orElseThrow(PlaceNotFoundException::new);

        return PlaceMapper.mapToResponse(approvedPlace);
    }

    @Override
    @SneakyThrows
    public void deletePlace(Long id) {
        Place existingPlace = placeRepository.findById(id).orElseThrow(PlaceNotFoundException::new);
        deleteImageIfExists(existingPlace.getImageUrl());
        placeRepository.deleteById(id);
    }

    @SneakyThrows
    private void deleteImageIfExists(String imageUrl) {
        if (imageUrl != null && !imageUrl.isEmpty()) {
            String fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            Path imagePath = fileStorageLocation.resolve(fileName);
            Files.deleteIfExists(imagePath);
        }
    }
}
