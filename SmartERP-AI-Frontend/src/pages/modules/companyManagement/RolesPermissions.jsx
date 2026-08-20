import React from "react";

const RolesPermissions = () => {
  const permissions = [
    {
      module: "Finance & Accounts",
      superAdmin: "Full",
      admin: "Full",
      manager: "View + Edit",
      employee: "None",
    },
    {
      module: "CRM",
      superAdmin: "Full",
      admin: "Full",
      manager: "Full",
      employee: "View",
    },
    {
      module: "HR & Payroll",
      superAdmin: "Full",
      admin: "Full",
      manager: "Dept Only",
      employee: "Own",
    },
    {
      module: "Inventory",
      superAdmin: "Full",
      admin: "Full",
      manager: "Full",
      employee: "View",
    },
    {
      module: "Reports",
      superAdmin: "Full",
      admin: "Full",
      manager: "Dept Only",
      employee: "None",
    },
    {
      module: "Settings",
      superAdmin: "Full",
      admin: "Partial",
      manager: "None",
      employee: "None",
    },
  ];

  const getPermissionClass = (permission) => {
    if (permission === "Full") return "permission full";
    if (permission === "None") return "permission none";
    if (permission === "Partial") return "permission partial";
    if (permission === "View") return "permission view";
    if (permission === "View + Edit") return "permission view-edit";
    if (permission === "Dept Only") return "permission dept";
    if (permission === "Own") return "permission own";

    return "permission";
  };

  return (
    <div className="roles-content">

      {/* ================= PERMISSION MATRIX ================= */}

      <section className="permission-card">

        {/* HEADER */}

        <div className="permission-header">
          <div>
            <h2>Permission Matrix</h2>

            <p>
              Module-level access control by role
            </p>
          </div>
        </div>


        {/* TABLE HEADER */}

        <div className="permission-table-header">
          <div>MODULE</div>
          <div>SUPER ADMIN</div>
          <div>ADMIN</div>
          <div>MANAGER</div>
          <div>EMPLOYEE</div>
        </div>


        {/* TABLE ROWS */}

        <div className="permission-list">

          {permissions.map((item) => (
            <div
              className="permission-row"
              key={item.module}
            >

              <div className="module-name">
                {item.module}
              </div>

              <div>
                <span
                  className={getPermissionClass(
                    item.superAdmin
                  )}
                >
                  {item.superAdmin}
                </span>
              </div>

              <div>
                <span
                  className={getPermissionClass(
                    item.admin
                  )}
                >
                  {item.admin}
                </span>
              </div>

              <div>
                <span
                  className={getPermissionClass(
                    item.manager
                  )}
                >
                  {item.manager}
                </span>
              </div>

              <div>
                <span
                  className={getPermissionClass(
                    item.employee
                  )}
                >
                  {item.employee}
                </span>
              </div>

            </div>
          ))}

        </div>

      </section>


      {/* ================= STYLES ================= */}

      <style>{`

        .roles-content {
          width: 100%;
        }

        /* PERMISSION CARD */

        .permission-card {
          background: #fff;

          border: 1px solid #e1dfd8;
          border-radius: 15px;

          overflow: hidden;
        }

        /* HEADER */

        .permission-header {
          height: 76px;

          display: flex;
          align-items: center;

          padding: 0 20px;

          border-bottom: 1px solid #e3e0d8;
        }

        .permission-header h2 {
          margin: 0 0 5px;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 17px;
          font-weight: 400;

          color: #11140f;
        }

        .permission-header p {
          margin: 0;

          font-family: monospace;
          font-size: 9px;

          color: #9b978f;
        }

        /* TABLE HEADER */

        .permission-table-header {
          height: 37px;

          display: grid;

          grid-template-columns:
            2.4fr
            1.25fr
            1.25fr
            1.25fr
            1.25fr;

          align-items: center;

          padding: 0 20px;

          border-bottom: 1px solid #e3e0d8;

          color: #aaa69e;

          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.5px;
        }

        /* ROW */

        .permission-row {
          min-height: 53px;

          display: grid;

          grid-template-columns:
            2.4fr
            1.25fr
            1.25fr
            1.25fr
            1.25fr;

          align-items: center;

          padding: 0 20px;

          border-bottom: 1px solid #e3e0d8;
        }

        .permission-row:last-child {
          border-bottom: none;
        }

        .module-name {
          font-family: monospace;

          font-size: 10px;

          color: #11140f;
        }

        /* PERMISSION BADGES */

        .permission {
          display: inline-block;

          padding: 5px 10px;

          border-radius: 9px;

          font-family: monospace;
          font-size: 8px;

          color: #817e77;

          background: #f0eff1;
        }

        .permission.full {
          color: #607357;
          background: #eaf1e6;
        }

        .permission.view-edit {
          color: #77748a;
          background: #f0eef4;
        }

        .permission.view {
          color: #74758a;
          background: #f0eff4;
        }

        .permission.dept {
          color: #6f7183;
          background: #f0eff4;
        }

        .permission.own {
          color: #77748a;
          background: #f0eff4;
        }

        .permission.partial {
          color: #77748a;
          background: #f0eff4;
        }

        .permission.none {
          color: #aaa69d;
          background: #e9e7e1;
        }

        /* RESPONSIVE */

        @media (max-width: 1000px) {

          .permission-card {
            overflow-x: auto;
          }

          .permission-table-header,
          .permission-row {
            min-width: 850px;
          }

        }

      `}</style>

    </div>
  );
};

export default RolesPermissions;