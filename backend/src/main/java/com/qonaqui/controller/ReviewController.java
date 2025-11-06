package com.qonaqui.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.qonaqui.dto.review.CreateReviewRequest;
import com.qonaqui.dto.review.ModerateReviewRequest;
import com.qonaqui.dto.review.ReviewDetailsResponse;
import com.qonaqui.dto.review.ReviewResponse;
import com.qonaqui.model.enums.ReviewStatus;
import com.qonaqui.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<ReviewResponse>> getApprovedForRoom(@PathVariable String roomId) {
        return ResponseEntity.ok(reviewService.getApprovedReviewsForRoom(roomId));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('CLIENT','RECEPTIONIST','ADMIN')")
    public ResponseEntity<List<ReviewDetailsResponse>> myReviews() {
        return ResponseEntity.ok(reviewService.getReviewsForUser(currentUserId()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT','RECEPTIONIST','ADMIN')")
    public ResponseEntity<ReviewDetailsResponse> createReview(@Validated @RequestBody CreateReviewRequest request) {
        return ResponseEntity.status(201).body(reviewService.createReview(currentUserId(), request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReviewDetailsResponse>> listReviews(@RequestParam(required = false) ReviewStatus status) {
        return ResponseEntity.ok(reviewService.listReviews(status));
    }

    @PostMapping("/{id}/moderate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewDetailsResponse> moderate(@PathVariable String id,
                                                          @Validated @RequestBody ModerateReviewRequest request,
                                                          Authentication authentication) {
        String moderator = authentication.getName();
        return ResponseEntity.ok(reviewService.moderateReview(id, request, moderator));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewDetailsResponse> getReview(@PathVariable String id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
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
