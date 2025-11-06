package com.qonaqui.dto;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserResponse(
        @JsonProperty("_id")
        String id,
        String name,
        String email,
        String role,
        Instant createdAt
) {}
