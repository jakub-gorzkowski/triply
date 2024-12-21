package com.triply.backend.repository;

import com.triply.backend.domain.entity.Place;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {

    Page<Place> findByIsApprovedTrueOrderByAddedOnDesc(Pageable pageable);
    Page<Place> findByIsApprovedFalseOrderByAddedOnAsc(Pageable pageable);
    @Query("SELECT p FROM Place p LEFT JOIN p.reviewSet r WHERE p.isApproved = true GROUP BY p ORDER BY COUNT(r) DESC")
    Page<Place> findAllApprovedOrderByReviewCountDesc(Pageable pageable);

    @Query("SELECT p FROM Place p WHERE " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
            "(:city IS NULL OR LOWER(p.address) LIKE LOWER(CONCAT('%', :city, '%')))")
    Page<Place> findBySearchCriteria(
            @Param("categoryId") Long categoryId,
            @Param("city") String city,
            Pageable pageable
    );
}
