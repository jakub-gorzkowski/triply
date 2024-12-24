package com.triply.backend.repository;

import com.triply.backend.domain.entity.Place;
import com.triply.backend.domain.entity.Trip;
import com.triply.backend.domain.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    Page<Trip> findByUserAndEndDateAfterOrderByEndDateAsc(User user, LocalDate date, Pageable pageable);

    Page<Trip> findByUserAndEndDateBeforeOrderByEndDateDesc(User user, LocalDate date, Pageable pageable);

    Optional<Trip> findFirstByUserAndStartDateAfterOrderByStartDateAsc(User user, LocalDate date);

    @Query("SELECT t.placeSet FROM Trip t WHERE t.id = :tripId")
    Page<Place> findTripPlaces(@Param("tripId") Long tripId, Pageable pageable);
}
