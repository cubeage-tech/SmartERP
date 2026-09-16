import React, { useState } from "react";

const initialIntegrations = [
  {
    id: "tally",
    initials: "TP",
    name: "Tally Prime",
    description: "Two-way sync with Tally ERP for accounting",
    lastSync: "Last sync: 08 Aug 2026 — 11:42 AM",
    connected: true,
  },
  {
    id: "razorpay",
    initials: "R",
    name: "Razorpay",
    description: "Payment collection and reconciliation",
    lastSync: "Last sync: 08 Aug 2026 — 10:15 AM",
    connected: true,
  },
  {
    id: "zoho-sign",
    initials: "ZS",
    name: "Zoho Sign",
    description: "Digital document signing",
    lastSync: "",
    connected: false,
  },
  {
    id: "slack",
    initials: "S",
    name: "Slack",
    description: "Notifications and alerts to Slack channels",
    lastSync: "Last sync: 08 Aug 2026 — 9:00 AM",
    connected: true,
  },
  {
    id: "shiprocket",
    initials: "S",
    name: "Shiprocket",
    description: "Logistics and shipping integration",
    lastSync: "",
    connected: false,
  },
  {
    id: "gst",
    initials: "GP",
    name: "GST Portal",
    description: "Automatic GST filing and reconciliation",
    lastSync: "Last sync: 01 Aug 2026",
    connected: true,
  },
];

function IntegrationCard({ integration, onToggle }) {
  return (
    <article
      className="
        flex
        items-center
        justify-between
        gap-4
        rounded-[20px]
        border
        border-[#e4e2dd]
        bg-white
        px-6
        py-5
        transition-all
        duration-200
        hover:border-[#d8d5ce]
        hover:shadow-[0_3px_12px_rgba(0,0,0,0.025)]
        sm:px-[24px]
      "
    >
      {/* Left side */}
      <div className="flex min-w-0 items-center gap-5">
        {/* Initials */}
        <div
          className="
            flex
            h-[50px]
            w-[50px]
            shrink-0
            items-center
            justify-center
            rounded-[15px]
            border
            border-[#e4e2dd]
            bg-[#f5f4f0]
            font-mono
            text-[11px]
            text-[#92928c]
          "
        >
          {integration.initials}
        </div>

        {/* Information */}
        <div className="min-w-0">
          <h2
            className="
              font-serif
              text-[19px]
              text-[#171815]
              sm:text-[20px]
            "
          >
            {integration.name}
          </h2>

          <p
            className="
              mt-[6px]
              truncate
              font-sans
              text-[10px]
              leading-none
              text-[#92928c]
              sm:text-[11px]
            "
          >
            {integration.description}
          </p>

          {integration.connected && integration.lastSync && (
            <p
              className="
                mt-[7px]
                font-sans
                text-[9px]
                leading-none
                text-[#b4c5a9]
              "
            >
              {integration.lastSync}
            </p>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex shrink-0 items-center gap-4">
        {integration.connected && (
          <div className="hidden items-center gap-[7px] sm:flex">
            <span className="h-[7px] w-[7px] rounded-full bg-[#9db48e]" />

            <span className="font-mono text-[11px] leading-none text-[#53604e]">
              Connected
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => onToggle(integration.id)}
          className={`
            rounded-[13px]
            px-[15px]
            py-[10px]
            font-mono
            text-[10px]
            leading-none
            transition-all
            duration-200
            ${
              integration.connected
                ? `
                  border
                  border-[#e4e2dd]
                  bg-white
                  text-[#999a94]
                  hover:border-[#c9c7c0]
                  hover:bg-[#f7f6f2]
                  hover:text-[#555650]
                `
                : `
                  bg-[#151714]
                  text-white
                  hover:bg-[#292b27]
                  hover:shadow-sm
                `
            }
          `}
        >
          {integration.connected ? "Disconnect" : "Connect →"}
        </button>
      </div>
    </article>
  );
}

const IntegrationSettings = () => {
  const [integrations, setIntegrations] = useState(
    initialIntegrations
  );

  const handleToggle = (id) => {
    setIntegrations((current) =>
      current.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              connected: !integration.connected,
              lastSync: !integration.connected
                ? "Last sync: Just now"
                : "",
            }
          : integration
      )
    );
  };

  return (
    <div className="space-y-4">
      {integrations.map((integration) => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
};

export default IntegrationSettings;