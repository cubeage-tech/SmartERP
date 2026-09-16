package com.cubeage.erp.documents.repository;

import com.cubeage.erp.documents.entity.OcrExtraction;
import com.cubeage.erp.documents.enums.OcrStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OcrExtractionRepository extends JpaRepository<OcrExtraction, Long> {

    Optional<OcrExtraction> findByDocument_IdAndTenantId(Long documentId, Long tenantId);

    List<OcrExtraction> findByTenantIdOrderByProcessedAtDesc(Long tenantId);

    long countByTenantIdAndStatus(Long tenantId, OcrStatus status);

    long countByTenantIdAndProcessedAtGreaterThanEqual(Long tenantId, LocalDateTime start);

    long countByTenantIdAndAutoPostedToGlTrue(Long tenantId);

    long countByTenantIdAndManualReviewRequiredTrue(Long tenantId);

    @Query("""
            select coalesce(avg(o.confidence), 0)
            from OcrExtraction o
            where o.tenantId = :tenantId
              and o.status in :statuses
            """)
    Double averageConfidence(
            @Param("tenantId") Long tenantId,
            @Param("statuses") List<OcrStatus> statuses
    );

    @Query("""
            select count(o)
            from OcrExtraction o
            where o.tenantId = :tenantId
              and o.status in :statuses
            """)
    long countIndexed(
            @Param("tenantId") Long tenantId,
            @Param("statuses") List<OcrStatus> statuses
    );
}
