import React from "react";

const Holidays = () => {
  return (
    <div className="holidays-content">

      {/* ================= HOLIDAYS CARD ================= */}

      <section className="holiday-card">

        <div className="holiday-icon">
          <span>▦</span>
        </div>

        <h2>
          Holidays
        </h2>

        <p>
          Configure holidays for your organization.
        </p>

      </section>


      {/* ================= STYLES ================= */}

      <style>{`

        .holidays-content {
          width: 100%;
        }

        .holiday-card {
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

        .holiday-icon {
          width: 42px;
          height: 42px;

          border-radius: 11px;

          background: #f5f4ef;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 10px;
        }

        .holiday-icon span {
          font-size: 19px;

          color: #c8d8e4;
        }

        .holiday-card h2 {
          margin: 0 0 7px;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 17px;

          font-weight: 400;

          color: #11140f;
        }

        .holiday-card p {
          margin: 0;

          font-family: monospace;

          font-size: 9px;

          color: #99968e;
        }

      `}</style>

    </div>
  );
};

export default Holidays;