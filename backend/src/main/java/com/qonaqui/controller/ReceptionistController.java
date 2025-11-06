package com.qonaqui.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.qonaqui.dto.booking.BookingResponse;
import com.qonaqui.dto.booking.UpdateBookingStatusRequest;
import com.qonaqui.model.enums.BookingStatus;
import com.qonaqui.model.enums.PaymentStatus;
import com.qonaqui.service.BookingService;

@RestController
@RequestMapping("/api/reception")
@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
public class ReceptionistController {

    private final BookingService bookingService;

    public ReceptionistController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/arrivals")
    public ResponseEntity<List<BookingResponse>> getArrivals(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate target = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(bookingService.getArrivalsForDate(target));
    }

    @GetMapping("/departures")
    public ResponseEntity<List<BookingResponse>> getDepartures(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate target = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(bookingService.getDeparturesForDate(target));
    }

    @PatchMapping("/bookings/{id}/check-in")
    public ResponseEntity<BookingResponse> checkIn(@PathVariable String id) {
        UpdateBookingStatusRequest request = new UpdateBookingStatusRequest(BookingStatus.CHECKED_IN, PaymentStatus.SUCCESS);
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, request));
    }

    @PatchMapping("/bookings/{id}/check-out")
    public ResponseEntity<BookingResponse> checkOut(@PathVariable String id) {
        UpdateBookingStatusRequest request = new UpdateBookingStatusRequest(BookingStatus.CHECKED_OUT, PaymentStatus.SUCCESS);
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, request));
    }
}
