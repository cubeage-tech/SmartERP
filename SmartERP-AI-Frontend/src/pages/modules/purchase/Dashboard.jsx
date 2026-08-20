import React, { useState } from "react";

import PurchaseOrders from "./PurchaseOrders";
import Vendors from "./Vendors";
import GoodsReceipts from "./GoodsReceipts";
import PayablesAging from "./PayablesAging";

const stats = [
  {
    value: "₹38.4 L",
    label: "PURCHASE MTD",
    description: "289 orders",
  },
  {
    value: "₹1.2 Cr",
    label: "PAYABLES",
    description: "18 invoices pending",
  },
  {
    value: "42",
    label: "ACTIVE VENDORS",
    description: "5 new this month",
  },
  {
    value: "96%",
    label: "ON-TIME RECEIPT",
    description: "↑ 2pp vs last month",
  },
];

const tabs = [
  {
    label: "PURCHASE ORDERS",
    key: "purchase-orders",
  },
  {
    label: "VENDORS",
    key: "vendors",
  },
  {
    label: "GRN",
    key: "grn",
  },
  {
    label: "PAYABLES",
    key: "payables",
  },
];

function StatCard({ value, label, description }) {
  return (
    <div className="rounded-[20px] border border-[#e5e3de] bg-white px-5 py-4">
      <div className="font-serif text-[28px] leading-none tracking-[-0.03em] text-[#151714]">
        {value}
      </div>

      <div className="mt-0.5 text-[10px] font-semibold tracking-[0.14em] text-[#9b9b95]">
        {label}
      </div>

      <div className="mt-0.5 text-[13px] text-[#53664a]">
        {description}
      </div>
    </div>
  );
}

function PageContent({ activeTab }) {
  switch (activeTab) {
    case "purchase-orders":
      return <PurchaseOrders />;

    case "vendors":
      return <Vendors />;

    case "grn":
      return <GoodsReceipts />;

    case "payables":
      return <PayablesAging />;

    default:
      return null;
  }
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("purchase-orders");

  return (
    <main className="bg-[#f7f6f2] text-[#171815]">
      {/* Header */}
      <section className="px-4 pt-6 sm:px-6 sm:pt-8 lg:px-[30px]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#999a94]">
              PROCUREMENT
            </p>

            <h1 className="text-2xl font-bold text-gray-900">
              Purchase Management
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="rounded-[15px] border border-[#e4e2dc] bg-[#f9f8f5] px-4 py-2 text-[11px] text-[#252622] transition-all duration-200 hover:border-[#c9c7c0] hover:bg-white sm:px-5"
            >
              Export
            </button>

            <button
              type="button"
              className="rounded-[15px] bg-[#151714] px-4 py-2 text-[11px] text-white transition-all duration-200 hover:bg-[#292b27] hover:shadow-md sm:px-5"
            >
              + New PO
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <section className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        {/* Tabs */}
        <nav className="mt-7 flex items-center gap-1 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`
                  shrink-0
                  rounded-[11px]
                  px-5
                  py-2
                  text-[11px]
                  font-semibold
                  tracking-[0.08em]
                  transition-all
                  duration-200
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

      {/* Selected Page */}
      <section>
        <PageContent activeTab={activeTab} />
      </section>
    </main>
  );
};

export default Dashboard;