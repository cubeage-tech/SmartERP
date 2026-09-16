import React, { useState, useEffect } from "react";
import { X, Check, AlertCircle, Package } from "lucide-react";
import InventoryService from "../../../../core/services/modules/inventory.service";

const ITEM_TYPES = [
  "Raw Material",
  "Finished Goods",
  "Semi-Finished",
  "Component",
  "Hardware",
  "Consumable",
  "PPE",
  "Packaging",
  "Service",
  "Asset",
];

const CATEGORIES = [
  "Raw Material",
  "Hardware",
  "Components",
  "Consumables",
  "PPE",
  "Electrical",
  "Mechanical",
  "Packaging",
  "Chemicals",
  "Tools",
];

const UNITS = ["kg", "pcs", "box", "litre", "pair", "meter", "roll", "set", "tonne", "gram", "pack"];

const COSTING_METHODS = [
  "FIFO (First In First Out)",
  "LIFO (Last In First Out)",
  "Weighted Average Cost",
  "Standard Costing",
];

const GST_RATES = [
  { label: "0% (Exempt / Nil)", rate: 0 },
  { label: "5% (Standard Concession)", rate: 5 },
  { label: "12% (Standard Lower)", rate: 12 },
  { label: "18% (Standard Higher)", rate: 18 },
  { label: "28% (Luxury / De-merit)", rate: 28 },
];

