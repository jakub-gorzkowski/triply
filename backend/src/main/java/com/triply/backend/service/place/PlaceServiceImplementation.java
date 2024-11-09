package com.triply.backend.service.place;

import com.triply.backend.domain.dto.item.PlaceItem;
import com.triply.backend.domain.dto.request.PlaceRequest;
import com.triply.backend.domain.dto.response.PlaceResponse;
import com.triply.backend.domain.entity.Place;
import com.triply.backend.domain.mapper.PlaceMapper;
import com.triply.backend.exception.throwable.PlaceNotFoundException;
import com.triply.backend.repository.PlaceRepository;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class PlaceServiceImplementation implements PlaceService {

    private final PlaceRepository placeRepository;
    private final Path fileStorageLocation = Paths.get("data/uploads/places").toAbsolutePath().normalize();

    @SneakyThrows
    public PlaceServiceImplementation(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
        Files.createDirectories(this.fileStorageLocation);
    }
    @Override
    @SneakyThrows
    public PlaceResponse addPlace(PlaceRequest placeRequest, MultipartFile imageFile) {
        String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(Objects.requireNonNull(imageFile.getOriginalFilename())).replace(" ", "-");
        Path targetLocation = fileStorageLocation.resolve(fileName);
        Files.copy(imageFile.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        placeRequest.setImageUrl("/data/uploads/places/" + fileName);
        Place savedPlace = placeRepository.save(PlaceMapper.mapFromPlaceRequest(placeRequest));
        return PlaceMapper.mapToResponse(savedPlace);
    }

    @Override
    public Page<PlaceItem> getLatestPlaces(Integer offset, Byte size) {
        return placeRepository.findAllByOrderByAddedOnDesc(PageRequest.of(offset, size))
                .map(PlaceMapper::mapToItem);
    }

    @Override
    @SneakyThrows
    public PlaceResponse updatePlace(Long id, PlaceRequest placeRequest, MultipartFile imageFile) {
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(Objects.requireNonNull(imageFile.getOriginalFilename())).replace(" ", "-");
            Path targetLocation = fileStorageLocation.resolve(fileName);
            Files.copy(imageFile.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            placeRequest.setImageUrl("/data/uploads/places/" + fileName);
        }

        Place updatedPlace = placeRepository.findById(id).map(existingPlace -> {
            Optional.ofNullable(placeRequest.getAddress()).ifPresent(existingPlace::setAddress);
            Optional.ofNullable(placeRequest.getName()).ifPresent(existingPlace::setName);
            Optional.ofNullable(placeRequest.getDescription()).ifPresent(existingPlace::setDescription);
            Optional.ofNullable(placeRequest.getImageUrl()).ifPresent(place -> {
                deleteImageIfExists(existingPlace.getImageUrl());
                existingPlace.setImageUrl(placeRequest.getImageUrl());
            });
            return placeRepository.save(existingPlace);
        }).orElseThrow(PlaceNotFoundException::new);

        return PlaceMapper.mapToResponse(updatedPlace);
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
