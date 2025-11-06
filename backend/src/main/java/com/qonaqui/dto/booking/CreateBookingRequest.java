package com.qonaqui.dto.booking;

import java.time.LocalDate;
import java.util.List;

import com.qonaqui.model.enums.PaymentMethod;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateBookingRequest(
        @NotBlank(message = "ID номера обязателен")
        String roomId,

        @NotNull(message = "Дата заезда обязательна")
        @Future(message = "Дата заезда должна быть в будущем")
        LocalDate checkInDate,

        @NotNull(message = "Дата выезда обязательна")
        @Future(message = "Дата выезда должна быть в будущем")
        LocalDate checkOutDate,

        @Positive(message = "Количество гостей должно быть положительным")
        int numberOfGuests,

        @NotBlank(message = "Имя гостя обязательно")
        String guestName,

        @NotBlank(message = "Телефон обязателен")
        String guestPhone,

        @Email(message = "Некорректный email")
        String guestEmail,

        PaymentMethod paymentMethod,

        List<@Valid AdditionalServiceSelection> additionalServices,

        String specialRequests
) {}
