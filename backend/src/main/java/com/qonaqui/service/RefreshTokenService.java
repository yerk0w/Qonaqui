package com.qonaqui.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.qonaqui.exception.BadRequestException;
import com.qonaqui.model.RefreshToken;
import com.qonaqui.repository.RefreshTokenRepository;
import com.qonaqui.security.JwtProperties;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, JwtProperties jwtProperties) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtProperties = jwtProperties;
    }

    public RefreshToken createRefreshToken(String userId) {
        refreshTokenRepository.deleteByUserId(userId);

        RefreshToken token = new RefreshToken();
        token.setUserId(userId);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiresAt(Instant.now().plusMillis(jwtProperties.getRefreshExpiration()));
        return refreshTokenRepository.save(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new BadRequestException("Refresh token просрочен");
        }
        return token;
    }

    public RefreshToken getByTokenOrThrow(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Refresh token не найден"));
    }

    public void revokeUserTokens(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    public long purgeExpiredTokens() {
        return refreshTokenRepository.deleteByExpiresAtBefore(Instant.now());
    }
}
