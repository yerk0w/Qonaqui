package com.qonaqui.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.qonaqui.model.Room;
import com.qonaqui.model.enums.RoomStatus;
import com.qonaqui.model.enums.RoomType;

public interface RoomRepository extends MongoRepository<Room, String> {

    Optional<Room> findByNumber(String number);

    List<Room> findByFloor(int floor);

    List<Room> findByType(RoomType type);

    List<Room> findByStatus(RoomStatus status);
}
