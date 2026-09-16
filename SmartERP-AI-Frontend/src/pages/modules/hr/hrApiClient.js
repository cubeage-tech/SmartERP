import axios from 'axios';
import storageService from '../../../core/services/storage.service';

const BACKEND_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api/v1';

const hrAxios = axios.create({
  baseURL: `${BACKEND_BASE}/hr`,
  headers: {
    'Content-Type': 'application/json',
  },
});

hrAxios.interceptors.request.use((config) => {
  const token = storageService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const user = storageService.getUser();
  if (user?.tenantId != null) {
    config.headers['X-Tenant-ID'] = user.tenantId;
  }
  return config;
});

hrAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      storageService.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const hrApi = {
  // Employees
  getEmployees: (params) => hrAxios.get('/employees', { params }),
  getEmployee: (id, params) => hrAxios.get(`/employees/${id}`, { params }),
  createEmployee: (data, params) => hrAxios.post('/employees', data, { params }),
  updateEmployee: (id, data, params) => hrAxios.put(`/employees/${id}`, data, { params }),
  deleteEmployee: (id, params) => hrAxios.delete(`/employees/${id}`, { params }),

  // Dashboard
  getDashboard: (params) => hrAxios.get('/dashboard', { params }),

  // Attendance
  getAttendance: (params) => hrAxios.get('/attendance', { params }),
  logAttendance: (data, params) => hrAxios.post('/attendance', data, { params }),

  // Leaves
  getLeaves: (params) => hrAxios.get('/leaves', { params }),
  getLeaveBalance: (year, params) => hrAxios.get('/leaves/balance', { params: { ...(params || {}), ...(year ? { year } : {}) } }),
  createLeave: (data, params) => hrAxios.post('/leaves', data, { params }),
  updateLeave: (id, data, params) => hrAxios.put(`/leaves/${id}`, data, { params }),
  deleteLeave: (id, params) => hrAxios.delete(`/leaves/${id}`, { params }),
  exportLeaves: (year, params) => hrAxios.get('/leaves/export', { params: { ...(params || {}), ...(year ? { year } : {}) }, responseType: 'blob' }),
  approveLeave: (id, params) => hrAxios.patch(`/leaves/${id}/approve`, null, { params }),
  rejectLeave: (id, params) => hrAxios.patch(`/leaves/${id}/reject`, null, { params }),

  // Payroll
  getPayrollSummary: (params) => hrAxios.get('/payroll/summary', { params }),
  getPayrolls: (params) => hrAxios.get('/payroll', { params }),
  processPayroll: (data, params) => hrAxios.post('/payroll/process', data, { params }),

  // Performance
  getPerformance: (params) => hrAxios.get('/performance', { params }),
  getPerformanceReviews: (params) => hrAxios.get('/performance/reviews', { params }),
  getDepartmentScores: (params) => hrAxios.get('/performance/department-scores', { params }),
  addPerformanceReview: (data, params) => hrAxios.post('/performance/reviews', data, { params }),
};

export default hrApi;
