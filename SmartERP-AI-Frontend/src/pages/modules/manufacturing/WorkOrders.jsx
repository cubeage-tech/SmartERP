import React from "react";

const workOrders = [
  {
    id: "WO-2026-0092",
    status: "IN PROGRESS",
    statusType: "progress",
    title: "Steel Frame Assembly A",
    details: [
      ["Qty", "50 pcs"],
      ["BOM", "BOM-042"],
      ["Machine", "CNC-01"],
      ["Operator", "Ramu Yadav"],
      ["Due", "10 Aug 2026"],
    ],
    progress: 72,
  },
  {
    id: "WO-2026-0091",
    status: "IN PROGRESS",
    statusType: "progress",
    title: "Zinc Cast Housing B",
    details: [
      ["Qty", "30 pcs"],
      ["BOM", "BOM-038"],
      ["Machine", "CNC-02"],
      ["Operator", "Suresh Babu"],
      ["Due", "12 Aug 2026"],
    ],
    progress: 20,
  },
  {
    id: "WO-2026-0090",
    status: "COMPLETED",
    statusType: "completed",
    title: "Bracket Kit M8",
    details: [
      ["Qty", "200 pcs"],
      ["BOM", "BOM-041"],
      ["Machine", "Press-01"],
      ["Operator", "Dinesh Patil"],
      ["Due", "08 Aug 2026"],
    ],
    progress: 100,
  },
  {
    id: "WO-2026-0089",
    status: "PENDING",
    statusType: "pending",
    title: "Hydraulic Manifold C",
    details: [
      ["Qty", "10 pcs"],
      ["BOM", "BOM-035"],
      ["Machine", "CNC-03"],
      ["Operator", "-"],
      ["Due", "15 Aug 2026"],
    ],
    progress: 0,
  },
  {
    id: "WO-2026-0088",
    status: "ON HOLD",
    statusType: "hold",
    title: "Drive Shaft Assembly",
    details: [
      ["Qty", "25 pcs"],
      ["BOM", "BOM-039"],
      ["Machine", "Lathe-01"],
      ["Operator", "Ramu Yadav"],
      ["Due", "09 Aug 2026"],
    ],
    progress: 0,
  },
];

function StatusBadge({ status, type }) {
  const styles = {
    progress: "bg-[#eeedf3] text-[#5b5870]",
    completed: "bg-[#dfe8dc] text-[#3f513c]",
    pending: "bg-[#eeedf3] text-[#5b5870]",
    hold: "bg-[#eee9dc] text-[#635d49]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-[10px] px-2.5 py-[6px] font-mono text-[9px] leading-none tracking-[0.06em] transition-all duration-200 sm:px-3 sm:text-[10px] ${styles[type]}`}
    >
      {status}
    </span>
  );
}

function WorkOrderCard({ order }) {
  const hasProgress = order.progress > 0;

  return (
    <article className="group rounded-[18px] border border-[#e4e2dd] bg-white px-4 py-4 transition-all duration-200 hover:border-[#d8d5ce] hover:shadow-[0_3px_12px_rgba(0,0,0,0.035)] sm:rounded-[20px] sm:px-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        {/* Left Content */}
        <div className="min-w-0 flex-1">
          {/* ID + Status */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-mono text-[10px] leading-none tracking-[0.03em] text-[#a0a09a] sm:text-[11px]">
              {order.id}
            </span>

            <StatusBadge
              status={order.status}
              type={order.statusType}
            />
          </div>

          {/* Title */}
          <h2 className="mt-1 font-serif text-[20px] leading-[1.1] tracking-[-0.02em] text-[#171815] sm:mt-0.5 sm:text-[22px]">
            {order.title}
          </h2>

          {/* Details */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mt-0.5 sm:gap-x-[21px] sm:gap-y-[5px]">
            {order.details.map(([label, value]) => (
              <div
                key={label}
                className="whitespace-nowrap font-mono text-[10px] leading-[1.2] text-[#555750] sm:text-[11px]"
              >
                <span className="text-[#969791]">{label}:</span>{" "}
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Progress */}
        <div className="flex w-full items-end justify-between sm:w-[72px] sm:shrink-0 sm:flex-col sm:items-end sm:pt-[1px] sm:text-right">
          <div className="font-serif text-[28px] leading-none tracking-[-0.04em] text-[#151714] sm:text-[31px]">
            {order.progress}%
          </div>

          <div className="font-mono text-[8px] leading-none tracking-[0.08em] text-[#aaa9a4] sm:mt-[7px] sm:text-[9px]">
            COMPLETE
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-[9px] w-full overflow-hidden rounded-full bg-[#f0efeb] sm:mt-[17px] sm:h-[10px]">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            hasProgress ? "bg-[#a9bf9c]" : "w-0"
          }`}
          style={{ width: `${order.progress}%` }}
        />
      </div>
    </article>
  );
}

const WorkOrders = () => {
  return (
    <main className="min-h-screen bg-[#f7f6f2] px-4 py-4 text-[#171815] sm:px-6 sm:py-[18px] lg:px-[30px]">
      {/* Work Orders */}
      <section className="space-y-3 sm:space-y-[15px]">
        {workOrders.map((order) => (
          <WorkOrderCard
            key={order.id}
            order={order}
          />
        ))}
      </section>
    </main>
  );
};

export default WorkOrders;