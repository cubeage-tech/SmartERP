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

    Optional<OcrExtraction> findByDocument_IdAndCompanyId(Long documentId, Long companyId);

    List<OcrExtraction> findByCompanyIdOrderByProcessedAtDesc(Long companyId);

    long countByCompanyIdAndStatus(Long companyId, OcrStatus status);

    long countByCompanyIdAndProcessedAtGreaterThanEqual(Long companyId, LocalDateTime start);

    long countByCompanyIdAndAutoPostedToGlTrue(Long companyId);

    long countByCompanyIdAndManualReviewRequiredTrue(Long companyId);

    @Query("""
            select coalesce(avg(o.confidence), 0)
            from OcrExtraction o
            where o.companyId = :companyId
              and o.status in :statuses
            """)
    Double averageConfidence(
            @Param("companyId") Long companyId,
            @Param("statuses") List<OcrStatus> statuses
    );

    @Query("""
            select count(o)
            from OcrExtraction o
            where o.companyId = :companyId
              and o.status in :statuses
            """)
    long countIndexed(
            @Param("companyId") Long companyId,
            @Param("statuses") List<OcrStatus> statuses
    );
}
