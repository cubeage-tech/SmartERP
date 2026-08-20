import React, { useState } from "react";

const roles = [
  {
    id: "01",
    name: "Business Owner",
    description: "Strategic financial and operational command.",
    revenue: "₹48.6M",
    profit: "₹6.2M",
    cash: "₹12.8M",
    forecast: "₹61.4M",
    revenueChange: "+12.4%",
    profitChange: "+8.1%",
    cashChange: "+3.2%",
    forecastChange: "87% confidence",
    insights: [
      "3 invoices overdue · ₹4.2L total outstanding",
      "Cash flow projected ↑8.4% in next 30 days",
      "Sales pipeline at ₹3.2Cr · 42 live opportunities",
    ],
  },
  {
    id: "02",
    name: "Finance Manager",
    description: "Payables, receivables, GST and P&L.",
    revenue: "₹32.4M",
    profit: "₹5.8M",
    cash: "₹9.6M",
    forecast: "₹42.8M",
    revenueChange: "+8.7%",
    profitChange: "+6.4%",
    cashChange: "+4.1%",
    forecastChange: "91% confidence",
    insights: [
      "12 invoices pending approval · ₹2.8L total",
      "Receivables projected to improve by 11.2%",
      "GST filing deadline approaching in 6 days",
    ],
  },
  {
    id: "03",
    name: "Sales Manager",
    description: "Pipeline, conversions and AI-scored leads.",
    revenue: "₹28.9M",
    profit: "₹7.1M",
    cash: "₹10.4M",
    forecast: "₹38.7M",
    revenueChange: "+16.2%",
    profitChange: "+11.8%",
    cashChange: "+7.3%",
    forecastChange: "89% confidence",
    insights: [
      "42 live opportunities · ₹3.2Cr pipeline",
      "Conversion rate increased by 14.6%",
      "8 high-intent AI-scored leads need attention",
    ],
  },
  {
    id: "04",
    name: "HR Manager",
    description: "Headcount, attendance, payroll and performance.",
    revenue: "284",
    profit: "₹18.4M",
    cash: "96%",
    forecast: "₹4.8M",
    revenueChange: "+12 new",
    profitChange: "+6.8%",
    cashChange: "+2.4%",
    forecastChange: "94% confidence",
    insights: [
      "284 active employees · 96% attendance",
      "7 employees due for performance review",
      "Payroll processing completed successfully",
    ],
  },
  {
    id: "05",
    name: "Operations Manager",
    description: "Inventory, production, machines and orders.",
    revenue: "8,426",
    profit: "94.2%",
    cash: "₹21.6M",
    forecast: "₹27.8M",
    revenueChange: "+9.2%",
    profitChange: "+4.6%",
    cashChange: "+5.1%",
    forecastChange: "86% confidence",
    insights: [
      "8,426 units currently in inventory",
      "Production efficiency improved by 9.2%",
      "3 machines require scheduled maintenance",
    ],
  },
  {
    id: "06",
    name: "Employee",
    description: "Personal workspace — tasks, leaves and payslips.",
    revenue: "24",
    profit: "₹84K",
    cash: "18",
    forecast: "96%",
    revenueChange: "+4 tasks",
    profitChange: "+5.2%",
    cashChange: "2 pending",
    forecastChange: "attendance",
    insights: [
      "4 tasks completed this week",
      "2 leave requests awaiting approval",
      "Latest payslip is ready to view",
    ],
  },
];

