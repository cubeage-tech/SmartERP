import React from "react";

const functions = [
  { label: "Documents", top: "16%", left: "37%" },
  { label: "CRM", top: "25%", left: "72%" },
  { label: "Sales", top: "42%", left: "82%" },
  { label: "Purchase", top: "60%", left: "81%" },
  { label: "Inventory", top: "78%", left: "70%" },
  { label: "Manufacturing", top: "87%", left: "50%" },
  { label: "Finance", top: "79%", left: "29%" },
  { label: "HR & Payroll", top: "60%", left: "17%" },
  { label: "Projects", top: "42%", left: "18%" },
];

const Ecosystem = () => {
  return (
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#0b0d0c",
        padding: "8px 3.7vw",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: "calc(100vh - 16px)",
          background: "#f3f1eb",
          borderRadius: "0 0 28px 28px",
          overflow: "hidden",
          color: "#10110f",
        }}
      >
        {/* CONTENT */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            minHeight: "100vh",
            padding: "70px 7%",
            boxSizing: "border-box",
          }}
        >
          {/* LEFT SIDE */}
          <div>
            {/* LABEL */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "38px",
                fontFamily: "Arial, sans-serif",
                fontSize: "8px",
                letterSpacing: "2px",
                color: "#7d817a",
              }}
            >
              <span
                style={{
                  width: "32px",
                  height: "1px",
                  background: "#8a8d86",
                }}
              />

              <span>03 — ECOSYSTEM</span>
            </div>

            {/* HEADING */}
            <h1
              style={{
                margin: 0,
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: "clamp(48px, 5vw, 72px)",
                fontWeight: 400,
                lineHeight: 0.9,
                letterSpacing: "-3px",
              }}
            >
              One Platform.
              <br />
              Every Function.
              <br />

              <em
                style={{
                  color: "#a8a7bb",
                  fontStyle: "italic",
                }}
              >
                One Truth.
              </em>
            </h1>

            {/* DESCRIPTION */}
            <p
              style={{
                maxWidth: "330px",
                marginTop: "38px",
                marginBottom: "25px",
                fontFamily: "Arial, sans-serif",
                fontSize: "11px",
                lineHeight: 1.7,
                color: "#777a74",
              }}
            >
              SmartERP AI connects all ten business functions through a unified
              data model, shared permission engine and AI layer — so your
              entire organization moves from one source of truth.
            </p>

            {/* FEATURES */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "11px",
                fontFamily: "Arial, sans-serif",
                fontSize: "9px",
                color: "#777a74",
              }}
            >
              <Feature
                number="01"
                text="Unified data model — no more duplicate records"
              />

              <Feature
                number="02"
                text="Role-based permissions across every module"
              />

              <Feature
                number="03"
                text="AI running across all 10 functions simultaneously"
              />

              <Feature
                number="04"
                text="Real-time cross-department visibility"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "600px",
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            {/* CONNECTING LINES */}
            {functions.map((item) => (
              <div
                key={item.label}
                style={{
                  position: "absolute",
                  width: "1px",
                  height: "150px",
                  background:
                    "linear-gradient(to bottom, rgba(130,130,125,0.08), rgba(130,130,125,0.35))",
                  left: "50%",
                  top: "50%",
                  transformOrigin: "top",
                  transform: `rotate(${getAngle(
                    item.left,
                    item.top
                  )}deg)`,
                }}
              />
            ))}

            {/* AI LAYER */}
            <div
              style={{
                position: "absolute",
                top: "2%",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "7px 14px",
                borderRadius: "10px",
                background: "#faf9f5",
                border: "1px solid #deddd6",
                boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                fontFamily: "Arial, sans-serif",
                fontSize: "6px",
                textAlign: "center",
                zIndex: 5,
              }}
            >
              <div
                style={{
                  color: "#99988f",
                  fontSize: "5px",
                  marginBottom: "3px",
                }}
              >
                AI LAYER
              </div>

              <div style={{ color: "#77776f" }}>
                Company Matrix
              </div>
            </div>

            {/* CENTER */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70px",
                height: "70px",
                borderRadius: "15px",
                background: "#0d0f0e",
                boxShadow: "0 12px 35px rgba(0,0,0,0.18)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 4,
              }}
            >
              {/* LOGO */}
              <div
                style={{
                  display: "flex",
                  gap: "3px",
                  marginBottom: "5px",
                }}
              >
                <span
                  style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "2px",
                    background: "#8da47d",
                  }}
                />

                <span
                  style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "2px",
                    background: "#a5b594",
                  }}
                />
              </div>

              <span
                style={{
                  color: "#f4f1e8",
                  fontFamily: "Georgia, serif",
                  fontSize: "7px",
                }}
              >
                SmartERP
              </span>

              <span
                style={{
                  color: "#aaaab2",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "5px",
                  marginTop: "2px",
                }}
              >
                AI
              </span>
            </div>

            {/* MODULES */}
            {functions.map((item) => (
              <div
                key={item.label}
                style={{
                  position: "absolute",
                  top: item.top,
                  left: item.left,
                  transform: "translate(-50%, -50%)",
                  minWidth: "53px",
                  padding: "7px 9px",
                  borderRadius: "7px",
                  background: "#faf9f5",
                  border: "1px solid #deddd6",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.04)",
                  textAlign: "center",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "6px",
                  color: "#73756f",
                  zIndex: 3,
                }}
              >
                <div
                  style={{
                    fontSize: "5px",
                    color: "#aaa9a0",
                    marginBottom: "2px",
                  }}
                >
                  {String(
                    functions.indexOf(item) + 1
                  ).padStart(2, "0")}
                </div>

                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RESPONSIVE */}
      <style>
        {`
          @media (max-width: 800px) {
            section > div > div {
              grid-template-columns: 1fr !important;
              padding: 70px 30px !important;
            }

            section > div > div > div:nth-child(2) {
              height: 500px !important;
              margin-top: 30px !important;
            }
          }
        `}
      </style>
    </section>
  );
};

/* FEATURE COMPONENT */
function Feature({ number, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}
    >
      <span
        style={{
          color: "#b4b5ae",
          fontSize: "6px",
        }}
      >
        {number}
      </span>

      <span
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "#9da09a",
        }}
      />

      <span>{text}</span>
    </div>
  );
}

/* LINE ANGLE */
function getAngle(left, top) {
  const x = parseFloat(left);
  const y = parseFloat(top);

  const dx = x - 50;
  const dy = y - 50;

  return Math.atan2(dx, -dy) * (180 / Math.PI);
}

export default Ecosystem;