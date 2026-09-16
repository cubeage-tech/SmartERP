import apiService from '../api.service'

const BASE_URL = '/tenants'

const TenantService = {
  getTenants: (status) => {
    const params = status && status !== 'All Status' ? { status: status.toUpperCase() } : undefined
    return apiService.get(BASE_URL, params)
  },
  getTenant: (id) => apiService.get(`${BASE_URL}/${id}`),
  getTenantDashboard: () => apiService.get(`${BASE_URL}/dashboard`),
  updateTenantStatus: (id, status) => apiService.put(`${BASE_URL}/${id}`, { status: status.toUpperCase() }),
}

export default TenantService
