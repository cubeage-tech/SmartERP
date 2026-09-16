import React, { useCallback, useEffect, useState } from "react";
import {
  Bot,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import InventoryService from "../../../core/services/modules/inventory.service";

/* ================================================================
   ReplenishmentRecommendationResponse backend fields:
     itemId, sku, name, category, warehouseCode, warehouseName,
     currentQuantity, minimumLevel, suggestedQuantity, unit,
     costPrice, estimatedCost, status, urgency, supplier
================================================================ */

function formatCurrency(value) {
  const num = Number(value ?? 0);
  if (isNaN(num)) return "₹0";
  return "₹" + num.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function safeNum(value) {
  const n = Number(value ?? 0);
  return isNaN(n) ? 0 : n;
}

export default function Replenishment() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [createdOrders, setCreatedOrders]     = useState([]);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await InventoryService.getReplenishment();
      setRecommendations(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setError("Failed to load replenishment recommendations. Please try again.");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleCreatePO = (item) => {
    setCreatedOrders((prev) => {
      const key = item.itemId ?? item.sku;
      if (prev.includes(key)) return prev;
      return [...prev, key];
    });
  };

  return (
    <section className="w-full space-y-4">

      {/* =====================================================
          AI REORDER HEADER
      ====================================================== */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          rounded-2xl
          bg-[#151815]
          px-5
          py-5
        "
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#30352d]
              text-[#d8e4d2]
            "
          >
            <Bot size={19} strokeWidth={1.7} />
          </div>

          <div className="min-w-0">
            <h2 className="font-serif text-[17px] leading-none text-white">
              AI Reorder Recommendations
            </h2>
            <p className="mt-2 font-mono text-[9px] tracking-[0.02em] text-[#9ca198]">
              {loading
                ? "Analyzing stock levels and consumption trends…"
                : recommendations.length === 0
                ? "All inventory stock levels are healthy. No items require replenishment."
                : `Based on current stock vs minimum safety thresholds, ${recommendations.length} ${
                    recommendations.length === 1 ? "item needs" : "items need"
                  } reorder attention.`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchRecommendations}
          disabled={loading}
          className="
            inline-flex
            h-8
            items-center
            gap-1.5
            rounded-lg
            border
            border-[#363b32]
            bg-[#20251f]
            px-3
            font-mono
            text-[9px]
            text-[#c0c7bc]
            transition
            hover:bg-[#2c332b]
            disabled:opacity-50
          "
        >
          <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* =====================================================
          CONTENT (LOADING / ERROR / EMPTY / LIST)
      ====================================================== */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="font-mono text-[10px] text-[#999b94]">
            Evaluating stock levels…
          </span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16">
          <span className="font-mono text-[10px] text-[#b05a52]">{error}</span>
          <button
            type="button"
            onClick={fetchRecommendations}
            className="
              mt-1 rounded-lg border border-[#e0ded6] bg-[#fbfaf7] px-4 py-2
              font-mono text-[9px] text-[#666a63] transition hover:bg-[#f0efe9]
            "
          >
            Retry
          </button>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="rounded-2xl border border-[#e2e0d8] bg-[#fbfaf7] px-6 py-14 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f0e5] text-[#3d5940]">
            <CheckCircle2 size={20} />
          </div>
          <h3 className="mt-3 font-serif text-[18px] text-[#20221f]">
            Stock Levels Healthy
          </h3>
          <p className="mt-1 font-mono text-[10px] text-[#9a9d95]">
            No items are below minimum stock thresholds.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((item) => {
            const itemKey = item.itemId ?? item.sku;
            const orderCreated = createdOrders.includes(itemKey);
            const isCritical = item.urgency === "CRITICAL" || item.status === "OUT OF STOCK";

            return (
              <div
                key={itemKey}
                className="
                  rounded-2xl
                  border
                  border-[#e2e0d8]
                  bg-[#fbfaf7]
                  px-4
                  py-4
                  transition
                  hover:border-[#d4d1c8]
                "
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  {/* LEFT SIDE: ITEM INFO */}
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="shrink-0 pt-1">
                      <span
                        className={`
                          inline-flex
                          rounded-md
                          px-2
                          py-1
                          font-mono
                          text-[8px]
                          tracking-[0.08em]
                          ${
                            isCritical
                              ? "bg-[#f0e6e3] text-[#8c6257]"
                              : "bg-[#eeece4] text-[#817456]"
                          }
                        `}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-[16px] leading-tight text-[#20221f]">
                          {item.name}
                        </h3>
                        <span className="font-mono text-[9px] text-[#9a9c95]">
                          ({item.sku})
                        </span>
                      </div>

                      <p className="mt-1 font-mono text-[8px] text-[#9a9d95]">
                        Warehouse: {item.warehouseCode} - {item.warehouseName} ·
                        Current: {safeNum(item.currentQuantity)} {item.unit} ·
                        Min Safety: {safeNum(item.minimumLevel)} {item.unit} ·
                        Unit Cost: {formatCurrency(item.costPrice)}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SIDE: REORDER & ACTION */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <div className="min-w-[150px] text-left sm:text-right">
                      <p className="font-mono text-[9px] font-medium text-[#20221f]">
                        Suggest: {safeNum(item.suggestedQuantity)} {item.unit}
                      </p>
                      <p className="mt-0.5 font-mono text-[8px] text-[#9a9d95]">
                        Est. Cost: {formatCurrency(item.estimatedCost)}
                      </p>
                      <p className="mt-0.5 font-mono text-[7px] text-[#aaaBA5]">
                        {item.supplier}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={orderCreated}
                      onClick={() => handleCreatePO(item)}
                      className={`
                        flex
                        h-9
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        px-4
                        font-mono
                        text-[9px]
                        transition
                        ${
                          orderCreated
                            ? "cursor-default bg-[#e5e9e2] text-[#697064]"
                            : "bg-[#151815] text-white hover:bg-[#292d28]"
                        }
                      `}
                    >
                      {orderCreated ? (
                        <>
                          <CheckCircle2 size={13} />
                          PO CREATED
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={13} />
                          Create PO →
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}

          {/* FOOTER METRICS */}
          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-[#e2e0d8]
              bg-[#f7f6f1]
              px-4
              py-3
            "
          >
            <p className="font-mono text-[8px] text-[#999c94]">
              {createdOrders.length} of {recommendations.length} purchase orders created
            </p>

            {createdOrders.length > 0 && (
              <p className="flex items-center gap-1.5 font-mono text-[8px] text-[#697064]">
                <CheckCircle2 size={12} />
                Purchase orders ready for procurement
              </p>
            )}
          </div>
        </div>
      )}

    </section>
  );
}