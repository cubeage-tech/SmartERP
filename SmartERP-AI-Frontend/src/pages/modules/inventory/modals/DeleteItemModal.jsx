import React, { useState, useEffect } from "react";
import { X, AlertTriangle, Trash2, PowerOff, ShieldAlert, Check } from "lucide-react";
import InventoryService from "../../../../core/services/modules/inventory.service";

export default function DeleteItemModal({ item, onClose, onSuccess }) {
  const currentQty = Number(item?.quantity || 0);
  const hasStock = currentQty > 0;

  // By default, if item has stock, recommend 'deactivate'. Otherwise allow 'delete' or 'deactivate'.
  const [selectedAction, setSelectedAction] = useState(hasStock ? "deactivate" : "delete");
  const [confirmSku, setConfirmSku] = useState("");
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

  const handleExecute = async () => {
    setSaving(true);
    setError(null);
    try {
      if (selectedAction === "deactivate") {
        // Deactivate safely by updating notes / status / minimumLevel
        await InventoryService.update(item.id, {
          internalNotes: `[DEACTIVATED on ${new Date().toISOString().slice(0, 10)}] ${item.internalNotes || ""}`.trim(),
          additionalNotes: "ITEM_DEACTIVATED",
        });
      } else {
        // Permanent Delete
        await InventoryService.remove(item.id);
      }
      onSuccess();
    } catch (err) {
      const res = err?.response?.data;
      setError(res?.detail || res?.message || "Operation failed. Please verify item dependencies.");
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

      <div className="fixed left-1/2 top-1/2 z-[60] flex w-full max-w-[560px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[16px] border border-[#e2e0d8] bg-[#fbfaf7] shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#e5e3dc] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#f5c6cb] bg-[#f8d7da] text-[#721c24]">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="font-serif text-[19px] text-[#20231f]">Delete Item</h3>
              <p className="font-mono text-[10px] text-[#999b94]">
                Choose safe deactivation or permanent removal
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
        <div className="px-6 py-5">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#f5c6cb] bg-[#f8d7da] px-3.5 py-2.5 font-mono text-[11px] text-[#721c24]">
              <ShieldAlert size={15} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* WARNING BANNER */}
          <div className="mb-4 rounded-[10px] border border-[#f2d8d8] bg-[#fdf2f2] p-3.5 font-mono text-[11px] text-[#9e3a32]">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle size={14} />
              <span>This action cannot be undone.</span>
            </div>
            <p className="mt-1 text-[10px] text-[#a94442]">
              Permanent deletion will remove all master records for this SKU. Deactivation is recommended if this item has past sales, purchase or movement records.
            </p>
          </div>

          {/* SELECTED ITEM INFO CARD */}
          <div className="mb-5 rounded-[12px] border border-[#e2e0d8] bg-white p-4 font-mono text-[11px] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-serif text-[16px] text-[#20231f]">{item?.name}</div>
                <div className="mt-0.5 text-[#777a73]">SKU: <strong>{item?.sku}</strong></div>
              </div>
              <span className={`inline-flex rounded-md px-2 py-0.5 text-[9px] uppercase ${statusBadge}`}>
                {item?.status}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#f0efeb] pt-3 text-[10px]">
              <div>
                <span className="text-[#999b94]">Warehouse:</span>
                <div className="font-medium text-[#20231f]">{item?.warehouseCode}</div>
              </div>
              <div>
                <span className="text-[#999b94]">Category:</span>
                <div className="font-medium text-[#20231f]">{item?.category}</div>
              </div>
              <div>
                <span className="text-[#999b94]">Current Stock:</span>
                <div className={`font-medium ${hasStock ? "text-[#9e3a32]" : "text-[#20231f]"}`}>
                  {currentQty} {item?.unit}
                </div>
              </div>
            </div>
          </div>

          {/* ACTION SELECTION OPTIONS */}
          <div className="space-y-3">
            {/* OPTION 1: DEACTIVATE (RECOMMENDED) */}
            <label
              className={`
                flex cursor-pointer items-start gap-3 rounded-[12px] border p-3.5 transition
                ${selectedAction === "deactivate"
                  ? "border-[#11130f] bg-[#f8f7f2] ring-1 ring-[#11130f]"
                  : "border-[#e2e0d8] bg-white hover:bg-[#fbfaf7]"
                }
              `}
            >
              <input
                type="radio"
                name="deleteAction"
                value="deactivate"
                checked={selectedAction === "deactivate"}
                onChange={() => setSelectedAction("deactivate")}
                className="mt-0.5 h-4 w-4 text-[#11130f] focus:ring-0"
              />
              <div className="flex-1 font-mono text-[11px]">
                <div className="flex items-center gap-2 font-semibold text-[#20231f]">
                  <PowerOff size={14} className="text-[#3d5940]" />
                  <span>Deactivate Item (Recommended)</span>
                  <span className="rounded bg-[#e1ebdf] px-1.5 py-0.5 text-[9px] font-medium text-[#3d5940]">
                    Safe
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-[#6b7268]">
                  Item becomes inactive and hidden from active transaction pickers. All stock movement history, reports, and ledger links are completely preserved.
                </p>
              </div>
            </label>

            {/* OPTION 2: DELETE PERMANENTLY */}
            <label
              className={`
                flex cursor-pointer items-start gap-3 rounded-[12px] border p-3.5 transition
                ${selectedAction === "delete"
                  ? "border-[#b05a52] bg-[#fdf2f2] ring-1 ring-[#b05a52]"
                  : "border-[#e2e0d8] bg-white hover:bg-[#fbfaf7]"
                }
              `}
            >
              <input
                type="radio"
                name="deleteAction"
                value="delete"
                checked={selectedAction === "delete"}
                onChange={() => setSelectedAction("delete")}
                className="mt-0.5 h-4 w-4 text-[#b05a52] focus:ring-0"
              />
              <div className="flex-1 font-mono text-[11px]">
                <div className="flex items-center gap-2 font-semibold text-[#9e3a32]">
                  <Trash2 size={14} />
                  <span>Delete Permanently</span>
                  {hasStock && (
                    <span className="rounded bg-[#eadfdd] px-1.5 py-0.5 text-[9px] font-medium text-[#76534f]">
                      Has {currentQty} {item?.unit}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[10px] text-[#8c6257]">
                  Completely removes the inventory item from the database. Allowed only when safe.
                </p>
              </div>
            </label>
          </div>

          {/* CONFIRMATION INPUT IF PERMANENT DELETE SELECTED */}
          {selectedAction === "delete" && (
            <div className="mt-4 rounded-[10px] border border-[#f2d8d8] bg-[#fffbfb] p-3 font-mono text-[11px]">
              <label className="block text-[10px] text-[#8c6257]">
                Type the item SKU <strong>{item?.sku}</strong> to confirm permanent deletion:
              </label>
              <input
                type="text"
                value={confirmSku}
                onChange={(e) => setConfirmSku(e.target.value)}
                placeholder={item?.sku}
                className="mt-1.5 w-full rounded-[6px] border border-[#f5c6cb] bg-white px-3 py-1.5 font-mono text-[11px] text-[#9e3a32] outline-none"
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-[#e5e3dc] bg-white px-6 py-4">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-[9px] border border-[#e2e0d8] bg-[#fbfaf7] px-4 py-2 font-mono text-[11px] text-[#666a63] transition hover:bg-[#f0efe9] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={
              saving ||
              (selectedAction === "delete" && confirmSku.trim().toUpperCase() !== item?.sku?.toUpperCase())
            }
            onClick={handleExecute}
            className={`
              inline-flex items-center gap-1.5 rounded-[9px] px-5 py-2 font-mono text-[11px] font-medium text-white transition disabled:opacity-40
              ${selectedAction === "deactivate"
                ? "bg-[#11130f] hover:bg-[#292c27]"
                : "bg-[#b05a52] hover:bg-[#9e3a32]"
              }
            `}
          >
            {saving ? (
              <span>Processing…</span>
            ) : selectedAction === "deactivate" ? (
              <>
                <Check size={14} />
                <span>Deactivate Item</span>
              </>
            ) : (
              <>
                <Trash2 size={14} />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
