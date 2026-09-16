import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, UploadCloud, X, FileText, Check, AlertCircle } from "lucide-react";
import InventoryService from "../../../core/services/modules/inventory.service";

/* ================================================================
   STATIC ENUMS & CHOICES
================================================================ */
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
  "Asset"
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
  "Tools"
];

const STATUS_OPTIONS = ["In Stock", "Active", "Low Stock", "Out of Stock", "Inactive"];

const UNITS = ["kg", "pcs", "box", "litre", "pair", "meter", "roll", "set", "tonne", "gram", "pack"];

const COSTING_METHODS = [
  "FIFO (First In First Out)",
  "LIFO (Last In First Out)",
  "Weighted Average Cost",
  "Standard Costing"
];

const GST_RATES = [
  { label: "0% (Exempt / Nil)", rate: 0, cgst: 0, sgst: 0, igst: 0 },
  { label: "5% (Standard Concession)", rate: 5, cgst: 2.5, sgst: 2.5, igst: 5 },
  { label: "12% (Standard Lower)", rate: 12, cgst: 6, sgst: 6, igst: 12 },
  { label: "18% (Standard Higher)", rate: 18, cgst: 9, sgst: 9, igst: 18 },
  { label: "28% (Luxury / De-merit)", rate: 28, cgst: 14, sgst: 14, igst: 28 },
];

const DEFAULT_WAREHOUSES = [
  { code: "W1", name: "W1 – Main Warehouse" },
  { code: "W2", name: "W2 – Central Stores" },
  { code: "W3", name: "W3 – Raw Materials Yard" },
  { code: "W4", name: "W4 – Finished Goods Depot" },
];

/* ================================================================
   PRIMITIVES
================================================================ */
const SectionCard = ({ number, title, children, className = "" }) => (
  <div className={`mb-5 rounded-[14px] border border-[#e3e0d9] bg-white shadow-sm overflow-hidden ${className}`}>
    <div className="border-b border-[#f0efeb] bg-[#fcfbf9] px-6 py-3.5 flex items-center justify-between">
      <h3 className="font-mono text-[11px] font-bold tracking-[0.08em] text-[#11130f] uppercase">
        <span className="mr-2 text-[#8d9696]">{number}.</span>
        {title}
      </h3>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

const Field = ({ label, required, hint, children, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
      {label}
      {required && <span className="ml-1 text-[#d9534f]">*</span>}
    </label>
    {children}
    {hint && <p className="font-mono text-[9px] text-[#9ca3af]">{hint}</p>}
  </div>
);

const Input = ({ className = "", prefix, suffix, ...props }) => {
  if (prefix || suffix) {
    return (
      <div className="relative flex items-center">
        {prefix && (
          <span className="pointer-events-none absolute left-3 font-mono text-[11px] font-medium text-[#777a73]">
            {prefix}
          </span>
        )}
        <input
          className={`w-full rounded-[9px] border border-[#dedcd4] bg-[#fdfdfc] py-2 font-mono text-[11px] text-[#11130f] placeholder-[#b5b8b0] outline-none transition focus:border-[#11130f] focus:bg-white ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-14" : "pr-3"} ${className}`}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 rounded bg-[#f0eee8] px-1.5 py-0.5 font-mono text-[9px] font-medium text-[#676a63]">
            {suffix}
          </span>
        )}
      </div>
    );
  }

  return (
    <input
      className={`w-full rounded-[9px] border border-[#dedcd4] bg-[#fdfdfc] px-3 py-2 font-mono text-[11px] text-[#11130f] placeholder-[#b5b8b0] outline-none transition focus:border-[#11130f] focus:bg-white ${className}`}
      {...props}
    />
  );
};

const Sel = ({ children, className = "", ...props }) => (
  <div className="relative">
    <select
      className={`w-full appearance-none rounded-[9px] border border-[#dedcd4] bg-[#fdfdfc] px-3 py-2 pr-8 font-mono text-[11px] text-[#11130f] outline-none transition focus:border-[#11130f] focus:bg-white ${className}`}
      {...props}
    >
      {children}
    </select>
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8c9187]"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full rounded-[9px] border border-[#dedcd4] bg-[#fdfdfc] px-3 py-2 font-mono text-[11px] text-[#11130f] placeholder-[#b5b8b0] outline-none transition focus:border-[#11130f] focus:bg-white ${className}`}
    {...props}
  />
);

