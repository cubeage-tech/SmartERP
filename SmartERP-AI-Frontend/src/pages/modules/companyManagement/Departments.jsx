import React from "react";

const Departments = () => {
  const departments = [
    {
      department: "Finance & Accounts",
      head: "Rahul Sharma",
      employees: 18,
      costCenter: "CC-001",
    },
    {
      department: "Sales",
      head: "Ananya Singh",
      employees: 34,
      costCenter: "CC-002",
    },
    {
      department: "Operations",
      head: "Vikram Joshi",
      employees: 82,
      costCenter: "CC-003",
    },
    {
      department: "Human Resources",
      head: "Deepika Rao",
      employees: 12,
      costCenter: "CC-004",
    },
    {
      department: "IT",
      head: "Rohan Verma",
      employees: 9,
      costCenter: "CC-005",
    },
    {
      department: "Marketing",
      head: "Kavya Reddy",
      employees: 8,
      costCenter: "CC-006",
    },
    {
      department: "Procurement",
      head: "Suresh Patil",
      employees: 11,
      costCenter: "CC-007",
    },
  ];

  return (
    <div className="departments-content">

      {/* ================= DEPARTMENTS CARD ================= */}

      <section className="departments-card">

        {/* CARD HEADER */}
        <div className="departments-header">
          <h2>
            Departments <span>(7)</span>
          </h2>

          <button className="add-dept-btn">
            + Add Dept.
          </button>
        </div>

        {/* TABLE HEADER */}
        <div className="table-header">
          <div>DEPARTMENT</div>
          <div>HEAD</div>
          <div>EMPLOYEES</div>
          <div>COST CENTER</div>
          <div></div>
        </div>

        {/* DEPARTMENT ROWS */}
        <div className="department-list">

          {departments.map((item, index) => (
            <div
              className={`department-row ${
                index === 2 ? "highlighted" : ""
              }`}
              key={item.department}
            >
              <div className="department-name">
                {item.department}
              </div>

              <div className="department-head">
                {item.head}
              </div>

              <div className="department-employees">
                {item.employees}
              </div>

              <div className="cost-center">
                <span>{item.costCenter}</span>
              </div>

              <div className="view-action">
                View →
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* ================= STYLES ================= */}

      <style>{`

        .departments-content {
          width: 100%;
        }

        .departments-card {
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 15px;
          overflow: hidden;
        }

        /* CARD HEADER */

        .departments-header {
          height: 63px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 20px;

          border-bottom: 1px solid #e3e0d8;
        }

        .departments-header h2 {
          margin: 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 17px;
          font-weight: 400;

          color: #11140f;
        }

        .departments-header h2 span {
          color: #a19d95;
          font-size: 14px;
        }

        .add-dept-btn {
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

        /* TABLE HEADER */

        .table-header {
          height: 37px;

          display: grid;

          grid-template-columns:
            2.2fr
            1.5fr
            1.1fr
            1.3fr
            0.45fr;

          align-items: center;

          padding: 0 20px;

          border-bottom: 1px solid #e3e0d8;

          color: #aaa69e;

          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.5px;
        }

        /* ROWS */

        .department-row {
          min-height: 53px;

          display: grid;

          grid-template-columns:
            2.2fr
            1.5fr
            1.1fr
            1.3fr
            0.45fr;

          align-items: center;

          padding: 0 20px;

          border-bottom: 1px solid #e3e0d8;
        }

        .department-row:last-child {
          border-bottom: none;
        }

        .department-row.highlighted {
          background: #f7f6f1;
        }

        .department-name {
          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 15px;
          color: #11140f;
        }

        .department-head {
          font-family: monospace;
          font-size: 9px;
          color: #817e77;
        }

        .department-employees {
          font-family: monospace;
          font-size: 9px;
          color: #171914;
        }

        .cost-center span {
          display: inline-block;

          padding: 5px 9px;

          border-radius: 9px;

          background: #f0eff1;
          color: #817d88;

          font-family: monospace;
          font-size: 8px;
        }

        .view-action {
          text-align: right;

          font-family: monospace;
          font-size: 8px;

          color: #aaa69e;

          white-space: nowrap;
        }

        /* RESPONSIVE */

        @media (max-width: 850px) {

          .departments-card {
            overflow-x: auto;
          }

          .table-header,
          .department-row {
            min-width: 900px;
          }
        }

      `}</style>

    </div>
  );
};

export default Departments;