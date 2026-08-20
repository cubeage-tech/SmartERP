import React, { useMemo, useState } from "react";
import {
  Sparkles,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

/* =========================================================
   DATA
========================================================= */

const stats = [
  {
    label: "ACTIVE USERS",
    value: "284",
    footer: "+4 this month",
  },
  {
    label: "PENDING APPROVALS",
    value: "7",
    footer: "3 urgent",
    danger: true,
  },
  {
    label: "REVENUE MTD",
    value: "₹48.6M",
    footer: "+12.4%",
  },
  {
    label: "SYSTEM HEALTH",
    value: "99.9%",
    footer: "All systems OK",
  },
  {
    label: "OPEN WORKFLOWS",
    value: "23",
    footer: "+6 today",
  },
  {
    label: "AI QUERIES TODAY",
    value: "142",
    footer: "+18%",
  },
];

const insights = [
  "User Vikram Joshi login from new device — 2 hr ago",
  "3 approval workflows stalled > 24 hours",
  "Monthly data backup completed successfully",
  "GST filing due in 10 days — alert sent to Finance",
];

const initialApprovals = [
  {
    id: "PO-0481",
    title: "Prism Industries",
    type: "Purchase Order",
    amount: "₹2.4L",
    urgent: true,
    status: "PENDING",
  },
  {
    id: "USER-0091",
    title: "New user access request · IT Dept",
    type: "User Access",
    amount: "—",
    urgent: false,
    status: "PENDING",
  },
  {
    id: "EXP-0092",
    title: "Marketing",
    type: "Expense Claim",
    amount: "₹18,400",
    urgent: false,
    status: "PENDING",
  },
];

const quickActions = [
  "New User",
  "Create Workflow",
  "View Reports",
  "System Settings",
];

/* =========================================================
   CHART DATA
========================================================= */

const revenueData = {
  "3M": [
    { label: "0", value: 38.2 },
    { label: "1", value: 40.1 },
    { label: "2", value: 39.7 },
    { label: "3", value: 42.8 },
    { label: "4", value: 46.1 },
    { label: "5", value: 48.6 },
  ],

  "6M": [
    { label: "0", value: 38.2 },
    { label: "1", value: 40.1 },
    { label: "2", value: 39.7 },
    { label: "3", value: 42.8 },
    { label: "4", value: 46.1 },
    { label: "5", value: 48.6 },
  ],

  "1Y": [
    { label: "0", value: 31.4 },
    { label: "1", value: 34.7 },
    { label: "2", value: 36.1 },
    { label: "3", value: 39.8 },
    { label: "4", value: 43.2 },
    { label: "5", value: 48.6 },
  ],
};

/* =========================================================
   KPI CARD
========================================================= */

function StatCard({
  label,
  value,
  footer,
  danger,
}) {
  return (
    <div
      className="
        group
        rounded-[18px]
        border border-[#e3e0d9]
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
          font-serif
          text-[29px]
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
            danger
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
   REVENUE OVERVIEW
========================================================= */

function RevenueOverview() {
  const [period, setPeriod] = useState("6M");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data = useMemo(
    () => revenueData[period],
    [period]
  );

  const chartWidth = 1000;
  const chartHeight = 250;

  const leftPadding = 5;
  const rightPadding = 5;
  const topPadding = 28;
  const bottomPadding = 10;

  const minValue = 35;
  const maxValue = 51;

  const xStep =
    (chartWidth - leftPadding - rightPadding) /
    (data.length - 1);

  const getX = (index) =>
    leftPadding + index * xStep;

  const getY = (value) =>
    chartHeight -
    bottomPadding -
    ((value - minValue) /
      (maxValue - minValue)) *
      (chartHeight -
        topPadding -
        bottomPadding);

  const points = data.map((item, index) => ({
    ...item,
    x: getX(index),
    y: getY(item.value),
  }));

  const buildSmoothPath = (items) => {
    if (!items.length) return "";

    let path = `M ${items[0].x} ${items[0].y}`;

    for (let i = 1; i < items.length; i++) {
      const previous = items[i - 1];
      const current = items[i];

      const controlPoint1X =
        previous.x +
        (current.x - previous.x) / 2;

      const controlPoint2X =
        current.x -
        (current.x - previous.x) / 2;

      path += `
        C
        ${controlPoint1X}
        ${previous.y},
        ${controlPoint2X}
        ${current.y},
        ${current.x}
        ${current.y}
      `;
    }

    return path;
  };

  const linePath = buildSmoothPath(points);

  const areaPath = `${linePath}
    L ${points[points.length - 1].x} ${chartHeight}
    L ${points[0].x} ${chartHeight}
    Z`;

  const handleMouseMove = (event) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();

    const localX =
      ((event.clientX - rect.left) /
        rect.width) *
      chartWidth;

    let nearestIndex = 0;
    let nearestDistance = Infinity;

    points.forEach((point, index) => {
      const distance = Math.abs(point.x - localX);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setHoveredIndex(nearestIndex);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const hoveredPoint =
    hoveredIndex !== null
      ? points[hoveredIndex]
      : null;

  return (
    <section
      className="
        overflow-hidden
        rounded-[20px]
        border border-[#e3e0d9]
        bg-white
        px-6
        pt-6
        pb-5
      "
    >
      {/* HEADER */}

      <div className="flex items-start justify-between">
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
            Revenue Overview
          </p>

          <div className="mt-2 flex items-center gap-1">
            <span
              className="
                font-serif
                text-[19px]
                text-[#11130f]
              "
            >
              ₹48.6M MTD
            </span>

            <span
              className="
                font-serif
                text-[17px]
                text-[#9d9a6e]
              "
            >
              ↑
            </span>

            <span
              className="
                font-sans
                text-[11px]
                text-[#9d9a6e]
              "
            >
              12.4%
            </span>
          </div>
        </div>

        {/* PERIOD */}

        <div className="flex items-center gap-2">
          {["3M", "6M", "1Y"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setPeriod(item);
                setHoveredIndex(null);
              }}
              className={`
                rounded-[9px]
                px-3
                py-2
                font-sans
                text-[9px]
                font-medium
                transition-all
                duration-150
                ${
                  period === item
                    ? "bg-[#151814] text-white"
                    : "text-[#929992] hover:bg-[#f1f1ec] hover:text-[#222620]"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* CHART */}

      <div className="relative mt-8 h-[235px] w-full">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient
              id="adminRevenueFade"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#6d785f"
                stopOpacity="0.14"
              />

              <stop
                offset="100%"
                stopColor="#6d785f"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* FILL */}

          <path
            d={areaPath}
            fill="url(#adminRevenueFade)"
          />

          {/* MAIN LINE */}

          <path
            d={linePath}
            fill="none"
            stroke="#59674f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* HOVER GUIDE LINE */}

          {hoveredPoint && (
            <>
              <line
                x1={hoveredPoint.x}
                y1={20}
                x2={hoveredPoint.x}
                y2={220}
                stroke="#b5b8b1"
                strokeWidth="1"
                opacity="0.9"
              />

              {/* HIGHLIGHT POINT */}

              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="5"
                fill="#59674f"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </>
          )}
        </svg>

        {/* TOOLTIP */}

        {hoveredPoint && (
          <div
            className="
              pointer-events-none
              absolute
              z-10
              min-w-[70px]
              rounded-[14px]
              bg-[#111411]
              px-3
              py-3
              shadow-[0_8px_18px_rgba(20,24,20,0.18)]
            "
            style={{
              left: `${Math.min(
                Math.max(
                  (hoveredPoint.x /
                    chartWidth) *
                    100,
                  7
                ),
                85
              )}%`,
              top: `${Math.min(
                Math.max(
                  (hoveredPoint.y /
                    chartHeight) *
                    100 +
                    18,
                  28
                ),
                70
              )}%`,
              transform: "translateX(-20%)",
            }}
          >
            <p
              className="
                font-sans
                text-[11px]
                font-medium
                text-white
              "
            >
              {hoveredPoint.label}
            </p>

            <p
              className="
                mt-1
                font-sans
                text-[10px]
                text-[#728066]
              "
            >
              ₹{hoveredPoint.value.toFixed(1)}M
            </p>
          </div>
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
        min-h-[320px]
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
          AI Insights for Admin
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {insights.map((item, index) => (
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
        ))}
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
  const [approvals, setApprovals] = useState(
    initialApprovals
  );

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

  const pendingCount = approvals.filter(
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

      <div>
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

            <div className="flex min-w-0 items-center gap-5">
              <span
                className={`
                  h-[12px]
                  w-[12px]
                  shrink-0
                  rounded-full
                  transition-transform
                  duration-200
                  group-hover:scale-[1.08]
                  ${
                    item.urgent
                      ? "bg-[#a66a60]"
                      : "bg-[#b1a16d]"
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
                  <span className="font-medium">
                    {item.id}
                  </span>

                  <span className="mx-2">·</span>

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

            <div className="flex items-center justify-end gap-3">
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

              {item.status === "PENDING" && (
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

              {item.status !== "PENDING" && (
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
                      item.status === "APPROVED"
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
      </div>
    </section>
  );
}

/* =========================================================
   QUICK ACTIONS
========================================================= */

function QuickActions() {
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
      <div
        className="
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
          Quick Actions
        </h2>
      </div>

      <div className="space-y-3 px-6 py-6">
        {quickActions.map((action) => (
          <button
            key={action}
            type="button"
            className="
              group
              flex
              w-full
              items-center
              justify-between
              rounded-[15px]
              border
              border-[#e4e1da]
              bg-white
              px-4
              py-4
              text-left
              font-sans
              text-[13px]
              text-[#777d78]
              transition-all
              duration-200
              hover:-translate-y-[1px]
              hover:border-[#d5d2ca]
              hover:bg-[#f1f1ec]
              hover:text-[#262a26]
            "
          >
            <span>{action}</span>

            <ChevronRight
              size={14}
              strokeWidth={1.6}
              className="
                text-[#b7bbb7]
                transition-all
                duration-200
                group-hover:translate-x-1
                group-hover:text-[#656b65]
              "
            />
          </button>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

export default function AdminDashboard() {
  const [quickActionOpen, setQuickActionOpen] =
    useState(false);

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
      <div className="mx-auto w-full max-w-[1540px]">

        {/* =====================================================
            HEADER
        ====================================================== */}

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
              Priya Nair
            </h1>

            <p
              className="
                mt-3
                font-sans
                text-[11px]
                text-[#8d938d]
              "
            >
              Admin Dashboard
              <span className="mx-2">·</span>
              Acme Manufacturing Ltd
            </p>
          </div>

          {/* ACTION BUTTONS */}

          <div className="relative flex items-center gap-3">
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

            <button
              type="button"
              onClick={() =>
                setQuickActionOpen(
                  (value) => !value
                )
              }
              className="
                group
                flex
                h-[43px]
                items-center
                gap-2
                rounded-[14px]
                bg-[#151714]
                px-5
                font-sans
                text-[10px]
                font-medium
                uppercase
                tracking-[0.08em]
                text-white
                transition-all
                duration-200
                hover:-translate-y-[1px]
                hover:bg-[#292c27]
                hover:shadow-[0_7px_18px_rgba(20,23,20,0.12)]
              "
            >
              + Quick Action

              <ArrowUpRight
                size={12}
                strokeWidth={1.7}
                className="
                  transition-transform
                  duration-200
                  group-hover:-translate-y-[1px]
                  group-hover:translate-x-[1px]
                "
              />
            </button>

            {quickActionOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[52px]
                  z-30
                  w-[215px]
                  rounded-[16px]
                  border
                  border-[#e1ded7]
                  bg-white
                  p-2
                  shadow-[0_14px_35px_rgba(20,24,20,0.12)]
                "
              >
                {quickActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() =>
                      setQuickActionOpen(false)
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-[10px]
                      px-3
                      py-3
                      text-left
                      font-sans
                      text-[10px]
                      text-[#737a74]
                      transition-colors
                      duration-150
                      hover:bg-[#f1f1ec]
                      hover:text-[#222620]
                    "
                  >
                    {action}

                    <ChevronRight
                      size={12}
                      strokeWidth={1.6}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            KPI CARDS
        ====================================================== */}

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
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              {...stat}
            />
          ))}
        </section>

        {/* =====================================================
            REVENUE + AI
        ====================================================== */}

        <section
          className="
            mt-6
            grid
            grid-cols-1
            gap-5
            xl:grid-cols-[minmax(0,2.15fr)_minmax(340px,0.9fr)]
          "
        >
          <RevenueOverview />

          <AIInsights />
        </section>

        {/* =====================================================
            APPROVALS + QUICK ACTIONS
        ====================================================== */}

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

          <QuickActions />
        </section>

      </div>
    </main>
  );
}