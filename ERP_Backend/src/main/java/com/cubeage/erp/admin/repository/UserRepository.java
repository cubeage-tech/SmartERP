package com.cubeage.erp.admin.repository;

import com.cubeage.erp.admin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByTenantIdAndEmailIgnoreCase(
            Long tenantId,
            String email
    );

    boolean existsByTenantIdAndEmailIgnoreCase(
            Long tenantId,
            String email
    );

    List<User> findByTenantIdOrderByIdDesc(
            Long tenantId
    );

    long countByTenantId(
            Long tenantId
    );

    long countByTenantIdAndActiveTrue(
            Long tenantId
    );
}