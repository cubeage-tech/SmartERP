// ─── Base prefixes ─────────────────────────────────────────────────────────────
const BASE = {
  SUPER_ADMIN:        '/app/super-admin',
  ADMIN:              '/app/admin',
  FINANCE_MANAGER:    '/app/finance-manager',
  SALES_MANAGER:      '/app/sales-manager',
  HR_MANAGER:         '/app/hr-manager',
  OPERATIONS_MANAGER: '/app/operations-manager',
  EMPLOYEE:           '/app/employee',
}

// ─── Route constants ───────────────────────────────────────────────────────────
export const ROUTES = {

  // ── PUBLIC ──────────────────────────────────────────────────────────────────
  HOME:               '/',
  PRICING:            '/pricing',
  ABOUT:              '/about',
  CONTACT:            '/contact',

  // ── AUTH ────────────────────────────────────────────────────────────────────
  LOGIN:              '/login',
  SIGNUP:             '/signup',
  FORGOT_PASSWORD:    '/forgot-password',
  RESET_PASSWORD:     '/reset-password',
  VERIFY_OTP:         '/verify-otp',

  // ── ROLE REDIRECT ───────────────────────────────────────────────────────────
  APP:                '/app',

  // ══════════════════════════════════════════════════════════════════════════════
  // SUPER ADMIN
  // ══════════════════════════════════════════════════════════════════════════════
  SUPER_ADMIN:                              BASE.SUPER_ADMIN,
  SUPER_ADMIN_DASHBOARD:                    `${BASE.SUPER_ADMIN}/dashboard`,

  // Platform management
  SUPER_ADMIN_TENANTS:                      `${BASE.SUPER_ADMIN}/tenants`,
  SUPER_ADMIN_TENANT_DETAIL:                `${BASE.SUPER_ADMIN}/tenants/:id`,
  SUPER_ADMIN_SUBSCRIPTIONS:                `${BASE.SUPER_ADMIN}/subscriptions`,
  SUPER_ADMIN_PLATFORM_USERS:               `${BASE.SUPER_ADMIN}/platform-users`,
  SUPER_ADMIN_PLATFORM_SETTINGS:            `${BASE.SUPER_ADMIN}/platform-settings`,

  // Company
  SUPER_ADMIN_COMPANY:                      `${BASE.SUPER_ADMIN}/company`,
  SUPER_ADMIN_COMPANY_OVERVIEW:             `${BASE.SUPER_ADMIN}/company/overview`,
  SUPER_ADMIN_COMPANY_PROFILE:              `${BASE.SUPER_ADMIN}/company/profile`,
  SUPER_ADMIN_COMPANY_BRANCHES:             `${BASE.SUPER_ADMIN}/company/branches`,
  SUPER_ADMIN_COMPANY_DEPARTMENTS:          `${BASE.SUPER_ADMIN}/company/departments`,
  SUPER_ADMIN_COMPANY_COST_CENTERS:         `${BASE.SUPER_ADMIN}/company/cost-centers`,
  SUPER_ADMIN_COMPANY_ORG_CHART:            `${BASE.SUPER_ADMIN}/company/org-chart`,
  SUPER_ADMIN_COMPANY_USERS:                `${BASE.SUPER_ADMIN}/company/users`,
  SUPER_ADMIN_COMPANY_ROLES:                `${BASE.SUPER_ADMIN}/company/roles`,
  SUPER_ADMIN_COMPANY_APPROVAL_WORKFLOWS:   `${BASE.SUPER_ADMIN}/company/approval-workflows`,
  SUPER_ADMIN_COMPANY_SETTINGS:             `${BASE.SUPER_ADMIN}/company/settings`,
  SUPER_ADMIN_COMPANY_BRANCH_SETTINGS:      `${BASE.SUPER_ADMIN}/company/branch-settings`,
  SUPER_ADMIN_COMPANY_HOLIDAYS:             `${BASE.SUPER_ADMIN}/company/holidays`,
  SUPER_ADMIN_COMPANY_SUBSCRIPTION:         `${BASE.SUPER_ADMIN}/company/subscription`,

  // CRM
  SUPER_ADMIN_CRM:                          `${BASE.SUPER_ADMIN}/crm`,
  SUPER_ADMIN_CRM_OVERVIEW:                 `${BASE.SUPER_ADMIN}/crm/overview`,
  SUPER_ADMIN_CRM_LEADS:                    `${BASE.SUPER_ADMIN}/crm/leads`,
  SUPER_ADMIN_CRM_CUSTOMERS:                `${BASE.SUPER_ADMIN}/crm/customers`,
  SUPER_ADMIN_CRM_PIPELINE:                 `${BASE.SUPER_ADMIN}/crm/pipeline`,
  SUPER_ADMIN_CRM_FOLLOW_UPS:               `${BASE.SUPER_ADMIN}/crm/follow-ups`,
  SUPER_ADMIN_CRM_COMMUNICATION:            `${BASE.SUPER_ADMIN}/crm/communication`,

  // Sales
  SUPER_ADMIN_SALES:                        `${BASE.SUPER_ADMIN}/sales`,
  SUPER_ADMIN_SALES_OVERVIEW:               `${BASE.SUPER_ADMIN}/sales/overview`,
  SUPER_ADMIN_SALES_QUOTATIONS:             `${BASE.SUPER_ADMIN}/sales/quotations`,
  SUPER_ADMIN_SALES_ORDERS:                 `${BASE.SUPER_ADMIN}/sales/orders`,
  SUPER_ADMIN_SALES_INVOICES:               `${BASE.SUPER_ADMIN}/sales/invoices`,
  SUPER_ADMIN_SALES_ANALYTICS:               `${BASE.SUPER_ADMIN}/sales/Analytics`,
  SUPER_ADMIN_SALES_CUSTOMER_REPORTS:       `${BASE.SUPER_ADMIN}/sales/customer-reports`,

  // Purchase
  SUPER_ADMIN_PURCHASE:                     `${BASE.SUPER_ADMIN}/purchase`,
  SUPER_ADMIN_PURCHASE_OVERVIEW:            `${BASE.SUPER_ADMIN}/purchase/overview`,
  SUPER_ADMIN_PURCHASE_VENDORS:             `${BASE.SUPER_ADMIN}/purchase/vendors`,
  SUPER_ADMIN_PURCHASE_REQUESTS:            `${BASE.SUPER_ADMIN}/purchase/requests`,
  SUPER_ADMIN_PURCHASE_ORDERS:              `${BASE.SUPER_ADMIN}/purchase/orders`,
  SUPER_ADMIN_PURCHASE_GOODS_RECEIPTS:      `${BASE.SUPER_ADMIN}/purchase/goods-receipts`,
  SUPER_ADMIN_PURCHASE_PAYMENTS:            `${BASE.SUPER_ADMIN}/purchase/payments`,
  SUPER_ADMIN_PURCHASE_PAYABLES_AGING:      `${BASE.SUPER_ADMIN}/purchase/payables-aging`,

  // Inventory
  SUPER_ADMIN_INVENTORY:                    `${BASE.SUPER_ADMIN}/inventory`,
  SUPER_ADMIN_INVENTORY_OVERVIEW:           `${BASE.SUPER_ADMIN}/inventory/overview`,
  SUPER_ADMIN_INVENTORY_STOCK:              `${BASE.SUPER_ADMIN}/inventory/stock`,
  SUPER_ADMIN_INVENTORY_WAREHOUSES:         `${BASE.SUPER_ADMIN}/inventory/warehouses`,
  SUPER_ADMIN_INVENTORY_BATCH_TRACKING:     `${BASE.SUPER_ADMIN}/inventory/batch-tracking`,
  SUPER_ADMIN_INVENTORY_BARCODE:            `${BASE.SUPER_ADMIN}/inventory/barcode`,
  SUPER_ADMIN_INVENTORY_TRANSFERS:          `${BASE.SUPER_ADMIN}/inventory/transfers`,

  // Manufacturing
  SUPER_ADMIN_MANUFACTURING:                `${BASE.SUPER_ADMIN}/manufacturing`,
  SUPER_ADMIN_MANUFACTURING_OVERVIEW:       `${BASE.SUPER_ADMIN}/manufacturing/overview`,
  SUPER_ADMIN_MANUFACTURING_BOM:            `${BASE.SUPER_ADMIN}/manufacturing/bom`,
  SUPER_ADMIN_MANUFACTURING_WORK_ORDERS:    `${BASE.SUPER_ADMIN}/manufacturing/work-orders`,
  SUPER_ADMIN_MANUFACTURING_MACHINES:       `${BASE.SUPER_ADMIN}/manufacturing/machines`,
  SUPER_ADMIN_MANUFACTURING_QUALITY:        `${BASE.SUPER_ADMIN}/manufacturing/quality`,

  // Finance
  SUPER_ADMIN_FINANCE:                      `${BASE.SUPER_ADMIN}/finance`,
  SUPER_ADMIN_FINANCE_OVERVIEW:             `${BASE.SUPER_ADMIN}/finance/overview`,
  SUPER_ADMIN_FINANCE_LEDGER:               `${BASE.SUPER_ADMIN}/finance/ledger`,
  SUPER_ADMIN_FINANCE_JOURNAL:              `${BASE.SUPER_ADMIN}/finance/journal`,
  SUPER_ADMIN_FINANCE_EXPENSES:             `${BASE.SUPER_ADMIN}/finance/expenses`,
  SUPER_ADMIN_FINANCE_ALERTS:               `${BASE.SUPER_ADMIN}/finance/alerts`,
  SUPER_ADMIN_FINANCE_INCOME:               `${BASE.SUPER_ADMIN}/finance/income`,
  SUPER_ADMIN_FINANCE_TAX:                  `${BASE.SUPER_ADMIN}/finance/tax`,
  SUPER_ADMIN_FINANCE_GST:                  `${BASE.SUPER_ADMIN}/finance/gst`,
  SUPER_ADMIN_FINANCE_BALANCE_SHEET:        `${BASE.SUPER_ADMIN}/finance/balance-sheet`,

  // HR
  SUPER_ADMIN_HR:                           `${BASE.SUPER_ADMIN}/hr`,
  SUPER_ADMIN_HR_OVERVIEW:                  `${BASE.SUPER_ADMIN}/hr/overview`,
  SUPER_ADMIN_HR_EMPLOYEES:                 `${BASE.SUPER_ADMIN}/hr/employees`,
  SUPER_ADMIN_HR_ATTENDANCE:                `${BASE.SUPER_ADMIN}/hr/attendance`,
  SUPER_ADMIN_HR_LEAVE:                     `${BASE.SUPER_ADMIN}/hr/leave`,
  SUPER_ADMIN_HR_PAYROLL:                   `${BASE.SUPER_ADMIN}/hr/payroll`,
  SUPER_ADMIN_HR_PERFORMANCE:               `${BASE.SUPER_ADMIN}/hr/performance`,

  // Projects
  SUPER_ADMIN_PROJECTS:                     `${BASE.SUPER_ADMIN}/projects`,
  SUPER_ADMIN_PROJECTS_OVERVIEW:            `${BASE.SUPER_ADMIN}/projects/overview`,
  SUPER_ADMIN_PROJECTS_PLANNING:            `${BASE.SUPER_ADMIN}/projects/planning`,
  SUPER_ADMIN_PROJECTS_TASKS:               `${BASE.SUPER_ADMIN}/projects/tasks`,
  SUPER_ADMIN_PROJECTS_TIME_TRACKING:       `${BASE.SUPER_ADMIN}/projects/time-tracking`,
  SUPER_ADMIN_PROJECTS_BUDGET:              `${BASE.SUPER_ADMIN}/projects/budget`,
  SUPER_ADMIN_PROJECTS_DOCUMENTS:           `${BASE.SUPER_ADMIN}/projects/documents`,

  // Documents
  SUPER_ADMIN_DOCUMENTS:                    `${BASE.SUPER_ADMIN}/documents`,
  SUPER_ADMIN_DOCUMENTS_OVERVIEW:           `${BASE.SUPER_ADMIN}/documents/overview`,
  SUPER_ADMIN_DOCUMENTS_UPLOAD:             `${BASE.SUPER_ADMIN}/documents/upload`,
  SUPER_ADMIN_DOCUMENTS_VERSION_CONTROL:    `${BASE.SUPER_ADMIN}/documents/version-control`,
  SUPER_ADMIN_DOCUMENTS_APPROVALS:          `${BASE.SUPER_ADMIN}/documents/approvals`,
  SUPER_ADMIN_DOCUMENTS_SEARCH:             `${BASE.SUPER_ADMIN}/documents/search`,

  // Reports
  SUPER_ADMIN_REPORTS:                      `${BASE.SUPER_ADMIN}/reports`,
  SUPER_ADMIN_REPORTS_OVERVIEW:             `${BASE.SUPER_ADMIN}/reports/overview`,
  SUPER_ADMIN_REPORTS_SALES:                `${BASE.SUPER_ADMIN}/reports/sales`,
  SUPER_ADMIN_REPORTS_PURCHASE:             `${BASE.SUPER_ADMIN}/reports/purchase`,
  SUPER_ADMIN_REPORTS_INVENTORY:            `${BASE.SUPER_ADMIN}/reports/inventory`,
  SUPER_ADMIN_REPORTS_FINANCE:              `${BASE.SUPER_ADMIN}/reports/finance`,
  SUPER_ADMIN_REPORTS_HR:                   `${BASE.SUPER_ADMIN}/reports/hr`,
  SUPER_ADMIN_REPORTS_PROJECTS:             `${BASE.SUPER_ADMIN}/reports/projects`,

  // Settings
  SUPER_ADMIN_SETTINGS:                     `${BASE.SUPER_ADMIN}/settings`,
  SUPER_ADMIN_SETTINGS_GENERAL:             `${BASE.SUPER_ADMIN}/settings/general`,
  SUPER_ADMIN_SETTINGS_USERS:               `${BASE.SUPER_ADMIN}/settings/users`,
  SUPER_ADMIN_SETTINGS_ROLES:               `${BASE.SUPER_ADMIN}/settings/roles`,
  SUPER_ADMIN_SETTINGS_NOTIFICATIONS:       `${BASE.SUPER_ADMIN}/settings/notifications`,
  SUPER_ADMIN_SETTINGS_INTEGRATIONS:        `${BASE.SUPER_ADMIN}/settings/integrations`,
  SUPER_ADMIN_SETTINGS_APPROVALS:           `${BASE.SUPER_ADMIN}/settings/approvals`,
  SUPER_ADMIN_SETTINGS_BACKUP:              `${BASE.SUPER_ADMIN}/settings/backup`,

  // AI
  SUPER_ADMIN_AI:                           `${BASE.SUPER_ADMIN}/ai`,
  SUPER_ADMIN_AI_BUSINESS_ASSISTANT:        `${BASE.SUPER_ADMIN}/ai/business-assistant`,
  SUPER_ADMIN_AI_ANALYTICS:                 `${BASE.SUPER_ADMIN}/ai/analytics`,
  SUPER_ADMIN_AI_FORECASTING:               `${BASE.SUPER_ADMIN}/ai/forecasting`,
  SUPER_ADMIN_AI_DOCUMENT_PROCESSING:       `${BASE.SUPER_ADMIN}/ai/document-processing`,
  SUPER_ADMIN_AI_WORKFLOW_AUTOMATION:       `${BASE.SUPER_ADMIN}/ai/workflow-automation`,
  SUPER_ADMIN_AI_FRAUD_DETECTION:           `${BASE.SUPER_ADMIN}/ai/fraud-detection`,
  SUPER_ADMIN_AI_CHATBOT:                   `${BASE.SUPER_ADMIN}/ai/chatbot`,
  SUPER_ADMIN_AI_REPORT_GENERATOR:          `${BASE.SUPER_ADMIN}/ai/report-generator`,

  // ══════════════════════════════════════════════════════════════════════════════
  // ADMIN
  // ══════════════════════════════════════════════════════════════════════════════
  ADMIN:                                    BASE.ADMIN,
  ADMIN_DASHBOARD:                          `${BASE.ADMIN}/dashboard`,

  // Company
  ADMIN_COMPANY:                            `${BASE.ADMIN}/company`,
  ADMIN_COMPANY_OVERVIEW:                   `${BASE.ADMIN}/company/overview`,
  ADMIN_COMPANY_PROFILE:                    `${BASE.ADMIN}/company/profile`,
  ADMIN_COMPANY_BRANCHES:                   `${BASE.ADMIN}/company/branches`,
  ADMIN_COMPANY_DEPARTMENTS:                `${BASE.ADMIN}/company/departments`,
  ADMIN_COMPANY_COST_CENTERS:               `${BASE.ADMIN}/company/cost-centers`,
  ADMIN_COMPANY_ORG_CHART:                  `${BASE.ADMIN}/company/org-chart`,
  ADMIN_COMPANY_USERS:                      `${BASE.ADMIN}/company/users`,
  ADMIN_COMPANY_ROLES:                      `${BASE.ADMIN}/company/roles`,
  ADMIN_COMPANY_APPROVAL_WORKFLOWS:         `${BASE.ADMIN}/company/approval-workflows`,
  ADMIN_COMPANY_SETTINGS:                   `${BASE.ADMIN}/company/settings`,
  ADMIN_COMPANY_BRANCH_SETTINGS:            `${BASE.ADMIN}/company/branch-settings`,
  ADMIN_COMPANY_HOLIDAYS:                   `${BASE.ADMIN}/company/holidays`,
  ADMIN_COMPANY_SUBSCRIPTION:               `${BASE.ADMIN}/company/subscription`,

  // CRM
  ADMIN_CRM:                                `${BASE.ADMIN}/crm`,
  ADMIN_CRM_OVERVIEW:                       `${BASE.ADMIN}/crm/overview`,
  ADMIN_CRM_LEADS:                          `${BASE.ADMIN}/crm/leads`,
  ADMIN_CRM_CUSTOMERS:                      `${BASE.ADMIN}/crm/customers`,
  ADMIN_CRM_PIPELINE:                       `${BASE.ADMIN}/crm/pipeline`,
  ADMIN_CRM_FOLLOW_UPS:                     `${BASE.ADMIN}/crm/follow-ups`,
  ADMIN_CRM_COMMUNICATION:                  `${BASE.ADMIN}/crm/communication`,

  // Sales
  ADMIN_SALES:                              `${BASE.ADMIN}/sales`,
  ADMIN_SALES_OVERVIEW:                     `${BASE.ADMIN}/sales/overview`,
  ADMIN_SALES_QUOTATIONS:                   `${BASE.ADMIN}/sales/quotations`,
  ADMIN_SALES_ORDERS:                       `${BASE.ADMIN}/sales/orders`,
  ADMIN_SALES_INVOICES:                     `${BASE.ADMIN}/sales/invoices`,
  ADMIN_SALES_ANALYTICS:                    `${BASE.ADMIN}/sales/analytics`,
  ADMIN_SALES_PAYMENTS:                     `${BASE.ADMIN}/sales/payments`,
  ADMIN_SALES_CUSTOMER_REPORTS:             `${BASE.ADMIN}/sales/customer-reports`,

  // Purchase
  ADMIN_PURCHASE:                           `${BASE.ADMIN}/purchase`,
  ADMIN_PURCHASE_OVERVIEW:                  `${BASE.ADMIN}/purchase/overview`,
  ADMIN_PURCHASE_VENDORS:                   `${BASE.ADMIN}/purchase/vendors`,
  ADMIN_PURCHASE_REQUESTS:                  `${BASE.ADMIN}/purchase/requests`,
  ADMIN_PURCHASE_ORDERS:                    `${BASE.ADMIN}/purchase/orders`,
  ADMIN_PURCHASE_GOODS_RECEIPTS:            `${BASE.ADMIN}/purchase/goods-receipts`,
  ADMIN_PURCHASE_PAYMENTS:                  `${BASE.ADMIN}/purchase/payments`,
  ADMIN_PURCHASE_PAYABLES_AGING:            `${BASE.ADMIN}/purchase/payables-aging`,

  // Inventory
  ADMIN_INVENTORY:                          `${BASE.ADMIN}/inventory`,
  ADMIN_INVENTORY_OVERVIEW:                 `${BASE.ADMIN}/inventory/overview`,
  ADMIN_INVENTORY_STOCK:                    `${BASE.ADMIN}/inventory/stock`,
  ADMIN_INVENTORY_WAREHOUSES:               `${BASE.ADMIN}/inventory/warehouses`,
  ADMIN_INVENTORY_BATCH_TRACKING:           `${BASE.ADMIN}/inventory/batch-tracking`,
  ADMIN_INVENTORY_BARCODE:                  `${BASE.ADMIN}/inventory/barcode`,
  ADMIN_INVENTORY_TRANSFERS:                `${BASE.ADMIN}/inventory/transfers`,

  // Manufacturing
  ADMIN_MANUFACTURING:                      `${BASE.ADMIN}/manufacturing`,
  ADMIN_MANUFACTURING_OVERVIEW:             `${BASE.ADMIN}/manufacturing/overview`,
  ADMIN_MANUFACTURING_BOM:                  `${BASE.ADMIN}/manufacturing/bom`,
  ADMIN_MANUFACTURING_WORK_ORDERS:          `${BASE.ADMIN}/manufacturing/work-orders`,
  ADMIN_MANUFACTURING_MACHINES:             `${BASE.ADMIN}/manufacturing/machines`,
  ADMIN_MANUFACTURING_QUALITY:              `${BASE.ADMIN}/manufacturing/quality`,

  // Finance
  ADMIN_FINANCE:                            `${BASE.ADMIN}/finance`,
  ADMIN_FINANCE_OVERVIEW:                   `${BASE.ADMIN}/finance/overview`,
  ADMIN_FINANCE_LEDGER:                     `${BASE.ADMIN}/finance/ledger`,
  ADMIN_FINANCE_JOURNAL:                    `${BASE.ADMIN}/finance/journal`,
  ADMIN_FINANCE_EXPENSES:                   `${BASE.ADMIN}/finance/expenses`,
  ADMIN_FINANCE_ALERTS:                     `${BASE.ADMIN}/finance/alerts`,
  ADMIN_FINANCE_INCOME:                     `${BASE.ADMIN}/finance/income`,
  ADMIN_FINANCE_TAX:                        `${BASE.ADMIN}/finance/tax`,
  ADMIN_FINANCE_GST:                        `${BASE.ADMIN}/finance/gst`,
  ADMIN_FINANCE_BALANCE_SHEET:              `${BASE.ADMIN}/finance/balance-sheet`,

  // HR
  ADMIN_HR:                                 `${BASE.ADMIN}/hr`,
  ADMIN_HR_OVERVIEW:                        `${BASE.ADMIN}/hr/overview`,
  ADMIN_HR_EMPLOYEES:                       `${BASE.ADMIN}/hr/employees`,
  ADMIN_HR_ATTENDANCE:                      `${BASE.ADMIN}/hr/attendance`,
  ADMIN_HR_LEAVE:                           `${BASE.ADMIN}/hr/leave`,
  ADMIN_HR_PAYROLL:                         `${BASE.ADMIN}/hr/payroll`,
  ADMIN_HR_PERFORMANCE:                     `${BASE.ADMIN}/hr/performance`,

  // Projects
  ADMIN_PROJECTS:                           `${BASE.ADMIN}/projects`,
  ADMIN_PROJECTS_OVERVIEW:                  `${BASE.ADMIN}/projects/overview`,
  ADMIN_PROJECTS_PLANNING:                  `${BASE.ADMIN}/projects/planning`,
  ADMIN_PROJECTS_TASKS:                     `${BASE.ADMIN}/projects/tasks`,
  ADMIN_PROJECTS_TIME_TRACKING:             `${BASE.ADMIN}/projects/time-tracking`,
  ADMIN_PROJECTS_BUDGET:                    `${BASE.ADMIN}/projects/budget`,
  ADMIN_PROJECTS_DOCUMENTS:                 `${BASE.ADMIN}/projects/documents`,

  // Documents
  ADMIN_DOCUMENTS:                          `${BASE.ADMIN}/documents`,
  ADMIN_DOCUMENTS_OVERVIEW:                 `${BASE.ADMIN}/documents/overview`,
  ADMIN_DOCUMENTS_UPLOAD:                   `${BASE.ADMIN}/documents/upload`,
  ADMIN_DOCUMENTS_VERSION_CONTROL:          `${BASE.ADMIN}/documents/version-control`,
  ADMIN_DOCUMENTS_APPROVALS:                `${BASE.ADMIN}/documents/approvals`,
  ADMIN_DOCUMENTS_SEARCH:                   `${BASE.ADMIN}/documents/search`,

  // Reports
  ADMIN_REPORTS:                            `${BASE.ADMIN}/reports`,
  ADMIN_REPORTS_OVERVIEW:                   `${BASE.ADMIN}/reports/overview`,
  ADMIN_REPORTS_SALES:                      `${BASE.ADMIN}/reports/sales`,
  ADMIN_REPORTS_PURCHASE:                   `${BASE.ADMIN}/reports/purchase`,
  ADMIN_REPORTS_INVENTORY:                  `${BASE.ADMIN}/reports/inventory`,
  ADMIN_REPORTS_FINANCE:                    `${BASE.ADMIN}/reports/finance`,
  ADMIN_REPORTS_HR:                         `${BASE.ADMIN}/reports/hr`,
  ADMIN_REPORTS_PROJECTS:                   `${BASE.ADMIN}/reports/projects`,

  // Settings
  ADMIN_SETTINGS:                           `${BASE.ADMIN}/settings`,
  ADMIN_SETTINGS_GENERAL:                   `${BASE.ADMIN}/settings/general`,
  ADMIN_SETTINGS_USERS:                     `${BASE.ADMIN}/settings/users`,
  ADMIN_SETTINGS_ROLES:                     `${BASE.ADMIN}/settings/roles`,
  ADMIN_SETTINGS_NOTIFICATIONS:             `${BASE.ADMIN}/settings/notifications`,
  ADMIN_SETTINGS_INTEGRATIONS:              `${BASE.ADMIN}/settings/integrations`,
  ADMIN_SETTINGS_APPROVALS:                 `${BASE.ADMIN}/settings/approvals`,
  ADMIN_SETTINGS_BACKUP:                    `${BASE.ADMIN}/settings/backup`,

  // AI
  ADMIN_AI:                                 `${BASE.ADMIN}/ai`,
  ADMIN_AI_BUSINESS_ASSISTANT:              `${BASE.ADMIN}/ai/business-assistant`,
  ADMIN_AI_ANALYTICS:                       `${BASE.ADMIN}/ai/analytics`,
  ADMIN_AI_FORECASTING:                     `${BASE.ADMIN}/ai/forecasting`,
  ADMIN_AI_DOCUMENT_PROCESSING:             `${BASE.ADMIN}/ai/document-processing`,
  ADMIN_AI_WORKFLOW_AUTOMATION:             `${BASE.ADMIN}/ai/workflow-automation`,
  ADMIN_AI_FRAUD_DETECTION:                 `${BASE.ADMIN}/ai/fraud-detection`,
  ADMIN_AI_CHATBOT:                         `${BASE.ADMIN}/ai/chatbot`,
  ADMIN_AI_REPORT_GENERATOR:                `${BASE.ADMIN}/ai/report-generator`,

  // ══════════════════════════════════════════════════════════════════════════════
  // FINANCE MANAGER
  // ══════════════════════════════════════════════════════════════════════════════
  FINANCE_MANAGER:                          BASE.FINANCE_MANAGER,
  FINANCE_MANAGER_DASHBOARD:                `${BASE.FINANCE_MANAGER}/dashboard`,
  FINANCE_MANAGER_FINANCE:                  `${BASE.FINANCE_MANAGER}/finance`,
  FINANCE_MANAGER_FINANCE_OVERVIEW:         `${BASE.FINANCE_MANAGER}/finance/overview`,
  FINANCE_MANAGER_FINANCE_LEDGER:           `${BASE.FINANCE_MANAGER}/finance/ledger`,
  FINANCE_MANAGER_FINANCE_JOURNAL:          `${BASE.FINANCE_MANAGER}/finance/journal`,
  FINANCE_MANAGER_FINANCE_EXPENSES:         `${BASE.FINANCE_MANAGER}/finance/expenses`,
  FINANCE_MANAGER_FINANCE_ALERTS:           `${BASE.FINANCE_MANAGER}/finance/alerts`,
  FINANCE_MANAGER_FINANCE_INCOME:           `${BASE.FINANCE_MANAGER}/finance/income`,
  FINANCE_MANAGER_FINANCE_TAX:              `${BASE.FINANCE_MANAGER}/finance/tax`,
  FINANCE_MANAGER_FINANCE_GST:              `${BASE.FINANCE_MANAGER}/finance/gst`,
  FINANCE_MANAGER_FINANCE_BALANCE_SHEET:    `${BASE.FINANCE_MANAGER}/finance/balance-sheet`,
  FINANCE_MANAGER_REPORTS:                  `${BASE.FINANCE_MANAGER}/reports`,
  FINANCE_MANAGER_AI:                       `${BASE.FINANCE_MANAGER}/ai`,
  FINANCE_MANAGER_SETTINGS:                 `${BASE.FINANCE_MANAGER}/settings`,

  // ══════════════════════════════════════════════════════════════════════════════
  // SALES MANAGER
  // ══════════════════════════════════════════════════════════════════════════════
  SALES_MANAGER:                            BASE.SALES_MANAGER,
  SALES_MANAGER_DASHBOARD:                  `${BASE.SALES_MANAGER}/dashboard`,
  SALES_MANAGER_CRM:                        `${BASE.SALES_MANAGER}/crm`,
  SALES_MANAGER_CRM_LEADS:                  `${BASE.SALES_MANAGER}/crm/leads`,
  SALES_MANAGER_CRM_CUSTOMERS:              `${BASE.SALES_MANAGER}/crm/customers`,
  SALES_MANAGER_CRM_PIPELINE:               `${BASE.SALES_MANAGER}/crm/pipeline`,
  SALES_MANAGER_SALES:                      `${BASE.SALES_MANAGER}/sales`,
  SALES_MANAGER_SALES_QUOTATIONS:           `${BASE.SALES_MANAGER}/sales/quotations`,
  SALES_MANAGER_SALES_ORDERS:               `${BASE.SALES_MANAGER}/sales/orders`,
  SALES_MANAGER_SALES_INVOICES:             `${BASE.SALES_MANAGER}/sales/invoices`,
  SALES_MANAGER_REPORTS:                    `${BASE.SALES_MANAGER}/reports`,
  SALES_MANAGER_AI:                         `${BASE.SALES_MANAGER}/ai`,
  SALES_MANAGER_SETTINGS:                   `${BASE.SALES_MANAGER}/settings`,

  // ══════════════════════════════════════════════════════════════════════════════
  // HR MANAGER
  // ══════════════════════════════════════════════════════════════════════════════
  HR_MANAGER:                               BASE.HR_MANAGER,
  HR_MANAGER_DASHBOARD:                     `${BASE.HR_MANAGER}/dashboard`,
  HR_MANAGER_HR:                            `${BASE.HR_MANAGER}/hr`,
  HR_MANAGER_HR_OVERVIEW:                   `${BASE.HR_MANAGER}/hr/overview`,
  HR_MANAGER_HR_EMPLOYEES:                  `${BASE.HR_MANAGER}/hr/employees`,
  HR_MANAGER_HR_ATTENDANCE:                 `${BASE.HR_MANAGER}/hr/attendance`,
  HR_MANAGER_HR_LEAVE:                      `${BASE.HR_MANAGER}/hr/leave`,
  HR_MANAGER_HR_PAYROLL:                    `${BASE.HR_MANAGER}/hr/payroll`,
  HR_MANAGER_HR_PERFORMANCE:                `${BASE.HR_MANAGER}/hr/performance`,
  HR_MANAGER_REPORTS:                       `${BASE.HR_MANAGER}/reports`,
  HR_MANAGER_AI:                            `${BASE.HR_MANAGER}/ai`,
  HR_MANAGER_SETTINGS:                      `${BASE.HR_MANAGER}/settings`,

  // ══════════════════════════════════════════════════════════════════════════════
  // OPERATIONS MANAGER
  // ══════════════════════════════════════════════════════════════════════════════
  OPERATIONS_MANAGER:                       BASE.OPERATIONS_MANAGER,
  OPERATIONS_MANAGER_DASHBOARD:             `${BASE.OPERATIONS_MANAGER}/dashboard`,
  OPERATIONS_MANAGER_INVENTORY:             `${BASE.OPERATIONS_MANAGER}/inventory`,
  OPERATIONS_MANAGER_INVENTORY_STOCK:       `${BASE.OPERATIONS_MANAGER}/inventory/stock`,
  OPERATIONS_MANAGER_INVENTORY_WAREHOUSES:  `${BASE.OPERATIONS_MANAGER}/inventory/warehouses`,
  OPERATIONS_MANAGER_MANUFACTURING:         `${BASE.OPERATIONS_MANAGER}/manufacturing`,
  OPERATIONS_MANAGER_MANUFACTURING_BOM:     `${BASE.OPERATIONS_MANAGER}/manufacturing/bom`,
  OPERATIONS_MANAGER_MANUFACTURING_WORK_ORDERS: `${BASE.OPERATIONS_MANAGER}/manufacturing/work-orders`,
  OPERATIONS_MANAGER_PURCHASE:              `${BASE.OPERATIONS_MANAGER}/purchase`,
  OPERATIONS_MANAGER_PROJECTS:              `${BASE.OPERATIONS_MANAGER}/projects`,
  OPERATIONS_MANAGER_REPORTS:               `${BASE.OPERATIONS_MANAGER}/reports`,
  OPERATIONS_MANAGER_AI:                    `${BASE.OPERATIONS_MANAGER}/ai`,
  OPERATIONS_MANAGER_SETTINGS:              `${BASE.OPERATIONS_MANAGER}/settings`,

  // ══════════════════════════════════════════════════════════════════════════════
  // EMPLOYEE
  // ══════════════════════════════════════════════════════════════════════════════
  EMPLOYEE:                                 BASE.EMPLOYEE,
  EMPLOYEE_DASHBOARD:                       `${BASE.EMPLOYEE}/dashboard`,
  EMPLOYEE_PROFILE:                         `${BASE.EMPLOYEE}/profile`,
  EMPLOYEE_ATTENDANCE:                      `${BASE.EMPLOYEE}/attendance`,
  EMPLOYEE_LEAVE:                           `${BASE.EMPLOYEE}/leave`,
  EMPLOYEE_PAYROLL:                         `${BASE.EMPLOYEE}/payroll`,
  EMPLOYEE_TASKS:                           `${BASE.EMPLOYEE}/tasks`,
  EMPLOYEE_DOCUMENTS:                       `${BASE.EMPLOYEE}/documents`,
  EMPLOYEE_NOTIFICATIONS:                   `${BASE.EMPLOYEE}/notifications`,
}

export default ROUTES
