package com.cubeage.erp.documents.repository;

import com.cubeage.erp.documents.entity.Document;
import com.cubeage.erp.documents.enums.DocumentStatus;
import com.cubeage.erp.documents.enums.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    Optional<Document> findByIdAndTenantId(Long id, Long tenantId);

    List<Document> findByTenantIdOrderByCreatedAtDesc(Long tenantId);

    List<Document> findByTenantIdAndUploadedByUserIdOrderByCreatedAtDesc(
            Long tenantId,
            Long uploadedByUserId
    );

    long countByTenantId(Long tenantId);

    long countByTenantIdAndCreatedAtGreaterThanEqual(Long tenantId, LocalDateTime startDate);

    long countByTenantIdAndStatus(Long tenantId, DocumentStatus status);

    long countByTenantIdAndOcrCompletedTrue(Long tenantId);

    @Query("""
            select distinct d
            from Document d
            left join d.tags t
            where d.tenantId = :tenantId
              and (cast(:search as string) is null
                   or lower(d.title) like concat('%', lower(cast(:search as string)), '%')
                   or lower(d.documentNumber) like concat('%', lower(cast(:search as string)), '%')
                   or lower(d.originalFileName) like concat('%', lower(cast(:search as string)), '%')
                   or lower(t.name) like concat('%', lower(cast(:search as string)), '%'))
              and (:type is null or d.type = :type)
              and (cast(:category as string) is null or lower(d.category) = lower(cast(:category as string)))
            order by d.createdAt desc
            """)
    List<Document> search(
            @Param("tenantId") Long tenantId,
            @Param("search") String search,
            @Param("type") DocumentType type,
            @Param("category") String category
    );

    @Query("select coalesce(sum(d.fileSize), 0) from Document d where d.tenantId = :tenantId")
    Long sumFileSizeByTenantId(@Param("tenantId") Long tenantId);
}
