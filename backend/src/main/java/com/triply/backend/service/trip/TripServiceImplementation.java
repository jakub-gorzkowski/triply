package com.triply.backend.service.trip;

import com.triply.backend.domain.dto.item.PlaceItem;
import com.triply.backend.domain.dto.request.TripRequest;
import com.triply.backend.domain.dto.response.TripResponse;
import com.triply.backend.domain.entity.Trip;
import com.triply.backend.domain.entity.User;
import com.triply.backend.domain.mapper.PlaceMapper;
import com.triply.backend.domain.mapper.TripMapper;
import com.triply.backend.exception.throwable.AccessDeniedException;
import com.triply.backend.exception.throwable.TripNotFoundException;
import com.triply.backend.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Optional;

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

    @Override
    public Page<TripResponse> getUpcomingTrips(User user, Integer offset, Byte size) {
        return tripRepository.findByUserAndEndDateAfter(user, LocalDate.now(), PageRequest.of(offset, size))
                .map(TripMapper::mapToResponse);
    }

    @Override
    public Page<TripResponse> getPastTrips(User user, Integer offset, Byte size) {
        return tripRepository.findByUserAndEndDateBefore(user, LocalDate.now(), PageRequest.of(offset, size))
                .map(TripMapper::mapToResponse);
    }

    @Override
    @SneakyThrows
    public TripResponse getNextTrip(User user) {
        return tripRepository.findFirstByUserAndStartDateAfterOrderByStartDateAsc(user, LocalDate.now())
                .map(TripMapper::mapToResponse)
                .orElseThrow(TripNotFoundException::new);
    }

    @Override
    @SneakyThrows
    public Page<PlaceItem> getTripPlaces(User user, Long tripId, Integer offset, Byte size) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(TripNotFoundException::new);
        if (!trip.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException();
        }

        return tripRepository.findTripPlaces(trip.getId(), PageRequest.of(offset, size))
                .map(PlaceMapper::mapToItem);
    }

    @Override
    @SneakyThrows
    public TripResponse updateTrip(User user, Long tripId, TripRequest tripRequest) {
        Trip updatedTrip = tripRepository.findById(tripId).map(existingTrip -> {
            Optional.ofNullable(tripRequest.getName()).ifPresent(existingTrip::setName);
            Optional.ofNullable(tripRequest.getStartDate()).ifPresent(existingTrip::setStartDate);
            Optional.ofNullable(tripRequest.getEndDate()).ifPresent(existingTrip::setEndDate);

            return tripRepository.save(existingTrip);
        }).orElseThrow(TripNotFoundException::new);

        if (!updatedTrip.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException();
        }

        return TripMapper.mapToResponse(updatedTrip);
    }
}
