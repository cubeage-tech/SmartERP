package com.cubeage.erp.finance.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.finance.enums.AccountType;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "finance_accounts", uniqueConstraints = @UniqueConstraint(name = "uk_finance_account_tenant_code", columnNames = {"tenant_id", "code"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Account extends BaseEntity {
	@Column(name = "tenant_id", nullable = false) private Long tenantId;
	@Column(nullable = false, length = 30) private String code;
	@Column(nullable = false, length = 120) private String name;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private AccountType type;
	@Column(nullable = false) private boolean active;
}
