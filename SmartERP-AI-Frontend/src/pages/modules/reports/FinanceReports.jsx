import React, { useMemo, useState } from "react";

const ReportsAnalytics = () => {
  const [activeKpiTab, setActiveKpiTab] = useState("FINANCE");
  const [searchTerm, setSearchTerm] = useState("");

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
      { label: "EMPLOYEES", value: "284", change: "+12", direction: "up" },
      { label: "ATTENDANCE", value: "94.8%", change: "+1.8pp", direction: "up" },
      { label: "TURNOVER", value: "5.2%", change: "-1.4pp", direction: "up" },
      { label: "OPEN POSITIONS", value: "18", change: "-4", direction: "up" },
      { label: "AVG. TENURE", value: "3.8y", change: "+0.4y", direction: "up" },
      { label: "TRAINING", value: "82.4%", change: "+6.2%", direction: "up" },
    ],
  };

  const revenueData = [
    { month: "MAR", value: 96 },
    { month: "APR", value: 132 },
    { month: "MAY", value: 115 },
    { month: "JUN", value: 173 },
    { month: "JUL", value: 216 },
    { month: "AUG", value: 163 },
  ];

  const revenueSplit = [
    { name: "Manufacturing", value: 42 },
    { name: "Services", value: 28 },
    { name: "Spares & Parts", value: 18 },
    { name: "Export", value: 12 },
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

  const filteredReports = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) {
      return reports;
    }

    return reports.filter(
      (report) =>
        report.name.toLowerCase().includes(value) ||
        report.category.toLowerCase().includes(value) ||
        report.format.toLowerCase().includes(value)
    );
  }, [searchTerm]);

  const currentKpis = kpiData[activeKpiTab] ?? kpiData.FINANCE;

  const handleScheduleReport = () => {
    alert("Schedule Report clicked");
  };

  const handleCustomReport = () => {
    alert("Custom Report clicked");
  };

  const handleRun = (reportName) => {
    alert(`Running ${reportName}`);
  };

  const handleExport = (reportName) => {
    alert(`Exporting ${reportName}`);
  };

  return (
    <div className="reports-page">
      {/* PAGE HEADER */}
      <div className="reports-page-header">
        <div>
          <div className="reports-eyebrow">ANALYTICS</div>

          <h1>Reports &amp; Analytics</h1>
        </div>

        <div className="reports-actions">
          <button
            type="button"
            className="reports-btn reports-btn-secondary"
            onClick={handleScheduleReport}
          >
            Schedule Report
          </button>

          <button
            type="button"
            className="reports-btn reports-btn-primary"
            onClick={handleCustomReport}
          >
            + Custom Report
          </button>
        </div>
      </div>

      {/* BUSINESS KPIs */}
      <section className="reports-card kpi-card">
        <div className="kpi-header">
          <h2>Business KPIs</h2>

          <div className="kpi-tabs">
            {Object.keys(kpiData).map((tab) => (
              <button
                key={tab}
                type="button"
                className={`kpi-tab ${
                  activeKpiTab === tab ? "active" : ""
                }`}
                onClick={() => setActiveKpiTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="kpi-grid">
          {currentKpis.map((kpi) => (
            <div className="kpi-item" key={kpi.label}>
              <span className="kpi-label">{kpi.label}</span>

              <strong className="kpi-value">{kpi.value}</strong>

              <span
                className={`kpi-change ${
                  kpi.direction === "down" ? "negative" : ""
                }`}
              >
                {kpi.direction === "down" ? "↓" : "↑"} {kpi.change}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CHARTS */}
      <div className="analytics-grid">
        {/* REVENUE TREND */}
        <section className="reports-card revenue-card">
          <div className="section-header">
            <h2>Revenue Trend</h2>

            <span>H1 FY2026 — Monthly</span>
          </div>

          <div className="revenue-chart">
            <div className="bars">
              {revenueData.map((item) => (
                <div className="bar-column" key={item.month}>
                  <span className="bar-value">₹{item.value}L</span>

                  <div
                    className="revenue-bar"
                    style={{
                      height: `${(item.value / 216) * 90}px`,
                    }}
                  />

                  <span className="bar-month">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVENUE SPLIT */}
        <section className="reports-card split-card">
          <div className="section-header">
            <h2>Revenue Split</h2>
          </div>

          <div className="split-list">
            {revenueSplit.map((item) => (
              <div className="split-item" key={item.name}>
                <div className="split-title">
                  <div className="split-name">
                    <span className="split-dot" />
                    {item.name}
                  </div>

                  <span>{item.value}%</span>
                </div>

                <div className="split-track">
                  <div
                    className="split-progress"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* REPORT LIBRARY */}
      <section className="reports-card report-library">
        <div className="library-header">
          <h2>Report Library</h2>

          <div className="report-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        <div className="report-table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>REPORT NAME</th>
                <th>CATEGORY</th>
                <th>FORMAT</th>
                <th>LAST RUN</th>
                <th>SCHEDULE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.name}>
                  <td className="report-name">{report.name}</td>

                  <td>
                    <span className="category-badge">
                      {report.category}
                    </span>
                  </td>

                  <td className="format-text">{report.format}</td>

                  <td className="date-text">{report.lastRun}</td>

                  <td>
                    <span className="schedule-badge">
                      {report.schedule}
                    </span>
                  </td>

                  <td>
                    <div className="report-actions">
                      <button
                        type="button"
                        className="table-action run-action"
                        onClick={() => handleRun(report.name)}
                      >
                        Run
                      </button>

                      <button
                        type="button"
                        className="table-action export-action"
                        onClick={() => handleExport(report.name)}
                      >
                        ↓ Export
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-results">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* PAGE CSS */}
      <style>{`
        .reports-page {
          width: 100%;
          box-sizing: border-box;
          color: #111410;
          font-family: "DM Sans", system-ui, sans-serif;
        }

        .reports-page *,
        .reports-page *::before,
        .reports-page *::after {
          box-sizing: border-box;
        }

        /* PAGE HEADER */

        .reports-page-header {
          min-height: 108px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .reports-eyebrow {
          margin-bottom: 7px;
          color: #99988f;
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 9px;
          letter-spacing: 1.6px;
        }

        .reports-page-header h1 {
          margin: 0;
          color: #10130f;
          font-family: "DM Serif Display", Georgia, serif;
          font-size: 28px;
          font-weight: 400;
          line-height: 1.15;
        }

        .reports-actions {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .reports-btn {
          height: 38px;
          padding: 0 17px;
          border-radius: 12px;
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 10px;
          cursor: pointer;
          white-space: nowrap;
        }

        .reports-btn-secondary {
          background: #fff;
          border: 1px solid #e1ded7;
          color: #20221e;
        }

        .reports-btn-primary {
          background: #111410;
          border: 1px solid #111410;
          color: #fff;
        }

        /* COMMON CARD */

        .reports-card {
          width: 100%;
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 15px;
          overflow: hidden;
        }

        .reports-card h2 {
          margin: 0;
          color: #10130f;
          font-family: "DM Serif Display", Georgia, serif;
          font-size: 17px;
          font-weight: 400;
        }

        /* KPI */

        .kpi-header {
          min-height: 67px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid #e5e2dc;
        }

        .kpi-tabs {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 3px;
          background: #f2f1ed;
          border-radius: 11px;
        }

        .kpi-tab {
          height: 29px;
          padding: 0 15px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #99978f;
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 8px;
          letter-spacing: 1.1px;
          cursor: pointer;
        }

        .kpi-tab.active {
          background: #fff;
          color: #171914;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
        }

        .kpi-item {
          animation: kpiFadeIn 160ms ease-out;
        }

        @keyframes kpiFadeIn {
          from {
            opacity: 0.35;
            transform: translateY(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .kpi-item {
          min-height: 110px;
          padding: 20px;
          border-right: 1px solid #e5e2dc;
        }

        .kpi-item:last-child {
          border-right: 0;
        }

        .kpi-label {
          display: block;
          margin-bottom: 9px;
          color: #aaa69e;
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 8px;
          letter-spacing: 1px;
        }

        .kpi-value {
          display: block;
          margin-bottom: 6px;
          color: #111410;
          font-family: "DM Serif Display", Georgia, serif;
          font-size: 20px;
          font-weight: 400;
          line-height: 1;
        }

        .kpi-change {
          color: #5c7160;
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 9px;
        }

        .kpi-change.negative {
          color: #9a6868;
        }

        /* ANALYTICS */

        .analytics-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
          gap: 16px;
          margin-top: 20px;
        }

        .revenue-card,
        .split-card {
          min-height: 228px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 21px 20px 0;
        }

        .section-header > span {
          color: #aaa69e;
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 9px;
        }

        /* REVENUE CHART */

        .revenue-chart {
          height: 175px;
          padding: 15px 20px 15px;
          display: flex;
          align-items: flex-end;
        }

        .bars {
          width: 100%;
          height: 125px;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          align-items: end;
          gap: 12px;
        }

        .bar-column {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 7px;
        }

        .bar-value {
          color: #aaa69e;
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 8px;
        }

        .revenue-bar {
          width: 100%;
          max-width: 132px;
          min-height: 30px;
          background: #a8bd9b;
          border-radius: 8px 8px 0 0;
        }

        .bar-month {
          color: #aaa69e;
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 8px;
        }

        /* REVENUE SPLIT */

        .split-list {
          padding: 16px 20px 20px;
        }

        .split-item {
          margin-bottom: 14px;
        }

        .split-item:last-child {
          margin-bottom: 0;
        }

        .split-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          color: #77766f;
          font-size: 9px;
        }

        .split-name {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .split-dot {
          width: 9px;
          height: 9px;
          border-radius: 3px;
          background: #9eaf91;
        }

        .split-item:nth-child(2) .split-dot {
          background: #aaa7b7;
        }

        .split-item:nth-child(3) .split-dot {
          background: #afa16e;
        }

        .split-item:nth-child(4) .split-dot {
          background: #c6d5bc;
        }

        .split-track {
          width: 100%;
          height: 6px;
          background: #f0efeb;
          border-radius: 5px;
          overflow: hidden;
        }

        .split-progress {
          height: 100%;
          background: #9eaf91;
          border-radius: 5px;
        }

        /* REPORT LIBRARY */

        .report-library {
          margin-top: 20px;
        }

        .library-header {
          min-height: 66px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 25px;
          border-bottom: 1px solid #e5e2dc;
        }

        .report-search {
          width: 320px;
          height: 34px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 11px;
          border: 1px solid #e0ddd6;
          border-radius: 10px;
          background: #f8f7f3;
        }

        .report-search span {
          color: #9e9b94;
          font-size: 16px;
        }

        .report-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #30322d;
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 10px;
        }

        .report-search input::placeholder {
          color: #aaa69e;
        }

        .report-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .report-table {
          width: 100%;
          min-width: 900px;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .report-table th {
          height: 40px;
          padding: 0 20px;
          background: #f7f6f2;
          border-bottom: 1px solid #e5e2dc;
          color: #aaa69e;
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 8px;
          font-weight: 400;
          letter-spacing: 1px;
          text-align: left;
        }

        .report-table th:nth-child(1) {
          width: 29%;
        }

        .report-table th:nth-child(2) {
          width: 16%;
        }

        .report-table th:nth-child(3) {
          width: 13%;
        }

        .report-table th:nth-child(4) {
          width: 14%;
        }

        .report-table th:nth-child(5) {
          width: 12%;
        }

        .report-table th:nth-child(6) {
          width: 16%;
        }

        .report-table td {
          height: 56px;
          padding: 0 20px;
          border-bottom: 1px solid #e5e2dc;
          color: #34362f;
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 9px;
        }

        .report-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .report-name {
          color: #10130f !important;
          font-family: "DM Serif Display", Georgia, serif !important;
          font-size: 14px !important;
        }

        .format-text,
        .date-text {
          color: #88857e !important;
        }

        .category-badge,
        .schedule-badge {
          display: inline-flex;
          align-items: center;
          min-height: 20px;
          padding: 0 9px;
          border: 1px solid #e2dfd8;
          border-radius: 10px;
          background: #f8f7f3;
          color: #85827b;
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 8px;
        }

        .schedule-badge {
          border: 0;
          background: #e9e8e3;
        }

        .report-actions {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .table-action {
          height: 26px;
          padding: 0 9px;
          border-radius: 7px;
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 8px;
          cursor: pointer;
        }

        .run-action {
          border: 1px solid #e5e2dc;
          background: #fff;
          color: #aaa69e;
        }

        .export-action {
          border: 0;
          background: #a9aaa7;
          color: #fff;
        }

        .no-results {
          height: 100px !important;
          text-align: center;
          color: #999 !important;
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {
          .kpi-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .kpi-item:nth-child(3) {
            border-right: 0;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .reports-page-header {
            align-items: flex-start;
            flex-direction: column;
            padding: 20px 0;
          }

          .reports-actions {
            width: 100%;
          }

          .reports-btn {
            flex: 1;
          }

          .kpi-header {
            align-items: flex-start;
            flex-direction: column;
            padding: 18px 15px;
          }

          .kpi-tabs {
            width: 100%;
            overflow-x: auto;
          }

          .kpi-tab {
            flex-shrink: 0;
          }

          .kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .kpi-item {
            padding: 16px;
          }

          .kpi-item:nth-child(3) {
            border-right: 1px solid #e5e2dc;
          }

          .kpi-item:nth-child(even) {
            border-right: 0;
          }

          .library-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
            padding: 16px;
          }

          .report-search {
            width: 100%;
          }

          .section-header {
            padding-left: 16px;
            padding-right: 16px;
          }

          .revenue-chart {
            padding-left: 16px;
            padding-right: 16px;
          }
        }

        @media (max-width: 480px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }

          .kpi-item,
          .kpi-item:nth-child(3) {
            border-right: 0;
            border-bottom: 1px solid #e5e2dc;
          }

          .kpi-item:last-child {
            border-bottom: 0;
          }

          .reports-page-header h1 {
            font-size: 25px;
          }

          .reports-actions {
            flex-direction: column;
          }

          .reports-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportsAnalytics;