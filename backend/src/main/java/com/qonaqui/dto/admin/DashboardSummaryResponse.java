package com.qonaqui.dto.admin;

import java.math.BigDecimal;

public record DashboardSummaryResponse(
        long totalUsers,
        long totalClients,
        long totalReceptionists,
        long totalAdmins,
        long totalRooms,
        long availableRooms,
        long occupiedRooms,
        long reservedRooms,
        long totalBookings,
        long pendingBookings,
        long confirmedBookings,
        long checkedInBookings,
        long checkedOutBookings,
        long cancelledBookings,
        BigDecimal totalRevenue,
        long totalLoyaltyPoints
) {}
