package com.qonaqui.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.qonaqui.dto.booking.AdditionalServiceSelection;
import com.qonaqui.dto.booking.BookingResponse;
import com.qonaqui.dto.booking.CreateBookingRequest;
import com.qonaqui.dto.booking.UpdateBookingStatusRequest;
import com.qonaqui.exception.BadRequestException;
import com.qonaqui.exception.NotFoundException;
import com.qonaqui.mapper.BookingMapper;
import com.qonaqui.model.Booking;
import com.qonaqui.model.Room;
import com.qonaqui.model.Service;
import com.qonaqui.model.embedded.AdditionalServiceItem;
import com.qonaqui.model.enums.BookingStatus;
import com.qonaqui.model.enums.PaymentStatus;
import com.qonaqui.model.enums.RoomStatus;
import com.qonaqui.repository.BookingRepository;
import com.qonaqui.repository.RoomRepository;
import com.qonaqui.repository.ServiceRepository;

@org.springframework.stereotype.Service
public class BookingService {

    private static final List<BookingStatus> ACTIVE_STATUSES = List.of(
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
            BookingStatus.CHECKED_IN
    );

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final ServiceRepository serviceRepository;

    public BookingService(BookingRepository bookingRepository,
                          RoomRepository roomRepository,
                          ServiceRepository serviceRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.serviceRepository = serviceRepository;
    }

