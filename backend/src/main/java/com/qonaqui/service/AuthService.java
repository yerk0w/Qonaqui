package com.qonaqui.service;

import java.time.Instant;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.qonaqui.dto.JwtResponse;
import com.qonaqui.dto.LoginRequest;
import com.qonaqui.dto.RegisterRequest;
import com.qonaqui.dto.UserResponse;
import com.qonaqui.exception.BadRequestException;
import com.qonaqui.exception.NotFoundException;
import com.qonaqui.model.RefreshToken;
import com.qonaqui.model.User;
import com.qonaqui.model.enums.Role;
import com.qonaqui.repository.UserRepository;
import com.qonaqui.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    public JwtResponse register(RegisterRequest request) {
        String normalizedEmail = request.email().toLowerCase();

        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new BadRequestException("Пользователь с таким email уже существует");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(normalizedEmail);
        user.setPhone(request.phone());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.CLIENT);
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        User saved = userRepository.save(user);

        return buildTokenResponse(saved, "Пользователь успешно зарегистрирован");
    }

    public JwtResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Неверные данные для входа"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadRequestException("Неверные данные для входа");
        }

        return buildTokenResponse(user, "Успешный вход в систему");
    }

    public JwtResponse refreshTokens(String refreshToken) {
        if (!jwtService.isRefreshToken(refreshToken)) {
            throw new BadRequestException("Неверный формат refresh token");
        }

        String userId = jwtService.extractUserId(refreshToken);
        String tokenId = jwtService.extractRefreshTokenId(refreshToken);

        RefreshToken persistedToken = refreshTokenService.verifyExpiration(
                refreshTokenService.getByTokenOrThrow(tokenId)
        );

        if (!persistedToken.getUserId().equals(userId)) {
            throw new BadRequestException("Refresh token не принадлежит пользователю");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        return buildTokenResponse(user, "Токены обновлены");
    }

    public UserResponse getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

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

    private JwtResponse buildTokenResponse(User user, String message) {
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());
        String access = jwtService.generateAccessToken(user.getId(), user.getRole());
        String refresh = jwtService.generateRefreshToken(user.getId(), refreshToken.getToken());
        return new JwtResponse(access, refresh, message);
    }
}
