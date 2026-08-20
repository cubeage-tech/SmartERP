package com.cubeage.erp.superAdmin.service;

import com.cubeage.erp.superAdmin.dto.plan.*;

import java.util.List;

public interface PlanService {
    PlanResponse create(CreatePlanRequest request);
    PlanResponse update(Long id, UpdatePlanRequest request);
    PlanResponse getById(Long id);
    List<PlanResponse> getAll();
    List<PlanResponse> getActive();
    void delete(Long id);
}
