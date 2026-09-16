package com.cubeage.erp.documents.repository;

import com.cubeage.erp.documents.entity.DocumentTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentTagRepository extends JpaRepository<DocumentTag, Long> {

    List<DocumentTag> findByDocument_IdAndTenantId(Long documentId, Long tenantId);
}