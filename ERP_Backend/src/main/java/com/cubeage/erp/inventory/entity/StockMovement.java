package com.cubeage.erp.inventory.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.inventory.enums.StockMovementType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "inventory_stock_movements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovement extends BaseEntity {
	@Column(name = "tenant_id", nullable = false)
	private Long tenantId;

	@Column(nullable = false, length = 50)
	private String sku;

	@Column(name = "item_name", nullable = false, length = 150)
	private String itemName;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private StockMovementType type;

	@Column(nullable = false, precision = 19, scale = 3)
	private BigDecimal quantity;

	@Column(nullable = false, length = 20)
	private String unit;

	@Column(name = "warehouse_code", nullable = false, length = 30)
	private String warehouseCode;

	@Column(nullable = false, length = 100)
	private String warehouseName;

	@Column(length = 100)
	private String reference;

	@Column(name = "movement_date", nullable = false)
	private LocalDate movementDate;
}
