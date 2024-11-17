package com.triply.backend.domain.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "places")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private String address;

    private String description;

    @JsonProperty(value = "added_on")
    @Column(name = "added_on")
    private LocalDateTime addedOn;

    @JsonProperty(value = "image_url")
    @Column(name = "image_url")
    private String imageUrl;

    @JsonProperty(value = "is_approved")
    @Column(name = "is_approved")
    private Boolean isApproved = false;

    @OneToMany(mappedBy = "place")
    private Set<Review> reviewSet = new HashSet<>();

    @ManyToMany(mappedBy = "placeSet")
    private Set<Trip> tripSet;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

}
