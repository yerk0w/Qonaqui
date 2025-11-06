package com.qonaqui.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.qonaqui.dto.booking.BookingResponse;
import com.qonaqui.dto.booking.CreateBookingRequest;
import com.qonaqui.dto.booking.UpdateBookingStatusRequest;
import com.qonaqui.model.enums.BookingStatus;
import com.qonaqui.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT','RECEPTIONIST','ADMIN')")
    public ResponseEntity<BookingResponse> createBooking(@Validated @RequestBody CreateBookingRequest request) {
        String userId = getCurrentUserId();
        return ResponseEntity.status(201).body(bookingService.createBooking(userId, request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('CLIENT','RECEPTIONIST','ADMIN')")
    public ResponseEntity<List<BookingResponse>> getMyBookings() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(bookingService.getBookingsForUser(userId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT','RECEPTIONIST','ADMIN')")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable String id, Authentication authentication) {
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                || a.getAuthority().equals("ROLE_RECEPTIONIST"))) {
            return ResponseEntity.ok(bookingService.getBookingById(id));
        }
        String userId = getCurrentUserId();
        return ResponseEntity.ok(bookingService.getBookingForUser(id, userId));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<BookingResponse>> getAllBookings(@RequestParam(required = false) BookingStatus status) {
        return ResponseEntity.ok(bookingService.getAllBookings(status));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<BookingResponse> updateStatus(@PathVariable String id,
                                                        @Validated @RequestBody UpdateBookingStatusRequest request) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, request));
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        }
        throw new IllegalStateException("Не удалось определить пользователя");
    }
}
