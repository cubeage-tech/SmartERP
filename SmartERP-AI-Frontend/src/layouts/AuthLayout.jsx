import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex" style={{ background: '#1a1a1a' }}>
      <Outlet />
    </div>
  )
}

export default AuthLayout
