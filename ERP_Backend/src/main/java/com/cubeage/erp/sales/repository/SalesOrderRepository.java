package com.cubeage.erp.sales.repository;
import com.cubeage.erp.sales.entity.SalesOrder;
import com.cubeage.erp.sales.enums.SalesOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface SalesOrderRepository extends JpaRepository<SalesOrder,Long>{
 List<SalesOrder> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
 Optional<SalesOrder> findByIdAndTenantId(Long id,Long tenantId);
 boolean existsByTenantIdAndQuotationId(Long tenantId,Long quotationId);
 long countByTenantIdAndStatusIn(Long tenantId,Collection<SalesOrderStatus> statuses);
}
