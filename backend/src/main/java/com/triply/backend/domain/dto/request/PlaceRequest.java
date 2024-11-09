package com.triply.backend.domain.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceRequest {

    public PlaceRequest(String name, String address, String description, String imageUrl) {
        this.name = name;
        this.address = address;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    private Long id;

    private String name;

    private String address;

    private String description;

    @JsonProperty(value = "image_url")
    private String imageUrl;
}
