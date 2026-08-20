import React, { useMemo, useState } from "react";

const SalesReports = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("SALES");

  const categories = ["FINANCE", "SALES", "OPERATIONS", "HR"];

  const kpis = [
    { label: "REVENUE MTD", value: "₹1.42 Cr", change: "↑ +18%", positive: true },
    { label: "ORDERS BOOKED", value: "₹14.1 L", change: "↑ +42%", positive: true },
    { label: "WIN RATE", value: "28%", change: "↑ +3pp", positive: true },
    { label: "AVG DEAL SIZE", value: "₹8.2 L", change: "↓ -4%", positive: false },
    { label: "PIPELINE VALUE", value: "₹2.4 Cr", change: "↑ +12%", positive: true },
    { label: "AVG CLOSE TIME", value: "18d", change: "↑ -2d", positive: true },
  ];

  const reportRows = [
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

  const filteredRows = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return reportRows;

    return reportRows.filter((row) =>
      `${row.name} ${row.category} ${row.format} ${row.lastRun} ${row.schedule}`
        .toLowerCase()
        .includes(value)
    );
  }, [search]);

  const revenue = [
    { month: "MAR", value: 96 },
    { month: "APR", value: 132 },
    { month: "MAY", value: 115 },
    { month: "JUN", value: 173 },
    { month: "JUL", value: 216 },
    { month: "AUG", value: 163 },
  ];

  const revenueSplit = [
    { name: "Manufacturing", value: 42, tone: "green" },
    { name: "Services", value: 28, tone: "purple" },
    { name: "Spares & Parts", value: 18, tone: "gold" },
    { name: "Export", value: 12, tone: "light" },
  ];

  return (
    <div className="sales-reports-page">
      <div className="sales-page-inner">

        {/* PAGE HEADER */}
        <header className="sales-page-header">
          <div>
            <div className="sales-eyebrow">ANALYTICS</div>
            <h1>Reports &amp; Analytics</h1>
          </div>

          <div className="sales-header-actions">
            <button className="sales-secondary-btn">
              Schedule Report
            </button>
            <button className="sales-primary-btn">
              + Custom Report
            </button>
          </div>
        </header>

        {/* KPI CARD */}
        <section className="sales-kpi-card">
          <div className="sales-card-heading">
            <h2>Business KPIs</h2>

            <div className="sales-category-tabs">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`sales-category-tab ${
                    activeCategory === category ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="sales-kpi-grid">
            {kpis.map((kpi) => (
              <div className="sales-kpi" key={kpi.label}>
                <span className="sales-kpi-label">{kpi.label}</span>
                <strong>{kpi.value}</strong>
                <span
                  className={`sales-kpi-change ${
                    kpi.positive ? "positive" : "negative"
                  }`}
                >
                  {kpi.change}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CHARTS */}
        <section className="sales-chart-grid">
          <div className="sales-panel revenue-panel">
            <div className="sales-panel-header">
              <h2>Revenue Trend</h2>
              <span>H1 FY2026 — Monthly</span>
            </div>

            <div className="sales-bars">
              {revenue.map((item) => (
                <div className="sales-bar-column" key={item.month}>
                  <span className="sales-bar-value">₹{item.value}L</span>
                  <div className="sales-bar-track">
                    <div
                      className="sales-bar"
                      style={{ height: `${Math.max(item.value * 0.42, 35)}%` }}
                    />
                  </div>
                  <span className="sales-bar-month">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sales-panel split-panel">
            <div className="sales-panel-header">
              <h2>Revenue Split</h2>
            </div>

            <div className="sales-split-list">
              {revenueSplit.map((item) => (
                <div className="sales-split-item" key={item.name}>
                  <div className="sales-split-top">
                    <span className={`sales-dot ${item.tone}`} />
                    <span>{item.name}</span>
                    <strong>{item.value}%</strong>
                  </div>

                  <div className="sales-progress">
                    <div
                      className={`sales-progress-fill ${item.tone}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REPORT LIBRARY */}
        <section className="sales-report-library">
          <div className="sales-library-header">
            <h2>Report Library</h2>

            <div className="sales-report-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search reports..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="sales-report-table">
            <div className="sales-report-table-header">
              <span>REPORT NAME</span>
              <span>CATEGORY</span>
              <span>FORMAT</span>
              <span>LAST RUN</span>
              <span>SCHEDULE</span>
              <span className="sales-action-heading">ACTIONS</span>
            </div>

            {filteredRows.map((row) => (
              <div className="sales-report-row" key={row.name}>
                <span className="sales-report-name">{row.name}</span>

                <span>
                  <span className="sales-category-pill">{row.category}</span>
                </span>

                <span className="sales-muted">{row.format}</span>

                <span className="sales-muted">{row.lastRun}</span>

                <span>
                  <span
                    className={`sales-schedule-pill ${
                      row.schedule.toLowerCase()
                    }`}
                  >
                    {row.schedule}
                  </span>
                </span>

                {/* Figma-style mouse dependency:
                    buttons appear only for the hovered/focused row. */}
                <span className="sales-row-actions">
                  <button className="sales-run-btn" type="button">
                    Run
                  </button>
                  <button className="sales-export-btn" type="button">
                    ↓ Export
                  </button>
                </span>
              </div>
            ))}

            {filteredRows.length === 0 && (
              <div className="sales-empty-state">
                No reports found.
              </div>
            )}
          </div>
        </section>
      </div>

      <style>{`
        .sales-reports-page {
          width: 100%;
          min-height: 100%;
          box-sizing: border-box;
          background: #f5f4ef;
          color: #10130f;
          font-family: var(--sans, 'DM Sans', system-ui, sans-serif);
          -webkit-font-smoothing: antialiased;
        }

        .sales-page-inner {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 28px 22px 24px;
          box-sizing: border-box;
        }

        .sales-page-header {
          min-height: 78px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 22px;
        }

        .sales-eyebrow {
          margin: 2px 0 6px;
          font-size: 9px;
          line-height: 1.2;
          letter-spacing: 1.5px;
          color: #98958d;
        }

        .sales-page-header h1 {
          margin: 0;
          font-family: var(--serif, 'DM Serif Display', Georgia, serif);
          font-size: 28px;
          line-height: 1.15;
          font-weight: 400;
          color: #10130f;
        }

        .sales-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 8px;
        }

        .sales-secondary-btn,
        .sales-primary-btn {
          height: 38px;
          padding: 0 17px;
          border-radius: 12px;
          font-family: var(--sans, 'DM Sans', sans-serif);
          font-size: 9px;
          letter-spacing: .2px;
          cursor: pointer;
          white-space: nowrap;
        }

        .sales-secondary-btn {
          background: #fff;
          border: 1px solid #e0ddd5;
          color: #20221e;
        }

        .sales-primary-btn {
          background: #111410;
          border: 1px solid #111410;
          color: #fff;
        }

        .sales-kpi-card,
        .sales-panel,
        .sales-report-library {
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 15px;
          overflow: hidden;
          box-sizing: border-box;
        }

        .sales-kpi-card {
          margin-bottom: 20px;
        }

        .sales-card-heading {
          min-height: 67px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid #e5e2db;
        }

        .sales-card-heading h2,
        .sales-panel-header h2,
        .sales-library-header h2 {
          margin: 0;
          font-family: var(--serif, 'DM Serif Display', Georgia, serif);
          font-size: 16px;
          line-height: 1.2;
          font-weight: 400;
        }

        .sales-category-tabs {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 3px;
          background: #f1f0eb;
          border-radius: 12px;
        }

        .sales-category-tab {
          height: 30px;
          padding: 0 14px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #8b8982;
          font-family: var(--sans, 'DM Sans', sans-serif);
          font-size: 8px;
          letter-spacing: 1.1px;
          cursor: pointer;
        }

        .sales-category-tab.active {
          background: #fff;
          color: #151713;
          box-shadow: 0 1px 4px rgba(0, 0, 0, .08);
        }

        .sales-kpi-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
        }

        .sales-kpi {
          min-height: 108px;
          padding: 22px 20px 17px;
          border-right: 1px solid #e5e2db;
          box-sizing: border-box;
        }

        .sales-kpi:last-child {
          border-right: 0;
        }

        .sales-kpi-label {
          display: block;
          margin-bottom: 9px;
          font-size: 8px;
          letter-spacing: 1px;
          color: #aaa79f;
        }

        .sales-kpi strong {
          display: block;
          margin-bottom: 5px;
          font-family: var(--serif, 'DM Serif Display', Georgia, serif);
          font-size: 20px;
          line-height: 1;
          font-weight: 400;
        }

        .sales-kpi-change {
          font-size: 9px;
        }

        .sales-kpi-change.positive {
          color: #52644d;
        }

        .sales-kpi-change.negative {
          color: #a35d57;
        }

        .sales-chart-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(330px, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .sales-panel {
          min-height: 228px;
        }

        .sales-panel-header {
          min-height: 58px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .sales-panel-header span {
          font-size: 9px;
          color: #aaa79f;
        }

        .sales-bars {
          height: 164px;
          padding: 0 20px 17px;
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          align-items: end;
          gap: 12px;
          box-sizing: border-box;
        }

        .sales-bar-column {
          height: 145px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: stretch;
          min-width: 0;
        }

        .sales-bar-value {
          margin-bottom: 7px;
          text-align: center;
          font-size: 8px;
          color: #aaa79f;
        }

        .sales-bar-track {
          height: 91px;
          display: flex;
          align-items: flex-end;
        }

        .sales-bar {
          width: 100%;
          max-height: 100%;
          min-height: 20px;
          border-radius: 8px 8px 0 0;
          background: linear-gradient(
            to bottom,
            #c8dbbd,
            #9bb18c
          );
        }

        .sales-bar-month {
          margin-top: 8px;
          text-align: center;
          font-size: 8px;
          color: #aaa79f;
        }

        .sales-split-list {
          padding: 4px 20px 18px;
        }

        .sales-split-item {
          margin-bottom: 13px;
        }

        .sales-split-item:last-child {
          margin-bottom: 0;
        }

        .sales-split-top {
          display: grid;
          grid-template-columns: 12px 1fr auto;
          align-items: center;
          gap: 7px;
          margin-bottom: 5px;
          font-size: 9px;
          color: #8e8b84;
        }

        .sales-split-top strong {
          font-weight: 400;
          color: #77736d;
        }

        .sales-dot {
          width: 9px;
          height: 9px;
          border-radius: 3px;
          display: block;
        }

        .sales-dot.green,
        .sales-progress-fill.green {
          background: #9bb18c;
        }

        .sales-dot.purple,
        .sales-progress-fill.purple {
          background: #aaa6b9;
        }

        .sales-dot.gold,
        .sales-progress-fill.gold {
          background: #aa9c69;
        }

        .sales-dot.light,
        .sales-progress-fill.light {
          background: #c7dbbe;
        }

        .sales-progress {
          height: 6px;
          margin-left: 21px;
          overflow: hidden;
          border-radius: 5px;
          background: #f0eee9;
        }

        .sales-progress-fill {
          height: 100%;
          border-radius: inherit;
        }

        .sales-library-header {
          min-height: 68px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 22px;
          border-bottom: 1px solid #e5e2db;
        }

        .sales-report-search {
          width: 320px;
          max-width: 100%;
          height: 34px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 11px;
          box-sizing: border-box;
          border: 1px solid #e0ddd5;
          border-radius: 10px;
          background: #f8f7f3;
        }

        .sales-report-search span {
          font-size: 15px;
          line-height: 1;
          color: #aaa79f;
        }

        .sales-report-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          font-family: var(--sans, 'DM Sans', sans-serif);
          font-size: 9px;
          color: #33362f;
        }

        .sales-report-search input::placeholder {
          color: #aaa79f;
        }

        .sales-report-table {
          width: 100%;
          overflow-x: auto;
        }

        .sales-report-table-header,
        .sales-report-row {
          min-width: 930px;
          display: grid;
          grid-template-columns:
            minmax(270px, 2.3fr)
            minmax(95px, 1fr)
            minmax(115px, 1fr)
            minmax(115px, 1fr)
            minmax(100px, 1fr)
            125px;
          align-items: center;
          column-gap: 8px;
          box-sizing: border-box;
        }

        .sales-report-table-header {
          min-height: 37px;
          padding: 0 20px;
          background: #f7f6f2;
          border-bottom: 1px solid #e5e2db;
          font-size: 8px;
          letter-spacing: 1px;
          color: #aaa79f;
        }

        .sales-report-row {
          min-height: 56px;
          padding: 0 20px;
          border-bottom: 1px solid #e5e2db;
          transition: background .15s ease;
        }

        .sales-report-row:last-child {
          border-bottom: 0;
        }

        .sales-report-row:hover {
          background: #fbfaf7;
        }

        .sales-report-name {
          font-family: var(--serif, 'DM Serif Display', Georgia, serif);
          font-size: 14px;
          color: #10130f;
        }

        .sales-muted {
          font-size: 9px;
          color: #88857e;
        }

        .sales-category-pill,
        .sales-schedule-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 21px;
          padding: 0 10px;
          box-sizing: border-box;
          border: 1px solid #e2dfd7;
          border-radius: 9px;
          font-size: 8px;
          color: #817e77;
          background: #f8f7f3;
          white-space: nowrap;
        }

        .sales-schedule-pill {
          border: 0;
          background: #ebe9e2;
        }

        .sales-schedule-pill.weekly {
          background: #efeff7;
        }

        .sales-schedule-pill.daily {
          background: #e7f0e2;
        }

        .sales-action-heading {
          text-align: right;
        }

        /* EXACT Figma-style mouse dependency:
           actions are hidden until the row is hovered/focused. */
        .sales-row-actions {
          min-width: 125px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition:
            opacity .15s ease,
            visibility .15s ease;
        }

        .sales-report-row:hover .sales-row-actions,
        .sales-report-row:focus-within .sales-row-actions {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }

        .sales-run-btn,
        .sales-export-btn {
          height: 27px;
          padding: 0 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          border-radius: 7px;
          font-family: var(--sans, 'DM Sans', sans-serif);
          font-size: 8px;
          white-space: nowrap;
          cursor: pointer;
        }

        .sales-run-btn {
          background: #fff;
          border: 1px solid #e1dfd8;
          color: #8b8982;
        }

        .sales-export-btn {
          background: #aeb0ae;
          border: 1px solid #aeb0ae;
          color: #fff;
        }

        .sales-empty-state {
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #99958d;
        }

        @media (max-width: 1100px) {
          .sales-page-inner {
            padding-left: 18px;
            padding-right: 18px;
          }

          .sales-kpi-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .sales-kpi:nth-child(3) {
            border-right: 0;
          }

          .sales-kpi:nth-child(-n + 3) {
            border-bottom: 1px solid #e5e2db;
          }

          .sales-chart-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .sales-page-inner {
            padding: 20px 14px;
          }

          .sales-page-header {
            flex-direction: column;
            margin-bottom: 18px;
          }

          .sales-header-actions {
            width: 100%;
            padding-top: 0;
          }

          .sales-secondary-btn,
          .sales-primary-btn {
            flex: 1;
          }

          .sales-card-heading {
            align-items: flex-start;
            flex-direction: column;
            padding-top: 16px;
            padding-bottom: 16px;
          }

          .sales-category-tabs {
            width: 100%;
            overflow-x: auto;
          }

          .sales-category-tab {
            flex: 1;
            min-width: 80px;
          }

          .sales-kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .sales-kpi:nth-child(3) {
            border-right: 1px solid #e5e2db;
          }

          .sales-kpi:nth-child(even) {
            border-right: 0;
          }

          .sales-kpi:nth-child(3),
          .sales-kpi:nth-child(4) {
            border-bottom: 1px solid #e5e2db;
          }

          .sales-library-header {
            align-items: flex-start;
            flex-direction: column;
            padding-top: 16px;
            padding-bottom: 16px;
            gap: 12px;
          }

          .sales-report-search {
            width: 100%;
          }
        }

        @media (max-width: 520px) {
          .sales-page-header h1 {
            font-size: 25px;
          }

          .sales-header-actions {
            flex-direction: column;
          }

          .sales-secondary-btn,
          .sales-primary-btn {
            width: 100%;
          }

          .sales-kpi {
            min-height: 98px;
            padding: 18px 14px;
          }

          .sales-kpi strong {
            font-size: 18px;
          }

          .sales-panel-header {
            padding: 0 14px;
          }

          .sales-bars {
            padding-left: 14px;
            padding-right: 14px;
            gap: 7px;
          }

          .sales-report-table-header,
          .sales-report-row {
            min-width: 900px;
          }
        }
      `}</style>
    </div>
  );
};

export default SalesReports;