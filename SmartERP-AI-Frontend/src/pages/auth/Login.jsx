import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../core/services/auth.service'
import useAuthStore from '../../store/slices/auth.store'
import storageService from '../../core/services/storage.service'

const Login = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const setToken = useAuthStore((state) => state.setToken)

  const [form, setForm] = useState({email: '',password: '',})
  const [rememberMe, setRememberMe] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const signIn = async (credentials) => {
    setError('')
    setLoading(true)

    try {
      const payload = {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      }

      const { data } = await authService.login(payload)

      storageService.setToken(data.token)
      storageService.setUser(data.user)

      setToken(data.token)
      setUser(data.user)

      // RoleRedirect (mounted at /app) sends the user to their own role dashboard.
      navigate('/app')
    } catch (err) {
      setError('Incorrect username and password')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    signIn(form)
  }

  return (
    <div className="fixed inset-0 w-full max-w-none overflow-y-auto bg-[#0b0e0c] text-[#f1f0eb] md:overflow-hidden">
      <div className="flex min-h-full w-full flex-col md:h-full md:flex-row">
        {/* =========================================================
            LEFT PANEL
        ========================================================== */}
        <section className="relative flex min-h-[650px] w-full flex-col overflow-hidden bg-[#151914] px-8 py-10 sm:px-12 md:min-h-0 md:w-[45%] md:px-[4%] md:py-[58px]">
          {/* Subtle decorative circles */}
          <div className="pointer-events-none absolute -bottom-[170px] left-[12%] h-[390px] w-[390px] rounded-full border border-[#30372f] opacity-30" />
          <div className="pointer-events-none absolute -bottom-[80px] left-[28%] h-[310px] w-[310px] rounded-full border border-[#30372f] opacity-25" />
          <div className="pointer-events-none absolute bottom-[-20px] right-[4%] h-[150px] w-[150px] rounded-full bg-[#222921] opacity-60" />
          <div className="pointer-events-none absolute bottom-[30px] left-[44%] h-[180px] w-[180px] rounded-full border border-[#30372f] opacity-25" />

          {/* Brand */}
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] border border-[#41493e] bg-[#252b23]">
              <div className="grid grid-cols-2 gap-[5px]">
                <span className="h-[8px] w-[8px] rounded-[3px] bg-[#9caf91]" />
                <span className="h-[8px] w-[8px] rounded-[3px] bg-[#697765]" />
                <span className="h-[8px] w-[8px] rounded-[3px] bg-[#697765]" />
                <span className="h-[8px] w-[8px] rounded-[3px] bg-[#475043]" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-serif text-[21px] tracking-[-0.02em] text-[#eeede8]">SmartERP</span>
              <span className="font-sans text-[13px] font-normal text-[#91a184]">AI</span>
            </div>
          </div>

          {/* Main left content */}
          <div className="relative z-10 mt-auto mb-auto pt-20 md:pt-0">
            <div className="max-w-[570px]">
              <h1 className="font-serif text-[48px] leading-[0.98] tracking-[-0.045em] text-[#f0efea] sm:text-[56px] lg:text-[58px]">
                Everything your
                <br />
                business needs.
                <br />
                <span className="italic text-[#9aae91]">
                  One workspace.
                </span>
              </h1>

              <p className="mt-8 max-w-[490px] font-mono text-[13px] leading-[1.75] tracking-[0.02em] text-[#777d76]">
                One intelligent ERP platform connecting finance,
                <br className="hidden sm:block" />
                sales, operations, people and projects — with AI
                <br className="hidden sm:block" />
                at every layer.
              </p>

              {/* Statistics */}
              <div className="mt-10 grid max-w-[555px] grid-cols-3 gap-4">
                <div className="rounded-[15px] border border-[#30362f] bg-[#1e221e] px-5 py-5">
                  <div className="font-serif text-[36px] leading-none text-[#ecebe6]">
                    10
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#676e67]">
                    Modules
                  </div>
                </div>

                <div className="rounded-[15px] border border-[#30362f] bg-[#1e221e] px-5 py-5">
                  <div className="font-serif text-[36px] leading-none text-[#ecebe6]">
                    8
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.13em] text-[#676e67]">
                    AI Capabilities
                  </div>
                </div>

                <div className="rounded-[15px] border border-[#30362f] bg-[#1e221e] px-5 py-5">
                  <div className="font-serif text-[36px] leading-none text-[#ecebe6]">
                    9
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#676e67]">
                    Industries
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security footer */}
          <div className="relative z-10 mt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.13em] text-[#656b64] md:mt-0">
            <span className="h-[9px] w-[9px] rounded-full bg-[#849b78]" />
            Protected by enterprise-grade security
          </div>
        </section>

        {/* =========================================================
            RIGHT PANEL
        ========================================================== */}
        <section className="relative flex min-h-[650px] flex-1 items-center justify-center overflow-hidden bg-[#0c100d] px-8 py-12 sm:px-12 md:min-h-0 md:px-10 md:py-8">
          {/* Subtle dotted background */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(135,145,132,0.28) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative z-10 w-full max-w-[525px]">
            {/* Heading */}
            <div className="mb-11">
              <h2 className="font-serif text-[40px] leading-none tracking-[-0.035em] text-[#efeee9] sm:text-[43px]">
                Welcome back
              </h2>

              <p className="mt-5 font-mono text-[12px] tracking-[0.08em] text-[#737970]">
                Sign in to your SmartERP workspace.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-[10px] border border-red-900/50 bg-red-950/30 px-4 py-3 font-mono text-[12px] text-red-300">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-3 block font-mono text-[11px] uppercase tracking-[0.16em] text-[#777d75]"
                >
                  Work email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="h-[50px] w-full rounded-[15px] border border-[#343934] bg-[#20231f] px-5 font-mono text-[13px] tracking-[0.04em] text-[#e5e4df] outline-none transition-all placeholder:text-[#565c56] focus:border-[#596355] focus:bg-[#232722]"
                />
              </div>

              {/* Password */}
              <div className="mt-5">
                <label
                  htmlFor="password"
                  className="mb-3 block font-mono text-[11px] uppercase tracking-[0.16em] text-[#777d75]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="h-[50px] w-full rounded-[15px] border border-[#343934] bg-[#20231f] px-5 pr-20 font-mono text-[13px] tracking-[0.12em] text-[#e5e4df] outline-none transition-all placeholder:text-[#565c56] focus:border-[#596355] focus:bg-[#232722]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#777d75] transition-colors hover:text-[#a1ab9b]"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="mt-5 flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />

                  <span
                    className={`remember-checkbox ${
                      rememberMe ? 'remember-checkbox-checked' : ''
                    }`}
                  >
                    {rememberMe && (
                      <svg
                        key="remember-tick"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="remember-tick"
                      >
                        <path d="M3 8.5L6.5 12L13 4.5" />
                      </svg>
                    )}
                  </span>
                  
                  <span className="font-mono text-[11px] text-[#737970]">
                    Remember me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="font-mono text-[11px] text-[#87957f] transition-colors hover:text-[#a8b5a1]"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex h-[57px] w-full items-center justify-center rounded-[15px] bg-[#f0eee9] font-mono text-[12px] uppercase tracking-[0.13em] text-[#171916] transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  'Signing in...'
                ) : (
                  <>
                    Sign in
                    <span className="ml-3 text-[16px]">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#252a26]" />

              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#535952]">
                Or
              </span>

              <div className="h-px flex-1 bg-[#252a26]" />
            </div>

            <button
              type="button"
              className="flex h-[58px] w-full items-center justify-center rounded-[15px] border border-[#2e342f] bg-transparent font-mono text-[11px] uppercase tracking-[0.13em] text-[#646b64] opacity-80"
            >
              Continue with SSO
            </button>

            <p className="mt-6 text-center font-mono text-[11px] text-[#737970]">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-[#9aae91] transition-colors hover:text-[#b3c2ac]"
              >
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login