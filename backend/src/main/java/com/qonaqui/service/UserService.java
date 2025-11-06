package com.qonaqui.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qonaqui.dto.UserResponse;
import com.qonaqui.exception.NotFoundException;
import com.qonaqui.model.User;
import com.qonaqui.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getAll() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt()))
                .toList();
    }

    public void deleteById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        userRepository.delete(user);
    }
}