const RolebaseExperience = () => {
  const [activeRole, setActiveRole] = useState(0);
  const [hoveredRole, setHoveredRole] = useState(null);

  const role = roles[activeRole];

  return (
    <section className="min-h-screen w-full bg-[#0c0f0c] text-[#f1f0e9]">
      <style>{`
        .role-page {
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
          padding: 84px 7.8% 110px;
          background-color: #0c0f0c;
          background-image: radial-gradient(
            rgba(150, 164, 145, 0.14) 0.7px,
            transparent 0.7px
          );
          background-size: 24px 24px;
          font-family: Georgia, "Times New Roman", serif;
        }

        .role-container {
          width: 100%;
          max-width: 1540px;
          margin: 0 auto;
        }

        .role-label {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 70px;
          color: #93a684;
          font-family: "Courier New", monospace;
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .role-label-line {
          width: 38px;
          height: 1px;
          background: #8ca07c;
          opacity: 0.8;
        }

        .role-top {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, 0.82fr);
          gap: clamp(60px, 10vw, 150px);
          align-items: start;
          margin-bottom: 55px;
        }

        .role-title {
          margin: 0;
          max-width: 650px;
          font-size: clamp(54px, 5.1vw, 88px);
          line-height: 0.88;
          font-weight: 400;
          letter-spacing: -4px;
        }

        .role-title .green {
          color: #9bae8b;
          font-style: italic;
        }

        .role-intro {
          max-width: 520px;
          padding-top: 45px;
          color: #718073;
          font-family: Arial, sans-serif;
          font-size: clamp(16px, 1.25vw, 21px);
          line-height: 1.65;
        }

        .role-content {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(420px, 0.92fr);
          gap: clamp(50px, 7vw, 100px);
          align-items: start;
        }

        .role-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .role-item {
          width: 100%;
          min-height: 70px;
          box-sizing: border-box;
          padding: 14px 20px;
          border: 1px solid rgba(137, 151, 137, 0.18);
          border-radius: 15px;
          background: rgba(12, 15, 12, 0.2);
          display: grid;
          grid-template-columns: 48px minmax(0, 1fr);
          align-items: center;
          cursor: pointer;
          transition:
            background 260ms ease,
            border-color 260ms ease,
            transform 260ms ease,
            padding 260ms ease;
        }

        .role-item:hover {
          transform: translateX(3px);
        }

        .role-item.hovered {
          border-color: rgba(245, 245, 240, 0.7);
          box-shadow:
            0 0 0 1px rgba(245, 245, 240, 0.12),
            0 0 18px rgba(245, 245, 240, 0.08);
        }

        .role-item.active {
          min-height: 72px;
          background: #a5b895;
          border-color: #a5b895;
          color: #101510;
        }

        .role-number {
          color: #607064;
          font-family: "Courier New", monospace;
          font-size: 13px;
        }

        .role-item.active .role-number {
          color: #53624e;
        }

        .role-name {
          margin: 0 0 4px;
          font-size: 20px;
          line-height: 1.1;
          font-weight: 400;
        }

        .role-description {
          margin: 0;
          color: #58655c;
          font-family: "Courier New", monospace;
          font-size: 12px;
          line-height: 1.4;
        }

        .role-item:not(.active) .role-name {
          color: #7e877f;
        }

        .dashboard {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid rgba(145, 157, 143, 0.22);
          border-radius: 30px;
          background: rgba(17, 20, 17, 0.92);
          overflow: hidden;
          transition: opacity 220ms ease, transform 220ms ease;
        }

        .dashboard-header {
          padding: 30px;
          border-bottom: 1px solid rgba(145, 157, 143, 0.14);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .dashboard-kicker {
          margin: 0 0 8px;
          color: #8da17d;
          font-family: "Courier New", monospace;
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .dashboard-title {
          margin: 0;
          color: #eeeade;
          font-size: 25px;
          font-weight: 400;
        }

        .live {
          flex-shrink: 0;
          padding: 8px 14px;
          border: 1px solid rgba(144, 166, 127, 0.28);
          border-radius: 10px;
          color: #9bae8b;
          font-family: "Courier New", monospace;
          font-size: 11px;
        }

        .live::before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-right: 7px;
          border-radius: 50%;
          background: #93a884;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 20px;
        }

        .stat {
          min-height: 102px;
          box-sizing: border-box;
          padding: 20px;
          border: 1px solid rgba(145, 157, 143, 0.12);
          border-radius: 15px;
          background: #20231f;
        }

        .stat-label {
          margin: 0 0 12px;
          color: #68746b;
          font-family: "Courier New", monospace;
          font-size: 10px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .stat-value {
          margin: 0 0 12px;
          color: #eeeade;
          font-size: 26px;
        }

        .stat-change {
          margin: 0;
          color: #92aa81;
          font-family: "Courier New", monospace;
          font-size: 11px;
        }

        .insights {
          padding: 0 20px 25px;
        }

        .insights-title {
          margin: 0 0 14px;
          color: #8da17d;
          font-family: "Courier New", monospace;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .insight {
          min-height: 48px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 9px;
          padding: 12px 15px;
          border: 1px solid rgba(145, 157, 143, 0.12);
          border-radius: 13px;
          background: #20231f;
          color: #849087;
          font-family: "Courier New", monospace;
          font-size: 12px;
        }

        .insight-star {
          color: #a7bc95;
          font-size: 14px;
        }

        @media (max-width: 1100px) {
          .role-page {
            padding-left: 6%;
            padding-right: 6%;
          }

          .role-top {
            gap: 50px;
          }

          .role-content {
            grid-template-columns: 1fr;
          }

          .dashboard {
            max-width: 800px;
          }
        }

        @media (max-width: 760px) {
          .role-page {
            padding: 55px 22px 80px;
          }

          .role-label {
            margin-bottom: 45px;
          }

          .role-top {
            grid-template-columns: 1fr;
            gap: 25px;
            margin-bottom: 40px;
          }

          .role-title {
            font-size: clamp(46px, 13vw, 68px);
            letter-spacing: -2.5px;
          }

          .role-intro {
            padding-top: 0;
            font-size: 15px;
          }

          .role-item {
            grid-template-columns: 38px minmax(0, 1fr);
            padding: 13px 15px;
          }

          .role-name {
            font-size: 18px;
          }

          .role-description {
            font-size: 10px;
          }

          .dashboard {
            border-radius: 22px;
          }

          .dashboard-header {
            padding: 22px;
          }

          .dashboard-title {
            font-size: 21px;
          }

          .stats {
            padding: 14px;
            gap: 8px;
          }

          .stat {
            padding: 15px;
            min-height: 95px;
          }

          .stat-value {
            font-size: 21px;
          }

          .insights {
            padding: 0 14px 18px;
          }
        }

        @media (max-width: 460px) {
          .stats {
            grid-template-columns: 1fr;
          }

          .dashboard-header {
            align-items: flex-start;
          }

          .live {
            padding: 6px 9px;
            font-size: 9px;
          }
        }
      `}</style>

      <div className="role-page">
        <div className="role-container">

          <div className="role-label">
            <span className="role-label-line"></span>
            <span>08 — ROLE-BASED EXPERIENCE</span>
          </div>

          <div className="role-top">

            <h1 className="role-title">
              Every Role Sees
              <br />
              What They
              <br />
              <span className="green">Need.</span>
            </h1>

            <p className="role-intro">
              SmartERP AI adapts the dashboard, modules and AI
              insights to each user's role — from the business
              owner to the individual employee.
            </p>

          </div>

          <div className="role-content">

            <div className="role-list">

              {roles.map((item, index) => (
              <div
                key={item.id}
                className={`role-item ${
                  activeRole === index ? "active" : ""
                } ${
                  hoveredRole === index ? "hovered" : ""
                }`}
                onMouseEnter={() => setHoveredRole(index)}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={() => setActiveRole(index)}
                >
                <span className="role-number">
                  {item.id}
                </span>

                <div>
                  <h3 className="role-name">
                    {item.name}
                  </h3>

                  <p className="role-description">
                    {item.description}
                  </p>
                </div>
              </div>
              ))}

            </div>

            <div className="dashboard">

              <div className="dashboard-header">

                <div>
                  <p className="dashboard-kicker">
                    {role.name} Dashboard
                  </p>

                  <h2 className="dashboard-title">
                    Your command center.
                  </h2>
                </div>

                <span className="live">
                  LIVE
                </span>

              </div>

              <div className="stats">

                <div className="stat">
                  <p className="stat-label">
                    Revenue MTD
                  </p>

                  <p className="stat-value">
                    {role.revenue}
                  </p>

                  <p className="stat-change">
                    {role.revenueChange}
                  </p>
                </div>

                <div className="stat">
                  <p className="stat-label">
                    Net Profit
                  </p>

                  <p className="stat-value">
                    {role.profit}
                  </p>

                  <p className="stat-change">
                    {role.profitChange}
                  </p>
                </div>

                <div className="stat">
                  <p className="stat-label">
                    Cash Position
                  </p>

                  <p className="stat-value">
                    {role.cash}
                  </p>

                  <p className="stat-change">
                    {role.cashChange}
                  </p>
                </div>

                <div className="stat">
                  <p className="stat-label">
                    90D Forecast
                  </p>

                  <p className="stat-value">
                    {role.forecast}
                  </p>

                  <p className="stat-change">
                    {role.forecastChange}
                  </p>
                </div>

              </div>

              <div className="insights">

                <p className="insights-title">
                  AI INSIGHTS FOR YOU
                </p>

                {role.insights.map((insight, index) => (
                  <div className="insight" key={index}>
                    <span className="insight-star">✦</span>
                    <span>{insight}</span>
                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default RolebaseExperience;