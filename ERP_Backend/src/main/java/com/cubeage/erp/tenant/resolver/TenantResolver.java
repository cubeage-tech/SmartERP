package com.cubeage.erp.tenant.resolver;

import com.cubeage.erp.tenant.repository.TenantDomainRepository;
import com.cubeage.erp.tenant.repository.TenantRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TenantResolver {
    private final TenantRepository tenantRepository;
    private final TenantDomainRepository domainRepository;
    public Optional<Long> resolve(HttpServletRequest request) {
        String id = request.getHeader("X-Tenant-ID");
        if (id != null && !id.isBlank()) {
            try { return Optional.of(Long.valueOf(id)); }
            catch (NumberFormatException exception) { throw new IllegalArgumentException("Invalid X-Tenant-ID header"); }
        }
        String code = request.getHeader("X-Tenant-Code");
        if (code != null && !code.isBlank()) return tenantRepository.findByCodeIgnoreCase(code).map(t -> t.getId());
        return domainRepository.findByDomainIgnoreCase(request.getServerName()).map(domain -> domain.getTenantId());
    }
}
