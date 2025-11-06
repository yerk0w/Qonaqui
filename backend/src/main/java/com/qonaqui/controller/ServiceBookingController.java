package com.qonaqui.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.qonaqui.dto.service.CreateServiceBookingRequest;
import com.qonaqui.dto.service.ServiceBookingResponse;
import com.qonaqui.dto.service.UpdateServiceBookingStatusRequest;
import com.qonaqui.model.enums.ServiceBookingStatus;
import com.qonaqui.service.ServiceBookingService;

@RestController
@RequestMapping("/api/service-bookings")
public class ServiceBookingController {

    private final ServiceBookingService bookingService;

    public ServiceBookingController(ServiceBookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT','RECEPTIONIST','ADMIN')")
    public ResponseEntity<ServiceBookingResponse> create(@Validated @RequestBody CreateServiceBookingRequest request) {
        String userId = currentUserId();
        return ResponseEntity.status(201).body(bookingService.createBooking(userId, request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('CLIENT','RECEPTIONIST','ADMIN')")
    public ResponseEntity<List<ServiceBookingResponse>> myBookings() {
        return ResponseEntity.ok(bookingService.listBookingsForUser(currentUserId()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<ServiceBookingResponse>> listAll(
            @RequestParam(required = false) ServiceBookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(bookingService.listBookings(status, date));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<ServiceBookingResponse> updateStatus(@PathVariable String id,
                                                               @Validated @RequestBody UpdateServiceBookingStatusRequest request) {
        return ResponseEntity.ok(bookingService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT','RECEPTIONIST','ADMIN')")
    public ResponseEntity<Void> cancel(@PathVariable String id, Authentication authentication) {
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                || a.getAuthority().equals("ROLE_RECEPTIONIST"))) {
            bookingService.updateStatus(id, new UpdateServiceBookingStatusRequest(ServiceBookingStatus.CANCELLED));
        } else {
            bookingService.cancelBooking(id, currentUserId());
        }
        return ResponseEntity.noContent().build();
    }

    private String currentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        }
        throw new IllegalStateException("Не удалось определить пользователя");
    }
}
