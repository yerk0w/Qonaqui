package com.qonaqui.dto.booking;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record AdditionalServiceSelection(
        @NotBlank(message = "ID услуги обязателен")
        String serviceId,

        @Min(value = 1, message = "Количество должно быть не меньше 1")
        int quantity
) {}
