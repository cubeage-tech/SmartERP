import React from "react";

const CompanySettings = () => {
  return (
    <div className="settings-content">

      {/* ================= SETTINGS CARD ================= */}

      <section className="settings-card">

        <div className="settings-icon">
          <span>⚙</span>
        </div>

        <h2>
          Settings
        </h2>

        <p>
          Configure settings for your organization.
        </p>

      </section>


      {/* ================= STYLES ================= */}

      <style>{`

        .settings-content {
          width: 100%;
        }

        .settings-card {
          min-height: 180px;

          background: #fff;

          border: 1px solid #e1dfd8;

          border-radius: 14px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;

          box-sizing: border-box;
        }

        .settings-icon {
          width: 42px;
          height: 42px;

          border-radius: 11px;

          background: #f5f4ef;

          display: flex;

          align-items: center;
          justify-content: center;

          margin-bottom: 10px;
        }

        .settings-icon span {
          font-size: 18px;

          color: #c8d0d0;
        }

        .settings-card h2 {
          margin: 0 0 7px;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 17px;

          font-weight: 400;

          color: #11140f;
        }

        .settings-card p {
          margin: 0;

          font-family: monospace;

          font-size: 9px;

          color: #99968e;
        }

      `}</style>

    </div>
  );
};

export default CompanySettings;