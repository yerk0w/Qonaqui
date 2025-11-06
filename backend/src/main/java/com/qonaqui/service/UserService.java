package com.qonaqui.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.qonaqui.dto.UserResponse;
import com.qonaqui.dto.admin.UpdatePassportRequest;
import com.qonaqui.dto.admin.UpdateUserRoleRequest;
import com.qonaqui.dto.admin.UserSummaryResponse;
import com.qonaqui.exception.NotFoundException;
import com.qonaqui.model.User;
import com.qonaqui.model.embedded.PassportData;
import com.qonaqui.model.enums.Role;
import com.qonaqui.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserSummaryResponse> getAllSummaries() {
        return userRepository.findAll().stream()
                .map(this::mapToSummary)
                .toList();
    }

    public List<UserSummaryResponse> getByRole(Role role) {
        return userRepository.findByRole(role).stream()
                .map(this::mapToSummary)
                .toList();
    }

    public UserResponse getUserProfile(String userId) {
        return mapToProfile(findById(userId));
    }

    public UserSummaryResponse getSummary(String userId) {
        return mapToSummary(findById(userId));
    }

    public void deleteById(String id) {
        User user = findById(id);
        userRepository.delete(user);
    }

    @Transactional
    public UserSummaryResponse updateRole(String userId, UpdateUserRoleRequest request) {
        User user = findById(userId);
        user.setRole(request.role());
        return mapToSummary(userRepository.save(user));
    }

    @Transactional
    public UserSummaryResponse updatePassport(String userId, UpdatePassportRequest request) {
        User user = findById(userId);
        PassportData passport = user.getPassportData();
        if (passport == null) {
            passport = new PassportData();
        }
        passport.setSeries(request.series());
        passport.setNumber(request.number());
        passport.setIssuedBy(request.issuedBy());
        passport.setIssueDate(request.issueDate());
        passport.setPhoto(request.photo());
        user.setPassportData(passport);
        return mapToSummary(userRepository.save(user));
    }

    private User findById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
    }

    private UserSummaryResponse mapToSummary(User user) {
        return new UserSummaryResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getPassportData(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getLoyaltyPoints()
        );
    }

    private UserResponse mapToProfile(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getPassportData(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getLoyaltyPoints()
        );
    }
}
