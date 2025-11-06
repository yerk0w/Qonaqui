package com.qonaqui.dto.service;

import java.math.BigDecimal;

import com.qonaqui.model.embedded.ServiceAvailability;
import com.qonaqui.model.enums.ServiceCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpsertServiceRequest(
        @NotBlank(message = "Название услуги обязательно")
        String name,

        @NotNull(message = "Категория обязательна")
        ServiceCategory category,

        String description,

        @Positive(message = "Цена должна быть положительной")
        BigDecimal price,

        Integer durationMinutes,

        ServiceAvailability availability,

        String photo
) {}
