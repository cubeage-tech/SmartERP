package com.cubeage.erp.tenant.dto.tenant;

import com.cubeage.erp.tenant.enums.*;
import java.time.Instant;

public record TenantSummaryResponse(Long id, String code, String name, TenantStatus status,
                                    TenantPlan plan, long activeUsers, Instant createdAt) { }
