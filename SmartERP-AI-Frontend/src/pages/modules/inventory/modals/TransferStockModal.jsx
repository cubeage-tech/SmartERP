import React, { useState, useEffect } from "react";
import { X, ArrowLeftRight, Check, AlertCircle, Warehouse, ArrowRight } from "lucide-react";
import InventoryService from "../../../../core/services/modules/inventory.service";

const TRANSFER_REASONS = [
  "Inter-Warehouse Stock Rebalancing",
  "Branch / Depot Requisition",
  "Production Line Allocation",
  "Centralization / Consolidation",
  "Quality Inspection Relocation",
  "Other",
];

export default function TransferStockModal({ item, warehouses = [], onClose, onSuccess }) {
  const currentQty = Number(item?.quantity || 0);

  const availableDestinations = (warehouses || []).filter(
    (w) => w.code && w.code.toUpperCase() !== (item?.warehouseCode || "").toUpperCase()
  );

  const [toWarehouseCode, setToWarehouseCode] = useState(
    availableDestinations.length > 0 ? availableDestinations[0].code : "W2"
  );
  const [toLocation, setToLocation] = useState("");
  const [transferQty, setTransferQty] = useState("10");
  const [transferDate, setTransferDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState(TRANSFER_REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [reference, setReference] = useState("");
  const [batchLot, setBatchLot] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const parsedQty = Number(transferQty) || 0;
  const remainingSourceQty = Math.max(0, currentQty - parsedQty);

  // Set default target warehouse
  useEffect(() => {
    if (availableDestinations.length > 0 && !toWarehouseCode) {
      setToWarehouseCode(availableDestinations[0].code);
    }
  }, [availableDestinations, toWarehouseCode]);

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
    if (parsedQty <= 0) {
      setError("Please enter a valid transfer quantity greater than zero.");
      return;
    }
    if (parsedQty > currentQty) {
      setError(`Transfer quantity exceeds available stock (${currentQty} ${item?.unit}).`);
      return;
    }
    if (!toWarehouseCode || toWarehouseCode.toUpperCase() === (item?.warehouseCode || "").toUpperCase()) {
      setError("Source and destination warehouses must be different.");
      return;
    }

    const targetObj = warehouses.find((w) => w.code === toWarehouseCode) || {
      code: toWarehouseCode,
      name: `${toWarehouseCode} Warehouse`,
    };

    const finalReason = reason === "Other" ? (customReason.trim() || "Manual Transfer") : reason;

    const refParts = [];
    if (reference.trim()) refParts.push(reference.trim());
    if (batchLot.trim()) refParts.push(`Batch/Lot: ${batchLot.trim()}`);
    if (toLocation.trim()) refParts.push(`To Bin: ${toLocation.trim()}`);
    if (notes.trim()) refParts.push(notes.trim());

    const finalRef = `TRANSFER: ${item.warehouseCode} -> ${toWarehouseCode} | ${finalReason}${
      refParts.length ? ` (${refParts.join(" | ")})` : ""
    }`;

    setSaving(true);
    setError(null);
    try {
      await InventoryService.transferStock({
        itemId: item.id,
        targetWarehouseCode: targetObj.code,
        targetWarehouseName: targetObj.name || `${targetObj.code} Warehouse`,
        quantity: parsedQty,
        reference: finalRef,
      });

      // Update location if specified
      if (toLocation.trim()) {
        await InventoryService.update(item.id, {
          storageLocation: toLocation.trim(),
        });
      }

      onSuccess();
    } catch (err) {
      const res = err?.response?.data;
      setError(res?.detail || res?.message || "Transfer failed. Please check quantities and destination.");
    } finally {
      setSaving(false);
    }
  };

  const matchedTargetWh = warehouses.find((w) => w.code === toWarehouseCode);
  const targetWhLabel = matchedTargetWh?.name || `${toWarehouseCode} Warehouse`;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" onClick={!saving ? onClose : undefined} />

      <div className="fixed left-1/2 top-1/2 z-[60] flex h-[90vh] max-h-[760px] w-full max-w-[800px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[16px] border border-[#e2e0d8] bg-[#fbfaf7] shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#e5e3dc] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d0d6e2] bg-[#f2f4f8] text-[#3a475d]">
              <ArrowLeftRight size={18} />
            </div>
            <div>
              <h3 className="font-serif text-[19px] text-[#20231f]">Transfer Stock</h3>
              <p className="font-mono text-[10px] text-[#999b94]">
                Inter-warehouse stock relocation, dispatch note creation, and inventory transit
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

            {/* ITEM OVERVIEW CARD */}
            <div className="mb-5 rounded-[12px] border border-[#e2e0d8] bg-white p-4 shadow-sm">
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#999b94]">
                Item & Source Overview
              </span>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-serif text-[17px] text-[#20231f]">{item?.name}</div>
                  <div className="font-mono text-[11px] text-[#777a73]">
                    SKU: {item?.sku} · Category: {item?.category}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right font-mono text-[11px]">
                    <div className="text-[#999b94]">Source Warehouse</div>
                    <div className="font-medium text-[#20231f]">
                      {item?.warehouseName || `${item?.warehouseCode} Warehouse`}
                    </div>
                  </div>
                  <div className="rounded-[8px] bg-[#f0efea] px-3 py-1.5 text-right font-mono text-[11px]">
                    <div className="text-[9px] uppercase text-[#888c83]">Available</div>
                    <div className="font-serif text-[16px] font-medium text-[#20231f]">
                      {currentQty} {item?.unit}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TRANSFER DETAILS FORM */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    From Warehouse (Source)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${item?.warehouseCode} – ${item?.warehouseName || `${item?.warehouseCode} Warehouse`}`}
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-[#f0efea] px-3 py-2 font-mono text-[11px] text-[#666a63] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    To Warehouse (Destination) <span className="text-[#d9534f]">*</span>
                  </label>
                  {availableDestinations.length > 0 ? (
                    <select
                      value={toWarehouseCode}
                      onChange={(e) => setToWarehouseCode(e.target.value)}
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    >
                      {availableDestinations.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.code} – {w.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. W2"
                      value={toWarehouseCode}
                      onChange={(e) => setToWarehouseCode(e.target.value)}
                      required
                      className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    From Location / Bin
                  </label>
                  <input
                    type="text"
                    disabled
                    value={item?.storageLocation || "Default Bin"}
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-[#f0efea] px-3 py-2 font-mono text-[11px] text-[#666a63] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    To Location / Bin (Destination)
                  </label>
                  <input
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="e.g. Zone B, Shelf 4"
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Transfer Quantity ({item?.unit}) <span className="text-[#d9534f]">*</span>
                  </label>
                  <input
                    type="number"
                    min="0.001"
                    max={currentQty}
                    step="any"
                    required
                    value={transferQty}
                    onChange={(e) => setTransferQty(e.target.value)}
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[14px] font-medium text-[#11130f] outline-none focus:border-[#11130f]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Transfer Date <span className="text-[#d9534f]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Transfer Reason <span className="text-[#d9534f]">*</span>
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                  >
                    {TRANSFER_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {reason === "Other" && (
                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Custom Transfer Reason
                  </label>
                  <input
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Specify transfer reason..."
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                    Transfer Reference / Dispatch Note
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. TR-2026-089"
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
                    placeholder="e.g. LOT-2026-01"
                    className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
                  Transfer Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Gate pass number, driver name, carrier info..."
                  className="mt-1 w-full rounded-[8px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
                />
              </div>

              {/* LIVE SUMMARY CARD */}
              <div className="rounded-[12px] border border-[#d0d6e2] bg-[#f2f4f8] p-4 font-mono text-[11px]">
                <div className="mb-2 font-semibold uppercase tracking-[0.08em] text-[#3a475d]">
                  Transfer Movement Summary
                </div>
                <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-12">
                  <div className="rounded-[8px] border border-[#dedcd4] bg-white p-3 sm:col-span-5">
                    <div className="text-[9px] uppercase text-[#999b94]">Source: {item?.warehouseCode}</div>
                    <div className="mt-1 font-serif text-[15px] text-[#20231f]">
                      Remaining: <strong className="text-[#333630]">{remainingSourceQty} {item?.unit}</strong>
                    </div>
                  </div>

                  <div className="flex justify-center sm:col-span-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3a475d] text-white shadow-sm">
                      <ArrowRight size={14} />
                    </div>
                  </div>

                  <div className="rounded-[8px] border border-[#dedcd4] bg-white p-3 sm:col-span-5">
                    <div className="text-[9px] uppercase text-[#999b94]">Destination: {toWarehouseCode}</div>
                    <div className="mt-1 font-serif text-[15px] text-[#20231f]">
                      Will Receive: <strong className="text-[#3d5940]">+{parsedQty} {item?.unit}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between border-t border-[#e5e3dc] bg-white px-6 py-4">
            <div className="font-mono text-[10px] text-[#999b94]">
              Records paired <strong>TRANSFER (OUT)</strong> & <strong>TRANSFER (IN)</strong> movements
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
                disabled={saving || parsedQty <= 0}
                className="inline-flex items-center gap-1.5 rounded-[9px] bg-[#11130f] px-5 py-2 font-mono text-[11px] text-white transition hover:bg-[#292c27] disabled:opacity-50"
              >
                {saving ? (
                  <span>Processing Transfer…</span>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Confirm Transfer ({parsedQty} {item?.unit})</span>
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
