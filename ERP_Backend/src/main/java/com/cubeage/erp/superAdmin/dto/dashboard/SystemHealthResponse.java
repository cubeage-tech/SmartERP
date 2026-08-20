package com.cubeage.erp.superAdmin.dto.dashboard;

public record SystemHealthResponse(
        String status,
        String databaseStatus,
        String apiStatus,
        double cpuUsage,
        double memoryUsage,
        long uptimeSeconds
) {}
