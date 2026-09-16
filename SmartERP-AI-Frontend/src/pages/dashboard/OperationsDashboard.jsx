import React, { useEffect, useMemo, useState } from "react";
import RoleDashboardService from "../../core/services/modules/roleDashboard.service";
import {
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

/* =========================================================
   OPERATIONS DASHBOARD DATA
========================================================= */

const fallbackStats = [
  {
    label: "TOTAL SKUS",
    value: "—",
    footer: "Loading inventory data",
  },
  {
    label: "PRODUCTION OEE",
    value: "—",
    footer: "Loading manufacturing data",
  },
  {
    label: "ACTIVE WORK ORDERS",
    value: "—",
    footer: "Loading manufacturing data",
  },
  {
    label: "MACHINES DOWN",
    value: "—",
    footer: "Loading manufacturing data",
    warning: true,
  },
  {
    label: "LOW STOCK SKUS",
    value: "—",
    footer: "Loading inventory data",
    warning: true,
  },
  {
    label: "PENDING GRNS",
    value: "—",
    footer: "Loading purchase data",
    warning: true,
  },
];

/* =========================================================
   KPI CARD
========================================================= */

function StatCard({
  label,
  value,
  footer,
  warning,
}) {
  return (
    <div
      className="
        group
        rounded-[18px]
        border
        border-[#e3e0d9]
        bg-white
        px-5
        py-5
        transition-all
        duration-200
        ease-out
        hover:-translate-y-[2px]
        hover:border-[#d4d1c8]
        hover:bg-[#fbfbf8]
        hover:shadow-[0_8px_22px_rgba(20,24,20,0.05)]
      "
    >
      <p
        className="
          font-sans
          text-[9px]
          font-medium
          uppercase
          tracking-[0.14em]
          text-[#9ba19b]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          truncate
          font-serif
          text-[28px]
          leading-none
          text-[#11130f]
        "
      >
        {value}
      </p>

      <p
        className={`
          mt-5
          font-sans
          text-[10px]
          ${
            warning
              ? "text-[#a76a62]"
              : "text-[#69716b]"
          }
        `}
      >
        {footer}
      </p>
    </div>
  );
}

/* =========================================================
   TOTAL STOCK UNITS CHART
========================================================= */

function StockOverview({ warehouseStock = [], totalStockUnits = 0 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data = useMemo(
    () =>
      Array.isArray(warehouseStock)
        ? warehouseStock.map((item) => ({
            label: item.warehouseName || "Unassigned warehouse",
            value: Number(item.quantity) || 0,
          }))
        : [],
    [warehouseStock]
  );

  if (data.length === 0) {
    return (
      <section className="rounded-[20px] border border-[#e3e0d9] bg-white px-6 py-6">
        <p className="font-sans text-[9px] font-medium uppercase tracking-[0.15em] text-[#9ba19b]">
          Stock Units by Warehouse
        </p>

        <p className="mt-4 font-sans text-[13px] text-[#8d938d]">
          No inventory records are available yet.
        </p>
      </section>
    );
  }

  const chartWidth = 1000;
  const chartHeight = 250;
  const leftPadding = 5;
  const rightPadding = 5;
  const topPadding = 28;
  const bottomPadding = 12;

  const values = data.map((item) => item.value);
  const lowestValue = Math.min(...values);
  const highestValue = Math.max(...values);
  const rangePadding = Math.max(1, (highestValue - lowestValue) * 0.2);

  const minValue = Math.max(0, lowestValue - rangePadding);
  const maxValue =
    highestValue === lowestValue
      ? highestValue + 1
      : highestValue + rangePadding;

  const xStep =
    data.length > 1
      ? (chartWidth - leftPadding - rightPadding) / (data.length - 1)
      : 0;

  const getX = (index) => leftPadding + index * xStep;

  const getY = (value) =>
    chartHeight -
    bottomPadding -
    ((value - minValue) / (maxValue - minValue)) *
      (chartHeight - topPadding - bottomPadding);

  const points = data.map((item, index) => ({
    ...item,
    x: getX(index),
    y: getY(item.value),
  }));

  const buildSmoothPath = (items) => {
    if (!items.length) return "";

    let path = `M ${items[0].x} ${items[0].y}`;

    for (let index = 1; index < items.length; index += 1) {
      const previous = items[index - 1];
      const current = items[index];

      path += `
        C
        ${previous.x + (current.x - previous.x) / 2} ${previous.y},
        ${current.x - (current.x - previous.x) / 2} ${current.y},
        ${current.x} ${current.y}
      `;
    }

    return path;
  };

  const linePath = buildSmoothPath(points);

  const areaPath = `${linePath}
    L ${points[points.length - 1].x} ${chartHeight}
    L ${points[0].x} ${chartHeight}
    Z`;

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const localX =
      ((event.clientX - rect.left) / rect.width) * chartWidth;

    let nearestIndex = 0;
    let nearestDistance = Infinity;

    points.forEach((point, index) => {
      const distance = Math.abs(point.x - localX);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setHoveredIndex(nearestIndex);
  };

  const hoveredPoint =
    hoveredIndex === null ? null : points[hoveredIndex];

  return (
    <section className="overflow-hidden rounded-[20px] border border-[#e3e0d9] bg-white px-6 pt-6 pb-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-sans text-[9px] font-medium uppercase tracking-[0.15em] text-[#9ba19b]">
            Stock Units by Warehouse
          </p>

          <div className="mt-2 flex items-center gap-1">
            <span className="font-serif text-[20px] text-[#11130f]">
              {Number(totalStockUnits || 0).toLocaleString("en-IN")} units
            </span>
          </div>
        </div>

        <span className="font-sans text-[10px] text-[#8d938d]">
          {data.length} warehouse{data.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="relative mt-7 h-[245px] w-full">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient
              id="operationsStockFade"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#a9a4bc" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#a9a4bc" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d={areaPath} fill="url(#operationsStockFade)" />

          <path
            d={linePath}
            fill="none"
            stroke="#aaa6bb"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => (
            <circle
              key={point.label}
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === index ? 6 : 4}
              fill="#aaa6bb"
              stroke="#ffffff"
              strokeWidth="2"
            />
          ))}

          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1={15}
              x2={hoveredPoint.x}
              y2={220}
              stroke="#c6c3cc"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          )}
        </svg>

        {hoveredPoint && (
          <div
            className="pointer-events-none absolute z-10 rounded-[14px] bg-[#111411] px-3 py-3 shadow-[0_8px_20px_rgba(20,24,20,0.17)]"
            style={{
              left: `${Math.min(
                Math.max((hoveredPoint.x / chartWidth) * 100, 6),
                84
              )}%`,
              top: "22%",
              transform: "translateX(-20%)",
            }}
          >
            <p className="font-sans text-[10px] text-white">
              {hoveredPoint.label}
            </p>

            <p className="mt-1 font-sans text-[10px] text-[#b8b5c6]">
              {hoveredPoint.value.toLocaleString("en-IN")} units
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   AI INSIGHTS
========================================================= */

function AIInsights({ items = [] }) {
  return (
    <section
      className="
        flex
        min-h-[350px]
        flex-col
        rounded-[20px]
        bg-[#141713]
        px-6
        py-6
        text-white
      "
    >
      {/* HEADER */}

      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-[30px]
            w-[30px]
            items-center
            justify-center
            rounded-[9px]
            border
            border-[#4d5848]
            bg-[#20271d]
          "
        >
          <Sparkles
            size={13}
            strokeWidth={1.7}
            className="text-[#a7b692]"
          />
        </div>

        <p
          className="
            font-sans
            text-[10px]
            font-medium
            uppercase
            tracking-[0.15em]
            text-[#aab99b]
          "
        >
          Operations Insights
        </p>
      </div>

      {/* INSIGHTS */}

      <div className="mt-5 space-y-3">
        {items.map(
          (item, index) => (
            <div
              key={index}
              className="
                group
                flex
                gap-3
                rounded-[15px]
                border
                border-[#2d322c]
                bg-[#1d211c]
                px-4
                py-4
                transition-all
                duration-200
                hover:-translate-y-[1px]
                hover:border-[#3e463a]
                hover:bg-[#242922]
              "
            >
              <span
                className="
                  mt-[6px]
                  h-[5px]
                  w-[5px]
                  shrink-0
                  rounded-full
                  bg-[#66755b]
                  transition-transform
                  duration-200
                  group-hover:scale-125
                "
              />

              <p
                className="
                  font-sans
                  text-[10px]
                  leading-[1.6]
                  text-[#8f9690]
                  transition-colors
                  duration-200
                  group-hover:text-[#b0b5ae]
                "
              >
                {item}
              </p>
            </div>
          )
        )}
      </div>

      {/* FOOTER */}

      <div
        className="
          mt-auto
          border-t
          border-[#282c27]
          pt-5
        "
      >
        <button
          type="button"
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            font-sans
            text-[10px]
            font-medium
            uppercase
            tracking-[0.12em]
            text-[#718066]
            transition-colors
            duration-200
            hover:text-[#a2b296]
          "
        >
          Open AI Assistant

          <ArrowUpRight
            size={12}
            strokeWidth={1.7}
          />
        </button>
      </div>
    </section>
  );
}

/* =========================================================
  OPERATIONAL ALERTS
========================================================= */

function OperationalAlerts({ items = [] }) {
  return (
    <section className="overflow-hidden rounded-[20px] border border-[#e3e0d9] bg-white">
      <div className="flex items-center justify-between border-b border-[#e5e2db] px-7 py-6">
        <h2 className="font-serif text-[22px] leading-none text-[#161815]">
          Operational Alerts
        </h2>

        <span className="rounded-[10px] bg-[#f2e9e5] px-3 py-2 font-sans text-[9px] font-medium text-[#996d62]">
          {items.length} active
        </span>
      </div>

      {items.length === 0 ? (
        <p className="px-7 py-8 font-sans text-[13px] text-[#8d938d]">
          No operational alerts require attention.
        </p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className="flex min-h-[92px] items-center gap-5 border-b border-[#e6e3dc] px-7 last:border-b-0"
          >
            <span
              className={
                item.warning
                  ? "h-[11px] w-[11px] shrink-0 rounded-full bg-[#a66a60]"
                  : "h-[11px] w-[11px] shrink-0 rounded-full bg-[#b1a16d]"
              }
            />

            <div className="min-w-0">
              <p className="font-sans text-[13px] text-[#252824]">
                {item.title}
              </p>

              <p className="mt-2 font-sans text-[11px] text-[#8d938d]">
                {item.description}
              </p>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

/* =========================================================
   OPERATIONS DASHBOARD
========================================================= */

export default function OperationsDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setDashboardError("");

        const [inventoryResponse, manufacturingResponse, purchaseResponse] =
          await Promise.all([
            RoleDashboardService.getInventoryDashboard(),
            RoleDashboardService.getManufacturingDashboard(),
            RoleDashboardService.getPurchaseDashboard(),
          ]);

        setDashboardData({
          inventory: inventoryResponse.data,
          manufacturing: manufacturingResponse.data,
          purchase: purchaseResponse.data,
        });
      } catch (error) {
        console.error("Operations dashboard API error:", error);

        setDashboardError(
          error?.response?.data?.message ||
            "Unable to load the Operations dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const inventory = dashboardData?.inventory;
  const manufacturingStats = dashboardData?.manufacturing?.stats || [];
  const purchase = dashboardData?.purchase;

  const manufacturingValue = (label, fallback = "—") =>
    manufacturingStats.find((item) => item.label === label)?.value || fallback;

  const manufacturingFooter = (label, fallback = "") =>
    manufacturingStats.find((item) => item.label === label)?.description || fallback;

  const machineDownCount = Number(manufacturingValue("MACHINE DOWN", "0"));

  const stats = dashboardData
    ? [
        {
          label: "TOTAL SKUS",
          value: Number(inventory?.totalSkus || 0).toLocaleString("en-IN"),
          footer: `${Number(inventory?.warehouseCount || 0)} active warehouse(s)`,
        },
        {
          label: "PRODUCTION OEE",
          value: manufacturingValue("OEE"),
          footer: manufacturingFooter("OEE"),
        },
        {
          label: "ACTIVE WORK ORDERS",
          value: manufacturingValue("ACTIVE WOS", "0"),
          footer: manufacturingFooter("ACTIVE WOS"),
        },
        {
          label: "MACHINES DOWN",
          value: machineDownCount.toLocaleString("en-IN"),
          footer: manufacturingFooter("MACHINE DOWN"),
          warning: machineDownCount > 0,
        },
        {
          label: "LOW STOCK SKUS",
          value: Number(inventory?.lowStockItems || 0).toLocaleString("en-IN"),
          footer: `${Number(inventory?.outOfStockItems || 0)} out of stock`,
          warning: Number(inventory?.lowStockItems || 0) > 0,
        },
        {
          label: "PENDING GRNS",
          value: Number(purchase?.pendingGoodsReceiptCount || 0).toLocaleString("en-IN"),
          footer: "Goods receipts awaiting processing",
          warning: Number(purchase?.pendingGoodsReceiptCount || 0) > 0,
        },
      ]
    : fallbackStats;

  const operationInsights = dashboardData
    ? [
        Number(inventory?.lowStockItems || 0) > 0
          ? `${inventory.lowStockItems} SKU(s) are below their minimum stock level.`
          : "No SKU is currently below its minimum stock level.",
        Number(inventory?.outOfStockItems || 0) > 0
          ? `${inventory.outOfStockItems} SKU(s) are out of stock.`
          : "There are no out-of-stock SKUs.",
        machineDownCount > 0
          ? `${machineDownCount} machine(s) are in maintenance or down status.`
          : "All tracked machines are operational.",
        Number(purchase?.pendingGoodsReceiptCount || 0) > 0
          ? `${purchase.pendingGoodsReceiptCount} goods receipt(s) are pending.`
          : "There are no pending goods receipts.",
      ]
    : [];

  const operationalAlerts = dashboardData
    ? [
        ...(Number(inventory?.lowStockItems || 0) > 0
          ? [{
              id: "LOW_STOCK",
              title: "Low stock SKUs need replenishment",
              description: `${inventory.lowStockItems} SKU(s) are below their minimum stock level.`,
              warning: true,
            }]
          : []),
        ...(Number(inventory?.outOfStockItems || 0) > 0
          ? [{
              id: "OUT_OF_STOCK",
              title: "Out-of-stock inventory requires attention",
              description: `${inventory.outOfStockItems} SKU(s) currently have zero available quantity.`,
              warning: true,
            }]
          : []),
        ...(machineDownCount > 0
          ? [{
              id: "MACHINE_DOWN",
              title: "Machine maintenance or downtime detected",
              description: manufacturingFooter("MACHINE DOWN"),
              warning: true,
            }]
          : []),
        ...(Number(purchase?.pendingGoodsReceiptCount || 0) > 0
          ? [{
              id: "PENDING_GRN",
              title: "Goods receipts are waiting for processing",
              description: `${purchase.pendingGoodsReceiptCount} GRN(s) remain pending.`,
              warning: false,
            }]
          : []),
      ]
    : [];

  return (
    <main
      className="
        w-full
        min-h-full
        bg-[#f7f7f3]
        px-6
        py-8
        sm:px-7
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1540px]
        "
      >

                {dashboardError && (
          <div className="mb-6 rounded-[14px] border border-[#e6c9c2] bg-[#fbf1ef] px-4 py-3 font-sans text-[12px] text-[#9b5e52]">
            {dashboardError}
          </div>
        )}

        {loading && (
          <div className="mb-6 rounded-[14px] border border-[#e3e0d9] bg-white px-4 py-3 font-sans text-[12px] text-[#727870]">
            Loading Operations dashboard…
          </div>
        )}

        {/* =================================================
            HEADER
        ================================================== */}

        <section
          className="
            flex
            flex-col
            justify-between
            gap-6
            lg:flex-row
            lg:items-start
          "
        >
          {/* LEFT */}

          <div>
            <p
              className="
                font-sans
                text-[10px]
                font-medium
                uppercase
                tracking-[0.12em]
                text-[#9ba09b]
              "
            >
              Good Afternoon,
            </p>

            <h1
              className="
                mt-2
                font-serif
                text-[36px]
                leading-none
                tracking-[-0.02em]
                text-[#11130f]
              "
            >
              Vikram Joshi
            </h1>

            <p
              className="
                mt-3
                font-sans
                text-[11px]
                text-[#8d938d]
              "
            >
              Operations Dashboard

              <span className="mx-2">
                ·
              </span>

              Acme Manufacturing Ltd
            </p>
          </div>

          {/* ACTIONS */}

          <div
            className="
              relative
              flex
              items-center
              gap-3
            "
          >
            <button
              type="button"
              className="
                flex
                h-[43px]
                items-center
                gap-2
                rounded-[14px]
                border
                border-[#d7dfd1]
                bg-[#eaf0e5]
                px-4
                font-sans
                text-[10px]
                font-medium
                uppercase
                tracking-[0.08em]
                text-[#64705d]
                transition-all
                duration-200
                hover:border-[#c4cfbe]
                hover:bg-[#e0e9da]
              "
            >
              <span
                className="
                  h-[8px]
                  w-[8px]
                  rounded-full
                  bg-[#b7c8aa]
                "
              />

              AI Active
            </button>

          </div>
        </section>

        {/* =================================================
            KPI CARDS
        ================================================== */}

        <section
          className="
            mt-9
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-6
          "
        >
          {stats.map(
            (stat) => (
              <StatCard
                key={stat.label}
                {...stat}
              />
            )
          )}
        </section>

        {/* =================================================
            STOCK OVERVIEW + AI
        ================================================== */}

        <section
          className="
            mt-6
            grid
            grid-cols-1
            gap-5
            xl:grid-cols-[minmax(0,2.15fr)_minmax(340px,0.9fr)]
          "
        >
          <StockOverview
  warehouseStock={inventory?.warehouseStock || []}
  totalStockUnits={inventory?.totalStockUnits || 0}
/>

<AIInsights items={operationInsights} />
        </section>

        {/* =================================================
            APPROVALS
        ================================================== */}

        <section
          className="
            mt-6
            grid
            grid-cols-1
            gap-5
            xl:grid-cols-[minmax(0,2.1fr)_minmax(340px,0.85fr)]
          "
        >
          <OperationalAlerts items={operationalAlerts} />

        </section>
      </div>
    </main>
  );
}