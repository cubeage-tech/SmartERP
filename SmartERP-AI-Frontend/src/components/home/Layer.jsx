import React, { useEffect } from "react";

const Layer = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#151713";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const capabilities = [
    {
      number: "01",
      title: "Business Assistant",
      description: "Natural language answers from your live ERP data.",
    },
    {
      number: "02",
      title: "Dashboard Analytics",
      description: "Key insights surfaced automatically every session.",
    },
    {
      number: "03",
      title: "Forecasting Engine",
      description: "Sales, demand, revenue and inventory predicted 90 days ahead.",
    },
    {
      number: "04",
      title: "Document Processing",
      description: "OCR extraction from invoices, bills and contracts.",
    },
    {
      number: "05",
      title: "Workflow Automation",
      description: "Multi-step approvals triggered and resolved automatically.",
    },
    {
      number: "06",
      title: "Fraud Detection",
      description: "Anomalies, duplicate invoices and unusual transactions flagged.",
    },
    {
      number: "07",
      title: "Support Chatbot",
      description: "Customer queries answered using live business context.",
    },
    {
      number: "08",
      title: "Report Generator",
      description: "Full reports generated from a single natural-language prompt.",
    },
  ];

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .layer-page {
          width: 100%;
          min-height: 100vh;
          background-color: #151713;
          color: #f3f1e9;
          position: relative;
          overflow: hidden;
          padding: 108px 0 82px;
          font-family: Arial, Helvetica, sans-serif;

          background-image:
            radial-gradient(
              circle,
              rgba(224, 226, 214, 0.105) 0.7px,
              transparent 0.9px
            );
          background-size: 30px 30px;
        }

        .layer-container {
          width: calc(100% - 190px);
          max-width: 1548px;
          margin: 0 auto;
        }

        /* ---------------- HEADER ---------------- */

        .layer-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 0.72fr);
          column-gap: 80px;
          align-items: start;
          margin-bottom: 96px;
        }

        .layer-heading-area {
          min-width: 0;
        }

        .layer-eyebrow {
          display: flex;
          align-items: center;
          gap: 19px;
          margin-bottom: 70px;

          color: #91a17e;
          font-family: "Courier New", monospace;
          font-size: 13px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .layer-eyebrow-line {
          width: 38px;
          height: 1px;
          background: #7e9670;
          flex-shrink: 0;
        }

        .layer-title {
          margin: 0;
          max-width: 600px;

          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(58px, 5.15vw, 94px);
          font-weight: 400;
          line-height: 0.91;
          letter-spacing: -4.5px;
        }

        .layer-title-accent {
          display: block;
          color: #a9b995;
          font-style: italic;
          margin-top: 10px;
        }

        .layer-intro {
          padding-top: 133px;
          max-width: 510px;
          justify-self: end;
        }

        .layer-intro-text {
          margin: 0;
          color: #8d9790;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 20px;
          line-height: 1.7;
          font-weight: 400;
        }

        .layer-pill {
          margin-top: 40px;

          display: inline-flex;
          align-items: center;
          gap: 10px;

          padding: 14px 21px;
          border: 1px solid #34402f;
          border-radius: 14px;

          background: rgba(67, 80, 59, 0.23);
          color: #98ac87;

          font-family: "Courier New", monospace;
          font-size: 12px;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }

        .layer-pill-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #91a97d;
          box-shadow: 0 0 8px rgba(145, 169, 125, 0.15);
        }

        /* ---------------- CAPABILITY GRID ---------------- */

        .layer-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));

          border-left: 1px solid rgba(103, 111, 101, 0.19);
          border-top: 1px solid rgba(103, 111, 101, 0.19);
        }

        .layer-card {
          min-width: 0;
          min-height: 188px;

          padding: 28px 29px 30px;

          position: relative;

          border-right: 1px solid rgba(103, 111, 101, 0.19);
          border-bottom: 1px solid rgba(103, 111, 101, 0.19);

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          transition:
            background-color 220ms ease,
            border-color 220ms ease;
        }

        .layer-card:hover {
          background: rgba(125, 145, 108, 0.035);
          border-color: rgba(135, 153, 122, 0.3);
        }

        .layer-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        .layer-card-number {
          color: #4e574e;
          font-family: "Courier New", monospace;
          font-size: 13px;
          line-height: 1;
        }

        .layer-card-icon {
          width: 30px;
          height: 30px;

          border-radius: 9px;
          border: 1px solid #33402f;

          background: rgba(63, 78, 55, 0.26);

          display: flex;
          align-items: center;
          justify-content: center;

          color: #9db58b;
          font-family: Arial, sans-serif;
          font-size: 14px;

          flex-shrink: 0;
        }

        .layer-card-content {
          margin-top: 28px;
          min-width: 0;
        }

        .layer-card-title {
          margin: 0 0 10px;

          color: #f0eee7;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 23px;
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: -0.5px;
        }

        .layer-card-description {
          margin: 0;
          max-width: 330px;

          color: #626a62;

          font-family: "Courier New", monospace;
          font-size: 13px;
          line-height: 1.55;
          letter-spacing: 0.1px;
        }

        /* ---------------- ASSISTANT PANEL ---------------- */

        .assistant-panel {
          margin-top: 78px;

          width: 100%;
          min-height: 560px;

          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(430px, 0.75fr);

          border: 1px solid rgba(90, 98, 89, 0.22);
          border-radius: 30px;

          background: rgba(10, 12, 10, 0.58);

          overflow: hidden;
        }

        .assistant-left {
          min-width: 0;
          padding: 48px 55px 50px;

          display: flex;
          flex-direction: column;
        }

        .assistant-badge {
          align-self: flex-start;

          display: inline-flex;
          align-items: center;
          gap: 10px;

          padding: 11px 17px;

          border: 1px solid #34402f;
          border-radius: 20px;

          color: #91a77f;
          background: rgba(52, 64, 47, 0.12);

          font-family: "Courier New", monospace;
          font-size: 12px;
          letter-spacing: 1.15px;
          text-transform: uppercase;
        }

        .assistant-badge-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #91a77f;
        }

        .assistant-title {
          margin: 47px 0 0;

          max-width: 500px;

          color: #f2f0e9;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(52px, 4.35vw, 76px);
          font-weight: 400;
          line-height: 0.92;
          letter-spacing: -3.5px;
        }

        .assistant-description {
          margin: 39px 0 0;

          max-width: 480px;

          color: #727b73;
          font-size: 19px;
          line-height: 1.7;
        }

        .assistant-stats {
          margin-top: auto;
          padding-top: 55px;

          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .assistant-stat {
          min-height: 105px;

          padding: 20px 21px;

          border: 1px solid rgba(89, 97, 88, 0.25);
          border-radius: 15px;

          background: #20231f;

          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .assistant-stat-value {
          color: #f0eee7;

          font-family: Georgia, "Times New Roman", serif;
          font-size: 38px;
          line-height: 1;
        }

        .assistant-stat-label {
          margin-top: 10px;

          color: #697169;

          font-family: "Courier New", monospace;
          font-size: 11px;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        /* ---------------- CHAT MOCKUP ---------------- */

        .assistant-right {
          min-width: 0;

          padding: 28px;

          border-left: 1px solid rgba(90, 98, 89, 0.2);

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-window {
          width: 100%;
          height: 100%;
          min-height: 500px;

          padding: 24px;

          border: 1px solid rgba(90, 98, 89, 0.3);
          border-radius: 21px;

          background: #171a17;

          display: flex;
          flex-direction: column;
        }

        .chat-header {
          min-height: 48px;

          padding: 0 15px;

          border: 1px solid rgba(91, 99, 90, 0.23);
          border-radius: 14px;

          background: #20231f;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;

          color: #8b948c;

          font-family: "Courier New", monospace;
          font-size: 12px;
        }

        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-ai-icon {
          width: 27px;
          height: 27px;

          border-radius: 8px;
          border: 1px solid #384332;

          background: #293026;

          color: #a2ba8f;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 13px;
        }

        .chat-live {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .chat-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #91a97d;
        }

        .chat-user-message {
          align-self: flex-end;

          width: 86%;
          margin-top: 21px;

          padding: 19px 20px;

          border: 1px solid rgba(96, 104, 94, 0.27);
          border-radius: 18px;

          background: #20231f;

          color: #c1c9c1;

          font-family: "Courier New", monospace;
          font-size: 13px;
          line-height: 1.55;
        }

        .chat-response-row {
          display: flex;
          gap: 14px;

          margin-top: 21px;
        }

        .chat-response-icon {
          width: 36px;
          height: 36px;

          flex-shrink: 0;

          border: 1px solid #3c4935;
          border-radius: 11px;

          background: #252c23;

          color: #a1b68f;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-response {
          flex: 1;
          min-width: 0;

          padding: 18px 19px;

          border: 1px solid rgba(83, 92, 83, 0.18);
          border-radius: 18px;

          background: #101310;

          color: #aab3ab;

          font-size: 15px;
          line-height: 1.65;
        }

        .chat-response strong {
          color: #f1efe8;
          font-weight: 600;
        }

        .chat-subtext {
          margin-top: 16px;
          color: #747d75;
        }

        .chat-metrics {
          margin-top: 20px;

          display: grid;
          grid-template-columns: repeat(3, 1fr);

          border: 1px solid rgba(88, 97, 87, 0.25);
          border-radius: 14px;

          overflow: hidden;

          background: #20231f;
        }

        .chat-metric {
          min-width: 0;
          padding: 13px 5px;
          text-align: center;
        }

        .chat-metric + .chat-metric {
          border-left: 1px solid rgba(88, 97, 87, 0.18);
        }

        .chat-metric-value {
          color: #f0eee7;

          font-family: Georgia, "Times New Roman", serif;
          font-size: 18px;
        }

        .chat-metric-label {
          margin-top: 5px;

          color: #697169;

          font-family: "Courier New", monospace;
          font-size: 8px;
          letter-spacing: 0.25px;
          text-transform: uppercase;
        }

        .chat-buttons {
          display: flex;
          gap: 10px;
          margin-top: 14px;
        }

        .chat-button {
          padding: 9px 13px;

          border: 1px solid #35412f;
          border-radius: 10px;

          background: transparent;

          color: #8fa27f;

          font-family: "Courier New", monospace;
          font-size: 10px;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        .chat-button.secondary {
          border-color: rgba(91, 99, 90, 0.22);
          color: #5f675f;
        }

        /* ---------------- RESPONSIVE ---------------- */

        @media (max-width: 900px) {
          .layer-container {
            width: calc(100% - 60px);
          }

          .layer-header {
            column-gap: 50px;
          }

          .layer-title {
            font-size: clamp(52px, 6vw, 76px);
          }

          .layer-intro {
            padding-top: 105px;
          }

          .layer-card {
            min-height: 180px;
            padding: 25px 22px;
          }

          .assistant-panel {
            grid-template-columns: minmax(0, 1fr) minmax(370px, 0.75fr);
          }

          .assistant-left {
            padding: 42px;
          }
        }

        @media (max-width: 900px) {
          .layer-page {
            padding-top: 75px;
          }

          .layer-container {
            width: calc(100% - 40px);
          }

          .layer-header {
            grid-template-columns: 1fr;
            row-gap: 50px;
            margin-bottom: 65px;
          }

          .layer-eyebrow {
            margin-bottom: 45px;
          }

          .layer-title {
            max-width: 680px;
            font-size: clamp(50px, 9vw, 72px);
          }

          .layer-intro {
            padding-top: 0;
            justify-self: start;
            max-width: 600px;
          }

          .layer-intro-text {
            font-size: 18px;
          }

          .layer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .assistant-panel {
            grid-template-columns: 1fr;
          }

          .assistant-right {
            border-left: 0;
            border-top: 1px solid rgba(90, 98, 89, 0.2);
          }

          .chat-window {
            min-height: 480px;
          }
        }

        @media (max-width: 600px) {
          .layer-page {
            padding: 55px 0 55px;
          }

          .layer-container {
            width: calc(100% - 28px);
          }

          .layer-header {
            margin-bottom: 50px;
          }

          .layer-eyebrow {
            margin-bottom: 38px;
            font-size: 10px;
            letter-spacing: 1px;
          }

          .layer-eyebrow-line {
            width: 28px;
          }

          .layer-title {
            font-size: clamp(44px, 13vw, 61px);
            line-height: 0.93;
            letter-spacing: -2.5px;
          }

          .layer-intro-text {
            font-size: 16px;
            line-height: 1.65;
          }

          .layer-pill {
            margin-top: 27px;
            padding: 12px 15px;
            font-size: 9px;
          }

          .layer-pill-dot {
            width: 9px;
            height: 9px;
          }

          .layer-grid {
            grid-template-columns: 1fr;
          }

          .layer-card {
            min-height: 170px;
            padding: 24px 21px;
          }

          .layer-card-title {
            font-size: 21px;
          }

          .layer-card-description {
            max-width: 100%;
            font-size: 11px;
          }

          .assistant-panel {
            margin-top: 55px;
            border-radius: 22px;
          }

          .assistant-left {
            padding: 28px 22px 25px;
          }

          .assistant-badge {
            font-size: 9px;
            padding: 9px 12px;
          }

          .assistant-title {
            margin-top: 36px;
            font-size: 48px;
            letter-spacing: -2px;
          }

          .assistant-description {
            margin-top: 28px;
            font-size: 16px;
            line-height: 1.6;
          }

          .assistant-stats {
            margin-top: 35px;
            padding-top: 0;
          }

          .assistant-stat {
            min-height: 90px;
            padding: 16px;
          }

          .assistant-stat-value {
            font-size: 30px;
          }

          .assistant-stat-label {
            font-size: 8px;
          }

          .assistant-right {
            padding: 15px;
          }

          .chat-window {
            padding: 14px;
            min-height: 430px;
          }

          .chat-user-message {
            width: 94%;
            font-size: 11px;
          }

          .chat-response {
            font-size: 13px;
          }
        }

        @media (max-width: 380px) {
          .layer-title {
            font-size: 41px;
          }

          .assistant-title {
            font-size: 42px;
          }

          .assistant-stats {
            grid-template-columns: 1fr;
          }

          .chat-metrics {
            grid-template-columns: 1fr;
          }

          .chat-metric + .chat-metric {
            border-left: 0;
            border-top: 1px solid rgba(88, 97, 87, 0.18);
          }
        }
      `}</style>

      <main className="layer-page">
        <div className="layer-container">

          {/* ================= HEADER ================= */}

          <section className="layer-header">

            <div className="layer-heading-area">

              <div className="layer-eyebrow">
                <span className="layer-eyebrow-line"></span>
                <span>05 — AI Layer</span>
              </div>

              <h1 className="layer-title">
                AI That Doesn't
                <br />
                Just Analyze.
                <span className="layer-title-accent">
                  It Acts.
                </span>
              </h1>

            </div>

            <div className="layer-intro">

              <p className="layer-intro-text">
                Intelligence built into every layer of your ERP — not
                bolted on after. Eight AI capabilities working together
                as one intelligent system.
              </p>

              <div className="layer-pill">
                <span className="layer-pill-dot"></span>
                <span>8 AI Capabilities. One System.</span>
              </div>

            </div>

          </section>

          {/* ================= AI CAPABILITIES ================= */}

          <section className="layer-grid">

            {capabilities.map((item) => (
              <article
                className="layer-card"
                key={item.number}
              >

                <div className="layer-card-top">

                  <span className="layer-card-number">
                    {item.number}
                  </span>

                  <span className="layer-card-icon">
                    ✦
                  </span>

                </div>

                <div className="layer-card-content">

                  <h2 className="layer-card-title">
                    {item.title}
                  </h2>

                  <p className="layer-card-description">
                    {item.description}
                  </p>

                </div>

              </article>
            ))}

          </section>

          {/* ================= AI BUSINESS ASSISTANT ================= */}

          <section className="assistant-panel">

            {/* LEFT SIDE */}

            <div className="assistant-left">

              <div className="assistant-badge">
                <span className="assistant-badge-dot"></span>
                <span>Permission-Aware Business Intelligence</span>
              </div>

              <h2 className="assistant-title">
                Ask Your
                <br />
                Business
                <br />
                Anything.
              </h2>

              <p className="assistant-description">
                The AI Business Assistant understands your
                data structure, respects role-based permissions
                and surfaces actionable intelligence — not just
                information.
              </p>

              <div className="assistant-stats">

                <div className="assistant-stat">
                  <span className="assistant-stat-value">
                    ∞
                  </span>

                  <span className="assistant-stat-label">
                    Queries Per Day
                  </span>
                </div>

                <div className="assistant-stat">
                  <span className="assistant-stat-value">
                    10
                  </span>

                  <span className="assistant-stat-label">
                    Modules Covered
                  </span>
                </div>

              </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="assistant-right">

              <div className="chat-window">

                {/* Chat header */}

                <div className="chat-header">

                  <div className="chat-header-left">

                    <span className="chat-ai-icon">
                      ✦
                    </span>

                    <span>
                      AI Business Assistant
                    </span>

                  </div>

                  <span className="chat-live">
                    <span className="chat-live-dot"></span>
                    Live
                  </span>

                </div>

                {/* User question */}

                <div className="chat-user-message">
                  Show me last month's sales performance and
                  identify the biggest decline.
                </div>

                {/* AI answer */}

                <div className="chat-response-row">

                  <div className="chat-response-icon">
                    ✦
                  </div>

                  <div className="chat-response">

                    <div>
                      Sales decreased{" "}
                      <strong>6.8%</strong> compared with the
                      previous month. The largest decline came
                      from the <strong>West region</strong>,
                      primarily in Industrial Components.
                    </div>

                    <div className="chat-subtext">
                      3 accounts contributed 42% of the decline.
                    </div>

                    <div className="chat-metrics">

                      <div className="chat-metric">
                        <div className="chat-metric-value">
                          -6.8%
                        </div>
                        <div className="chat-metric-label">
                          Vs Prior Month
                        </div>
                      </div>

                      <div className="chat-metric">
                        <div className="chat-metric-value">
                          3 accts
                        </div>
                        <div className="chat-metric-label">
                          Driving Decline
                        </div>
                      </div>

                      <div className="chat-metric">
                        <div className="chat-metric-value">
                          42%
                        </div>
                        <div className="chat-metric-label">
                          Share of Decline
                        </div>
                      </div>

                    </div>

                    <div className="chat-buttons">

                      <button className="chat-button">
                        View Report →
                      </button>

                      <button className="chat-button secondary">
                        Regional View
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </section>

        </div>
      </main>
    </>
  );
};

export default Layer;