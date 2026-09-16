package com.cubeage.erp.purchase.repository;

import com.cubeage.erp.purchase.entity.GoodsReceipt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoodsReceiptRepository
        extends JpaRepository<GoodsReceipt, Long> {

    List<GoodsReceipt> findByTenantIdOrderByCreatedAtDesc(Long tenantId);

    Optional<GoodsReceipt> findByIdAndTenantId(Long id, Long tenantId);

    boolean existsByTenantIdAndPurchaseOrderId(
            Long tenantId,
            Long purchaseOrderId
    );

    List<GoodsReceipt> findByTenantIdAndPurchaseOrderId(
            Long tenantId,
            Long purchaseOrderId
    );

    long countByTenantIdAndVendorId(Long tenantId, Long vendorId);

        List<GoodsReceipt> findByTenantIdAndVendorId(Long tenantId, Long vendorId);
}