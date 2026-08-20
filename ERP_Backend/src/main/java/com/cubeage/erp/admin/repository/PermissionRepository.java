package com.cubeage.erp.admin.repository;

import com.cubeage.erp.admin.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PermissionRepository
        extends JpaRepository<Permission, Long> {

    List<Permission>
    findByModuleIgnoreCase(
            String module
    );

    boolean
    existsByModuleIgnoreCaseAndActionAndScope(
            String module,
            Permission.Action action,
            Permission.Scope scope
    );
}