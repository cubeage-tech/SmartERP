import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../../core/services/auth.service'
import useAuthStore from '../../store/slices/auth.store'
import storageService from '../../core/services/storage.service'
import { dummyUsers, DEMO_PASSWORD } from '../../data/users.mock'
import { formatRole } from '../../utils/formatRole'

const Login = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const setToken = useAuthStore((state) => state.setToken)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const signIn = async (credentials) => {
    setError('')
    setLoading(true)
    try {
      const { data } = await authService.login(credentials)
      storageService.setToken(data.token)
      storageService.setUser(data.user)
      setToken(data.token)
      setUser(data.user)
      // RoleRedirect (mounted at /app) sends the user to their own role dashboard.
      navigate('/app')
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to log in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    signIn(form)
  }

  const handleDemoLogin = (user) => {
    setForm({ email: user.email, password: DEMO_PASSWORD })
    signIn({ email: user.email, password: DEMO_PASSWORD })
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Sign in to SmartERP AI</h1>
      <p className="mt-1 text-sm text-gray-500">Use one of the demo accounts below, or your own credentials once real login is wired up.</p>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email" name="email" type="email" value={form.email} onChange={handleChange} required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password" name="password" type="password" value={form.password} onChange={handleChange} required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        Demo accounts — password is <code className="text-gray-500">{DEMO_PASSWORD}</code>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-1.5">
        {dummyUsers.map((user) => (
          <button
            key={user.id}
            type="button"
            onClick={() => handleDemoLogin(user)}
            disabled={loading}
            className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-left text-xs hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-60 transition-colors"
          >
            <span className="font-medium text-gray-700">{formatRole(user.role)}</span>
            <span className="text-gray-400">{user.email}</span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-gray-500"><Link to="/forgot-password" className="text-indigo-600 hover:underline">Forgot password?</Link></p>
      <p className="mt-1 text-sm text-gray-500">No account? <Link to="/signup" className="text-indigo-600 hover:underline">Create one</Link></p>
    </div>
  )
}

export default Login
