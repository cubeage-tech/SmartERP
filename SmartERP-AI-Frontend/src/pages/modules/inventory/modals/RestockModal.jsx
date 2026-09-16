import React, { useState, useEffect } from "react";
import { X, PackagePlus, Check, AlertCircle, ArrowUpRight } from "lucide-react";
import InventoryService from "../../../../core/services/modules/inventory.service";

const RESTOCK_REASONS = [
  "Purchase Order Receipt",
  "Supplier Inbound Delivery",
  "Emergency Replenishment",
  "Production Return",
  "Warehouse Stock Transfer In",
  "Cycle Count Restock",
  "Other",
];

export default function RestockModal({ item, warehouses = [], onClose, onSuccess }) {
  const currentQty = Number(item?.quantity || 0);
  const [addQty, setAddQty] = useState("50");
  const [warehouseCode, setWarehouseCode] = useState(item?.warehouseCode || "W1");
  const [reason, setReason] = useState(RESTOCK_REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [reference, setReference] = useState("");
  const [supplier, setSupplier] = useState(item?.primarySupplier || "");
  const [restockDate, setRestockDate] = useState(new Date().toISOString().slice(0, 10));
  const [batchNumber, setBatchNumber] = useState(item?.batchPrefix ? `${item.batchPrefix}${Date.now().toString().slice(-4)}` : "");
  const [lotNumber, setLotNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [storageLocation, setStorageLocation] = useState(item?.storageLocation || "");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Live calculated new quantity
  const parsedAddQty = Number(addQty) || 0;
  const newCalculatedQty = currentQty + parsedAddQty;

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
    if (parsedAddQty <= 0) {
      setError("Please enter a valid restock quantity greater than 0.");
      return;
    }

    const finalReason = reason === "Other"
      ? (customReason.trim() || "Manual Restock")
      : reason;

    const refParts = [];
    if (reference.trim()) refParts.push(reference.trim());
    if (supplier.trim()) refParts.push(`Supplier: ${supplier.trim()}`);
    if (batchNumber.trim()) refParts.push(`Batch: ${batchNumber.trim()}`);

    const finalRef = refParts.join(" | ") || undefined;
    const finalReasonStr = `RESTOCK: ${finalReason}${notes ? ` - ${notes.trim()}` : ""}`;

    setSaving(true);
    setError(null);
    try {
      await InventoryService.adjustStock({
        itemId: item.id,
        newQuantity: newCalculatedQty,
        reason: finalReasonStr,
        reference: finalRef,
      });

      // If warehouse or location was changed in restock form, update metadata
      if (
        (warehouseCode && warehouseCode !== item.warehouseCode) ||
        (storageLocation && storageLocation !== item.storageLocation)
      ) {
        const matchedWh = warehouses.find((w) => w.code === warehouseCode);
        await InventoryService.update(item.id, {
          warehouseCode,
          warehouseName: matchedWh?.name || `${warehouseCode} Warehouse`,
          storageLocation: storageLocation || undefined,
        });
      }

      onSuccess();
    } catch (err) {
      const res = err?.response?.data;
      setError(res?.detail || res?.message || "Failed to restock item. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const rawStatus = String(item?.status || "").toUpperCase().replace(/ /g, "_");
  const statusBadge = {
    IN_STOCK: "bg-[#e1ebdf] text-[#3d5940]",
    LOW_STOCK: "bg-[#ece8dc] text-[#746a4d]",
    OUT_OF_STOCK: "bg-[#eadfdd] text-[#76534f]",
  }[rawStatus] || "bg-[#eee] text-[#555]";

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" onClick={!saving ? onClose : undefined} />

      <div className="fixed left-1/2 top-1/2 z-[60] flex h-[90vh] max-h-[760px] w-full max-w-[850px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[16px] border border-[#e2e0d8] bg-[#fbfaf7] shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#e5e3dc] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#cbe3ca] bg-[#eef7ed] text-[#3d5940]">
              <PackagePlus size={18} />
            </div>
            <div>
              <h3 className="font-serif text-[19px] text-[#20231f]">Restock Item</h3>
              <p className="font-mono text-[10px] text-[#999b94]">
                Inbound replenishment, PO receipt, and inventory intake
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

        {/* BODY */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#f5c6cb] bg-[#f8d7da] px-3.5 py-2.5 font-mono text-[11px] text-[#721c24]">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* LEFT COLUMN: ITEM CURRENT INFO */}
              <div className="space-y-4 lg:col-span-5">
                <div className="rounded-[14px] border border-[#e2e0d8] bg-white p-4 shadow-sm">
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#999b94]">
                    Item Overview
                  </span>
                  <div className="mt-1 font-serif text-[17px] leading-snug text-[#20231f]">
                    {item?.name}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-[#777a73]">
                    SKU: {item?.sku}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#f0efeb] pt-3">
                    <span className="font-mono text-[10px] text-[#999b94]">Category:</span>
                    <span className="rounded bg-[#f0efea] px-2 py-0.5 font-mono text-[10px] text-[#333630]">
                      {item?.category}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#999b94]">Warehouse:</span>
                    <span className="font-mono text-[10px] font-medium text-[#20231f]">
                      {item?.warehouseName || item?.warehouseCode}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#999b94]">Min Safety Level:</span>
                    <span className="font-mono text-[10px] text-[#777a73]">
                      {item?.minimumLevel} {item?.unit}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#999b94]">Current Status:</span>
                    <span className={`inline-flex rounded-md px-2 py-0.5 font-mono text-[9px] uppercase ${statusBadge}`}>
                      {item?.status}
                    </span>
                  </div>
                </div>

                {/* CURRENT QUANTITY STAT CARD */}
                <div className="rounded-[14px] border border-[#e2e0d8] bg-[#f5f4ef] p-4">
                  <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-[#888c83]">
                    Current On-Hand Quantity
                  </div>
                  <div className="mt-1 font-serif text-[26px] leading-tight text-[#20231f]">
                    {currentQty}{" "}
                    <span className="font-mono text-[13px] text-[#777a73]">{item?.unit}</span>
                  </div>
                </div>

                {/* PROJECTED LIVE QUANTITY STAT CARD */}
                <div className="rounded-[14px] border border-[#cbe3ca] bg-[#eef7ed] p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-[#3d5940]">
                      New Quantity After Restock
                    </span>
                    <span className="inline-flex items-center gap-0.5 rounded bg-[#3d5940] px-1.5 py-0.5 font-mono text-[9px] text-white">
                      <ArrowUpRight size={11} />
                      +{parsedAddQty}
                    </span>
                  </div>
                  <div className="mt-1 font-serif text-[28px] font-medium leading-tight text-[#2c472e]">
                    {newCalculatedQty}{" "}
                    <span className="font-mono text-[13px] text-[#3d5940]">{item?.unit}</span>
                  </div>
                  <div className="mt-1 font-mono text-[9px] text-[#557858]">
                    Stock status will automatically update to{" "}
                    <strong>
                      {newCalculatedQty >= Number(item?.minimumLevel || 0) ? "In Stock" : "Low Stock"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: RESTOCK INBOUND FORM */}
              <div className="space-y-3.5 lg:col-span-7">
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Add Quantity ({item?.unit}) <span className="text-[#d9534f]">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      value={addQty}
                      onChange={(e) => setAddQty(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[13px] font-medium text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Target Warehouse <span className="text-[#d9534f]">*</span>
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
                        <option value={item?.warehouseCode || "W1"}>
                          {item?.warehouseName || `${item?.warehouseCode || "W1"} Warehouse`}
                        </option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Reason for Restock <span className="text-[#d9534f]">*</span>
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    >
                      {RESTOCK_REASONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Restock Date <span className="text-[#d9534f]">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={restockDate}
                      onChange={(e) => setRestockDate(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                </div>

                {reason === "Other" && (
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Custom Reason Note
                    </label>
                    <input
                      type="text"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Specify custom intake reason..."
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Reference / PO Number
                    </label>
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="e.g. PO-2026-0812"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Supplier / Vendor
                    </label>
                    <input
                      type="text"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      placeholder="e.g. Apex Industrial Supplies"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Batch Number
                    </label>
                    <input
                      type="text"
                      value={batchNumber}
                      onChange={(e) => setBatchNumber(e.target.value)}
                      placeholder="e.g. BAT-2026-01"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Lot Number
                    </label>
                    <input
                      type="text"
                      value={lotNumber}
                      onChange={(e) => setLotNumber(e.target.value)}
                      placeholder="e.g. LOT-A9"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                      Storage Bin / Rack
                    </label>
                    <input
                      type="text"
                      value={storageLocation}
                      onChange={(e) => setStorageLocation(e.target.value)}
                      placeholder="e.g. Rack C-4"
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Restock Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Inspection remarks, carrier details, quality note..."
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between border-t border-[#e5e3dc] bg-white px-6 py-4">
            <div className="font-mono text-[10px] text-[#999b94]">
              Records a verified <strong>STOCK IN</strong> movement
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
                  <span>Processing Restock…</span>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Confirm Restock (+{parsedAddQty} {item?.unit})</span>
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
