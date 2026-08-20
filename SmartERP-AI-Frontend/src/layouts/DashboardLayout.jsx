import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
import Breadcrumbs from '../components/layout/Breadcrumbs'

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header />
        {/* <Breadcrumbs /> */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
