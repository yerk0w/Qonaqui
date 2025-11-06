package com.qonaqui.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.qonaqui.model.Floor;

public interface FloorRepository extends MongoRepository<Floor, String> {

    Optional<Floor> findByFloorNumber(int floorNumber);
}
