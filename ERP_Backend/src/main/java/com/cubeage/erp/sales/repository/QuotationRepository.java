package com.cubeage.erp.sales.repository;
import com.cubeage.erp.sales.entity.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface QuotationRepository extends JpaRepository<Quotation,Long>{
 List<Quotation> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
 Optional<Quotation> findByIdAndTenantId(Long id,Long tenantId);
 long countByTenantId(Long tenantId);
}
