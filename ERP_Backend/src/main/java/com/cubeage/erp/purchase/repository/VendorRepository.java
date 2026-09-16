package com.cubeage.erp.purchase.repository;

import com.cubeage.erp.purchase.entity.Vendor;
import com.cubeage.erp.purchase.enums.VendorStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

    List<Vendor> findByTenantIdOrderByCreatedAtDesc(Long tenantId);

    Optional<Vendor> findByIdAndTenantId(Long id, Long tenantId);

    boolean existsByTenantIdAndVendorCode(Long tenantId, String vendorCode);

    long countByTenantId(Long tenantId);

    long countByTenantIdAndStatus(Long tenantId, VendorStatus status);
}