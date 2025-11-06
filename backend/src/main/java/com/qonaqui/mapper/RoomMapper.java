package com.qonaqui.mapper;

import com.qonaqui.dto.room.RoomResponse;
import com.qonaqui.model.Room;

public final class RoomMapper {

    private RoomMapper() {
    }

    public static RoomResponse toResponse(Room room) {
        return new RoomResponse(
                room.getId(),
                room.getNumber(),
                room.getFloor(),
                room.getType(),
                room.getCapacity(),
                room.getPrice(),
                room.getArea(),
                room.getBedType(),
                room.getAmenities(),
                room.getPhotos(),
                room.getDescription(),
                room.getStatus(),
                room.getCoordinates(),
                room.getCreatedAt(),
                room.getUpdatedAt()
        );
    }
}
