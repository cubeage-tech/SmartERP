package com.cubeage.erp.inventory.entity;

import com.cubeage.erp.common.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.*;

@Entity
@Table(name = "inventory_warehouses", uniqueConstraints = @UniqueConstraint(name = "uk_inventory_warehouse_tenant_code", columnNames = {"tenant_id", "code"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Warehouse extends BaseEntity {
	@Column(name = "tenant_id", nullable = false)
	private Long tenantId;

	@Column(nullable = false, length = 30)
	private String code;

	@Column(nullable = false, length = 100)
	private String name;

	@Column(nullable = false, length = 150)
	private String location;

	@Column(nullable = false, length = 30)
	private String area;

	@Column(nullable = false)
	private Integer capacityPercent;

	@Column(nullable = false)
	private boolean active;
}
