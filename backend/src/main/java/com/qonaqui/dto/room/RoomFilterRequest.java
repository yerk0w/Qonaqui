package com.qonaqui.dto.room;

import java.math.BigDecimal;
import java.util.List;

import com.qonaqui.model.enums.RoomType;

public record RoomFilterRequest(
        Integer floor,
        RoomType type,
        Integer capacity,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        List<String> amenities
) {}
