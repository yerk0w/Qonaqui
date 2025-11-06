package com.qonaqui.model;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.qonaqui.model.enums.Currency;
import com.qonaqui.model.enums.PaymentMethod;
import com.qonaqui.model.enums.PaymentStatus;

@Document(collection = "payments")
public class Payment {

    @Id
    private String id;

    private String bookingId;

    private String userId;

    private BigDecimal amount;

    private Currency currency = Currency.KZT;

    private PaymentMethod method;

    private PaymentStatus status = PaymentStatus.PENDING;

    private String cardLast4Digits;

    private String transactionId;

    @CreatedDate
    private Instant createdAt = Instant.now();

    private Instant processedAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Currency getCurrency() {
        return currency;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public void setMethod(PaymentMethod method) {
        this.method = method;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getCardLast4Digits() {
        return cardLast4Digits;
    }

    public void setCardLast4Digits(String cardLast4Digits) {
        this.cardLast4Digits = cardLast4Digits;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(Instant processedAt) {
        this.processedAt = processedAt;
    }
}
