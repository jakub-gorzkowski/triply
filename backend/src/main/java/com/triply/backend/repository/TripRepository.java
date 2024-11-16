package com.triply.backend.repository;

import com.triply.backend.domain.entity.Trip;
import com.triply.backend.domain.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    Page<Trip> findByUserAndEndDateAfter(User user, LocalDate date, Pageable pageable);

    Page<Trip> findByUserAndEndDateBefore(User user, LocalDate date, Pageable pageable);

    Optional<Trip> findFirstByUserAndStartDateAfterOrderByStartDateAsc(User user, LocalDate date);
}
