import React from "react";

// ============================================================
// INDUSTRY DATA
// ============================================================

const industries = [
  {
    number: "01",
    name: "Manufacturing",
    description:
      "BOM, work orders, machine tracking, production scheduling and quality control.",
  },
  {
    number: "02",
    name: "Trading",
    description:
      "Multi-warehouse inventory, purchase orders, margin tracking and supplier management.",
  },
  {
    number: "03",
    name: "Construction",
    description:
      "Project milestones, subcontractors, site budgets and material procurement.",
  },
  {
    number: "04",
    name: "Warehousing",
    description:
      "Bins, zones, batch and lot tracking, stock transfers and expiry management.",
  },
  {
    number: "05",
    name: "Textiles",
    description:
      "Fabric inventory, roll tracking, dyeing batches and production run management.",
  },
  {
    number: "06",
    name: "Automobile",
    description:
      "Service orders, parts inventory, vehicle tracking and dealer management.",
  },
  {
    number: "07",
    name: "Healthcare",
    description:
      "Patient billing, pharmacy inventory, compliance tracking and staff scheduling.",
  },
  {
    number: "08",
    name: "Retail",
    description:
      "Multi-store inventory, POS integration, customer loyalty and reorder automation.",
  },
  {
    number: "09",
    name: "Services",
    description:
      "Project billing, time tracking, client management and resource allocation.",
  },
];

const marqueeItems = [
  "MANUFACTURING",
  "TRADING",
  "CONSTRUCTION",
  "WAREHOUSING",
  "TEXTILES",
  "AUTOMOBILE",
  "HEALTHCARE",
  "RETAIL",
  "SERVICES",
];

// ============================================================
// MARQUEE
// ============================================================

function MarqueeItemList() {
  return (
    <div className="flex shrink-0 items-center">
      {marqueeItems.map((item, index) => (
        <React.Fragment key={item}>
          <span
            className="
              whitespace-nowrap
              px-8
              py-4
              font-mono
              text-[10px]
              font-light
              uppercase
              tracking-[0.13em]
              text-[#a2a39c]
              sm:px-10
              sm:text-[11px]
            "
          >
            {item}
          </span>

          {index !== marqueeItems.length - 1 && (
            <span className="text-[10px] text-[#c8ccb9]">•</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Marquee() {
  return (
    <div className="w-full overflow-hidden border-y border-[#deded7] bg-[#f7f6f1]">
      <div className="industries-marquee flex w-max">
        {/* Duplicate list creates the continuous marquee effect */}
        <MarqueeItemList />
        <MarqueeItemList />
      </div>
    </div>
  );
}

// ============================================================
// INDUSTRY ROW
// ============================================================

function IndustryRow({ industry }) {
  return (
    <div
      className="
        group
        grid
        grid-cols-[55px_1fr]
        gap-3
        rounded-[20px]
        border-b
        border-[#deded7]
        px-4
        py-6
        transition-all
        duration-300
        ease-out
        hover:border-[#deded7]
        hover:bg-white
        sm:grid-cols-[85px_1fr]
        sm:gap-5
        sm:px-5
        sm:py-[29px]
        lg:grid-cols-[125px_1fr_1.7fr]
        lg:items-center
        lg:gap-0
        lg:px-4
        lg:py-[24px]
      "
    >
      {/* NUMBER */}
      <div className="flex items-start lg:items-center">
        <span
          className="
            font-mono
            text-[10px]
            font-normal
            tracking-[0.08em]
            text-[#c1c3bb]
            transition-colors
            duration-300
            group-hover:text-[#969a8d]
            sm:text-[14px]
          "
        >
          {industry.number}
        </span>
      </div>

      {/* INDUSTRY NAME */}
      <div>
        <h2
          className="
            font-serif
            font-semi-bold
            text-[30px]
            leading-none
            tracking-[-0.01em]
            text-[#151515]
            transition-transform
            duration-300
            ease-out
            group-hover:translate-x-1
            sm:text-[22px]
            md:text-[26px]
          "
        >
          {industry.name}
        </h2>
      </div>

      {/* DESCRIPTION */}
      <div
        className="
          col-start-2
          mt-3
          lg:col-start-auto
          lg:mt-0
          lg:pl-28
        "
      >
        <p
          className="
            max-w-[600px]
            font-mono
            text-[9px]
            font-light
            leading-[1.8]
            tracking-[0.015em]
            text-[#999b94]
            sm:text-[10px]
            lg:text-[12px]
          "
        >
          {industry.description}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// MAIN INDUSTRIES PAGE
// ============================================================

const Industries = () => {
  return (
    <>
      {/* Marquee animation */}
      <style>{`
        @keyframes industries-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .industries-marquee {
          animation: industries-scroll 35s linear infinite;
        }
      `}</style>

      {/* PAGE BACKGROUND */}
      <main className="min-h-screen bg-[#0b0e0b]">
        {/* FULL-WIDTH MARQUEE */}
        <Marquee />

        {/* =====================================================
            CREAM INDUSTRIES SECTION
        ====================================================== */}

        <section
          className="
            relative
            mx-auto
            w-[calc(100%-36px)]
            max-w-[1380px]
            overflow-hidden
            rounded-t-[36px]
            rounded-b-[36px]
            bg-[#f7f6f1]
            px-6
            pb-12
            pt-20
            sm:w-[calc(100%-48px)]
            sm:px-10
            sm:pb-12
            sm:pt-24
            md:px-14
            lg:px-[2%]
            lg:pb-23
            lg:pt-16
          "
        >
          {/* DOT TEXTURE */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.42]
            "
            style={{
              backgroundImage:
                "radial-gradient(#c8c8c0 0.65px, transparent 0.95px)",
              backgroundSize: "20px 18px",
            }}
          />

          {/* CONTENT */}
          <div className="relative z-10">
            {/* =================================================
                HERO
            ================================================== */}

            <div
              className="
                grid
                grid-cols-1
                gap-12
                lg:grid-cols-[55%_45%]
                lg:items-center
              "
            >
              {/* LEFT — HEADING */}
              <div>
                {/* SECTION LABEL */}
                <div className="mb-8 flex items-center gap-3 sm:mb-9">
                  <span className="h-px w-8 bg-[#aeb5a3]" />

                  <span
                    className="
                      font-mono
                      text-[11px]
                      font-light
                      uppercase
                      tracking-[0.17em]
                      text-[#384134]
                    "
                  >
                    11 — INDUSTRIES
                  </span>
                </div>

                {/* HEADING */}
                <h1
                  className="
                    max-w-[500px]
                    font-[Georgia,_serif]
                    text-[58px]
                    leading-[0.95]
                    tracking-[-0.03em]
                    text-[#121212]
                    sm:text-[66px]
                    md:text-[76px]
                    lg:text-[70px]
                    xl:text-[62px]
                  "
                >
                  Built to Adapt
                  <br />
                  to the Way
                  <br />
                  <span className="italic text-[#A5A1B4]">
                    You Work.
                  </span>
                </h1>
              </div>

              {/* RIGHT — DESCRIPTION */}
              <div className="flex flex-col lg:pr-[10px]">
                <p
                  className="
                    max-w-[680px]
                    font-mono-dm
                    text-[15px]
                    font-gray-800
                    leading-[1.8]
                    tracking-[0.05em]
                    text-[#81837d]
                    sm:text-[14px]
                    lg:max-w-[680px]
                    lg:pt-[155px]
                    lg:pr-[39px]
                  "
                >
                  SmartERP AI is built for the complexities of real
                  industries — not
                  <br />
                  one-size-fits-all. Nine industry configurations ready
                  from day one.
                </p>
              </div>
            </div>

            {/* DIVIDER */}
            <div
              className="
                mt-14
                h-px
                bg-[#deded7]
                sm:mt-20
                lg:mt-[44px]
              "
            />

            {/* INDUSTRY LIST */}
            <div className="mt-0 flex flex-col">
              {industries.map((industry) => (
                <IndustryRow
                  key={industry.number}
                  industry={industry}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Industries;