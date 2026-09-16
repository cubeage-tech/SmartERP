package com.cubeage.erp.inventory.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.inventory.enums.StockTakeStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inventory_stock_takes", uniqueConstraints = @UniqueConstraint(name = "uk_inventory_stock_take_tenant_code", columnNames = {"tenant_id", "code"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockTake extends BaseEntity {
	@Column(name = "tenant_id", nullable = false)
	private Long tenantId;

	@Column(nullable = false, length = 50)
	private String code;

	@Column(nullable = false, length = 150)
	private String title;

	@Column(name = "warehouse_code", nullable = false, length = 30)
	private String warehouseCode;

	@Column(name = "warehouse_name", nullable = false, length = 100)
	private String warehouseName;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private StockTakeStatus status;

	@Column(name = "scheduled_date", nullable = false)
	private LocalDate scheduledDate;

	@Column(name = "completed_date")
	private LocalDate completedDate;

	@Column(columnDefinition = "TEXT")
	private String notes;

	@Builder.Default
	@OneToMany(mappedBy = "stockTake", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<StockTakeItem> items = new ArrayList<>();
}
