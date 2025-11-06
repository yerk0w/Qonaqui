package com.qonaqui.dto.booking;

import com.qonaqui.model.enums.BookingStatus;
import com.qonaqui.model.enums.PaymentStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateBookingStatusRequest(
        @NotNull(message = "Новый статус бронирования обязателен")
        BookingStatus status,
        PaymentStatus paymentStatus
) {}
