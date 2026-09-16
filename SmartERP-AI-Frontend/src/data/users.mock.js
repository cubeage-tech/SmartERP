// Temporary stand-in for a real user directory. Drives the dummy login in
// core/services/auth.service.jsx until the backend exposes POST /auth/login.
// `role` must stay in sync with the camelCase keys used by ProtectedRoute's
// ROLE_HOME map and components/layout/Sidebar.jsx's NAV map.
export const DEMO_PASSWORD = 'password123'

export const dummyUsers = [
  {
    id: 'u-super-admin',
    name: 'Ava Sharma',
    email: 'superadmin@smarterp.ai',
    password: DEMO_PASSWORD,
    role: 'superAdmin',
  },
  {
    id: 'u-admin',
    name: 'Ritika Sharma',
    email: 'admin@smarterp.ai',
    password: DEMO_PASSWORD,
    role: 'admin',
  },
  {
    id: 'u-finance-manager',
    name: 'Karan Bhatia',
    email: 'finance@smarterp.ai',
    password: DEMO_PASSWORD,
    role: 'financeManager',
  },
  {
    id: 'u-sales-manager',
    name: 'Priya Nair',
    email: 'sales@smarterp.ai',
    password: DEMO_PASSWORD,
    role: 'salesManager',
  },
  {
    id: 'u-hr-manager',
    name: 'Ananya Verma',
    email: 'hr@smarterp.ai',
    password: DEMO_PASSWORD,
    role: 'hrManager',
  },
  {
    id: 'u-operations-manager',
    name: 'Rohan Mehta',
    email: 'operations@smarterp.ai',
    password: DEMO_PASSWORD,
    role: 'operationsManager',
  },
  {
    id: 'u-inventory-manager',
    name: 'Vikram Patel',
    email: 'inventory@smarterp.ai',
    password: DEMO_PASSWORD,
    role: 'inventoryManager',
  },
  {
    id: 'u-employee',
    name: 'Arjun Rao',
    email: 'employee@smarterp.ai',
    password: DEMO_PASSWORD,
    role: 'employee',
  },
]
