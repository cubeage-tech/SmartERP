import React, { useEffect, useState } from 'react'
import SalesService from '../../../core/services/modules/sales.service'
import { formatCurrency } from '../../../core/utils/formatCurrency'

const statusStyles = {
  SENT:           'bg-blue-50 text-blue-600',
  PAID:           'bg-green-50 text-green-700',
  PARTIALLY_PAID: 'bg-orange-50 text-orange-600',
  OVERDUE:        'bg-red-50 text-red-500',
  CANCELLED:      'bg-gray-100 text-gray-400',
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

const Invoices = () => {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    SalesService.getInvoices()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalInvoiced = data.reduce((s, i) => s + (i.totalAmount ?? 0), 0)
  const totalPaid     = data.reduce((s, i) => s + (i.paidAmount  ?? 0), 0)
  const outstanding   = data.reduce((s, i) => s + (i.balanceDue  ?? 0), 0)

  if (loading) return <div className="py-12 text-center text-sm text-gray-400">Loading…</div>

  return (
    <div className="space-y-4">
      {/* Sub-KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'TOTAL INVOICED', value: formatCurrency(totalInvoiced) },
          { label: 'COLLECTED',      value: formatCurrency(totalPaid)     },
          { label: 'OUTSTANDING',    value: formatCurrency(outstanding)   },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 px-6 py-5">
            <p className="text-3xl font-serif text-gray-900 tracking-tight">{c.value}</p>
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Invoice table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <TH>Invoice #</TH>
              <TH>Customer</TH>
              <TH>Date</TH>
              <TH>Due Date</TH>
              <TH right>Total</TH>
              <TH right>Paid</TH>
              <TH>Status</TH>
            </tr>
          </thead>
          <tbody>
            {data.map((inv) => (
              <tr key={inv.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-xs text-gray-400 font-mono">{inv.invoiceNumber}</td>
                <td className="py-4 px-4 text-sm font-semibold text-gray-800">{inv.customerName}</td>
                <td className="py-4 px-4 text-sm text-gray-500">{inv.issueDate}</td>
                <td className="py-4 px-4 text-sm text-gray-500">{inv.dueDate}</td>
                <td className="py-4 px-4 text-sm font-semibold text-gray-800 text-right">{inv.totalAmount}</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">{inv.paidAmount}</td>
                <td className="py-4 px-4"><StatusBadge status={inv.status} /></td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-gray-400">No invoices found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Invoices
