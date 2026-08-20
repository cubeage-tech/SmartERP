package com.cubeage.erp.settings.repository;

import com.cubeage.erp.settings.entity.BackupRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BackupRecordRepository extends JpaRepository<BackupRecord, Long> {
    List<BackupRecord> findTop50ByTenantIdOrderByCreatedAtDesc(Long tenantId);
    Optional<BackupRecord> findFirstByTenantIdOrderByCreatedAtDesc(Long tenantId);
}
