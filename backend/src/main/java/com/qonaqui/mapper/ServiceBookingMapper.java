package com.qonaqui.mapper;

import com.qonaqui.dto.service.ServiceBookingResponse;
import com.qonaqui.model.ServiceBooking;

public final class ServiceBookingMapper {

    private ServiceBookingMapper() {
    }

    public static ServiceBookingResponse toResponse(ServiceBooking booking) {
        return new ServiceBookingResponse(
                booking.getId(),
                booking.getUserId(),
                booking.getServiceId(),
                booking.getBookingId(),
                booking.getDate(),
                booking.getTime(),
                booking.getStatus(),
                booking.getPrice(),
                booking.getCreatedAt()
        );
    }
}
