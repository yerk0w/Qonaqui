package com.qonaqui.dto.payment;

import java.math.BigDecimal;

import com.qonaqui.model.enums.PaymentMethod;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreatePaymentRequest(
        @NotBlank(message = "ID бронирования обязателен")
        String bookingId,

        @Positive(message = "Сумма должна быть положительной")
        BigDecimal amount,

        @NotNull(message = "Метод оплаты обязателен")
        PaymentMethod method,

        @Size(min = 4, max = 4, message = "Последние 4 цифры карты должны состоять из 4 символов")
        String cardLast4Digits
) {}
