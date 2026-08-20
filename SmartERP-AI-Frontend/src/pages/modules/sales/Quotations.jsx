import React, { useEffect, useState } from 'react'
import SalesService from '../../../core/services/modules/sales.service'

const statusStyles = {
  SENT:      'bg-blue-50 text-blue-600',
  ACCEPTED:  'bg-green-50 text-green-700',
  DRAFT:     'bg-gray-100 text-gray-500',
  CANCELLED: 'bg-red-50 text-red-500',
  REJECTED:  'bg-red-50 text-red-500',
  EXPIRED:   'bg-orange-50 text-orange-600',
  CONVERTED: 'bg-purple-50 text-purple-600',
}

const StatusBadge = ({ status }) => (
  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${statusStyles[status] || 'bg-gray-100 text-gray-500'}`}>
    {status}
  </span>
)

const TH = ({ children, right }) => (
  <th className={`py-2 px-4 text-[10px] font-semibold tracking-widest text-gray-400 uppercase ${right ? 'text-right' : 'text-left'}`}>
    {children}
  </th>
)

const Quotations = () => {
  const [data, setData]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [hoveredRow, setHovered] = useState(null)

  useEffect(() => {
    SalesService.getQuotations()
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
            <TH>Quote #</TH>
            <TH>Customer</TH>
            <TH>Date</TH>
            <TH>Valid Until</TH>
            <TH right>Items</TH>
            <TH right>Amount</TH>
            <TH>Status</TH>
            <TH></TH>
          </tr>
        </thead>
        <tbody>
          {data.map((q) => (
            <tr
              key={q.id}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
              onMouseEnter={() => setHovered(q.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <td className="py-4 px-4 text-xs text-gray-400 font-mono">{q.quotationNumber}</td>
              <td className="py-4 px-4 text-sm font-semibold text-gray-800">{q.customerName}</td>
              <td className="py-4 px-4 text-sm text-gray-500">{q.quotationDate}</td>
              <td className="py-4 px-4 text-sm text-gray-500">{q.validUntil}</td>
              <td className="py-4 px-4 text-sm text-gray-500 text-right">{q.items?.length ?? 0}</td>
              <td className="py-4 px-4 text-sm font-semibold text-gray-800 text-right">{q.totalAmount}</td>
              <td className="py-4 px-4"><StatusBadge status={q.status} /></td>
              <td className="py-4 px-4 text-right">
                <button
                  className={`text-xs text-gray-400 border border-gray-200 rounded px-3 py-1 hover:bg-gray-50 transition-opacity ${hoveredRow === q.id ? 'opacity-100' : 'opacity-0'}`}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={8} className="py-10 text-center text-sm text-gray-400">No quotations found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Quotations
