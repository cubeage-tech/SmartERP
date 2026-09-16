import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/slices/auth.store'

// Maps each role to its home dashboard path
export const ROLE_HOME = {
  superAdmin:       '/app/super-admin/dashboard',
  tenantAdmin:      '/app/admin/dashboard',
  financeManager:   '/app/finance-manager/dashboard',
  salesManager:     '/app/sales-manager/dashboard',
  hrManager:        '/app/hr-manager/dashboard',
  operationsManager:'/app/operations-manager/dashboard',
  inventoryManager: '/app/inventory-manager/dashboard',
  employee:         '/app/employee/dashboard',
}

/**
 * Wraps a section of routes that require authentication.
 * allowedRoles — if provided, only those roles can access; others are
 * redirected to their own dashboard instead of a generic fallback.
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user } = useAuthStore()

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Role not allowed → redirect to the user's own home dashboard
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    const home = ROLE_HOME[user.role] ?? '/login'
    return <Navigate to={home} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
