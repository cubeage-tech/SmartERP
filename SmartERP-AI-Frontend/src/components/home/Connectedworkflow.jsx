import React from "react";

const ConnectedWorkflows = () => {
  const workflows = [
    {
      number: "01",
      title: "REVENUE CYCLE",
      dot: "#9aaa8d",
      items: [
        ["Lead", "CRM"],
        ["Customer", "CRM"],
        ["Quotation", "SALES"],
        ["Sales Order", "SALES"],
        ["Inventory", "INVENTORY"],
        ["Invoice", "FINANCE"],
        ["Payment", "FINANCE"],
        ["Ledger", "FINANCE"],
      ],
      insight:
        "AI scores each lead and recommends optimal pricing at the quotation stage.",
    },
    {
      number: "02",
      title: "PROCURE-TO-PAY",
      dot: "#aaa6ba",
      items: [
        ["PR Raised", "PURCHASE"],
        ["AI Check", "AI LAYER"],
        ["Approval", "WORKFLOW"],
        ["PO Created", "PURCHASE"],
        ["GRN", "INVENTORY"],
        ["Inventory +", "INVENTORY"],
        ["Payment", "FINANCE"],
      ],
      insight:
        "AI validates budget before approval and recommends the best supplier automatically.",
    },
    {
      number: "03",
      title: "PEOPLE OPERATIONS",
      dot: "#b1a16e",
      items: [
        ["Onboarding", "HR"],
        ["Attendance", "HR"],
        ["Leave", "HR"],
        ["Payroll", "HR"],
        ["Payslip", "HR"],
        ["Performance", "HR"],
      ],
      insight:
        "AI detects attrition signals and flags performance trends proactively.",
    },
  ];

  return (
    <section
      className="bg-[#f5f4ef] px-4 py-16 sm:px-6 md:px-10 lg:px-16"
      style={{
        backgroundImage:
          "radial-gradient(#d7d5cd 0.7px, transparent 0.7px)",
        backgroundSize: "12px 12px",
      }}
    >
      <div className="mx-auto max-w-[1100px]">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-6 bg-[#b9b8ae]" />

              <span className="font-mono text-[8px] tracking-[0.18em] text-[#77776d]">
                07 — CONNECTED WORKFLOWS
              </span>
            </div>

            <h2 className="font-serif text-5xl leading-[0.92] tracking-[-0.045em] text-[#1d1d1a] sm:text-5xl md:text-[58px]">
              One Connected
              <br />

              <span className="italic text-[#aaa8bd]">
                Business Flow.
              </span>
            </h2>
          </div>

          <p className="max-w-[330px] text-xs leading-5 text-[#77776d] md:mt-10">
            Every transaction, approval and data point flows automatically
            between modules — eliminating manual handoffs and data silos
            across your organization.
          </p>
        </div>

        {/* Workflow Cards */}
        <div className="space-y-5">
          {workflows.map((workflow) => (
            <div
              key={workflow.number}
             className="overflow-hidden rounded-[16px] border border-[#dfded7] bg-white px-5 py-7 sm:px-6"
            >
              {/* Workflow Header */}
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: workflow.dot }}
                />

                <span className="font-mono text-[7px] tracking-[0.18em] text-[#77776d]">
                  {workflow.number} — {workflow.title}
                </span>
              </div>

              {/* Flow */}
              <div className="overflow-hidden pb-1">
                <div className="flex items-center justify-between gap-2">
                 {workflow.items.map(([name, module], index) => (
  <React.Fragment key={`${workflow.number}-${name}`}>
    
    <div className="flex h-[56px] min-w-[78px]  flex-1 flex-col items-center justify-center rounded-[10px] border border-[#dfddd5] bg-[#f5f3ee] px-2 sm:min-w-0">
      
      <span className="font-serif text-xs text-[#171815] sm:text-sm">
        {name}
      </span>

      <span className="mt-1 font-mono text-[6px] uppercase text-[#aaa79d]">
        {module}
      </span>

    </div>

    {index < workflow.items.length - 1 && (
      <div className="flex w-6 shrink-0 items-center justify-center ">
        
        <span className="relative block h-px w-4 bg-[#c9d1c2]">
          <span className="absolute right-0 top-[-2px] h-1.5 w-1.5 rotate-45 border-r border-t border-[#aebba4]" />
        </span>

      </div>
    )}

  </React.Fragment>
))}
                </div>
              </div>

              {/* AI Insight */}
              <div className="mt-3 rounded-[10px] border border-[#e2e0d8] bg-[#f4f2ed] px-3 py-2.5">
                <p className="font-mono text-[7px] leading-4 text-[#77776d] sm:text-[8px]">
                  <span className="mr-2 text-[#91a182]">✦</span>
                  {workflow.insight}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConnectedWorkflows;