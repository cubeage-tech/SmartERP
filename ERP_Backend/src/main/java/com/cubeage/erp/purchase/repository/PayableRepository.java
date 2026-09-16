package com.cubeage.erp.purchase.repository;

import com.cubeage.erp.purchase.entity.Payable;
import com.cubeage.erp.purchase.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface PayableRepository extends JpaRepository<Payable, Long> {

    List<Payable> findByTenantIdOrderByDueDateAsc(Long tenantId);

    Optional<Payable> findByIdAndTenantId(Long id, Long tenantId);

    boolean existsByTenantIdAndInvoiceReference(
            Long tenantId,
            String invoiceReference
    );

    boolean existsByTenantIdAndPaymentReference(Long tenantId, String paymentReference);

    boolean existsByTenantIdAndPurchaseOrderId(Long tenantId, Long purchaseOrderId);

    List<Payable> findByTenantIdAndPurchaseOrderId(Long tenantId, Long purchaseOrderId);

    long countByTenantIdAndVendorId(Long tenantId, Long vendorId);

    List<Payable> findByTenantIdAndVendorId(Long tenantId, Long vendorId);

    @Query("""
        select coalesce(sum(p.balanceDue), 0)
        from Payable p
        where p.tenantId = :tenantId
          and p.status <>
              com.cubeage.erp.purchase.enums.PaymentStatus.PAID
    """)
    BigDecimal totalOutstandingPayables(@Param("tenantId") Long tenantId);

    @Query("""
        select coalesce(sum(p.balanceDue), 0)
        from Payable p
        where p.tenantId = :tenantId
          and p.status =
              com.cubeage.erp.purchase.enums.PaymentStatus.OVERDUE
    """)
    BigDecimal totalOverduePayables(@Param("tenantId") Long tenantId);

    List<Payable> findByTenantIdAndStatusIn(
            Long tenantId,
            List<PaymentStatus> statuses
    );
}
