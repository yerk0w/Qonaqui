package com.qonaqui.dto.review;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ReviewResponse(
        @JsonProperty("id")
        String id,
        String userId,
        String roomId,
        String bookingId,
        int rating,
        String comment,
        List<String> photos,
        Instant createdAt
) {}
