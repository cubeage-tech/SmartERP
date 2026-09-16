package com.cubeage.erp.documents.repository;

import com.cubeage.erp.documents.entity.DocumentVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentVersionRepository extends JpaRepository<DocumentVersion, Long> {

    List<DocumentVersion> findByDocument_IdAndTenantIdOrderByVersionNumberDesc(Long documentId, Long tenantId);

    Optional<DocumentVersion> findByIdAndDocument_IdAndTenantId(Long id, Long documentId, Long tenantId);

    Optional<DocumentVersion> findTopByDocument_IdAndTenantIdOrderByVersionNumberDesc(Long documentId, Long tenantId);
}