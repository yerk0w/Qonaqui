package com.qonaqui.dto.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateServiceBookingRequest(
        @NotBlank(message = "ID услуги обязателен")
        String serviceId,

        String bookingId,

        @NotNull(message = "Дата обязательна")
        @Future(message = "Дата должна быть в будущем")
        LocalDate date,

        @NotNull(message = "Время обязательно")
        LocalTime time,

        @Positive(message = "Цена должна быть положительной")
        BigDecimal price
) {}
