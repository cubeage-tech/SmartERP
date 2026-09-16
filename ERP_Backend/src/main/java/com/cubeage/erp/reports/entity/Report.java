package com.cubeage.erp.reports.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.reports.enums.ReportCategory;
import com.cubeage.erp.reports.enums.ReportFrequency;
import com.cubeage.erp.reports.enums.ReportStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report extends BaseEntity {

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ReportCategory category;

    @Column(nullable = false, length = 50)
    private String format;

    @Column(name = "last_run")
    private LocalDateTime lastRun;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ReportFrequency schedule;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ReportStatus status;
}
