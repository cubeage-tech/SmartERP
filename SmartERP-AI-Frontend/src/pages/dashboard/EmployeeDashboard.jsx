import React from "react";
import { Sparkles } from "lucide-react";

const employeeStats = [
  {
    label: "LEAVE BALANCE",
    value: "18 days",
    subtext: "Casual + Privilege",
    subtextColor: "text-[#20221f]",
  },
  {
    label: "ATTENDANCE THIS MONTH",
    value: "98.1%",
    subtext: "21/22 days",
    subtextColor: "text-[#20221f]",
  },
  {
    label: "MY OPEN TASKS",
    value: "5",
    subtext: "2 due today",
    subtextColor: "text-[#a8655c]",
  },
  {
    label: "LAST PAYSLIP",
    value: "₹68,400",
    subtext: "Jul 2026",
    subtextColor: "text-[#20221f]",
  },
];

const aiInsights = [
  "2 tasks are due today — action required",
  "Leave request approved — Aug 18–20",
  "Payslip for July is ready to download",
  "Performance review due in 12 days",
];

export default function EmployeeDashboard() {
  return (
    <main className="w-full min-h-full bg-[#f7f6f2] px-7 py-8">
      {/* =========================================================
          EMPLOYEE HEADER
          ========================================================= */}

      <section className="mb-10 flex items-start justify-between">
        <div>
          <p className="font-mono text-[12px] tracking-[0.16em] text-[#9ca0a0] uppercase">
            GOOD EVENING,
          </p>

          <h1 className="mt-1 font-serif text-[36px] leading-[1.05] text-[#11130f]">
            Aditya Kumar
          </h1>

          <p className="mt-2 font-mono text-[13px] text-[#8e9291]">
            My Workspace
            <span className="mx-2 text-[#b5b7b3]">·</span>
            Acme Manufacturing Ltd
          </p>
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-4">
          {/* AI ACTIVE */}
          <div className="flex items-center gap-2 rounded-full border border-[#d8dfd1] bg-[#edf1e9] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#a7ba98]" />

            <span className="font-mono text-[12px] tracking-[0.08em] text-[#53604e]">
              AI ACTIVE
            </span>
          </div>

          {/* QUICK ACTION */}
          <button
            type="button"
            className="
              rounded-full
              bg-[#151714]
              px-6
              py-3
              font-mono
              text-[12px]
              tracking-[0.08em]
              text-white
              transition-all
              duration-200
              hover:bg-[#242722]
              active:scale-[0.98]
            "
          >
            + QUICK ACTION
          </button>
        </div>
      </section>

      {/* =========================================================
          KPI CARDS
          ========================================================= */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {employeeStats.map((stat) => (
          <div
            key={stat.label}
            className="
              min-h-[135px]
              rounded-[20px]
              border
              border-[#e3e0d9]
              bg-white
              px-5
              py-5
              transition-all
              duration-200
              hover:-translate-y-[2px]
              hover:border-[#d5d1c8]
              hover:shadow-[0_8px_24px_rgba(32,34,31,0.04)]
            "
          >
            {/* Label */}
            <p className="font-mono text-[10px] tracking-[0.16em] text-[#9da3a8] uppercase">
              {stat.label}
            </p>

            {/* Main value */}
            <p className="mt-3 font-serif text-[29px] leading-none text-[#11130f]">
              {stat.value}
            </p>

            {/* Subtext */}
            <p
              className={`mt-5 font-mono text-[11px] ${stat.subtextColor}`}
            >
              {stat.subtext}
            </p>
          </div>
        ))}
      </section>

      {/* =========================================================
          AI INSIGHTS
          ========================================================= */}

      <section
        className="
          mt-6
          w-full
          max-w-[1070px]
          rounded-[20px]
          bg-[#151714]
          px-6
          py-7
          text-[#a9aaa4]
          sm:px-7
        "
      >
        {/* AI heading */}
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-[9px]
              border
              border-[#3e4938]
              bg-[#20271e]
            "
          >
            <Sparkles
              size={14}
              strokeWidth={1.5}
              className="text-[#a9bc9a]"
            />
          </div>

          <p className="font-mono text-[11px] tracking-[0.15em] text-[#a5b796] uppercase">
            AI INSIGHTS FOR EMPLOYEE
          </p>
        </div>

        {/* Insight list */}
        <div className="mt-5 space-y-3">
          {aiInsights.map((insight, index) => (
            <div
              key={index}
              className="
                flex
                min-h-[52px]
                items-center
                rounded-[14px]
                border
                border-[#2d312c]
                bg-[#1e211e]
                px-4
                py-3
                transition-all
                duration-200
                hover:border-[#3b4338]
                hover:bg-[#232722]
              "
            >
              {/* Bullet */}
              <span className="mr-4 h-[5px] w-[5px] shrink-0 rounded-full bg-[#697b61]" />

              {/* Text */}
              <p className="font-mono text-[13px] leading-[1.5] text-[#9da3a5]">
                {insight}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-5 border-t border-[#272b26]" />

        {/* Open AI Assistant */}
        <button
          type="button"
          className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            font-mono
            text-[12px]
            tracking-[0.12em]
            text-[#718268]
            transition-colors
            duration-200
            hover:text-[#a2b796]
          "
        >
          OPEN AI ASSISTANT →
        </button>
      </section>
    </main>
  );
}