const CheckboxItem = ({ label, checked, onChange, description }) => (
  <label className="flex items-start gap-2.5 cursor-pointer select-none py-1">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-0.5 h-4 w-4 rounded border-[#dedcd4] text-[#11130f] accent-[#11130f] focus:ring-0"
    />
    <div className="flex flex-col">
      <span className="font-mono text-[11px] font-medium text-[#2d3129] leading-tight">{label}</span>
      {description && <span className="font-mono text-[9px] text-[#9ca3af]">{description}</span>}
    </div>
  </label>
);

/* ================================================================
   INITIAL FORM STATE
================================================================ */
const initialFormState = {
  // 1. Basic Item Information
  sku: "",
  name: "",
  itemType: "Raw Material",
  category: "Raw Material",
  subCategory: "",
  barcode: "",
  hsnSacCode: "",
  status: "In Stock",
  description: "",

  // 2. Unit of Measurement
  baseUnit: "kg",
  purchaseUnit: "kg",
  salesUnit: "kg",
  stockUnit: "kg",
  conversionFactor: "1",

  // 3. Warehouse & Opening Stock
  warehouse: "W1 – Main Warehouse",
  warehouseCode: "W1",
  warehouseName: "Main Warehouse",
  storageLocation: "",
  openingQuantity: "0",
  minimumStockLevel: "0",
  maximumStockLevel: "0",
  reorderLevel: "0",
  reorderQuantity: "0",

  // 4. Pricing & Valuation
  purchasePrice: "0",
  sellingPrice: "0",
  costingMethod: "Weighted Average Cost",
  taxRate: "18",

  // 5. Supplier Information
  primarySupplier: "",
  supplierItemCode: "",
  leadTime: "7",
  preferredSupplier: true,

  // 6. Tax Information
  taxableItem: true,
  gstRate: "18",
  cgst: "9",
  sgst: "9",
  igst: "18",
  taxHsnCode: "",

  // 7. Stock Control
  trackInventory: true,
  trackBatch: false,
  trackSerialNumber: false,
  lowStockAlert: true,
  autoReorder: false,
  allowNegativeStock: false,
  stockControlMinLevel: "0",
  stockControlReorderLevel: "0",
  stockControlReorderQty: "0",

  // 8. Batch / Expiry Information
  batchTracking: false,
  expiryTracking: false,
  shelfLife: "",
  manufacturingDate: "",
  expiryDate: "",
  batchPrefix: "BAT-",

  // 9. Item Specifications
  length: "",
  width: "",
  thickness: "",
  weight: "",
  gradeModel: "",
  specification: "",

  // 10. Attachments
  attachments: [],

  // 11. Notes
  internalNotes: "",
  additionalNotes: "",
};

/* ================================================================
   MAIN ADD NEW ITEM COMPONENT
================================================================ */
export default function AddNewItem({ onBack, onCancel, onSaved, initialData, isModal = false }) {
  const isEditMode = Boolean(initialData?.id);

  // Build form state — pre-fill from initialData when editing
  const buildFormFromData = (data) => {
    if (!data) return initialFormState;

    let parsedAttachments = [];
    if (data.attachmentsJson) {
      try {
        parsedAttachments = JSON.parse(data.attachmentsJson);
      } catch {
        parsedAttachments = [];
      }
    }

    return {
      ...initialFormState,
      // 1. Basic
      sku:              data.sku              ?? "",
      name:             data.name             ?? "",
      itemType:         data.itemType         ?? "Raw Material",
      category:         data.category         ?? "Raw Material",
      subCategory:      data.subCategory      ?? "",
      barcode:          data.barcode          ?? "",
      hsnSacCode:       data.hsnSacCode       ?? "",
      status:           data.status           ?? "In Stock",
      description:      data.description      ?? "",

      // 2. Units
      baseUnit:         data.unit             ?? "kg",
      purchaseUnit:     data.purchaseUnit     ?? (data.unit ?? "kg"),
      salesUnit:        data.salesUnit        ?? (data.unit ?? "kg"),
      stockUnit:        data.stockUnit        ?? (data.unit ?? "kg"),
      conversionFactor: String(data.conversionFactor ?? "1"),

      // 3. Warehouse & Stock
      warehouse:        data.warehouseName    ?? (data.warehouseCode ?? "W1"),
      warehouseCode:    data.warehouseCode    ?? "W1",
      warehouseName:    data.warehouseName    ?? "Main Warehouse",
      storageLocation:  data.storageLocation  ?? "",
      openingQuantity:  String(data.quantity        ?? "0"),
      minimumStockLevel:String(data.minimumLevel    ?? "0"),
      maximumStockLevel:String(data.maximumStockLevel ?? "0"),
      reorderLevel:     String(data.reorderLevel     ?? "0"),
      reorderQuantity:  String(data.reorderQuantity  ?? "0"),

      // 4. Pricing
      purchasePrice:    String(data.costPrice       ?? "0"),
      sellingPrice:     String(data.sellingPrice    ?? "0"),
      costingMethod:    data.costingMethod    ?? "Weighted Average Cost",
      taxRate:          String(data.taxRate         ?? "18"),

      // 5. Supplier
      primarySupplier:  data.primarySupplier   ?? "",
      supplierItemCode: data.supplierItemCode  ?? "",
      leadTime:         String(data.leadTime        ?? "7"),
      preferredSupplier:data.preferredSupplier ?? true,

      // 6. Tax
      taxableItem:      data.taxableItem      ?? true,
      gstRate:          String(data.gstRate         ?? "18"),
      cgst:             String(data.cgst            ?? "9"),
      sgst:             String(data.sgst            ?? "9"),
      igst:             String(data.igst            ?? "18"),
      taxHsnCode:       data.taxHsnCode       ?? (data.hsnSacCode ?? ""),

      // 7. Stock Control
      trackInventory:   data.trackInventory   ?? true,
      trackBatch:       data.trackBatch       ?? false,
      trackSerialNumber:data.trackSerialNumber?? false,
      lowStockAlert:    data.lowStockAlert    ?? true,
      autoReorder:      data.autoReorder      ?? false,
      allowNegativeStock:data.allowNegativeStock ?? false,

      // 8. Batch / Expiry
      batchTracking:    data.batchTracking    ?? false,
      expiryTracking:   data.expiryTracking   ?? false,
      shelfLife:        data.shelfLife != null ? String(data.shelfLife) : "",
      manufacturingDate:data.manufacturingDate ?? "",
      expiryDate:       data.expiryDate        ?? "",
      batchPrefix:      data.batchPrefix       ?? "BAT-",

      // 9. Specifications
      length:           data.length != null ? String(data.length) : "",
      width:            data.width != null ? String(data.width) : "",
      thickness:        data.thickness != null ? String(data.thickness) : "",
      weight:           data.weight != null ? String(data.weight) : "",
      gradeModel:       data.gradeModel        ?? "",
      specification:    data.specification    ?? "",

      // 10. Attachments
      attachments:      Array.isArray(parsedAttachments) ? parsedAttachments : [],

      // 11. Notes
      internalNotes:    data.internalNotes     ?? "",
      additionalNotes:  data.additionalNotes   ?? "",
    };
  };

  const [form, setForm] = useState(() => buildFormFromData(initialData));
  const [warehouses, setWarehouses] = useState(DEFAULT_WAREHOUSES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    InventoryService.getWarehouses()
      .then((res) => {
        if (Array.isArray(res?.data) && res.data.length > 0) {
          setWarehouses(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Update GST rates automatically when GST rate changes
  const handleGstChange = (rateVal) => {
    const selected = GST_RATES.find((g) => String(g.rate) === String(rateVal));
    if (selected) {
      setForm((prev) => ({
        ...prev,
        gstRate: String(selected.rate),
        cgst: String(selected.cgst),
        sgst: String(selected.sgst),
        igst: String(selected.igst),
        taxRate: String(selected.rate),
      }));
    } else {
      set("gstRate", rateVal);
    }
  };

  // Derived Opening Stock Value = Opening Qty * Purchase Price
  const openingStockValue = (
    (Number(form.openingQuantity) || 0) * (Number(form.purchasePrice) || 0)
  ).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // File drop / upload helpers
  const handleFiles = (files) => {
    const valid = Array.from(files).filter(
      (f) => f.size <= 10 * 1024 * 1024 && /\.(pdf|jpg|jpeg|png|docx)$/i.test(f.name)
    );
    const mapped = valid.map((f) => ({
      name: f.name,
      size: (f.size / 1024).toFixed(0) + " KB",
    }));
    setForm((prev) => ({ ...prev, attachments: [...prev.attachments, ...mapped] }));
  };

  const removeAttachment = (idx) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== idx),
    }));
  };

  // Save Item handler — CREATE or UPDATE depending on mode
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.sku.trim()) {
      setError("Item Code / SKU is required.");
      return;
    }
    if (!form.name.trim()) {
      setError("Item Name is required.");
      return;
    }
    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }

    // Numeric validation
    const qty   = Number(form.openingQuantity);
    const minL  = Number(form.minimumStockLevel);
    const maxL  = Number(form.maximumStockLevel) || 0;
    const reL   = Number(form.reorderLevel) || 0;
    const reQ   = Number(form.reorderQuantity) || 0;
    const cost  = Number(form.purchasePrice);
    const sell  = Number(form.sellingPrice) || 0;
    const taxR  = Number(form.taxRate) || Number(form.gstRate) || 18;
    const gstR  = Number(form.gstRate) || 18;
    const convF = Number(form.conversionFactor) || 1.0;
    const leadT = form.leadTime !== "" ? Number(form.leadTime) : 7;
    const sLife = form.shelfLife !== "" ? Number(form.shelfLife) : null;

    const len = form.length !== "" ? Number(form.length) : null;
    const wid = form.width !== "" ? Number(form.width) : null;
    const thk = form.thickness !== "" ? Number(form.thickness) : null;
    const wgt = form.weight !== "" ? Number(form.weight) : null;

    if (isNaN(qty))  { setError("Quantity must be a valid number."); return; }
    if (isNaN(minL)) { setError("Minimum stock level must be a valid number."); return; }
    if (isNaN(cost)) { setError("Purchase price must be a valid number."); return; }

    if (form.manufacturingDate && form.expiryDate && form.expiryDate < form.manufacturingDate) {
      setError("Expiry date cannot be before manufacturing date.");
      return;
    }

    setLoading(true);

    try {
      const selectedWh = warehouses.find(
        (w) => w.name === form.warehouse || w.code === form.warehouseCode
      ) || { code: form.warehouseCode || "W1", name: form.warehouseName || form.warehouse || "Main Warehouse" };

      // Build attachment metadata reference
      const attachmentsMeta = form.attachments && form.attachments.length > 0
        ? JSON.stringify(form.attachments.map((a) => ({ name: a.name, size: a.size })))
        : null;

      const payload = {
        // 1. Basic
        name:              form.name.trim(),
        itemType:          form.itemType,
        category:          form.category.trim(),
        subCategory:       form.subCategory.trim() || undefined,
        barcode:           form.barcode.trim() || undefined,
        hsnSacCode:        form.hsnSacCode.trim() || undefined,
        description:       form.description.trim() || undefined,

        // 2. Units
        unit:              form.baseUnit || "pcs",
        purchaseUnit:      form.purchaseUnit || form.baseUnit || "pcs",
        salesUnit:         form.salesUnit || form.baseUnit || "pcs",
        stockUnit:         form.stockUnit || form.baseUnit || "pcs",
        conversionFactor:  convF,

        // 3. Warehouse & Stock
        warehouseCode:     selectedWh.code,
        warehouseName:     selectedWh.name,
        storageLocation:   form.storageLocation.trim() || undefined,
        quantity:          qty,
        minimumLevel:      minL,
        maximumStockLevel: maxL,
        reorderLevel:      reL,
        reorderQuantity:   reQ,

        // 4. Pricing
        costPrice:         cost,
        sellingPrice:      sell,
        costingMethod:     form.costingMethod,
        taxRate:           taxR,

        // 5. Supplier
        primarySupplier:   form.primarySupplier.trim() || undefined,
        supplierItemCode:  form.supplierItemCode.trim() || undefined,
        leadTime:          !isNaN(leadT) ? leadT : 7,
        preferredSupplier: form.preferredSupplier,

        // 6. Tax
        taxableItem:       form.taxableItem,
        gstRate:           gstR,
        cgst:              gstR / 2,
        sgst:              gstR / 2,
        igst:              gstR,
        taxHsnCode:        form.taxHsnCode.trim() || form.hsnSacCode.trim() || undefined,

        // 7. Stock Control
        trackInventory:    form.trackInventory,
        trackBatch:        form.trackBatch,
        trackSerialNumber: form.trackSerialNumber,
        lowStockAlert:     form.lowStockAlert,
        autoReorder:       form.autoReorder,
        allowNegativeStock:form.allowNegativeStock,

        // 8. Batch / Expiry
        batchTracking:     form.batchTracking,
        expiryTracking:    form.expiryTracking,
        shelfLife:         sLife,
        manufacturingDate: form.manufacturingDate || undefined,
        expiryDate:        form.expiryDate || undefined,
        batchPrefix:       form.batchPrefix.trim() || "BAT-",

        // 9. Specifications
        length:            len,
        width:             wid,
        thickness:         thk,
        weight:            wgt,
        gradeModel:        form.gradeModel.trim() || undefined,
        specification:     form.specification.trim() || undefined,

        // 10. Attachments
        attachmentsJson:   attachmentsMeta,

        // 11. Notes
        internalNotes:     form.internalNotes.trim() || undefined,
        additionalNotes:   form.additionalNotes.trim() || undefined,
      };

      if (isEditMode) {
        /* ---- UPDATE (PUT) ---- */
        const { data } = await InventoryService.update(initialData.id, payload);
        setSuccess(`Item "${data.name || form.name}" updated successfully.`);
        setLoading(false);

        if (onSaved) {
          setTimeout(() => onSaved(data), 1200);
        }
      } else {
        /* ---- CREATE (POST) ---- */
        payload.sku = form.sku.trim().toUpperCase();

        const { data } = await InventoryService.create(payload);
        setSuccess(`Item "${data.name || form.name}" successfully created with SKU: ${data.sku || form.sku}`);
        setLoading(false);

        if (onSaved) {
          setTimeout(() => onSaved(data), 1200);
        }
      }
    } catch (err) {
      setLoading(false);
      const res = err?.response?.data;
      const status = err?.response?.status;
      if (status === 409 || (res?.message ?? "").toLowerCase().includes("sku")) {
        setError("SKU already exists. Please use a different item code.");
      } else if (status === 403 || status === 401) {
        setError("You do not have permission to perform this action.");
      } else if (status === 404) {
        setError("Item not found. It may have been deleted.");
      } else {
        setError(res?.detail || res?.message || res?.title || "Failed to save inventory item. Please verify all inputs.");
      }
    }
  };

  const renderFormSections = () => (
    <div className="space-y-5">
        <SectionCard number="1" title="BASIC ITEM INFORMATION">
          <div className="flex flex-col gap-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Item Code / SKU" required hint="Unique alphanumeric identifier">
                <Input
                  placeholder="e.g. SKU-1043"
                  value={form.sku}
                  onChange={(e) => set("sku", e.target.value)}
                />
              </Field>

              <Field label="Item Name" required>
                <Input
                  placeholder="Enter full item name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>

              <Field label="Item Type" required>
                <Sel value={form.itemType} onChange={(e) => set("itemType", e.target.value)}>
                  {ITEM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Sel>
              </Field>

              <Field label="Category" required>
                <Sel value={form.category} onChange={(e) => set("category", e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Sel>
              </Field>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Sub Category">
                <Input
                  placeholder="e.g. Structural Steel"
                  value={form.subCategory}
                  onChange={(e) => set("subCategory", e.target.value)}
                />
              </Field>

              <Field label="Barcode">
                <Input
                  placeholder="Scan or enter barcode"
                  value={form.barcode}
                  onChange={(e) => set("barcode", e.target.value)}
                />
              </Field>

              <Field label="HSN/SAC Code">
                <Input
                  placeholder="e.g. 7208.51.10"
                  value={form.hsnSacCode}
                  onChange={(e) => set("hsnSacCode", e.target.value)}
                />
              </Field>

              <Field label="Status" required>
                <Sel value={form.status} onChange={(e) => set("status", e.target.value)}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Sel>
              </Field>
            </div>

            {/* Row 3 */}
            <Field label="Description">
              <Textarea
                rows={3}
                placeholder="Enter detailed description, usage notes, or physical properties..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ================================================
            SECTION 2: UNIT OF MEASUREMENT
        ================================================ */}
        <SectionCard number="2" title="UNIT OF MEASUREMENT">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Field label="Base Unit" required hint="Primary unit for stock">
              <Sel value={form.baseUnit} onChange={(e) => set("baseUnit", e.target.value)}>
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Sel>
            </Field>

            <Field label="Purchase Unit">
              <Sel value={form.purchaseUnit} onChange={(e) => set("purchaseUnit", e.target.value)}>
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Sel>
            </Field>

            <Field label="Sales Unit">
              <Sel value={form.salesUnit} onChange={(e) => set("salesUnit", e.target.value)}>
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Sel>
            </Field>

            <Field label="Stock Unit">
              <Sel value={form.stockUnit} onChange={(e) => set("stockUnit", e.target.value)}>
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Sel>
            </Field>

            <Field label="Conversion Factor" hint="Ratio to base unit">
              <Input
                type="number"
                step="any"
                min="0"
                placeholder="1.00"
                value={form.conversionFactor}
                onChange={(e) => set("conversionFactor", e.target.value)}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ================================================
            SECTION 3: WAREHOUSE & OPENING STOCK
        ================================================ */}
        <SectionCard number="3" title="WAREHOUSE & OPENING STOCK">
          <div className="flex flex-col gap-4">
            {/* Warehouse + Location */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Warehouse" required>
                <Sel
                  value={form.warehouse}
                  onChange={(e) => {
                    const val = e.target.value;
                    set("warehouse", val);
                    const found = warehouses.find((w) => w.name === val || w.code === val);
                    if (found) {
                      set("warehouseCode", found.code);
                      set("warehouseName", found.name);
                    }
                  }}
                >
                  {warehouses.map((w) => (
                    <option key={w.code} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </Sel>
              </Field>

              <Field label="Storage Location">
                <Input
                  placeholder="e.g. Aisle 3, Rack B, Bin 102"
                  value={form.storageLocation}
                  onChange={(e) => set("storageLocation", e.target.value)}
                />
              </Field>
            </div>

            {/* Stock Levels */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Field label="Opening Quantity" hint="Initial balance">
                <Input
                  type="number"
                  min="0"
                  suffix={form.baseUnit}
                  placeholder="0"
                  value={form.openingQuantity}
                  onChange={(e) => set("openingQuantity", e.target.value)}
                />
              </Field>

              <Field label="Minimum Stock Level">
                <Input
                  type="number"
                  min="0"
                  suffix={form.baseUnit}
                  placeholder="0"
                  value={form.minimumStockLevel}
                  onChange={(e) => set("minimumStockLevel", e.target.value)}
                />
              </Field>

              <Field label="Maximum Stock Level">
                <Input
                  type="number"
                  min="0"
                  suffix={form.baseUnit}
                  placeholder="0"
                  value={form.maximumStockLevel}
                  onChange={(e) => set("maximumStockLevel", e.target.value)}
                />
              </Field>

              <Field label="Reorder Level">
                <Input
                  type="number"
                  min="0"
                  suffix={form.baseUnit}
                  placeholder="0"
                  value={form.reorderLevel}
                  onChange={(e) => set("reorderLevel", e.target.value)}
                />
              </Field>

              <Field label="Reorder Quantity">
                <Input
                  type="number"
                  min="0"
                  suffix={form.baseUnit}
                  placeholder="0"
                  value={form.reorderQuantity}
                  onChange={(e) => set("reorderQuantity", e.target.value)}
                />
              </Field>
            </div>
          </div>
        </SectionCard>

        {/* ================================================
            SECTION 4: PRICING & VALUATION
        ================================================ */}
        <SectionCard number="4" title="PRICING & VALUATION">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Purchase Price" required>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  prefix="₹"
                  suffix={`/ ${form.baseUnit}`}
                  placeholder="0.00"
                  value={form.purchasePrice}
                  onChange={(e) => set("purchasePrice", e.target.value)}
                />
              </Field>

              <Field label="Selling Price">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  prefix="₹"
                  suffix={`/ ${form.salesUnit || form.baseUnit}`}
                  placeholder="0.00"
                  value={form.sellingPrice}
                  onChange={(e) => set("sellingPrice", e.target.value)}
                />
              </Field>

              <Field label="Costing Method" required>
                <Sel value={form.costingMethod} onChange={(e) => set("costingMethod", e.target.value)}>
                  {COSTING_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </Sel>
              </Field>

              <Field label="Tax Rate">
                <Sel value={form.taxRate} onChange={(e) => handleGstChange(e.target.value)}>
                  {GST_RATES.map((g) => (
                    <option key={g.rate} value={g.rate}>
                      {g.label}
                    </option>
                  ))}
                </Sel>
              </Field>
            </div>

            {/* Calculated Opening Stock Value Box */}
            <div className="flex items-center justify-between rounded-[10px] border border-[#dedcd4] bg-[#f8f7f2] px-5 py-3">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#7d8277]">
                  Opening Stock Valuation (Calculated)
                </span>
                <span className="font-mono text-[10px] text-[#9ca3af]">
                  {form.openingQuantity || 0} {form.baseUnit} × ₹{Number(form.purchasePrice || 0).toFixed(2)}
                </span>
              </div>
              <div className="font-mono text-[16px] font-bold text-[#11130f]">
                ₹{openingStockValue}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ================================================
            SECTION 5: SUPPLIER INFORMATION
        ================================================ */}
        <SectionCard number="5" title="SUPPLIER INFORMATION">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Primary Supplier" required>
              <Input
                placeholder="e.g. Tata Steel Ltd"
                value={form.primarySupplier}
                onChange={(e) => set("primarySupplier", e.target.value)}
              />
            </Field>

            <Field label="Supplier Item Code">
              <Input
                placeholder="e.g. SUP-SKU-9021"
                value={form.supplierItemCode}
                onChange={(e) => set("supplierItemCode", e.target.value)}
              />
            </Field>

            <Field label="Lead Time">
              <Input
                type="number"
                min="0"
                suffix="Days"
                placeholder="7"
                value={form.leadTime}
                onChange={(e) => set("leadTime", e.target.value)}
              />
            </Field>
          </div>

          <div className="mt-3">
            <CheckboxItem
              label="Preferred Supplier"
              description="Mark as default vendor for automatic purchase order generation"
              checked={form.preferredSupplier}
              onChange={(v) => set("preferredSupplier", v)}
            />
          </div>
        </SectionCard>

        {/* ================================================
            SECTION 6: TAX INFORMATION
        ================================================ */}
        <SectionCard number="6" title="TAX INFORMATION">
          <div className="mb-4">
            <CheckboxItem
              label="Taxable Item"
              description="This item is subject to Goods and Services Tax (GST)"
              checked={form.taxableItem}
              onChange={(v) => set("taxableItem", v)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Field label="GST Rate">
              <Sel value={form.gstRate} onChange={(e) => handleGstChange(e.target.value)}>
                {GST_RATES.map((g) => (
                  <option key={g.rate} value={g.rate}>
                    {g.rate}%
                  </option>
                ))}
              </Sel>
            </Field>

            <Field label="CGST (%)">
              <Input
                readOnly
                className="bg-[#f5f4ef] text-[#777a73]"
                value={form.cgst + "%"}
              />
            </Field>

            <Field label="SGST (%)">
              <Input
                readOnly
                className="bg-[#f5f4ef] text-[#777a73]"
                value={form.sgst + "%"}
              />
            </Field>

            <Field label="IGST (%)">
              <Input
                readOnly
                className="bg-[#f5f4ef] text-[#777a73]"
                value={form.igst + "%"}
              />
            </Field>

            <Field label="HSN Code">
              <Input
                placeholder="e.g. 7208.51.10"
                value={form.taxHsnCode || form.hsnSacCode}
                onChange={(e) => set("taxHsnCode", e.target.value)}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ================================================
            SECTION 7: STOCK CONTROL
        ================================================ */}
        <SectionCard number="7" title="STOCK CONTROL">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 border-b border-[#f0efeb] pb-4">
            <CheckboxItem
              label="Track Inventory"
              checked={form.trackInventory}
              onChange={(v) => set("trackInventory", v)}
            />
            <CheckboxItem
              label="Track Batch"
              checked={form.trackBatch}
              onChange={(v) => {
                set("trackBatch", v);
                set("batchTracking", v);
              }}
            />
            <CheckboxItem
              label="Track Serial No."
              checked={form.trackSerialNumber}
              onChange={(v) => set("trackSerialNumber", v)}
            />
            <CheckboxItem
              label="Low Stock Alert"
              checked={form.lowStockAlert}
              onChange={(v) => set("lowStockAlert", v)}
            />
            <CheckboxItem
              label="Auto Reorder"
              checked={form.autoReorder}
              onChange={(v) => set("autoReorder", v)}
            />
            <CheckboxItem
              label="Allow Negative"
              checked={form.allowNegativeStock}
              onChange={(v) => set("allowNegativeStock", v)}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Minimum Stock Level">
              <Input
                type="number"
                min="0"
                suffix={form.baseUnit}
                placeholder="0"
                value={form.stockControlMinLevel || form.minimumStockLevel}
                onChange={(e) => {
                  set("stockControlMinLevel", e.target.value);
                  set("minimumStockLevel", e.target.value);
                }}
              />
            </Field>

            <Field label="Reorder Level">
              <Input
                type="number"
                min="0"
                suffix={form.baseUnit}
                placeholder="0"
                value={form.stockControlReorderLevel || form.reorderLevel}
                onChange={(e) => {
                  set("stockControlReorderLevel", e.target.value);
                  set("reorderLevel", e.target.value);
                }}
              />
            </Field>

            <Field label="Reorder Quantity">
              <Input
                type="number"
                min="0"
                suffix={form.baseUnit}
                placeholder="0"
                value={form.stockControlReorderQty || form.reorderQuantity}
                onChange={(e) => {
                  set("stockControlReorderQty", e.target.value);
                  set("reorderQuantity", e.target.value);
                }}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ================================================
            SECTION 8: BATCH / EXPIRY INFORMATION
        ================================================ */}
        <SectionCard number="8" title="BATCH / EXPIRY INFORMATION">
          <div className="flex items-center gap-6 mb-4">
            <CheckboxItem
              label="Batch Tracking"
              checked={form.batchTracking || form.trackBatch}
              onChange={(v) => {
                set("batchTracking", v);
                set("trackBatch", v);
              }}
            />
            <CheckboxItem
              label="Expiry Tracking"
              checked={form.expiryTracking}
              onChange={(v) => set("expiryTracking", v)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Shelf Life">
              <Input
                type="number"
                min="0"
                suffix="Days"
                placeholder="365"
                value={form.shelfLife}
                onChange={(e) => set("shelfLife", e.target.value)}
              />
            </Field>

            <Field label="Manufacturing Date">
              <Input
                type="date"
                value={form.manufacturingDate}
                onChange={(e) => set("manufacturingDate", e.target.value)}
              />
            </Field>

            <Field label="Expiry Date">
              <Input
                type="date"
                value={form.expiryDate}
                onChange={(e) => set("expiryDate", e.target.value)}
              />
            </Field>

            <Field label="Batch Prefix">
              <Input
                placeholder="e.g. BAT-"
                value={form.batchPrefix}
                onChange={(e) => set("batchPrefix", e.target.value)}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ================================================
            SECTION 9: ITEM SPECIFICATIONS
        ================================================ */}
        <SectionCard number="9" title="ITEM SPECIFICATIONS">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <Field label="Length">
                <Input
                  type="number"
                  min="0"
                  step="any"
                  suffix="mm"
                  placeholder="0"
                  value={form.length}
                  onChange={(e) => set("length", e.target.value)}
                />
              </Field>

              <Field label="Width">
                <Input
                  type="number"
                  min="0"
                  step="any"
                  suffix="mm"
                  placeholder="0"
                  value={form.width}
                  onChange={(e) => set("width", e.target.value)}
                />
              </Field>

              <Field label="Thickness">
                <Input
                  type="number"
                  min="0"
                  step="any"
                  suffix="mm"
                  placeholder="0"
                  value={form.thickness}
                  onChange={(e) => set("thickness", e.target.value)}
                />
              </Field>

              <Field label="Weight">
                <Input
                  type="number"
                  min="0"
                  step="any"
                  suffix="Kg"
                  placeholder="0"
                  value={form.weight}
                  onChange={(e) => set("weight", e.target.value)}
                />
              </Field>

              <Field label="Grade / Model">
                <Input
                  placeholder="e.g. IS 2062 E250A"
                  value={form.gradeModel}
                  onChange={(e) => set("gradeModel", e.target.value)}
                />
              </Field>
            </div>

            <Field label="Specification">
              <Textarea
                rows={3}
                placeholder="Enter detailed technical specifications, dimensions, tolerances, chemical composition, etc."
                value={form.specification}
                onChange={(e) => set("specification", e.target.value)}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ================================================
            SECTIONS 10 & 11: ATTACHMENTS & NOTES
        ================================================ */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* SECTION 10: ATTACHMENTS */}
          <SectionCard number="10" title="ATTACHMENTS" className="mb-0">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
              }}
              className={`flex flex-col items-center justify-center rounded-[12px] border-2 border-dashed p-6 text-center transition ${
                dragging ? "border-[#11130f] bg-[#f3f2eb]" : "border-[#dedcd4] bg-[#fbfaf7] hover:border-[#b5b8b0]"
              }`}
            >
              <UploadCloud size={32} className="mb-2 text-[#8c9187]" />
              <p className="font-mono text-[11px] font-semibold text-[#11130f]">Drag &amp; drop files here</p>
              <p className="my-1 font-mono text-[10px] text-[#9ca3af]">or</p>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.docx"
                onChange={(e) => {
                  if (e.target.files) handleFiles(e.target.files);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 rounded-[8px] border border-[#dedcd4] bg-white px-3.5 py-1.5 font-mono text-[10px] font-medium text-[#2d3129] shadow-sm hover:bg-[#f0eee8]"
              >
                + Upload Attachment
              </button>
              <p className="mt-3 font-mono text-[9px] text-[#9ca3af]">Max file size: 10MB (PDF, JPG, PNG, DOCX)</p>
            </div>

            {/* Uploaded List */}
            {form.attachments.length > 0 && (
              <div className="mt-3 flex flex-col gap-1.5">
                {form.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-[8px] border border-[#e3e0d9] bg-[#fcfbf9] px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-[#777a73]" />
                      <span className="font-mono text-[10px] font-medium text-[#11130f]">{file.name}</span>
                      <span className="font-mono text-[9px] text-[#9ca3af]">({file.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="text-[#9ca3af] hover:text-[#d9534f]"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* SECTION 11: NOTES */}
          <SectionCard number="11" title="NOTES" className="mb-0">
            <div className="flex flex-col gap-4">
              <Field label="Internal Notes">
                <Textarea
                  rows={3}
                  placeholder="Enter internal operational notes, storage instructions, or handling requirements..."
                  value={form.internalNotes}
                  onChange={(e) => set("internalNotes", e.target.value)}
                />
              </Field>

              <Field label="Additional Notes">
                <Textarea
                  rows={3}
                  placeholder="Enter any additional remarks, vendor terms, or compliance comments..."
                  value={form.additionalNotes}
                  onChange={(e) => set("additionalNotes", e.target.value)}
                />
              </Field>
            </div>
          </SectionCard>
        </div>
    </div>
  );

  const handleCancelClick = () => {
    if (onCancel) onCancel();
    else if (onBack) onBack();
  };

  /* =====================================================
      MODAL / POPUP RENDERING (isModal = true)
  ====================================================== */
  if (isModal) {
    return (
      <>
        {/* Darkened backdrop */}
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
          onClick={!loading ? handleCancelClick : undefined}
        />

        {/* Centered Modal Container */}
        <div className="fixed left-1/2 top-1/2 z-[60] flex h-[90vh] max-h-[850px] w-full max-w-[960px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[16px] border border-[#e2e0d8] bg-[#fbfaf7] shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e5e3dc] px-6 py-4 bg-[#fbfaf7]">
            <div>
              <h2 className="font-serif text-[20px] font-bold text-[#11130f]">
                {isEditMode ? "Edit Item" : "Add New Item"}
              </h2>
              <p className="font-mono text-[10px] text-[#8d9696] mt-0.5">
                {isEditMode
                  ? `Editing SKU: ${initialData?.sku ?? ""}`
                  : "Fill in the specifications to register a new SKU into inventory"}
              </p>
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={handleCancelClick}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e0d8] bg-[#fbfaf7] text-[#777a73] transition hover:bg-[#f0efe9] hover:text-[#11130f]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Status Alerts */}
          {error && (
            <div className="mx-6 mt-4 flex items-center gap-2 rounded-[10px] border border-[#f5c6cb] bg-[#f8d7da] px-4 py-3 font-mono text-[11px] text-[#721c24]">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mx-6 mt-4 flex items-center gap-2 rounded-[10px] border border-[#c3e6cb] bg-[#d4edda] px-4 py-3 font-mono text-[11px] text-[#155724]">
              <Check size={15} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <form onSubmit={handleSave}>
              {renderFormSections()}
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#e5e3dc] bg-white px-6 py-4">
            <div className="font-mono text-[10px] text-[#999b94]">
              * Required fields
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={handleCancelClick}
                className="rounded-[10px] border border-[#dedcd4] bg-[#fbfaf7] px-6 py-2.5 font-mono text-[11px] font-medium text-[#41453d] transition hover:bg-[#f0efe9] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSave}
                className="flex items-center gap-2 rounded-[10px] bg-[#11130f] px-7 py-2.5 font-mono text-[11px] font-medium text-white shadow-sm transition hover:bg-[#2b2f27] disabled:opacity-50"
              >
                {loading ? (
                  <span>{isEditMode ? "Updating..." : "Saving..."}</span>
                ) : (
                  <>
                    <Check size={14} />
                    <span>{isEditMode ? "Update Item" : "Save Item"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* =====================================================
      STANDALONE FULL-PAGE RENDERING (isModal = false)
  ====================================================== */
  return (
    <div className="min-h-full bg-[#f8f7f3] px-[35px] pb-[50px] pt-[35px]">
      {/* Breadcrumb & Header */}
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#8d9696]">
          <span>Inventory</span>
          <span>&gt;</span>
          <span>Inventory Control</span>
          <span>&gt;</span>
          <span className="font-semibold text-[#11130f]">{isEditMode ? "Edit Item" : "Add New Item"}</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#e5e3dc] pb-4">
          <div>
            <h1 className="font-serif text-[26px] font-bold text-[#11130f] tracking-tight">
              {isEditMode ? "Edit Item" : "Add New Item"}
            </h1>
            <p className="font-mono text-[10px] text-[#8d9696] mt-0.5">
              {isEditMode
                ? `Editing SKU: ${initialData?.sku ?? ""}`
                : "Fill in the specifications to register a new SKU into inventory"}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onBack || handleCancelClick}
              className="flex items-center gap-1.5 rounded-[10px] border border-[#dedcd4] bg-white px-4 py-2 font-mono text-[11px] font-medium text-[#41453d] shadow-sm transition hover:bg-[#f3f2ec]"
            >
              <ArrowLeft size={13} />
              Back
            </button>

            <button
              type="button"
              onClick={handleCancelClick}
              className="rounded-[10px] border border-[#dedcd4] bg-white px-4 py-2 font-mono text-[11px] font-medium text-[#41453d] shadow-sm transition hover:bg-[#f3f2ec]"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleSave}
              className="flex items-center gap-2 rounded-[10px] bg-[#11130f] px-5 py-2 font-mono text-[11px] font-medium text-white shadow-sm transition hover:bg-[#2b2f27] disabled:opacity-50"
            >
              {loading ? (
                <span>{isEditMode ? "Updating..." : "Saving..."}</span>
              ) : (
                <>
                  <Check size={13} />
                  {isEditMode ? "Update Item" : "Save Item"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-[10px] border border-[#f5c6cb] bg-[#f8d7da] px-4 py-3 font-mono text-[11px] text-[#721c24]">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-5 flex items-center gap-2 rounded-[10px] border border-[#c3e6cb] bg-[#d4edda] px-4 py-3 font-mono text-[11px] text-[#155724]">
          <Check size={15} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        {renderFormSections()}

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-[#e5e3dc] pt-5">
          <button
            type="button"
            onClick={handleCancelClick}
            className="rounded-[10px] border border-[#dedcd4] bg-white px-6 py-2.5 font-mono text-[11px] font-medium text-[#41453d] shadow-sm transition hover:bg-[#f3f2ec]"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleSave}
            className="flex items-center gap-2 rounded-[10px] bg-[#11130f] px-7 py-2.5 font-mono text-[11px] font-medium text-white shadow-sm transition hover:bg-[#2b2f27] disabled:opacity-50"
          >
            {loading ? (
              <span>Saving...</span>
            ) : (
              <>
                <Check size={14} />
                Save Item
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
