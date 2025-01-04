package com.triply.backend.domain.dto.item;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceItem {

    private Long id;
    @JsonProperty(value = "image_url")
    private String imageUrl;
    private String name;
    private String description;
    private String address;
    private String category;
    private BigDecimal latitude;
    private BigDecimal longitude;
    @JsonProperty(value = "added_on")
    private LocalDateTime addedOn;
}
