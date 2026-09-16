import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../../core/services/auth.service'

/* ─── colour tokens ─────────────────────────────────────────────────────── */
const C = {
  bg:       '#1c1c1c',
  surface:  '#232323',
  input:    '#2a2a2a',
  border:   '#2e2e2e',
  text:     '#f5f5f0',
  muted:    '#9ca3af',
  dim:      '#6b7280',
  purple:   '#a78bfa',
  green:    '#a3c67a',
}

/* ─── Shared field styles ───────────────────────────────────────────────── */
const inputStyle = {
  width: '100%',
  background: C.input,
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  padding: '12px 14px 12px 40px',
  fontSize: 13,
  color: C.text,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}

const labelStyle = {
  display: 'block',
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.12em',
  color: C.dim,
  textTransform: 'uppercase',
  marginBottom: 6,
}

/* ─── Logo Icon ─────────────────────────────────────────────────────────── */
const LogoIcon = () => (
  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#2e2e2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="6"  cy="6"  r="3" fill="#a3a3a3" />
      <circle cx="14" cy="6"  r="3" fill="#6b7280" />
      <circle cx="6"  cy="14" r="3" fill="#6b7280" />
      <circle cx="14" cy="14" r="3" fill="#a3a3a3" />
    </svg>
  </div>
)

/* ─── Stat Card ─────────────────────────────────────────────────────────── */
const StatCard = ({ value, label }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px', flex: 1 }}>
    <div style={{ fontSize: 34, fontWeight: 700, color: C.text, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: C.dim, marginTop: 5, textTransform: 'uppercase' }}>{label}</div>
  </div>
)

/* ─── Field with icon ───────────────────────────────────────────────────── */
const IconInput = ({ icon, noPadding, ...props }) => (
  <div style={{ position: 'relative' }}>
    {icon && (
      <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.dim, display: 'flex', pointerEvents: 'none' }}>
        {icon}
      </span>
    )}
    <input
      {...props}
      style={{ ...inputStyle, paddingLeft: icon ? 40 : 14 }}
      onFocus={e  => (e.target.style.borderColor = '#6b7280')}
      onBlur={e   => (e.target.style.borderColor = C.border)}
    />
  </div>
)

/* ─── Password strength ─────────────────────────────────────────────────── */
const getStrength = (pw) => {
  if (!pw) return { label: '', score: 0 }
  let score = 0
  if (pw.length >= 8)              score++
  if (/[A-Z]/.test(pw))           score++
  if (/[0-9]/.test(pw))           score++
  if (/[^A-Za-z0-9]/.test(pw))   score++
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', '#ef4444', '#f59e0b', '#84cc16', '#22c55e']
  return { label: labels[score], color: colors[score], score }
}

