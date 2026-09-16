package com.cubeage.erp.reports.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.reports.enums.ReportFormat;
import com.cubeage.erp.reports.enums.ReportFrequency;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "report_schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportSchedule extends BaseEntity {

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "custom_report_id")
    private CustomReport customReport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id")
    private Report report;

    @Column(name = "is_custom", nullable = false)
    private Boolean isCustom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ReportFrequency frequency;

    @Column(name = "day_of_week", length = 20)
    private String dayOfWeek;

    @Column(name = "time_of_day", nullable = false, length = 10)
    private String timeOfDay;

    @Column(nullable = false, length = 2000)
    private String recipients;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReportFormat format;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(nullable = false)
    private Boolean active;
}
