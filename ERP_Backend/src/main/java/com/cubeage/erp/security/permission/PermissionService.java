package com.cubeage.erp.security.permission;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class PermissionService {

    public boolean hasPermission(Authentication authentication, String module, String action) {
        if (authentication == null || !authentication.isAuthenticated()) return false;
        String prefix = normalize(module) + "_" + normalize(action) + "_";
        return authentication.getAuthorities().stream()
                .map(authority -> authority.getAuthority().toUpperCase(Locale.ROOT))
                .anyMatch(authority -> authority.equals("ROLE_SUPER_ADMIN")
                        || authority.equals("ROLE_TENANT_ADMIN") || authority.startsWith(prefix));
    }

    public boolean hasPermission(Authentication authentication, String module, String action, String scope) {
        if (authentication == null || !authentication.isAuthenticated()) return false;
        String expected = normalize(module) + "_" + normalize(action) + "_" + normalize(scope);
        return authentication.getAuthorities().stream().anyMatch(authority ->
                authority.getAuthority().equalsIgnoreCase(expected)
                        || authority.getAuthority().equals("ROLE_SUPER_ADMIN")
                        || authority.getAuthority().equals("ROLE_TENANT_ADMIN"));
    }

    private String normalize(String value) {
        return value.trim().toUpperCase(Locale.ROOT).replace(' ', '_');
    }

}
