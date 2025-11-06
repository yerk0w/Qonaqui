package com.qonaqui.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.qonaqui.dto.payment.CreatePaymentRequest;
import com.qonaqui.dto.payment.PaymentResponse;
import com.qonaqui.exception.BadRequestException;
import com.qonaqui.exception.NotFoundException;
import com.qonaqui.mapper.PaymentMapper;
import com.qonaqui.model.Booking;
import com.qonaqui.model.Payment;
import com.qonaqui.model.enums.PaymentMethod;
import com.qonaqui.model.enums.PaymentStatus;
import com.qonaqui.repository.BookingRepository;
import com.qonaqui.service.LoyaltyService;
import com.qonaqui.repository.PaymentRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final LoyaltyService loyaltyService;

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository, LoyaltyService loyaltyService) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.loyaltyService = loyaltyService;
    }

    public List<PaymentResponse> listPaymentsForUser(String userId) {
        return paymentRepository.findByUserId(userId).stream()
                .map(PaymentMapper::toResponse)
                .toList();
    }

    public List<PaymentResponse> listPayments(PaymentStatus status) {
        List<Payment> payments = status != null
                ? paymentRepository.findByStatus(status)
                : paymentRepository.findAll();
        return payments.stream().map(PaymentMapper::toResponse).toList();
    }

    @Transactional
    public PaymentResponse createPayment(String userId, CreatePaymentRequest request) {
        Booking booking = bookingRepository.findById(request.bookingId())
                .orElseThrow(() -> new NotFoundException("Бронирование не найдено"));
        if (!Objects.equals(booking.getUserId(), userId)) {
            throw new AccessDeniedException("Нельзя оплатить чужое бронирование");
        }
        validateAmount(request.amount());
        paymentRepository.findTopByBookingIdOrderByCreatedAtDesc(booking.getId())
                .filter(existing -> existing.getStatus() == PaymentStatus.SUCCESS)
                .ifPresent(existing -> {
                    throw new BadRequestException("Бронирование уже оплачено");
                });
        if (request.method() == PaymentMethod.CARD && (request.cardLast4Digits() == null || request.cardLast4Digits().length() != 4)) {
            throw new BadRequestException("Нужно указать последние 4 цифры карты");
        }
        if (booking.getTotalPrice() != null && request.amount().compareTo(booking.getTotalPrice()) < 0) {
            throw new BadRequestException("Сумма меньше стоимости бронирования");
        }

        Payment payment = new Payment();
        payment.setBookingId(booking.getId());
        payment.setUserId(userId);
        payment.setAmount(request.amount());
        payment.setMethod(request.method());
        payment.setCardLast4Digits(request.cardLast4Digits());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setProcessedAt(Instant.now());

        Payment saved = paymentRepository.save(payment);
        booking.setPaymentStatus(PaymentStatus.SUCCESS);
        bookingRepository.save(booking);

        if (payment.getAmount() != null) {
            long bonus = payment.getAmount().longValue() / 1000L;
            loyaltyService.recordEarn(userId, bonus, "Начисление за оплату бронирования");
        }
        return PaymentMapper.toResponse(saved);
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.signum() <= 0) {
            throw new BadRequestException("Сумма платежа должна быть положительной");
        }
    }
}