export default function EditItemModal({ item, warehouses = [], onClose, onSuccess }) {
  const [name, setName] = useState(item?.name || "");
  const [sku] = useState(item?.sku || "");
  const [description, setDescription] = useState(item?.description || "");
  const [category, setCategory] = useState(item?.category || "Raw Material");
  const [subCategory, setSubCategory] = useState(item?.subCategory || "");
  const [itemType, setItemType] = useState(item?.itemType || "Raw Material");
  const [gradeModel, setGradeModel] = useState(item?.gradeModel || "");
  const [supplierItemCode, setSupplierItemCode] = useState(item?.supplierItemCode || "");
  const [barcode, setBarcode] = useState(item?.barcode || "");
  const [hsnSacCode, setHsnSacCode] = useState(item?.hsnSacCode || "");
  const [unit, setUnit] = useState(item?.unit || "pcs");
  const [gstRate, setGstRate] = useState(item?.gstRate != null ? Number(item.gstRate) : 18);

  // Stock config
  const [warehouseCode, setWarehouseCode] = useState(item?.warehouseCode || "W1");
  const [storageLocation, setStorageLocation] = useState(item?.storageLocation || "");
  const [quantity, setQuantity] = useState(item?.quantity != null ? String(item.quantity) : "0");
  const [minimumLevel, setMinimumLevel] = useState(item?.minimumLevel != null ? String(item.minimumLevel) : "10");
  const [maximumStockLevel, setMaximumStockLevel] = useState(
    item?.maximumStockLevel != null ? String(item.maximumStockLevel) : ""
  );
  const [reorderLevel, setReorderLevel] = useState(
    item?.reorderLevel != null ? String(item.reorderLevel) : ""
  );
  const [reorderQuantity, setReorderQuantity] = useState(
    item?.reorderQuantity != null ? String(item.reorderQuantity) : ""
  );

  // Pricing
  const [costPrice, setCostPrice] = useState(item?.costPrice != null ? String(item.costPrice) : "0");
  const [sellingPrice, setSellingPrice] = useState(item?.sellingPrice != null ? String(item.sellingPrice) : "0");
  const [costingMethod, setCostingMethod] = useState(item?.costingMethod || "Weighted Average Cost");
  const [taxableItem, setTaxableItem] = useState(item?.taxableItem !== false);

  // Other
  const [primarySupplier, setPrimarySupplier] = useState(item?.primarySupplier || "");
  const [leadTime, setLeadTime] = useState(item?.leadTime != null ? String(item.leadTime) : "7");
  const [internalNotes, setInternalNotes] = useState(item?.internalNotes || "");
  const [additionalNotes, setAdditionalNotes] = useState(item?.additionalNotes || "");

  const [activeTab, setActiveTab] = useState("info");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [saving, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Item Name is required.");
      setActiveTab("info");
      return;
    }
    if (isNaN(Number(costPrice)) || Number(costPrice) < 0) {
      setError("Cost Price must be a valid non-negative number.");
      setActiveTab("pricing");
      return;
    }
    if (isNaN(Number(minimumLevel)) || Number(minimumLevel) < 0) {
      setError("Minimum Safety Level must be a valid non-negative number.");
      setActiveTab("stock");
      return;
    }

    const matchedWh = warehouses.find((w) => w.code === warehouseCode);
    const whName = matchedWh?.name || `${warehouseCode} Warehouse`;

    const payload = {
      name: name.trim(),
      itemType: itemType.trim(),
      category: category.trim(),
      subCategory: subCategory.trim() || undefined,
      description: description.trim() || undefined,
      barcode: barcode.trim() || undefined,
      hsnSacCode: hsnSacCode.trim() || undefined,
      gradeModel: gradeModel.trim() || undefined,
      supplierItemCode: supplierItemCode.trim() || undefined,
      unit: unit.trim(),
      purchaseUnit: unit.trim(),
      salesUnit: unit.trim(),
      stockUnit: unit.trim(),

      warehouseCode: warehouseCode.trim(),
      warehouseName: whName.trim(),
      storageLocation: storageLocation.trim() || undefined,
      quantity: Number(quantity) >= 0 ? Number(quantity) : Number(item.quantity || 0),
      minimumLevel: Number(minimumLevel),
      maximumStockLevel: maximumStockLevel ? Number(maximumStockLevel) : undefined,
      reorderLevel: reorderLevel ? Number(reorderLevel) : undefined,
      reorderQuantity: reorderQuantity ? Number(reorderQuantity) : undefined,

      costPrice: Number(costPrice),
      sellingPrice: sellingPrice ? Number(sellingPrice) : undefined,
      costingMethod: costingMethod.trim(),
      taxRate: Number(gstRate),
      taxableItem,
      gstRate: Number(gstRate),

      primarySupplier: primarySupplier.trim() || undefined,
      leadTime: leadTime ? Number(leadTime) : undefined,
      internalNotes: internalNotes.trim() || undefined,
      additionalNotes: additionalNotes.trim() || undefined,
    };

    setSaving(true);
    setError(null);
    try {
      await InventoryService.update(item.id, payload);
      onSuccess();
    } catch (err) {
      const res = err?.response?.data;
      setError(res?.detail || res?.message || "Failed to update item. Please verify required fields.");
    } finally {
      setSaving(false);
    }
  };

  const calculatedOpeningValue = (Number(quantity) || 0) * (Number(costPrice) || 0);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" onClick={!saving ? onClose : undefined} />

      <div className="fixed left-1/2 top-1/2 z-[60] flex h-[90vh] max-h-[780px] w-full max-w-[800px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[16px] border border-[#e2e0d8] bg-[#fbfaf7] shadow-2xl">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-[#e5e3dc] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dedcd4] bg-[#f5f4ef] text-[#20231f]">
              <Package size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-[19px] text-[#20231f]">Edit Item</h3>
                <span className="rounded-md border border-[#e1dfd7] bg-[#f0efea] px-2 py-0.5 font-mono text-[10px] text-[#777a73]">
                  {sku}
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#999b94]">
                Update item specifications, pricing, stock levels and supplier settings
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e0d8] bg-[#fbfaf7] text-[#777a73] transition hover:bg-[#f0efe9] hover:text-[#11130f]"
          >
            <X size={15} />
          </button>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex border-b border-[#e5e3dc] bg-[#f5f4ef] px-6 pt-2">
          {[
            { id: "info", label: "1. Item Information" },
            { id: "stock", label: "2. Stock Configuration" },
            { id: "pricing", label: "3. Pricing & Tax" },
            { id: "other", label: "4. Supplier & Notes" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                border-b-2 px-4 py-2.5 font-mono text-[11px] font-medium tracking-[0.04em] transition
                ${activeTab === tab.id
                  ? "border-[#11130f] text-[#11130f] bg-[#fbfaf7]"
                  : "border-transparent text-[#888c83] hover:text-[#333630]"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#f5c6cb] bg-[#f8d7da] px-3.5 py-2.5 font-mono text-[11px] text-[#721c24]">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: ITEM INFORMATION */}
            {activeTab === "info" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      SKU / Item Code
                    </label>
                    <input
                      type="text"
                      value={sku}
                      disabled
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-[#f0efea] px-3 py-2 font-mono text-[11px] text-[#666a63] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Item Name <span className="text-[#d9534f]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Mild Steel Flange 100mm"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Category <span className="text-[#d9534f]">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Sub Category
                    </label>
                    <input
                      type="text"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      placeholder="e.g. Flanges"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Item Type
                    </label>
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    >
                      {ITEM_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Brand / Model
                    </label>
                    <input
                      type="text"
                      value={gradeModel}
                      onChange={(e) => setGradeModel(e.target.value)}
                      placeholder="e.g. Grade 304 SS"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Model / Part Number
                    </label>
                    <input
                      type="text"
                      value={supplierItemCode}
                      onChange={(e) => setSupplierItemCode(e.target.value)}
                      placeholder="e.g. PN-40-FLG"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Unit of Measurement <span className="text-[#d9534f]">*</span>
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Barcode
                    </label>
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="e.g. 8901234567890"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      HSN / SAC Code
                    </label>
                    <input
                      type="text"
                      value={hsnSacCode}
                      onChange={(e) => setHsnSacCode(e.target.value)}
                      placeholder="e.g. 73072100"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide technical specifications or usage notes..."
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: STOCK CONFIGURATION */}
            {activeTab === "stock" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Warehouse <span className="text-[#d9534f]">*</span>
                    </label>
                    <select
                      value={warehouseCode}
                      onChange={(e) => setWarehouseCode(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    >
                      {warehouses.length > 0 ? (
                        warehouses.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.code} – {w.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="W1">W1 – Main Warehouse</option>
                          <option value="W2">W2 – Central Stores</option>
                          <option value="W3">W3 – Raw Materials Yard</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Storage Location / Bin
                    </label>
                    <input
                      type="text"
                      value={storageLocation}
                      onChange={(e) => setStorageLocation(e.target.value)}
                      placeholder="e.g. Aisle 3, Rack B, Bin 12"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Current Quantity ({unit})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Opening Stock Value (₹)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`₹${calculatedOpeningValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-[#f0efea] px-3 py-2 font-mono text-[11px] text-[#666a63] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Min Safety Level <span className="text-[#d9534f]">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={minimumLevel}
                      onChange={(e) => setMinimumLevel(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Max Stock Level
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={maximumStockLevel}
                      onChange={(e) => setMaximumStockLevel(e.target.value)}
                      placeholder="e.g. 500"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Reorder Level
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={reorderLevel}
                      onChange={(e) => setReorderLevel(e.target.value)}
                      placeholder="e.g. 20"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Reorder Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={reorderQuantity}
                      onChange={(e) => setReorderQuantity(e.target.value)}
                      placeholder="e.g. 100"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PRICING & TAX */}
            {activeTab === "pricing" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Purchase / Cost Price (₹) <span className="text-[#d9534f]">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Costing Method
                    </label>
                    <select
                      value={costingMethod}
                      onChange={(e) => setCostingMethod(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    >
                      {COSTING_METHODS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Tax / GST Rate
                    </label>
                    <select
                      value={gstRate}
                      onChange={(e) => setGstRate(Number(e.target.value))}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    >
                      {GST_RATES.map((g) => (
                        <option key={g.rate} value={g.rate}>{g.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="taxableItemCheckbox"
                    checked={taxableItem}
                    onChange={(e) => setTaxableItem(e.target.checked)}
                    className="h-4 w-4 rounded border-[#dedcd4] text-[#11130f] focus:ring-0"
                  />
                  <label htmlFor="taxableItemCheckbox" className="font-mono text-[11px] text-[#333630]">
                    Tax Applicable / Subject to GST
                  </label>
                </div>
              </div>
            )}

            {/* TAB 4: SUPPLIER & NOTES */}
            {activeTab === "other" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Primary Supplier / Vendor
                    </label>
                    <input
                      type="text"
                      value={primarySupplier}
                      onChange={(e) => setPrimarySupplier(e.target.value)}
                      placeholder="e.g. Apex Industrial Steel Corp"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Supplier Lead Time (Days)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={leadTime}
                      onChange={(e) => setLeadTime(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Internal Notes
                  </label>
                  <textarea
                    rows={2}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Confidential or internal inventory remarks..."
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Additional Notes
                  </label>
                  <textarea
                    rows={2}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="General handling instructions or specifications..."
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* MODAL FOOTER */}
          <div className="flex items-center justify-between border-t border-[#e5e3dc] bg-white px-6 py-4">
            <div className="font-mono text-[10px] text-[#999b94]">
              * Required fields
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={onClose}
                className="rounded-[9px] border border-[#e2e0d8] bg-[#fbfaf7] px-4 py-2 font-mono text-[11px] text-[#666a63] transition hover:bg-[#f0efe9] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-[9px] bg-[#11130f] px-5 py-2 font-mono text-[11px] text-white transition hover:bg-[#292c27] disabled:opacity-50"
              >
                {saving ? (
                  <span>Saving…</span>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
