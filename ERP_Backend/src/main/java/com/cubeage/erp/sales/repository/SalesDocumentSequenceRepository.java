package com.cubeage.erp.sales.repository;

import com.cubeage.erp.sales.entity.SalesDocumentSequence;
import com.cubeage.erp.sales.enums.SalesDocumentType;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SalesDocumentSequenceRepository
        extends JpaRepository<SalesDocumentSequence, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select sequence
            from SalesDocumentSequence sequence
            where sequence.tenantId = :tenantId
              and sequence.documentType = :documentType
              and sequence.documentYear = :documentYear
            """)
    Optional<SalesDocumentSequence> findForUpdate(
            @Param("tenantId") Long tenantId,
            @Param("documentType") SalesDocumentType documentType,
            @Param("documentYear") Integer documentYear
    );
}
