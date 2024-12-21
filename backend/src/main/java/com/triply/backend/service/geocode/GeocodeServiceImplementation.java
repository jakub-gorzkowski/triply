package com.triply.backend.service.geocode;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.GeocodingResult;
import com.triply.backend.domain.entity.Place;
import com.triply.backend.exception.throwable.GeocodingException;
import com.triply.backend.repository.PlaceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class GeocodeServiceImplementation implements GeocodeService {

    private final GeoApiContext geoApiContext;
    private final PlaceRepository placeRepository;

    @SneakyThrows
    public GeocodingResult geocodeAddress(String address) {
        try {
            GeocodingResult[] results = GeocodingApi.geocode(geoApiContext, address).await();
            if (results != null && results.length > 0) {
                return results[0];
            }
            return null;
        } catch (Exception e) {
            throw new GeocodingException();
        }
    }

    @Transactional
    public void updatePlaceLocation(Place place) {
        GeocodingResult result = geocodeAddress(place.getAddress());
        if (result != null) {
            place.setLatitude(BigDecimal.valueOf(result.geometry.location.lat));
            place.setLongitude(BigDecimal.valueOf(result.geometry.location.lng));
            placeRepository.save(place);
        }
    }
}
