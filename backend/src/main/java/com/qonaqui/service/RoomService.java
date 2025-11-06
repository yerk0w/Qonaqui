package com.qonaqui.service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.qonaqui.dto.room.RoomFilterRequest;
import com.qonaqui.dto.room.RoomResponse;
import com.qonaqui.dto.room.UpsertRoomRequest;
import com.qonaqui.exception.BadRequestException;
import com.qonaqui.exception.NotFoundException;
import com.qonaqui.mapper.RoomMapper;
import com.qonaqui.model.Room;
import com.qonaqui.model.enums.RoomStatus;
import com.qonaqui.repository.RoomRepository;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<RoomResponse> findRooms(RoomFilterRequest filter) {
        return roomRepository.findAll().stream()
                .filter(room -> filter.floor() == null || room.getFloor() == filter.floor())
                .filter(room -> filter.type() == null || room.getType() == filter.type())
                .filter(room -> filter.capacity() == null || room.getCapacity() >= filter.capacity())
                .filter(room -> matchesPrice(room.getPrice(), filter.minPrice(), filter.maxPrice()))
                .filter(room -> matchesAmenities(room.getAmenities(), filter.amenities()))
                .sorted(Comparator.comparing(Room::getFloor).thenComparing(Room::getNumber))
                .map(RoomMapper::toResponse)
                .toList();
    }

    public RoomResponse getRoomById(String id) {
        return RoomMapper.toResponse(findRoomOrThrow(id));
    }

    public RoomResponse createRoom(UpsertRoomRequest request) {
        validateNumberUnique(request.number(), null);
        Room room = new Room();
        applyRequestToRoom(room, request);
        room.setStatus(request.status() != null ? request.status() : RoomStatus.AVAILABLE);
        return RoomMapper.toResponse(roomRepository.save(room));
    }

    public RoomResponse updateRoom(String id, UpsertRoomRequest request) {
        Room room = findRoomOrThrow(id);
        validateNumberUnique(request.number(), id);
        applyRequestToRoom(room, request);
        if (request.status() != null) {
            room.setStatus(request.status());
        }
        return RoomMapper.toResponse(roomRepository.save(room));
    }

    public RoomResponse updateStatus(String id, RoomStatus status) {
        Room room = findRoomOrThrow(id);
        room.setStatus(status);
        return RoomMapper.toResponse(roomRepository.save(room));
    }

    public void deleteRoom(String id) {
        Room room = findRoomOrThrow(id);
        roomRepository.delete(room);
    }

    private Room findRoomOrThrow(String id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Номер не найден"));
    }

    private void validateNumberUnique(String number, String currentRoomId) {
        if (!StringUtils.hasText(number)) {
            throw new BadRequestException("Номер комнаты обязателен");
        }
        roomRepository.findByNumber(number).ifPresent(existing -> {
            if (!Objects.equals(existing.getId(), currentRoomId)) {
                throw new BadRequestException("Комната с номером " + number + " уже существует");
            }
        });
    }

    private void applyRequestToRoom(Room room, UpsertRoomRequest request) {
        room.setNumber(request.number());
        room.setFloor(request.floor());
        room.setType(request.type());
        room.setCapacity(request.capacity());
        room.setPrice(request.price());
        room.setArea(request.area());
        room.setBedType(request.bedType());
        room.setAmenities(request.amenities());
        room.setPhotos(request.photos());
        room.setDescription(request.description());
        room.setCoordinates(request.coordinates());
    }

    private boolean matchesPrice(BigDecimal price, BigDecimal min, BigDecimal max) {
        if (price == null) {
            return true;
        }
        boolean greaterThanMin = min == null || price.compareTo(min) >= 0;
        boolean lessThanMax = max == null || price.compareTo(max) <= 0;
        return greaterThanMin && lessThanMax;
    }

    private boolean matchesAmenities(List<String> roomAmenities, List<String> requestedAmenities) {
        if (requestedAmenities == null || requestedAmenities.isEmpty()) {
            return true;
        }
        if (roomAmenities == null || roomAmenities.isEmpty()) {
            return false;
        }
        var normalizedRoomAmenities = roomAmenities.stream()
                .filter(StringUtils::hasText)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        return requestedAmenities.stream()
                .filter(StringUtils::hasText)
                .map(String::toLowerCase)
                .allMatch(normalizedRoomAmenities::contains);
    }
}
