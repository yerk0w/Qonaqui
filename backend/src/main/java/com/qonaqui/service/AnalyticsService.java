package com.qonaqui.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.qonaqui.dto.admin.DashboardSummaryResponse;
import com.qonaqui.model.User;
import com.qonaqui.model.enums.BookingStatus;
import com.qonaqui.model.enums.PaymentStatus;
import com.qonaqui.model.enums.Role;
import com.qonaqui.model.enums.RoomStatus;
import com.qonaqui.repository.BookingRepository;
import com.qonaqui.repository.PaymentRepository;
import com.qonaqui.repository.RoomRepository;
import com.qonaqui.repository.UserRepository;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public AnalyticsService(UserRepository userRepository,
                            RoomRepository roomRepository,
                            BookingRepository bookingRepository,
                            PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    public DashboardSummaryResponse getDashboardSummary() {
        long totalUsers = userRepository.count();
        long totalClients = userRepository.findByRole(Role.CLIENT).size();
        long totalReceptionists = userRepository.findByRole(Role.RECEPTIONIST).size();
        long totalAdmins = userRepository.findByRole(Role.ADMIN).size();
        long totalLoyaltyPoints = userRepository.findAll().stream()
                .mapToLong(User::getLoyaltyPoints)
                .sum();

        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.findByStatus(RoomStatus.AVAILABLE).size();
        long occupiedRooms = roomRepository.findByStatus(RoomStatus.OCCUPIED).size();
        long reservedRooms = roomRepository.findByStatus(RoomStatus.RESERVED).size();

        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.findByStatus(BookingStatus.PENDING).size();
        long confirmedBookings = bookingRepository.findByStatus(BookingStatus.CONFIRMED).size();
        long checkedInBookings = bookingRepository.findByStatus(BookingStatus.CHECKED_IN).size();
        long checkedOutBookings = bookingRepository.findByStatus(BookingStatus.CHECKED_OUT).size();
        long cancelledBookings = bookingRepository.findByStatus(BookingStatus.CANCELLED).size();

        BigDecimal totalRevenue = paymentRepository.findByStatus(PaymentStatus.SUCCESS).stream()
                .map(payment -> payment.getAmount() != null ? payment.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardSummaryResponse(
                totalUsers,
                totalClients,
                totalReceptionists,
                totalAdmins,
                totalRooms,
                availableRooms,
                occupiedRooms,
                reservedRooms,
                totalBookings,
                pendingBookings,
                confirmedBookings,
                checkedInBookings,
                checkedOutBookings,
                cancelledBookings,
                totalRevenue,
                totalLoyaltyPoints
        );
    }
}
