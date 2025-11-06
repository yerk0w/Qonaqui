package com.qonaqui.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.qonaqui.model.Service;
import com.qonaqui.model.enums.ServiceCategory;

public interface ServiceRepository extends MongoRepository<Service, String> {

    List<Service> findByCategory(ServiceCategory category);
}
