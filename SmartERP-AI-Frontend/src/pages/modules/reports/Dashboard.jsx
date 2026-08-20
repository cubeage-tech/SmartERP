import React, { useState } from "react";

const Dashboard = () => {
  const kpiData = {
    FINANCE: [
      { label: "REVENUE YTD", value: "₹8.55 Cr", change: "+18.4%", direction: "up" },
      { label: "NET PROFIT", value: "₹1.60 Cr", change: "+12.1%", direction: "up" },
      { label: "GROSS MARGIN", value: "38.5%", change: "+2.1pp", direction: "up" },
      { label: "RECEIVABLE DAYS", value: "28d", change: "-3d", direction: "up" },
      { label: "TOTAL PAYABLES", value: "₹1.20 Cr", change: "+8.2%", direction: "down" },
      { label: "WORKING CAPITAL", value: "₹2.62 Cr", change: "+5.4%", direction: "up" },
    ],

    SALES: [
      { label: "REVENUE MTD", value: "₹1.42 Cr", change: "+18%", direction: "up" },
      { label: "ORDERS BOOKED", value: "₹14.1 L", change: "+42%", direction: "up" },
      { label: "WIN RATE", value: "28%", change: "+3pp", direction: "up" },
      { label: "AVG DEAL SIZE", value: "₹8.2 L", change: "-4%", direction: "down" },
      { label: "PIPELINE VALUE", value: "₹2.4 Cr", change: "+12%", direction: "up" },
      { label: "AVG CLOSE TIME", value: "18d", change: "-2d", direction: "up" },
    ],

    OPERATIONS: [
      { label: "OEE", value: "84%", change: "+3pp", direction: "up" },
      { label: "ON-TIME DELIVERY", value: "92%", change: "+4pp", direction: "up" },
      { label: "REJECTION RATE", value: "0.4%", change: "-0.2pp", direction: "up" },
      { label: "STOCK VALUE", value: "₹2.44 Cr", change: "+6%", direction: "up" },
      { label: "PO FILL RATE", value: "96%", change: "+2pp", direction: "up" },
      { label: "MACHINE UPTIME", value: "80%", change: "-5pp", direction: "down" },
    ],

    HR: [
      { label: "HEADCOUNT", value: "284", change: "+3", direction: "up" },
      { label: "ATTENDANCE RATE", value: "94.2%", change: "+0.8pp", direction: "up" },
      { label: "ATTRITION RATE", value: "8.4%", change: "-1.2pp", direction: "up" },
      { label: "PAYROLL COST", value: "₹98.4 L", change: "+3.2%", direction: "down" },
      { label: "OPEN POSITIONS", value: "6", change: "+2", direction: "neutral" },
      { label: "AVG PERFORMANCE", value: "4.2/5", change: "+0.1", direction: "up" },
    ],
  };

  const [activeKpiTab, setActiveKpiTab] = useState("FINANCE");

  const getCurrentKpis = () => {
    switch (activeKpiTab) {
      case "SALES":
        return kpiData.SALES;

      case "OPERATIONS":
        return kpiData.OPERATIONS;

      case "HR":
        return kpiData.HR;

      case "FINANCE":
      default:
        return kpiData.FINANCE;
    }
  };

  const currentKpis = getCurrentKpis();

  const revenueData = [
    { month: "MAR", value: "₹96L", height: 42 },
    { month: "APR", value: "₹132L", height: 58 },
    { month: "MAY", value: "₹115L", height: 51 },
    { month: "JUN", value: "₹173L", height: 76 },
    { month: "JUL", value: "₹216L", height: 94 },
    { month: "AUG", value: "₹163L", height: 71 },
  ];

  const revenueSplit = [
    {
      name: "Manufacturing",
      percentage: 42,
      className: "manufacturing",
    },
    {
      name: "Services",
      percentage: 28,
      className: "services",
    },
    {
      name: "Spares & Parts",
      percentage: 18,
      className: "spares",
    },
    {
      name: "Export",
      percentage: 12,
      className: "export",
    },
  ];

  const reports = [
    {
      name: "Profit & Loss Statement",
      category: "Finance",
      format: "PDF / Excel",
      lastRun: "08 Aug 2026",
      schedule: "Monthly",
    },
    {
      name: "Balance Sheet",
      category: "Finance",
      format: "PDF / Excel",
      lastRun: "08 Aug 2026",
      schedule: "Monthly",
    },
    {
      name: "Cash Flow Statement",
      category: "Finance",
      format: "PDF",
      lastRun: "01 Aug 2026",
      schedule: "Monthly",
    },
    {
      name: "Accounts Receivable Aging",
      category: "Finance",
      format: "Excel",
      lastRun: "08 Aug 2026",
      schedule: "Weekly",
    },
    {
      name: "Sales Performance Report",
      category: "Sales",
      format: "PDF / Excel",
      lastRun: "07 Aug 2026",
      schedule: "Weekly",
    },
    {
      name: "Lead Conversion Analysis",
      category: "CRM",
      format: "PDF",
      lastRun: "01 Aug 2026",
      schedule: "Monthly",
    },
    {
      name: "Inventory Valuation",
      category: "Inventory",
      format: "Excel",
      lastRun: "05 Aug 2026",
      schedule: "Weekly",
    },
    {
      name: "Payroll Summary",
      category: "HR",
      format: "PDF / Excel",
      lastRun: "31 Jul 2026",
      schedule: "Monthly",
    },
    {
      name: "Production Efficiency Report",
      category: "Manufacturing",
      format: "PDF",
      lastRun: "06 Aug 2026",
      schedule: "Daily",
    },
    {
      name: "Attendance Summary",
      category: "HR",
      format: "Excel",
      lastRun: "08 Aug 2026",
      schedule: "Weekly",
    },
  ];

  return (
    <div className="reports-page">

      {/* ================= PAGE HEADER ================= */}

      <div className="reports-header">

        <div>
          <div className="reports-eyebrow">
            ANALYTICS
          </div>

          <h1>
            Reports &amp; Analytics
          </h1>
        </div>

        <div className="reports-actions">
          <button className="schedule-btn">
            Schedule Report
          </button>

          <button className="custom-btn">
            + Custom Report
          </button>
        </div>

      </div>


      {/* ================= BUSINESS KPIs ================= */}

      <section className="kpi-card" data-kpi-tab={activeKpiTab}>

        <div className="section-header">

          <h2>
            Business KPIs
          </h2>

          <div className="kpi-tabs">
            <button
              type="button"
              className={`kpi-tab ${
                activeKpiTab === "FINANCE" ? "active" : ""
              }`}
              aria-pressed={activeKpiTab === "FINANCE"}
              onClick={() => setActiveKpiTab("FINANCE")}
            >
              FINANCE
            </button>

            <button
              type="button"
              className={`kpi-tab ${
                activeKpiTab === "SALES" ? "active" : ""
              }`}
              aria-pressed={activeKpiTab === "SALES"}
              onClick={() => setActiveKpiTab("SALES")}
            >
              SALES
            </button>

            <button
              type="button"
              className={`kpi-tab ${
                activeKpiTab === "OPERATIONS" ? "active" : ""
              }`}
              aria-pressed={activeKpiTab === "OPERATIONS"}
              onClick={() => setActiveKpiTab("OPERATIONS")}
            >
              OPERATIONS
            </button>

            <button
              type="button"
              className={`kpi-tab ${
                activeKpiTab === "HR" ? "active" : ""
              }`}
              aria-pressed={activeKpiTab === "HR"}
              onClick={() => setActiveKpiTab("HR")}
            >
              HR
            </button>
          </div>

        </div>


        <div className="kpi-grid" key={activeKpiTab}>

          {currentKpis.map((kpi, index) => (
            <div className="kpi-item" key={index}>

              <div className="kpi-label">
                {kpi.label}
              </div>

              <div className="kpi-value">
                {kpi.value}
              </div>

              <div
                className={`kpi-change ${
                  kpi.direction === "down"
                    ? "negative"
                    : ""
                }`}
              >
                <span>
                  {kpi.direction === "down" ? "↓" : "↑"}
                </span>

                {kpi.change}
              </div>

            </div>
          ))}

        </div>

      </section>


      {/* ================= CHART ROW ================= */}

      <div className="charts-row">

        {/* Revenue Trend */}

        <section className="chart-card revenue-card">

          <div className="card-heading">

            <h2>
              Revenue Trend
            </h2>

            <span>
              H1 FY2026 — Monthly
            </span>

          </div>


          <div className="bar-chart">

            {revenueData.map((item, index) => (
              <div
                className="bar-column"
                key={index}
              >

                <div className="bar-value">
                  {item.value}
                </div>

                <div className="bar-wrapper">

                  <div
                    className="revenue-bar"
                    style={{
                      height: `${item.height}%`,
                    }}
                  />

                </div>

                <div className="bar-month">
                  {item.month}
                </div>

              </div>
            ))}

          </div>

        </section>


        {/* Revenue Split */}

        <section className="chart-card split-card">

          <div className="card-heading">

            <h2>
              Revenue Split
            </h2>

          </div>


          <div className="split-list">

            {revenueSplit.map((item, index) => (
              <div
                className="split-item"
                key={index}
              >

                <div className="split-top">

                  <div className="split-name">

                    <span
                      className={`split-dot ${item.className}`}
                    />

                    {item.name}

                  </div>

                  <span>
                    {item.percentage}%
                  </span>

                </div>


                <div className="split-track">

                  <div
                    className={`split-progress ${item.className}`}
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />

                </div>

              </div>
            ))}

          </div>

        </section>

      </div>


      {/* ================= REPORT LIBRARY ================= */}

      <section className="report-library">

        <div className="library-header">

          <h2>
            Report Library
          </h2>

          <div className="report-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search reports..."
            />

          </div>

        </div>


        {/* Table Header */}

        <div className="report-table-header">

          <span>
            REPORT NAME
          </span>

          <span>
            CATEGORY
          </span>

          <span>
            FORMAT
          </span>

          <span>
            LAST RUN
          </span>

          <span>
            SCHEDULE
          </span>

          <span>
            
          </span>

        </div>


        {/* Table Rows */}

        <div className="report-table">

          {reports.map((report, index) => (
            <div
              className="report-row"
              key={index}
            >

              <div className="report-name">
                {report.name}
              </div>


              <div>
                <span className="category-badge">
                  {report.category}
                </span>
              </div>


              <div className="report-format">
                {report.format}
              </div>


              <div className="last-run">
                {report.lastRun}
              </div>


              <div>
                <span
                  className={`schedule-badge ${report.schedule.toLowerCase()}`}
                >
                  {report.schedule}
                </span>
              </div>


              <div className="report-actions-cell">

                <button className="run-btn">
                  Run
                </button>

                <button className="export-small-btn">
                  ↓ Export
                </button>

              </div>

            </div>
          ))}

        </div>

      </section>


      {/* ================= CSS ================= */}

      <style>{`

        /* =====================================================
           MAIN PAGE
        ===================================================== */

       .reports-page {
  width: 100%;
  box-sizing: border-box;

  padding: 10px 150px 75px 22px;

  background: #f5f4ef;
  color: #11140f;

  font-family:
    var(--sans),
    'DM Sans',
    system-ui,
    sans-serif;

  box-sizing: border-box;
}


        /* =====================================================
           HEADER
        ===================================================== */

        .reports-header {
          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 30px;

          margin-bottom: 20px;
        }


        .reports-eyebrow {
          margin-bottom: 7px;

          font-family:
            var(--sans),
            'DM Sans',
            sans-serif;

          font-size: 9px;

          letter-spacing: 1.5px;

          color: #99978f;
        }


        .reports-header h1 {
          margin: 0;

          font-family:
            var(--serif),
            'DM Serif Display',
            Georgia,
            serif;

          font-size: 27px;

          line-height: 1.15;

          font-weight: 400;

          color: #10130f;
        }


        .reports-actions {
          display: flex;

          align-items: center;

          gap: 9px;
        }


        .schedule-btn,
        .custom-btn {
          height: 38px;

          padding: 0 17px;

          border-radius: 12px;

          font-family:
            var(--sans),
            'DM Sans',
            sans-serif;

          font-size: 10px;

          cursor: pointer;
        }

        .kpi-tab:focus-visible {
          outline: 2px solid #9bb48c;
          outline-offset: 2px;
        }


        .schedule-btn {
          background: #fff;

          border: 1px solid #e0ddd5;

          color: #20221e;
        }


        .custom-btn {
          background: #111410;

          border: 1px solid #111410;

          color: #fff;
        }


        /* =====================================================
           COMMON CARDS
        ===================================================== */

        .kpi-card,
        .chart-card,
        .report-library {
          background: #fff;

          border: 1px solid #e2dfd7;

          border-radius: 15px;

          overflow: hidden;

          box-sizing: border-box;
        }


        /* =====================================================
           KPI SECTION
        ===================================================== */

        .kpi-card {
          margin-bottom: 20px;
        }


        .section-header {
          min-height: 54px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          padding: 0 20px;

          border-bottom: 1px solid #e4e1da;

          box-sizing: border-box;
        }
.section-header h2,
        .card-heading h2,
        .library-header h2 {
          margin: 0;

          font-family:
            var(--serif),
            'DM Serif Display',
            Georgia,
            serif;

          font-size: 17px;

          font-weight: 400;

          color: #10130f;
        }


        .kpi-tabs {
          display: flex;

          align-items: center;

          padding: 3px;

          background: #f1f0ec;

          border-radius: 11px;
        }


        .kpi-tab {
          height: 29px;

          padding: 0 13px;

          border: 0;

          background: transparent;

          border-radius: 8px;

          font-family:
            var(--sans),
            'DM Sans',
            sans-serif;

          font-size: 8px;

          letter-spacing: 1px;

          color: #99968f;

          cursor: pointer;
        }


        .kpi-tab.active {
          background: #fff;

          color: #181a16;

          box-shadow:
            0 1px 4px
            rgba(0, 0, 0, 0.08);
        }


        .kpi-grid {
          display: grid;

          grid-template-columns:
            repeat(6, minmax(0, 1fr));
        }



        .kpi-item {
          min-height: 82px;

          padding: 16px 20px 14px;

          display: flex;

          flex-direction: column;

          justify-content: flex-start;

          align-items: flex-start;

          border-right: 1px solid #e4e1da;

          box-sizing: border-box;
        }


        .kpi-item:last-child {
          border-right: 0;
        }


        .kpi-label {
          margin-bottom: 7px;

          font-family:
            var(--sans),
            'DM Sans',
            sans-serif;

          font-size: 8px;

          line-height: 1.2;

          letter-spacing: 1px;

          color: #aaa6a0;
        }


        .kpi-value {
          margin-bottom: 4px;

          font-family:
            var(--serif),
            'DM Serif Display',
            Georgia,
            serif;

          font-size: 20px;

          line-height: 1.05;

          color: #10130f;
        }


        .kpi-change {
          display: flex;

          align-items: center;

          gap: 4px;

          font-family:
            var(--sans),
            'DM Sans',
            sans-serif;

          font-size: 8px;

          line-height: 1.2;

          color: #5c6f55;
        }


        .kpi-change span {
          font-size: 15px;

          line-height: 1;
        }


        .kpi-change.negative {
          color: #9c6861;
        }


        /* =====================================================
           CHARTS
        ===================================================== */

        .charts-row {
          display: grid;

          grid-template-columns:
            minmax(0, 2fr)
            minmax(300px, 1fr);

          gap: 16px;

          margin-bottom: 18px;
        }


        .chart-card {
          min-width: 0;

          min-height: 250px;
        }


        .card-heading {
          min-height: 56px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 0 20px;
        }


        .card-heading span {
          font-family:
            var(--sans),
            'DM Sans',
            sans-serif;

          font-size: 9px;

          color: #aaa6a0;
        }


        /* =====================================================
           REVENUE BAR CHART
        ===================================================== */

        .bar-chart {
          height: 184px;

          display: flex;

          align-items: flex-end;

          gap: 13px;

          padding: 0 20px 18px;

          box-sizing: border-box;
        }


        .bar-column {
          flex: 1;

          min-width: 0;

          height: 100%;

          display: flex;

          flex-direction: column;

          justify-content: flex-end;

          align-items: center;
        }


        .bar-value {
          height: 23px;

          display: flex;

          align-items: center;

          justify-content: center;

          font-family:
            var(--sans),
            'DM Sans',
            sans-serif;

          font-size: 8px;

          color: #aaa6a0;
        }


        .bar-wrapper {
          width: 100%;

          max-width: 145px;

          height: 92px;

          display: flex;

          align-items: flex-end;
        }


        .revenue-bar {
          width: 100%;

          min-height: 8px;

          border-radius:
            8px 8px 0 0;

          background:
            linear-gradient(
              to bottom,
              #c5d6bb,
              #9db48f
            );
        }


        .bar-month {
          height: 24px;

          display: flex;

          align-items: flex-end;

          font-family:
            var(--sans),
            'DM Sans',
            sans-serif;

          font-size: 8px;

          letter-spacing: .5px;

          color: #aaa6a0;
        }


        /* =====================================================
           REVENUE SPLIT
        ===================================================== */

        .split-list {
          padding: 8px 20px 22px;
        }


        .split-item {
          margin-bottom: 18px;
        }


        .split-item:last-child {
          margin-bottom: 0;
        }


        .split-top {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 6px;

          font-family:
            var(--sans),
            'DM Sans',
            sans-serif;

          font-size: 9px;

          color: #88857f;
        }


        .split-name {
          display: flex;

          align-items: center;

          gap: 8px;
        }


        .split-dot {
          width: 10px;

          height: 10px;

          border-radius: 3px;

          display: inline-block;
        }


        .split-track {
          height: 5px;

          background: #efeee9;

          border-radius: 10px;

          overflow: hidden;
        }


        .split-progress {
          height: 100%;

          border-radius: 10px;
        }


        .manufacturing {
          background: #9bb48c;
        }


        .services {
          background: #aaa6b8;
        }


        .spares {
          background: #b0a06d;
        }


        .export {
          background: #c6d8bc;
        }


        /* =====================================================
           REPORT LIBRARY
        ===================================================== */

        .report-library {
          width: 100%;
        }


        .library-header {
          min-height: 60px;

          display: flex;

          align-items: center;

          gap: 30px;

          padding: 0 20px;

          border-bottom: 1px solid #e2dfd7;

          box-sizing: border-box;
        }


        .report-search {
          width: 300px;

          height: 34px;

          display: flex;

          align-items: center;

          gap: 8px;

          padding: 0 12px;

          border: 1px solid #e1ded7;

          background: #f8f7f3;

          border-radius: 10px;

          box-sizing: border-box;
        }


        .report-search span {
          color: #aaa6a0;

          font-size: 16px;
        }


        .report-search input {
          width: 100%;

          border: 0;

          outline: none;

          background: transparent;

          font-family:
            var(--sans),
            'DM Sans',
            sans-serif;

          font-size: 9px;

          color: #55534e;
        }


        .report-search input::placeholder {
          color: #aaa6a0;
        }


        .report-table-header,
        .report-row {
          display: grid;

          grid-template-columns:
            minmax(220px, 2.4fr)
            minmax(90px, 1.2fr)
            minmax(100px, 1.1fr)
            minmax(100px, 1.1fr)
            minmax(80px, 1fr)
            125px;

          align-items: center;

          column-gap: 8px;
        }


        .report-table-header {
          min-height: 36px;

          padding: 0 20px;

          background: #f5f4ef;

          border-bottom: 1px solid #e2dfd7;

          font-family:
            var(--sans),
            'DM Sans',
            sans-serif;

          font-size: 7px;

          letter-spacing: 1px;

          color: #aaa6a0;

          box-sizing: border-box;
        }


        .report-row {
          min-height: 55px;

          padding: 0 20px;

          border-bottom: 1px solid #e5e2db;

          box-sizing: border-box;
        }


        .report-row:last-child {
          border-bottom: 0;
        }


        .report-name {
          font-family:
            var(--serif),
            'DM Serif Display',
            Georgia,
            serif;

          font-size: 14px;

          color: #11140f;
        }


        .category-badge,
        .schedule-badge {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          min-height: 20px;

          padding: 0 9px;

          border-radius: 10px;

          font-family:
            var(--sans),
            'DM Sans',
            sans-serif;

          font-size: 8px;

          color: #88857f;

          background: #f5f3ee;

          border: 1px solid #e4e0d7;
        }


        .report-format,
        .last-run {
          font-family:
            var(--sans),
            'DM Sans',
            sans-serif;

          font-size: 9px;

          color: #99958e;
        }


        .schedule-badge.daily {
          background: #e8f0e4;

          color: #66745e;

          border: 0;
        }


        .schedule-badge.weekly {
          background: #eeeef5;

          color: #737388;

          border: 0;
        }


        .schedule-badge.monthly {
          background: #ebe9e2;

          color: #77736b;

          border: 0;
        }


        .report-actions-cell {
          display: flex;

          align-items: center;

          justify-content: flex-end;

          gap: 6px;

          min-width: 125px;

          opacity: 0;

          visibility: hidden;

          pointer-events: none;

          transition:
            opacity 0.15s ease,
            visibility 0.15s ease;
        }


        .report-row:hover .report-actions-cell,
        .report-row:focus-within .report-actions-cell {
          opacity: 1;

          visibility: visible;

          pointer-events: auto;
        }


        .run-btn,
        .export-small-btn {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          height: 27px;

          padding: 0 10px;

          border-radius: 7px;

          font-family:
            var(--sans),
            'DM Sans',
            sans-serif;

          font-size: 8px;

          white-space: nowrap;

          cursor: pointer;

          box-sizing: border-box;
        }


        .run-btn {
          background: #fff;

          color: #aaa6a0;

          border: 1px solid #e7e4de;
        }


        .export-small-btn {
          background: #9a9b9b;

          border: 1px solid #9a9b9b;

          color: #fff;
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1100px) {

          .kpi-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }


          .kpi-item:nth-child(3) {
            border-right: 0;
          }


          .kpi-item:nth-child(-n + 3) {
            border-bottom: 1px solid #e4e1da;
          }


          .charts-row {
            grid-template-columns: 1fr;
          }


          .report-table-header,
          .report-row {
            grid-template-columns:
              minmax(180px, 2fr)
              minmax(80px, 1fr)
              minmax(90px, 1fr)
              minmax(90px, 1fr)
              minmax(75px, 1fr)
              125px;

            column-gap: 6px;
          }

        }


        @media (max-width: 800px) {

          .reports-page {
            padding:
              22px 16px 40px;
          }


          .reports-header {
            align-items: flex-start;

            flex-direction: column;

            margin-bottom: 20px;
          }


          .reports-actions {
            width: 100%;
          }


          .schedule-btn,
          .custom-btn {
            flex: 1;
          }


          .section-header {
            align-items: flex-start;

            flex-direction: column;

            padding:
              18px 16px;

            gap: 12px;
          }


          .kpi-tabs {
            width: 100%;

            overflow-x: auto;
          }


          .kpi-tab {
            flex-shrink: 0;
          }


          .kpi-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }


          .kpi-item {
            border-right: 1px solid #e4e1da;
          }


          .kpi-item:nth-child(2n) {
            border-right: 0;
          }


          .kpi-item:nth-child(3) {
            border-right: 1px solid #e4e1da;
          }


          .kpi-item:nth-child(n + 3) {
            border-bottom: 0;
          }


          .kpi-item:nth-child(-n + 4) {
            border-bottom: 1px solid #e4e1da;
          }


          .library-header {
            align-items: flex-start;

            flex-direction: column;

            padding:
              17px 16px;

            gap: 12px;
          }


          .report-search {
            width: 100%;
          }


          .report-table-header {
            display: none;
          }


          .report-row {
            display: grid;

            grid-template-columns: 1fr 1fr;

            gap: 10px;

            padding:
              16px;
          }


          .report-name {
            grid-column: 1 / -1;
          }


          .report-actions-cell {
            grid-column: 1 / -1;

            justify-content: flex-start;

            min-width: 0;
          }

        }


        @media (max-width: 520px) {

          .reports-page {
            padding:
              18px 12px 35px;
          }


          .reports-header h1 {
            font-size: 24px;
          }


          .reports-actions {
            flex-direction: column;
          }


          .schedule-btn,
          .custom-btn {
            width: 100%;
          }


          .kpi-grid {
            grid-template-columns: 1fr;
          }


          .kpi-item,
          .kpi-item:nth-child(3) {
            border-right: 0;

            border-bottom: 1px solid #e4e1da;
          }


          .kpi-item:last-child {
            border-bottom: 0;
          }


          .bar-chart {
            gap: 6px;

            padding-left: 12px;

            padding-right: 12px;
          }


          .bar-value {
            font-size: 7px;
          }


          .report-row {
            grid-template-columns: 1fr;
          }


          .report-actions-cell {
            grid-column: 1;

            width: 100%;

            justify-content: flex-start;

            min-width: 0;
          }

          .run-btn,
          .export-small-btn {
            flex-shrink: 0;
          }

        }

      `}</style>

    </div>
  );
};

export default Dashboard;