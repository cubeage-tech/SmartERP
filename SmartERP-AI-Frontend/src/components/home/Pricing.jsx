import React from "react";

const plans = [
  {
    number: "01",
    name: "Starter",
    subtitle: "For growing businesses",
    price: "₹12,000",
    suffix: "/month",
    features: [
      "Up to 10 users",
      "6 core modules",
      "Basic AI insights",
      "Email support",
      "Standard reports",
      "2 integrations",
    ],
    button: "GET STARTED →",
  },
  {
    number: "02",
    name: "Business",
    subtitle: "For scaling organizations",
    price: "₹28,000",
    suffix: "/month",
    features: [
      "Up to 50 users",
      "All 10 modules",
      "Full AI suite",
      "Priority support",
      "Advanced analytics",
      "Unlimited",
    ],
    button: "GET STARTED →",
    popular: true,
  },
  {
    number: "03",
    name: "Enterprise",
    subtitle: "For complex organizations",
    price: "Custom",
    suffix: " pricing",
    features: [
      "Unlimited users",
      "All + custom modules",
      "AI customization",
      "Dedicated CSM",
      "Custom reports",
      "Custom integrations",
    ],
    button: "TALK TO SALES →",
  },
  {
    number: "04",
    name: "Manufacturing",
    subtitle: "For production businesses",
    price: "₹38,000",
    suffix: "/month",
    features: [
      "Up to 100 users",
      "AI + MFG modules",
      "Machine AI & prediction",
      "Priority + onboarding",
      "Production analytics",
      "ERP integrations",
    ],
    button: "GET STARTED →",
  },
];

const Pricing = () => {
  return (
    <section
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0b0d0c",
        color: "#f1eee7",
        padding: "70px 5vw 35px",
        boxSizing: "border-box",
        fontFamily: 'Georgia, "Times New Roman", serif',
      }}
    >
      {/* TOP SECTION */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* LABEL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "22px",
            color: "#646b60",
            fontFamily: "Arial, sans-serif",
            fontSize: "7px",
            letterSpacing: "2px",
          }}
        >
          <span
            style={{
              width: "30px",
              height: "1px",
              background: "#5c6259",
            }}
          />

          <span>12 — PRICING</span>
        </div>

        {/* HEADING + DESCRIPTION */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.35fr 0.65fr",
            gap: "80px",
            alignItems: "center",
            marginBottom: "42px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(46px, 5vw, 63px)",
              fontWeight: 400,
              lineHeight: 0.92,
              letterSpacing: "-2.5px",
            }}
          >
            Straightforward
            <br />
            Pricing. No
            <br />

            <em
              style={{
                color: "#9daf8c",
                fontStyle: "italic",
              }}
            >
              Surprises.
            </em>
          </h1>

          <p
            style={{
              maxWidth: "300px",
              margin: "0 0 0 auto",
              color: "#777d73",
              fontFamily: "Arial, sans-serif",
              fontSize: "10px",
              lineHeight: 1.6,
            }}
          >
            Start with the plan that fits your team today. Upgrade seamlessly
            as your business grows.
          </p>
        </div>

        {/* PRICING CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "8px",
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                position: "relative",
                minHeight: "325px",
                padding: "22px 19px 18px",
                boxSizing: "border-box",
                borderRadius: "12px",
                background: plan.popular ? "#f1f0eb" : "#121513",
                color: plan.popular ? "#111310" : "#eeeae2",
                border: plan.popular
                  ? "1px solid #c5c4bd"
                  : "1px solid #292d29",
                overflow: "hidden",
              }}
            >
              {/* POPULAR BADGE */}
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#a4b894",
                    color: "#172015",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "6px",
                    letterSpacing: "1.5px",
                  }}
                >
                  MOST POPULAR
                </div>
              )}

              {/* CARD NUMBER */}
              <div
                style={{
                  marginTop: plan.popular ? "13px" : "0",
                  marginBottom: "8px",
                  color: plan.popular ? "#777b73" : "#626861",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "7px",
                }}
              >
                {plan.number}
              </div>

              {/* PLAN NAME */}
              <h2
                style={{
                  margin: "0 0 3px",
                  fontSize: "18px",
                  fontWeight: 500,
                  lineHeight: 1.1,
                }}
              >
                {plan.name}
              </h2>

              {/* SUBTITLE */}
              <p
                style={{
                  margin: "0 0 20px",
                  color: plan.popular ? "#777a74" : "#777d75",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "8px",
                }}
              >
                {plan.subtitle}
              </p>

              {/* PRICE */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "3px",
                  marginBottom: "17px",
                }}
              >
                <span
                  style={{
                    fontSize: plan.name === "Enterprise" ? "30px" : "29px",
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  {plan.price}
                </span>

                <span
                  style={{
                    color: plan.popular ? "#777b73" : "#696f68",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "7px",
                  }}
                >
                  {plan.suffix}
                </span>
              </div>

              {/* FEATURES */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      color: plan.popular ? "#687064" : "#737a70",
                      fontFamily: "Arial, sans-serif",
                      fontSize: "7px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: plan.popular ? "#91a682" : "#344134",
                        color: "#0c110d",
                        fontSize: "5px",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>

                    {feature}
                  </div>
                ))}
              </div>

              {/* BUTTON */}
              <button
                style={{
                  position: "absolute",
                  left: "19px",
                  right: "19px",
                  bottom: "18px",
                  height: "34px",
                  borderRadius: "8px",
                  border: plan.popular
                    ? "1px solid #111310"
                    : "1px solid #343934",
                  background: plan.popular ? "#111310" : "transparent",
                  color: plan.popular ? "#f0eee7" : "#e5e2da",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "7px",
                  letterSpacing: "1px",
                  cursor: "pointer",
                }}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>

        {/* BOTTOM NOTE */}
        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#4e554e",
            fontFamily: "Arial, sans-serif",
            fontSize: "7px",
            letterSpacing: "1.5px",
          }}
        >
          14-DAY FREE TRIAL &nbsp; · &nbsp; NO CREDIT CARD REQUIRED &nbsp; ·
          &nbsp; CANCEL ANYTIME
        </div>
      </div>

      {/* RESPONSIVE */}
      <style>
        {`
          @media (max-width: 900px) {
            section > div > div:nth-child(2) {
              grid-template-columns: 1fr !important;
              gap: 30px !important;
            }

            section > div > div:nth-child(3) {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }

          @media (max-width: 550px) {
            section {
              padding: 60px 20px 30px !important;
            }

            section > div > div:nth-child(3) {
              grid-template-columns: 1fr !important;
            }

            section h1 {
              font-size: 45px !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default Pricing;