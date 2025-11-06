package com.qonaqui.dto.service;

import java.math.BigDecimal;
import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.qonaqui.model.embedded.ServiceAvailability;
import com.qonaqui.model.enums.ServiceCategory;

public record ServiceResponse(
        @JsonProperty("id")
        String id,
        String name,
        ServiceCategory category,
        String description,
        BigDecimal price,
        Integer durationMinutes,
        ServiceAvailability availability,
        String photo,
        Instant createdAt,
        Instant updatedAt
) {}
