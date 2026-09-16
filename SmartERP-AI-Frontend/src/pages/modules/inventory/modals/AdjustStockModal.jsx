import React, { useState, useEffect } from "react";
import { X, SlidersHorizontal, Check, AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import InventoryService from "../../../../core/services/modules/inventory.service";

const ADJUSTMENT_TYPES = [
  "Physical Count Variance",
  "Damaged Goods Write-off",
  "Found Inventory",
  "Supplier Shortage Correction",
  "Internal Consumption",
  "Quality Inspection Scrap",
  "Other",
];

export default function AdjustStockModal({ item, onClose, onSuccess }) {
  const currentQty = Number(item?.quantity || 0);
  const minLevel = Number(item?.minimumLevel || 0);

  const [mode, setMode] = useState("count"); // 'count' (set absolute) or 'diff' (add/subtract)
  const [newCountQty, setNewCountQty] = useState(String(currentQty));
  const [adjustmentDelta, setAdjustmentDelta] = useState("0");

  const [adjustmentType, setAdjustmentType] = useState(ADJUSTMENT_TYPES[0]);
  const [customReason, setCustomReason] = useState("");
  const [adjustmentDate, setAdjustmentDate] = useState(new Date().toISOString().slice(0, 10));
  const [reference, setReference] = useState("");
  const [batchLot, setBatchLot] = useState("");
  const [storageLocation, setStorageLocation] = useState(item?.storageLocation || "");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Live calculation based on mode
  let finalNewQty = currentQty;
  let finalVariance = 0;

  if (mode === "count") {
    const val = Number(newCountQty);
    finalNewQty = isNaN(val) ? currentQty : Math.max(0, val);
    finalVariance = finalNewQty - currentQty;
  } else {
    const delta = Number(adjustmentDelta);
    finalVariance = isNaN(delta) ? 0 : delta;
    finalNewQty = Math.max(0, currentQty + finalVariance);
  }

  // Projected new status
  let projectedStatus = "In Stock";
  let projectedBadge = "bg-[#e1ebdf] text-[#3d5940]";
  if (finalNewQty === 0) {
    projectedStatus = "Out of Stock";
    projectedBadge = "bg-[#eadfdd] text-[#76534f]";
  } else if (finalNewQty < minLevel) {
    projectedStatus = "Low Stock";
    projectedBadge = "bg-[#ece8dc] text-[#746a4d]";
  }

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
    if (finalNewQty < 0) {
      setError("Adjusted stock quantity cannot be negative.");
      return;
    }

    const reasonText = adjustmentType === "Other"
      ? (customReason.trim() || "Manual Stock Adjustment")
      : adjustmentType;

    const refParts = [];
    if (reference.trim()) refParts.push(reference.trim());
    if (batchLot.trim()) refParts.push(`Batch/Lot: ${batchLot.trim()}`);
    if (storageLocation && storageLocation !== item.storageLocation) {
      refParts.push(`Loc: ${storageLocation.trim()}`);
    }

    const finalRef = refParts.join(" | ") || undefined;
    const finalReason = `${reasonText}${notes ? ` - ${notes.trim()}` : ""}`;

    setSaving(true);
    setError(null);
    try {
      await InventoryService.adjustStock({
        itemId: item.id,
        newQuantity: finalNewQty,
        reason: finalReason,
        reference: finalRef,
      });

      onSuccess();
    } catch (err) {
      const res = err?.response?.data;
      setError(res?.detail || res?.message || "Failed to adjust stock. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const rawStatus = String(item?.status || "").toUpperCase().replace(/ /g, "_");
  const currentBadge = {
    IN_STOCK: "bg-[#e1ebdf] text-[#3d5940]",
    LOW_STOCK: "bg-[#ece8dc] text-[#746a4d]",
    OUT_OF_STOCK: "bg-[#eadfdd] text-[#76534f]",
  }[rawStatus] || "bg-[#eee] text-[#555]";

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" onClick={!saving ? onClose : undefined} />

      <div className="fixed left-1/2 top-1/2 z-[60] flex h-[90vh] max-h-[760px] w-full max-w-[800px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[16px] border border-[#e2e0d8] bg-[#fbfaf7] shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#e5e3dc] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dcdad2] bg-[#f2f0ea] text-[#373a35]">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h3 className="font-serif text-[19px] text-[#20231f]">Adjust Stock</h3>
              <p className="font-mono text-[10px] text-[#999b94]">
                Modify inventory balances, reconcile cycle count variances, and write off stock
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

            {/* CURRENT STOCK CARD */}
            <div className="mb-5 rounded-[12px] border border-[#e2e0d8] bg-white p-4 shadow-sm">
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#999b94]">
                Current Stock Details
              </span>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-serif text-[17px] text-[#20231f]">{item?.name}</div>
                  <div className="font-mono text-[11px] text-[#777a73]">SKU: {item?.sku}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right font-mono text-[11px]">
                    <div className="text-[#999b94]">Warehouse: <strong className="text-[#20231f]">{item?.warehouseCode}</strong></div>
                    <div className="text-[#999b94]">Min: {minLevel} {item?.unit}</div>
                  </div>
                  <span className={`inline-flex rounded-md px-2.5 py-1 font-mono text-[9px] uppercase ${currentBadge}`}>
                    {item?.status}
                  </span>
                </div>
              </div>
            </div>

            {/* ADJUSTMENT DETAILS */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Adjustment Type <span className="text-[#d9534f]">*</span>
                  </label>
                  <select
                    value={adjustmentType}
                    onChange={(e) => setAdjustmentType(e.target.value)}
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                  >
                    {ADJUSTMENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Adjustment Date <span className="text-[#d9534f]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={adjustmentDate}
                    onChange={(e) => setAdjustmentDate(e.target.value)}
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                  />
                </div>
              </div>

              {/* MODE SELECTOR */}
              <div className="rounded-[12px] border border-[#e2e0d8] bg-[#fdfdfc] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Quantity Adjustment Mode
                  </span>
                  <div className="flex rounded-[7px] border border-[#dedcd4] bg-[#f5f4ef] p-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("count");
                        setNewCountQty(String(finalNewQty));
                      }}
                      className={`rounded-[5px] px-3 py-1 font-mono text-[10px] transition ${
                        mode === "count" ? "bg-white font-medium text-[#11130f] shadow-sm" : "text-[#777a73]"
                      }`}
                    >
                      Set New Counted Qty
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("diff");
                        setAdjustmentDelta(String(finalVariance));
                      }}
                      className={`rounded-[5px] px-3 py-1 font-mono text-[10px] transition ${
                        mode === "diff" ? "bg-white font-medium text-[#11130f] shadow-sm" : "text-[#777a73]"
                      }`}
                    >
                      +/- Variance Delta
                    </button>
                  </div>
                </div>

                {mode === "count" ? (
                  <div>
                    <label className="block font-mono text-[10px] text-[#777a73]">
                      New Physical / Counted Quantity ({item?.unit}) <span className="text-[#d9534f]">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={newCountQty}
                      onChange={(e) => setNewCountQty(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2.5 font-mono text-[14px] font-medium text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block font-mono text-[10px] text-[#777a73]">
                      Adjustment Variance (+ to add, - to subtract) ({item?.unit}) <span className="text-[#d9534f]">*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={adjustmentDelta}
                      onChange={(e) => setAdjustmentDelta(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2.5 font-mono text-[14px] font-medium text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  </div>
                )}
              </div>

              {adjustmentType === "Other" && (
                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Custom Reason Note
                  </label>
                  <input
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Provide specific reason..."
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Reference / Document ID
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. ADJ-2026-003"
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Batch / Lot Number
                  </label>
                  <input
                    type="text"
                    value={batchLot}
                    onChange={(e) => setBatchLot(e.target.value)}
                    placeholder="e.g. BAT-2026-X"
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Storage Location / Bin
                  </label>
                  <input
                    type="text"
                    value={storageLocation}
                    onChange={(e) => setStorageLocation(e.target.value)}
                    placeholder="e.g. Rack A-1"
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                  Notes / Audit Remarks
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional context for inventory logs..."
                  className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                />
              </div>

              {/* SUMMARY CARD */}
              <div className="rounded-[12px] border border-[#e2e0d8] bg-[#f5f4ef] p-4 font-mono text-[11px]">
                <div className="mb-2 font-semibold uppercase tracking-[0.08em] text-[#777a73]">
                  Adjustment Impact Summary
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-[8px] border border-[#dedcd4] bg-white p-2.5">
                    <div className="text-[9px] text-[#999b94]">System Qty</div>
                    <div className="font-serif text-[16px] text-[#20231f]">
                      {currentQty} {item?.unit}
                    </div>
                  </div>

                  <div className="rounded-[8px] border border-[#dedcd4] bg-white p-2.5">
                    <div className="text-[9px] text-[#999b94]">Adjustment</div>
                    <div className={`flex items-center gap-1 font-serif text-[16px] ${
                      finalVariance > 0
                        ? "text-[#3d5940]"
                        : finalVariance < 0
                        ? "text-[#9e3a32]"
                        : "text-[#777a73]"
                    }`}>
                      {finalVariance > 0 ? (
                        <TrendingUp size={14} />
                      ) : finalVariance < 0 ? (
                        <TrendingDown size={14} />
                      ) : (
                        <Minus size={14} />
                      )}
                      {finalVariance > 0 ? `+${finalVariance}` : finalVariance} {item?.unit}
                    </div>
                  </div>

                  <div className="rounded-[8px] border border-[#dedcd4] bg-white p-2.5">
                    <div className="text-[9px] text-[#999b94]">New Balance</div>
                    <div className="font-serif text-[16px] font-medium text-[#11130f]">
                      {finalNewQty} {item?.unit}
                    </div>
                  </div>

                  <div className="rounded-[8px] border border-[#dedcd4] bg-white p-2.5">
                    <div className="text-[9px] text-[#999b94]">New Status</div>
                    <div className="mt-0.5">
                      <span className={`inline-flex rounded px-1.5 py-0.5 text-[9px] uppercase ${projectedBadge}`}>
                        {projectedStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between border-t border-[#e5e3dc] bg-white px-6 py-4">
            <div className="font-mono text-[10px] text-[#999b94]">
              {finalVariance !== 0
                ? `Will record a ${finalVariance > 0 ? "STOCK IN" : "STOCK OUT"} movement`
                : "No quantity change will occur"}
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
                  <span>Adjusting…</span>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Apply Adjustment</span>
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
