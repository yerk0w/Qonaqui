package com.qonaqui.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.qonaqui.model.enums.Role;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String CLAIM_ROLE = "role";
    private static final String CLAIM_TYPE = "type";
    private static final String TYPE_ACCESS = "access";
    private static final String TYPE_REFRESH = "refresh";
    private static final String CLAIM_REFRESH_ID = "tokenId";

    private final JwtProperties properties;

    public JwtService(JwtProperties properties) {
        this.properties = properties;
    }

    public String generateAccessToken(String userId, Role role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + properties.getExpiration());

        return buildToken(userId, Map.of(
                CLAIM_ROLE, role.name(),
                CLAIM_TYPE, TYPE_ACCESS
        ), now, expiry);
    }

    public String generateRefreshToken(String userId, String tokenId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + properties.getRefreshExpiration());

        return buildToken(userId, Map.of(
                CLAIM_TYPE, TYPE_REFRESH,
                CLAIM_REFRESH_ID, tokenId
        ), now, expiry);
    }

    public boolean isAccessToken(String token) {
        return TYPE_ACCESS.equals(parseClaims(token).get(CLAIM_TYPE, String.class));
    }

    public boolean isRefreshToken(String token) {
        return TYPE_REFRESH.equals(parseClaims(token).get(CLAIM_TYPE, String.class));
    }

    public String extractUserId(String token) {
        return parseClaims(token).getSubject();
    }

    public Role extractRole(String token) {
        String role = parseClaims(token).get(CLAIM_ROLE, String.class);
        return role != null ? Role.valueOf(role) : null;
    }

    public String extractRefreshTokenId(String token) {
        return parseClaims(token).get(CLAIM_REFRESH_ID, String.class);
    }

    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    private String buildToken(String subject, Map<String, Object> claims, Date issuedAt, Date expiry) {
        return Jwts.builder()
                .subject(subject)
                .claims(claims)
                .issuedAt(issuedAt)
                .expiration(expiry)
                .signWith(Keys.hmacShaKeyFor(properties.getSecret().getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(properties.getSecret().getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
