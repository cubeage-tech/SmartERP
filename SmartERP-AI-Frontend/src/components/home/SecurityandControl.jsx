import React from "react";

// Security feature cards
const securityFeatures = [
  {
    number: "01",
    title: "Role-Based Access Control",
    description:
      "Granular permissions at module, record and field level — every user sees only what they should.",
  },
  {
    number: "02",
    title: "Multi-Tenant Isolation",
    description:
      "Complete data separation between companies with tenant-scoped encryption and storage.",
  },
  {
    number: "03",
    title: "Approval Workflows",
    description:
      "Multi-level configurable chains with escalation, delegation and full audit trails.",
  },
  {
    number: "04",
    title: "Audit Trails",
    description:
      "Every action, change and access event is timestamped and attributed to a specific user.",
  },
  {
    number: "05",
    title: "Secure Authentication",
    description:
      "Enterprise SSO, MFA, session management and device trust built in from day one.",
  },
  {
    number: "06",
    title: "Permission-Aware AI",
    description:
      "The AI assistant respects access policies — it never surfaces data beyond your clearance.",
  },
  {
    number: "07",
    title: "Data Protection",
    description:
      "Encryption at rest and in transit, with GDPR-aligned data handling and retention controls.",
  },
  {
    number: "08",
    title: "Activity Monitoring",
    description:
      "Real-time detection of suspicious logins, unusual access patterns and anomalous behaviour.",
  },
];

// Access control matrix data
const accessMatrix = [
  {
    role: "Super Admin",
    permissions: [true, true, true, true],
  },
  {
    role: "Manager",
    permissions: [true, true, true, false],
  },
  {
    role: "Employee",
    permissions: [true, true, false, false],
  },
  {
    role: "Viewer",
    permissions: [true, false, false, false],
  },
];

// Permission checkbox component
function PermissionIcon({ enabled }) {
  return (
    <div
      className={`flex h-[19px] w-[19px] items-center justify-center rounded-[4px] border ${
        enabled
          ? "border-[#485541] bg-[#1c251b]"
          : "border-[#242824] bg-[#121512]"
      }`}
    >
      {enabled ? (
        <svg
          width="9"
          height="7"
          viewBox="0 0 9 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 3.5L3.2 5.5L8 1"
            stroke="#91A384"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span className="h-px w-[7px] bg-[#343934]" />
      )}
    </div>
  );
}

