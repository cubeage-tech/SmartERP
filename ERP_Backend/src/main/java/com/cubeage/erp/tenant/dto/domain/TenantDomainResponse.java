package com.cubeage.erp.tenant.dto.domain;

import java.time.Instant;

public record TenantDomainResponse(Long id, Long tenantId, String domain, boolean primaryDomain,
                                   boolean verified, Instant verifiedAt, Instant createdAt) { }
