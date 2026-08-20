import React from "react";

const Branches = () => {
  const branches = [
    {
      initials: "HM",
      name: "HQ — Mumbai",
      type: "Head Office",
      head: "Arjun Mehta",
      employees: 142,
    },
    {
      initials: "WP",
      name: "West — Pune",
      type: "Sales Office",
      head: "Ananya Singh",
      employees: 68,
    },
    {
      initials: "FP",
      name: "Factory — Pune",
      type: "Manufacturing",
      head: "Vikram Joshi",
      employees: 58,
    },
    {
      initials: "SB",
      name: "South — Bangalore",
      type: "Regional Office",
      head: "Deepika Rao",
      employees: 16,
    },
  ];

  return (
    <div className="branches-content">

      {/* ================= BRANCHES CARD ================= */}

      <section className="branches-card">

        {/* Card Header */}
        <div className="branches-header">

          <h2>
            Branches <span>(4)</span>
          </h2>

          <button className="add-branch-btn">
            + Add Branch
          </button>

        </div>

        {/* Branch List */}
        <div className="branch-list">

          {branches.map((branch, index) => (

            <div
              className={`branch-row ${
                index === 0 ? "first-row" : ""
              }`}
              key={branch.name}
            >

              {/* Branch Icon */}
              <div className="branch-icon">
                {branch.initials}
              </div>

              {/* Branch Information */}
              <div className="branch-info">

                <div className="branch-name">
                  {branch.name}
                </div>

                <div className="branch-meta">
                  {branch.type} · Head: {branch.head}
                </div>

              </div>

              {/* Employee Count */}
              <div className="employee-count">

                <strong>
                  {branch.employees}
                </strong>

                <span>
                  EMPLOYEES
                </span>

              </div>

              {/* Status */}
              <div className="branch-status">
                ACTIVE
              </div>

              {/* Arrow */}
              <div className="branch-arrow">
                ›
              </div>

            </div>

          ))}

        </div>

      </section>


      {/* ================= STYLES ================= */}

      <style>{`

        .branches-content {
          width: 100%;
        }

        /* =========================================
           BRANCHES CARD
        ========================================= */

        .branches-card {
          width: 100%;
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 15px;
          overflow: hidden;
        }

        /* =========================================
           BRANCH HEADER
        ========================================= */

        .branches-header {
          height: 63px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 20px;

          border-bottom: 1px solid #e3e0d8;
        }

        .branches-header h2 {
          margin: 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 17px;
          font-weight: 400;

          color: #11140f;
        }

        .branches-header h2 span {
          color: #a19d95;
          font-size: 14px;
        }

        /* =========================================
           ADD BRANCH BUTTON
        ========================================= */

        .add-branch-btn {
          height: 32px;

          padding: 0 15px;

          border: none;
          border-radius: 11px;

          background: #111410;
          color: #fff;

          font-family: monospace;
          font-size: 9px;

          cursor: pointer;
        }

        .add-branch-btn:hover {
          background: #20231f;
        }

        /* =========================================
           BRANCH ROW
        ========================================= */

        .branch-row {
          min-height: 73px;

          display: flex;
          align-items: center;

          padding: 0 20px;

          border-bottom: 1px solid #e3e0d8;

          transition: background 0.15s ease;
        }

        .branch-row:last-child {
          border-bottom: none;
        }

        .branch-row:hover {
          background: #faf9f5;
        }

        .branch-row.first-row {
          background: #f7f6f1;
        }

        /* =========================================
           BRANCH ICON
        ========================================= */

        .branch-icon {
          width: 40px;
          height: 40px;

          flex-shrink: 0;

          border-radius: 12px;

          border: 1px solid #e5e2da;

          background: #f7f6f1;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #64735f;

          font-family: monospace;
          font-size: 8px;
        }

        /* =========================================
           BRANCH INFORMATION
        ========================================= */

        .branch-info {
          margin-left: 16px;
          flex: 1;
        }

        .branch-name {
          margin-bottom: 5px;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 16px;

          color: #11140f;
        }

        .branch-meta {
          font-family: monospace;
          font-size: 8px;
          color: #99968e;
        }

        /* =========================================
           EMPLOYEE COUNT
        ========================================= */

        .employee-count {
          width: 80px;

          margin-right: 17px;

          text-align: center;
        }

        .employee-count strong {
          display: block;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 18px;
          font-weight: 400;

          color: #11140f;
        }

        .employee-count span {
          display: block;

          margin-top: 2px;

          font-family: monospace;
          font-size: 7px;

          color: #aaa69e;
        }

        /* =========================================
           STATUS
        ========================================= */

        .branch-status {
          width: 62px;

          padding: 6px 9px;

          text-align: center;

          border-radius: 10px;

          background: #edf2e8;

          color: #63755c;

          font-family: monospace;
          font-size: 8px;
        }

        /* =========================================
           ARROW
        ========================================= */

        .branch-arrow {
          width: 25px;

          margin-left: 12px;

          color: #d1cec6;

          font-size: 27px;
          font-family: Arial, sans-serif;

          line-height: 1;

          text-align: right;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 850px) {

          .branch-row {
            min-width: 650px;
          }

          .branches-card {
            overflow-x: auto;
          }

        }

      `}</style>

    </div>
  );
};

export default Branches;