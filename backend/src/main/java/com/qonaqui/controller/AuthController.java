package com.qonaqui.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qonaqui.dto.JwtResponse;
import com.qonaqui.dto.LoginRequest;
import com.qonaqui.dto.RefreshTokenRequest;
import com.qonaqui.dto.RegisterRequest;
import com.qonaqui.dto.UserResponse;
import com.qonaqui.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<JwtResponse> register(@Validated @RequestBody RegisterRequest request) {
      JwtResponse response = authService.register(request);
      return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Validated @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refresh(@Validated @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshTokens(request.refreshToken()));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> profile(Authentication authentication) {
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(authService.getProfile(principal.getUsername()));
    }
}
