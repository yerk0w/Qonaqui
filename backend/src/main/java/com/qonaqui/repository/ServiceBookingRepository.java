package com.qonaqui.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.qonaqui.model.ServiceBooking;
import com.qonaqui.model.enums.ServiceBookingStatus;

public interface ServiceBookingRepository extends MongoRepository<ServiceBooking, String> {

    List<ServiceBooking> findByUserId(String userId);

    List<ServiceBooking> findByServiceId(String serviceId);

    List<ServiceBooking> findByStatus(ServiceBookingStatus status);

    List<ServiceBooking> findByDate(LocalDate date);
}
