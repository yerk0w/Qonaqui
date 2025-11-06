package com.qonaqui.dto.loyalty;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record LoyaltyRedeemRequest(
        @Min(value = 1, message = "Количество баллов должно быть положительным")
        long points,
        @NotBlank(message = "Описание обязательно")
        String description
) {}
