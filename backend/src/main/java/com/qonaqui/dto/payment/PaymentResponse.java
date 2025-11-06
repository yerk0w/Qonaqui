package com.qonaqui.dto.payment;

import java.math.BigDecimal;
import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.qonaqui.model.enums.Currency;
import com.qonaqui.model.enums.PaymentMethod;
import com.qonaqui.model.enums.PaymentStatus;

public record PaymentResponse(
        @JsonProperty("id")
        String id,
        String bookingId,
        String userId,
        BigDecimal amount,
        Currency currency,
        PaymentMethod method,
        PaymentStatus status,
        String cardLast4Digits,
        String transactionId,
        Instant createdAt,
        Instant processedAt
) {}
