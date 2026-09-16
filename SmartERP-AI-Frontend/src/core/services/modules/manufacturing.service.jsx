import apiService from "../api.service";

const DASHBOARD_URL = "/manufacturing/dashboard";
const WORK_ORDER_URL = "/manufacturing/work-orders";
const BOM_URL = "/manufacturing/bom";
const MACHINE_URL = "/manufacturing/machines";

const ManufacturingService = {

  // Dashboard
  getDashboard: () => apiService.get(DASHBOARD_URL),

  // Work Orders
  getAll: (params) => apiService.get(WORK_ORDER_URL, params),
  getById: (id) => apiService.get(`${WORK_ORDER_URL}/${id}`),
  create: (payload) => apiService.post(WORK_ORDER_URL, payload),
  update: (id, payload) => apiService.put(`${WORK_ORDER_URL}/${id}`, payload),
  remove: (id) => apiService.delete(`${WORK_ORDER_URL}/${id}`),

  // BOM
  getBoms: () => apiService.get(BOM_URL),
  getBomById: (id) => apiService.get(`${BOM_URL}/${id}`),
  createBom: (payload) => apiService.post(BOM_URL, payload),
  updateBom: (id, payload) =>
    apiService.put(`${BOM_URL}/${id}`, payload),
  deleteBom: (id) => apiService.delete(`${BOM_URL}/${id}`),

  // Machines
  getMachines: () => apiService.get(MACHINE_URL),
  getMachineById: (id) => apiService.get(`${MACHINE_URL}/${id}`),
  createMachine: (payload) => apiService.post(MACHINE_URL, payload),
  updateMachine: (id, payload) => apiService.put(`${MACHINE_URL}/${id}`, payload),
  deleteMachine: (id) => apiService.delete(`${MACHINE_URL}/${id}`),

  // Quality Control
  getQualitySummary: () => apiService.get("/manufacturing/quality/summary"),
  getInspections: (params) => apiService.get("/manufacturing/quality/inspections", params),
  createInspection: (payload) => apiService.post("/manufacturing/quality/inspections", payload),
  
};

export default ManufacturingService;