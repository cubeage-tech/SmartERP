import React, { useMemo, useState, useEffect } from "react";
import {
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import hrApi from "../modules/hr/hrApiClient";

/* =========================================================
   HR DASHBOARD DATA (FALLBACK / INITIAL)
========================================================= */

const defaultStats = [
  {
    label: "HEADCOUNT",
    value: "284",
    footer: "+4 this month",
  },
  {
    label: "ATTENDANCE RATE",
    value: "96.2%",
    footer: "+1.4% vs last month",
  },
  {
    label: "ON LEAVE TODAY",
    value: "12",
    footer: "4.2% of workforce",
    warning: true,
  },
  {
    label: "PAYROLL DUE",
    value: "₹8.4M",
    footer: "Aug 31",
  },
  {
    label: "ATTRITION RISK",
    value: "3 flagged",
    footer: "AI detected",
    warning: true,
  },
  {
    label: "OPEN POSITIONS",
    value: "7",
    footer: "+2 this month",
    warning: true,
  },
];


/* =========================================================
   HR AI INSIGHTS
========================================================= */

const insights = [
  "3 employees show elevated departure signals this quarter",
  "Payroll processing due in 21 days — prepare data",
  "12 leave requests pending manager approval",
  "Performance review cycle starts Sep 1",
];

/* =========================================================
   HR APPROVALS
========================================================= */

const initialApprovals = [
  {
    id: "LEAVE-ADITYA",
    title: "Leave · Aditya Kumar · 3 days",
    type: "Leave Approval",
    amount: "—",
    urgent: false,
    status: "PENDING",
  },
  {
    id: "LEAVE-PRIYA",
    title: "Leave · Priya Kapoor · 5 days",
    type: "Leave Approval",
    amount: "—",
    urgent: false,
    status: "PENDING",
  },
  {
    id: "EXP-0094",
    title: "EXP-0094 · Travel expense",
    type: "Expense Claim",
    amount: "₹14,200",
    urgent: false,
    status: "PENDING",
  },
];

/* =========================================================
   ATTENDANCE DATA
========================================================= */

const attendanceData = {
  "3M": [
    {
      label: "W1",
      value: 95.4,
    },
    {
      label: "W2",
      value: 96.1,
    },
    {
      label: "W3",
      value: 95.7,
    },
    {
      label: "W4",
      value: 96.8,
    },
    {
      label: "W5",
      value: 95.9,
    },
  ],

  "6M": [
    {
      label: "W1",
      value: 95.4,
    },
    {
      label: "W2",
      value: 96.1,
    },
    {
      label: "W3",
      value: 95.7,
    },
    {
      label: "W4",
      value: 96.8,
    },
    {
      label: "W5",
      value: 95.9,
    },
  ],

  "1Y": [
    {
      label: "Q1",
      value: 94.8,
    },
    {
      label: "Q2",
      value: 95.6,
    },
    {
      label: "Q3",
      value: 96.0,
    },
    {
      label: "Q4",
      value: 96.2,
    },
    {
      label: "Current",
      value: 96.2,
    },
  ],
};

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
   ATTENDANCE OVERVIEW
========================================================= */

function AttendanceOverview({ trends = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data = useMemo(
    () => Array.isArray(trends) ? trends : [],
    [trends]
  );

  if (data.length === 0) {
    return (
      <section className="rounded-[20px] border border-[#e3e0d9] bg-white px-6 py-6">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.15em] text-[#9ba19b]">
          Attendance This Week
        </p>
        <p className="mt-4 font-sans text-[13px] text-[#8d938d]">
          No attendance records are available yet.
        </p>
      </section>
    );
  }

  const chartWidth = 1000;
  const chartHeight = 190;

  const leftPadding = 8;
  const rightPadding = 8;
  const topPadding = 22;
  const bottomPadding = 20;

  const values = data.map((item) => Number(item.value) || 0);
  const lowestValue = Math.min(...values);
  const highestValue = Math.max(...values);
  const padding = Math.max(2, (highestValue - lowestValue) * 0.25);

  const minValue = Math.max(0, lowestValue - padding);
  const maxValue = Math.min(
    100,
    highestValue === lowestValue
      ? highestValue + 2
      : highestValue + padding
  );

  const xStep =
    data.length > 1
      ? (chartWidth -
          leftPadding -
          rightPadding) /
        (data.length - 1)
      : 0;

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

  const hoveredPoint =
    hoveredIndex !== null
      ? points[hoveredIndex]
      : null;

  const handleMouseMove = (event) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const localX =
      ((event.clientX - rect.left) /
        rect.width) *
      chartWidth;

    let nearestIndex = 0;
    let nearestDistance = Infinity;

    points.forEach((point, index) => {
      const distance = Math.abs(
        point.x - localX
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setHoveredIndex(nearestIndex);
  };

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
            Attendance This Week
          </p>

          <div className="mt-2 flex items-center gap-1">
            <span
              className="
                font-serif
                text-[19px]
                text-[#11130f]
              "
            >
              {(
                data.reduce((total, item) => total + (Number(item.value) || 0), 0) /
                data.length
              ).toFixed(1)}
              %
            </span>

            <span
              className="
                font-serif
                text-[16px]
                text-[#a0b48d]
              "
            >
              |
            </span>

            <span
              className="
                font-sans
                text-[11px]
                text-[#a0b48d]
              "
            >
              avg.
            </span>
          </div>
        </div>
          <span className="font-sans text-[10px] text-[#8d938d]">
            Last 5 recorded weeks
          </span>
        </div>

      {/* CHART */}

      <div className="relative mt-7 h-[240px] w-full">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="
            absolute
            inset-0
            h-full
            w-full
            cursor-crosshair
          "
          onMouseMove={handleMouseMove}
          onMouseLeave={() =>
            setHoveredIndex(null)
          }
        >
          {/* LINE */}

          <path
            d={linePath}
            fill="none"
            stroke="#9caf8d"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* PERMANENT POINTS */}

          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={
                hoveredIndex === index
                  ? 6
                  : 5
              }
              fill="#9caf8d"
              stroke="#ffffff"
              strokeWidth="1.5"
              className="transition-all duration-150"
            />
          ))}

          {/* HOVER GUIDE */}

          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1={15}
              x2={hoveredPoint.x}
              y2={170}
              stroke="#c2c7be"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.9"
            />
          )}
        </svg>

        {/* TOOLTIP */}

        {hoveredPoint && (
          <div
            className="
              pointer-events-none
              absolute
              z-10
              rounded-[12px]
              bg-[#151814]
              px-3
              py-2.5
              shadow-[0_8px_18px_rgba(20,24,20,0.16)]
            "
            style={{
              left: `${Math.min(
                Math.max(
                  (hoveredPoint.x /
                    chartWidth) *
                    100,
                  6
                ),
                84
              )}%`,
              top: `${Math.max(
                8,
                (hoveredPoint.y /
                  chartHeight) *
                  100 -
                  5
              )}%`,
              transform:
                "translateX(-25%)",
            }}
          >
            <p
              className="
                font-sans
                text-[10px]
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
                text-[#a8bb98]
              "
            >
              {hoveredPoint.value.toFixed(
                1
              )}
              %
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

function AIInsights({ items = [] }) {
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
          HR Workforce Insights
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

function PendingApprovals({ items = [], onDashboardRefresh }) {
  const [approvals, setApprovals] = useState(items);
  const [savingId, setSavingId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    setApprovals(items);
  }, [items]);

  const updateApproval = async (id, action) => {
    try {
      setSavingId(id);
      setActionError("");

      if (action === "APPROVED") {
        await hrApi.approveLeave(id);
      } else {
        await hrApi.rejectLeave(id);
      }

      setApprovals((current) =>
        current.map((item) =>
          String(item.id) === String(id)
            ? { ...item, status: action }
            : item
        )
      );

      onDashboardRefresh?.();
    } catch (error) {
      console.error("Unable to update leave approval:", error);
      setActionError(
        error?.response?.data?.message ||
          "Unable to update this leave request. Please try again."
      );
    } finally {
      setSavingId(null);
    }
  };

  const pendingCount = approvals.filter(
    (item) => item.status === "PENDING"
  ).length;

  return (
    <section className="overflow-hidden rounded-[20px] border border-[#e3e0d9] bg-white">
      <div className="flex items-center justify-between border-b border-[#e5e2db] px-7 py-6">
        <div>
          <h2 className="font-serif text-[22px] leading-none text-[#161815]">
            Pending Leave Approvals
          </h2>

          {actionError && (
            <p className="mt-2 font-sans text-[11px] text-[#a25f54]">
              {actionError}
            </p>
          )}
        </div>

        <span className="rounded-[10px] bg-[#f2e9e5] px-3 py-2 font-sans text-[9px] font-medium text-[#996d62]">
          {pendingCount} waiting
        </span>
      </div>

      {approvals.length === 0 ? (
        <p className="px-7 py-8 font-sans text-[13px] text-[#8d938d]">
          No leave requests are awaiting approval.
        </p>
      ) : (
        approvals.map((item) => (
          <div
            key={item.id}
            className="group relative grid min-h-[102px] grid-cols-[minmax(0,1fr)_auto] items-center gap-5 border-b border-[#e6e3dc] px-7 transition-colors duration-200 last:border-b-0 hover:bg-[#f0f0eb]"
          >
            <div className="flex min-w-0 items-center gap-5">
              <span className="h-[11px] w-[11px] shrink-0 rounded-full bg-[#a8bb98]" />

              <div className="min-w-0">
                <p className="truncate font-sans text-[13px] text-[#252824]">
                  {item.title}
                </p>

                <p className="mt-2 font-sans text-[11px] text-[#b0b4af]">
                  {item.type}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <span className="min-w-[82px] text-right font-serif text-[20px] text-[#181b17]">
                {item.amount || "—"}
              </span>

              {item.status === "PENDING" ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={savingId === item.id}
                    onClick={() => updateApproval(item.id, "APPROVED")}
                    className="rounded-[9px] border border-[#cdd9c8] bg-[#eef3eb] px-3 py-1.5 font-sans text-[9px] font-medium text-[#5e6d58] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingId === item.id ? "Saving..." : "Approve"}
                  </button>

                  <button
                    type="button"
                    disabled={savingId === item.id}
                    onClick={() => updateApproval(item.id, "REJECTED")}
                    className="rounded-[9px] border border-[#dfcbc7] bg-[#f6efed] px-3 py-1.5 font-sans text-[9px] font-medium text-[#8a625b] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span
                  className={
                    item.status === "APPROVED"
                      ? "rounded-[9px] bg-[#e3ebdf] px-3 py-1.5 font-sans text-[9px] font-medium tracking-[0.06em] text-[#53624f]"
                      : "rounded-[9px] bg-[#eee2df] px-3 py-1.5 font-sans text-[9px] font-medium tracking-[0.06em] text-[#8a635b]"
                  }
                >
                  {item.status}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </section>
  );
}

/* =========================================================
   HR MANAGER DASHBOARD
========================================================= */

export default function HRDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setDashboardError("");

      const response = await hrApi.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error("HR Dashboard API error:", error);
      setDashboardError(
        error?.response?.data?.message ||
          "Unable to load the HR dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = Array.isArray(dashboardData?.stats)
    ? dashboardData.stats
    : [];

  const attendanceTrends = Array.isArray(dashboardData?.attendanceTrends)
    ? dashboardData.attendanceTrends
    : [];

  const dashboardInsights = Array.isArray(dashboardData?.insights)
    ? dashboardData.insights
    : [];

  const pendingApprovals = Array.isArray(dashboardData?.pendingApprovals)
    ? dashboardData.pendingApprovals
    : [];

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
                {dashboardError && (
          <div className="mb-6 rounded-[14px] border border-[#e6c9c2] bg-[#fbf1ef] px-4 py-3 font-sans text-[12px] text-[#9b5e52]">
            {dashboardError}
          </div>
        )}

        {loading && (
          <div className="mb-6 rounded-[14px] border border-[#e3e0d9] bg-white px-4 py-3 font-sans text-[12px] text-[#727870]">
            Loading HR dashboard…
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
          {/* LEFT */}

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
              Deepika Rao
            </h1>

            <p
              className="
                mt-3
                font-sans
                text-[11px]
                text-[#8d938d]
              "
            >
              HR Dashboard

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
            ATTENDANCE + AI INSIGHTS
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
          <AttendanceOverview trends={attendanceTrends} />
          <AIInsights items={dashboardInsights} />
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
          <PendingApprovals items={pendingApprovals} onDashboardRefresh={loadDashboard} />

        </section>
      </div>
    </main>
  );
}