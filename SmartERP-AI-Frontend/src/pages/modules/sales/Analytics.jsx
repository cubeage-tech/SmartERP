import React, { useState, useEffect } from 'react'
import SalesService from '../../../core/services/modules/sales.service'

/* ── hardcoded pipeline + type data (no backend data for these) ── */
const PIPELINE = [
  { stage: 'Prospecting',    count: 24, value: '₹48 L',  color: '#c8d8f0' },
  { stage: 'Qualified',      count: 18, value: '₹72 L',  color: '#a8c4e8' },
  { stage: 'Proposal Sent',  count: 12, value: '₹96 L',  color: '#7ca8d4' },
  { stage: 'Negotiation',    count: 8,  value: '₹1.1 Cr',color: '#5490c0' },
  { stage: 'Closed Won',     count: 5,  value: '₹84 L',  color: '#3a7d44' },
]

const SALES_BY_TYPE = [
  { label: 'Products',  pct: 54, color: '#9b8050' },
  { label: 'Services',  pct: 31, color: '#7ca8d4' },
  { label: 'Recurring', pct: 15, color: '#b5cfa8' },
]

/* ── number formatter ── */
const fmt = (n) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(1)} Cr`
  : n >= 100000  ? `₹${(n / 100000).toFixed(1)} L`
  : `₹${Number(n).toLocaleString('en-IN')}`

const fmtMonth = (yearMonth) => {
  // yearMonth from backend is a YearMonth object serialized as e.g. "2026-08" or { year:2026, monthValue:8 }
  if (typeof yearMonth === 'string') {
    const [, m] = yearMonth.split('-')
    return new Date(yearMonth + '-01').toLocaleDateString('en-US', { month: 'short' })
  }
  if (yearMonth && typeof yearMonth === 'object') {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return months[(yearMonth.monthValue ?? yearMonth.month ?? 1) - 1] || '?'
  }
  return '?'
}

const Analytics = () => {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  useEffect(() => {
    SalesService.getAnalytics()
      .then(r => setData(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const monthlyRevenue = data?.monthlyRevenue ?? []
  const topCustomers   = data?.topCustomers   ?? []
  const maxRevenue     = Math.max(...monthlyRevenue.map(m => Number(m.revenue)), 1)
  const maxCustomer    = topCustomers[0] ? Number(topCustomers[0].revenue) : 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Row 1 — bar chart + top customers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Monthly Revenue Bar Chart */}
        <div style={{
          background: '#fff',
          border: '1px solid #e3e0d9',
          borderRadius: 18,
          padding: '22px 24px',
        }}>
          <p style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#11130f', margin: '0 0 20px' }}>
            Monthly Revenue
          </p>
          {loading && <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#91a0a0' }}>Loading…</p>}
          {error   && <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#d9534f' }}>Failed to load analytics</p>}
          {!loading && !error && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160 }}>
              {monthlyRevenue.length === 0 && (
                <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#91a0a0' }}>No revenue data yet</p>
              )}
              {monthlyRevenue.map((m, i) => {
                const heightPct = (Number(m.revenue) / maxRevenue) * 100
                const isLast    = i === monthlyRevenue.length - 1
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#53605e' }}>
                      {fmt(Number(m.revenue))}
                    </span>
                    <div style={{
                      width: '100%',
                      height: `${heightPct}%`,
                      minHeight: 8,
                      background: isLast ? '#9b8050' : '#e3ddd4',
                      borderRadius: '5px 5px 0 0',
                      transition: 'background .2s',
                    }} />
                    <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#91a0a0' }}>
                      {fmtMonth(m.month)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Top Customers */}
        <div style={{
          background: '#fff',
          border: '1px solid #e3e0d9',
          borderRadius: 18,
          padding: '22px 24px',
        }}>
          <p style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#11130f', margin: '0 0 18px' }}>
            Top Customers
          </p>
          {loading && <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#91a0a0' }}>Loading…</p>}
          {error   && <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#d9534f' }}>Failed to load</p>}
          {!loading && !error && topCustomers.length === 0 && (
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#91a0a0' }}>No customer data yet</p>
          )}
          {!loading && !error && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {topCustomers.map((c) => {
                const pct = Math.round((Number(c.revenue) / maxCustomer) * 100)
                return (
                  <div key={c.rank} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#91a0a0', width: 16, flexShrink: 0 }}>
                      {c.rank}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#11130f', fontWeight: 600 }}>
                          {c.customerName}
                        </span>
                        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#53605e' }}>
                          {fmt(Number(c.revenue))}
                        </span>
                      </div>
                      <div style={{ height: 5, background: '#f0efeb', borderRadius: 10, overflow: 'hidden' }}>
                        <div style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: '#9b8050',
                          borderRadius: 10,
                        }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* Row 2 — sales pipeline + sales by type (static) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Sales Pipeline */}
        <div style={{
          background: '#fff',
          border: '1px solid #e3e0d9',
          borderRadius: 18,
          padding: '22px 24px',
        }}>
          <p style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#11130f', margin: '0 0 18px' }}>
            Sales Pipeline
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PIPELINE.map((p) => (
              <div key={p.stage} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: p.color, flexShrink: 0,
                }} />
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#53605e', width: 130, flexShrink: 0 }}>
                  {p.stage}
                </span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 6, background: '#f0efeb', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{
                      width: `${(p.count / PIPELINE[0].count) * 100}%`,
                      height: '100%',
                      background: p.color,
                      borderRadius: 10,
                    }} />
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#91a0a0', width: 20, textAlign: 'right' }}>
                    {p.count}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'monospace', fontSize: 11, color: '#11130f',
                  fontWeight: 600, width: 60, textAlign: 'right',
                }}>
                  {p.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Type */}
        <div style={{
          background: '#fff',
          border: '1px solid #e3e0d9',
          borderRadius: 18,
          padding: '22px 24px',
        }}>
          <p style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#11130f', margin: '0 0 18px' }}>
            Revenue by Type
          </p>

          {/* Stacked bar */}
          <div style={{ display: 'flex', height: 28, borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
            {SALES_BY_TYPE.map((s) => (
              <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} title={`${s.label}: ${s.pct}%`} />
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SALES_BY_TYPE.map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#53605e' }}>{s.label}</span>
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#11130f' }}>
                  {s.pct}%
                </span>
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 10, marginTop: 22,
            paddingTop: 18, borderTop: '1px solid #f0efeb',
          }}>
            {[
              { label: 'WIN RATE',      value: '38%'     },
              { label: 'AVG DEAL SIZE', value: '₹6.2 L'  },
              { label: 'SALES CYCLE',   value: '24 days' },
              { label: 'QUOTA ATTAIN.', value: '106%'    },
            ].map((stat) => (
              <div key={stat.label}>
                <p style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.1em', color: '#91a0a0', margin: '0 0 3px' }}>
                  {stat.label}
                </p>
                <p style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 600, color: '#11130f', margin: 0 }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Analytics
