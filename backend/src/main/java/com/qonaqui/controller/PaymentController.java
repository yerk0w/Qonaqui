package com.qonaqui.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.qonaqui.dto.payment.CreatePaymentRequest;
import com.qonaqui.dto.payment.PaymentResponse;
import com.qonaqui.model.enums.PaymentStatus;
import com.qonaqui.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT','RECEPTIONIST','ADMIN')")
    public ResponseEntity<PaymentResponse> create(@Validated @RequestBody CreatePaymentRequest request) {
        return ResponseEntity.status(201).body(paymentService.createPayment(currentUserId(), request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('CLIENT','RECEPTIONIST','ADMIN')")
    public ResponseEntity<List<PaymentResponse>> myPayments() {
        return ResponseEntity.ok(paymentService.listPaymentsForUser(currentUserId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentResponse>> listAll(@RequestParam(required = false) PaymentStatus status) {
        return ResponseEntity.ok(paymentService.listPayments(status));
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
