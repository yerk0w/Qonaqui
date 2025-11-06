package com.qonaqui.dto.admin;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.qonaqui.model.embedded.PassportData;
import com.qonaqui.model.enums.Role;

public record UserSummaryResponse(
        @JsonProperty("id")
        String id,
        String name,
        String email,
        String phone,
        Role role,
        PassportData passportData,
        Instant createdAt,
        Instant updatedAt,
        long loyaltyPoints
) {}
