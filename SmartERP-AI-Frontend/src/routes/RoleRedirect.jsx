import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/slices/auth.store'
import { ROLE_HOME } from './ProtectedRoute'

/**
 * Used on /login success — sends the user straight to their role dashboard.
 * Also useful as a catch-all for /app so logged-in users don't see a blank page.
 */
const RoleRedirect = () => {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const home = ROLE_HOME[user.role] ?? '/login'
  return <Navigate to={home} replace />
}

export default RoleRedirect
