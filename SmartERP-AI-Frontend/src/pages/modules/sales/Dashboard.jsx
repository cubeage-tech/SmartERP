import React, { useState, useEffect, useCallback } from 'react'
import Quotations           from './Quotations'
import SalesOrders          from './SalesOrders'
import Invoices             from './Invoices'
import Analytics            from './Analytics'
import CreateQuotationModal from './CreateQuotationModal'
import SalesService         from '../../../core/services/modules/sales.service'

const TABS = ['QUOTATIONS', 'ORDERS', 'INVOICES', 'ANALYTICS']

/* ── number formatters ────────────────────────────────────────────────── */
const fmtCrore = (n) => {
  const v = Number(n) || 0
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`
  if (v >= 100000)   return `₹${(v / 100000).toFixed(1)} L`
  return `₹${v.toLocaleString('en-IN')}`
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('QUOTATIONS')
  const [modalOpen, setModalOpen] = useState(false)

  /* ── KPI state ── */
  const [kpi,     setKpi]     = useState(null)
  const [kpiErr,  setKpiErr]  = useState(false)
  const [refresh, setRefresh] = useState(0)        // bump to reload lists

  useEffect(() => {
    SalesService.getDashboard()
      .then(r => setKpi(r.data))
      .catch(() => setKpiErr(true))
  }, [refresh])

  const handleModalClose = useCallback(() => {
    setModalOpen(false)
    setRefresh(p => p + 1)     // trigger quotations list reload after create
  }, [])

  /* ── KPI cards derived from API ── */
  const kpiCards = kpi ? [
    {
      value:    fmtCrore(kpi.revenueMtd),
      label:    'REVENUE MTD',
      sub:      `${Number(kpi.revenueChangePercent) >= 0 ? '↑' : '↓'} ${Math.abs(Number(kpi.revenueChangePercent)).toFixed(1)}% vs last month`,
      subColor: Number(kpi.revenueChangePercent) >= 0 ? '#3a7d44' : '#d9534f',
    },
    {
      value:    fmtCrore(kpi.outstandingAmount),
      label:    'OUTSTANDING',
      sub:      `${kpi.pendingInvoiceCount} invoice${kpi.pendingInvoiceCount !== 1 ? 's' : ''} pending`,
      subColor: '#91a0a0',
    },
    {
      value:    fmtCrore(kpi.ordersYtdAmount),
      label:    'ORDERS YTD',
      sub:      `${kpi.orderCountYtd} order${kpi.orderCountYtd !== 1 ? 's' : ''}`,
      subColor: '#91a0a0',
    },
    {
      value:    `${Number(kpi.onTimeDeliveryPercentage).toFixed(1)}%`,
      label:    'ON-TIME DELIVERY',
      sub:      `${Number(kpi.onTimeDeliveryChangePoints) >= 0 ? '↑' : '↓'} ${Math.abs(Number(kpi.onTimeDeliveryChangePoints)).toFixed(1)}pp this month`,
      subColor: Number(kpi.onTimeDeliveryChangePoints) >= 0 ? '#3a7d44' : '#d9534f',
    },
  ] : [
    { value: '—', label: 'REVENUE MTD',     sub: kpiErr ? 'Error loading' : 'Loading…', subColor: '#91a0a0' },
    { value: '—', label: 'OUTSTANDING',      sub: '',                                    subColor: '#91a0a0' },
    { value: '—', label: 'ORDERS YTD',       sub: '',                                    subColor: '#91a0a0' },
    { value: '—', label: 'ON-TIME DELIVERY', sub: '',                                    subColor: '#91a0a0' },
  ]

  /* ── Export CSV ── */
  const handleExport = () => {
    const typeMap = { QUOTATIONS: 'QUOTATIONS', ORDERS: 'ORDERS', INVOICES: 'INVOICES', ANALYTICS: 'INVOICES' }
    const type = typeMap[activeTab] || 'QUOTATIONS'
    SalesService.exportCsv(type)
      .then(r => {
        const url = URL.createObjectURL(new Blob([r.data], { type: 'text/csv' }))
        const a   = document.createElement('a')
        a.href = url
        a.download = `sales-${type.toLowerCase()}.csv`
        a.click()
        URL.revokeObjectURL(url)
      })
      .catch(() => {}) // silent — export is best-effort
  }

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ backgroundColor: '#f5f4f0' }}>

      {/* New Quotation modal */}
      <CreateQuotationModal open={modalOpen} onClose={handleModalClose} />

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p style={{
            fontFamily: 'monospace',
            fontSize: 10,
            letterSpacing: '0.12em',
            color: '#91a0a0',
            marginBottom: 10,
          }}>
            SALES
          </p>
          <h1 style={{
            fontFamily: 'var(--serif, Georgia, serif)',
            fontSize: 32,
            fontWeight: 400,
            lineHeight: 1,
            color: '#11130f',
            margin: 0,
          }}>
            Sales Management
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleExport}
            style={{
              padding: '10px 18px',
              borderRadius: 14,
              border: '1px solid #e2dfd7',
              background: '#fff',
              fontFamily: 'monospace',
              fontSize: 11,
              color: '#303531',
              cursor: 'pointer',
            }}
          >
            ↓ Export
          </button>
          <button
            style={{
              padding: '10px 18px',
              borderRadius: 14,
              border: 'none',
              background: '#11130f',
              fontFamily: 'monospace',
              fontSize: 11,
              color: '#fff',
              cursor: 'pointer',
            }}
            onClick={() => setModalOpen(true)}
          >
            + New Quotation
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
        marginBottom: 28,
      }}>
        {kpiCards.map((card) => (
          <div key={card.label} style={{
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
              {card.value}
            </p>
            <p style={{
              fontFamily: 'monospace',
              fontSize: 9,
              letterSpacing: '0.12em',
              color: '#9ba2a2',
              margin: '0 0 6px',
            }}>
              {card.label}
            </p>
            <p style={{
              fontFamily: 'monospace',
              fontSize: 11,
              color: card.subColor,
              margin: 0,
            }}>
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: activeTab === tab ? '1px solid #e3e0d9' : '1px solid transparent',
              background: activeTab === tab ? '#fff' : 'transparent',
              fontFamily: 'monospace',
              fontSize: 10,
              letterSpacing: '0.06em',
              color: activeTab === tab ? '#11130f' : '#8d9696',
              cursor: 'pointer',
              boxShadow: activeTab === tab ? '0 2px 5px rgba(0,0,0,.06)' : 'none',
              transition: 'all .15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'QUOTATIONS' && <Quotations onView={() => setModalOpen(true)} refresh={refresh} />}
        {activeTab === 'ORDERS'     && <SalesOrders refresh={refresh} />}
        {activeTab === 'INVOICES'   && <Invoices refresh={refresh} />}
        {activeTab === 'ANALYTICS'  && <Analytics />}
      </div>

    </div>
  )
}

export default Dashboard
