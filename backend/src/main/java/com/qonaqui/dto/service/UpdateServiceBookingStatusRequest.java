package com.qonaqui.dto.service;

import com.qonaqui.model.enums.ServiceBookingStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateServiceBookingStatusRequest(
        @NotNull(message = "Новый статус обязателен")
        ServiceBookingStatus status
) {}
