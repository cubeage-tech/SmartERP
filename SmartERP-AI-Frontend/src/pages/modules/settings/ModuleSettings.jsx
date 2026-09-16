import React, { useState } from "react";

const moduleData = [
  { name: "CRM", enabled: true },
  { name: "Sales", enabled: true },
  { name: "Purchase", enabled: true },
  { name: "Inventory", enabled: true },
  { name: "Manufacturing", enabled: false },
  { name: "Finance & Accounts", enabled: false },
  { name: "HR & Payroll", enabled: false },
  { name: "Projects", enabled: false },
  { name: "Documents", enabled: false },
  { name: "AI Assistant", enabled: false },
];

function Toggle({ enabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      className={`
        relative
        h-[22px]
        w-[44px]
        shrink-0
        rounded-full
        transition-colors
        duration-200
        ${
          enabled
            ? "bg-[#9db58f]"
            : "bg-[#e7e5df]"
        }
      `}
    >
      <span
        className={`
          absolute
          top-[3px]
          h-[16px]
          w-[16px]
          rounded-full
          bg-white
          shadow-[0_1px_3px_rgba(0,0,0,0.12)]
          transition-all
          duration-200
          ${
            enabled
              ? "right-[4px]"
              : "left-[4px]"
          }
        `}
      />
    </button>
  );
}

const ModuleSettings = () => {
  const [modules, setModules] = useState(moduleData);

  const handleToggle = (index) => {
    setModules((current) =>
      current.map((module, i) =>
        i === index
          ? {
              ...module,
              enabled: !module.enabled,
            }
          : module
      )
    );
  };

  return (
    <main>
      <section className="rounded-[18px] border border-[#e4e2dd] bg-white">
        
        {/* Header */}
        <div className="border-b border-[#e4e2dd] px-4 py-4 sm:px-6 sm:py-[16px]">
          <h1 className="font-serif text-[20px]">
            Module Configuration
          </h1>

          <p className="text-[12px] font-sans">
            Enable or disable modules for your organisation.
          </p>
        </div>

        {/* Module List */}
        <div>
          {modules.map((module, index) => (
            <div
              key={module.name}
              className={`
                flex
                min-h-[50px]
                items-center
                justify-between
                gap-6
                px-5
                sm:px-6
                ${
                  index !== modules.length - 1
                    ? "border-b border-[#e4e2dd]"
                    : ""
                }
              `}
            >
              {/* Module Name */}
              <div className="font-mono text-[15px] leading-none tracking-[0.01em] text-[#171815]">
                {module.name}
              </div>

              {/* Toggle */}
              <Toggle
                enabled={module.enabled}
                onClick={() => handleToggle(index)}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ModuleSettings;