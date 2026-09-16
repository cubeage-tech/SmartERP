package com.cubeage.erp.inventory.entity;

import com.cubeage.erp.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "inventory_stock_take_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockTakeItem extends BaseEntity {
	@Column(name = "tenant_id", nullable = false)
	private Long tenantId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "stock_take_id", nullable = false)
	private StockTake stockTake;

	@Column(name = "item_id")
	private Long itemId;

	@Column(nullable = false, length = 50)
	private String sku;

	@Column(name = "item_name", nullable = false, length = 150)
	private String itemName;

	@Column(nullable = false, length = 20)
	private String unit;

	@Column(name = "system_quantity", nullable = false, precision = 19, scale = 3)
	private BigDecimal systemQuantity;

	@Column(name = "counted_quantity", precision = 19, scale = 3)
	private BigDecimal countedQuantity;

	@Column(precision = 19, scale = 3)
	private BigDecimal variance;

	@Column(length = 255)
	private String notes;
}
