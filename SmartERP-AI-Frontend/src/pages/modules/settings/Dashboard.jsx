import React, { useState } from "react";

import GeneralSettings from "./GeneralSettings";
import ModuleSettings from "./ModuleSettings";
import IntegrationSettings from "./IntegrationSettings";
import NotificationSettings from "./NotificationSettings";
import BackupSecurity from "./BackupSecurity";
import BillingSettings from "./BillingSettings";

const settingsMenu = [
  {
    id: "general",
    label: "General",
  },
  {
    id: "modules",
    label: "Modules",
  },
  {
    id: "integrations",
    label: "Integrations",
  },
  {
    id: "notifications",
    label: "Notifications",
  },
  {
    id: "security",
    label: "Security",
  },
  {
    id: "billing",
    label: "Billing",
  },
];

function PageContent({ activeTab }) {
  switch (activeTab) {
    case "general":
      return <GeneralSettings />;
    
    case "modules":
      return <ModuleSettings />;

    case "integrations":
      return <IntegrationSettings />;

    case "notifications":
      return <NotificationSettings />;

    case "security":
      return <BackupSecurity />;

    case "billing":
      return <BillingSettings />;

    default:
      return <GeneralSettings />;
  }
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <main className="min-h-screen bg-[#f7f6f2] px-4 py-5 text-[#171815] sm:px-6 sm:py-6 lg:px-[27px] lg:py-[30px]">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          {/* Administration */}
          <div className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">
            Administration
          </div>

          {/* Settings */}
          <h1 className="text-2xl font-bold text-gray-900">
            Settings
          </h1>
        </div>

        {/* Save Changes */}
        <button
          type="button"
          className="
            rounded-[15px]
            bg-[#151714]
            px-[20px]
            py-[13px]
            text-[10px]
            font-medium
            leading-none
            tracking-[0.02em]
            text-white
            transition-all
            duration-200
            hover:bg-[#292b27]
            hover:shadow-sm
          "
        >
          Save Changes
        </button>
      </header>

      {/* Settings Layout */}
      <div className="mt-[8px] grid grid-cols-1 gap-8 lg:grid-cols-[160px_1fr] lg:gap-[30px]">
        {/* Left Navigation */}
        <aside>
          <nav className="space-y-[5px]">
            {settingsMenu.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    flex
                    w-full
                    items-center
                    rounded-[14px]
                    font-semibold
                    px-[15px]
                    py-[14px]
                    text-left
                    text-[12px]
                    leading-none
                    tracking-[0.01em]
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "bg-[#151714] text-white"
                        : "text-[#777871] hover:bg-[#eeece7] hover:text-[#4f504b]"
                    }
                  `}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Page Content */}
        <section className="min-w-0">
          <PageContent activeTab={activeTab} />
        </section>
      </div>
    </main>
  );
};

export default Dashboard;