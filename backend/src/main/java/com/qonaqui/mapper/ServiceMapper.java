package com.qonaqui.mapper;

import com.qonaqui.dto.service.ServiceResponse;
import com.qonaqui.model.Service;

public final class ServiceMapper {

    private ServiceMapper() {
    }

    public static ServiceResponse toResponse(Service service) {
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getCategory(),
                service.getDescription(),
                service.getPrice(),
                service.getDurationMinutes(),
                service.getAvailability(),
                service.getPhoto(),
                service.getCreatedAt(),
                service.getUpdatedAt()
        );
    }
}
