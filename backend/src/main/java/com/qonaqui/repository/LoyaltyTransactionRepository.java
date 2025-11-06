package com.qonaqui.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.qonaqui.model.LoyaltyTransaction;

public interface LoyaltyTransactionRepository extends MongoRepository<LoyaltyTransaction, String> {

    List<LoyaltyTransaction> findByUserIdOrderByCreatedAtDesc(String userId);
}

