package com.qonaqui.mapper;

import com.qonaqui.dto.loyalty.LoyaltyTransactionResponse;
import com.qonaqui.model.LoyaltyTransaction;

public final class LoyaltyTransactionMapper {

    private LoyaltyTransactionMapper() {
    }

    public static LoyaltyTransactionResponse toResponse(LoyaltyTransaction transaction) {
        return new LoyaltyTransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getPoints(),
                transaction.getDescription(),
                transaction.getCreatedAt()
        );
    }
}
