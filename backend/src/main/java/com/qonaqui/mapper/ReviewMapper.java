package com.qonaqui.mapper;

import java.time.Instant;

import com.qonaqui.dto.review.ReviewDetailsResponse;
import com.qonaqui.dto.review.ReviewResponse;
import com.qonaqui.model.Review;

public final class ReviewMapper {

    private ReviewMapper() {
    }

    public static ReviewResponse toPublicResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getUserId(),
                review.getRoomId(),
                review.getBookingId(),
                review.getRating(),
                review.getComment(),
                review.getPhotos(),
                review.getCreatedAt()
        );
    }

    public static ReviewDetailsResponse toDetailsResponse(Review review) {
        return new ReviewDetailsResponse(
                review.getId(),
                review.getUserId(),
                review.getRoomId(),
                review.getBookingId(),
                review.getRating(),
                review.getComment(),
                review.getPhotos(),
                review.getResponse(),
                review.getCreatedAt(),
                review.getModeratedAt(),
                review.getStatus()
        );
    }

    public static void attachResponse(Review review, String responseText, String respondedBy) {
        if (review.getResponse() == null) {
            review.setResponse(new com.qonaqui.model.embedded.ReviewResponse());
        }
        com.qonaqui.model.embedded.ReviewResponse response = review.getResponse();
        response.setText(responseText);
        response.setRespondedBy(respondedBy);
        response.setRespondedAt(Instant.now());
    }
}
