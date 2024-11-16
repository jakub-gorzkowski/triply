package com.triply.backend.service.trip;

import com.triply.backend.domain.dto.request.TripRequest;
import com.triply.backend.domain.dto.response.TripResponse;
import com.triply.backend.domain.entity.Trip;
import com.triply.backend.domain.entity.User;
import com.triply.backend.domain.mapper.TripMapper;
import com.triply.backend.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class TripServiceImplementation implements TripService {

    private final TripRepository tripRepository;

    @Override
    public TripResponse createTrip(User user, TripRequest request) {
        Trip trip = Trip.builder()
                .name(request.getName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .user(user)
                .placeSet(new HashSet<>())
                .build();

        Trip savedTrip = tripRepository.save(trip);
        return TripMapper.mapToResponse(savedTrip);
    }
}
