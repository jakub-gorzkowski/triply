package com.triply.backend.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceResponse {

    private Long id;

    private String name;

    private String address;

    private String description;

    @JsonProperty(value = "added_on")
    private LocalDateTime addedOn;

    @JsonProperty(value = "image_url")
    private String imageUrl;

    @JsonProperty(value = "is_approved")
    private Boolean isApproved;
}
