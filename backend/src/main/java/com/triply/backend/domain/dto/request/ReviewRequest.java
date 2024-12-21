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
public class ReviewRequest {

    @JsonProperty(value = "user_email")
    private String userEmail;
    @JsonProperty(value = "place_id")
    private Long placeId;
    private Byte rating;
    private String content;
}
