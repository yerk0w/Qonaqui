package com.qonaqui.dto.booking;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.qonaqui.model.embedded.AdditionalServiceItem;
import com.qonaqui.model.embedded.PassportData;
import com.qonaqui.model.enums.BookingStatus;
import com.qonaqui.model.enums.PaymentMethod;
import com.qonaqui.model.enums.PaymentStatus;

public record BookingResponse(
        @JsonProperty("id")
        String id,
        String userId,
        String roomId,
        String guestName,
        String guestPhone,
        String guestEmail,
        PassportData passportData,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        int numberOfGuests,
        int numberOfNights,
        BigDecimal totalPrice,
        BookingStatus status,
        PaymentStatus paymentStatus,
        PaymentMethod paymentMethod,
        List<AdditionalServiceItem> additionalServices,
        String specialRequests,
        Instant createdAt,
        Instant confirmedAt,
        Instant checkedInAt,
        Instant checkedOutAt
) {}
