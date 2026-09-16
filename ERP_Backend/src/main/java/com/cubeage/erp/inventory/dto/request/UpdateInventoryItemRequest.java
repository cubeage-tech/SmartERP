package com.cubeage.erp.inventory.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateInventoryItemRequest(
	// 1. Basic
	@Size(max = 150) String name,
	@Size(max = 80) String itemType,
	@Size(max = 80) String category,
	@Size(max = 80) String subCategory,
	@Size(max = 100) String barcode,
	@Size(max = 50) String hsnSacCode,
	String description,

	// 2. Units
	@Size(max = 20) String unit,
	@Size(max = 20) String purchaseUnit,
	@Size(max = 20) String salesUnit,
	@Size(max = 20) String stockUnit,
	@DecimalMin("0") BigDecimal conversionFactor,

	// 3. Warehouse & Stock
	@Size(max = 30) String warehouseCode,
	@Size(max = 100) String warehouseName,
	@Size(max = 100) String storageLocation,
	@DecimalMin("0") BigDecimal quantity,
	@DecimalMin("0") BigDecimal minimumLevel,
	@DecimalMin("0") BigDecimal maximumStockLevel,
	@DecimalMin("0") BigDecimal reorderLevel,
	@DecimalMin("0") BigDecimal reorderQuantity,

	// 4. Pricing
	@DecimalMin("0") BigDecimal costPrice,
	@DecimalMin("0") BigDecimal sellingPrice,
	@Size(max = 80) String costingMethod,
	@DecimalMin("0") BigDecimal taxRate,

	// 5. Supplier
	@Size(max = 150) String primarySupplier,
	@Size(max = 100) String supplierItemCode,
	@Min(0) Integer leadTime,
	Boolean preferredSupplier,

	// 6. Tax
	Boolean taxableItem,
	@DecimalMin("0") BigDecimal gstRate,
	@DecimalMin("0") BigDecimal cgst,
	@DecimalMin("0") BigDecimal sgst,
	@DecimalMin("0") BigDecimal igst,
	@Size(max = 50) String taxHsnCode,

	// 7. Stock Control
	Boolean trackInventory,
	Boolean trackBatch,
	Boolean trackSerialNumber,
	Boolean lowStockAlert,
	Boolean autoReorder,
	Boolean allowNegativeStock,

	// 8. Batch / Expiry
	Boolean batchTracking,
	Boolean expiryTracking,
	@Min(0) Integer shelfLife,
	LocalDate manufacturingDate,
	LocalDate expiryDate,
	@Size(max = 50) String batchPrefix,

	// 9. Specifications
	@DecimalMin("0") BigDecimal length,
	@DecimalMin("0") BigDecimal width,
	@DecimalMin("0") BigDecimal thickness,
	@DecimalMin("0") BigDecimal weight,
	@Size(max = 100) String gradeModel,
	String specification,

	// 10. Attachments
	String attachmentsJson,

	// 11. Notes
	String internalNotes,
	String additionalNotes
) {
}
