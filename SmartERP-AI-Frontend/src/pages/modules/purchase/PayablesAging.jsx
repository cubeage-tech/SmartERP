import React from "react";

const payableData = [
  {
    vendor: "Tata Steel Ltd",
    location: "Mumbai",
    category: "Raw Materials",
    amount: "₹18.2L",
  },
  {
    vendor: "Hindustan Zinc",
    location: "Udaipur",
    category: "Raw Materials",
    amount: "₹17.7L",
  },
  {
    vendor: "Sigma Components",
    location: "Pune",
    category: "Components",
    amount: "₹9.6L",
  },
  {
    vendor: "Brindavan Fasteners",
    location: "Coimbatore",
    category: "Hardware",
    amount: "₹18.6L",
  },
];

const summary = [
  {
    value: "₹1.2 Cr",
    label: "TOTAL PAYABLES",
    type: "normal",
  },
  {
    value: "₹38 L",
    label: "DUE THIS WEEK",
    type: "warning",
  },
  {
    value: "₹14 L",
    label: "OVERDUE",
    type: "danger",
  },
];

function SummaryCard({ value, label, type }) {
  const valueColor =
    type === "warning"
      ? "text-[#8b7a4d]"
      : type === "danger"
      ? "text-[#8d5148]"
      : "text-[#171815]";

  return (
    <div
      className="
        rounded-[18px]
        border border-[#e4e2dd]
        bg-white
        px-5
        py-4
        transition-all
        duration-200
        hover:border-[#d8d5ce]
        hover:shadow-[0_3px_12px_rgba(0,0,0,0.025)]
        sm:rounded-[20px]
        sm:px-6
        sm:py-[17px]
      "
    >
      <div
        className={`
          font-serif
          text-[28px]
          leading-none
          tracking-[-0.03em]
          sm:text-[30px]
          ${valueColor}
        `}
      >
        {value}
      </div>

      <div className="mt-[8px] text-[9px] font-semibold leading-none tracking-[0.14em] text-[#a0a09a]">
        {label}
      </div>
    </div>
  );
}

function PayableCard({ item }) {
  return (
    <article
      className="
        group
        flex
        min-h-[90px]
        items-center
        justify-between
        gap-6
        rounded-[18px]
        border
        border-[#e4e2dd]
        bg-white
        px-5
        py-4
        transition-all
        duration-200
        hover:border-[#d8d5ce]
        hover:shadow-[0_3px_12px_rgba(0,0,0,0.035)]
        sm:rounded-[20px]
        sm:px-6
        sm:py-[16px]
      "
    >
      {/* Vendor */}
      <div className="min-w-0">
        <h2 className="font-serif text-[18px] leading-none tracking-[-0.015em] text-[#171815] sm:text-[19px]">
          {item.vendor}
        </h2>

        <p className="mt-[7px] text-[10px] leading-none text-[#999a94] sm:text-[11px]">
          {item.location}
          <span className="mx-[8px]">·</span>
          {item.category}
        </p>
      </div>

      {/* Amount + Due + Button */}
      <div className="flex shrink-0 items-center gap-4 sm:gap-5">
        <div className="text-right">
          <div className="text-[12px] font-semibold leading-none text-[#171815] sm:text-[13px]">
            {item.amount}
          </div>

          <div className="mt-[6px] text-[9px] leading-none text-[#aaa9a4] sm:text-[10px]">
            Due: 15 Aug 2026
          </div>
        </div>

        <button
          type="button"
          className="
            rounded-[13px]
            border
            border-[#d6dfd1]
            bg-[#e9eee5]
            px-[15px]
            py-[10px]
            text-[11px]
            font-semibold
            leading-none
            text-[#52614c]
            transition-all
            duration-200
            hover:border-[#c4d0bd]
            hover:bg-[#dfe8db]
            hover:shadow-sm
          "
        >
          Pay Now
        </button>
      </div>
    </article>
  );
}

const PayablesAging = () => {
  return (
    <main className="bg-[#f7f6f2] px-4 py-4 text-[#171815] sm:px-6 sm:py-[18px] lg:px-[30px]">
      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {summary.map((item) => (
          <SummaryCard
            key={item.label}
            value={item.value}
            label={item.label}
            type={item.type}
          />
        ))}
      </section>

      {/* Payables */}
      <section className="mt-4 space-y-3 sm:mt-4">
        {payableData.map((item) => (
          <PayableCard key={item.vendor} item={item} />
        ))}
      </section>
    </main>
  );
};

export default PayablesAging;