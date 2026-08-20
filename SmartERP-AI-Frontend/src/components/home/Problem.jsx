import React from "react";

const problems = [
  {
    number: "01",
    title: "Scattered Data",
    description:
      "Finance, sales, inventory and operations live across disconnected tools — creating gaps, delays and conflicting numbers that cost real money.",
    stat: "73%",
    statDescription: "OF BUSINESSES\nUSE DISCONNECTED TOOLS",
  }, 
  { 
    number: "02",
    title: "Manual Processes",
    description:
      "Teams spend valuable hours entering, reconciling and validating information that should flow automatically between systems.",
    stat: "19hrs",
    statDescription:
      "WASTED PER EMPLOYEE PER\nWEEK ON MANUAL DATA WORK",
  },
  {
    number: "03",
    title: "Delayed Decisions",
    description:
      "Leadership lacks real-time visibility into cash, stock, sales and operations — forced to decide with yesterday's numbers.",
    stat: "48hrs",
    statDescription:
      "AVERAGE DELAY TO GET A\nCROSS-DEPARTMENT REPORT",
  },
  {
    number: "04",
    title: "Reactive Operations",
    description:
      "Businesses respond to problems instead of predicting them — losing margin, customers and competitive edge quarter after quarter.",
    stat: "3×",
    statDescription:
      "FASTER RESPONSE WITH AI-\nPREDICTIVE ERP",
  },
];

const Problem = () => {
  return (
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#0b0d0c",
        color: "#f1eee7",
        padding: "100px 7vw",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
        }}
      >
        {/* TOP SECTION */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr 0.75fr",
            gap: "80px",
            alignItems: "end",
            paddingBottom: "65px",
          }}
        >
          {/* HEADING */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "13px",
                color: "#62675f",
                fontFamily: "Arial, sans-serif",
                fontSize: "8px",
                letterSpacing: "2px",
                marginBottom: "32px",
              }}
            >
              <span
                style={{
                  width: "32px",
                  height: "1px",
                  background: "#62675f",
                  display: "inline-block",
                }}
              />

              <span>02 — THE PROBLEM</span>
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: "clamp(48px, 5vw, 70px)",
                fontWeight: 400,
                lineHeight: 0.93,
                letterSpacing: "-3px",
              }}
            >
              Your Business
              <br />
              Shouldn't Run on
              <br />

              <em
                style={{
                  color: "#9b9a95",
                  fontStyle: "italic",
                }}
              >
                Disconnected
              </em>

              <br />
              Systems.
            </h1>
          </div>

          {/* INTRO TEXT */}
          <p
            style={{
              maxWidth: "280px",
              margin: "0 0 8px auto",
              color: "#6f746d",
              fontFamily: "Arial, sans-serif",
              fontSize: "10px",
              lineHeight: 1.6,
            }}
          >
            Every day your teams operate across fragmented tools is a day of
            lost revenue, missed opportunities and decisions made on incomplete
            data.
          </p>
        </div>

        {/* PROBLEM LIST */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {problems.map((problem) => (
            <div
              key={problem.number}
              style={{
                display: "grid",
                gridTemplateColumns: "65px 1fr 150px",
                gap: "20px",
                minHeight: "97px",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* NUMBER */}
              <div
                style={{
                  color: "#41463f",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "8px",
                }}
              >
                {problem.number}
              </div>

              {/* CONTENT */}
              <div>
                <h2
                  style={{
                    margin: "0 0 9px",
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: "18px",
                    fontWeight: 500,
                  }}
                >
                  {problem.title}
                </h2>

                <p
                  style={{
                    maxWidth: "520px",
                    margin: 0,
                    color: "#70756e",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "9px",
                    lineHeight: 1.55,
                  }}
                >
                  {problem.description}
                </p>
              </div>

              {/* STAT */}
              <div
                style={{
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    color: "#30352f",
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: "29px",
                    lineHeight: 1,
                  }}
                >
                  {problem.stat}
                </div>

                <span
                  style={{
                    display: "block",
                    marginTop: "5px",
                    color: "#4d514b",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "5px",
                    lineHeight: 1.35,
                    letterSpacing: "0.5px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {problem.statDescription}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESPONSIVE STYLE */}
      <style>
        {`
          @media (max-width: 768px) {
            section {
              padding: 70px 25px !important;
            }

            section > div > div:first-child {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }

            section h1 {
              font-size: 48px !important;
            }

            section > div > div:nth-child(2) > div {
              grid-template-columns: 35px 1fr !important;
              padding: 30px 0;
            }

            section > div > div:nth-child(2) > div > div:last-child {
              grid-column: 2;
              text-align: left !important;
              margin-top: 15px;
            }
          }
        `}
      </style>
    </section>
  );
};

export default Problem;