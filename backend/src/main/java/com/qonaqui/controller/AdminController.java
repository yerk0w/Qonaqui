package com.qonaqui.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.qonaqui.dto.UserResponse;
import com.qonaqui.dto.admin.DashboardSummaryResponse;
import com.qonaqui.dto.admin.UpdatePassportRequest;
import com.qonaqui.dto.admin.UpdateUserRoleRequest;
import com.qonaqui.dto.admin.UserSummaryResponse;
import com.qonaqui.model.enums.Role;
import com.qonaqui.service.AnalyticsService;
import com.qonaqui.service.UserService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Validated
public class AdminController {

    private final UserService userService;
    private final AnalyticsService analyticsService;

    public AdminController(UserService userService, AnalyticsService analyticsService) {
        this.userService = userService;
        this.analyticsService = analyticsService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryResponse>> getUsers(@RequestParam(required = false) Role role) {
        List<UserSummaryResponse> response = role != null
                ? userService.getByRole(role)
                : userService.getAllSummaries();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserProfile(id));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<UserSummaryResponse> updateRole(@PathVariable String id,
                                                           @Validated @RequestBody UpdateUserRoleRequest request) {
        return ResponseEntity.ok(userService.updateRole(id, request));
    }

    @PatchMapping("/users/{id}/passport")
    public ResponseEntity<UserSummaryResponse> updatePassport(@PathVariable String id,
                                                               @RequestBody UpdatePassportRequest request) {
        return ResponseEntity.ok(userService.updatePassport(id, request));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }
}
