import axios from '../../../utils/axios'
import apiService from '../api.service'

const BASE_URL = '/documents'

const DocumentsService = {
  // ── Dashboard & KPIs ──
  getDashboard: () => apiService.get(`${BASE_URL}/dashboard`),

  // ── Documents CRUD ──
  getAll: (params) => apiService.get(BASE_URL, params),
  getMyUploads: () => apiService.get(`${BASE_URL}/my-uploads`),
  getById: (id) => apiService.get(`${BASE_URL}/${id}`),
  search: (payload) => apiService.post(`${BASE_URL}/search`, payload),

  // ── Multipart Upload ──
  create: (formData) => axios.post(`${BASE_URL}/upload`, formData),

  update: (id, payload) => apiService.put(`${BASE_URL}/${id}`, payload),
  delete: (id) => apiService.delete(`${BASE_URL}/${id}`),

  // ── Download ──
  download: async (id, fileName = 'document') => {
    const response = await axios.get(`${BASE_URL}/${id}/download`, {
      responseType: 'blob',
    })
    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'application/octet-stream',
    })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(downloadUrl)
    return response
  },

  // ── Versioning ──
  getVersions: (documentId) => apiService.get(`${BASE_URL}/${documentId}/versions`),
  uploadVersion: (documentId, formData) =>
    axios.post(`${BASE_URL}/${documentId}/versions`, formData),
  restoreVersion: (documentId, versionId) =>
    apiService.post(`${BASE_URL}/${documentId}/versions/${versionId}/restore`),
  downloadVersion: async (documentId, versionId, fileName = 'document-version') => {
    const response = await axios.get(
      `${BASE_URL}/${documentId}/versions/${versionId}/download`,
      { responseType: 'blob' }
    )
    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'application/octet-stream',
    })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(downloadUrl)
    return response
  },

  // ── Digital Approvals ──
  getApprovals: () => apiService.get(`${BASE_URL}/approvals/pending`),
  getMyApprovals: () => apiService.get(`${BASE_URL}/approvals/my-pending`),
  submitApproval: (payload) => apiService.post(`${BASE_URL}/approvals`, payload),
  approve: (id, comment) =>
    apiService.post(`${BASE_URL}/approvals/${id}/approve`, { comment }),
  reject: (id, comment) =>
    apiService.post(`${BASE_URL}/approvals/${id}/reject`, { comment }),

  // ── OCR ──
  getOcrList: () => apiService.get(`${BASE_URL}/ocr`),
  getLatestOcr: () => apiService.get(`${BASE_URL}/ocr/latest`),
  getOcrStats: () => apiService.get(`${BASE_URL}/ocr/stats`),
  processOcr: (documentId) =>
    apiService.post(`${BASE_URL}/ocr/${documentId}/process`),
}

export default DocumentsService
