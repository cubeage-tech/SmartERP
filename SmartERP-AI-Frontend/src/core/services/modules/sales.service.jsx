import apiService from '../api.service'
import axios from '../../../utils/axios'

const B = '/sales'

const SalesService = {
  // Dashboard
  getDashboard: () => apiService.get(`${B}/dashboard`),

  // Quotations
  getQuotations:    ()         => apiService.get(`${B}/quotations`),
  getQuotation:     (id)       => apiService.get(`${B}/quotations/${id}`),
  createQuotation:  (data)     => apiService.post(`${B}/quotations`, data),
  updateQuotation:  (id, data) => apiService.put(`${B}/quotations/${id}`, data),

  /**
   * POST /api/v1/sales/quotations/{id}/convert?expectedDeliveryDate=YYYY-MM-DD
   * expectedDeliveryDate is optional.
   */
  convertQuotation: (id, expectedDeliveryDate) =>
    axios.post(`${B}/quotations/${id}/convert`, null, {
      params: expectedDeliveryDate ? { expectedDeliveryDate } : {},
    }),

  // Orders
  getOrders:         ()           => apiService.get(`${B}/orders`),
  getOrder:          (id)         => apiService.get(`${B}/orders/${id}`),
  updateOrderStatus: (id, data)   => apiService.patch(`${B}/orders/${id}/status`, data),

  /**
   * POST /api/v1/sales/orders/{id}/invoice?dueDate=YYYY-MM-DD
   */
  invoiceOrder: (id, dueDate) =>
    axios.post(`${B}/orders/${id}/invoice`, null, {
      params: dueDate ? { dueDate } : {},
    }),

  // Invoices
  getInvoices:   ()         => apiService.get(`${B}/invoices`),
  getInvoice:    (id)       => apiService.get(`${B}/invoices/${id}`),
  recordPayment: (id, data) => apiService.post(`${B}/invoices/${id}/payments`, data),
  printInvoice:  (id)       => apiService.get(`${B}/invoices/${id}/print`),

  // Export CSV (type = QUOTATIONS | ORDERS | INVOICES)
  exportCsv: (type) => axios.get(`${B}/export`, { params: { type }, responseType: 'blob' }),

  // Analytics
  getAnalytics: () => apiService.get(`${B}/analytics`),
}

export default SalesService
