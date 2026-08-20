package com.cubeage.erp.tenant.dto.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record TenantDomainRequest(
        @NotBlank @Pattern(regexp = "(?i)^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$") String domain,
        boolean primaryDomain) { }
