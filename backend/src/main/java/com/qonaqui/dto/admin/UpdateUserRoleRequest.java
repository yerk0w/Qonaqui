package com.qonaqui.dto.admin;

import com.qonaqui.model.enums.Role;

import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleRequest(
        @NotNull(message = "Новая роль обязательна")
        Role role
) {}
