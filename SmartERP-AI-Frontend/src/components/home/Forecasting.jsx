import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// ============================================================
// FORECAST DATA
// ============================================================

const forecastData = {
  Sales: {
    confidence: "87%",
    projection: "₹470L",
    yMax: 600,
    ticks: [0, 150, 300, 450, 600],
    values: [
      395, 430, 450, 410, 450, 440, 445,
      445, 420, 405, 445, 455, 455, 480,
    ],
  },

  Revenue: {
    confidence: "84%",
    projection: "₹544L",
    yMax: 600,
    ticks: [0, 150, 300, 450, 600],
    values: [
      480, 475, 475, 525, 515, 505, 500,
      520, 470, 490, 500, 535, 540, 580,
    ],
  },

  Demand: {
    confidence: "79%",
    projection: "₹1389 units",
    yMax: 1600,
    ticks: [0, 400, 800, 1200, 1600],
    values: [
      1180, 1190, 1200, 1185, 1200, 1180, 1280,
      1340, 1300, 1290, 1210, 1250, 1300, 1420,
    ],
  },

  Expenses: {
    confidence: "91%",
    projection: "₹314L",
    yMax: 340,
    ticks: [0, 85, 170, 255, 340],
    values: [
      285, 280, 290, 280, 270, 305, 280,
      295, 270, 270, 300, 320, 330, 335,
    ],
  },

  Inventory: {
    confidence: "83%",
    projection: "₹9408 SKUs",
    yMax: 10000,
    ticks: [0, 2500, 5000, 7500, 10000],
    values: [
      8800, 8300, 8600, 8750, 8500, 8500, 8500,
      8750, 8100, 8200, 8500, 8800, 9400, 9700,
    ],
  },
};

// ============================================================
// CHART CONFIGURATION
// ============================================================

const months = [
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
];

const tabs = [
  "Sales",
  "Revenue",
  "Demand",
  "Expenses",
  "Inventory",
];

// ============================================================
// CREATE CHART DATA
// ============================================================

function createChartData(values) {
  return months.map((month, index) => ({
    month,
    actual: index <= 10 ? values[index] : null,
    forecast: index >= 10 ? values[index] : null,
  }));
}

// ============================================================
// CUSTOM TOOLTIP
// ============================================================

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const actual = payload.find(
    (item) => item.dataKey === "actual"
  );

  const forecast = payload.find(
    (item) => item.dataKey === "forecast"
  );

  return (
    <div className="rounded-md border border-[#dcdcd5] bg-[#fafaf7] px-3 py-2 shadow-sm">
      <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#888880]">
        {label}
      </p>

      {actual?.value != null && (
        <p className="text-xs text-[#3f4939]">
          Actual:{" "}
          <span className="font-medium text-[#151613]">
            {actual.value}
          </span>
        </p>
      )}

      {forecast?.value != null && (
        <p className="text-xs text-[#7d9672]">
          Forecast:{" "}
          <span className="font-medium text-[#151613]">
            {forecast.value}
          </span>
        </p>
      )}
    </div>
  );
}

// ============================================================
// FORECAST TABS
// ============================================================

function ForecastTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tabs.map((tab) => {
        const active = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              rounded-[11px]
              border
              px-4
              py-1
              font-mono-dm
              text-[10px]
              uppercase
              tracking-[0.12em]
              transition-all
              duration-200
              ${
                active
                  ? "border-[#121511] bg-[#121511] text-white"
                  : "border-[#deded8] bg-transparent text-[#85857f] hover:border-[#bfc4ba] hover:text-[#353831]"
              }
            `}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// CHART LEGEND
// ============================================================

function ChartLegend() {
  return (
    <div className="flex items-center gap-5">
      {/* Actual */}
      <div className="flex items-center gap-2">
        <span className="block h-px w-5 bg-[#596650]" />

        <span className="font-mono-dm text-[9px] uppercase tracking-[0.12em] text-[#7d7d76]">
          Actual
        </span>
      </div>

      {/* Forecast */}
      <div className="flex items-center gap-2">
        <span className="block w-5 border-t border-dashed border-[#8da27f]" />

        <span className="font-mono-dm text-[9px] uppercase tracking-[0.12em] text-[#7d7d76]">
          Forecast
        </span>
      </div>
    </div>
  );
}

// ============================================================
// FORECAST CHART
// ============================================================

function ForecastChart({ chartData, current }) {
  return (
    <div className="h-[290px] px-3 pt-5 sm:h-[310px] sm:px-5 md:h-[320px] lg:h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 8,
            right: 8,
            left: 8,
            bottom: 20,
          }}
        >
          {/* Chart gradients */}
          <defs>
            <linearGradient
              id="actualGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#899281"
                stopOpacity={0.12}
              />

              <stop
                offset="100%"
                stopColor="#899281"
                stopOpacity={0}
              />
            </linearGradient>

            <linearGradient
              id="forecastGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#a4b99a"
                stopOpacity={0.11}
              />

              <stop
                offset="100%"
                stopColor="#a4b99a"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid
            vertical={false}
            stroke="#e3e3dd"
            strokeDasharray="2 3"
          />

          {/* X Axis */}
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#aaa9a2",
              fontSize: 11,
              fontFamily: "monospace",
            }}
            tickMargin={8}
          />

          {/* Y Axis */}
          <YAxis
            domain={[0, current.yMax]}
            ticks={current.ticks}
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#aaa9a2",
              fontSize: 11,
              fontFamily: "monospace",
            }}
            width={32}
          />

          {/* Tooltip */}
          <Tooltip
            cursor={{
              stroke: "#d8d8d1",
              strokeDasharray: "3 3",
            }}
            content={<CustomTooltip />}
          />

          {/* Actual data */}
          <Area
            type="monotone"
            dataKey="actual"
            stroke="#58644f"
            strokeWidth={1.8}
            fill="url(#actualGradient)"
            connectNulls={false}
            dot={false}
            activeDot={{
              r: 3,
              fill: "#58644f",
              stroke: "#f7f7f2",
              strokeWidth: 2,
            }}
          />

          {/* Forecast data */}
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="#91a984"
            strokeWidth={1.8}
            strokeDasharray="5 4"
            fill="url(#forecastGradient)"
            connectNulls={false}
            dot={false}
            activeDot={{
              r: 3,
              fill: "#91a984",
              stroke: "#f7f7f2",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================================
// STATISTICS
// ============================================================

function ForecastStatistics({ projection }) {
  const statistics = [
    ["90-Day Projection", projection],
    ["Growth vs Prior", "+12.4%"],
    ["Forecast Model", "ARIMA + ML"],
    ["Updated", "Real-time"],
  ];

  return (
    <div className="grid grid-cols-2 border-t border-[#dfdfd8] md:grid-cols-4">
      {statistics.map(([label, value], index) => (
        <div
          key={label}
          className={`
            flex min-h-[82px]
            flex-col
            items-center
            justify-center
            border-b
            border-[#dfdfd8]
            px-3
            text-center
            md:border-b-0
            ${index < 3 ? "md:border-r" : ""}
            ${index >= 2 ? "border-b-0" : ""}
          `}
        >
          <span className="mb-2 font-mono-dm text-[8px] uppercase tracking-[0.18em] text-[#a1a19a]">
            {label}
          </span>

          <span className="font-serif text-[20px] font-[600] tracking-[-0.02em] text-[#151713]">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MAIN FORECASTING COMPONENT
// ============================================================

const Forecasting = () => {
  const [activeTab, setActiveTab] = useState("Sales");

  const current = forecastData[activeTab];
  const chartData = createChartData(current.values);

  return (
    <section className="min-h-screen bg-[#0d100d] px-3 py-3 sm:px-5 sm:py-5 lg:px-6 lg:py-0">
      <div
        className="
          mx-auto
          min-h-[calc(100vh-24px)]
          max-w-[1360px]
          rounded-[30px]
          bg-[#f7f7f2]
          bg-[radial-gradient(circle,_rgba(90,95,85,0.075)_0.75px,_transparent_0.95px)]
          bg-[length:20px_18px]
          px-6
          py-12
          sm:px-10
          md:px-14
          lg:px-16
          lg:py-20
        "
      >
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          {/* Page title */}
          <div>
            {/* Section label */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-7 bg-[#cbd1c4]" />

              <span className="font-mono text-[11px] font-light uppercase tracking-[0.17em] text-[#384134]">
                09 — AI FORECASTING
              </span>
            </div>

            {/* Main heading */}
            <h1 className="font-serif text-[46px] leading-[0.88] tracking-[-0.045em] text-[#151613] sm:text-[56px] md:text-[62px] lg:text-[64px]">
              See What's Coming.
            </h1>

            {/* Italic heading */}
            <h2 className="mt-1 font-serif text-[45px] italic leading-[0.9] tracking-[-0.045em] text-[#b4b0c7] sm:text-[54px] md:text-[60px] lg:text-[62px]">
              Before It Happens.
            </h2>
          </div>

          {/* Header description */}
          <div className="max-w-[430px] pt-8 lg:ml-auto lg:pt-[66px]">
            <p className="font-serif text-[14px] leading-[1.8] text-[#74746f] sm:text-[15px]">
              SmartERP AI learns from your historical data to produce
              90-day forecasts with confidence scoring — so you can plan,
              order and staff ahead of demand.
            </p>
          </div>
        </div>

        {/* =====================================================
            FORECAST CARD
        ===================================================== */}

        <div className="overflow-hidden rounded-[22px] border border-[#dfdfd8] bg-[#ffffff]">
          {/* Top bar */}
          <div className="flex flex-col gap-5 border-b border-[#dfdfd8] px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            {/* Forecast tabs */}
            <ForecastTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Legend + confidence */}
            <div className="flex items-center gap-4">
              <ChartLegend />

              {/* Confidence badge */}
              <div className="rounded-[8px] border border-[#d6dfd1] bg-[#eef3eb] px-3 py-1">
                <span className="font-mono-dm text-[9px] uppercase tracking-[0.12em] text-[#465340]">
                  {current.confidence} Confidence
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              CHART
          ================================================= */}

          <ForecastChart
            chartData={chartData}
            current={current}
          />

          {/* =================================================
              STATISTICS
          ================================================= */}

          <ForecastStatistics
            projection={current.projection}
          />
        </div>
      </div>
    </section>
  );
};

export default Forecasting;