// Main Security & Control page
const SecurityandControl = () => {
  return (
    <main
      className="
        min-h-screen
        bg-[#1A1A1A]
        bg-[radial-gradient(circle,_rgba(180,190,175,0.12)_0.7px,_transparent_0.7px)]
        bg-[length:20px_18px]
        text-[#eeeDE7]
      "
    >
      <section
        className="
          relative mx-auto min-h-screen w-full max-w-[1320px]
          px-8 py-[74px]
          sm:px-8
          md:px-10
          lg:px-12
          xl:px-[38px]
        "
      >
        {/* TOP LABEL */}
        <div className="mb-11 flex items-center gap-3">
          <span className="h-px w-7 bg-[#485442]" />

          <span className="font-mono text-[11px] font-light uppercase tracking-[0.17em] text-[#87917e]">
            10 — SECURITY &amp; CONTROL
          </span>
        </div>

        {/* MAIN CONTENT GRID */}
        <div
          className="
            grid grid-cols-1 gap-12
            lg:grid-cols-[58%_42%] lg:gap-5
          "
        >
          {/* LEFT COLUMN */}
          <div className="min-w-0">
            {/* HERO CONTENT */}
            <div className="max-w-[650px]">
              <h1
                className="
                  font-serif
                  text-[52px]
                  leading-[0.88]
                  tracking-[-0.025em]
                  text-[#efeee8]
                  sm:text-[60px]
                  md:text-[64px]
                  lg:text-[57px]
                  xl:text-[63px]
                "
              >
                Enterprise Control
                <br />
                Without Enterprise
                <br />
                <span className="italic text-[#aaa6b9]">Complexity.</span>
              </h1>

              {/* HERO DESCRIPTION */}
              <p
                className="
                  mt-8 max-w-[420px]
                  font-mono
                  text-[14px]
                  font-light
                  leading-[1.95]
                  tracking-[0.01em]
                  text-[#858981]
                  sm:text-[15px]
                "
              >
                Security at every layer — not bolted on at the end.
                <br />
                Fine-grained permissions, complete audit trails and
                <br className="hidden sm:block" />
                intelligent anomaly detection protect your business
                <br className="hidden sm:block" />
                data.
              </p>
            </div>

            {/* ACCESS CONTROL MATRIX */}
            <div
              className="
                mt-11 w-full max-w-[670px]
                overflow-hidden
                rounded-[14px]
                border border-[#242824]
                bg-[#0d110d]
              "
            >
              {/* MATRIX TITLE */}
              <div className="px-5 pt-5 sm:px-6">
                <p
                  className="
                    font-mono
                    text-[9px]
                    font-normal
                    uppercase
                    tracking-[0.19em]
                    text-[#a1aa98]
                  "
                >
                  ACCESS CONTROL MATRIX
                </p>
              </div>

              {/* MATRIX TABLE */}
              <div className="px-5 pb-5 pt-4 sm:px-6">
                {/* TABLE HEADINGS */}
                <div
                  className="
                    grid grid-cols-[1.4fr_repeat(4,1fr)]
                    items-center
                    border-b border-[#20241f]
                    pb-3
                  "
                >
                  <div />

                  {["VIEW", "CREATE", "EDIT", "DELETE"].map((heading) => (
                    <div
                      key={heading}
                      className="
                        text-center
                        font-mono
                        text-[8px]
                        font-light
                        uppercase
                        tracking-[0.2em]
                        text-[#626961]
                      "
                    >
                      {heading}
                    </div>
                  ))}
                </div>

                {/* TABLE ROWS */}
                {accessMatrix.map((row, index) => (
                  <div
                    key={row.role}
                    className={`
                      grid grid-cols-[1.4fr_repeat(4,1fr)]
                      items-center
                      py-[9px]
                      ${
                        index !== accessMatrix.length - 1
                          ? "border-b border-[#1d211d]"
                          : ""
                      }
                    `}
                  >
                    {/* ROLE */}
                    <div
                      className="
                        font-mono
                        text-[9px]
                        font-light
                        tracking-[0.035em]
                        text-[#8b9088]
                      "
                    >
                      {row.role}
                    </div>

                    {/* PERMISSIONS */}
                    {row.permissions.map((permission, permissionIndex) => (
                      <div
                        key={`${row.role}-${permissionIndex}`}
                        className="flex justify-center"
                      >
                        <PermissionIcon enabled={permission} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — SECURITY FEATURES */}
          <div className="w-full lg:pl-2 xl:pl-5">
            <div className="flex flex-col gap-1 px-2 py-5">
              {securityFeatures.map((feature) => (
                <article
                  key={feature.number}
                  className="
                    group
                    rounded-[15px]
                    border border-[#242824]
                    bg-[#0d110d]
                    px-5 py-5
                    transition-all duration-300
                    hover:border-[#9BAFBA]
                    hover:bg-[#20221E]
                    sm:px-4
                    sm:py-[16px]
                  "
                >
                  {/* FEATURE CONTENT */}
                  <div className="grid grid-cols-[30px_1fr] gap-3">
                    {/* FEATURE NUMBER */}
                    <span
                      className="
                        pt-[2px]
                        font-mono
                        text-[9px]
                        font-light
                        tracking-[0.06em]
                        text-[#555c54]
                      "
                    >
                      {feature.number}
                    </span>

                    {/* FEATURE TEXT */}
                    <div>
                      <h2
                        className="
                          font-serif
                          text-[18px]
                          leading-[1.05]
                          tracking-[0.007em]
                          text-[#e4e3de]
                        "
                      >
                        {feature.title}
                      </h2>

                      <p
                        className="
                          mt-[9px]
                          max-w-[500px]
                          font-mono
                          text-[8px]
                          font-light
                          leading-[1.69]
                          tracking-[0.026em]
                          text-[#70766f]
                          sm:text-[11px]
                        "
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SecurityandControl;