import React, { useEffect, useState } from 'react'
import SalesService from '../../../core/services/modules/sales.service'
import { formatCurrency } from '../../../core/utils/formatCurrency'

const Analytics = () => {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    SalesService.getAnalytics()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="py-12 text-center text-sm text-gray-400">Loading…</div>
  if (!data)   return <div className="py-12 text-center text-sm text-gray-400">No analytics data</div>

  const monthly      = data.monthlyRevenue  ?? []
  const topCustomers = data.topCustomers    ?? []
  const currency     = data.currency        ?? 'INR'
  const maxVal       = Math.max(...monthly.map((m) => m.revenue ?? 0), 1)

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 px-6 py-6">
        <p className="text-sm font-semibold text-gray-800 mb-6">Monthly Revenue</p>
        <div className="flex items-end gap-3 h-40">
          {monthly.map((m) => {
            const heightPct = (m.revenue / maxVal) * 100
            const label     = new Date(m.month + '-01').toLocaleString('en', { month: 'short' }).toUpperCase()
            return (
              <div key={m.month} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[10px] text-gray-500 font-medium">
                  {formatCurrency(m.revenue, currency)}
                </span>
                <div
                  className="w-full rounded-t-md"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: '#7c9a6e',
                    minHeight: 8,
                  }}
                />
                <span className="text-[10px] text-gray-400 font-medium">{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top customers */}
      <div className="bg-white rounded-2xl border border-gray-100 px-6 py-6">
        <p className="text-sm font-semibold text-gray-800 mb-5">Top Customers</p>
        <div className="space-y-4">
          {topCustomers.map((c, idx) => {
            const maxAmount = topCustomers[0]?.revenue ?? 1
            const pct       = Math.round((c.revenue / maxAmount) * 100)
            return (
              <div key={c.customerId ?? idx} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-4 flex-shrink-0">{c.rank}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700 font-medium">{c.customerName}</span>
                    <span className="text-xs text-gray-500">{formatCurrency(c.revenue, currency)}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: '#7c9a6e' }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
          {topCustomers.length === 0 && (
            <p className="text-sm text-gray-400">No customer data</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytics
