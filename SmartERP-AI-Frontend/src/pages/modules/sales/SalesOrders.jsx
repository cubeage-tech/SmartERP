import React, { useEffect, useState } from 'react'
import SalesService from '../../../core/services/modules/sales.service'

const statusStyles = {
  CONFIRMED:    'bg-blue-50 text-blue-600',
  IN_PROGRESS:  'bg-yellow-50 text-yellow-700',
  COMPLETED:    'bg-green-50 text-green-700',
  INVOICED:     'bg-purple-50 text-purple-600',
  CANCELLED:    'bg-red-50 text-red-500',
}

const StatusBadge = ({ status }) => (
  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${statusStyles[status] || 'bg-gray-100 text-gray-500'}`}>
    {status?.replace('_', ' ')}
  </span>
)

const TH = ({ children, right }) => (
  <th className={`py-2 px-4 text-[10px] font-semibold tracking-widest text-gray-400 uppercase ${right ? 'text-right' : 'text-left'}`}>
    {children}
  </th>
)

const SalesOrders = () => {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    SalesService.getOrders()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="py-12 text-center text-sm text-gray-400">Loading…</div>

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <TH>Order #</TH>
            <TH>Customer</TH>
            <TH>Order Date</TH>
            <TH>Delivery Date</TH>
            <TH right>Amount</TH>
            <TH>Status</TH>
          </tr>
        </thead>
        <tbody>
          {data.map((o) => (
            <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4 text-xs text-gray-400 font-mono">{o.orderNumber}</td>
              <td className="py-4 px-4 text-sm font-semibold text-gray-800">{o.customerName}</td>
              <td className="py-4 px-4 text-sm text-gray-500">{o.orderDate}</td>
              <td className="py-4 px-4 text-sm text-gray-500">{o.expectedDeliveryDate ?? '—'}</td>
              <td className="py-4 px-4 text-sm font-semibold text-gray-800 text-right">{o.totalAmount}</td>
              <td className="py-4 px-4"><StatusBadge status={o.status} /></td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="py-10 text-center text-sm text-gray-400">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default SalesOrders
