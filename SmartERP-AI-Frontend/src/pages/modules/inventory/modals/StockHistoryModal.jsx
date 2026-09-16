import React, { useState, useEffect, useMemo } from "react";
import { X, History, Search, RefreshCw, AlertCircle, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react";
import InventoryService from "../../../../core/services/modules/inventory.service";

export default function StockHistoryModal({ item, warehouses = [], onClose }) {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [movementType, setMovementType] = useState("ALL");
  const [selectedWarehouse, setSelectedWarehouse] = useState("ALL");
  const [searchRef, setSearchRef] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await InventoryService.getMovements();
      const allMovements = Array.isArray(res?.data) ? res.data : [];
      // Filter for this specific item by SKU or item name
      const itemMovements = allMovements.filter((m) => {
        const skuMatch = m.sku && item.sku && m.sku.toLowerCase() === item.sku.toLowerCase();
        const nameMatch = m.itemName && item.name && m.itemName.toLowerCase() === item.name.toLowerCase();
        return skuMatch || nameMatch;
      });
      setMovements(itemMovements);
    } catch {
      setError("Failed to load movement history.");
      setMovements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  // Filter movements
  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      // Date from
      if (dateFrom && m.movementDate && m.movementDate < dateFrom) return false;
      // Date to
      if (dateTo && m.movementDate && m.movementDate > dateTo) return false;
      // Movement type
      if (movementType !== "ALL") {
        const normType = String(m.type || "").toUpperCase().replace(/ /g, "_");
        if (normType !== movementType) return false;
      }
      // Warehouse
      if (selectedWarehouse !== "ALL") {
        const whCode = String(m.warehouseCode || m.warehouseName || "").toUpperCase();
        if (!whCode.includes(selectedWarehouse.toUpperCase())) return false;
      }
      // Search ref
      if (searchRef.trim()) {
        const term = searchRef.toLowerCase();
        const refStr = String(m.reference || "").toLowerCase();
        const userStr = String(m.createdByName || "").toLowerCase();
        if (!refStr.includes(term) && !userStr.includes(term)) return false;
      }
      return true;
    });
  }, [movements, dateFrom, dateTo, movementType, selectedWarehouse, searchRef]);

  const rawStatus = String(item?.status || "").toUpperCase().replace(/ /g, "_");
  const statusBadge = {
    IN_STOCK: "bg-[#e1ebdf] text-[#3d5940]",
    LOW_STOCK: "bg-[#ece8dc] text-[#746a4d]",
    OUT_OF_STOCK: "bg-[#eadfdd] text-[#76534f]",
  }[rawStatus] || "bg-[#eee] text-[#555]";

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setMovementType("ALL");
    setSelectedWarehouse("ALL");
    setSearchRef("");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      <div className="fixed left-1/2 top-1/2 z-[60] flex h-[90vh] max-h-[780px] w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[16px] border border-[#e2e0d8] bg-[#fbfaf7] shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#e5e3dc] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dcdad2] bg-[#f2f0ea] text-[#373a35]">
              <History size={18} />
            </div>
            <div>
              <h3 className="font-serif text-[19px] text-[#20231f]">Stock Movement History</h3>
              <p className="font-mono text-[10px] text-[#999b94]">
                Audit trail of inbound, outbound, adjustments and warehouse transfers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e0d8] bg-[#fbfaf7] text-[#777a73] transition hover:bg-[#f0efe9] hover:text-[#11130f]"
          >
            <X size={15} />
          </button>
        </div>

        {/* ITEM SUMMARY HEADER BAR */}
        <div className="border-b border-[#e5e3dc] bg-white px-6 py-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-[16px] text-[#20231f]">{item?.name}</span>
                <span className="rounded-md border border-[#e1dfd7] bg-[#f0efea] px-2 py-0.5 font-mono text-[10px] text-[#777a73]">
                  {item?.sku}
                </span>
                <span className="rounded bg-[#f5f4ef] px-2 py-0.5 font-mono text-[10px] text-[#666a63]">
                  {item?.category}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-mono text-[11px]">
                <span className="text-[#999b94]">Current Stock: </span>
                <strong className="text-[#20231f]">{item?.quantity} {item?.unit}</strong>
              </div>
              <span className={`inline-flex rounded-md px-2 py-0.5 font-mono text-[9px] uppercase ${statusBadge}`}>
                {item?.status}
              </span>
            </div>
          </div>
        </div>

        {/* FILTERS TOOLBAR */}
        <div className="border-b border-[#e5e3dc] bg-[#f5f4ef] px-6 py-3">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            <div>
              <label className="block font-mono text-[9px] uppercase text-[#777a73]">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="mt-0.5 h-[30px] w-full rounded-[6px] border border-[#dedcd4] bg-white px-2 font-mono text-[10px] text-[#11130f] outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase text-[#777a73]">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="mt-0.5 h-[30px] w-full rounded-[6px] border border-[#dedcd4] bg-white px-2 font-mono text-[10px] text-[#11130f] outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase text-[#777a73]">Type</label>
              <select
                value={movementType}
                onChange={(e) => setMovementType(e.target.value)}
                className="mt-0.5 h-[30px] w-full rounded-[6px] border border-[#dedcd4] bg-white px-2 font-mono text-[10px] text-[#11130f] outline-none"
              >
                <option value="ALL">All Movements</option>
                <option value="STOCK_IN">Stock In</option>
                <option value="STOCK_OUT">Stock Out</option>
                <option value="TRANSFER">Transfer</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase text-[#777a73]">Warehouse</label>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="mt-0.5 h-[30px] w-full rounded-[6px] border border-[#dedcd4] bg-white px-2 font-mono text-[10px] text-[#11130f] outline-none"
              >
                <option value="ALL">All Warehouses</option>
                {warehouses.map((w) => (
                  <option key={w.code} value={w.code}>{w.code}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-1">
              <div className="relative flex-1">
                <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#999b94]" />
                <input
                  type="text"
                  placeholder="Ref / Notes..."
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  className="h-[30px] w-full rounded-[6px] border border-[#dedcd4] bg-white pl-6 pr-2 font-mono text-[10px] text-[#11130f] outline-none placeholder-[#aaa]"
                />
              </div>
              {(dateFrom || dateTo || movementType !== "ALL" || selectedWarehouse !== "ALL" || searchRef) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  title="Reset Filters"
                  className="h-[30px] rounded-[6px] border border-[#dedcd4] bg-white px-2 font-mono text-[9px] text-[#777a73] hover:bg-[#f0efe9]"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TABLE CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 font-mono text-[11px] text-[#999b94]">
              <RefreshCw size={15} className="mr-2 animate-spin" />
              Loading movement history…
            </div>
          ) : error ? (
            <div className="m-6 flex items-center gap-2 rounded-lg border border-[#f5c6cb] bg-[#f8d7da] px-4 py-3 font-mono text-[11px] text-[#721c24]">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          ) : filteredMovements.length === 0 ? (
            <div className="py-20 text-center font-mono text-[11px] text-[#999b94]">
              No stock movement records found for this item matching the criteria.
            </div>
          ) : (
            <table className="w-full border-collapse font-mono text-[10px]">
              <thead>
                <tr className="sticky top-0 border-b border-[#e1dfd7] bg-[#f8f7f3] text-left text-[9px] uppercase tracking-[0.08em] text-[#888c83]">
                  <th className="px-4 py-2.5 font-medium">Date</th>
                  <th className="px-3 py-2.5 font-medium">Type</th>
                  <th className="px-3 py-2.5 font-medium text-right">Quantity</th>
                  <th className="px-3 py-2.5 font-medium">Warehouse</th>
                  <th className="px-4 py-2.5 font-medium">Reference / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0efeb] bg-white">
                {filteredMovements.map((m, idx) => {
                  const normType = String(m.type || "").toUpperCase().replace(/ /g, "_");
                  const isStockIn = normType === "STOCK_IN";
                  const isStockOut = normType === "STOCK_OUT";
                  const isTransfer = normType === "TRANSFER";

                  const typeBadge = isStockIn
                    ? "bg-[#e1ebdf] text-[#3d5940]"
                    : isStockOut
                    ? "bg-[#eadfdd] text-[#76534f]"
                    : "bg-[#e2e8f0] text-[#334155]";

                  return (
                    <tr key={m.id || idx} className="hover:bg-[#fafaf8]">
                      <td className="px-4 py-3 text-[#555850]">
                        {m.movementDate || "—"}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] uppercase font-semibold ${typeBadge}`}>
                          {isStockIn && <ArrowUpRight size={10} />}
                          {isStockOut && <ArrowDownLeft size={10} />}
                          {isTransfer && <ArrowLeftRight size={10} />}
                          {m.type}
                        </span>
                      </td>
                      <td className={`px-3 py-3 text-right font-medium ${
                        isStockIn ? "text-[#3d5940]" : isStockOut ? "text-[#9e3a32]" : "text-[#334155]"
                      }`}>
                        {isStockIn ? `+${m.quantity}` : isStockOut ? `-${m.quantity}` : m.quantity} {m.unit || item?.unit}
                      </td>
                      <td className="px-3 py-3 text-[#777a73]">
                        {m.warehouseCode || m.warehouseName || "—"}
                      </td>
                      <td className="px-4 py-3 text-[#20231f]">
                        <div className="font-sans text-[11px] text-[#20231f]">{m.reference || "Manual Transaction"}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-[#e5e3dc] bg-white px-6 py-3.5">
          <div className="font-mono text-[10px] text-[#999b94]">
            Showing <strong>{filteredMovements.length}</strong> recorded movements
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] bg-[#11130f] px-5 py-2 font-mono text-[11px] text-white transition hover:bg-[#292c27]"
          >
            Close History
          </button>
        </div>
      </div>
    </>
  );
}
