package com.qonaqui.service;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.qonaqui.dto.review.CreateReviewRequest;
import com.qonaqui.dto.review.ModerateReviewRequest;
import com.qonaqui.dto.review.ReviewDetailsResponse;
import com.qonaqui.dto.review.ReviewResponse;
import com.qonaqui.exception.BadRequestException;
import com.qonaqui.exception.NotFoundException;
import com.qonaqui.mapper.ReviewMapper;
import com.qonaqui.model.Booking;
import com.qonaqui.model.Review;
import com.qonaqui.model.enums.BookingStatus;
import com.qonaqui.model.enums.ReviewStatus;
import com.qonaqui.repository.BookingRepository;
import com.qonaqui.repository.ReviewRepository;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;

    public ReviewService(ReviewRepository reviewRepository, BookingRepository bookingRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<ReviewResponse> getApprovedReviewsForRoom(String roomId) {
        return reviewRepository.findByRoomId(roomId).stream()
                .filter(review -> review.getStatus() == ReviewStatus.APPROVED)
                .map(ReviewMapper::toPublicResponse)
                .toList();
    }

    public List<ReviewDetailsResponse> getReviewsForUser(String userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(ReviewMapper::toDetailsResponse)
                .toList();
    }

    public List<ReviewDetailsResponse> listReviews(ReviewStatus status) {
        List<Review> reviews = status != null
                ? reviewRepository.findByStatus(status)
                : reviewRepository.findAll();
        return reviews.stream().map(ReviewMapper::toDetailsResponse).toList();
    }

    @Transactional
    public ReviewDetailsResponse createReview(String userId, CreateReviewRequest request) {
        Booking booking = bookingRepository.findById(request.bookingId())
                .orElseThrow(() -> new NotFoundException("Бронирование не найдено"));
        if (!Objects.equals(booking.getUserId(), userId)) {
            throw new AccessDeniedException("Нельзя оставлять отзыв на чужое бронирование");
        }
        if (!Objects.equals(booking.getRoomId(), request.roomId())) {
            throw new BadRequestException("Бронирование не относится к выбранному номеру");
        }
        if (booking.getStatus() != BookingStatus.CHECKED_OUT) {
            throw new BadRequestException("Отзыв можно оставить после выезда");
        }
        if (reviewRepository.findByBookingId(booking.getId()).isPresent()) {
            throw new BadRequestException("Отзыв по этому бронированию уже существует");
        }

        Review review = new Review();
        review.setUserId(userId);
        review.setRoomId(request.roomId());
        review.setBookingId(booking.getId());
        review.setRating(request.rating());
        review.setComment(request.comment());
        review.setPhotos(request.photos());
        review.setStatus(ReviewStatus.PENDING);
        Review saved = reviewRepository.save(review);
        return ReviewMapper.toDetailsResponse(saved);
    }

    @Transactional
    public ReviewDetailsResponse moderateReview(String reviewId, ModerateReviewRequest request, String moderatorName) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("Отзыв не найден"));
        if (request.status() == null) {
            throw new BadRequestException("Новый статус обязателен");
        }
        review.setStatus(request.status());
        review.setModeratedAt(Instant.now());
        if (StringUtils.hasText(request.responseText())) {
            ReviewMapper.attachResponse(review, request.responseText(), moderatorName);
        }
        Review saved = reviewRepository.save(review);
        return ReviewMapper.toDetailsResponse(saved);
    }

    public ReviewDetailsResponse getReviewById(String id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Отзыв не найден"));
        return ReviewMapper.toDetailsResponse(review);
    }
}
