import React, { useState } from "react";

const notificationData = [
  {
    id: "invoice-overdue",
    title: "Invoice overdue alerts",
    description: "When customer invoices pass due date",
    enabled: true,
  },
  {
    id: "stock-reorder",
    title: "Stock reorder alerts",
    description: "When items fall below minimum level",
    enabled: true,
  },
  {
    id: "approval-requests",
    title: "Approval requests",
    description: "When workflow approvals need your action",
    enabled: true,
  },
  {
    id: "payroll-processing",
    title: "Payroll processing",
    description: "Monthly payroll run notifications",
    enabled: false,
  },
  {
    id: "work-order",
    title: "Work order completion",
    description: "Manufacturing work order status updates",
    enabled: false,
  },
  {
    id: "daily-summary",
    title: "Daily business summary",
    description: "Morning digest of key KPIs",
    enabled: true,
  },
  {
    id: "fraud-compliance",
    title: "Fraud & compliance alerts",
    description: "AI-detected anomalies in finance data",
    enabled: true,
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

function NotificationRow({
  notification,
  onToggle,
  isLast,
}) {
  return (
    <div
      className={`
        flex
        min-h-[8px]
        items-center
        justify-between
        gap-6
        px-6
        py-[15px]
        ${!isLast ? "border-b border-[#e4e2dd]" : ""}
      `}
    >
      {/* Text */}
      <div className="min-w-0">
        <div className="font-sans text-[14px]">
          {notification.title}
        </div>

        <div className="mt-[6px] font-sans text-[11px] leading-none text-[#a0a09a]">
          {notification.description}
        </div>
      </div>

      {/* Toggle */}
      <Toggle
        enabled={notification.enabled}
        onClick={onToggle}
      />
    </div>
  );
}

const NotificationSettings = () => {
  const [notifications, setNotifications] =
    useState(notificationData);

  const toggleNotification = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              enabled: !notification.enabled,
            }
          : notification
      )
    );
  };

  return (
    <main>
      <section className="overflow-hidden rounded-[18px] border border-[#e4e2dd] bg-white sm:rounded-[20px]">
        {/* Header */}
        <div className="border-b border-[#e4e2dd] px-6 py-[19px]">
          <h1 className="font-serif text-[20px]">
            Notification Preferences
          </h1>
        </div>

        {/* Notifications */}
        <div>
          {notifications.map((notification, index) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              isLast={index === notifications.length - 1}
              onToggle={() =>
                toggleNotification(notification.id)
              }
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default NotificationSettings;