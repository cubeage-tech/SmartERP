import React, { useState, useEffect } from 'react'
import SalesService from '../../../core/services/modules/sales.service'

const STATUS_STYLE = {
  SENT:           { background: '#e8f0fe', color: '#2563eb' },
  PAID:           { background: '#e6f4ea', color: '#3a7d44' },
  PARTIALLY_PAID: { background: '#fff3e0', color: '#d97706' },
  OVERDUE:        { background: '#fde8e8', color: '#d9534f' },
  CANCELLED:      { background: '#f3f4f6', color: '#91a0a0' },
}

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLE[status] || { background: '#f3f4f6', color: '#6b7280' }
  return (
    <span style={{
      ...s,
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 20,
      fontFamily: 'monospace',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.04em',
    }}>
      {status?.replace('_', ' ')}
    </span>
  )
}

const TH = ({ children, right }) => (
  <th style={{
    padding: '10px 16px',
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: '#91a0a0',
    textAlign: right ? 'right' : 'left',
    borderBottom: '1px solid #f0efeb',
    whiteSpace: 'nowrap',
  }}>
    {children}
  </th>
)

const fmtDate = (d) => {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return d }
}

const fmtAmt = (n) => {
  const v = Number(n) || 0
  return '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const Invoices = ({ refresh }) => {
  const [rows,      setRows]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [hoveredRow,setHovered]   = useState(null)
  const [search,    setSearch]    = useState('')
  const [statusFlt, setStatusFlt] = useState('')

  const load = () => {
    setLoading(true)
    setError(null)
    SalesService.getInvoices()
      .then(r => setRows(r.data ?? []))
      .catch(() => setError('Failed to load invoices'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [refresh]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = rows.filter(inv => {
    const matchSearch = !search ||
      inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFlt || inv.status === statusFlt
    return matchSearch && matchStatus
  })

  /* ── dynamic sub-KPI totals ── */
  const totalInvoiced  = rows.reduce((s, i) => s + Number(i.totalAmount  || 0), 0)
  const totalCollected = rows.reduce((s, i) => s + Number(i.paidAmount   || 0), 0)
  const totalOutstanding = rows.reduce((s, i) => s + Number(i.balanceDue || 0), 0)

  const subCards = [
    { label: 'TOTAL INVOICED', value: loading ? '—' : fmtAmt(totalInvoiced)   },
    { label: 'COLLECTED',      value: loading ? '—' : fmtAmt(totalCollected)  },
    { label: 'OUTSTANDING',    value: loading ? '—' : fmtAmt(totalOutstanding) },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Sub-KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {subCards.map((c) => (
          <div key={c.label} style={{
            background: '#fff',
            border: '1px solid #e3e0d9',
            borderRadius: 20,
            padding: '22px 22px 18px',
          }}>
            <p style={{
              fontFamily: 'var(--serif, Georgia, serif)',
              fontSize: 28,
              fontWeight: 400,
              color: '#9b8050',
              margin: '0 0 8px',
              lineHeight: 1,
            }}>
              {c.value}
            </p>
            <p style={{
              fontFamily: 'monospace',
              fontSize: 9,
              letterSpacing: '0.12em',
              color: '#9ba2a2',
              margin: 0,
            }}>
              {c.label}
            </p>
          </div>
        ))}
      </div>

      {/* Invoice table */}
      <div style={{
        background: '#fff',
        border: '1px solid #e3e0d9',
        borderRadius: 18,
        overflow: 'hidden',
      }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #f0efeb',
        }}>
          <p style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#11130f', margin: 0 }}>
            All Invoices
            <span style={{
              marginLeft: 8,
              background: '#f0efeb',
              color: '#53605e',
              borderRadius: 20,
              padding: '2px 8px',
              fontSize: 10,
            }}>
              {filtered.length}
            </span>
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search invoices..."
              style={{
                padding: '7px 12px',
                borderRadius: 10,
                border: '1px solid #e3e0d9',
                fontFamily: 'monospace',
                fontSize: 11,
                color: '#11130f',
                outline: 'none',
                width: 200,
              }}
            />
            <select
              value={statusFlt}
              onChange={e => setStatusFlt(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: 10,
                border: '1px solid #e3e0d9',
                fontFamily: 'monospace',
                fontSize: 11,
                color: '#11130f',
                outline: 'none',
                background: '#fff',
              }}
            >
              <option value="">All Status</option>
              {Object.keys(STATUS_STYLE).map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <p style={{ padding: '24px 20px', fontFamily: 'monospace', fontSize: 12, color: '#91a0a0', margin: 0 }}>
            Loading invoices…
          </p>
        )}
        {error && (
          <p style={{ padding: '24px 20px', fontFamily: 'monospace', fontSize: 12, color: '#d9534f', margin: 0 }}>
            {error} — <button onClick={load} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontFamily: 'monospace', fontSize: 12 }}>Retry</button>
          </p>
        )}

        {/* Table */}
        {!loading && !error && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <TH>Invoice #</TH>
                  <TH>Customer</TH>
                  <TH>Issue Date</TH>
                  <TH>Due Date</TH>
                  <TH right>Total</TH>
                  <TH right>Paid</TH>
                  <TH right>Balance Due</TH>
                  <TH>Status</TH>
                  <TH></TH>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ padding: '24px 16px', fontFamily: 'monospace', fontSize: 12, color: '#91a0a0', textAlign: 'center' }}>
                      No invoices found
                    </td>
                  </tr>
                )}
                {filtered.map((inv) => (
                  <tr
                    key={inv.id}
                    onMouseEnter={() => setHovered(inv.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      borderBottom: '1px solid #f6f5f1',
                      background: hoveredRow === inv.id ? '#fafaf8' : '#fff',
                      transition: 'background .12s',
                    }}
                  >
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 11, color: '#91a0a0' }}>
                      {inv.invoiceNumber}
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#11130f' }}>
                      {inv.customerName}
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 11, color: '#53605e' }}>
                      {fmtDate(inv.issueDate)}
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 11, color: '#53605e' }}>
                      {fmtDate(inv.dueDate)}
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#11130f', textAlign: 'right' }}>
                      {fmtAmt(inv.totalAmount)}
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 11, color: '#53605e', textAlign: 'right' }}>
                      {fmtAmt(inv.paidAmount)}
                    </td>
                    <td style={{
                      padding: '14px 16px', fontFamily: 'monospace', fontSize: 11, textAlign: 'right', fontWeight: 600,
                      color: Number(inv.balanceDue) === 0 ? '#3a7d44' : '#d9534f',
                    }}>
                      {fmtAmt(inv.balanceDue)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <StatusBadge status={inv.status} />
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button style={{
                        padding: '5px 14px',
                        borderRadius: 8,
                        border: '1px solid #e3e0d9',
                        background: '#fff',
                        fontFamily: 'monospace',
                        fontSize: 10,
                        color: '#53605e',
                        cursor: 'pointer',
                        opacity: hoveredRow === inv.id ? 1 : 0,
                        transition: 'opacity .12s',
                      }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Invoices
