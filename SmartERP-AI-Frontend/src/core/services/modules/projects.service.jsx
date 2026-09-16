import apiService from '../api.service'

const BASE_URL = '/projects'

const ProjectsService = {
  getAll: (params) => apiService.get(BASE_URL, params),
  getDashboard: () => apiService.get(`${BASE_URL}/dashboard`),
  getById: (id) => apiService.get(`${BASE_URL}/${id}`),
  create: (payload) => apiService.post(BASE_URL, payload),
  update: (id, payload) => apiService.put(`${BASE_URL}/${id}`, payload),
  remove: (id) => apiService.delete(`${BASE_URL}/${id}`),

  // Tasks
  getTasks: (projectId) => apiService.get(`${BASE_URL}/${projectId}/tasks`),
  createTask: (projectId, payload) => apiService.post(`${BASE_URL}/${projectId}/tasks`, payload),
  updateTask: (taskId, payload) => apiService.put(`${BASE_URL}/tasks/${taskId}`, payload),

  // Gantt
  getGantt: (projectId) => apiService.get(`${BASE_URL}/${projectId}/gantt`),

  // Budget
  getBudget: (projectId) => apiService.get(`${BASE_URL}/${projectId}/budget`),
  setBudget: (projectId, payload) => apiService.put(`${BASE_URL}/${projectId}/budget`, payload),
  addCostEntry: (projectId, payload) => apiService.post(`${BASE_URL}/${projectId}/budget/costs`, payload),

  // Documents
  getDocuments: (projectId) => apiService.get(`${BASE_URL}/${projectId}/documents`),
  linkDocument: (projectId, payload) => apiService.post(`${BASE_URL}/${projectId}/documents`, payload),
}

export default ProjectsService
