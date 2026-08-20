import React from "react";

const rejectionData = [
  {
    product: "Drive Shaft Assembly",
    id: "WO-2026-0088",
    reason: "Dimensional deviation",
    quantity: "2 pcs",
  },
  {
    product: "Bracket Kit M8",
    id: "WO-2026-0086",
    reason: "Surface finish",
    quantity: "5 pcs",
  },
  {
    product: "Steel Frame Assembly",
    id: "WO-2026-0084",
    reason: "Weld crack detected",
    quantity: "1 pcs",
  },
];

const qualityData = [
  {
    label: "Pass Rate",
    value: "98.2%",
    percentage: 98.2,
    color: "bg-[#a5ba98]",
  },
  {
    label: "Rework Rate",
    value: "1.4%",
    percentage: 14,
    color: "bg-[#b2a477]",
  },
  {
    label: "Rejection Rate",
    value: "0.4%",
    percentage: 4,
    color: "bg-[#c19e97]",
  },
];

function QualityOverview() {
  return (
    <section className="rounded-[18px] border border-[#e4e2dd] bg-white px-4 py-5 transition-all duration-200 hover:border-[#dcd9d2] hover:shadow-[0_3px_12px_rgba(0,0,0,0.025)] sm:rounded-[20px] sm:px-6 sm:py-[18px]">
      <h2 className="font-serif font-bold text-[17px] leading-none tracking-[-0.012em] text-[#171815] sm:text-[18px]">
        Quality Overview
      </h2>

      <div className="mt-[20px] space-y-[14px] sm:space-y-[12px]">
        {qualityData.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[10px] leading-none text-[#777871] sm:text-[11px]">
                {item.label}
              </span>

              <span className="font-serif text-[17px] leading-none text-[#171815] sm:text-[18px]">
                {item.value}
              </span>
            </div>

            <div className="mt-[12px] h-[9px] overflow-hidden rounded-full bg-[#f0efeb] sm:mt-[14px] sm:h-[10px]">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${item.color}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentRejections() {
  return (
    <section className="rounded-[18px] border border-[#e4e2dd] bg-white px-4 py-5 transition-all duration-200 hover:border-[#dcd9d2] hover:shadow-[0_3px_12px_rgba(0,0,0,0.025)] sm:rounded-[20px] sm:px-6 sm:py-[18px]">
      <h2 className="font-serif font-bold text-[17px] leading-none tracking-[-0.012em] text-[#171815] sm:text-[18px]">
        Recent Rejections
      </h2>

      <div className="mt-[10px] sm:mt-[12px]">
        {rejectionData.map((item, index) => (
          <div
            key={item.id}
            className={`
              group flex items-center justify-between gap-4 py-[15px]
              transition-all duration-200
              sm:gap-6 sm:py-[17px]
              ${
                index !== rejectionData.length - 1
                  ? "border-b border-[#e4e2dd]"
                  : ""
              }
            `}
          >
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-serif text-[15px] leading-none tracking-[-0.01em] text-[#171815] transition-colors duration-200 group-hover:text-[#4f5f48] sm:text-[16px]">
                {item.product}
              </h3>

              <p className="mt-[7px] truncate font-mono text-[9px] leading-none text-[#999a94] sm:text-[10px]">
                {item.id}
                <span className="mx-[6px] sm:mx-[8px]">·</span>
                {item.reason}
              </p>
            </div>

            <div className="w-[58px] shrink-0 text-right sm:w-[70px]">
              <div className="font-mono text-[11px] leading-none text-[#8d5148] sm:text-[12px]">
                {item.quantity}
              </div>

              <div className="mt-[7px] font-mono text-[8px] leading-none tracking-[0.06em] text-[#aaa9a4] sm:text-[9px]">
                Rejected
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const QualityControl = () => {
  return (
    <main className="bg-[#f7f6f2] px-4 py-4 text-[#171815] sm:px-6 sm:py-[18px] lg:px-[30px]">
      {/* Quality Content */}
      <section className="grid grid-cols-1 gap-4 sm:gap-[20px] xl:grid-cols-2">
        <QualityOverview />
        <RecentRejections />
      </section>
    </main>
  );
};

export default QualityControl;