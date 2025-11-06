package com.qonaqui.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.qonaqui.dto.loyalty.LoyaltyTransactionResponse;
import com.qonaqui.exception.BadRequestException;
import com.qonaqui.exception.NotFoundException;
import com.qonaqui.mapper.LoyaltyTransactionMapper;
import com.qonaqui.model.LoyaltyTransaction;
import com.qonaqui.model.User;
import com.qonaqui.model.enums.LoyaltyTransactionType;
import com.qonaqui.repository.LoyaltyTransactionRepository;
import com.qonaqui.repository.UserRepository;

@Service
public class LoyaltyService {

    private final UserRepository userRepository;
    private final LoyaltyTransactionRepository transactionRepository;

    public LoyaltyService(UserRepository userRepository, LoyaltyTransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<LoyaltyTransactionResponse> getHistory(String userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(LoyaltyTransactionMapper::toResponse)
                .toList();
    }

    @Transactional
    public void recordEarn(String userId, long points, String description) {
        if (points <= 0) {
            return;
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        user.setLoyaltyPoints(user.getLoyaltyPoints() + points);
        userRepository.save(user);

        LoyaltyTransaction transaction = new LoyaltyTransaction();
        transaction.setUserId(userId);
        transaction.setType(LoyaltyTransactionType.EARN);
        transaction.setPoints(points);
        transaction.setDescription(description);
        transactionRepository.save(transaction);
    }

    @Transactional
    public void redeem(String userId, long points, String description) {
        if (points <= 0) {
            throw new BadRequestException("Количество баллов должно быть положительным");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        if (user.getLoyaltyPoints() < points) {
            throw new BadRequestException("Недостаточно баллов для списания");
        }
        user.setLoyaltyPoints(user.getLoyaltyPoints() - points);
        userRepository.save(user);

        LoyaltyTransaction transaction = new LoyaltyTransaction();
        transaction.setUserId(userId);
        transaction.setType(LoyaltyTransactionType.REDEEM);
        transaction.setPoints(points);
        transaction.setDescription(description);
        transactionRepository.save(transaction);
    }
}
