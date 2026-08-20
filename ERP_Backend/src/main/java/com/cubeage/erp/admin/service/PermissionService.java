package com.cubeage.erp.admin.service;

import com.cubeage.erp.admin.entity.Permission;
import com.cubeage.erp.admin.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("adminPermissionService")
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public List<Permission> getAllPermissions() {

        return permissionRepository.findAll();
    }

    public List<Permission> getByModule(
            String module
    ) {

        return permissionRepository
                .findByModuleIgnoreCase(module);
    }
}