package com.triply.backend.domain.dto.item;

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
public class ReviewItem {

    private Long id;
    private String username;
    private Byte rating;
    private String content;
    @JsonProperty(value = "added_on")
    private LocalDateTime addedOn;
}
