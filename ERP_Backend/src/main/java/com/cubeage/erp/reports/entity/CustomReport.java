package com.cubeage.erp.reports.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.reports.enums.ReportCategory;
import com.cubeage.erp.reports.enums.ReportStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "custom_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomReport extends BaseEntity {

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ReportCategory module;

    @Column(name = "report_type", nullable = false, length = 50)
    private String reportType;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, length = 50)
    private String visibility;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "data_source", nullable = false)
    private String dataSource;

    @Column(name = "primary_table", nullable = false)
    private String primaryTable;

    @Column(name = "selected_fields", length = 4000)
    private String selectedFieldsJson;

    @Column(name = "filters", length = 4000)
    private String filtersJson;

    @Column(name = "match_type", length = 10)
    private String matchType;

    @Column(name = "date_field")
    private String dateField;

    @Column(name = "date_range")
    private String dateRange;

    @Column(name = "from_date")
    private LocalDate fromDate;

    @Column(name = "to_date")
    private LocalDate toDate;

    @Column(name = "group_by", length = 1000)
    private String groupByJson;

    @Column(name = "sort_by")
    private String sortBy;

    @Column(name = "sort_dir", length = 10)
    private String sortDir;

    @Column(name = "calculations", length = 4000)
    private String calculationsJson;

    @Column(name = "viz_type", nullable = false, length = 50)
    private String vizType;

    @Column(name = "kpi_enabled", nullable = false)
    private Boolean kpiEnabled;

    @Column(name = "kpis", length = 4000)
    private String kpisJson;

    @Column(name = "sched_enabled", nullable = false)
    private Boolean schedEnabled;

    @Column(name = "export_formats", length = 1000)
    private String exportFormatsJson;

    @Column(name = "export_includes", length = 2000)
    private String exportIncludesJson;

    @Column(name = "shared_users", length = 4000)
    private String sharedUsersJson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ReportStatus status;
}
