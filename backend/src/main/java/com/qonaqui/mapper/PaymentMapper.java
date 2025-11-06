package com.qonaqui.mapper;

import com.qonaqui.dto.payment.PaymentResponse;
import com.qonaqui.model.Payment;

public final class PaymentMapper {

    private PaymentMapper() {
    }

    public static PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getBookingId(),
                payment.getUserId(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getMethod(),
                payment.getStatus(),
                payment.getCardLast4Digits(),
                payment.getTransactionId(),
                payment.getCreatedAt(),
                payment.getProcessedAt()
        );
    }
}
