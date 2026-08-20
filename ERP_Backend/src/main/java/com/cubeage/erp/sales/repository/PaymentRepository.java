package com.cubeage.erp.sales.repository;
import com.cubeage.erp.sales.entity.Payment;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
public interface PaymentRepository extends JpaRepository<Payment,Long>{
 List<Payment> findByTenantIdAndInvoiceIdOrderByPaidAtDesc(Long tenantId,Long invoiceId);
 boolean existsByTenantIdAndReference(Long tenantId,String reference);
 @Query("select coalesce(sum(p.amount),0) from Payment p where p.tenantId=:tenantId") BigDecimal totalReceived(@Param("tenantId") Long tenantId);
}
