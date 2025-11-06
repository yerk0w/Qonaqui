package com.qonaqui.dto.review;

import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateReviewRequest(
        @NotBlank(message = "ID бронирования обязателен")
        String bookingId,

        @NotBlank(message = "ID номера обязателен")
        String roomId,

        @Min(value = 1, message = "Минимальная оценка 1")
        @Max(value = 5, message = "Максимальная оценка 5")
        int rating,

        @NotBlank(message = "Комментарий обязателен")
        String comment,

        List<String> photos
) {}
