package com.qonaqui.dto;

public record JwtResponse(
        String accessToken,
        String refreshToken,
        String message
) {}
