package com.cubeage.erp.tenant.filter;

import com.cubeage.erp.security.user.UserPrincipal;
import com.cubeage.erp.tenant.context.TenantContext;
import com.cubeage.erp.tenant.exception.TenantAccessDeniedException;
import com.cubeage.erp.tenant.resolver.TenantResolver;
import com.cubeage.erp.tenant.repository.TenantRepository;
import com.cubeage.erp.tenant.enums.TenantStatus;
import com.cubeage.erp.tenant.exception.TenantInactiveException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class TenantFilter extends OncePerRequestFilter {
    private final TenantResolver tenantResolver;
    private final TenantRepository tenantRepository;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            tenantResolver.resolve(request).ifPresent(TenantContext::setTenantId);
            Object principal = SecurityContextHolder.getContext().getAuthentication() == null ? null
                    : SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserPrincipal user && TenantContext.getTenantId() == null) {
                TenantContext.setTenantId(user.getTenantId());
            }
            if (principal instanceof UserPrincipal user && TenantContext.getTenantId() != null
                    && !user.getTenantId().equals(TenantContext.getTenantId())) {
                throw new TenantAccessDeniedException("Requested tenant does not match authenticated tenant");
            }
            if (principal instanceof UserPrincipal user && !user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_SUPER_ADMIN"))) {
                TenantStatus status = tenantRepository.findById(user.getTenantId())
                        .orElseThrow(() -> new TenantInactiveException("Tenant is unavailable")).getStatus();
                if (status != TenantStatus.ACTIVE && status != TenantStatus.TRIAL) {
                    throw new TenantInactiveException("Tenant is not active");
                }
            }
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}
