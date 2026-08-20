package com.cubeage.erp.superAdmin.repository;

import com.cubeage.erp.superAdmin.entity.PlatformUser;
import com.cubeage.erp.superAdmin.enums.PlatformRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlatformUserRepository extends JpaRepository<PlatformUser, Long> {
    Optional<PlatformUser> findByEmail(String email);
    boolean existsByEmail(String email);
    List<PlatformUser> findByRole(PlatformRole role);
    List<PlatformUser> findByIsActiveTrue();
}
