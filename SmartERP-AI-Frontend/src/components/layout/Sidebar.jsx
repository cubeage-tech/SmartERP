import React from 'react'
import { NavLink } from 'react-router-dom'
import useAuthStore from '../../store/slices/auth.store'
import { formatRole } from '../../utils/formatRole'

// ─── Nav config (unchanged) ───────────────────────────────────────────────────

const NAV = {
  superAdmin: [
    { label: 'Dashboard',          to: '/app/super-admin/dashboard' },
    { label: 'Tenants',            to: '/app/super-admin/tenants' },
    { label: 'Subscriptions',      to: '/app/super-admin/subscriptions' },
    { label: 'Platform Users',     to: '/app/super-admin/platform-users' },
    { label: 'Company Management', to: '/app/super-admin/company' },
    { label: 'CRM',                to: '/app/super-admin/crm' },
    { label: 'Sales',              to: '/app/super-admin/sales' },
    { label: 'Purchase',           to: '/app/super-admin/purchase' },
    { label: 'Inventory',          to: '/app/super-admin/inventory' },
    { label: 'Manufacturing',      to: '/app/super-admin/manufacturing' },
    { label: 'Finance & Accounts', to: '/app/super-admin/finance' },
    { label: 'HR & Payroll',       to: '/app/super-admin/hr' },
    { label: 'Projects',           to: '/app/super-admin/projects' },
    { label: 'Documents',          to: '/app/super-admin/documents' },
    { label: 'Reports',            to: '/app/super-admin/reports' },
    { label: 'AI Assistant',       to: '/app/super-admin/ai' },
    { label: 'Settings',           to: '/app/super-admin/settings' },
  ],
  admin: [
    { label: 'Dashboard',          to: '/app/admin/dashboard' },
    { label: 'Company Management', to: '/app/admin/company' },
    { label: 'CRM',                to: '/app/admin/crm' },
    { label: 'Sales',              to: '/app/admin/sales' },
    { label: 'Purchase',           to: '/app/admin/purchase' },
    { label: 'Inventory',          to: '/app/admin/inventory' },
    { label: 'Manufacturing',      to: '/app/admin/manufacturing' },
    { label: 'Finance & Accounts', to: '/app/admin/finance' },
    { label: 'HR & Payroll',       to: '/app/admin/hr' },
    { label: 'Projects',           to: '/app/admin/projects' },
    { label: 'Documents',          to: '/app/admin/documents' },
    { label: 'Reports',            to: '/app/admin/reports' },
    { label: 'AI Assistant',       to: '/app/admin/ai' },
    { label: 'Settings',           to: '/app/admin/settings' },
  ],
  financeManager: [
    { label: 'Dashboard',           to: '/app/finance-manager/dashboard' },
    { label: 'Sales',               to: '/app/finance-manager/sales' },
    { label: 'Purchase',            to: '/app/finance-manager/purchase' },
    { label: 'Finance & Accounts',  to: '/app/finance-manager/finance' },
    { label: 'Projects',            to: '/app/finance-manager/projects' },
    { label: 'Documents',           to: '/app/finance-manager/documents' },
    { label: 'AI Assistant',        to: '/app/finance-manager/ai' },
    { label: 'Reports & Analytics', to: '/app/finance-manager/reports' },
  ],
  salesManager: [
    { label: 'Dashboard',           to: '/app/sales-manager/dashboard' },
    { label: 'CRM',                 to: '/app/sales-manager/crm' },
    { label: 'Sales',               to: '/app/sales-manager/sales' },
    { label: 'Inventory',           to: '/app/sales-manager/inventory' },
    { label: 'Projects',            to: '/app/sales-manager/projects' },
    { label: 'Documents',           to: '/app/sales-manager/documents' },
    { label: 'AI Assistant',        to: '/app/sales-manager/ai' },
    { label: 'Reports & Analytics', to: '/app/sales-manager/reports' },
  ],
  hrManager: [
    { label: 'Dashboard',           to: '/app/hr-manager/dashboard' },
    { label: 'HR & Payroll',        to: '/app/hr-manager/hr' },
    { label: 'Projects',            to: '/app/hr-manager/projects' },
    { label: 'Documents',           to: '/app/hr-manager/documents' },
    { label: 'AI Assistant',        to: '/app/hr-manager/ai' },
    { label: 'Reports & Analytics', to: '/app/hr-manager/reports' },
  ],
  operationsManager: [
    { label: 'Dashboard',           to: '/app/operations-manager/dashboard' },
    { label: 'Purchase',            to: '/app/operations-manager/purchase' },
    { label: 'Inventory',           to: '/app/operations-manager/inventory' },
    { label: 'Manufacturing',       to: '/app/operations-manager/manufacturing' },
    { label: 'Projects',            to: '/app/operations-manager/projects' },
    { label: 'Documents',           to: '/app/operations-manager/documents' },
    { label: 'AI Assistant',        to: '/app/operations-manager/ai' },
    { label: 'Reports & Analytics', to: '/app/operations-manager/reports' },
  ],
  employee: [
    { label: 'Dashboard',  to: '/app/employee/dashboard' },
    { label: 'Projects',   to: '/app/employee/projects' },
    { label: 'Documents',  to: '/app/employee/documents' },
    { label: 'AI Assistant', to: '/app/employee/ai' },
  ],
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICONS = {
  'Dashboard':          <GridIcon />,
  'Tenants':            <BuildingIcon />,
  'Subscriptions':      <CreditCardIcon />,
  'Platform Users':     <UsersIcon />,
  'Company Management': <BuildingIcon />,
  'CRM':                <CircleIcon />,
  'Sales':              <TagIcon />,
  'Purchase':           <CartIcon />,
  'Inventory':          <BoxIcon />,
  'Manufacturing':      <CogIcon />,
  'Finance & Accounts': <RupeeIcon />,
  'HR & Payroll':       <CircleOutlineIcon />,
  'Projects':           <FolderIcon />,
  'Documents':          <DocIcon />,
  'Reports':            <ChartIcon />,
  'Reports & Analytics':<ChartIcon />,
  'AI Assistant':       <SparkleIcon />,
  'Settings':           <CogIcon />,
}

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="1" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="1" y="9" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="9" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  )
}
function BuildingIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="4" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5 14V10h6v4" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M1 14h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M6 2h4v2H6z" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  )
}
function CreditCardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M1 7h14" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="3" y="10" width="4" height="1.5" rx="0.75" fill="currentColor"/>
    </svg>
  )
}
function UsersIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M1 13c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M11 7c1.5 0 3 .8 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="11.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  )
}
function CircleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.3" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  )
}
function TagIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M1.5 8.5L7.5 2.5H13.5V8.5L7.5 14.5L1.5 8.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="11" cy="5" r="1.2" fill="currentColor"/>
    </svg>
  )
}
function CartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M1 1h2l2 8h7l2-5H4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6" cy="13" r="1.2" fill="currentColor"/>
      <circle cx="11" cy="13" r="1.2" fill="currentColor"/>
    </svg>
  )
}
function BoxIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M8 1L8 15M2 4.5L14 4.5" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  )
}
function CogIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}
function RupeeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M4 3h8M4 7h8M8 7l-4 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M4 5c0 0 1-2 4-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}
function CircleOutlineIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.3" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  )
}
function FolderIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M1 4a1 1 0 011-1h4l2 2h6a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  )
}
function DocIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="1" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M6 5h4M6 8h4M6 11h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}
function ChartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M1 14h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <rect x="2" y="9" width="3" height="5" rx="0.5" fill="currentColor" opacity="0.7"/>
      <rect x="6.5" y="5" width="3" height="9" rx="0.5" fill="currentColor" opacity="0.7"/>
      <rect x="11" y="2" width="3" height="12" rx="0.5" fill="currentColor" opacity="0.7"/>
    </svg>
  )
}
function SparkleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  )
}
function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M11 11l3-3-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

