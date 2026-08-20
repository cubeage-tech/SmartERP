import React from "react";

const Overview = () => {
  const companyDetails = [
    ["Type", "Private Limited"],
    ["Industry", "Manufacturing"],
    ["Founded", "12 Apr 2010"],
    ["Fiscal Year", "April – March"],
    ["Currency", "INR (₹)"],
    ["Timezone", "IST (UTC+5:30)"],
  ];

  return (
    <div className="overview-content">

      {/* ================= OVERVIEW CONTENT ================= */}

      <section className="overview-grid">

        {/* ================= ORGANISATION CHART ================= */}

        <div className="organisation-card">

          <div className="card-title">
            Organisation Chart
          </div>

          <div className="organisation-content">

            {/* Managing Director */}

            <div className="director-box">
              <span>MANAGING DIRECTOR</span>
              <strong>Arjun Mehta</strong>
            </div>

            <div className="vertical-line director-line"></div>

            {/* Horizontal connector */}

            <div className="horizontal-line"></div>

            {/* Departments */}

            <div className="department-row">

              <div className="department-wrapper">
                <div className="vertical-small-line"></div>

                <div className="department finance">
                  <span>FINANCE</span>
                  <strong>Rahul Sharma</strong>
                </div>
              </div>

              <div className="department-wrapper">
                <div className="vertical-small-line"></div>

                <div className="department sales">
                  <span>SALES</span>
                  <strong>Ananya Singh</strong>
                </div>
              </div>

              <div className="department-wrapper">
                <div className="vertical-small-line"></div>

                <div className="department operations">
                  <span>OPERATIONS</span>
                  <strong>Vikram Joshi</strong>
                </div>
              </div>

              <div className="department-wrapper">
                <div className="vertical-small-line"></div>

                <div className="department hr">
                  <span>HR</span>
                  <strong>Deepika Rao</strong>
                </div>
              </div>

            </div>
          </div>
        </div>


        {/* ================= RIGHT COLUMN ================= */}

        <div className="right-column">

          {/* ================= COMPANY DETAILS ================= */}

          <div className="details-card">

            <div className="small-heading">
              COMPANY DETAILS
            </div>

            <div className="details-list">

              {companyDetails.map(([label, value]) => (
                <div
                  className="detail-row"
                  key={label}
                >
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}

            </div>
          </div>


          {/* ================= SUBSCRIPTION ================= */}

          <div className="subscription-card">

            <div className="subscription-label">
              SUBSCRIPTION
            </div>

            <h2>
              Business Plan
            </h2>

            <div className="subscription-info">
              50 users&nbsp;&nbsp;·&nbsp;&nbsp;All 10 modules
            </div>

            <div className="usage-box">

              <div className="usage-header">
                <span>Users used</span>
                <span>38 / 50</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: "76%" }}
                ></div>
              </div>

            </div>

            <div className="renewal">
              Renews: 31 Oct 2026
            </div>

          </div>

        </div>

      </section>


      {/* ================= PAGE CSS ================= */}

      <style>{`

       .overview-content {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  /* Dashboard controls the common left/right page margin */
  padding: 0 0 40px;
  margin: 0;
}

        /* ---------- CONTENT GRID ---------- */

        .overview-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 2fr)
            minmax(350px, 0.98fr);
          gap: 16px;
          width: 100%;
          margin-top: 18px;
        }


        /* ---------- ORGANISATION ---------- */

        .organisation-card {
          height: 480px;
          width: 100%;
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 15px;
          overflow: hidden;
        }

        .card-title {
          height: 57px;
          display: flex;
          align-items: center;
          padding: 0 20px;
          border-bottom: 1px solid #e5e2db;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 17px;
          box-sizing: border-box;
        }

        .organisation-content {
          position: relative;
          height: calc(100% - 57px);
          padding-top: 20px;
          box-sizing: border-box;
        }


        /* ---------- DIRECTOR ---------- */

        .director-box {
          width: 140px;
          height: 59px;
          margin: 0 auto;

          background: #111410;
          border-radius: 11px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          color: #fff;
        }

        .director-box span {
          font-family: monospace;
          color: #9eaf91;
          font-size: 8px;
          margin-bottom: 6px;
        }

        .director-box strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 14px;
          font-weight: 400;
        }


        /* ---------- CONNECTORS ---------- */

        .director-line {
          width: 1px;
          height: 27px;
          background: #e0ddd6;
          margin: 0 auto;
        }

        .horizontal-line {
          height: 1px;
          background: #e0ddd6;
          width: 50%;
          margin: 0 auto;
        }


        /* ---------- DEPARTMENTS ---------- */

        .department-row {
          display: flex;
          justify-content: center;
          gap: 17px;
        }

        .department-wrapper {
          width: 115px;
          position: relative;
          padding-top: 24px;
        }

        .vertical-small-line {
          width: 1px;
          height: 24px;
          background: #e0ddd6;

          position: absolute;
          top: 0;
          left: 50%;
        }

        .department {
          height: 55px;

          border: 2px solid #e8e5de;
          border-radius: 11px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          box-sizing: border-box;
        }

        .department span {
          font-family: monospace;
          font-size: 7px;
          margin-bottom: 5px;
        }

        .department strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 13px;
          font-weight: 400;
        }

        .finance {
          border-color: #dfe9da;
        }

        .finance span {
          color: #819278;
        }

        .sales {
          border-color: #e3e1eb;
        }

        .sales span {
          color: #9189a5;
        }

        .operations {
          border-color: #e9e2d2;
        }

        .operations span {
          color: #a18f6b;
        }

        .hr {
          border-color: #dfe8dc;
        }

        .hr span {
          color: #82977a;
        }


        /* ---------- RIGHT COLUMN ---------- */

        .right-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }


        /* ---------- COMPANY DETAILS ---------- */

        .details-card {
          min-height: 259px;
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 15px;
          padding: 20px;
          box-sizing: border-box;
        }

        .small-heading {
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 1px;
          color: #a19e96;
          margin-bottom: 15px;
        }

        .details-list {
          width: 100%;
        }

        .detail-row {
          min-height: 32px;
          border-bottom: 1px solid #e6e3dc;

          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .detail-row:last-child {
          border-bottom: 0;
        }

        .detail-row span {
          font-family: monospace;
          font-size: 9px;
          color: #9b9991;
        }

        .detail-row strong {
          font-family: monospace;
          font-size: 9px;
          font-weight: 400;
          color: #171914;
        }


        /* ---------- SUBSCRIPTION ---------- */

        .subscription-card {
          min-height: 205px;
          background: #111410;
          border-radius: 15px;
          padding: 20px;
          color: #fff;
          box-sizing: border-box;
        }

        .subscription-label {
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 1px;
          color: #9aae8d;
          margin-bottom: 14px;
        }

        .subscription-card h2 {
          margin: 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 24px;
          font-weight: 400;
        }

        .subscription-info {
          margin-top: 7px;

          font-family: monospace;
          font-size: 9px;
          color: #898c82;
        }

        .usage-box {
          margin-top: 16px;
          background: #20231e;
          border-radius: 12px;
          padding: 11px 12px;
        }

        .usage-header {
          display: flex;
          justify-content: space-between;

          font-family: monospace;
          font-size: 8px;
          color: #a4a69e;

          margin-bottom: 8px;
        }

        .progress-bar {
          height: 5px;
          border-radius: 10px;
          background: #363a33;
          overflow: hidden;
        }

        .progress {
          height: 100%;
          background: #9aaa8c;
          border-radius: 10px;
        }

        .renewal {
          margin-top: 13px;

          font-family: monospace;
          font-size: 8px;
          color: #656960;
        }


        /* ---------- RESPONSIVE ---------- */

        @media (max-width: 1100px) {

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .department-row {
            gap: 12px;
          }

        }


        @media (max-width: 900px) {

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .organisation-card {
            height: 480px;
          }

        }


        @media (max-width: 600px) {

          .overview-grid {
            display: block;
          }

          .organisation-card {
            overflow-x: auto;
            margin-bottom: 16px;
          }

          .department-row {
            min-width: 500px;
          }

          .organisation-content {
            min-width: 600px;
          }

          .right-column {
            width: 100%;
          }

        }

      `}</style>

    </div>
  );
};

export default Overview;