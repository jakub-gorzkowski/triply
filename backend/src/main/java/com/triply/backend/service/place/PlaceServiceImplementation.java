package com.triply.backend.service.place;

import com.triply.backend.domain.dto.item.PlaceItem;
import com.triply.backend.domain.dto.request.PlaceRequest;
import com.triply.backend.domain.dto.response.PlaceResponse;
import com.triply.backend.domain.entity.Place;
import com.triply.backend.domain.mapper.PlaceMapper;
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
import java.util.UUID;

@Service
public class PlaceServiceImplementation implements PlaceService {

    private final PlaceRepository placeRepository;
    private final Path fileStorageLocation = Paths.get("data/uploads/places").toAbsolutePath().normalize();

    public PlaceServiceImplementation(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception exception) {
            throw new RuntimeException("Could not create upload directory", exception);
        }
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

    public Page<PlaceItem> getLatestPlaces(Integer offset, Byte size) {
        return placeRepository.findAllByOrderByAddedOnDesc(PageRequest.of(offset, size))
                .map(PlaceMapper::mapToItem);
    }
}
