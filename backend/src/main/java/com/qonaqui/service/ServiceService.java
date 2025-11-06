package com.qonaqui.service;

import java.util.List;
import java.util.Objects;

import org.springframework.util.StringUtils;

import com.qonaqui.dto.service.ServiceResponse;
import com.qonaqui.dto.service.UpsertServiceRequest;
import com.qonaqui.exception.BadRequestException;
import com.qonaqui.exception.NotFoundException;
import com.qonaqui.mapper.ServiceMapper;
import com.qonaqui.model.Service;
import com.qonaqui.model.enums.ServiceCategory;
import com.qonaqui.repository.ServiceRepository;

@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<ServiceResponse> listServices(ServiceCategory category) {
        List<Service> services = category != null
                ? serviceRepository.findByCategory(category)
                : serviceRepository.findAll();
        return services.stream().map(ServiceMapper::toResponse).toList();
    }

    public ServiceResponse getById(String id) {
        return ServiceMapper.toResponse(findById(id));
    }

    public ServiceResponse createService(UpsertServiceRequest request) {
        validateRequest(request);
        Service service = new Service();
        apply(request, service);
        return ServiceMapper.toResponse(serviceRepository.save(service));
    }

    public ServiceResponse updateService(String id, UpsertServiceRequest request) {
        validateRequest(request);
        Service service = findById(id);
        apply(request, service);
        return ServiceMapper.toResponse(serviceRepository.save(service));
    }

    public void deleteService(String id) {
        Service service = findById(id);
        serviceRepository.delete(service);
    }

    private Service findById(String id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Услуга не найдена"));
    }

    private void validateRequest(UpsertServiceRequest request) {
        if (!StringUtils.hasText(request.name())) {
            throw new BadRequestException("Название услуги обязательно");
        }
        if (request.price() == null) {
            throw new BadRequestException("Цена обязательна");
        }
        if (request.price().signum() <= 0) {
            throw new BadRequestException("Цена должна быть положительной");
        }
        if (request.durationMinutes() != null && request.durationMinutes() <= 0) {
            throw new BadRequestException("Длительность должна быть положительной");
        }
    }

    private void apply(UpsertServiceRequest request, Service service) {
        service.setName(request.name());
        service.setCategory(Objects.requireNonNull(request.category()));
        service.setDescription(request.description());
        service.setPrice(request.price());
        service.setDurationMinutes(request.durationMinutes());
        service.setAvailability(request.availability());
        service.setPhoto(request.photo());
    }
}
