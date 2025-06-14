package com.triply.backend.service.geocode;

import com.google.maps.model.GeocodingResult;
import com.triply.backend.domain.entity.Place;

public interface GeocodeService {

    GeocodingResult geocodeAddress(String address);
    void updatePlaceLocation(Place place);
}
