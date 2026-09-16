import React, { useState, useEffect } from 'react'
import SalesService from '../../../core/services/modules/sales.service'

const STATUS_STYLE = {
  SENT:      { background: '#e8f0fe', color: '#2563eb' },
  ACCEPTED:  { background: '#e6f4ea', color: '#3a7d44' },
  DRAFT:     { background: '#f3f4f6', color: '#6b7280' },
  CANCELLED: { background: '#fde8e8', color: '#d9534f' },
  REJECTED:  { background: '#fde8e8', color: '#d9534f' },
  EXPIRED:   { background: '#fff3e0', color: '#d97706' },
  CONVERTED: { background: '#f3e8ff', color: '#7c3aed' },
}

/* Allowed next statuses per current status */
const NEXT_STATUS = {
  DRAFT:    ['SENT'],
  SENT:     ['ACCEPTED', 'REJECTED', 'EXPIRED'],
  ACCEPTED: ['REJECTED'],
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
      {status}
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

const Quotations = ({ onView, refresh }) => {
  const [rows,       setRows]       = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [hoveredRow, setHovered]    = useState(null)
  const [search,     setSearch]     = useState('')
  const [statusFlt,  setStatusFlt]  = useState('')
  const [busy,       setBusy]       = useState({})  // {id: true} while action pending

  const load = () => {
    setLoading(true)
    setError(null)
    SalesService.getQuotations()
      .then(r => setRows(r.data ?? []))
      .catch(() => setError('Failed to load quotations'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [refresh]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = rows.filter(q => {
    const matchSearch = !search ||
      q.quotationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      q.customerName?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFlt || q.status === statusFlt
    return matchSearch && matchStatus
  })

  const doStatusChange = (q, newStatus) => {
    setBusy(b => ({ ...b, [q.id]: true }))
    SalesService.updateQuotation(q.id, { status: newStatus })
      .then(() => load())
      .catch(() => alert(`Could not change status to ${newStatus}`))
      .finally(() => setBusy(b => ({ ...b, [q.id]: false })))
  }

  const doConvert = (q) => {
    if (!window.confirm(`Convert ${q.quotationNumber} to a Sales Order?`)) return
    setBusy(b => ({ ...b, [q.id]: true }))
    SalesService.convertQuotation(q.id)
      .then(() => { load(); alert('Quotation converted to Sales Order!') })
      .catch(err => {
        const msg = err?.response?.data?.message || 'Conversion failed'
        alert(msg)
      })
      .finally(() => setBusy(b => ({ ...b, [q.id]: false })))
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
          All Quotations
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
            placeholder="Search quotations..."
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
          Loading quotations…
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '24px 16px', fontFamily: 'monospace', fontSize: 12, color: '#91a0a0', textAlign: 'center' }}>
                    No quotations found
                  </td>
                </tr>
              )}
              {filtered.map((q) => (
                <tr
                  key={q.id}
                  onMouseEnter={() => setHovered(q.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    borderBottom: '1px solid #f6f5f1',
                    background: hoveredRow === q.id ? '#fafaf8' : '#fff',
                    transition: 'background .12s',
                    opacity: busy[q.id] ? 0.6 : 1,
                  }}
                >
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 11, color: '#91a0a0' }}>
                    {q.quotationNumber}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#11130f' }}>
                    {q.customerName}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 11, color: '#53605e' }}>
                    {fmtDate(q.quotationDate)}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 11, color: '#53605e' }}>
                    {fmtDate(q.validUntil)}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 11, color: '#53605e', textAlign: 'right' }}>
                    {q.itemCount ?? (q.items?.length ?? 0)}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#11130f', textAlign: 'right' }}>
                    {fmtAmt(q.totalAmount)}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <StatusBadge status={q.status} />
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{
                      display: 'flex', gap: 6, justifyContent: 'flex-end',
                      opacity: hoveredRow === q.id ? 1 : 0,
                      transition: 'opacity .12s',
                    }}>
                      {/* Status transition buttons */}
                      {(NEXT_STATUS[q.status] || []).map(ns => (
                        <button
                          key={ns}
                          disabled={busy[q.id]}
                          onClick={() => doStatusChange(q, ns)}
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
                          → {ns}
                        </button>
                      ))}
                      {/* Convert button for ACCEPTED */}
                      {q.status === 'ACCEPTED' && (
                        <button
                          disabled={busy[q.id]}
                          onClick={() => doConvert(q)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 7,
                            border: 'none',
                            background: '#11130f',
                            fontFamily: 'monospace',
                            fontSize: 9,
                            color: '#fff',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Convert →
                        </button>
                      )}
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

export default Quotations
