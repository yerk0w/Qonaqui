package com.qonaqui.dto.review;

import com.qonaqui.model.enums.ReviewStatus;

import jakarta.validation.constraints.NotNull;

public record ModerateReviewRequest(
        @NotNull(message = "Новый статус обязателен")
        ReviewStatus status,
        String responseText
) {}
