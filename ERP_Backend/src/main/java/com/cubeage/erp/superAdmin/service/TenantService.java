package com.cubeage.erp.superAdmin.service;

import com.cubeage.erp.superAdmin.dto.tenant.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TenantService {
    TenantResponse create(CreateTenantRequest request);
    TenantResponse update(Long id, UpdateTenantRequest request);
    TenantResponse getById(Long id);
    Page<TenantResponse> search(TenantSearchRequest request, Pageable pageable);
    void suspend(Long id, String reason);
    void activate(Long id);
    void delete(Long id);
}
