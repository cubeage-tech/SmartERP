import apiService from "../api.service";

const BASE_URL = "/purchase";

const PurchaseService = {
  getDashboard: () => apiService.get(`${BASE_URL}/dashboard`),

  getAllOrders: (params) => apiService.get(`${BASE_URL}/orders`, params),
  getOrderById: (id) => apiService.get(`${BASE_URL}/orders/${id}`),
  createOrder: (payload) => apiService.post(`${BASE_URL}/orders`, payload),
  updateOrder: (id, payload) => apiService.put(`${BASE_URL}/orders/${id}`, payload),
  deleteOrder: (id) => apiService.delete(`${BASE_URL}/orders/${id}`),

  getAllVendors: (params) => apiService.get(`${BASE_URL}/vendors`, params),
  getVendorById: (id) => apiService.get(`${BASE_URL}/vendors/${id}`),
  createVendor: (payload) => apiService.post(`${BASE_URL}/vendors`, payload),
  updateVendor: (id, payload) => apiService.put(`${BASE_URL}/vendors/${id}`, payload),
  deleteVendor: (id) => apiService.delete(`${BASE_URL}/vendors/${id}`),

  getAllGRNs: (params) => apiService.get(`${BASE_URL}/grn`, params),
  getGRNById: (id) => apiService.get(`${BASE_URL}/grn/${id}`),
  createGRN: (payload) => apiService.post(`${BASE_URL}/grn`, payload),
  deleteGRN: (id) => apiService.delete(`${BASE_URL}/grn/${id}`),

  getAllPayables: (params) => apiService.get(`${BASE_URL}/payables`, params),
  getPayableById: (id) => apiService.get(`${BASE_URL}/payables/${id}`),
  getPayablesSummary: () => apiService.get(`${BASE_URL}/payables/summary`),
  createPayable: (payload) => apiService.post(`${BASE_URL}/payables`, payload),
  recordPayment: (id, payload) => apiService.post(`${BASE_URL}/payables/${id}/payments`, payload),
};

export default PurchaseService;