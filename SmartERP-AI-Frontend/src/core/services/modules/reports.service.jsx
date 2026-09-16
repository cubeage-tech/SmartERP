import apiService from '../api.service'

const BASE_URL = '/reports'
const CUSTOM_URL = '/reports/custom'

const ReportsService = {
  getAll: (params) => apiService.get(BASE_URL, params),
  getById: (id) => apiService.get(`${BASE_URL}/${id}`),
  create: (payload) => apiService.post(BASE_URL, payload),
  update: (id, payload) => apiService.put(`${BASE_URL}/${id}`, payload),
  remove: (id) => apiService.delete(`${BASE_URL}/${id}`),

  // Custom Report CRUD
  createCustom: (payload) => apiService.post(CUSTOM_URL, payload),
  getCustomById: (id) => apiService.get(`${CUSTOM_URL}/${id}`),
  updateCustom: (id, payload) => apiService.put(`${CUSTOM_URL}/${id}`, payload),
  removeCustom: (id) => apiService.delete(`${CUSTOM_URL}/${id}`),

  // Previews
  getPreview: (id) => apiService.post(`${CUSTOM_URL}/${id}/preview`),
  getPreviewDynamic: (payload) => apiService.post(`${CUSTOM_URL}/preview-dynamic`, payload),

  // Dashboard
  getDashboard: () => apiService.get(`${BASE_URL}/dashboard`),

  // Export
  export: (id, payload) => apiService.post(`${BASE_URL}/${id}/export`, payload, { responseType: 'blob' }),

  // Schedules
  getSchedules: () => apiService.get(`${BASE_URL}/schedules`),
  getScheduleById: (id) => apiService.get(`${BASE_URL}/schedules/${id}`),
  createSchedule: (payload) => apiService.post(`${BASE_URL}/schedules`, payload),
  updateSchedule: (id, payload) => apiService.put(`${BASE_URL}/schedules/${id}`, payload),
  deleteSchedule: (id) => apiService.delete(`${BASE_URL}/schedules/${id}`),
}

export default ReportsService
