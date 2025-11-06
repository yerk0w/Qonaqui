package com.qonaqui.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

import com.qonaqui.dto.service.CreateServiceBookingRequest;
import com.qonaqui.dto.service.ServiceBookingResponse;
import com.qonaqui.dto.service.UpdateServiceBookingStatusRequest;
import com.qonaqui.exception.BadRequestException;
import com.qonaqui.exception.NotFoundException;
import com.qonaqui.mapper.ServiceBookingMapper;
import com.qonaqui.model.Service;
import com.qonaqui.model.ServiceBooking;
import com.qonaqui.model.enums.ServiceBookingStatus;
import com.qonaqui.repository.ServiceBookingRepository;
import com.qonaqui.repository.ServiceRepository;

@org.springframework.stereotype.Service
public class ServiceBookingService {

    private final ServiceBookingRepository serviceBookingRepository;
    private final ServiceRepository serviceRepository;

    public ServiceBookingService(ServiceBookingRepository serviceBookingRepository,
                                 ServiceRepository serviceRepository) {
        this.serviceBookingRepository = serviceBookingRepository;
        this.serviceRepository = serviceRepository;
    }

    public List<ServiceBookingResponse> listBookingsForUser(String userId) {
        return serviceBookingRepository.findByUserId(userId).stream()
                .map(ServiceBookingMapper::toResponse)
                .toList();
    }

    public List<ServiceBookingResponse> listBookings(ServiceBookingStatus status, LocalDate date) {
        List<ServiceBooking> items;
        if (status != null) {
            items = serviceBookingRepository.findByStatus(status);
        } else if (date != null) {
            items = serviceBookingRepository.findByDate(date);
        } else {
            items = serviceBookingRepository.findAll();
        }
        return items.stream().map(ServiceBookingMapper::toResponse).toList();
    }

    @Transactional
    public ServiceBookingResponse createBooking(String userId, CreateServiceBookingRequest request) {
        Service service = serviceRepository.findById(request.serviceId())
                .orElseThrow(() -> new NotFoundException("Услуга не найдена"));

        validateDateTime(request.date(), request.time());

        ServiceBooking booking = new ServiceBooking();
        booking.setUserId(userId);
        booking.setServiceId(service.getId());
        booking.setBookingId(request.bookingId());
        booking.setDate(request.date());
        booking.setTime(request.time());
        booking.setStatus(ServiceBookingStatus.PENDING);

        var price = request.price() != null ? request.price() : service.getPrice();
        if (price == null) {
            throw new BadRequestException("Не указана стоимость услуги");
        }
        booking.setPrice(price);

        ServiceBooking saved = serviceBookingRepository.save(booking);
        return ServiceBookingMapper.toResponse(saved);
    }

    @Transactional
    public ServiceBookingResponse updateStatus(String id, UpdateServiceBookingStatusRequest request) {
        ServiceBooking booking = serviceBookingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Бронирование услуги не найдено"));
        if (request.status() == null) {
            throw new BadRequestException("Новый статус обязателен");
        }
        booking.setStatus(request.status());
        return ServiceBookingMapper.toResponse(serviceBookingRepository.save(booking));
    }

    @Transactional
    public void cancelBooking(String id, String userId) {
        ServiceBooking booking = serviceBookingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Бронирование услуги не найдено"));
        if (!Objects.equals(booking.getUserId(), userId)) {
            throw new AccessDeniedException("Невозможно отменить чужое бронирование услуги");
        }
        booking.setStatus(ServiceBookingStatus.CANCELLED);
        serviceBookingRepository.save(booking);
    }

    private void validateDateTime(LocalDate date, LocalTime time) {
        if (date == null || time == null) {
            throw new BadRequestException("Дата и время услуги обязательны");
        }
        if (date.isBefore(LocalDate.now())) {
            throw new BadRequestException("Дата услуги должна быть не в прошлом");
        }
        if (date.equals(LocalDate.now()) && time.isBefore(LocalTime.now())) {
            throw new BadRequestException("Время услуги должно быть не в прошлом");
        }
    }
}
