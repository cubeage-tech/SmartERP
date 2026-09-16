import apiService from '../api.service'
import axios from '../../../utils/axios'

const BASE_URL = '/company'

const CompanyManagementService = {
  getAll: (params) => apiService.get(BASE_URL, params),
  getById: (id) => apiService.get(`${BASE_URL}/${id}`),
  create: (payload) => apiService.post(BASE_URL, payload),
  update: (id, payload) => apiService.put(`${BASE_URL}/${id}`, payload),
  remove: (id) => apiService.delete(`${BASE_URL}/${id}`),
  getDashboard: (companyId) => apiService.get(`${BASE_URL}/${companyId}/dashboard`),
  getOrganizationChart: (companyId) => apiService.get(`${BASE_URL}/${companyId}/organization-chart`),

  getBranches: (companyId) => apiService.get(`${BASE_URL}/${companyId}/branches`),
  createBranch: (companyId, payload) => apiService.post(`${BASE_URL}/${companyId}/branches`, payload),
  updateBranch: (companyId, id, payload) => apiService.put(`${BASE_URL}/${companyId}/branches/${id}`, payload),
  removeBranch: (companyId, id) => apiService.delete(`${BASE_URL}/${companyId}/branches/${id}`),

  getDepartments: (companyId) => apiService.get(`${BASE_URL}/${companyId}/departments`),
  createDepartment: (companyId, payload) => apiService.post(`${BASE_URL}/${companyId}/departments`, payload),
  updateDepartment: (companyId, id, payload) => apiService.put(`${BASE_URL}/${companyId}/departments/${id}`, payload),
  removeDepartment: (companyId, id) => apiService.delete(`${BASE_URL}/${companyId}/departments/${id}`),

  getCostCenters: (companyId) => apiService.get(`${BASE_URL}/${companyId}/cost-centers`),
  createCostCenter: (companyId, payload) => apiService.post(`${BASE_URL}/${companyId}/cost-centers`, payload),

  getHolidays: (companyId, params) => apiService.get(`${BASE_URL}/${companyId}/holidays`, params),
  createHoliday: (companyId, payload) => apiService.post(`${BASE_URL}/${companyId}/holidays`, payload),
  updateHoliday: (companyId, id, payload) => apiService.put(`${BASE_URL}/${companyId}/holidays/${id}`, payload),
  removeHoliday: (companyId, id) => apiService.delete(`${BASE_URL}/${companyId}/holidays/${id}`),
  exportHolidays: (companyId, year) =>
    axios.get(`${BASE_URL}/${companyId}/holidays/export`, {
      params: { year },
      responseType: 'blob',
    }),
  importHolidays: (companyId, file) => {
    const form = new FormData()
    form.append('file', file)
    return axios.post(`${BASE_URL}/${companyId}/holidays/import`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getApprovalWorkflows: (companyId) => apiService.get(`${BASE_URL}/${companyId}/approval-workflows`),
  createApprovalWorkflow: (companyId, payload) => apiService.post(`${BASE_URL}/${companyId}/approval-workflows`, payload),
  updateApprovalWorkflow: (companyId, id, payload) => apiService.put(`${BASE_URL}/${companyId}/approval-workflows/${id}`, payload),
  removeApprovalWorkflow: (companyId, id) => apiService.delete(`${BASE_URL}/${companyId}/approval-workflows/${id}`),

  getSettings: (companyId) => apiService.get(`${BASE_URL}/${companyId}/settings`),
  updateSettings: (companyId, payload) => apiService.put(`${BASE_URL}/${companyId}/settings`, payload),

  // User & Role Management APIs
  getUsers: (tenantId) => apiService.get('/admin/users', { tenantId }),
  getUser: (id, tenantId) => apiService.get(`/admin/users/${id}`, { tenantId }),
  createUser: (payload) => apiService.post('/admin/users', payload),
  changeUserStatus: (id, tenantId, active) =>
    apiService.patch(`/admin/users/${id}/status?tenantId=${tenantId}&active=${active}`),
  assignUserRoles: (id, tenantId, roleIds) =>
    apiService.put(`/admin/users/${id}/roles?tenantId=${tenantId}`, roleIds),
  getRoles: (tenantId) => apiService.get('/admin/roles', { tenantId }),
}

export default CompanyManagementService
