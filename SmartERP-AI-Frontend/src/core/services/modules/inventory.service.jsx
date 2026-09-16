import apiService from '../api.service'

const BASE_URL = '/inventory'

const InventoryService = {
  getAll:           (params)      => apiService.get(BASE_URL, params),
  getById:          (id)          => apiService.get(`${BASE_URL}/${id}`),
  getDashboard:     ()            => apiService.get(`${BASE_URL}/dashboard`),
  getWarehouses:    ()            => apiService.get(`${BASE_URL}/warehouses`),
  getMovements:     ()            => apiService.get(`${BASE_URL}/movements`),
  create:           (payload)     => apiService.post(BASE_URL, payload),
  update:           (id, payload) => apiService.put(`${BASE_URL}/${id}`, payload),
  remove:           (id)          => apiService.delete(`${BASE_URL}/${id}`),

  // Advanced Stock Operations
  adjustStock:      (payload)     => apiService.post(`${BASE_URL}/stock/adjust`, payload),
  transferStock:    (payload)     => apiService.post(`${BASE_URL}/stock/transfer`, payload),
  getReplenishment: ()            => apiService.get(`${BASE_URL}/replenishment`),

  // Stock Take Operations
  getStockTakes:    ()            => apiService.get(`${BASE_URL}/stock-takes`),
  getStockTakeById: (id)          => apiService.get(`${BASE_URL}/stock-takes/${id}`),
  createStockTake:  (payload)     => apiService.post(`${BASE_URL}/stock-takes`, payload),
  updateStockTake:  (id, payload) => apiService.put(`${BASE_URL}/stock-takes/${id}`, payload),
  finalizeStockTake:(id)          => apiService.post(`${BASE_URL}/stock-takes/${id}/finalize`),
}

export default InventoryService
