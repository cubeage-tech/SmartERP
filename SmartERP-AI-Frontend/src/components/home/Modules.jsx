import React, { useState } from "react";

const modules = [
  {
    number: "01",
    title: "Company Management",
    short: "The control layer for everything.",
    description:
      "Configure companies, branches, departments, users, permissions and approval workflows from one centralized hub.",
    leftItems: [
      "Company Profile & Branches",
      "Organization Chart",
      "Approval Workflows",
    ],
    rightItems: [
      "Departments & Cost Centers",
      "Users & Roles",
      "Subscription Management",
    ],
    ai: [
      "Intelligent workflow routing",
      "Approval automation",
      "Audit intelligence",
    ],
    stats: [
      ["4", "BRANCHES"],
      ["12", "DEPTS"],
      ["284", "USERS"],
    ],
    type: "company",
  },
  {
    number: "02",
    title: "CRM",
    short: "Leads to loyalty, intelligently scored.",
    description:
      "Manage the complete customer lifecycle from lead capture to conversion with AI-powered sales intelligence and behavioral prediction.",
    leftItems: [
      "Customer Database",
      "Sales Pipeline / Kanban",
      "Communication History",
      "Lead Conversion",
    ],
    rightItems: [
      "Lead Management",
      "Follow-up Tasks",
      "Customer Timeline",
    ],
    ai: [
      "AI Lead Scoring (0–100)",
      "Customer Behavior Prediction",
      "Sales Opportunity Prediction",
    ],
    type: "crm",
  },
  {
    number: "03",
    title: "Sales",
    short: "From quotation to payment, automated.",
    description:
      "Manage quotations, orders, invoicing and payments while AI improves forecasting and pricing decisions in real time.",
    leftItems: [
      "Sales Dashboard",
      "Sales Orders",
      "Payments & Aging",
    ],
    rightItems: [
      "Quotations",
      "Invoices",
      "Customer Reports",
    ],
    ai: [
      "Sales Forecasting",
      "Product Recommendations",
      "Price Optimization",
    ],
    type: "sales",
  },
  {
    number: "04",
    title: "Purchase",
    short: "Smart procurement, optimized costs.",
    description:
      "Streamline the procure-to-pay cycle with intelligent supplier recommendations, contract management and cost optimization.",
    leftItems: [
      "Vendors & Ratings",
      "Purchase Requests",
      "Goods Receipts",
    ],
    rightItems: [
      "Contracts",
      "Purchase Orders",
      "Payables Aging",
    ],
    ai: [
      "Supplier Recommendation",
      "Purchase Prediction",
      "Cost Optimization",
    ],
    type: "purchase",
  },
  {
    number: "05",
    title: "Inventory",
    short: "Real-time stock, zero surprises.",
    description:
      "Gain complete visibility into stock across warehouses, batches and locations with AI-powered demand forecasting and reorder intelligence.",
    leftItems: [
      "On-hand / Reserved / Available",
      "Batch/Lot Tracking",
      "Stock Transfers",
    ],
    rightItems: [
      "Warehouses & Bins",
      "Barcode & QR Management",
      "Expiry Alerts",
    ],
    ai: [
      "Demand Forecasting",
      "Stock Optimization",
      "Automatic Reorder Alerts",
    ],
    type: "inventory",
  },
  {
    number: "06",
    title: "Manufacturing",
    short: "Production intelligence, machine to finish.",
    description:
      "Plan, schedule and monitor production with intelligent work orders, machine tracking, utilization analysis and quality control.",
    leftItems: [
      "Bill of Materials",
      "Machine Tracking",
      "Quality Control",
    ],
    rightItems: [
      "Work Orders",
      "Utilization & Downtime",
      "Inspections",
    ],
    ai: [
      "Production Optimization",
      "Machine Failure Prediction",
      "AI Scheduling",
    ],
    type: "manufacturing",
  },
  {
    number: "07",
    title: "Finance & Accounts",
    short: "Every rupee, accounted and forecasted.",
    description:
      "Complete financial management with accounting, GST compliance, expense tracking, P&L, cash flow and AI-powered fraud detection.",
    leftItems: [
      "General Ledger",
      "Journal Entries",
      "P&L / Balance Sheet",
    ],
    rightItems: [
      "Chart of Accounts",
      "GST & Tax Management",
      "Cash Flow Forecast",
    ],
    ai: [
      "Expense Analysis",
      "Fraud Detection",
      "Financial Forecasting",
    ],
    type: "finance",
  },
  {
    number: "08",
    title: "HR & Payroll",
    short: "People operations from hire to retire.",
    description:
      "Complete employee lifecycle management — attendance, leave, payroll, performance and AI-predicted attrition risk across your organization.",
    leftItems: [
      "Employee Database",
      "Attendance & Leave",
      "Payslips",
    ],
    rightItems: [
      "Org Chart",
      "Payroll & Salary",
      "Performance Tracking",
    ],
    ai: [
      "Performance Analysis",
      "Attrition Prediction",
      "Recruitment Assistance",
    ],
    type: "hr",
  },
  {
    number: "09",
    title: "Projects",
    short: "Timelines, budgets, risks — in control.",
    description:
      "Plan projects, allocate resources, track time and monitor budgets in one collaborative workspace with AI-powered delay prediction.",
    leftItems: [
      "Gantt Timeline",
      "Dependencies",
      "Budget Monitoring",
    ],
    rightItems: [
      "Milestones & Tasks",
      "Time Tracking & Timesheets",
      "Project Documents",
    ],
    ai: [
      "Delay Prediction",
      "Resource Optimization",
      "Risk Analysis",
    ],
    type: "projects",
  },
  {
    number: "10",
    title: "Documents",
    short: "AI-powered document intelligence.",
    description:
      "Centralize all business documents with OCR extraction, semantic search, digital approvals, e-signatures and intelligent version control.",
    leftItems: [
      "Smart Document Upload",
      "Semantic Search",
      "Digital Approvals",
    ],
    rightItems: [
      "OCR Processing",
      "Version Control",
      "E-Signatures",
    ],
    ai: [
      "OCR & Data Extraction",
      "Document Summarization",
      "Semantic Smart Search",
    ],
    type: "documents",
  },
];

