import React, { useState } from 'react'

// ─── Icons ─────────────────────────────────────────────────────────────────────

const CheckIcon = ({ filled }) => (
  filled
    ? (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect width="16" height="16" rx="4" fill="#22c55e" />
        <path d="M4 8l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
    : (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect width="16" height="16" rx="4" fill="#f0f0ea" stroke="#d0d0c8" strokeWidth="1" />
        <path d="M4 8l3 3 5-5" stroke="#a0a09a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
)

const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2.5" stroke="#5a5a50" strokeWidth="1.4" />
    <path
      d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06"
      stroke="#5a5a50" strokeWidth="1.4" strokeLinecap="round"
    />
  </svg>
)

const BellIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 3a7 7 0 00-7 7v3.5L3.5 16h17L19 13.5V10a7 7 0 00-7-7z" stroke="#c0c0b8" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M10 19a2 2 0 004 0" stroke="#c0c0b8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// ─── Sample data ───────────────────────────────────────────────────────────────

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'approval',
    read: false,
    icon: 'check-filled',
    title: 'PO requires your approval',
    description: 'PO-2026-0289 from Tata Steel Ltd (₹18,40,000) is awaiting your approval.',
    time: '2 MIN AGO',
  },
  {
    id: 2,
    type: 'alert',
    read: true,
    icon: 'check-outline',
    title: 'Invoice marked as paid',
    description: 'INV-2026-0317 — Bajaj Auto Ltd (₹9,15,000) has been marked as paid.',
    time: '18 MIN AGO',
  },
  {
    id: 3,
    type: 'ai',
    read: true,
    icon: 'ai',
    title: 'AI Insight: Revenue forecast updated',
    description: 'Q3 revenue forecast revised to ₹2.4Cr based on current sales pipeline trends.',
    time: '1 HR AGO',
  },
  {
    id: 4,
    type: 'approval',
    read: true,
    icon: 'check-outline',
    title: 'Leave request approved',
    description: 'Rahul Mehta\'s leave request for Aug 25–27 has been approved.',
    time: '3 HR AGO',
  },
  {
    id: 5,
    type: 'alert',
    read: true,
    icon: 'check-outline',
    title: 'Low stock alert',
    description: 'Item SKU-4421 (Steel Bolts M10) has fallen below the reorder threshold.',
    time: '5 HR AGO',
  },
  {
    id: 6,
    type: 'ai',
    read: true,
    icon: 'ai',
    title: 'AI Insight: Expense anomaly detected',
    description: 'Unusual spike in travel expenses detected for Operations dept — ₹1.2L above average.',
    time: '1 DAY AGO',
  },
]

const TABS = ['ALL', 'UNREAD', 'APPROVAL', 'ALERT', 'AI']

// ─── Notification icon ─────────────────────────────────────────────────────────

const NotifIcon = ({ type, iconType }) => {
  if (iconType === 'check-filled') {
    return (
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0' }}
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path d="M3 8l3.5 3.5L13 4.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )
  }

  if (iconType === 'ai') {
    return (
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: '#ede9fe', border: '1px solid #ddd6fe' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z"
            stroke="#7c3aed" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
    )
  }

  // check-outline (alert / generic)
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}
    >
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <path d="M3 8l3.5 3.5L13 4.5" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

const Navnotification = () => {
  const [activeTab, setActiveTab] = useState('ALL')
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  const unreadCount     = notifications.filter(n => !n.read).length
  const approvalCount   = notifications.filter(n => n.type === 'approval').length
  const alertCount      = notifications.filter(n => n.type === 'alert').length
  const aiCount         = notifications.filter(n => n.type === 'ai').length

  const filtered = notifications.filter(n => {
    if (activeTab === 'ALL')      return true
    if (activeTab === 'UNREAD')   return !n.read
    if (activeTab === 'APPROVAL') return n.type === 'approval'
    if (activeTab === 'ALERT')    return n.type === 'alert'
    if (activeTab === 'AI')       return n.type === 'ai'
    return true
  })

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  const markRead = (id) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const statCards = [
    { label: 'UNREAD',      value: unreadCount },
    { label: 'APPROVALS',   value: approvalCount },
    { label: 'ALERTS',      value: alertCount },
    { label: 'AI INSIGHTS', value: aiCount },
  ]

  return (
    <div
      className="min-h-screen px-8 py-6"
      style={{ backgroundColor: '#f5f5f0' }}
    >
      {/* ── Page header ── */}
      <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: '#9a9a90' }}>
        INBOX
      </p>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" style={{ color: '#1a1a14' }}>
          Notifications
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-200"
            style={{
              backgroundColor: '#f0f0ea',
              color: '#5a5a50',
              border: '1px solid #e2e2da',
            }}
          >
            Mark all read
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-200"
            style={{
              backgroundColor: '#f0f0ea',
              color: '#5a5a50',
              border: '1px solid #e2e2da',
            }}
          >
            <SettingsIcon />
            Settings
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map(card => (
          <div
            key={card.label}
            className="rounded-2xl px-5 py-4"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e8e8e0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <p
              className="text-4xl font-bold mb-1"
              style={{ color: '#1a1a14' }}
            >
              {card.value}
            </p>
            <p className="text-[11px] font-semibold tracking-widest" style={{ color: '#a0a09a' }}>
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-2 mb-4">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors"
            style={
              activeTab === tab
                ? { backgroundColor: '#1a1a14', color: '#ffffff', border: '1px solid #1a1a14' }
                : { backgroundColor: '#f0f0ea', color: '#5a5a50', border: '1px solid #e2e2da' }
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Notification list ── */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-2xl"
            style={{ backgroundColor: '#ffffff', border: '1px solid #e8e8e0' }}
          >
            <BellIcon />
            <p className="mt-3 text-sm font-medium" style={{ color: '#a0a09a' }}>
              No notifications here
            </p>
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className="flex items-start gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-colors"
              style={{
                backgroundColor: notif.read ? '#ffffff' : '#fefef9',
                border: notif.read ? '1px solid #e8e8e0' : '1px solid #d8d8c8',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {/* Icon */}
              <NotifIcon type={notif.type} iconType={notif.icon} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold mb-0.5"
                  style={{ color: notif.read ? '#3a3a30' : '#1a1a14' }}
                >
                  {notif.title}
                </p>
                <p
                  className="text-sm leading-snug"
                  style={{ color: '#7a7a70' }}
                >
                  {notif.description}
                </p>
                <p
                  className="text-[10px] font-semibold tracking-widest mt-1.5"
                  style={{ color: '#b0b0a8' }}
                >
                  {notif.time}
                </p>
              </div>

              {/* Unread dot */}
              {!notif.read && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: '#e05c5c' }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Navnotification
