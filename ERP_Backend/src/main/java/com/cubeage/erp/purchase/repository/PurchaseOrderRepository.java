package com.cubeage.erp.purchase.repository;

import com.cubeage.erp.purchase.entity.PurchaseOrder;
import com.cubeage.erp.purchase.enums.PurchaseOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PurchaseOrderRepository
        extends JpaRepository<PurchaseOrder, Long> {

    List<PurchaseOrder> findByTenantIdOrderByCreatedAtDesc(Long tenantId);

    @Query(value = """
        select po.id as "id",
               po.tenant_id as "tenantId",
               po.order_number as "orderNumber",
               po.vendor_id as "vendorId",
               po.vendor_name as "vendorName",
               po.status as "status",
               po.order_date as "orderDate",
               po.expected_delivery_date as "expectedDeliveryDate",
               po.total_amount as "totalAmount",
               (select count(*) from purchase_order_items poi where poi.purchase_order_id = po.id) as "itemCount"
          from purchase_orders po
         where po.tenant_id = :tenantId
         order by po.created_at desc
        """, nativeQuery = true)
    List<PurchaseOrderListView> findListViewByTenantId(@Param("tenantId") Long tenantId);

    interface PurchaseOrderListView {
        Long getId();
        Long getTenantId();
        String getOrderNumber();
        Long getVendorId();
        String getVendorName();
        String getStatus();
        LocalDate getOrderDate();
        LocalDate getExpectedDeliveryDate();
        BigDecimal getTotalAmount();
        Integer getItemCount();
    }

    Optional<PurchaseOrder> findByIdAndTenantId(Long id, Long tenantId);

    List<PurchaseOrder> findByTenantIdAndOrderDateBetween(
            Long tenantId,
            LocalDate from,
            LocalDate to
    );

    long countByTenantIdAndVendorId(Long tenantId, Long vendorId);

    List<PurchaseOrder> findByTenantIdAndVendorId(Long tenantId, Long vendorId);

    long countByTenantId(Long tenantId);

    long countByTenantIdAndStatus(
            Long tenantId,
            PurchaseOrderStatus status
    );

    @Query("""
        select coalesce(sum(po.totalAmount), 0)
        from PurchaseOrder po
        where po.tenantId = :tenantId
          and po.status <>
              com.cubeage.erp.purchase.enums.PurchaseOrderStatus.CANCELLED
          and po.orderDate between :from and :to
    """)
    BigDecimal sumPurchaseAmountBetween(
            @Param("tenantId") Long tenantId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );
}
