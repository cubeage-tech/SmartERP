import React, { useState, useEffect, useCallback } from 'react'
import SalesService from '../../../core/services/modules/sales.service'

/* ─── tokens ─────────────────────────────────────────────────────────────── */
const C = {
  bg:      '#f5f4f0',
  white:   '#ffffff',
  border:  '#e3e0d9',
  borderL: '#f0efeb',
  text:    '#11130f',
  muted:   '#53605e',
  dim:     '#91a0a0',
  accent:  '#9b8050',
}

/* ─── reusable primitives ─────────────────────────────────────────────────── */
const inputBase = {
  width: '100%', boxSizing: 'border-box',
  padding: '8px 11px',
  borderRadius: 9,
  border: `1px solid ${C.border}`,
  fontFamily: 'monospace', fontSize: 12, color: C.text,
  background: C.white, outline: 'none',
  transition: 'border-color .15s',
}
const selectBase = {
  ...inputBase, cursor: 'pointer',
  appearance: 'none', WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2391a0a0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 28,
}
const labelCss = {
  fontFamily: 'monospace', fontSize: 10, fontWeight: 600,
  letterSpacing: '0.1em', color: C.dim, textTransform: 'uppercase',
  display: 'block', marginBottom: 5,
}
const sectionCard = {
  background: C.white, border: `1px solid ${C.border}`,
  borderRadius: 14, padding: '18px 20px', marginBottom: 14,
}
const secTitle = {
  fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
  letterSpacing: '0.12em', color: C.text, textTransform: 'uppercase',
  display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16,
}
const grid = (cols, gap = 12) => ({
  display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap,
})

const Label = ({ children }) => <label style={labelCss}>{children}</label>
const Inp   = ({ style, ...p }) => (
  <input style={{ ...inputBase, ...style }}
    onFocus={e => (e.target.style.borderColor = C.accent)}
    onBlur={e  => (e.target.style.borderColor = C.border)}
    {...p} />
)
const Sel = ({ children, style, ...p }) => (
  <select style={{ ...selectBase, ...style }}
    onFocus={e => (e.target.style.borderColor = C.accent)}
    onBlur={e  => (e.target.style.borderColor = C.border)}
    {...p}>
    {children}
  </select>
)
const Txt = ({ style, ...p }) => (
  <textarea style={{ ...inputBase, resize: 'vertical', lineHeight: 1.65, ...style }}
    onFocus={e => (e.target.style.borderColor = C.accent)}
    onBlur={e  => (e.target.style.borderColor = C.border)}
    {...p} />
)
const Field = ({ label, children, style }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 0, ...style }}>
    <Label>{label}</Label>
    {children}
  </div>
)
const Num = ({ n }) => (
  <span style={{
    width: 19, height: 19, borderRadius: '50%',
    background: '#f0efeb', fontFamily: 'monospace',
    fontSize: 10, fontWeight: 700, color: C.muted,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }}>{n}</span>
)

/* ─── price helpers ───────────────────────────────────────────────────────── */
const calcAmt = (i) => +(i.qty * i.unitPrice * (1 - i.discount / 100)).toFixed(2)
const fmtINR  = (n) => '₹\u00a0' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })
const newItem  = () => ({ id: Date.now(), product: '', description: '', sku: '', qty: 1, unit: 'Nos', unitPrice: 0, discount: 0, tax: 18, amount: 0 })

/* ══════════════════════════════════════════════════════════════════════════
   CreateQuotationModal
   ══════════════════════════════════════════════════════════════════════════ */
