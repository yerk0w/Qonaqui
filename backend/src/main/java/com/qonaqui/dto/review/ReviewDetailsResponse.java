package com.qonaqui.dto.review;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.qonaqui.model.embedded.ReviewResponse;
import com.qonaqui.model.enums.ReviewStatus;

public record ReviewDetailsResponse(
        @JsonProperty("id")
        String id,
        String userId,
        String roomId,
        String bookingId,
        int rating,
        String comment,
        List<String> photos,
        ReviewResponse response,
        Instant createdAt,
        Instant moderatedAt,
        ReviewStatus status
) {}
