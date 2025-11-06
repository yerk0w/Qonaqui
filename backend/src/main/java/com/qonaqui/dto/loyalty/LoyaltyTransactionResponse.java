package com.qonaqui.dto.loyalty;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.qonaqui.model.enums.LoyaltyTransactionType;

public record LoyaltyTransactionResponse(
        @JsonProperty("id")
        String id,
        LoyaltyTransactionType type,
        long points,
        String description,
        Instant createdAt
) {}
