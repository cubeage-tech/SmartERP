import React, { useState, useEffect } from 'react'
import SalesService from '../../../core/services/modules/sales.service'

const STATUS_STYLE = {
  CONFIRMED:    { background: '#e8f0fe', color: '#2563eb' },
  IN_PROGRESS:  { background: '#fef9e6', color: '#b45309' },
  COMPLETED:    { background: '#e6f4ea', color: '#3a7d44' },
  INVOICED:     { background: '#f3e8ff', color: '#7c3aed' },
  CANCELLED:    { background: '#fde8e8', color: '#d9534f' },
}

/* Allowed next statuses per current status */
const NEXT_STATUS = {
  CONFIRMED:   ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
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

const SalesOrders = ({ refresh }) => {
  const [rows,      setRows]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [hoveredRow,setHovered]   = useState(null)
  const [search,    setSearch]    = useState('')
  const [statusFlt, setStatusFlt] = useState('')
  const [busy,      setBusy]      = useState({})

  const load = () => {
    setLoading(true)
    setError(null)
    SalesService.getOrders()
      .then(r => setRows(r.data ?? []))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [refresh]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = rows.filter(o => {
    const matchSearch = !search ||
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFlt || o.status === statusFlt
    return matchSearch && matchStatus
  })

  const doStatusChange = (o, newStatus) => {
    setBusy(b => ({ ...b, [o.id]: true }))
    SalesService.updateOrderStatus(o.id, { status: newStatus })
      .then(() => load())
      .catch(err => alert(err?.response?.data?.message || `Could not change status to ${newStatus}`))
      .finally(() => setBusy(b => ({ ...b, [o.id]: false })))
  }

  return (
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
          All Orders
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
            placeholder="Search orders..."
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
          Loading orders…
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
                <TH>Order #</TH>
                <TH>Customer</TH>
                <TH>Order Date</TH>
                <TH>Delivery Date</TH>
                <TH right>Amount</TH>
                <TH>Status</TH>
                <TH></TH>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '24px 16px', fontFamily: 'monospace', fontSize: 12, color: '#91a0a0', textAlign: 'center' }}>
                    No orders found
                  </td>
                </tr>
              )}
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onMouseEnter={() => setHovered(o.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    borderBottom: '1px solid #f6f5f1',
                    background: hoveredRow === o.id ? '#fafaf8' : '#fff',
                    transition: 'background .12s',
                    opacity: busy[o.id] ? 0.6 : 1,
                  }}
                >
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 11, color: '#91a0a0' }}>
                    {o.orderNumber}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#11130f' }}>
                    {o.customerName}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 11, color: '#53605e' }}>
                    {fmtDate(o.orderDate)}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 11, color: '#53605e' }}>
                    {fmtDate(o.expectedDeliveryDate)}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#11130f', textAlign: 'right' }}>
                    {fmtAmt(o.totalAmount)}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <StatusBadge status={o.status} />
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{
                      display: 'flex', gap: 6, justifyContent: 'flex-end',
                      opacity: hoveredRow === o.id ? 1 : 0,
                      transition: 'opacity .12s',
                    }}>
                      {(NEXT_STATUS[o.status] || []).map(ns => (
                        <button
                          key={ns}
                          disabled={busy[o.id]}
                          onClick={() => doStatusChange(o, ns)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 7,
                            border: '1px solid #e3e0d9',
                            background: '#fff',
                            fontFamily: 'monospace',
                            fontSize: 9,
                            color: '#53605e',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          → {ns.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SalesOrders
