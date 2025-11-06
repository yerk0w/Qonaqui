package com.qonaqui.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qonaqui.dto.loyalty.LoyaltyRedeemRequest;
import com.qonaqui.dto.loyalty.LoyaltyTransactionResponse;
import com.qonaqui.service.LoyaltyService;

@RestController
@RequestMapping("/api/loyalty")
@Validated
public class LoyaltyController {

    private final LoyaltyService loyaltyService;

    public LoyaltyController(LoyaltyService loyaltyService) {
        this.loyaltyService = loyaltyService;
    }

    @GetMapping("/history")
    public ResponseEntity<List<LoyaltyTransactionResponse>> getHistory() {
        return ResponseEntity.ok(loyaltyService.getHistory(getCurrentUserId()));
    }

    @PostMapping("/redeem")
    public ResponseEntity<Void> redeem(@Validated @RequestBody LoyaltyRedeemRequest request) {
        loyaltyService.redeem(getCurrentUserId(), request.points(), request.description());
        return ResponseEntity.noContent().build();
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
