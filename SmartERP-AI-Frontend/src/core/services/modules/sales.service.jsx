import apiService from '../api.service'

const B = '/sales'

const SalesService = {
  getDashboard:   ()         => apiService.get(`${B}/dashboard`),
  getQuotations:  ()         => apiService.get(`${B}/quotations`),
  getOrders:      ()         => apiService.get(`${B}/orders`),
  getInvoices:    ()         => apiService.get(`${B}/invoices`),
  getAnalytics:   ()         => apiService.get(`${B}/analytics`),
}

export default SalesService