    public List<BookingResponse> getBookingsForUser(String userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    public List<BookingResponse> getAllBookings(BookingStatus status) {
        List<Booking> bookings = status != null
                ? bookingRepository.findByStatus(status)
                : bookingRepository.findAll();
        return bookings.stream().map(BookingMapper::toResponse).toList();
    }

    public List<BookingResponse> getArrivalsForDate(LocalDate date) {
        return Stream.of(BookingStatus.CONFIRMED, BookingStatus.PENDING)
                .flatMap(status -> bookingRepository.findByStatusAndCheckInDate(status, date).stream())
                .map(BookingMapper::toResponse)
                .toList();
    }

    public List<BookingResponse> getDeparturesForDate(LocalDate date) {
        return bookingRepository.findByStatusAndCheckOutDate(BookingStatus.CHECKED_IN, date).stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    public List<BookingResponse> getBookingsBetween(LocalDate start, LocalDate end) {
        return bookingRepository.findByCheckInDateBetween(start, end).stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    public BookingResponse getBookingForUser(String bookingId, String userId) {
        Booking booking = findById(bookingId);
        if (!Objects.equals(booking.getUserId(), userId)) {
            throw new AccessDeniedException("Нет доступа к этой брони");
        }
        return BookingMapper.toResponse(booking);
    }

    public BookingResponse getBookingById(String bookingId) {
        return BookingMapper.toResponse(findById(bookingId));
    }

    @Transactional
    public BookingResponse createBooking(String userId, CreateBookingRequest request) {
        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new NotFoundException("Номер не найден"));

        validateDates(request.checkInDate(), request.checkOutDate());
        ensureRoomCapacity(room, request.numberOfGuests());
        ensureRoomAvailableForDates(room.getId(), request.checkInDate(), request.checkOutDate());

        int nights = (int) ChronoUnit.DAYS.between(request.checkInDate(), request.checkOutDate());
        List<AdditionalServiceItem> additionalItems = buildAdditionalServices(request.additionalServices());
        BigDecimal totalPrice = calculateTotalPrice(room.getPrice(), nights, additionalItems);

        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setRoomId(room.getId());
        booking.setGuestName(request.guestName());
        booking.setGuestPhone(request.guestPhone());
        booking.setGuestEmail(request.guestEmail());
        booking.setCheckInDate(request.checkInDate());
        booking.setCheckOutDate(request.checkOutDate());
        booking.setNumberOfGuests(request.numberOfGuests());
        booking.setNumberOfNights(nights);
        booking.setTotalPrice(totalPrice);
        booking.setPaymentMethod(request.paymentMethod());
        booking.setAdditionalServices(additionalItems);
        booking.setSpecialRequests(request.specialRequests());
        booking.setPaymentStatus(PaymentStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        return BookingMapper.toResponse(saved);
    }

    @Transactional
    public BookingResponse updateBookingStatus(String bookingId, UpdateBookingStatusRequest request) {
        Booking booking = findById(bookingId);
        BookingStatus newStatus = request.status();
        if (newStatus == null) {
            throw new BadRequestException("Новый статус обязателен");
        }

        switch (newStatus) {
            case CONFIRMED -> booking.setConfirmedAt(java.time.Instant.now());
            case CHECKED_IN -> booking.setCheckedInAt(java.time.Instant.now());
            case CHECKED_OUT -> booking.setCheckedOutAt(java.time.Instant.now());
            default -> {
            }
        }

        booking.setStatus(newStatus);
        if (request.paymentStatus() != null) {
            booking.setPaymentStatus(request.paymentStatus());
        }

        updateRoomStatusOnBookingChange(booking);
        return BookingMapper.toResponse(bookingRepository.save(booking));
    }

    public void cancelBooking(String bookingId, String userId) {
        Booking booking = findById(bookingId);
        if (!booking.getUserId().equals(userId)) {
            throw new AccessDeniedException("Нельзя отменить чужое бронирование");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private Booking findById(String bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Бронирование не найдено"));
    }

    private void validateDates(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            throw new BadRequestException("Даты заезда и выезда обязательны");
        }
        if (!checkIn.isBefore(checkOut)) {
            throw new BadRequestException("Дата выезда должна быть позже даты заезда");
        }
        if (ChronoUnit.DAYS.between(checkIn, checkOut) > 60) {
            throw new BadRequestException("Нельзя бронировать более чем на 60 ночей");
        }
    }

    private void ensureRoomCapacity(Room room, int guests) {
        if (guests <= 0) {
            throw new BadRequestException("Количество гостей должно быть положительным");
        }
        if (guests > room.getCapacity()) {
            throw new BadRequestException("Комната не рассчитана на " + guests + " гостей");
        }
    }

    private void ensureRoomAvailableForDates(String roomId, LocalDate checkIn, LocalDate checkOut) {
        boolean intersects = bookingRepository
                .existsByRoomIdAndStatusInAndCheckOutDateGreaterThanAndCheckInDateLessThan(
                        roomId,
                        ACTIVE_STATUSES,
                        checkIn,
                        checkOut);
        if (intersects) {
            throw new BadRequestException("Номер уже забронирован на выбранные даты");
        }
    }

    private List<AdditionalServiceItem> buildAdditionalServices(List<AdditionalServiceSelection> selections) {
        if (CollectionUtils.isEmpty(selections)) {
            return List.of();
        }
        List<AdditionalServiceItem> items = new ArrayList<>();
        for (AdditionalServiceSelection selection : selections) {
            Service service = serviceRepository.findById(selection.serviceId())
                    .orElseThrow(() -> new BadRequestException("Услуга " + selection.serviceId() + " не найдена"));
            AdditionalServiceItem item = new AdditionalServiceItem();
            item.setServiceId(service.getId());
            item.setQuantity(selection.quantity());
            BigDecimal linePrice = service.getPrice().multiply(BigDecimal.valueOf(selection.quantity()));
            item.setPrice(linePrice);
            items.add(item);
        }
        return items;
    }

    private BigDecimal calculateTotalPrice(BigDecimal nightlyRate, int nights, List<AdditionalServiceItem> services) {
        BigDecimal base = nightlyRate.multiply(BigDecimal.valueOf(nights));
        BigDecimal extras = services.stream()
                .map(AdditionalServiceItem::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return base.add(extras);
    }

    private void updateRoomStatusOnBookingChange(Booking booking) {
        roomRepository.findById(booking.getRoomId()).ifPresent(room -> {
            switch (booking.getStatus()) {
                case CHECKED_IN -> room.setStatus(RoomStatus.OCCUPIED);
                case CHECKED_OUT -> room.setStatus(RoomStatus.CLEANING);
                case CANCELLED -> room.setStatus(RoomStatus.AVAILABLE);
                case CONFIRMED -> room.setStatus(RoomStatus.RESERVED);
                default -> {
                }
            }
            roomRepository.save(room);
        });
    }
}
