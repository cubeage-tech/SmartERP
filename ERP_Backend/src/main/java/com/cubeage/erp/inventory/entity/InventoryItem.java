package com.cubeage.erp.inventory.entity;

import com.cubeage.erp.common.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "inventory_items", uniqueConstraints = @UniqueConstraint(name = "uk_inventory_item_tenant_sku", columnNames = {"tenant_id", "sku"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryItem extends BaseEntity {
	@Column(name = "tenant_id", nullable = false)
	private Long tenantId;

	// 1. Basic Information
	@Column(nullable = false, length = 50)
	private String sku;

	@Column(nullable = false, length = 150)
	private String name;

	@Column(name = "item_type", length = 80)
	private String itemType;

	@Column(nullable = false, length = 80)
	private String category;

	@Column(name = "sub_category", length = 80)
	private String subCategory;

	@Column(length = 100)
	private String barcode;

	@Column(name = "hsn_sac_code", length = 50)
	private String hsnSacCode;

	@Column(columnDefinition = "TEXT")
	private String description;

	// 2. Units of Measurement
	@Column(nullable = false, length = 20)
	private String unit; // Base unit

	@Column(name = "purchase_unit", length = 20)
	private String purchaseUnit;

	@Column(name = "sales_unit", length = 20)
	private String salesUnit;

	@Column(name = "stock_unit", length = 20)
	private String stockUnit;

	@Column(name = "conversion_factor", precision = 19, scale = 4)
	private BigDecimal conversionFactor;

	// 3. Warehouse & Stock Levels
	@Column(name = "warehouse_code", nullable = false, length = 30)
	private String warehouseCode;

	@Column(name = "warehouse_name", nullable = false, length = 100)
	private String warehouseName;

	@Column(name = "storage_location", length = 100)
	private String storageLocation;

	@Column(nullable = false, precision = 19, scale = 3)
	private BigDecimal quantity;

	@Column(name = "minimum_level", nullable = false, precision = 19, scale = 3)
	private BigDecimal minimumLevel;

	@Column(name = "maximum_stock_level", precision = 19, scale = 3)
	private BigDecimal maximumStockLevel;

	@Column(name = "reorder_level", precision = 19, scale = 3)
	private BigDecimal reorderLevel;

	@Column(name = "reorder_quantity", precision = 19, scale = 3)
	private BigDecimal reorderQuantity;

	// 4. Pricing & Valuation
	@Column(name = "cost_price", nullable = false, precision = 19, scale = 2)
	private BigDecimal costPrice;

	@Column(name = "selling_price", precision = 19, scale = 2)
	private BigDecimal sellingPrice;

	@Column(name = "costing_method", length = 80)
	private String costingMethod;

	@Column(name = "tax_rate", precision = 19, scale = 2)
	private BigDecimal taxRate;

	// 5. Supplier Information
	@Column(name = "primary_supplier", length = 150)
	private String primarySupplier;

	@Column(name = "supplier_item_code", length = 100)
	private String supplierItemCode;

	@Column(name = "lead_time")
	private Integer leadTime;

	@Column(name = "preferred_supplier")
	private Boolean preferredSupplier;

	// 6. Tax Information
	@Column(name = "taxable_item")
	private Boolean taxableItem;

	@Column(name = "gst_rate", precision = 19, scale = 2)
	private BigDecimal gstRate;

	@Column(precision = 19, scale = 2)
	private BigDecimal cgst;

	@Column(precision = 19, scale = 2)
	private BigDecimal sgst;

	@Column(precision = 19, scale = 2)
	private BigDecimal igst;

	@Column(name = "tax_hsn_code", length = 50)
	private String taxHsnCode;

	// 7. Stock Control
	@Column(name = "track_inventory")
	private Boolean trackInventory;

	@Column(name = "track_batch")
	private Boolean trackBatch;

	@Column(name = "track_serial_number")
	private Boolean trackSerialNumber;

	@Column(name = "low_stock_alert")
	private Boolean lowStockAlert;

	@Column(name = "auto_reorder")
	private Boolean autoReorder;

	@Column(name = "allow_negative_stock")
	private Boolean allowNegativeStock;

	// 8. Batch & Expiry
	@Column(name = "batch_tracking")
	private Boolean batchTracking;

	@Column(name = "expiry_tracking")
	private Boolean expiryTracking;

	@Column(name = "shelf_life")
	private Integer shelfLife;

	@Column(name = "manufacturing_date")
	private LocalDate manufacturingDate;

	@Column(name = "expiry_date")
	private LocalDate expiryDate;

	@Column(name = "batch_prefix", length = 50)
	private String batchPrefix;

	// 9. Specifications
	@Column(precision = 19, scale = 3)
	private BigDecimal length;

	@Column(precision = 19, scale = 3)
	private BigDecimal width;

	@Column(precision = 19, scale = 3)
	private BigDecimal thickness;

	@Column(precision = 19, scale = 3)
	private BigDecimal weight;

	@Column(name = "grade_model", length = 100)
	private String gradeModel;

	@Column(columnDefinition = "TEXT")
	private String specification;

	// 10. Attachments (metadata/DMS references)
	@Column(name = "attachments_json", columnDefinition = "TEXT")
	private String attachmentsJson;

	// 11. Notes
	@Column(name = "internal_notes", columnDefinition = "TEXT")
	private String internalNotes;

	@Column(name = "additional_notes", columnDefinition = "TEXT")
	private String additionalNotes;
}
