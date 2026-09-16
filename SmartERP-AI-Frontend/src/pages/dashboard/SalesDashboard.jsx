import React, { useEffect, useState } from "react";
import RoleDashboardService from "../../core/services/modules/roleDashboard.service";
import {
  Sparkles,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

/* =========================================================
   SALES DASHBOARD DATA
========================================================= */

const fallbackStats = [
  { label: "REVENUE MTD", value: "₹0", footer: "Loading unavailable" },
  { label: "REVENUE CHANGE", value: "0%", footer: "vs last month" },
  { label: "RECEIVABLES", value: "₹0", footer: "Outstanding invoices" },
  { label: "PENDING INVOICES", value: "0", footer: "Awaiting payment" },
  { label: "ORDERS YTD", value: "₹0", footer: "Year-to-date value" },
  { label: "ON-TIME DELIVERY", value: "0%", footer: "Delivery performance" },
];

/* =========================================================
   AI INSIGHTS
========================================================= */

const insights = [
  "Nexus Corp — highest AI lead score this week (94/100)",
  "West region declining — 3 accounts show churn signals",
  "12 follow-ups are overdue today — action needed",
  "Q4 target 82% achieved — on track",
];

/* =========================================================
   SALES APPROVALS
========================================================= */

const initialApprovals = [
  {
    id: "SO-0841",
    title: "discount override · 15%",
    type: "Discount Approval",
    amount: "₹1.2L",
    urgent: true,
    status: "PENDING",
  },
  {
    id: "QT-0902",
    title: "extension request",
    type: "Quotation Extension",
    amount: "—",
    urgent: false,
    status: "PENDING",
  },
];

/* =========================================================
   SALES PIPELINE DATA
========================================================= */

const pipelineData = [
  {
    label: "Lead",
    value: "₹92L",
    height: 150,
  },
  {
    label: "Qualified",
    value: "₹74L",
    height: 112,
  },
  {
    label: "Proposal",
    value: "₹61L",
    height: 88,
  },
  {
    label: "Negotiation",
    value: "₹48L",
    height: 64,
  },
  {
    label: "Closing",
    value: "₹32L",
    height: 48,
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
   SALES PIPELINE
========================================================= */

function SalesPipeline() {
  const [hoveredIndex, setHoveredIndex] =
    useState(null);

  return (
    <section
      className="
        overflow-hidden
        rounded-[20px]
        border
        border-[#e3e0d9]
        bg-white
        px-6
        pt-6
        pb-5
      "
    >
      {/* HEADER */}

      <div>
        <p
          className="
            font-sans
            text-[9px]
            font-medium
            uppercase
            tracking-[0.15em]
            text-[#9ba19b]
          "
        >
          Sales Pipeline
        </p>

        <div className="mt-2 flex items-baseline gap-2">
          <span
            className="
              font-serif
              text-[20px]
              text-[#11130f]
            "
          >
            ₹3.2Cr
          </span>

          <span
            className="
              font-sans
              text-[12px]
              text-[#a0af90]
            "
          >
            48 open deals
          </span>
        </div>
      </div>

      {/* CHART */}

      <div
        className="
          mt-8
          flex
          h-[295px]
          items-end
          justify-between
          gap-6
          px-6
          sm:px-10
          md:px-14
          lg:px-16
        "
      >
        {pipelineData.map(
          (item, index) => (
            <div
              key={item.label}
              className="
                group
                flex
                h-full
                flex-1
                flex-col
                items-center
                justify-end
              "
              onMouseEnter={() =>
                setHoveredIndex(index)
              }
              onMouseLeave={() =>
                setHoveredIndex(null)
              }
            >
              {/* VALUE */}

              <div
                className={`
                  mb-3
                  rounded-[8px]
                  bg-[#151814]
                  px-2.5
                  py-1.5
                  font-sans
                  text-[9px]
                  text-white
                  transition-all
                  duration-200
                  ${
                    hoveredIndex === index
                      ? "translate-y-0 opacity-100"
                      : "translate-y-1 opacity-0"
                  }
                `}
              >
                {item.value}
              </div>

              {/* BAR */}

              <div
                className="
                  flex
                  w-[35px]
                  items-end
                  justify-center
                  sm:w-[40px]
                "
                style={{
                  height: `${item.height}px`,
                }}
              >
                <div
                  className={`
                    h-full
                    w-full
                    rounded-t-[5px]
                    bg-[#9caf8d]
                    transition-all
                    duration-200
                    ease-out
                    ${
                      hoveredIndex === index
                        ? "bg-[#819470] scale-x-[1.06]"
                        : ""
                    }
                  `}
                />
              </div>

              {/* LABEL */}

              <p
                className="
                  mt-3
                  text-center
                  font-sans
                  text-[9px]
                  text-[#9ba19b]
                "
              >
                {item.label}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}

/* =========================================================
   AI INSIGHTS
========================================================= */

function AIInsights() {
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
          AI Insights for Sales Manager
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {insights.map(
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
   PENDING APPROVALS
========================================================= */

function PendingApprovals() {
  const [approvals, setApprovals] =
    useState(initialApprovals);

  const handleApprove = (id) => {
    setApprovals((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "APPROVED",
            }
          : item
      )
    );
  };

  const handleReject = (id) => {
    setApprovals((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "REJECTED",
            }
          : item
      )
    );
  };

  const pendingCount =
    approvals.filter(
      (item) => item.status === "PENDING"
    ).length;

  return (
    <section
      className="
        overflow-hidden
        rounded-[20px]
        border
        border-[#e3e0d9]
        bg-white
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[#e5e2db]
          px-7
          py-6
        "
      >
        <h2
          className="
            font-serif
            text-[22px]
            leading-none
            text-[#161815]
          "
        >
          Pending Approvals
        </h2>

        <span
          className="
            rounded-[10px]
            bg-[#f2e9e5]
            px-3
            py-2
            font-sans
            text-[9px]
            font-medium
            text-[#996d62]
          "
        >
          {pendingCount} waiting
        </span>
      </div>

      {/* ROWS */}

      {approvals.map((item) => (
        <div
          key={item.id}
          className="
            group
            relative
            grid
            min-h-[102px]
            grid-cols-[minmax(0,1fr)_auto]
            items-center
            gap-5
            border-b
            border-[#e6e3dc]
            px-7
            transition-colors
            duration-200
            last:border-b-0
            hover:bg-[#f0f0eb]
          "
        >
          {/* LEFT */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-5
            "
          >
            <span
              className={`
                h-[11px]
                w-[11px]
                shrink-0
                rounded-full
                transition-transform
                duration-200
                group-hover:scale-[1.1]
                ${
                  item.urgent
                    ? "bg-[#a66a60]"
                    : "bg-[#9caf8d]"
                }
              `}
            />

            <div className="min-w-0">
              <p
                className="
                  truncate
                  font-sans
                  text-[13px]
                  text-[#252824]
                  transition-colors
                  duration-200
                  group-hover:text-[#171916]
                "
              >
                {item.id}

                <span className="mx-2">
                  ·
                </span>

                {item.title}
              </p>

              <p
                className="
                  mt-2
                  font-sans
                  text-[11px]
                  text-[#b0b4af]
                  transition-colors
                  duration-200
                  group-hover:text-[#8d938d]
                "
              >
                {item.type}
              </p>
            </div>
          </div>

          {/* RIGHT */}

          <div
            className="
              flex
              items-center
              justify-end
              gap-3
            "
          >
            <span
              className="
                min-w-[82px]
                text-right
                font-serif
                text-[20px]
                text-[#181b17]
              "
            >
              {item.amount}
            </span>

            {/* HOVER ACTIONS */}

            {item.status ===
              "PENDING" && (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  overflow-hidden
                  max-w-0
                  translate-x-2
                  opacity-0
                  pointer-events-none
                  transition-all
                  duration-200
                  ease-out
                  group-hover:max-w-[150px]
                  group-hover:translate-x-0
                  group-hover:opacity-100
                  group-hover:pointer-events-auto
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    handleApprove(item.id)
                  }
                  className="
                    shrink-0
                    rounded-[9px]
                    border
                    border-[#cdd9c8]
                    bg-[#eef3eb]
                    px-3
                    py-1.5
                    font-sans
                    text-[9px]
                    font-medium
                    text-[#5e6d58]
                    transition-all
                    duration-150
                    hover:border-[#bdccb6]
                    hover:bg-[#dfe9db]
                  "
                >
                  Approve
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleReject(item.id)
                  }
                  className="
                    shrink-0
                    rounded-[9px]
                    border
                    border-[#dfcbc7]
                    bg-[#f6efed]
                    px-3
                    py-1.5
                    font-sans
                    text-[9px]
                    font-medium
                    text-[#8a625b]
                    transition-all
                    duration-150
                    hover:border-[#d5bdb8]
                    hover:bg-[#eadbd8]
                  "
                >
                  Reject
                </button>
              </div>
            )}

            {item.status !==
              "PENDING" && (
              <span
                className={`
                  rounded-[9px]
                  px-3
                  py-1.5
                  font-sans
                  text-[9px]
                  font-medium
                  tracking-[0.06em]
                  ${
                    item.status ===
                    "APPROVED"
                      ? "bg-[#e3ebdf] text-[#53624f]"
                      : "bg-[#eee2df] text-[#8a635b]"
                  }
                `}
              >
                {item.status}
              </span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

/* =========================================================
   SALES DASHBOARD
========================================================= */

export default function SalesDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError("");

        const response =
          await RoleDashboardService.getSalesDashboard();

        setDashboardData(response.data);
      } catch (requestError) {
        console.error(
          "Unable to load Sales dashboard:",
          requestError
        );

        setError(
          requestError?.response?.data?.message ||
          "Unable to load sales dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const formatAmount = (amount, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));

  const stats = dashboardData
    ? [
        {
          label: "REVENUE MTD",
          value: formatAmount(
            dashboardData.revenueMtd,
            dashboardData.currency
          ),
          footer: "Current month invoiced value",
        },
        {
          label: "REVENUE CHANGE",
          value: `${Number(
            dashboardData.revenueChangePercent || 0
          ).toFixed(1)}%`,
          footer: "Compared with last month",
          warning: Number(
            dashboardData.revenueChangePercent || 0
          ) < 0,
        },
        {
          label: "RECEIVABLES",
          value: formatAmount(
            dashboardData.outstandingAmount,
            dashboardData.currency
          ),
          footer: "Outstanding invoice balance",
          warning: Number(
            dashboardData.outstandingAmount || 0
          ) > 0,
        },
        {
          label: "PENDING INVOICES",
          value: Number(
            dashboardData.pendingInvoiceCount || 0
          ).toLocaleString("en-IN"),
          footer: "Invoices awaiting payment",
          warning: Number(
            dashboardData.pendingInvoiceCount || 0
          ) > 0,
        },
        {
          label: "ORDERS YTD",
          value: formatAmount(
            dashboardData.ordersYtdAmount,
            dashboardData.currency
          ),
          footer: `${Number(
            dashboardData.orderCountYtd || 0
          ).toLocaleString("en-IN")} orders this year`,
        },
        {
          label: "ON-TIME DELIVERY",
          value: `${Number(
            dashboardData.onTimeDeliveryPercentage || 0
          ).toFixed(1)}%`,
          footer: `${Number(
            dashboardData.onTimeDeliveryChangePoints || 0
          ).toFixed(1)}pp vs previous period`,
          warning: Number(
            dashboardData.onTimeDeliveryPercentage || 0
          ) < 90,
        },
      ]
    : fallbackStats;

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

        {loading && (
  <div className="rounded-[16px] border border-[#e3e0d9] bg-white px-5 py-4 text-sm text-[#6d7069]">
    Loading sales dashboard…
  </div>
)}

{error && (
  <div className="mb-6 rounded-[16px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
    {error}
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
              Ananya Singh
            </h1>

            <p
              className="
                mt-3
                font-sans
                text-[11px]
                text-[#8d938d]
              "
            >
              Sales Dashboard

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
            SALES PIPELINE + AI
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
          <SalesPipeline />

          <AIInsights />
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
          <PendingApprovals />

        </section>
      </div>
    </main>
  );
}