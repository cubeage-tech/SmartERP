import React, { useState } from "react";

const securitySettings = [
  {
    id: "two-factor",
    title: "Two-Factor Authentication (2FA)",
    description: "Require 2FA for all admin users",
    enabled: true,
  },
  {
    id: "sso",
    title: "SSO via Google Workspace",
    description: "Allow sign-in with company Google accounts",
    enabled: true,
  },
  {
    id: "session-timeout",
    title: "Session timeout (30 min)",
    description: "Auto-logout after inactivity",
    enabled: false,
  },
  {
    id: "ip-allowlist",
    title: "IP Allowlist",
    description: "Restrict access to approved IP ranges",
    enabled: false,
  },
];

const auditLogs = [
  {
    action: "User login",
    user: "arjun@acme.com",
    ip: "103.21.18.42",
    time: "10 Aug, 09:14 AM",
  },
  {
    action: "PO approved",
    user: "rahul@acme.com",
    ip: "103.21.18.43",
    time: "10 Aug, 08:52 AM",
  },
  {
    action: "Invoice created",
    user: "ananya@acme.com",
    ip: "183.90.22.11",
    time: "10 Aug, 08:30 AM",
  },
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
        ${enabled ? "bg-[#9db58f]" : "bg-[#e7e5df]"}
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
          ${enabled ? "right-[4px]" : "left-[4px]"}
        `}
      />
    </button>
  );
}

function SecurityRow({
  setting,
  isLast,
  onToggle,
}) {
  return (
    <div
      className={`
        flex
        items-center
        justify-between
        gap-4
        px-6
        py-[16px]
        ${!isLast ? "border-b border-[#e4e2dd]" : ""}
      `}
    >
      {/* Setting information */}
      <div>
        <div className="font-serif text-[14px]">
          {setting.title}
        </div>

        <div className="mt-[8px] font-sans text-[11px] leading-none text-[#a0a09a]">
          {setting.description}
        </div>
      </div>

      {/* Toggle */}
      <Toggle
        enabled={setting.enabled}
        onClick={onToggle}
      />
    </div>
  );
}

function AuditLogRow({ log, isLast }) {
  return (
    <div
      className={`
        flex
        items-center
        justify-between
        gap-6
        px-6
        py-[14px]
        ${!isLast ? "border-b border-[#e4e2dd]" : ""}
      `}
    >
      {/* Left */}
      <div className="min-w-0">
        <div className="font-serif text-[14px] leading-none text-[#555750]">
          {log.action}
        </div>

        <div className="mt-[8px] font-sans text-[10px] leading-none text-[#aaa9a4]">
          {log.user}
          <span className="mx-[8px]">·</span>
          {log.ip}
        </div>
      </div>

      {/* Time */}
      <div className="shrink-0 font-sans text-[10px] leading-none text-[#aaa9a4]">
        {log.time}
      </div>
    </div>
  );
}

const BackupSecurity = () => {
  const [settings, setSettings] = useState(
    securitySettings
  );

  const toggleSetting = (id) => {
    setSettings((current) =>
      current.map((setting) =>
        setting.id === id
          ? {
              ...setting,
              enabled: !setting.enabled,
            }
          : setting
      )
    );
  };

  return (
    <main>
      {/* Authentication */}
      <section className="overflow-hidden rounded-[18px] border border-[#e4e2dd] bg-white sm:rounded-[20px]">
        {/* Header */}
        <div className="px-6 pb-[18px] pt-[19px]">
          <h1 className="font-serif text-[20px]">
            Authentication
          </h1>
        </div>

        {/* Settings */}
        <div>
          {settings.map((setting, index) => (
            <SecurityRow
              key={setting.id}
              setting={setting}
              isLast={index === settings.length - 1}
              onToggle={() => toggleSetting(setting.id)}
            />
          ))}
        </div>
      </section>

      {/* Audit Log */}
      <section className="mt-5 overflow-hidden rounded-[18px] border border-[#e4e2dd] bg-white sm:rounded-[20px]">
        {/* Header */}
        <div className="px-6 pb-[18px] pt-[19px]">
          <h2 className="font-serif text-[20px]">
            Audit Log
          </h2>
        </div>

        {/* Logs */}
        <div>
          {auditLogs.map((log, index) => (
            <AuditLogRow
              key={`${log.action}-${index}`}
              log={log}
              isLast={index === auditLogs.length - 1}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default BackupSecurity;