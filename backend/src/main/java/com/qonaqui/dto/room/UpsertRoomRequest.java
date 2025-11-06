package com.qonaqui.dto.room;

import java.math.BigDecimal;
import java.util.List;

import com.qonaqui.model.embedded.RoomCoordinates;
import com.qonaqui.model.enums.BedType;
import com.qonaqui.model.enums.RoomStatus;
import com.qonaqui.model.enums.RoomType;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpsertRoomRequest(
        @NotBlank(message = "Номер комнаты обязателен")
        String number,

        @Min(value = 1, message = "Этаж должен быть не меньше 1")
        @Max(value = 20, message = "Этаж должен быть не больше 20")
        int floor,

        @NotNull(message = "Тип номера обязателен")
        RoomType type,

        @Positive(message = "Вместимость должна быть положительной")
        int capacity,

        @NotNull(message = "Цена обязательна")
        BigDecimal price,

        @Positive(message = "Площадь должна быть положительной")
        double area,

        @NotNull(message = "Тип кровати обязателен")
        BedType bedType,

        List<String> amenities,

        List<String> photos,

        String description,

        RoomStatus status,

        RoomCoordinates coordinates
) {}
