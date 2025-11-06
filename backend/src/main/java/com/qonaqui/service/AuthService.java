package com.qonaqui.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.qonaqui.dto.JwtResponse;
import com.qonaqui.dto.LoginRequest;
import com.qonaqui.dto.RegisterRequest;
import com.qonaqui.dto.UserResponse;
import com.qonaqui.exception.BadRequestException;
import com.qonaqui.exception.NotFoundException;
import com.qonaqui.model.User;
import com.qonaqui.repository.UserRepository;
import com.qonaqui.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public JwtResponse register(RegisterRequest request) {
        String normalizedEmail = request.email().toLowerCase();

        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new BadRequestException("Пользователь с таким email уже существует");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("user");

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getId());

        return new JwtResponse(token, "Пользователь успешно зарегистрирован");
    }

    public JwtResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Неверные данные для входа"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadRequestException("Неверные данные для входа");
        }

        String token = jwtService.generateToken(user.getId());
        return new JwtResponse(token, "Успешный вход в систему");
    }

    public UserResponse getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt());
    }
}