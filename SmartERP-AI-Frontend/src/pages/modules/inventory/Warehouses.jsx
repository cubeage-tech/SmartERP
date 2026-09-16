import React, { useCallback, useEffect, useState } from "react";
import InventoryService from "../../../core/services/modules/inventory.service";

/* ================================================================
   WarehouseResponse backend fields:
     id, code, name, location, area,
     capacityPercent, skuCount, value, active
================================================================ */

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await InventoryService.getWarehouses();
      setWarehouses(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setError("Failed to load warehouses. Please try again.");
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  /* ---- LOADING ---- */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="font-mono text-[10px] text-[#999b94]">Loading warehouses…</span>
      </div>
    );
  }

  /* ---- ERROR ---- */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16">
        <span className="font-mono text-[10px] text-[#b05a52]">{error}</span>
        <button
          type="button"
          onClick={fetchWarehouses}
          className="mt-1 rounded-lg border border-[#e0ded6] bg-[#fbfaf7] px-4 py-2 font-mono text-[9px] text-[#666a63] transition hover:bg-[#f0efe9]"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ---- EMPTY ---- */
  if (warehouses.length === 0) {
    return (
      <div className="py-12 text-center font-mono text-[10px] text-[#999b94]">
        No warehouses found.
      </div>
    );
  }

  /* ---- LIST ---- */
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {warehouses.map((warehouse) => (
          <WarehouseCard
            key={warehouse.id ?? warehouse.code}
            warehouse={warehouse}
          />
        ))}
      </div>
    </div>
  );
}

function WarehouseCard({ warehouse }) {
  const capacity = Number(warehouse.capacityPercent ?? 0);

  return (
    <div
      className="
        min-h-[202px]
        rounded-[15px]
        border
        border-[#e1dfd8]
        bg-[#fbfaf7]
        px-[18px]
        py-[17px]
      "
    >
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <div
            className="
              font-mono
              text-[8px]
              leading-none
              tracking-[0.12em]
              text-[#9a9c95]
            "
          >
            {warehouse.code}
          </div>

          <h3
            className="
              mt-[6px]
              font-serif
              text-[17px]
              leading-none
              text-[#222420]
            "
          >
            {warehouse.name}
          </h3>
        </div>

        <span
          className={`
            mt-[16px]
            rounded-[7px]
            px-[9px]
            py-[5px]
            font-mono
            text-[7px]
            uppercase
            leading-none
            tracking-[0.08em]
            ${warehouse.active
              ? "bg-[#e2ebde] text-[#63755d]"
              : "bg-[#ede9e3] text-[#888078]"
            }
          `}
        >
          {warehouse.active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* LOCATION */}
      {(warehouse.location || warehouse.area) && (
        <div
          className="
            mt-[7px]
            font-mono
            text-[8px]
            leading-none
            text-[#969990]
          "
        >
          {warehouse.location}
          {warehouse.location && warehouse.area && (
            <span className="mx-[5px] text-[#c5c5bf]">·</span>
          )}
          {warehouse.area}
        </div>
      )}

      {/* CAPACITY */}
      <div className="mt-[20px]">
        <div className="flex items-center justify-between">
          <span
            className="
              font-mono
              text-[8px]
              leading-none
              text-[#92958d]
            "
          >
            Capacity used
          </span>

          <span
            className="
              font-mono
              text-[8px]
              leading-none
              text-[#73766e]
            "
          >
            {capacity}%
          </span>
        </div>

        <div
          className="
            mt-[8px]
            h-[6px]
            w-full
            overflow-hidden
            rounded-full
            bg-[#ebeae4]
          "
        >
          <div
            className="h-full rounded-full bg-[#91a985]"
            style={{ width: `${Math.min(capacity, 100)}%` }}
          />
        </div>
      </div>

      {/* BOTTOM STATS */}
      <div className="mt-[15px] grid grid-cols-2 gap-[9px]">
        <div
          className="
            h-[56px]
            rounded-[11px]
            bg-[#f1f0eb]
            px-[11px]
            py-[9px]
          "
        >
          <div
            className="
              font-serif
              text-[18px]
              leading-none
              text-[#242622]
            "
          >
            {warehouse.skuCount ?? 0}
          </div>

          <div
            className="
              mt-[5px]
              font-mono
              text-[7px]
              uppercase
              leading-none
              tracking-[0.08em]
              text-[#999c94]
            "
          >
            SKUs
          </div>
        </div>

        <div
          className="
            h-[56px]
            rounded-[11px]
            bg-[#f1f0eb]
            px-[11px]
            py-[9px]
          "
        >
          <div
            className="
              font-serif
              text-[18px]
              leading-none
              text-[#242622]
              truncate
            "
          >
            {warehouse.value ?? "—"}
          </div>

          <div
            className="
              mt-[5px]
              font-mono
              text-[7px]
              uppercase
              leading-none
              tracking-[0.08em]
              text-[#999c94]
            "
          >
            VALUE
          </div>
        </div>
      </div>
    </div>
  );
}