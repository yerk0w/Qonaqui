package com.qonaqui.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.qonaqui.model.Review;
import com.qonaqui.model.enums.ReviewStatus;

public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByRoomId(String roomId);

    List<Review> findByUserId(String userId);

    List<Review> findByStatus(ReviewStatus status);

    Optional<Review> findByBookingId(String bookingId);
}