/* ─── SVG icons ─────────────────────────────────────────────────────────── */
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.08 12a19.79 19.79 0 0 1-3-8.57A2 2 0 0 1 3 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
  </svg>
)
const BuildingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01"/>
  </svg>
)
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const EyeIcon = ({ off }) => off ? (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
) : (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

/* ─── Industries list ───────────────────────────────────────────────────── */
const INDUSTRIES = [
  'Technology', 'Manufacturing', 'Retail & E-commerce', 'Healthcare',
  'Finance & Banking', 'Construction', 'Logistics & Supply Chain',
  'Education', 'Hospitality', 'Other',
]

const HOW_HEARD = [
  'Search Engine (Google, Bing)', 'Social Media', 'Colleague / Referral',
  'Conference / Event', 'Online Advertisement', 'Other',
]

/* ═══════════════════════════════════════════════════════════════════════════
   Signup Component
   ═══════════════════════════════════════════════════════════════════════════ */
const Signup = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName:    '',
    email:       '',
    phone:       '',
    companyName: '',
    industry:    '',
    password:    '',
    confirmPassword: '',
    howHeard:    '',
    agreeTerms:  false,
  })
  const [showPw,     setShowPw]     = useState(false)
  const [showConfPw, setShowConfPw] = useState(false)
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)

  const strength = getStrength(form.password)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.agreeTerms) { setError('Please agree to the Terms of Service and Privacy Policy.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    setError('')
    setLoading(true)
    try {
      await authService.signup({
        name:        form.fullName,
        companyName: form.companyName,
        email:       form.email,
        password:    form.password,
      })
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create your account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── select style (shared) ── */
  const selectStyle = {
    width: '100%',
    background: C.input,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: '12px 36px 12px 14px',
    fontSize: 13,
    color: form.industry ? C.text : C.dim,
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    transition: 'border-color 0.15s',
  }

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: C.bg }}>

      {/* ── LEFT PANEL ────────────────────────────────────────────────────── */}
      <div style={{
        flex: '0 0 45%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px 48px',
        borderRight: `1px solid ${C.border}`,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LogoIcon />
          <span style={{ color: C.text, fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>
            SmartERP{' '}
            <span style={{ color: C.purple, fontWeight: 400, fontSize: 13 }}>AI</span>
          </span>
        </div>

        {/* Hero */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 48, paddingBottom: 32 }}>
          <h1 style={{ fontSize: 'clamp(34px, 3.8vw, 50px)', fontWeight: 700, color: C.text, lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0 }}>
            Everything your<br />business needs.
          </h1>
          <h1 style={{ fontSize: 'clamp(34px, 3.8vw, 50px)', fontWeight: 700, color: C.green, fontStyle: 'italic', lineHeight: 1.1, letterSpacing: '-0.03em', margin: '4px 0 28px' }}>
            One workspace.
          </h1>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, maxWidth: 360, fontFamily: 'monospace' }}>
            One intelligent ERP platform connecting finance,<br />
            sales, operations, people and projects — with AI<br />
            at every layer.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
            <StatCard value="10" label="Modules" />
            <StatCard value="8"  label="AI Capabilities" />
            <StatCard value="9"  label="Industries" />
          </div>
        </div>

        {/* Security badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', color: C.dim, textTransform: 'uppercase' }}>
            Protected by Enterprise-Grade Security
          </span>
        </div>
      </div>

      {/* ── RIGHT PANEL ───────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 48px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>

          {/* Heading */}
          <h2 style={{ fontSize: 34, fontWeight: 700, color: C.text, letterSpacing: '-0.03em', margin: 0 }}>
            Create your account
          </h2>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 8, marginBottom: 28, fontFamily: 'monospace' }}>
            Join SmartERP and transform the way you work.
          </p>

          {/* Error */}
          {error && (
            <div style={{ background: '#2d1515', border: '1px solid #7f1d1d', borderRadius: 8, padding: '10px 14px', color: '#fca5a5', fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Full Name</label>
              <IconInput icon={<UserIcon />} id="fullName" name="fullName" type="text" value={form.fullName} onChange={handleChange} placeholder="Enter your full name" required />
            </div>

            {/* Work Email + Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Work Email</label>
                <IconInput icon={<MailIcon />} id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your work email" required />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <IconInput icon={<PhoneIcon />} id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Enter your phone number" />
              </div>
            </div>

            {/* Company + Industry */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Company Name</label>
                <IconInput icon={<BuildingIcon />} id="companyName" name="companyName" type="text" value={form.companyName} onChange={handleChange} placeholder="Enter your company name" required />
              </div>
              <div>
                <label style={labelStyle}>Industry</label>
                <div style={{ position: 'relative' }}>
                  <select
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    style={{ ...selectStyle, color: form.industry ? C.text : C.dim }}
                    onFocus={e  => (e.target.style.borderColor = '#6b7280')}
                    onBlur={e   => (e.target.style.borderColor = C.border)}
                  >
                    <option value="" disabled style={{ color: C.dim, background: C.input }}>Select your industry</option>
                    {INDUSTRIES.map(i => (
                      <option key={i} value={i} style={{ background: C.input, color: C.text }}>{i}</option>
                    ))}
                  </select>
                  {/* chevron */}
                  <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: C.dim }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Password + Confirm */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 6 }}>
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.dim, display: 'flex', pointerEvents: 'none' }}><LockIcon /></span>
                  <input
                    id="password" name="password" type={showPw ? 'text' : 'password'}
                    value={form.password} onChange={handleChange}
                    placeholder="Create a strong password" required
                    style={{ ...inputStyle, paddingRight: 40 }}
                    onFocus={e => (e.target.style.borderColor = '#6b7280')}
                    onBlur={e  => (e.target.style.borderColor = C.border)}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', padding: 0, display: 'flex' }}>
                    <EyeIcon off={showPw} />
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.dim, display: 'flex', pointerEvents: 'none' }}><LockIcon /></span>
                  <input
                    id="confirmPassword" name="confirmPassword" type={showConfPw ? 'text' : 'password'}
                    value={form.confirmPassword} onChange={handleChange}
                    placeholder="Confirm your password" required
                    style={{ ...inputStyle, paddingRight: 40 }}
                    onFocus={e => (e.target.style.borderColor = '#6b7280')}
                    onBlur={e  => (e.target.style.borderColor = C.border)}
                  />
                  <button type="button" onClick={() => setShowConfPw(!showConfPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', padding: 0, display: 'flex' }}>
                    <EyeIcon off={showConfPw} />
                  </button>
                </div>
              </div>
            </div>

            {/* Password strength */}
            {form.password && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: C.dim }}>Password strength:</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: strength.color }}>{strength.label}</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength.score ? strength.color : C.border, transition: 'background 0.2s' }} />
                  ))}
                </div>
              </div>
            )}
            {!form.password && <div style={{ marginBottom: 16 }} />}

            {/* How did you hear */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>How did you hear about us? <span style={{ color: C.border, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(Optional)</span></label>
              <div style={{ position: 'relative' }}>
                <select
                  name="howHeard"
                  value={form.howHeard}
                  onChange={handleChange}
                  style={{ ...selectStyle, color: form.howHeard ? C.text : C.dim }}
                  onFocus={e  => (e.target.style.borderColor = '#6b7280')}
                  onBlur={e   => (e.target.style.borderColor = C.border)}
                >
                  <option value="" style={{ color: C.dim, background: C.input }}>Select an option</option>
                  {HOW_HEARD.map(h => (
                    <option key={h} value={h} style={{ background: C.input, color: C.text }}>{h}</option>
                  ))}
                </select>
                <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: C.dim }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>

            {/* Terms checkbox */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 22 }}>
              <input
                type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange}
                style={{ width: 15, height: 15, accentColor: C.purple, cursor: 'pointer', marginTop: 1, flexShrink: 0 }}
              />
              <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, fontFamily: 'monospace' }}>
                I agree to the{' '}
                <a href="#" style={{ color: C.purple, textDecoration: 'none' }} onClick={e => e.stopPropagation()}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" style={{ color: C.purple, textDecoration: 'none' }} onClick={e => e.stopPropagation()}>Privacy Policy</a>
              </span>
            </label>

            {/* Create Account button */}
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', background: '#f5f5f0', color: '#1a1a1a', border: 'none',
                borderRadius: 10, padding: '15px', fontSize: 13, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s, background 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#e5e5e0' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f0' }}
            >
              {loading ? 'Creating…' : <>Create Account <span style={{ fontSize: 16 }}>→</span></>}
            </button>

            {/* OR divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '20px 0' }}>
              <span style={{ flex: 1, height: 1, background: C.border }} />
              <span style={{ fontSize: 12, color: C.dim, letterSpacing: '0.05em' }}>OR</span>
              <span style={{ flex: 1, height: 1, background: C.border }} />
            </div>

            {/* Sign up with Google */}
            <button
              type="button"
              style={{
                width: '100%', background: C.input, color: C.muted,
                border: `1px solid ${C.border}`, borderRadius: 10, padding: '13px',
                fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#6b7280')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
            >
              <GoogleIcon />
              Sign Up with Google
            </button>

          </form>

          {/* Sign in link */}
          <p style={{ marginTop: 24, fontSize: 13, color: C.dim, textAlign: 'center', fontFamily: 'monospace' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: C.purple, textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Signup
