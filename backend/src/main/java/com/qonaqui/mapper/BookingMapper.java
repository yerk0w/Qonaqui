package com.qonaqui.mapper;

import com.qonaqui.dto.booking.BookingResponse;
import com.qonaqui.model.Booking;

public final class BookingMapper {

    private BookingMapper() {
    }

    public static BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getUserId(),
                booking.getRoomId(),
                booking.getGuestName(),
                booking.getGuestPhone(),
                booking.getGuestEmail(),
                booking.getPassportData(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getNumberOfGuests(),
                booking.getNumberOfNights(),
                booking.getTotalPrice(),
                booking.getStatus(),
                booking.getPaymentStatus(),
                booking.getPaymentMethod(),
                booking.getAdditionalServices(),
                booking.getSpecialRequests(),
                booking.getCreatedAt(),
                booking.getConfirmedAt(),
                booking.getCheckedInAt(),
                booking.getCheckedOutAt()
        );
    }
}
