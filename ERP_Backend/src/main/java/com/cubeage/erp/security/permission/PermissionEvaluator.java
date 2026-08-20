package com.cubeage.erp.security.permission;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("permissionEvaluator")
@RequiredArgsConstructor
public class PermissionEvaluator {

    private final PermissionService permissionService;

    public boolean has(Authentication authentication, String module, String action) {
        return permissionService.hasPermission(authentication, module, action);
    }

    public boolean has(Authentication authentication, String module, String action, String scope) {
        return permissionService.hasPermission(authentication, module, action, scope);
    }

}
