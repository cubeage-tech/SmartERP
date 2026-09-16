import React from "react";

const billingHistory = [
  {
    plan: "Business Plan — Monthly",
    date: "01 Aug 2026",
    amount: "₹29,999",
  },
  {
    plan: "Business Plan — Monthly",
    date: "01 Jul 2026",
    amount: "₹29,999",
  },
  {
    plan: "Business Plan — Monthly",
    date: "01 Jun 2026",
    amount: "₹29,999",
  },
];

function BillingHistoryRow({ item }) {
  return (
    <div className="flex min-h-[72px] items-center justify-between gap-6 border-b border-[#e4e2dd] last:border-b-0">
      {/* Plan */}
      <div>
        <div className="font-sans text-[14px] leading-none text-[#171815]">
          {item.plan}
        </div>

        <div className="mt-[8px] font-sans text-[11px] leading-none text-[#aaa9a4]">
          {item.date}
        </div>
      </div>

      {/* Amount + Actions */}
      <div className="flex shrink-0 items-center gap-4">
        <span className="font-sans text-[13px] leading-none text-[#171815]">
          {item.amount}
        </span>

        <span className="rounded-[9px] border border-[#d6dfd1] bg-[#edf1ea] px-[11px] py-[6px] font-sans text-[10px] leading-none text-[#60705a]">
          Paid
        </span>

        <button
          type="button"
          className="rounded-[9px] border border-[#e1dfda] bg-white px-[12px] py-[7px] font-sans text-[10px] leading-none text-[#999893] transition-colors duration-200 hover:border-[#d1cec7] hover:bg-[#f7f6f2] hover:text-[#555650]"
        >
          Invoice
        </button>
      </div>
    </div>
  );
}

const BillingSettings = () => {
  return (
    <main>
      
      {/* Current Plan */}
      <section className="rounded-[18px] bg-[#151714] px-5 py-6 text-white sm:rounded-[20px] sm:px-6 sm:py-[25px]">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          
          {/* Plan Information */}
          <div>
            <div className="font-sans text-[9px] font-medium uppercase tracking-[0.16em] text-[#a5b99b]">
              Current Plan
            </div>

            <h1 className="mt-[8px] font-serif text-[34px] leading-none tracking-[-0.025em] text-[#f4f3ed]">
              Business
            </h1>

            <p className="mt-[14px] font-sans text-[11px] leading-none text-[#8f918c]">
              50 users&nbsp; · &nbsp;All 10 modules&nbsp; · &nbsp;Priority support
            </p>
          </div>

          {/* Upgrade */}
          <button
            type="button"
            className="shrink-0 rounded-[15px] bg-[#9db58f] px-5 py-[13px] font-sans text-[11px] leading-none text-[#171815] transition-all duration-200 hover:bg-[#a9bf9b] hover:shadow-[0_3px_10px_rgba(0,0,0,0.15)]"
          >
            Upgrade to Enterprise
          </button>
        </div>

        {/* Usage */}
        <div className="mt-[24px] rounded-[15px] bg-[#20231f] px-5 py-[20px]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] leading-none text-[#a1a29c]">
              Users: 38 / 50
            </span>

            <span className="font-sans text-[11px] leading-none text-[#a5b99b]">
              76% used
            </span>
          </div>

          <div className="mt-[12px] h-[10px] overflow-hidden rounded-full bg-[#30332f]">
            <div
              className="h-full rounded-full bg-[#9db58f]"
              style={{ width: "76%" }}
            />
          </div>
        </div>
      </section>

      {/* Billing History */}
      <section className="mt-5 rounded-[18px] border border-[#e4e2dd] bg-white px-5 sm:rounded-[20px] sm:px-6">
        
        {/* Heading */}
        <div className="py-[28px]">
          <h2 className="font-serif text-[22px] leading-none tracking-[-0.02em] text-[#171815]">
            Billing History
          </h2>
        </div>

        {/* Rows */}
        <div>
          {billingHistory.map((item, index) => (
            <BillingHistoryRow
              key={`${item.date}-${index}`}
              item={item}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default BillingSettings;