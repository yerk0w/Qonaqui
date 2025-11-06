package com.qonaqui.dto.room;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.qonaqui.model.embedded.RoomCoordinates;
import com.qonaqui.model.enums.BedType;
import com.qonaqui.model.enums.RoomStatus;
import com.qonaqui.model.enums.RoomType;

public record RoomResponse(
        @JsonProperty("id")
        String id,
        String number,
        int floor,
        RoomType type,
        int capacity,
        BigDecimal price,
        double area,
        BedType bedType,
        List<String> amenities,
        List<String> photos,
        String description,
        RoomStatus status,
        RoomCoordinates coordinates,
        Instant createdAt,
        Instant updatedAt
) {}
