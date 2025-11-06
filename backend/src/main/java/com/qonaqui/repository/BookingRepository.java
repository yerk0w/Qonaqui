package com.qonaqui.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.qonaqui.model.Booking;
import com.qonaqui.model.enums.BookingStatus;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(String userId);

    List<Booking> findByRoomId(String roomId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByStatusIn(List<BookingStatus> statuses);

    List<Booking> findByCheckInDateBetween(LocalDate start, LocalDate end);

    List<Booking> findByCheckInDate(LocalDate date);

    List<Booking> findByCheckOutDate(LocalDate date);

    List<Booking> findByStatusAndCheckInDate(BookingStatus status, LocalDate date);

    List<Booking> findByStatusAndCheckOutDate(BookingStatus status, LocalDate date);

    boolean existsByRoomIdAndStatusInAndCheckOutDateGreaterThanAndCheckInDateLessThan(
            String roomId,
            List<BookingStatus> statuses,
            LocalDate checkInExclusive,
            LocalDate checkOutExclusive);
}
