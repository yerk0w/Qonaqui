package com.qonaqui.dto.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.qonaqui.model.enums.ServiceBookingStatus;

public record ServiceBookingResponse(
        @JsonProperty("id")
        String id,
        String userId,
        String serviceId,
        String bookingId,
        LocalDate date,
        LocalTime time,
        ServiceBookingStatus status,
        BigDecimal price,
        Instant createdAt
) {}