const CreateQuotationModal = ({ open, onClose }) => {

  /* ── close on ESC ── */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  /* ── prevent body scroll when open ── */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  /* ── form state ── */
  const [q, setQ] = useState({
    quotationNo: 'QUO-2026-011', quotationDate: '2026-08-31',
    validUntil: '2026-09-30', status: 'Draft',
    salesperson: '', reference: 'RFQ-2026-0145',
    currency: 'INR (₹)', priceList: 'Default Price List',
    customer: '', customerId: 'CUST-00124', companyName: 'Tata Steel Ltd',
    contactPerson: 'Rajesh Sharma', email: 'rajesh@tatasteel.com',
    phone: '+91 98765 43210', gstin: '27ABCDE1234F1Z5',
    billingAddress: 'Tata Steel Ltd\nJamshedpur, 831001\nJharkhand, India',
    shippingAddress: '', sameAsBilling: true,
    paymentTerms: 'Net 30 Days', paymentMethod: 'Bank Transfer',
    advance: 20, dueDate: '2026-10-01',
    deliveryDate: '2026-09-15', deliveryMethod: 'By Road',
    warehouse: 'Main Warehouse', transporter: 'VRL Logistics',
    shippingCharges: 2000, deliveryInstr: 'Handle with care. Delivery during working hours.',
    terms: '1. Prices are valid for the period mentioned in this quotation.\n2. Payment should be made as per the agreed payment terms.\n3. Goods once sold will not be taken back.\n4. Delivery will be made as per the delivery terms.\n5. All disputes are subject to Jamshedpur jurisdiction only.',
    customerMsg: 'Thank you for your enquiry.\nWe are pleased to submit our quotation for your kind consideration.\nPlease feel free to contact us for any clarifications.',
    internalNotes: 'Discussed discount with sales manager.\nCustomer is regular buyer.',
    approvalRequired: true, approver: 'Sales Manager',
    approvalStatus: 'Pending', approvalRemarks: '',
  })

  const upd = (k, v) => setQ(p => ({ ...p, [k]: v }))

  const [items, setItems] = useState([
    { id: 1, product: 'Steel Rod 10mm',  description: 'Mild Steel Rod',   sku: 'SR-10MM', qty: 100, unit: 'Nos', unitPrice: 850,  discount: 5, tax: 18, amount: 80750 },
    { id: 2, product: 'MS Plate 5mm',    description: 'Mild Steel Plate', sku: 'PL-5MM',  qty: 50,  unit: 'Nos', unitPrice: 1200, discount: 0, tax: 18, amount: 60000 },
  ])
  const updItem = (id, k, v) =>
    setItems(p => p.map(i => { if (i.id !== id) return i; const u = { ...i, [k]: v }; u.amount = calcAmt(u); return u }))
  const addItem = () => setItems(p => [...p, newItem()])
  const delItem = (id) => setItems(p => p.filter(i => i.id !== id))

  const [attachments, setAttachments] = useState([])
  const [dragOver,    setDragOver]    = useState(false)

  /* ── saving state ── */
  const [saving,    setSaving]    = useState(false)
  const [saveError, setSaveError] = useState(null)

  /* ── build backend payload from form state ── */
  const buildPayload = () => ({
    customerId:   Number(String(q.customerId).replace(/\D/g, '')) || 0,
    customerName: (q.companyName || q.customer || 'Unknown Customer').trim(),
    validUntil:   q.validUntil,
    notes:        [q.customerMsg, q.internalNotes].filter(Boolean).join('\n\n') || null,
    items: items.map(i => ({
      productId:   null,
      description: (i.product || i.description || 'Item').trim(),
      quantity:    i.qty,
      unitPrice:   i.unitPrice,
      taxRate:     i.tax,
    })),
  })

  /* ── save as draft ── */
  const saveDraft = () => {
    setSaving(true)
    setSaveError(null)
    SalesService.createQuotation(buildPayload())
      .then(() => onClose())
      .catch(err => setSaveError(err?.response?.data?.message || 'Save failed. Check required fields.'))
      .finally(() => setSaving(false))
  }

  /* ── save & send (create DRAFT then transition to SENT) ── */
  const saveAndSend = () => {
    setSaving(true)
    setSaveError(null)
    SalesService.createQuotation(buildPayload())
      .then(r => SalesService.updateQuotation(r.data.id, { status: 'SENT' }))
      .then(() => onClose())
      .catch(err => setSaveError(err?.response?.data?.message || 'Save failed. Check required fields.'))
      .finally(() => setSaving(false))
  }

  /* ── price summary ── */
  const subtotal           = items.reduce((s, i) => s + i.amount, 0)
  const itemDiscount       = items.reduce((s, i) => s + i.qty * i.unitPrice * (i.discount / 100), 0)
  const additionalDiscount = 3250
  const taxableAmt         = subtotal - additionalDiscount
  const cgst               = +(taxableAmt * 0.09).toFixed(2)
  const sgst               = +(taxableAmt * 0.09).toFixed(2)
  const shipping           = +q.shippingCharges || 2000
  const otherCharges       = 1000
  const grandTotal         = taxableAmt + cgst + sgst + shipping + otherCharges

  if (!open) return null

  /* ── button styles ── */
  const btnBase   = { padding: '8px 18px', borderRadius: 10, fontFamily: 'monospace', fontSize: 11, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', transition: 'all .15s', opacity: saving ? 0.6 : 1 }
  const btnCancel = { ...btnBase, border: `1px solid ${C.border}`, background: C.white, color: C.muted }
  const btnDraft  = { ...btnBase, border: `1px solid ${C.border}`, background: C.white, color: C.text }
  const btnPrev   = { ...btnBase, border: `1px solid ${C.border}`, background: C.white, color: C.text }
  const btnSend   = { ...btnBase, border: 'none', background: '#11130f', color: '#fff' }

  return (
    <>
      {/* ── backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
          zIndex: 1000,
          animation: 'fadeIn .2s ease',
        }}
      />

      {/* ── centered modal ── */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(900px, 94vw)',
        maxHeight: '92vh',
        background: C.bg,
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 18,
        boxShadow: '0 24px 80px rgba(0,0,0,0.28)',
        animation: 'popIn .22s cubic-bezier(.4,0,.2,1)',
        overflow: 'hidden',
      }}>

        {/* ── sticky header bar ── */}
        <div style={{
          background: C.white,
          borderBottom: `1px solid ${C.border}`,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: 13 }}>
              ←
            </button>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: C.dim, letterSpacing: '0.06em', marginBottom: 1 }}>
                Sales › Quotations › <span style={{ color: C.text }}>New Quotation</span>
              </div>
              <h2 style={{ margin: 0, fontFamily: 'var(--serif, Georgia, serif)', fontSize: 19, fontWeight: 400, color: C.text }}>
                Create New Quotation
              </h2>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
            <button style={btnCancel} onClick={onClose} disabled={saving}>Cancel</button>
            <button style={btnDraft}  onClick={saveDraft}    disabled={saving}>{saving ? 'Saving…' : 'Save as Draft'}</button>
            <button style={btnPrev}   disabled>Preview</button>
            <button style={btnSend}   onClick={saveAndSend}  disabled={saving}>{saving ? 'Saving…' : '💾 Save & Send'}</button>
          </div>
        </div>

        {/* ── save error banner ── */}
        {saveError && (
          <div style={{ background: '#fde8e8', borderBottom: '1px solid #f5c6c6', padding: '10px 20px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#d9534f', margin: 0 }}>
              ⚠ {saveError}
            </p>
          </div>
        )}

        {/* ── scrollable body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>

          {/* ═══ 1. QUOTATION DETAILS ═══ */}
          <div style={sectionCard}>
            <div style={secTitle}><Num n="1" />Quotation Details</div>
            <div style={grid(4)}>
              <Field label="Quotation #"><Inp value={q.quotationNo} onChange={e => upd('quotationNo', e.target.value)} /></Field>
              <Field label="Quotation Date *"><Inp type="date" value={q.quotationDate} onChange={e => upd('quotationDate', e.target.value)} /></Field>
              <Field label="Valid Until *"><Inp type="date" value={q.validUntil} onChange={e => upd('validUntil', e.target.value)} /></Field>
              <Field label="Status *">
                <Sel value={q.status} onChange={e => upd('status', e.target.value)}>
                  {['Draft','Sent','Accepted','Rejected','Expired','Converted','Cancelled'].map(s => <option key={s}>{s}</option>)}
                </Sel>
              </Field>
            </div>
            <div style={{ ...grid(4), marginTop: 12 }}>
              <Field label="Salesperson *">
                <Sel value={q.salesperson} onChange={e => upd('salesperson', e.target.value)}>
                  <option value="">Select Salesperson</option>
                  <option>Rajesh Sharma</option><option>Priya Mehta</option><option>Arjun Nair</option>
                </Sel>
              </Field>
              <Field label="Reference / Enquiry #"><Inp value={q.reference} onChange={e => upd('reference', e.target.value)} placeholder="RFQ-2026-0145" /></Field>
              <Field label="Currency *">
                <Sel value={q.currency} onChange={e => upd('currency', e.target.value)}>
                  <option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option>
                </Sel>
              </Field>
              <Field label="Price List">
                <Sel value={q.priceList} onChange={e => upd('priceList', e.target.value)}>
                  <option>Default Price List</option><option>Wholesale</option><option>Retail</option>
                </Sel>
              </Field>
            </div>
          </div>

          {/* ═══ 2. CUSTOMER INFORMATION ═══ */}
          <div style={sectionCard}>
            <div style={secTitle}><Num n="2" />Customer Information</div>
            <div style={grid(3)}>
              <Field label="Customer *">
                <div style={{ position: 'relative' }}>
                  <Inp value={q.customer} onChange={e => upd('customer', e.target.value)} placeholder="Search customer..." style={{ paddingRight: 28 }} />
                  <span style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: C.dim, fontSize: 13, pointerEvents: 'none' }}>⌕</span>
                </div>
              </Field>
              <Field label="Customer ID"><Inp value={q.customerId} onChange={e => upd('customerId', e.target.value)} placeholder="CUST-00124" /></Field>
              <Field label="Company Name"><Inp value={q.companyName} onChange={e => upd('companyName', e.target.value)} placeholder="Tata Steel Ltd" /></Field>
            </div>
            <div style={{ ...grid(4), marginTop: 12 }}>
              <Field label="Contact Person">
                <Sel value={q.contactPerson} onChange={e => upd('contactPerson', e.target.value)}>
                  <option value="">Select</option><option>Rajesh Sharma</option><option>Priya Mehta</option>
                </Sel>
              </Field>
              <Field label="Email"><Inp type="email" value={q.email} onChange={e => upd('email', e.target.value)} placeholder="rajesh@tatasteel.com" /></Field>
              <Field label="Phone"><Inp value={q.phone} onChange={e => upd('phone', e.target.value)} placeholder="+91 98765 43210" /></Field>
              <Field label="GSTIN"><Inp value={q.gstin} onChange={e => upd('gstin', e.target.value)} placeholder="27ABCDE1234F1Z5" /></Field>
            </div>
            <div style={{ ...grid(2), marginTop: 12 }}>
              <Field label="Billing Address">
                <Txt rows={3} value={q.billingAddress} onChange={e => upd('billingAddress', e.target.value)} placeholder={'Tata Steel Ltd\nJamshedpur, 831001\nJharkhand, India'} />
              </Field>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <label style={labelCss}>Shipping Address</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                    <input type="checkbox" checked={q.sameAsBilling} onChange={e => upd('sameAsBilling', e.target.checked)} style={{ accentColor: C.accent }} />
                    <span style={{ fontFamily: 'monospace', fontSize: 10, color: C.dim }}>Same as Billing Address</span>
                  </label>
                </div>
                <Txt rows={3}
                  value={q.sameAsBilling ? q.billingAddress : q.shippingAddress}
                  onChange={e => upd('shippingAddress', e.target.value)}
                  disabled={q.sameAsBilling}
                  style={{ opacity: q.sameAsBilling ? 0.55 : 1 }}
                />
              </div>
            </div>
            <div style={{ ...grid(4), marginTop: 12 }}>
              <Field label="Payment Terms">
                <Sel value={q.paymentTerms} onChange={e => upd('paymentTerms', e.target.value)}>
                  <option>Net 30 Days</option><option>Net 15 Days</option><option>Immediate</option>
                </Sel>
              </Field>
              <Field label="Payment Method">
                <Sel value={q.paymentMethod} onChange={e => upd('paymentMethod', e.target.value)}>
                  <option>Bank Transfer</option><option>Cheque</option><option>Cash</option><option>UPI</option>
                </Sel>
              </Field>
              <Field label="Advance Required (%)">
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <Inp type="number" min="0" max="100" value={q.advance} onChange={e => upd('advance', e.target.value)} />
                  <span style={{ fontFamily: 'monospace', fontSize: 12, color: C.muted }}>%</span>
                </div>
              </Field>
              <Field label="Due Date"><Inp type="date" value={q.dueDate} onChange={e => upd('dueDate', e.target.value)} /></Field>
            </div>
          </div>

          {/* ═══ 3. QUOTATION ITEMS ═══ */}
          <div style={sectionCard}>
            <div style={secTitle}><Num n="3" />Quotation Items</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {['#','Product / Item *','Description','SKU / Code','Qty *','Unit','Unit Price (₹) *','Disc %','Tax %','Amount (₹)',''].map((h, i) => (
                      <th key={i} style={{ padding: '7px 8px', fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: C.dim, textAlign: i >= 6 ? 'right' : 'left', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${C.borderL}` }}>
                      <td style={{ padding: '7px 8px', fontFamily: 'monospace', fontSize: 11, color: C.dim, width: 24 }}>{idx + 1}</td>
                      <td style={{ padding: '5px 6px', minWidth: 120 }}><Inp value={item.product}     onChange={e => updItem(item.id, 'product',     e.target.value)} style={{ fontSize: 11 }} /></td>
                      <td style={{ padding: '5px 6px', minWidth: 100 }}><Inp value={item.description} onChange={e => updItem(item.id, 'description', e.target.value)} style={{ fontSize: 11 }} /></td>
                      <td style={{ padding: '5px 6px', minWidth: 80  }}><Inp value={item.sku}         onChange={e => updItem(item.id, 'sku',         e.target.value)} style={{ fontSize: 11 }} /></td>
                      <td style={{ padding: '5px 6px', width: 60 }}>
                        <Inp type="number" min="1" value={item.qty} onChange={e => updItem(item.id, 'qty', +e.target.value)} style={{ fontSize: 11, textAlign: 'right' }} />
                      </td>
                      <td style={{ padding: '5px 6px', width: 72 }}>
                        <Sel value={item.unit} onChange={e => updItem(item.id, 'unit', e.target.value)} style={{ fontSize: 11 }}>
                          {['Nos','Kg','MT','Ltr','Box','Pcs'].map(u => <option key={u}>{u}</option>)}
                        </Sel>
                      </td>
                      <td style={{ padding: '5px 6px', width: 90 }}>
                        <Inp type="number" min="0" value={item.unitPrice} onChange={e => updItem(item.id, 'unitPrice', +e.target.value)} style={{ fontSize: 11, textAlign: 'right' }} />
                      </td>
                      <td style={{ padding: '5px 6px', width: 64 }}>
                        <Inp type="number" min="0" max="100" value={item.discount} onChange={e => updItem(item.id, 'discount', +e.target.value)} style={{ fontSize: 11, textAlign: 'right' }} />
                      </td>
                      <td style={{ padding: '5px 6px', width: 56 }}>
                        <Inp type="number" min="0" value={item.tax} onChange={e => updItem(item.id, 'tax', +e.target.value)} style={{ fontSize: 11, textAlign: 'right' }} />
                      </td>
                      <td style={{ padding: '5px 10px', fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: C.text, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {fmtINR(item.amount)}
                      </td>
                      <td style={{ padding: '5px 6px', textAlign: 'center', width: 28 }}>
                        <button onClick={() => delItem(item.id)} style={{ background: 'none', border: 'none', color: '#d97706', cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1 }}>🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addItem} style={{ marginTop: 12, padding: '7px 14px', borderRadius: 9, border: `1px dashed ${C.border}`, background: 'transparent', fontFamily: 'monospace', fontSize: 11, color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              + Add Item
            </button>
          </div>

          {/* ═══ 4 + 5 DELIVERY | PRICE SUMMARY ═══ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

            {/* 4. Delivery */}
            <div style={{ ...sectionCard, marginBottom: 0 }}>
              <div style={secTitle}><Num n="4" />Delivery Information</div>
              <div style={grid(2)}>
                <Field label="Expected Delivery Date"><Inp type="date" value={q.deliveryDate} onChange={e => upd('deliveryDate', e.target.value)} /></Field>
                <Field label="Delivery Method">
                  <Sel value={q.deliveryMethod} onChange={e => upd('deliveryMethod', e.target.value)}>
                    <option>By Road</option><option>By Rail</option><option>By Air</option><option>By Sea</option>
                  </Sel>
                </Field>
              </div>
              <Field label="Warehouse" style={{ marginTop: 12 }}>
                <Sel value={q.warehouse} onChange={e => upd('warehouse', e.target.value)}>
                  <option>Main Warehouse</option><option>Branch Warehouse A</option><option>Branch Warehouse B</option>
                </Sel>
              </Field>
              <Field label="Shipping Address" style={{ marginTop: 12 }}>
                <Txt rows={2} value={q.sameAsBilling ? q.billingAddress : q.shippingAddress} readOnly style={{ opacity: 0.6, resize: 'none' }} />
              </Field>
              <div style={{ ...grid(2), marginTop: 12 }}>
                <Field label="Transporter">
                  <Sel value={q.transporter} onChange={e => upd('transporter', e.target.value)}>
                    <option value="">Select</option><option>VRL Logistics</option><option>Blue Dart</option><option>DTDC</option>
                  </Sel>
                </Field>
                <Field label="Shipping Charges (₹)">
                  <Inp type="number" min="0" value={q.shippingCharges} onChange={e => upd('shippingCharges', e.target.value)} />
                </Field>
              </div>
              <Field label="Delivery Instructions" style={{ marginTop: 12 }}>
                <Txt rows={2} value={q.deliveryInstr} onChange={e => upd('deliveryInstr', e.target.value)} placeholder="Handle with care. Delivery during working hours." />
              </Field>
            </div>

            {/* 5. Price Summary */}
            <div style={{ ...sectionCard, marginBottom: 0 }}>
              <div style={secTitle}><Num n="5" />Price Summary</div>
              {[
                { label: 'Subtotal',             val: fmtINR(subtotal),             color: C.muted },
                { label: 'Item Discount',         val: `- ${fmtINR(itemDiscount)}`,  color: '#d97706' },
                { label: 'Additional Discount',   val: `- ${fmtINR(additionalDiscount)}`, color: '#d97706' },
                { label: 'Taxable Amount',        val: fmtINR(taxableAmt),           color: C.text  },
                { label: 'CGST (9%)',             val: fmtINR(cgst),                 color: C.muted },
                { label: 'SGST (9%)',             val: fmtINR(sgst),                 color: C.muted },
                { label: 'Shipping Charges',      val: fmtINR(shipping),             color: C.muted },
                { label: 'Other Charges',         val: fmtINR(otherCharges),         color: C.muted },
                { label: 'Round Off',             val: '₹ 0.00',                     color: C.dim   },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${C.borderL}` }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: C.muted }}>{label}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color }}>{val}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 0 2px', borderTop: `2px solid ${C.border}`, marginTop: 4 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: C.text, letterSpacing: '0.06em' }}>GRAND TOTAL</span>
                <span style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: 20, fontWeight: 700, color: C.accent }}>
                  {fmtINR(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* ═══ 6. TERMS ═══ */}
          <div style={sectionCard}>
            <div style={secTitle}><Num n="6" />Terms &amp; Conditions</div>
            <Txt rows={5} value={q.terms} onChange={e => upd('terms', e.target.value)} style={{ width: '100%', boxSizing: 'border-box' }} />
          </div>

          {/* ═══ 7 + 8 NOTES | ATTACHMENTS ═══ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

            {/* 7. Notes */}
            <div style={{ ...sectionCard, marginBottom: 0 }}>
              <div style={secTitle}><Num n="7" />Notes</div>
              <Field label="Customer Message">
                <Txt rows={4} value={q.customerMsg} onChange={e => upd('customerMsg', e.target.value)} placeholder="Thank you for your enquiry..." />
              </Field>
              <Field label="Internal Notes" style={{ marginTop: 12 }}>
                <Txt rows={3} value={q.internalNotes} onChange={e => upd('internalNotes', e.target.value)} placeholder="Discussed discount with sales manager..." />
              </Field>
            </div>

            {/* 8. Attachments */}
            <div style={{ ...sectionCard, marginBottom: 0 }}>
              <div style={secTitle}><Num n="8" />Attachments</div>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); setAttachments(p => [...p, ...Array.from(e.dataTransfer.files).map(f => f.name)]) }}
                style={{
                  border: `1.5px dashed ${dragOver ? C.accent : C.border}`,
                  borderRadius: 12, padding: '24px 16px', textAlign: 'center',
                  background: dragOver ? '#faf8f4' : 'transparent', transition: 'all .15s', cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>☁</div>
                <p style={{ fontFamily: 'monospace', fontSize: 11, color: C.muted, margin: 0 }}>Drag &amp; drop files here</p>
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: C.dim, margin: '4px 0 10px' }}>or</p>
                <label style={{ cursor: 'pointer' }}>
                  <input type="file" multiple style={{ display: 'none' }} onChange={e => setAttachments(p => [...p, ...Array.from(e.target.files).map(f => f.name)])} />
                  <span style={{ padding: '6px 16px', borderRadius: 9, border: `1px solid ${C.border}`, background: C.white, fontFamily: 'monospace', fontSize: 11, color: C.text }}>
                    + Upload Attachment
                  </span>
                </label>
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: C.dim, margin: '10px 0 0' }}>Max file size: 10MB (PDF, JPG, PNG, DOCX)</p>
              </div>
              {attachments.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  {attachments.map((name, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 7, background: '#faf8f4', marginBottom: 5 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: C.text }}>📄 {name}</span>
                      <button onClick={() => setAttachments(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', fontSize: 12 }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ═══ 9. APPROVAL ═══ */}
          <div style={sectionCard}>
            <div style={secTitle}><Num n="9" />Approval</div>
            <div style={grid(4)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <Label>Approval Required</Label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 9, cursor: 'pointer' }}>
                  <input type="checkbox" checked={q.approvalRequired} onChange={e => upd('approvalRequired', e.target.checked)} style={{ width: 14, height: 14, accentColor: C.accent }} />
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: C.muted }}>Require approval</span>
                </label>
              </div>
              <Field label="Approver">
                <Sel value={q.approver} onChange={e => upd('approver', e.target.value)} disabled={!q.approvalRequired}>
                  <option>Sales Manager</option><option>Finance Manager</option><option>Director</option>
                </Sel>
              </Field>
              <Field label="Approval Status">
                <Inp value={q.approvalStatus} readOnly style={{ opacity: 0.6, cursor: 'default' }} />
              </Field>
              <Field label="Remarks">
                <Inp value={q.approvalRemarks} onChange={e => upd('approvalRemarks', e.target.value)} placeholder="Add remarks (optional)" disabled={!q.approvalRequired} />
              </Field>
            </div>
          </div>

          {/* ── bottom action bar ── */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 6 }}>
            <button style={btnCancel} onClick={onClose}     disabled={saving}>Cancel</button>
            <button style={btnDraft}  onClick={saveDraft}   disabled={saving}>{saving ? 'Saving…' : 'Save as Draft'}</button>
            <button style={btnPrev}   disabled>Preview</button>
            <button style={btnSend}   onClick={saveAndSend} disabled={saving}>{saving ? 'Saving…' : '💾 Save & Send'}</button>
          </div>

        </div>{/* /scrollable body */}
      </div>{/* /modal drawer */}

      {/* animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn  { from { opacity: 0; transform: translate(-50%, -48%) scale(.97) } to { opacity: 1; transform: translate(-50%, -50%) scale(1) } }
      `}</style>
    </>
  )
}

export default CreateQuotationModal