function Preview({ module }) {
  if (module.type === "company") {
    return (
      <div className="h-full rounded-[18px] border border-[#dfddd5] bg-[#f3f1eb] p-6">
        <div className="rounded-[13px] bg-[#111410] p-5 text-white">
          <div className="mb-4 text-[9px] tracking-[0.08em] text-[#a6b89b]">
            ORG HIERARCHY
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="h-5 w-5 rounded-md bg-[#292c27]" />
              <span className="h-[7px] flex-1 rounded-full bg-[#3a3d38]" />
            </div>

            <div className="ml-5 flex items-center gap-3">
              <span className="h-3 w-3 rounded bg-[#292c27]" />
              <span className="h-[6px] flex-1 rounded-full bg-[#30332e]" />
            </div>

            <div className="ml-7 flex items-center gap-3">
              <span className="h-3 w-3 rounded bg-[#292c27]" />
              <span className="h-[5px] w-[68%] rounded-full bg-[#30332e]" />
            </div>

            <div className="ml-10 flex items-center gap-3">
              <span className="h-3 w-3 rounded bg-[#292c27]" />
              <span className="h-[5px] w-[55%] rounded-full bg-[#30332e]" />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 text-center">
          {module.stats.map(([value, label]) => (
            <div key={label}>
              <div className="font-serif text-[17px] text-[#111]">
                {value}
              </div>
              <div className="mt-1 text-[8px] text-[#8d8a84]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-[18px] border border-[#dfddd5] bg-[#f3f1eb] p-5">
      {module.type === "crm" && (
        <>
          <div className="grid grid-cols-5 gap-1">
            {["NEW", "CONTACT", "QUALIFY", "PROPOSAL", "WON"].map(
              (item, index) => (
                <div key={item}>
                  <div className="mb-2 text-center text-[7px] text-[#8f8c85]">
                    {item}
                  </div>
                  <div className="rounded-lg border border-[#dedbd2] bg-white p-2">
                    <div className="h-[4px] rounded bg-[#dedbd2]" />
                    <div className="mt-2 text-center text-[8px] text-[#77736c]">
                      {92 - index * 8}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="mt-4 rounded-lg border border-[#d5dfcf] bg-[#edf2e9] px-3 py-2 text-[8px] text-[#596552]">
            ✦ AI: 3 high-value opportunities detected this week
          </div>
        </>
      )}

      {module.type === "sales" && (
        <div className="space-y-2">
          {[
            ["QT-2024-0842", "Sent", "₹1.24L"],
            ["SO-2024-0391", "Confirmed", "₹2.86L"],
            ["INV-2024-0127", "Paid", "₹2.86L"],
          ].map(([id, status, amount]) => (
            <div
              key={id}
              className="flex items-center justify-between rounded-xl border border-[#dedbd2] bg-white px-3 py-3"
            >
              <div>
                <div className="text-[8px] text-[#222]">{id}</div>
                <div className="mt-1 text-[7px] text-[#99958c]">
                  {status}
                </div>
              </div>
              <div className="font-serif text-[13px] text-[#111]">
                {amount}
              </div>
            </div>
          ))}
        </div>
      )}

      {module.type === "purchase" && (
        <div>
          <div className="mb-3 text-[8px] text-[#99958c]">
            AI SUPPLIER COMPARISON
          </div>

          {[
            ["Priam Industries", "₹420", "96%"],
            ["Vertex Metals", "₹395", "91%"],
            ["Horizon Supply", "₹438", "98%"],
          ].map(([name, price, score], index) => (
            <div
              key={name}
              className={`mb-2 rounded-xl border px-3 py-3 ${
                index === 1
                  ? "border-[#ccd7c3] bg-[#eef2e9]"
                  : "border-[#dedbd2] bg-white"
              }`}
            >
              <div className="flex justify-between">
                <span className="text-[8px]">{name}</span>
                <span className="font-serif text-[13px]">{price}</span>
              </div>
              <div className="mt-1 text-right text-[7px] text-[#99958c]">
                {score}
              </div>
            </div>
          ))}
        </div>
      )}

      {module.type === "inventory" && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["ON-HAND", "8,420"],
              ["RESERVED", "1,840"],
              ["AVAILABLE", "6,580"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-[#dedbd2] bg-white p-3 text-center"
              >
                <div className="text-[7px] text-[#99958c]">{label}</div>
                <div className="mt-1 font-serif text-[15px]">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            <div className="rounded-lg border border-[#dfcfc8] bg-[#f1e9e5] px-3 py-2 text-[7px]">
              ● SKU-2841 — Ball Bearings · 42 units left
            </div>
            <div className="rounded-lg border border-[#dfcfc8] bg-[#f1e9e5] px-3 py-2 text-[7px]">
              ● SKU-1920 — Steel Rods · 18 units — reorder
            </div>
          </div>
        </>
      )}

      {module.type === "manufacturing" && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["8", "RUNNING"],
              ["3", "IDLE"],
              ["2", "MAINTENANCE"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-xl border border-[#dedbd2] bg-white p-3 text-center"
              >
                <div className="font-serif text-[16px]">{value}</div>
                <div className="text-[7px] text-[#99958c]">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-[#dedbd2] bg-white p-3">
            <div className="flex justify-between text-[8px]">
              <span>WO-0048 · Engine Mounts</span>
              <span>68%</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-[#e1dfd7]">
              <div className="h-full w-[68%] rounded-full bg-[#9bae8e]" />
            </div>
          </div>
        </>
      )}

      {module.type === "finance" && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-[#dedbd2] bg-white p-4">
              <div className="text-[7px] text-[#99958c]">REVENUE MTD</div>
              <div className="mt-1 font-serif text-[17px]">₹48.6M</div>
              <div className="text-[7px]">+12.4%</div>
            </div>

            <div className="rounded-xl border border-[#dedbd2] bg-white p-4">
              <div className="text-[7px] text-[#99958c]">NET PROFIT</div>
              <div className="mt-1 font-serif text-[17px]">₹6.2M</div>
              <div className="text-[7px]">+8.1%</div>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-[#dfcfc8] bg-[#f1e9e5] p-3 text-[8px]">
            <div>● AI Fraud Alert</div>
            <div className="mt-1 text-[7px] text-[#8d847d]">
              Potential duplicate — INV-2024 · ₹2,84,000
            </div>
          </div>
        </>
      )}

      {module.type === "hr" && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["284", "HEADCOUNT"],
              ["12", "ON LEAVE"],
              ["₹8.4M", "PAYROLL"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-xl border border-[#dedbd2] bg-white p-3 text-center"
              >
                <div className="text-[7px] text-[#99958c]">{label}</div>
                <div className="mt-1 font-serif text-[16px]">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-[#ddd5c2] bg-[#efede4] p-3 text-[8px]">
            ⚠ AI Attrition Risk
            <div className="mt-1 text-[7px] text-[#8d887d]">
              3 employees flagged — elevated departure signals
            </div>
          </div>
        </>
      )}

      {module.type === "projects" && (
        <div className="space-y-2">
          {[
            ["Q4 Factory Expansion", "68%", "On Track"],
            ["ERP Data Migration", "42%", "At Risk"],
            ["Website Relaunch", "91%", "On Track"],
          ].map(([name, progress, status]) => (
            <div
              key={name}
              className="rounded-xl border border-[#dedbd2] bg-white p-3"
            >
              <div className="flex justify-between text-[8px]">
                <span>{name}</span>
                <span>{status}</span>
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-[#e1dfd7]">
                <div
                  className="h-full rounded-full bg-[#9bae8e]"
                  style={{ width: progress }}
                />
              </div>

              <div className="mt-1 text-[7px] text-[#99958c]">
                {progress} complete
              </div>
            </div>
          ))}
        </div>
      )}

      {module.type === "documents" && (
        <div className="rounded-xl border border-[#d6dfce] bg-[#edf0e8] p-4">
          <div className="text-[8px] tracking-[0.08em] text-[#7f8d78]">
            AI OCR PROCESSING
          </div>

          <div className="mt-4 space-y-3 text-[8px]">
            <div className="flex justify-between">
              <span className="text-[#99958c]">Vendor</span>
              <span>✓ Prism Industries Ltd</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#99958c]">Amount</span>
              <span>✓ ₹2,84,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#99958c]">GST Rate</span>
              <span>✓ 18%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#99958c]">Invoice Date</span>
              <span>✓ 08 Aug 2026</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExpandedModule({ module, onClose }) {
  return (
    <div className="relative bg-white px-5 py-7 sm:px-8 md:px-10 lg:px-12">
      <button
        onClick={onClose}
        aria-label="Close module"
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#9bae8e] text-[13px] font-semibold text-white transition hover:bg-[#879b7a] sm:right-8 sm:top-6"
      >
        ×
      </button>

      {/* TOP ROW */}
      <div className="grid grid-cols-[45px_minmax(0,max-content)_minmax(0,1fr)] items-baseline gap-x-3 pr-12 sm:gap-x-5">
        <span className="font-mono text-[9px] tracking-[0.1em] text-[#c2c8c0]">
          {module.number}
        </span>

        <h2 className="font-serif text-[24px] leading-none text-[#111] sm:text-[27px]">
          {module.title}
        </h2>

        <p className="min-w-0 font-mono text-[9px] leading-[1.6] text-[#a9a59d]">
          {module.short}
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="mt-7 grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-12">
        <div className="min-w-0">
          <p className="max-w-[1100px] text-[16px] leading-[1.7] text-[#737a80]">
            {module.description}
          </p>

          <div className="mt-7 grid grid-cols-1 gap-x-10 gap-y-2 border-b border-[#e5e3de] pb-8 md:grid-cols-2">
            <ul className="space-y-2">
              {module.leftItems.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 font-mono text-[10px] leading-[1.5] text-[#6f7a84]"
                >
                  <span className="text-[#b9bdb6]">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <ul className="space-y-2">
              {module.rightItems.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 font-mono text-[10px] leading-[1.5] text-[#6f7a84]"
                >
                  <span className="text-[#b9bdb6]">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <div className="mb-4 font-mono text-[8px] tracking-[0.16em] text-[#99a58f]">
              AI CAPABILITIES
            </div>

            <div className="flex flex-wrap gap-2">
              {module.ai.map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-[#d6dfcf] bg-[#edf2e9] px-3 py-2 font-mono text-[9px] text-[#63705d]"
                >
                  ✦ {item}
                </span>
              ))}
            </div>
          </div>

          <button className="mt-8 font-mono text-[9px] tracking-[0.08em] text-[#73808a] transition hover:text-[#111]">
            EXPLORE MODULE →
          </button>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="min-w-0 xl:min-h-[300px]">
          <Preview module={module} />
        </div>
      </div>
    </div>
  );
}

const Modules = () => {
  const [openModule, setOpenModule] = useState(null);

  return (
    <div className="min-h-screen w-full bg-[#0d100e] px-0 py-0 sm:px-5 sm:py-6 lg:px-[4.5vw] lg:py-8">
      <section
        className="relative mx-auto min-h-screen w-full max-w-[1720px] overflow-hidden rounded-[0px] bg-[#f5f3ee] text-[#111] sm:rounded-[38px]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(112,119,108,0.105) 0.8px, transparent 0.9px)",
          backgroundSize: "18px 18px",
        }}
      >
        {/* HEADER */}
        <div className="px-[7vw] pb-12 pt-14 sm:pb-16 sm:pt-16 lg:px-[5vw] lg:pb-20 lg:pt-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)] lg:gap-16">
            <div>
              <div className="mb-8 flex items-center gap-4">
                <span className="h-px w-12 bg-[#b7c6ae]" />

                <span className="font-mono text-[9px] tracking-[0.12em] text-[#737a72]">
                  04 — 10 MODULES
                </span>
              </div>

              <h1 className="max-w-[650px] font-serif text-[clamp(42px,5vw,78px)] leading-[0.93] tracking-[-0.045em] text-[#111]">
                Everything Your
                <br />
                Business Needs.
                <br />
                <span className="italic text-[#aaa9bc]">Connected.</span>
              </h1>
            </div>

            <div className="flex items-start lg:justify-end">
              <p className="max-w-[390px] text-[14px] leading-[1.55] text-[#7c8286] lg:mt-9">
                Ten fully integrated modules sharing one data model, one
                permission system and one AI layer.
                <br />
                Click any module to see what it does.
              </p>
            </div>
          </div>
        </div>

        {/* MODULE LIST */}
        <div className="mx-[7vw] border-t border-[#dedcd6] lg:mx-[5vw]">
          {modules.map((module) => {
            const isOpen = openModule === module.number;

            return (
              <div key={module.number}>
                {!isOpen ? (
                  <button
                    onClick={() => setOpenModule(module.number)}
                    className="group grid min-h-[88px] w-full grid-cols-[35px_minmax(0,max-content)_minmax(0,1fr)_42px] items-center gap-x-3 border-b border-[#dedcd6] text-left transition-colors hover:bg-white/50 sm:grid-cols-[45px_minmax(0,max-content)_minmax(0,1fr)_48px] sm:gap-x-5"
                  >
                    <span className="font-mono text-[9px] tracking-[0.1em] text-[#c2c8c0]">
                      {module.number}
                    </span>

                    <span className="font-serif text-[17px] leading-none text-[#111] sm:text-[20px]">
                      {module.title}
                    </span>

                    <span className="min-w-0 font-mono text-[8px] leading-[1.5] text-[#aaa59d] sm:text-[9px]">
                      {module.short}
                    </span>

                    <span className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d4d3ce] font-serif text-[17px] font-light text-[#a4a6a2] transition group-hover:border-[#aaa] group-hover:text-[#555]">
                      +
                    </span>
                  </button>
                ) : (
                  <div className="border-b border-[#dedcd6]">
                    <ExpandedModule
                      module={module}
                      onClose={() => setOpenModule(null)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BOTTOM SPACE */}
        <div className="h-12 sm:h-16 lg:h-20" />
      </section>
    </div>
  );
};

export default Modules;