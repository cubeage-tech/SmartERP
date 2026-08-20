import React from "react";

const Productpreview = () => {
  const metrics = [
    ["Revenue", "₹48.6M", "+12.4%"],
    ["Receivables", "₹8.2M", "-4.8%"],
    ["Inventory Value", "₹21.4M", "-2.1%"],
    ["Open Orders", "1,284", "+8.6%"],
  ];

  const modules = [
    "Company Mgmt",
    "CRM",
    "Sales",
    "Purchase",
    "Inventory",
    "Manufacturing",
    "Finance",
    "HR & Payroll",
    "Projects",
    "Documents",
  ];

  return (
    <section
      className="bg-[#0d100d] px-3 py-4 sm:px-6 sm:py-8 md:px-10 lg:px-16"
      style={{
        backgroundImage:
          "radial-gradient(#d7d5cd 0.7px, transparent 0.7px)",
        backgroundSize: "12px 12px",
      }}
    >
      <div className="mx-auto max-w-[1000px] overflow-hidden rounded-[28px] bg-[#f5f4ef] px-5 py-12 sm:px-8 md:px-12 md:py-16 lg:px-14">
        {/* Heading */}
        <div className="mb-8 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-6 bg-[#b9b8ae]" />

              <span className="font-mono text-[8px] tracking-[0.18em] text-[#77776d]">
                06 — PRODUCT PREVIEW
              </span>
            </div>

           <h2 className="font-serif text-4xl leading-[0.92] tracking-[-0.045em] text-[#1d1d1a] sm:text-5xl md:text-[54px]">
              One Dashboard.
              <br />

              <span className="italic text-[#aaa8bd]">
                Every Decision.
              </span>
            </h2>
          </div>

          <p className="max-w-[330px] text-xs leading-5 text-[#77776d] md:mt-12">
            The SmartERP AI dashboard adapts to each user's role,
            surfacing the most important metrics, approvals and AI
            insights for their specific function.
          </p>
        </div>

        {/* Dashboard Browser */}
        <div className="overflow-hidden rounded-[18px] bg-[#151914] shadow-[0_20px_45px_rgba(0,0,0,0.20)]">
          {/* Browser Top Bar */}
          <div className="flex h-9 items-center gap-1.5 px-3">
            <span className="h-2 w-2 rounded-full bg-[#3c423a]" />
            <span className="h-2 w-2 rounded-full bg-[#3c423a]" />
            <span className="h-2 w-2 rounded-full bg-[#3c423a]" />

            <div className="ml-3 flex h-5 w-36 items-center rounded bg-[#0c0e0c] px-2">
              <span className="font-mono text-[5px] text-[#535950]">
                app.smarterp.ai/dashboard
              </span>
            </div>

            <div className="ml-auto rounded-full border border-[#41493c] px-2 py-0.5 font-mono text-[5px] text-[#91a182]">
              ✦ AI
            </div>
          </div>

          {/* Dashboard */}
          <div className="flex min-h-[365px] bg-[#f8f8f5]">
            {/* Sidebar */}
            <aside className="hidden w-[130px] shrink-0 bg-[#151914] p-3 md:block">
              {/* Logo */}
              <div className="mb-7 flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-[#68745d] text-[8px] text-white">
                  ✦
                </div>

                <span className="font-serif text-[8px] text-white">
                  SmartERP AI
                </span>
              </div>

              {/* Main */}
              <p className="mb-2 font-mono text-[5px] uppercase tracking-[0.2em] text-[#667060]">
                Main
              </p>

              <div className="mb-5 rounded-md border border-[#46503f] bg-[#293025] px-2 py-2 font-mono text-[6px] text-[#9aaa8d]">
                Dashboard
              </div>

              {/* Modules */}
              <p className="mb-2 font-mono text-[5px] uppercase tracking-[0.2em] text-[#667060]">
                Modules
              </p>

              <div className="space-y-2.5 font-mono text-[6px] text-[#858d80]">
                {modules.map((module) => (
                  <p key={module}>{module}</p>
                ))}
              </div>

              {/* AI Assistant */}
              <div className="mt-7 rounded border border-[#46503f] px-2 py-2 font-mono text-[6px] text-[#9aaa8d]">
                ✦ AI Assistant
              </div>
            </aside>

            {/* Main Dashboard */}
            <main className="min-w-0 flex-1 p-3 sm:p-4">
              {/* Greeting */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[5px] uppercase tracking-wider text-[#a0a19b]">
                    Good morning
                  </p>

                  <h3 className="font-serif text-sm text-[#242620] sm:text-base">
                    Ananya Sharma
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden rounded-full border border-[#e4e4df] bg-white px-4 py-1.5 font-mono text-[6px] text-[#a0a19b] sm:block">
                    Search anything...
                  </div>

                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#dfe1d9] bg-[#eef0e8] text-[7px] text-[#7d8b73]">
                    ✦
                  </div>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {metrics.map(([label, value, change]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-[#e9e9e4] bg-white px-3 py-3"
                  >
                    <p className="font-mono text-[5px] uppercase tracking-[0.12em] text-[#aaa9a1]">
                      {label}
                    </p>

                    <p className="mt-2 font-serif text-sm text-[#242620] sm:text-base">
                      {value}
                    </p>

                    <p className="mt-1 font-mono text-[5px] text-[#858f7b]">
                      {change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="mt-2 grid gap-2 lg:grid-cols-3">
                {/* Revenue */}
                <div className="rounded-lg border border-[#e9e9e4] bg-white p-3 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[5px] uppercase tracking-[0.12em] text-[#aaa9a1]">
                      Revenue Overview
                    </p>

                    <span className="font-mono text-[5px] text-[#7d8b73]">
                      ↑ 12.4% YoY
                    </span>
                  </div>

                  <div className="mt-3 h-[65px] w-full">
                    <svg
                      viewBox="0 0 500 100"
                      className="h-full w-full"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="revenueFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#819176"
                            stopOpacity="0.18"
                          />
                          <stop
                            offset="100%"
                            stopColor="#819176"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      <path
                        d="M0 72 C45 67 65 72 100 69 S145 74 180 67 S220 69 255 61 S300 64 335 57 S380 60 420 50 S460 52 500 43 L500 100 L0 100 Z"
                        fill="url(#revenueFill)"
                      />

                      <path
                        d="M0 72 C45 67 65 72 100 69 S145 74 180 67 S220 69 255 61 S300 64 335 57 S380 60 420 50 S460 52 500 43"
                        fill="none"
                        stroke="#819176"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                {/* Pipeline */}
                <div className="rounded-lg border border-[#e9e9e4] bg-white p-3">
                  <p className="font-mono text-[5px] uppercase tracking-[0.12em] text-[#aaa9a1]">
                    Pipeline
                  </p>

                  <div className="mt-4 flex h-[60px] items-end justify-around px-2">
                    {[80, 60, 48, 35, 25].map((height, index) => (
                      <div
                        key={index}
                        className="w-2 rounded-t-sm bg-[#9aab8b]"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Cards */}
              <div className="mt-2 grid gap-2 lg:grid-cols-2">
                {/* Pending Approvals */}
                <div className="rounded-lg border border-[#e9e9e4] bg-white p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-[5px] uppercase tracking-[0.12em] text-[#aaa9a1]">
                      Pending Approvals
                    </p>

                    <span className="rounded bg-[#f0eceb] px-1.5 py-0.5 font-mono text-[5px] text-[#a29a98]">
                      3
                    </span>
                  </div>

                  <div className="space-y-2 font-mono text-[5px] text-[#666860]">
                    <div className="flex justify-between border-b border-[#eeeeea] pb-1.5">
                      <span>PO-0481 · Prism Industries</span>
                      <span>₹2.4L</span>
                    </div>

                    <div className="flex justify-between border-b border-[#eeeeea] pb-1.5">
                      <span>Leave · Aditya Kumar · 3 days</span>
                      <span>—</span>
                    </div>

                    <div className="flex justify-between">
                      <span>EXP-0092 · Marketing</span>
                      <span>₹18,400</span>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="rounded-lg bg-[#151914] p-3">
                  <p className="mb-3 font-mono text-[5px] uppercase tracking-[0.12em] text-[#9aaa8d]">
                    ✦ AI Insights
                  </p>

                  <div className="space-y-2 font-mono text-[5px] text-[#8b9385]">
                    <p>Cash position projected +6.4% in 30 days</p>
                    <p>West region sales — 3 accounts at risk</p>
                    <p>7 SKUs approaching reorder this week</p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Productpreview;