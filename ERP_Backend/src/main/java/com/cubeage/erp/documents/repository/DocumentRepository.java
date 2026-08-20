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

    Optional<Document> findByIdAndCompanyId(Long id, Long companyId);

    List<Document> findByCompanyIdOrderByCreatedAtDesc(Long companyId);

    List<Document> findByCompanyIdAndUploadedByUserIdOrderByCreatedAtDesc(
            Long companyId,
            Long uploadedByUserId
    );

    long countByCompanyId(Long companyId);

    long countByCompanyIdAndCreatedAtGreaterThanEqual(Long companyId, LocalDateTime startDate);

    long countByCompanyIdAndStatus(Long companyId, DocumentStatus status);

    long countByCompanyIdAndOcrCompletedTrue(Long companyId);

    @Query("""
            select distinct d
            from Document d
            left join d.tags t
            where d.companyId = :companyId
              and (:search is null
                   or lower(d.title) like lower(concat('%', :search, '%'))
                   or lower(d.documentNumber) like lower(concat('%', :search, '%'))
                   or lower(d.originalFileName) like lower(concat('%', :search, '%'))
                   or lower(t.name) like lower(concat('%', :search, '%')))
              and (:type is null or d.type = :type)
            order by d.createdAt desc
            """)
    List<Document> search(
            @Param("companyId") Long companyId,
            @Param("search") String search,
            @Param("type") DocumentType type
    );

    @Query("select coalesce(sum(d.fileSize), 0) from Document d where d.companyId = :companyId")
    Long sumFileSizeByCompanyId(@Param("companyId") Long companyId);
}
