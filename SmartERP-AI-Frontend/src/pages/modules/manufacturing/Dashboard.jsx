import React, { useState } from "react";

import WorkOrders from "./WorkOrders";
import BillOfMaterials from "./BillOfMaterials";
import MachineTracking from "./MachineTracking";
import QualityControl from "./QualityControl";

const stats = [
  {
    value: "12",
    label: "ACTIVE WOS",
    description: "4 completing today",
    type: "positive",
  },
  {
    value: "84%",
    label: "OEE",
    description: "↑ 3pp this week",
    type: "positive",
  },
  {
    value: "98.2%",
    label: "QUALITY RATE",
    description: "↓ 0.4pp vs target",
    type: "positive",
  },
  {
    value: "1",
    label: "MACHINE DOWN",
    description: "CNC-03 in maintenance",
    type: "danger",
  },
];

const tabs = [
  {
    label: "WORK ORDERS",
    key: "work-orders",
  },
  {
    label: "BOM",
    key: "bom",
  },
  {
    label: "MACHINES",
    key: "machines",
  },
  {
    label: "QUALITY",
    key: "quality",
  },
];

function StatCard({ value, label, description, type }) {
  return (
    <div className="rounded-[20px] border border-[#e5e3de] bg-white px-4 py-2 sm:px-5">
      <div className="font-serif text-[26px] leading-none tracking-[-0.03em] text-[#151714] sm:text-[28px]">
        {value}
      </div>

      <div className="mt-0.5 font-mono text-[9px] tracking-[0.14em] text-[#9b9b95] sm:text-[10px]">
        {label}
      </div>

      <div
        className={`mt-0.5 font-mono text-[12px] sm:text-[13px] ${
          type === "danger" ? "text-[#8e4f46]" : "text-[#53664a]"
        }`}
      >
        {description}
      </div>
    </div>
  );
}

function PageContent({ activeTab }) {
  switch (activeTab) {
    case "work-orders":
      return <WorkOrders />;

    case "bom":
      return <BillOfMaterials />;

    case "machines":
      return <MachineTracking />;

    case "quality":
      return <QualityControl />;

    default:
      return null;
  }
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("work-orders");

  return (
    <main className="bg-[#f7f6f2] text-[#171815]">
      {/* Dashboard Header */}
      <section className="px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.14em] text-[#999a94] sm:text-[11px]">
              PRODUCTION
            </p>

            <h1 className="mt-2 font-serif text-[26px] leading-none tracking-[-0.02em] text-[#151714] sm:text-[28px]">
              Manufacturing
            </h1>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3 sm:pt-1">
            <button
              type="button"
              className="w-full rounded-[16px] border border-[#e4e2dc] bg-[#f9f8f5] px-5 py-3 font-mono text-[11px] text-[#252622] transition-all duration-200 hover:border-[#c9c7c0] hover:bg-white sm:w-auto sm:text-[12px]"
            >
              Schedule View
            </button>

            <button
              type="button"
              className="w-full rounded-[16px] bg-[#151714] px-5 py-3 font-mono text-[11px] text-white transition-all duration-200 hover:bg-[#2a2c28] hover:shadow-md sm:w-auto sm:text-[12px]"
            >
              + New Work Order
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <section className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        {/* Manufacturing Tabs */}
        <nav className="mt-6 flex flex-wrap items-center gap-1.5 sm:mt-8 sm:gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`
                  rounded-[11px]
                  px-3
                  py-2
                  font-mono
                  text-[9px]
                  tracking-[0.07em]
                  transition-all
                  duration-200
                  sm:px-5
                  sm:text-[11px]
                  sm:tracking-[0.08em]
                  ${
                    isActive
                      ? "bg-white text-[#171815] shadow-[0_2px_5px_rgba(0,0,0,0.12)]"
                      : "text-[#999a94] hover:bg-[#efeee9] hover:text-[#171815]"
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </section>

      {/* Selected Page Content */}
      <section className="mt-0 overflow-x-hidden">
        <PageContent activeTab={activeTab} />
      </section>
    </main>
  );
};

export default Dashboard;