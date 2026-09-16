package com.cubeage.erp.finance.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.finance.enums.*;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "finance_alerts") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FinanceAlert extends BaseEntity {
	@Column(name = "tenant_id", nullable = false) private Long tenantId;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private AlertSeverity severity;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private AlertType type;
	@Column(nullable = false, length = 500) private String title;
	@Column(name = "alert_time", nullable = false, length = 40) private String time;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private AlertStatus status;
}
