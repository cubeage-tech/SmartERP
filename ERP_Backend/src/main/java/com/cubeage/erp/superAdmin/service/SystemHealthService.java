package com.cubeage.erp.superAdmin.service;

import com.cubeage.erp.superAdmin.dto.dashboard.SystemHealthResponse;

public interface SystemHealthService {
    SystemHealthResponse getHealth();
}
