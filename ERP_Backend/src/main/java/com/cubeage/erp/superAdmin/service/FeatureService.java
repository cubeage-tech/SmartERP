package com.cubeage.erp.superAdmin.service;

import com.cubeage.erp.superAdmin.dto.feature.*;

import java.util.List;

public interface FeatureService {
    FeatureResponse create(FeatureRequest request);
    FeatureResponse update(Long id, FeatureRequest request);
    FeatureResponse getById(Long id);
    List<FeatureResponse> getAll();
    void assignToTenant(TenantFeatureRequest request);
    void delete(Long id);
}
