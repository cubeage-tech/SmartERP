import apiService from './api.service'
import { SERVER_URL } from '../constants/serverUrl.constant'
import { dummyUsers } from '../../data/users.mock'

// TEMP: ERP_Backend has no POST /auth/login yet, so `login` resolves against
// the local dummyUsers array instead of calling the API. It still returns the
// same axios-shaped { data: { token, user } } / { response: { data: { message } } }
// contract, so nothing else (Login.jsx, auth.store.js) needs to change when a
// real endpoint ships — just delete mockLogin and point `login` at apiService.post again.
const MOCK_LATENCY_MS = 450

const mockLogin = ({ email, password }) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const match = dummyUsers.find(
        (u) => u.email.toLowerCase() === String(email || '').toLowerCase() && u.password === password
      )
      if (!match) {
        reject({ response: { data: { message: 'Invalid email or password.' } } })
        return
      }
      const { password: _password, ...user } = match
      resolve({ data: { token: `mock-token.${user.id}.${Date.now()}`, user } })
    }, MOCK_LATENCY_MS)
  })

const authService = {

  // added
  login: async (payload) => {
  const response = await apiService.post(
    `${SERVER_URL}/auth/login`,
    payload
  );

  const loginData = response.data.data;

  return {
    data: {
      token: loginData.accessToken,
      user: {
        id: loginData.userId,
        tenantId: loginData.tenantId,
        name: loginData.name,
        email: loginData.email,
        role: loginData.role
          ?.toLowerCase()
          .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()), //added
      },
    },
  };
},

  signup: (payload) => apiService.post(`${SERVER_URL}/auth/signup`, payload),
  logout: () => apiService.post(`${SERVER_URL}/auth/logout`),
  forgotPassword: (email) => apiService.post(`${SERVER_URL}/auth/forgot-password`, { email }),
  resetPassword: (payload) => apiService.post(`${SERVER_URL}/auth/reset-password`, payload),
  me: () => apiService.get(`${SERVER_URL}/auth/me`),
}

export default authService
