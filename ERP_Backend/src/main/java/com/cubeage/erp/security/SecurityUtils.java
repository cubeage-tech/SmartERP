package com.cubeage.erp.security;

import com.cubeage.erp.security.user.UserPrincipal;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() { }

    public static UserPrincipal currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            throw new AccessDeniedException("Authenticated user is required");
        }
        return principal;
    }

    public static Long currentUserId() { return currentUser().getId(); }

    public static Long currentTenantId() { return currentUser().getTenantId(); }

    public static boolean hasRole(String role) {
        String authority = "ROLE_" + role.toUpperCase().replace(' ', '_');
        return currentUser().getAuthorities().stream().anyMatch(item -> item.getAuthority().equals(authority));
    }

}