// Separate the "Dashboard" link from the modules list
const DASHBOARD_LABELS = ['Dashboard']
const MODULE_SECTION_LABEL = 'MODULES'

const Sidebar = () => {
  const { user, logout } = useAuthStore()
  const links = (user?.role && NAV[user.role]) || []

  const dashboardLinks = links.filter(l => DASHBOARD_LABELS.includes(l.label))
  const moduleLinks    = links.filter(l => !DASHBOARD_LABELS.includes(l.label))

  // Avatar initials
  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside
      className="w-64 min-h-screen flex flex-col"
      style={{ backgroundColor: '#1c1f1a', color: '#d4d4c8' }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: '#2e3329', color: '#a3b899' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.2" fill="#a3b899"/>
              <rect x="9" y="1" width="6" height="6" rx="1.2" fill="#a3b899" opacity="0.6"/>
              <rect x="1" y="9" width="6" height="6" rx="1.2" fill="#a3b899" opacity="0.6"/>
              <rect x="9" y="9" width="6" height="6" rx="1.2" fill="#a3b899" opacity="0.3"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight" style={{ color: '#e8e8e0' }}>SmartERP</p>
            <p className="text-[10px] leading-tight" style={{ color: '#5a5f52' }}>AI</p>
          </div>
        </div>
        {/* Hamburger placeholder */}
        <button className="opacity-40 hover:opacity-70 transition-opacity">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 8h12M2 12h12" stroke="#d4d4c8" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── Company card ── */}
      <div className="mx-3 mb-3 rounded-xl px-3 py-3" style={{ backgroundColor: '#252820' }}>
        <p className="text-[9px] font-semibold tracking-widest uppercase mb-1" style={{ color: '#5a5f52' }}>
          Company
        </p>
        <p className="text-sm font-semibold leading-tight" style={{ color: '#e8e8e0' }}>
          {user?.companyName || 'Acme Manufacturing Ltd'}
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: '#7c9a6e' }}>
          HQ &mdash; {user?.branch || 'Mumbai'}
        </p>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">

        {/* Dashboard links */}
        {dashboardLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'text-white'
                  : 'hover:text-white'
              }`
            }
            style={({ isActive }) => isActive
              ? { backgroundColor: '#2e3329', color: '#e8e8e0' }
              : { color: '#8a8f80' }
            }
          >
            <span style={{ color: 'inherit' }}>{ICONS[link.label] || <CircleIcon />}</span>
            {link.label}
          </NavLink>
        ))}

        {/* Modules section */}
        {moduleLinks.length > 0 && (
          <>
            <p
              className="text-[9px] font-semibold tracking-widest uppercase px-3 pt-4 pb-1"
              style={{ color: '#4a4f42' }}
            >
              {MODULE_SECTION_LABEL}
            </p>
            {moduleLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={false}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors`
                }
                style={({ isActive }) => isActive
                  ? { backgroundColor: '#2e3329', color: '#e8e8e0' }
                  : { color: '#8a8f80' }
                }
              >
                {({ isActive }) => (
                  <>
                    <span style={{ color: isActive ? '#a3b899' : '#5a5f52' }}>
                      {ICONS[link.label] || <CircleIcon />}
                    </span>
                    <span className={isActive ? 'font-medium' : ''}>{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* ── User footer ── */}
      {user && (
        <div
          className="mx-3 mb-3 mt-2 rounded-xl px-3 py-3 flex items-center gap-2.5"
          style={{ backgroundColor: '#252820' }}
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={{ backgroundColor: '#3a4535', color: '#a3b899' }}
          >
            {initials}
          </div>

          {/* Name + role */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate leading-tight" style={{ color: '#e8e8e0' }}>
              {user.name || user.email}
            </p>
            <p className="text-[10px] truncate leading-tight" style={{ color: '#5a5f52' }}>
              {formatRole(user.role)}
            </p>
          </div>

          {/* Logout */}
          {typeof logout === 'function' && (
            <button
              onClick={logout}
              className="flex-shrink-0 opacity-40 hover:opacity-80 transition-opacity"
              title="Logout"
              style={{ color: '#d4d4c8' }}
            >
              <LogoutIcon />
            </button>
          )}
        </div>
      )}
    </aside>
  )
}

export default Sidebar
