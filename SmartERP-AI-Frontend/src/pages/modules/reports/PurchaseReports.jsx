import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../core/constants/routes.constant";

const OperationsReports = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

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
      actions: true,
    },
    {
      name: "Sales Performance Report",
      category: "Sales",
      format: "PDF / Excel",
      lastRun: "07 Aug 2026",
      schedule: "Weekly",
      actions: true,
    },
    {
      name: "Lead Conversion Analysis",
      category: "CRM",
      format: "PDF",
      lastRun: "01 Aug 2026",
      schedule: "Monthly",
      actions: true,
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
    const value = search.trim().toLowerCase();

    if (!value) return reports;

    return reports.filter((report) =>
      [
        report.name,
        report.category,
        report.format,
        report.lastRun,
        report.schedule,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [search]);

  const goTo = (route) => {
    if (route) navigate(route);
  };

  return (
    <div className="operations-reports-page">
      <div className="operations-page-header">
        <div>
          <div className="operations-eyebrow">ANALYTICS</div>
          <h1>Reports &amp; Analytics</h1>
        </div>

        <div className="operations-header-actions">
          <button type="button" className="operations-outline-btn">
            Schedule Report
          </button>

          <button type="button" className="operations-dark-btn">
            + Custom Report
          </button>
        </div>
      </div>

      <section className="operations-kpi-card">
        <div className="operations-kpi-header">
          <h2>Business KPIs</h2>

          <div className="operations-kpi-tabs">
            <button
              type="button"
              className="operations-kpi-tab"
              onClick={() => goTo(ROUTES.SUPER_ADMIN_REPORTS)}
            >
              FINANCE
            </button>

            <button
              type="button"
              className="operations-kpi-tab"
              onClick={() => goTo(ROUTES.SUPER_ADMIN_REPORTS_SALES)}
            >
              SALES
            </button>

            <button
              type="button"
              className="operations-kpi-tab active"
            >
              OPERATIONS
            </button>

            <button
              type="button"
              className="operations-kpi-tab"
              onClick={() => goTo(ROUTES.SUPER_ADMIN_REPORTS_HR)}
            >
              HR
            </button>
          </div>
        </div>

        <div className="operations-kpi-grid">
          <div className="operations-kpi">
            <span>OEE</span>
            <strong>84%</strong>
            <small className="positive">↑ +3pp</small>
          </div>

          <div className="operations-kpi">
            <span>ON-TIME DELIVERY</span>
            <strong>92%</strong>
            <small className="positive">↑ +4pp</small>
          </div>

          <div className="operations-kpi">
            <span>REJECTION RATE</span>
            <strong>0.4%</strong>
            <small className="positive">↑ -0.2pp</small>
          </div>

          <div className="operations-kpi">
            <span>STOCK VALUE</span>
            <strong>₹2.44 Cr</strong>
            <small className="positive">↑ +6%</small>
          </div>

          <div className="operations-kpi">
            <span>PO FILL RATE</span>
            <strong>96%</strong>
            <small className="positive">↑ +2pp</small>
          </div>

          <div className="operations-kpi">
            <span>MACHINE UPTIME</span>
            <strong>80%</strong>
            <small className="negative">↓ -5pp</small>
          </div>
        </div>
      </section>

      <div className="operations-chart-grid">
        <section className="operations-panel revenue-trend-panel">
          <div className="operations-panel-header">
            <h2>Revenue Trend</h2>
            <span>H1 FY2026 — Monthly</span>
          </div>

          <div className="operations-chart">
            {[
              ["MAR", "₹96L", 42],
              ["APR", "₹132L", 55],
              ["MAY", "₹115L", 48],
              ["JUN", "₹173L", 72],
              ["JUL", "₹216L", 86],
              ["AUG", "₹163L", 66],
            ].map(([month, value, height]) => (
              <div className="operations-bar-column" key={month}>
                <span className="operations-bar-value">{value}</span>
                <div
                  className="operations-bar"
                  style={{ height: `${height}px` }}
                />
                <span className="operations-month">{month}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="operations-panel split-panel">
          <div className="operations-panel-header">
            <h2>Revenue Split</h2>
          </div>

          <div className="operations-split-list">
            {[
              ["Manufacturing", "42%", "42"],
              ["Services", "28%", "28"],
              ["Spares & Parts", "18%", "18"],
              ["Export", "12%", "12"],
            ].map(([label, percent, width]) => (
              <div className="operations-split-item" key={label}>
                <div className="operations-split-label">
                  <span className="operations-dot" />
                  <span>{label}</span>
                  <b>{percent}</b>
                </div>

                <div className="operations-progress">
                  <div style={{ width: `${width}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="operations-library">
        <div className="operations-library-header">
          <h2>Report Library</h2>

          <div className="operations-search">
            <span>⌕</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports..."
              aria-label="Search reports"
            />
          </div>
        </div>

        <div className="operations-table-wrap">
          <div className="operations-table-head">
            <span>REPORT NAME</span>
            <span>CATEGORY</span>
            <span>FORMAT</span>
            <span>LAST RUN</span>
            <span>SCHEDULE</span>
            <span />
          </div>

          {filteredReports.map((report) => (
            <div className="operations-report-row" key={report.name}>
              <span className="operations-report-name">{report.name}</span>

              <span>
                <em className="operations-category">{report.category}</em>
              </span>

              <span>{report.format}</span>

              <span>{report.lastRun}</span>

              <span>
                <em className={`operations-schedule ${report.schedule.toLowerCase()}`}>
                  {report.schedule}
                </em>
              </span>

              <span className="operations-row-actions">
                {report.actions && (
                  <>
                    <button type="button" className="run-btn">
                      Run
                    </button>

                    <button type="button" className="export-row-btn">
                      ↓ Export
                    </button>
                  </>
                )}
              </span>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="operations-empty">
              No reports found.
            </div>
          )}
        </div>
      </section>

      <style>{`
        .operations-reports-page {
          width: 100%;
          min-height: 100%;
          box-sizing: border-box;
          padding: 26px 22px 30px;
          background: #f5f4ef;
          color: #10130f;
          font-family: var(--sans, "DM Sans", system-ui, sans-serif);
        }

        .operations-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
        }

        .operations-eyebrow {
          margin-bottom: 7px;
          color: #99988f;
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 1.5px;
        }

        .operations-page-header h1 {
          margin: 0;
          font-family: var(--serif, "DM Serif Display", Georgia, serif);
          font-size: 29px;
          line-height: 1.1;
          font-weight: 400;
        }

        .operations-header-actions {
          display: flex;
          gap: 9px;
          flex-shrink: 0;
        }

        .operations-outline-btn,
        .operations-dark-btn {
          height: 38px;
          padding: 0 17px;
          border-radius: 12px;
          font-family: var(--sans, "DM Sans", system-ui, sans-serif);
          font-size: 10px;
          cursor: pointer;
        }

        .operations-outline-btn {
          background: #fff;
          border: 1px solid #e0ddd5;
          color: #20221e;
        }

        .operations-dark-btn {
          background: #111410;
          border: 1px solid #111410;
          color: #fff;
        }

        .operations-kpi-card,
        .operations-panel,
        .operations-library {
          background: #fff;
          border: 1px solid #e2dfd8;
          border-radius: 15px;
          overflow: hidden;
        }

        .operations-kpi-card {
          margin-bottom: 20px;
        }

        .operations-kpi-header {
          min-height: 66px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 0 21px;
          border-bottom: 1px solid #e2dfd8;
        }

        .operations-kpi-header h2,
        .operations-panel h2,
        .operations-library-header h2 {
          margin: 0;
          font-family: var(--serif, "DM Serif Display", Georgia, serif);
          font-weight: 400;
        }

        .operations-kpi-header h2 {
          font-size: 17px;
        }

        .operations-kpi-tabs {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 3px;
          background: #f4f3ef;
          border-radius: 12px;
        }

        .operations-kpi-tab {
          height: 32px;
          padding: 0 15px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #89867e;
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .operations-kpi-tab.active {
          background: #fff;
          color: #151713;
          box-shadow: 0 1px 4px rgba(0, 0, 0, .08);
        }

        .operations-kpi-tab:focus-visible,
        .run-btn:focus-visible,
        .export-row-btn:focus-visible {
          outline: 2px solid #9caf9a;
          outline-offset: 2px;
        }

        .operations-kpi-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
        }

        .operations-kpi {
          min-height: 110px;
          padding: 20px 20px 16px;
          border-right: 1px solid #e2dfd8;
          box-sizing: border-box;
        }

        .operations-kpi:last-child {
          border-right: 0;
        }

        .operations-kpi span {
          display: block;
          margin-bottom: 8px;
          color: #a19e97;
          font-family: monospace;
          font-size: 8px;
          letter-spacing: .8px;
        }

        .operations-kpi strong {
          display: block;
          margin-bottom: 6px;
          font-family: var(--serif, "DM Serif Display", Georgia, serif);
          font-size: 21px;
          line-height: 1;
          font-weight: 400;
        }

        .operations-kpi small {
          font-family: monospace;
          font-size: 9px;
        }

        .positive {
          color: #63785e;
        }

        .negative {
          color: #a45f5f;
        }

        .operations-chart-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(330px, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .operations-panel {
          min-height: 226px;
        }

        .operations-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 21px 21px 10px;
        }

        .operations-panel-header h2 {
          font-size: 17px;
        }

        .operations-panel-header > span {
          color: #b0aca4;
          font-family: monospace;
          font-size: 8px;
        }

        .operations-chart {
          height: 151px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          padding: 0 20px 18px;
        }

        .operations-bar-column {
          height: 130px;
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
        }

        .operations-bar-value,
        .operations-month {
          color: #aaa69f;
          font-family: monospace;
          font-size: 8px;
        }

        .operations-bar-value {
          margin-bottom: 7px;
        }

        .operations-month {
          margin-top: 8px;
        }

        .operations-bar {
          width: 100%;
          max-width: 132px;
          min-height: 25px;
          border-radius: 8px 8px 0 0;
          background: linear-gradient(to bottom, #c6d8ba, #a1b893);
        }

        .operations-split-list {
          padding: 4px 21px 20px;
        }

        .operations-split-item {
          margin-bottom: 14px;
        }

        .operations-split-item:last-child {
          margin-bottom: 0;
        }

        .operations-split-label {
          display: grid;
          grid-template-columns: 12px 1fr auto;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
          color: #89867e;
          font-family: monospace;
          font-size: 8px;
        }

        .operations-split-label b {
          color: #77736d;
          font-weight: 400;
        }

        .operations-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #a0b58f;
        }

        .operations-split-item:nth-child(2) .operations-dot {
          background: #aaa5b7;
        }

        .operations-split-item:nth-child(3) .operations-dot {
          background: #aa9c6c;
        }

        .operations-split-item:nth-child(4) .operations-dot {
          background: #c8dcc0;
        }

        .operations-progress {
          height: 5px;
          border-radius: 5px;
          background: #f0efeb;
          overflow: hidden;
        }

        .operations-progress > div {
          height: 100%;
          border-radius: inherit;
          background: #9daf8f;
        }

        .operations-split-item:nth-child(2) .operations-progress > div {
          background: #aaa5b7;
        }

        .operations-split-item:nth-child(3) .operations-progress > div {
          background: #aa9c6c;
        }

        .operations-split-item:nth-child(4) .operations-progress > div {
          background: #c8dcc0;
        }

        .operations-library {
          width: 100%;
        }

        .operations-library-header {
          min-height: 66px;
          display: flex;
          align-items: center;
          gap: 25px;
          padding: 0 20px;
          border-bottom: 1px solid #e2dfd8;
        }

        .operations-library-header h2 {
          font-size: 17px;
          white-space: nowrap;
        }

        .operations-search {
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

        .operations-search span {
          color: #9a968e;
          font-size: 15px;
        }

        .operations-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #383832;
          font-family: monospace;
          font-size: 9px;
        }

        .operations-search input::placeholder {
          color: #aaa69f;
        }

        .operations-table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .operations-table-head,
        .operations-report-row {
          min-width: 850px;
          display: grid;
          grid-template-columns: 2.2fr 1.15fr 1fr 1.05fr 1fr 145px;
          align-items: center;
          box-sizing: border-box;
        }

        .operations-table-head {
          min-height: 37px;
          padding: 0 20px;
          background: #f6f5f1;
          border-bottom: 1px solid #e2dfd8;
          color: #aaa69f;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: .8px;
        }

        .operations-report-row {
          position: relative;
          min-height: 57px;
          padding: 0 20px;
          border-bottom: 1px solid #e2dfd8;
          color: #99958d;
          font-family: monospace;
          font-size: 9px;
        }

        .operations-report-row:last-child {
          border-bottom: 0;
        }

        .operations-report-name {
          color: #10130f;
          font-family: var(--serif, "DM Serif Display", Georgia, serif);
          font-size: 14px;
        }

        .operations-category,
        .operations-schedule {
          display: inline-flex;
          align-items: center;
          min-height: 22px;
          padding: 0 10px;
          box-sizing: border-box;
          border: 1px solid #e4e0d7;
          border-radius: 9px;
          background: #f8f7f3;
          color: #88837b;
          font-style: normal;
          font-size: 8px;
        }

        .operations-schedule {
          min-height: 20px;
          border: 0;
          background: #ebe9e3;
        }

        .operations-schedule.weekly {
          background: #efeff6;
        }

        .operations-schedule.daily {
          background: #e7f0e2;
        }

        .operations-row-actions {
          min-height: 30px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
        }

        .run-btn,
        .export-row-btn {
          height: 27px;
          padding: 0 10px;
          border-radius: 8px;
          font-family: monospace;
          font-size: 8px;
          cursor: pointer;
        }

        .run-btn {
          border: 1px solid #e3dfd7;
          background: #fff;
          color: #aaa69f;
        }

        .export-row-btn {
          border: 1px solid #111410;
          background: #111410;
          color: #fff;
        }

        .operations-row-actions {
          opacity: 0;
          pointer-events: none;
          transform: translateX(4px);
          transition: opacity .16s ease, transform .16s ease;
        }

        .operations-report-row:hover .operations-row-actions,
        .operations-report-row:focus-within .operations-row-actions {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(0);
        }

        .operations-empty {
          min-height: 120px;
          display: grid;
          place-items: center;
          color: #9c988f;
          font-family: monospace;
          font-size: 10px;
        }

        @media (max-width: 1100px) {
          .operations-kpi-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .operations-kpi:nth-child(3) {
            border-right: 0;
          }

          .operations-kpi:nth-child(-n + 3) {
            border-bottom: 1px solid #e2dfd8;
          }

          .operations-chart-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .operations-reports-page {
            padding: 20px 14px 25px;
          }

          .operations-page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .operations-header-actions {
            width: 100%;
          }

          .operations-outline-btn,
          .operations-dark-btn {
            flex: 1;
          }

          .operations-kpi-header {
            align-items: flex-start;
            flex-direction: column;
            padding: 18px;
          }

          .operations-kpi-tabs {
            width: 100%;
            overflow-x: auto;
          }

          .operations-kpi-tab {
            flex: 1 0 auto;
          }

          .operations-kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .operations-kpi:nth-child(3) {
            border-right: 1px solid #e2dfd8;
          }

          .operations-kpi:nth-child(2n) {
            border-right: 0;
          }

          .operations-kpi:nth-child(-n + 4) {
            border-bottom: 1px solid #e2dfd8;
          }

          .operations-library-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
            padding: 17px;
          }

          .operations-search {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .operations-kpi-grid {
            grid-template-columns: 1fr;
          }

          .operations-kpi,
          .operations-kpi:nth-child(2n) {
            border-right: 0;
            border-bottom: 1px solid #e2dfd8;
          }

          .operations-kpi:last-child {
            border-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Operation