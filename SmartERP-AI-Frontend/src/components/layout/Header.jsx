import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/slices/auth.store'
import { formatRole } from '../../utils/formatRole'
import { ROUTES } from '../../core/constants/routes.constant'

// ─── Icons ────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="6.5" r="5" stroke="#a0a0a0" strokeWidth="1.5"/>
    <path d="M10.5 10.5L14 14" stroke="#a0a0a0" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
    <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" stroke="#6b7280" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8.5 17a1.5 1.5 0 003 0" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z"
      stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
)

// ─── Header ───────────────────────────────────────────────────────────────────

const Header = () => {
  const { user, logout } = useAuthStore()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  // Map each role to its notifications route
  const NOTIFICATION_ROUTES = {
    superAdmin:         ROUTES.SUPER_ADMIN_NOTIFICATIONS,
    admin:              ROUTES.ADMIN_NOTIFICATIONS,
    financeManager:     ROUTES.FINANCE_MANAGER_NOTIFICATIONS,
    salesManager:       ROUTES.SALES_MANAGER_NOTIFICATIONS,
    hrManager:          ROUTES.HR_MANAGER_NOTIFICATIONS,
    operationsManager:  ROUTES.OPERATIONS_MANAGER_NOTIFICATIONS,
    employee:           ROUTES.EMPLOYEE_NOTIFICATIONS,
  }

  const handleBellClick = () => {
    const path = NOTIFICATION_ROUTES[user?.role]
    if (path) navigate(path)
  }

  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const firstName = (user?.name || '').split(' ')[0] || user?.email || ''

  return (
    <header
      className="flex items-center justify-between px-5 py-2.5 border-b"
      style={{ backgroundColor: '#fafaf8', borderColor: '#e8e8e0' }}
    >
      {/* ── Search ── */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg w-72"
        style={{ backgroundColor: '#f0f0ea', border: '1px solid #e2e2da' }}
      >
        <SearchIcon />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search anything..."
          className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
          style={{ color: '#3a3a30' }}
        />
        {/* Keyboard shortcut badge */}
        <div
          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium"
          style={{ backgroundColor: '#e2e2da', color: '#a0a09a' }}
        >
          <span>⌘</span><span>K</span>
        </div>
      </div>

      {/* ── Right side ── */}
      <div className="flex items-center gap-2">

        {/* Ask AI button */}
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: '#f0f0ea', color: '#5a5a50', border: '1px solid #e2e2da' }}
        >
          <SparkleIcon />
          Ask AI
        </button>

        {/* Notification bell */}
        <button
          onClick={handleBellClick}
          className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
          style={{ border: '1px solid #e2e2da', backgroundColor: '#f0f0ea' }}
        >
          <BellIcon />
          {/* Red dot indicator */}
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#e05c5c' }}
          />
        </button>

        {/* User pill */}
        {user ? (
          <button
            onClick={typeof logout === 'function' ? logout : undefined}
            className="flex items-center gap-2 px-2 py-1 rounded-lg transition-colors hover:bg-gray-100"
            style={{ border: '1px solid #e2e2da', backgroundColor: '#f0f0ea' }}
            title="Logout"
          >
            {/* Avatar */}
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
              style={{ backgroundColor: '#3a4535', color: '#a3b899' }}
            >
              {initials}
            </div>
            {/* Name + role */}
            <div className="text-left">
              <p className="text-xs font-medium leading-tight" style={{ color: '#2a2a20' }}>
                {firstName}
              </p>
              <p className="text-[10px] leading-tight" style={{ color: '#9a9a90' }}>
                {formatRole(user.role)}
              </p>
            </div>
          </button>
        ) : (
          <Link
            to="/login"
            className="text-sm font-medium px-3 py-1.5 rounded-lg"
            style={{ color: '#3a4535', backgroundColor: '#f0f0ea', border: '1px solid #e2e2da' }}
          >
            Login
          </Link>
        )}

      </div>

    </header>
  )
}

export default Header