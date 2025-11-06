package com.qonaqui.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.qonaqui.model.Payment;
import com.qonaqui.model.enums.PaymentStatus;

public interface PaymentRepository extends MongoRepository<Payment, String> {

    List<Payment> findByUserId(String userId);

    List<Payment> findByBookingId(String bookingId);

    List<Payment> findByStatus(PaymentStatus status);

    Optional<Payment> findTopByBookingIdOrderByCreatedAtDesc(String bookingId);
}
