import apiService from "../api.service";

const RoleDashboardService = {
  getSuperAdminDashboard: () =>
    apiService.get("/tenants/dashboard"),

  getAdminDashboard: () =>
    apiService.get("/admin/dashboard"),

  getFinanceDashboard: () =>
    apiService.get("/finance/dashboard"),

  getSalesDashboard: () =>
    apiService.get("/sales/dashboard"),

  getHrDashboard: () =>
    apiService.get("/hr/dashboard"),

  getInventoryDashboard: () =>
    apiService.get("/inventory/dashboard"),

  getManufacturingDashboard: () =>
    apiService.get("/manufacturing/dashboard"),

  getPurchaseDashboard: () =>
    apiService.get("/purchase/dashboard"),
};

export default RoleDashboardService;