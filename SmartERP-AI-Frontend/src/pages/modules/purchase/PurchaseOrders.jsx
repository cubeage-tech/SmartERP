import React, { useState } from "react";

const purchaseOrders = [
  {
    id: "PO-2026-0289",
    vendor: "Tata Steel Ltd",
    date: "08 Aug 2026",
    delivery: "15 Aug 2026",
    items: 4,
    value: "₹18,40,000",
    status: "CONFIRMED",
    statusType: "confirmed",
  },
  {
    id: "PO-2026-0288",
    vendor: "Hindustan Zinc",
    date: "06 Aug 2026",
    delivery: "14 Aug 2026",
    items: 2,
    value: "₹9,20,000",
    status: "SENT",
    statusType: "sent",
  },
  {
    id: "PO-2026-0287",
    vendor: "Sigma Components",
    date: "04 Aug 2026",
    delivery: "12 Aug 2026",
    items: 8,
    value: "₹5,60,000",
    status: "IN PROGRESS",
    statusType: "progress",
  },
  {
    id: "PO-2026-0286",
    vendor: "Brindavan Fasteners",
    date: "01 Aug 2026",
    delivery: "09 Aug 2026",
    items: 15,
    value: "₹1,80,000",
    status: "COMPLETED",
    statusType: "completed",
  },
  {
    id: "PO-2026-0285",
    vendor: "Anand Packaging",
    date: "28 Jul 2026",
    delivery: "05 Aug 2026",
    items: 3,
    value: "₹3,40,000",
    status: "CANCELLED",
    statusType: "cancelled",
  },
];

const statusStyles = {
  confirmed: "bg-[#dfe9db] text-[#50614b]",
  sent: "bg-[#eeedf3] text-[#5b5870]",
  progress: "bg-[#eeedf3] text-[#5b5870]",
  completed: "bg-[#dfe9db] text-[#3f513c]",
  cancelled: "bg-[#e7e5df] text-[#77766f] line-through",
};

function StatusBadge({ status, type }) {
  return (
    <span
      className={`inline-flex items-center rounded-[10px] px-3 py-[7px] text-[10px] leading-none font-semibold tracking-[0.06em] transition-all duration-200 ${statusStyles[type]}`}
    >
      {status}
    </span>
  );
}

function PurchaseOrderRow({
  order,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}) {
  const showGRN =
    order.statusType === "confirmed" ||
    order.statusType === "progress";

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        group relative grid
        grid-cols-[140px_200px_140px_140px_110px_125px_1fr]
        items-center
        border-b border-[#e4e2dd]
        px-6
        py-[23px]
        transition-colors
        duration-200
        last:border-b-0
        ${isHovered ? "bg-[#f7f6f2]" : "bg-white"}
      `}
    >
      {/* PO Number */}
      <div className="py-1 font-mono text-xs text-gray-400">
        {order.id}
      </div>

      {/* Vendor */}
      <div className="py-1 text-sm font-semibold text-gray-800">
        {order.vendor}
      </div>

      {/* Date */}
      <div className="py-1 text-sm text-gray-500">
        {order.date}
      </div>

      {/* Expected Delivery */}
      <div className="py-1 text-sm text-gray-500">
        {order.delivery}
      </div>

      {/* Items */}
      <div className="py-1 text-sm text-gray-500">
        {order.items}
      </div>

      {/* Value */}
      <div className="py-1 text-sm font-semibold text-gray-800">
        {order.value}
      </div>

      {/* Status + Actions */}
      <div className="flex items-center justify-between gap-3">
        <StatusBadge
          status={order.status}
          type={order.statusType}
        />

        <div
          className={`
            flex items-center gap-2
            transition-all
            duration-200
            ${
              isHovered
                ? "visible translate-x-0 opacity-100"
                : "invisible translate-x-1 opacity-0"
            }
          `}
        >
          {/* View */}
          <button
            type="button"
            className="shrink-0 rounded-[10px] border border-[#e2e0da] bg-transparent px-[11px] py-[7px] text-[9px] leading-none text-[#96958f] transition-all duration-200 hover:border-[#c9c7c0] hover:bg-white hover:text-[#555650]"
          >
            View
          </button>

          {/* GRN */}
          {showGRN && (
            <button
              type="button"
              className="shrink-0 rounded-[10px] bg-[#151714] px-[11px] py-[7px] text-[9px] leading-none text-white transition-all duration-200 hover:bg-[#292b27] hover:shadow-sm"
            >
              + GRN
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const PurchaseOrders = () => {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <main className="bg-[#f7f6f2] px-4 py-4 text-[#171815] sm:px-6 sm:py-[18px] lg:px-[30px]">
      <section className="overflow-hidden rounded-[18px] border border-[#e4e2dd] bg-white sm:rounded-[20px]">
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">

            {/* Table Header */}
            <div className="grid grid-cols-[140px_200px_140px_140px_110px_125px_1fr] border-b border-[#e4e2dd] bg-[#f5f4f0] px-6 py-[4px]">
              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                PO #
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                VENDOR
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                DATE
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                EXPECTED DELIVERY
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                ITEMS
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                VALUE
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                STATUS
              </div>
            </div>

            {/* Rows */}
            <div>
              {purchaseOrders.map((order, index) => (
                <PurchaseOrderRow
                  key={order.id}
                  order={order}
                  isHovered={hoveredRow === index}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                />
              ))}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default PurchaseOrders;