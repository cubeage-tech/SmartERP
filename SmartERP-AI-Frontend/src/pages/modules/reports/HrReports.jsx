import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../core/constants/routes.constant";

const HrReports = () => {
  const navigate = useNavigate();

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

  const handleRun = (name) => {
    alert(`Running ${name}`);
  };

  const handleExport = (name) => {
    alert(`Exporting ${name}`);
  };

  const goToFinance = () => {
    navigate(ROUTES.SUPER_ADMIN_REPORTS_FINANCE);
  };

  const goToSales = () => {
    navigate(ROUTES.SUPER_ADMIN_REPORTS_SALES);
  };

  const goToOperations = () => {
    if (ROUTES.SUPER_ADMIN_REPORTS_OPERATIONS) {
      navigate(ROUTES.SUPER_ADMIN_REPORTS_OPERATIONS);
    }
  };

  const goToHr = () => {
    navigate(ROUTES.SUPER_ADMIN_REPORTS_HR);
  };

  return (
    <div className="hr-reports-page">

      {/* ================= PAGE HEADER ================= */}

      <div className="hr-page-header">
        <div>
          <div className="hr-eyebrow">
            ANALYTICS
          </div>

          <h1>
            Reports &amp; Analytics
          </h1>
        </div>

        <div className="hr-header-actions">

          <button
            type="button"
            className="hr-outline-btn"
          >
            Schedule Report
          </button>

          <button
            type="button"
            className="hr-dark-btn"
          >
            + Custom Report
          </button>

        </div>
      </div>


      {/* ================= BUSINESS KPIs ================= */}

      <section className="hr-kpi-card">

        <div className="hr-kpi-header">

          <h2>
            Business KPIs
          </h2>

          <div className="hr-kpi-tabs">

            <button
              type="button"
              className="hr-kpi-tab"
              onClick={goToFinance}
            >
              FINANCE
            </button>

            <button
              type="button"
              className="hr-kpi-tab"
              onClick={goToSales}
            >
              SALES
            </button>

            <button
              type="button"
              className="hr-kpi-tab"
              onClick={goToOperations}
            >
              OPERATIONS
            </button>

            <button
              type="button"
              className="hr-kpi-tab active"
              onClick={goToHr}
              aria-pressed="true"
            >
              HR
            </button>

          </div>

        </div>


        {/* ================= HR KPI VALUES ================= */}

        <div className="hr-kpi-grid">

          <div className="hr-kpi-item">

            <span className="hr-kpi-label">
              HEADCOUNT
            </span>

            <strong>
              284
            </strong>

            <span className="hr-kpi-change positive">
              ↑ +3
            </span>

          </div>


          <div className="hr-kpi-item">

            <span className="hr-kpi-label">
              ATTENDANCE RATE
            </span>

            <strong>
              94.2%
            </strong>

            <span className="hr-kpi-change positive">
              ↑ +0.8pp
            </span>

          </div>


          <div className="hr-kpi-item">

            <span className="hr-kpi-label">
              ATTRITION RATE
            </span>

            <strong>
              8.4%
            </strong>

            <span className="hr-kpi-change positive">
              ↑ -1.2pp
            </span>

          </div>


          <div className="hr-kpi-item">

            <span className="hr-kpi-label">
              PAYROLL COST
            </span>

            <strong>
              ₹98.4 L
            </strong>

            <span className="hr-kpi-change negative">
              ↓ +3.2%
            </span>

          </div>


          <div className="hr-kpi-item">

            <span className="hr-kpi-label">
              OPEN POSITIONS
            </span>

            <strong>
              6
            </strong>

            <span className="hr-kpi-change neutral">
              → +2
            </span>

          </div>


          <div className="hr-kpi-item">

            <span className="hr-kpi-label">
              AVG PERFORMANCE
            </span>

            <strong>
              4.2/5
            </strong>

            <span className="hr-kpi-change positive">
              ↑ +0.1
            </span>

          </div>

        </div>

      </section>


      {/* ================= CHARTS ================= */}

      <div className="hr-chart-grid">

        {/* REVENUE TREND */}

        <section className="hr-panel">

          <div className="hr-panel-header">

            <h2>
              Revenue Trend
            </h2>

            <span>
              H1 FY2026 — Monthly
            </span>

          </div>


          <div className="hr-bar-chart">

            {[
              ["MAR", "₹96L", 42],
              ["APR", "₹132L", 57],
              ["MAY", "₹115L", 50],
              ["JUN", "₹173L", 74],
              ["JUL", "₹216L", 89],
              ["AUG", "₹163L", 69],
            ].map(([month, value, height]) => (

              <div
                className="hr-bar-column"
                key={month}
              >

                <span className="hr-bar-value">
                  {value}
                </span>

                <div className="hr-bar-area">

                  <div
                    className="hr-revenue-bar"
                    style={{
                      height: `${height}px`,
                    }}
                  />

                </div>

                <span className="hr-bar-month">
                  {month}
                </span>

              </div>

            ))}

          </div>

        </section>


        {/* REVENUE SPLIT */}

        <section className="hr-panel hr-split-panel">

          <div className="hr-panel-header">

            <h2>
              Revenue Split
            </h2>

          </div>


          <div className="hr-split-list">

            {[
              ["Manufacturing", 42, "green"],
              ["Services", 28, "purple"],
              ["Spares & Parts", 18, "gold"],
              ["Export", 12, "light"],
            ].map(([name, percentage, tone]) => (

              <div
                className="hr-split-item"
                key={name}
              >

                <div className="hr-split-top">

                  <div className="hr-split-name">

                    <span
                      className={`hr-split-dot ${tone}`}
                    />

                    {name}

                  </div>

                  <span>
                    {percentage}%
                  </span>

                </div>


                <div className="hr-progress">

                  <div
                    className={`hr-progress-fill ${tone}`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </section>

      </div>


      {/* ================= REPORT LIBRARY ================= */}

      <section className="hr-report-library">

        <div className="hr-library-header">

          <h2>
            Report Library
          </h2>

          <div className="hr-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search reports..."
            />

          </div>

        </div>


        {/* TABLE HEADER */}

        <div className="hr-table-header">

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
            ACTIONS
          </span>

        </div>


        {/* TABLE ROWS */}

        <div className="hr-report-table">

          {reports.map((report) => (

            <div
              className="hr-report-row"
              key={report.name}
            >

              <span className="hr-report-name">
                {report.name}
              </span>


              <span>
                <span className="hr-category-badge">
                  {report.category}
                </span>
              </span>


              <span className="hr-muted">
                {report.format}
              </span>


              <span className="hr-muted">
                {report.lastRun}
              </span>


              <span>

                <span
                  className={`hr-schedule-badge ${
                    report.schedule.toLowerCase()
                  }`}
                >
                  {report.schedule}
                </span>

              </span>


              {/* Figma-style hover actions */}

              <span className="hr-row-actions">

                <button
                  type="button"
                  className="hr-run-btn"
                  onClick={() => handleRun(report.name)}
                >
                  Run
                </button>

                <button
                  type="button"
                  className="hr-export-btn"
                  onClick={() => handleExport(report.name)}
                >
                  ↓ Export
                </button>

              </span>

            </div>

          ))}

        </div>

      </section>


      {/* ================= CSS ================= */}

      <style>{`

        .hr-reports-page {
          width: 100%;
          min-height: 100%;
          box-sizing: border-box;

          padding:
            28px 22px 40px;

          background:
            #f5f4ef;

          color:
            #111410;

          font-family:
            var(--sans),
            "DM Sans",
            system-ui,
            sans-serif;
        }


        /* HEADER */

        .hr-page-header {
          min-height: 100px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 24px;

          margin-bottom: 8px;
        }


        .hr-eyebrow {
          margin-bottom: 7px;

          color:
            #99978f;

          font-family:
            var(--sans),
            "DM Sans",
            sans-serif;

          font-size: 9px;

          letter-spacing: 1.6px;
        }


        .hr-page-header h1 {
          margin: 0;

          font-family:
            var(--serif),
            "DM Serif Display",
            Georgia,
            serif;

          font-size: 28px;

          line-height: 1.15;

          font-weight: 400;
        }


        .hr-header-actions {
          display: flex;

          gap: 9px;
        }


        .hr-outline-btn,
        .hr-dark-btn {
          height: 38px;

          padding:
            0 17px;

          border-radius: 12px;

          font-family:
            var(--sans),
            "DM Sans",
            sans-serif;

          font-size: 10px;

          cursor: pointer;

          white-space: nowrap;
        }


        .hr-outline-btn {
          background: #fff;

          border:
            1px solid #e0ddd5;

          color:
            #20221e;
        }


        .hr-dark-btn {
          background:
            #111410;

          border:
            1px solid #111410;

          color:
            #fff;
        }


        /* KPI CARD */

        .hr-kpi-card,
        .hr-panel,
        .hr-report-library {
          background:
            #fff;

          border:
            1px solid #e2dfd8;

          border-radius:
            15px;

          overflow:
            hidden;

          box-sizing:
            border-box;
        }


        .hr-kpi-card {
          margin-bottom:
            20px;
        }


        .hr-kpi-header {
          min-height:
            67px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            20px;

          padding:
            0 20px;

          border-bottom:
            1px solid #e5e2db;
        }


        .hr-kpi-header h2,
        .hr-panel-header h2,
        .hr-library-header h2 {
          margin:
            0;

          font-family:
            var(--serif),
            "DM Serif Display",
            Georgia,
            serif;

          font-size:
            17px;

          font-weight:
            400;
        }


        .hr-kpi-tabs {
          display:
            flex;

          align-items:
            center;

          gap:
            2px;

          padding:
            3px;

          background:
            #f1f0ec;

          border-radius:
            11px;
        }


        .hr-kpi-tab {
          height:
            30px;

          padding:
            0 14px;

          border:
            0;

          border-radius:
            8px;

          background:
            transparent;

          color:
            #99968f;

          font-family:
            var(--sans),
            "DM Sans",
            sans-serif;

          font-size:
            8px;

          letter-spacing:
            1px;

          cursor:
            pointer;
        }


        .hr-kpi-tab.active {
          background:
            #fff;

          color:
            #181a16;

          box-shadow:
            0 1px 4px
            rgba(0, 0, 0, .08);
        }


        .hr-kpi-tab:focus-visible {
          outline:
            2px solid #9bb48c;

          outline-offset:
            2px;
        }


        .hr-kpi-grid {
          display:
            grid;

          grid-template-columns:
            repeat(6, minmax(0, 1fr));
        }


        .hr-kpi-item {
          min-height:
            110px;

          padding:
            20px;

          border-right:
            1px solid #e5e2db;

          box-sizing:
            border-box;
        }


        .hr-kpi-item:last-child {
          border-right:
            0;
        }


        .hr-kpi-label {
          display:
            block;

          margin-bottom:
            9px;

          font-family:
            var(--sans),
            "DM Sans",
            sans-serif;

          font-size:
            8px;

          letter-spacing:
            1px;

          color:
            #aaa69f;
        }


        .hr-kpi-item strong {
          display:
            block;

          margin-bottom:
            6px;

          font-family:
            var(--serif),
            "DM Serif Display",
            Georgia,
            serif;

          font-size:
            21px;

          font-weight:
            400;

          line-height:
            1.1;
        }


        .hr-kpi-change {
          font-family:
            var(--sans),
            "DM Sans",
            sans-serif;

          font-size:
            9px;
        }


        .hr-kpi-change.positive {
          color:
            #5c7060;
        }


        .hr-kpi-change.negative {
          color:
            #9d6967;
        }


        .hr-kpi-change.neutral {
          color:
            #aaa69f;
        }


        /* CHART GRID */

        .hr-chart-grid {
          display:
            grid;

          grid-template-columns:
            minmax(0, 2fr)
            minmax(320px, 1fr);

          gap:
            16px;

          margin-bottom:
            20px;
        }


        .hr-panel {
          min-height:
            228px;
        }


        .hr-panel-header {
          min-height:
            61px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            15px;

          padding:
            0 20px;
        }


        .hr-panel-header > span {
          color:
            #aaa69f;

          font-size:
            9px;
        }


        /* BAR CHART */

        .hr-bar-chart {
          height:
            167px;

          display:
            flex;

          align-items:
            flex-end;

          gap:
            13px;

          padding:
            0 20px 18px;

          box-sizing:
            border-box;
        }


        .hr-bar-column {
          flex:
            1;

          min-width:
            0;

          height:
            100%;

          display:
            flex;

          flex-direction:
            column;

          justify-content:
            flex-end;

          align-items:
            center;
        }


        .hr-bar-value,
        .hr-bar-month {
          color:
            #aaa69f;

          font-family:
            var(--sans),
            "DM Sans",
            sans-serif;

          font-size:
            8px;
        }


        .hr-bar-value {
          margin-bottom:
            7px;
        }


        .hr-bar-area {
          width:
            100%;

          height:
            92px;

          display:
            flex;

          align-items:
            flex-end;
        }


        .hr-revenue-bar {
          width:
            100%;

          max-width:
            145px;

          min-height:
            15px;

          border-radius:
            8px 8px 0 0;

          background:
            linear-gradient(
              to bottom,
              #c5d6bb,
              #9db48f
            );
        }


        .hr-bar-month {
          margin-top:
            8px;
        }


        /* REVENUE SPLIT */

        .hr-split-list {
          padding:
            3px 20px 20px;
        }


        .hr-split-item {
          margin-bottom:
            14px;
        }


        .hr-split-item:last-child {
          margin-bottom:
            0;
        }


        .hr-split-top {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          margin-bottom:
            6px;

          font-size:
            9px;

          color:
            #88857f;
        }


        .hr-split-name {
          display:
            flex;

          align-items:
            center;

          gap:
            8px;
        }


        .hr-split-dot {
          width:
            9px;

          height:
            9px;

          border-radius:
            3px;
        }


        .hr-split-dot.green,
        .hr-progress-fill.green {
          background:
            #9bb48c;
        }


        .hr-split-dot.purple,
        .hr-progress-fill.purple {
          background:
            #aaa6b8;
        }


        .hr-split-dot.gold,
        .hr-progress-fill.gold {
          background:
            #b0a06d;
        }


        .hr-split-dot.light,
        .hr-progress-fill.light {
          background:
            #c6d7bd;
        }


        .hr-progress {
          height:
            5px;

          margin-left:
            17px;

          background:
            #efeee9;

          border-radius:
            5px;

          overflow:
            hidden;
        }


        .hr-progress-fill {
          height:
            100%;

          border-radius:
            inherit;
        }


        /* REPORT LIBRARY */

        .hr-library-header {
          min-height:
            67px;

          display:
            flex;

          align-items:
            center;

          gap:
            25px;

          padding:
            0 20px;

          border-bottom:
            1px solid #e5e2db;
        }


        .hr-search {
          width:
            320px;

          height:
            34px;

          display:
            flex;

          align-items:
            center;

          gap:
            8px;

          padding:
            0 11px;

          border:
            1px solid #e0ddd5;

          background:
            #f8f7f3;

          border-radius:
            10px;

          box-sizing:
            border-box;
        }


        .hr-search span {
          color:
            #aaa69f;

          font-size:
            16px;
        }


        .hr-search input {
          width:
            100%;

          border:
            0;

          outline:
            0;

          background:
            transparent;

          font-family:
            var(--sans),
            "DM Sans",
            sans-serif;

          font-size:
            9px;
        }


        .hr-report-table {
          width:
            100%;
        }


        .hr-table-header,
        .hr-report-row {
          display:
            grid;

          grid-template-columns:
            minmax(220px, 2.4fr)
            minmax(90px, 1.2fr)
            minmax(100px, 1.1fr)
            minmax(100px, 1.1fr)
            minmax(80px, 1fr)
            125px;

          align-items:
            center;

          column-gap:
            8px;
        }


        .hr-table-header {
          min-height:
            38px;

          padding:
            0 20px;

          background:
            #f5f4ef;

          border-bottom:
            1px solid #e2dfd7;

          color:
            #aaa69f;

          font-size:
            7px;

          letter-spacing:
            1px;
        }


        .hr-report-row {
          min-height:
            56px;

          padding:
            0 20px;

          border-bottom:
            1px solid #e5e2db;

          box-sizing:
            border-box;
        }


        .hr-report-row:last-child {
          border-bottom:
            0;
        }


        .hr-report-name {
          font-family:
            var(--serif),
            "DM Serif Display",
            Georgia,
            serif;

          font-size:
            14px;

          color:
            #11140f;
        }


        .hr-muted {
          color:
            #99958e;

          font-size:
            9px;
        }


        .hr-category-badge,
        .hr-schedule-badge {
          display:
            inline-flex;

          align-items:
            center;

          justify-content:
            center;

          min-height:
            20px;

          padding:
            0 9px;

          border-radius:
            10px;

          font-size:
            8px;

          color:
            #88857f;

          background:
            #f5f3ee;

          border:
            1px solid #e4e0d7;

          white-space:
            nowrap;
        }


        .hr-schedule-badge {
          border:
            0;

          background:
            #ebe9e2;
        }


        .hr-schedule-badge.weekly {
          background:
            #eeeef5;
        }


        .hr-schedule-badge.daily {
          background:
            #e8f0e4;
        }


        /* Figma mouse dependency */

        .hr-row-actions {
          min-width:
            125px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            flex-end;

          gap:
            6px;

          opacity:
            0;

          visibility:
            hidden;

          pointer-events:
            none;

          transition:
            opacity .15s ease,
            visibility .15s ease;
        }


        .hr-report-row:hover .hr-row-actions,
        .hr-report-row:focus-within .hr-row-actions {
          opacity:
            1;

          visibility:
            visible;

          pointer-events:
            auto;
        }


        .hr-run-btn,
        .hr-export-btn {
          height:
            27px;

          padding:
            0 10px;

          border-radius:
            7px;

          font-family:
            var(--sans),
            "DM Sans",
            sans-serif;

          font-size:
            8px;

          white-space:
            nowrap;

          cursor:
            pointer;
        }


        .hr-run-btn {
          background:
            #fff;

          border:
            1px solid #e7e4de;

          color:
            #aaa69f;
        }


        .hr-export-btn {
          background:
            #9a9b9b;

          border:
            1px solid #9a9b9b;

          color:
            #fff;
        }


        /* ================= RESPONSIVE ================= */

        @media (max-width: 1100px) {

          .hr-kpi-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }


          .hr-kpi-item:nth-child(3) {
            border-right:
              0;
          }


          .hr-kpi-item:nth-child(-n + 3) {
            border-bottom:
              1px solid #e5e2db;
          }


          .hr-chart-grid {
            grid-template-columns:
              1fr;
          }


          .hr-table-header,
          .hr-report-row {
            grid-template-columns:
              minmax(180px, 2fr)
              minmax(80px, 1fr)
              minmax(90px, 1fr)
              minmax(90px, 1fr)
              minmax(75px, 1fr)
              125px;
          }

        }


        @media (max-width: 760px) {

          .hr-reports-page {
            padding:
              22px 16px 35px;
          }


          .hr-page-header {
            align-items:
              flex-start;

            flex-direction:
              column;
          }


          .hr-header-actions {
            width:
              100%;
          }


          .hr-outline-btn,
          .hr-dark-btn {
            flex:
              1;
          }


          .hr-kpi-header {
            align-items:
              flex-start;

            flex-direction:
              column;

            padding:
              18px 16px;
          }


          .hr-kpi-tabs {
            width:
              100%;

            overflow-x:
              auto;
          }


          .hr-kpi-tab {
            flex-shrink:
              0;
          }


          .hr-kpi-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }


          .hr-kpi-item:nth-child(even) {
            border-right:
              0;
          }


          .hr-kpi-item:nth-child(-n + 4) {
            border-bottom:
              1px solid #e5e2db;
          }


          .hr-library-header {
            align-items:
              flex-start;

            flex-direction:
              column;

            gap:
              12px;

            padding:
              17px 16px;
          }


          .hr-search {
            width:
              100%;
          }


          .hr-table-header,
          .hr-report-row {
            min-width:
              900px;
          }

        }


        @media (max-width: 520px) {

          .hr-page-header h1 {
            font-size:
              24px;
          }


          .hr-header-actions {
            flex-direction:
              column;
          }


          .hr-outline-btn,
          .hr-dark-btn {
            width:
              100%;
          }


          .hr-kpi-grid {
            grid-template-columns:
              1fr;
          }


          .hr-kpi-item,
          .hr-kpi-item:nth-child(even) {
            border-right:
              0;

            border-bottom:
              1px solid #e5e2db;
          }


          .hr-kpi-item:last-child {
            border-bottom:
              0;
          }

        }

      `}</style>

    </div>
  );
};

export default HrReports;