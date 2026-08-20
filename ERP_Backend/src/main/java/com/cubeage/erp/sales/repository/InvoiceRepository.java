package com.cubeage.erp.sales.repository;
import com.cubeage.erp.sales.entity.Invoice;
import com.cubeage.erp.sales.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.*;
public interface InvoiceRepository extends JpaRepository<Invoice,Long>{
 List<Invoice> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
 Optional<Invoice> findByIdAndTenantId(Long id,Long tenantId);
 List<Invoice> findByTenantIdAndIssueDateBetweenAndStatusNotOrderByIssueDateAsc(
         Long tenantId,
         java.time.LocalDate from,
         java.time.LocalDate to,
         InvoiceStatus status
 );
 boolean existsByTenantIdAndSalesOrderId(Long tenantId,Long salesOrderId);
 long countByTenantIdAndStatusIn(Long tenantId,Collection<InvoiceStatus> statuses);
 @Query("select coalesce(sum(i.totalAmount),0) from Invoice i where i.tenantId=:tenantId and i.status<>com.cubeage.erp.sales.enums.InvoiceStatus.CANCELLED") BigDecimal totalSales(@Param("tenantId") Long tenantId);
 @Query("select coalesce(sum(i.balanceDue),0) from Invoice i where i.tenantId=:tenantId and i.status<>com.cubeage.erp.sales.enums.InvoiceStatus.CANCELLED") BigDecimal outstanding(@Param("tenantId") Long tenantId);
}
