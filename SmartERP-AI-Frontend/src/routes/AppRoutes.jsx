import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ROUTES } from '../core/constants/routes.constant'

// ─── Layouts ──────────────────────────────────────────────────────────────────
import DashboardLayout from '../layouts/DashboardLayout'
import AuthLayout      from '../layouts/AuthLayout'
import PublicLayout    from '../layouts/PublicLayout'
import ProtectedRoute  from './ProtectedRoute'
import RoleRedirect    from './RoleRedirect'
import Dashboard from "../pages/modules/companyManagement/Dashboard";

/* ========================================================================== */
/*  AUTH pages (eager — tiny, needed immediately)                              */
/* ========================================================================== */
import Login          from '../pages/auth/Login'
import Signup         from '../pages/auth/Signup'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword  from '../pages/auth/ResetPassword'
import VerifyOtp      from '../pages/auth/VerifyOtp'

/* ========================================================================== */
/*  PUBLIC pages (eager — landing is the first paint)                          */
/* ========================================================================== */
import Home  from '../pages/public/Home'
import Pricing  from '../pages/public/Pricing' 
import AboutUs  from '../pages/public/AboutUs'
import ContactUs from '../pages/public/ContactUs'
import NotFound from '../pages/public/NotFound'

/* ========================================================================== */
/*  ROLE DASHBOARDS (eager — first paint after login)                          */
/* ========================================================================== */
import SuperAdminDashboardPage  from '../pages/dashboard/SuperAdminDashboard'
import AdminDashboardPage       from '../pages/dashboard/AdminDashboard'
import FinanceDashboardPage     from '../pages/dashboard/FinanceDashboard'
import SalesDashboardPage       from '../pages/dashboard/SalesDashboard'
import HRDashboardPage          from '../pages/dashboard/HRDashboard'
import OperationsDashboardPage  from '../pages/dashboard/OperationsDashboard'
import EmployeeDashboardPage    from '../pages/dashboard/EmployeeDashboard'

/* ========================================================================== */
/*  SUPER-ADMIN platform pages (eager)                                         */
/* ========================================================================== */
import Tenants           from '../pages/superAdmin/Tenants'
import TenantDetails     from '../pages/superAdmin/TenantDetails'
import SubscriptionPlans from '../pages/superAdmin/SubscriptionPlans'
import PlatformSettings  from '../pages/superAdmin/PlatformSettings'
import PlatformUsers     from '../pages/superAdmin/PlatformUsers'
import CashFlow from '../pages/modules/finance/CashFlow'

/* ========================================================================== */
/*  LAZY — shared business modules (one chunk per module)                      */
/* ========================================================================== */

// Company Management
const CompanyDashboard     = lazy(() => import('../pages/modules/companyManagement/Dashboard'))
const CompanyOverview      = lazy(() => import('../pages/modules/companyManagement/Overview'))
const CompanyProfile       = lazy(() => import('../pages/modules/companyManagement/CompanyProfile'))
const Branches             = lazy(() => import('../pages/modules/companyManagement/Branches'))
const Departments          = lazy(() => import('../pages/modules/companyManagement/Departments'))
const CostCenters          = lazy(() => import('../pages/modules/companyManagement/CostCenters'))
const OrganizationChart    = lazy(() => import('../pages/modules/companyManagement/OrganizationChart'))
const CompanyUsers         = lazy(() => import('../pages/modules/companyManagement/Users'))
const CompanyRoles         = lazy(() => import('../pages/modules/companyManagement/RolesPermissions'))
const ApprovalWorkflows    = lazy(() => import('../pages/modules/companyManagement/ApprovalWorkflows'))
const CompanySettings      = lazy(() => import('../pages/modules/companyManagement/CompanySettings'))
const BranchSettings       = lazy(() => import('../pages/modules/companyManagement/BranchSettings'))
const Holidays             = lazy(() => import('../pages/modules/companyManagement/Holidays'))
const Subscription         = lazy(() => import('../pages/modules/companyManagement/Subscription'))

// CRM
const CrmDashboard         = lazy(() => import('../pages/modules/crm/Dashboard'))
const CrmOverview          = lazy(() => import('../pages/modules/crm/Overview'))
const Leads                = lazy(() => import('../pages/modules/crm/Leads'))
const Customers            = lazy(() => import('../pages/modules/crm/Customers'))
const SalesPipeline        = lazy(() => import('../pages/modules/crm/SalesPipeline'))
const FollowUps            = lazy(() => import('../pages/modules/crm/FollowUps'))
const CommunicationHistory = lazy(() => import('../pages/modules/crm/CommunicationHistory'))

// Sales
const SalesDashboard       = lazy(() => import('../pages/modules/sales/Dashboard'))
const SalesOverview        = lazy(() => import('../pages/modules/sales/Overview'))
const Quotations           = lazy(() => import('../pages/modules/sales/Quotations'))
const SalesOrders          = lazy(() => import('../pages/modules/sales/SalesOrders'))
const Invoices             = lazy(() => import('../pages/modules/sales/Invoices'))
const Analytics            = lazy(() => import('../pages/modules/sales/Analytics'))
const CustomerReports      = lazy(() => import('../pages/modules/sales/CustomerReports'))

// Purchase
const PurchaseDashboard    = lazy(() => import('../pages/modules/purchase/Dashboard'))
const PurchaseOverview     = lazy(() => import('../pages/modules/purchase/Overview'))
const Vendors              = lazy(() => import('../pages/modules/purchase/Vendors'))
const PurchaseRequests     = lazy(() => import('../pages/modules/purchase/PurchaseRequests'))
const PurchaseOrders       = lazy(() => import('../pages/modules/purchase/PurchaseOrders'))
const GoodsReceipts        = lazy(() => import('../pages/modules/purchase/GoodsReceipts'))
const SupplierPayments     = lazy(() => import('../pages/modules/purchase/SupplierPayments'))
const PayablesAging        = lazy(() => import('../pages/modules/purchase/PayablesAging'))

// Inventory
const InventoryDashboard   = lazy(() => import('../pages/modules/inventory/Dashboard'))
const InventoryOverview    = lazy(() => import('../pages/modules/inventory/Overview'))
const Stock                = lazy(() => import('../pages/modules/inventory/Stock'))
const Warehouses           = lazy(() => import('../pages/modules/inventory/Warehouses'))
const BatchLotTracking     = lazy(() => import('../pages/modules/inventory/BatchLotTracking'))
const BarcodeQrManagement  = lazy(() => import('../pages/modules/inventory/BarcodeQrManagement'))
const StockTransfers       = lazy(() => import('../pages/modules/inventory/StockTransfers'))

// Manufacturing
const ManufacturingDashboard = lazy(() => import('../pages/modules/manufacturing/Dashboard'))
const ManufacturingOverview  = lazy(() => import('../pages/modules/manufacturing/Overview'))
const BillOfMaterials        = lazy(() => import('../pages/modules/manufacturing/BillOfMaterials'))
const WorkOrders             = lazy(() => import('../pages/modules/manufacturing/WorkOrders'))
const MachineTracking        = lazy(() => import('../pages/modules/manufacturing/MachineTracking'))
const QualityControl         = lazy(() => import('../pages/modules/manufacturing/QualityControl'))

// Finance & Accounts
const FinanceDashboard     = lazy(() => import('../pages/modules/finance/Dashboard'))
const FinanceOverview      = lazy(() => import('../pages/modules/finance/ProfitLoss'))
const GeneralLedger        = lazy(() => import('../pages/modules/finance/GeneralLedger'))
const JournalEntries       = lazy(() => import('../pages/modules/finance/JournalEntries'))
const ExpenseTracking      = lazy(() => import('../pages/modules/finance/ExpenseTracking'))
const Alerts               = lazy(() => import('../pages/modules/finance/Alerts'))
const TaxManagement        = lazy(() => import('../pages/modules/finance/TaxManagement'))
const GstReports           = lazy(() => import('../pages/modules/finance/CashFlow'))
const BalanceSheet         = lazy(() => import('../pages/modules/finance/BalanceSheet'))

// HR & Payroll
const HrDashboard          = lazy(() => import('../pages/modules/hr/Dashboard'))
const HrOverview           = lazy(() => import('../pages/modules/hr/Overview'))
const EmployeeDatabase     = lazy(() => import('../pages/modules/hr/EmployeeDatabase'))
const Attendance           = lazy(() => import('../pages/modules/hr/Attendance'))
const LeaveManagement      = lazy(() => import('../pages/modules/hr/LeaveManagement'))
const Payroll              = lazy(() => import('../pages/modules/hr/Payroll'))
const PerformanceTracking  = lazy(() => import('../pages/modules/hr/PerformanceTracking'))

// Projects
const ProjectsDashboard    = lazy(() => import('../pages/modules/projects/Dashboard'))
const ProjectsOverview     = lazy(() => import('../pages/modules/projects/Overview'))
const ProjectPlanning      = lazy(() => import('../pages/modules/projects/ProjectPlanning'))
const Tasks                = lazy(() => import('../pages/modules/projects/Tasks'))
const TimeTracking         = lazy(() => import('../pages/modules/projects/TimeTracking'))
const BudgetMonitoring     = lazy(() => import('../pages/modules/projects/BudgetMonitoring'))
const ProjectDocuments     = lazy(() => import('../pages/modules/projects/ProjectDocuments'))

// Reports & Analytics
const ReportsDashboard     = lazy(() => import('../pages/modules/reports/Dashboard'))
const ReportsOverview      = lazy(() => import('../pages/modules/reports/Overview'))
const SalesReports         = lazy(() => import('../pages/modules/reports/SalesReports'))
const PurchaseReports      = lazy(() => import('../pages/modules/reports/PurchaseReports'))
const InventoryReports     = lazy(() => import('../pages/modules/reports/InventoryReports'))
const FinanceReports       = lazy(() => import('../pages/modules/reports/FinanceReports'))
const HrReports            = lazy(() => import('../pages/modules/reports/HrReports'))
const ProjectReports       = lazy(() => import('../pages/modules/reports/ProjectReports'))

// Documents
const DocumentsDashboard   = lazy(() => import('../pages/modules/documents/Dashboard'))
const DocumentsOverview    = lazy(() => import('../pages/modules/documents/Overview'))
const UploadDocuments      = lazy(() => import('../pages/modules/documents/UploadDocuments'))
const VersionControl       = lazy(() => import('../pages/modules/documents/VersionControl'))
const DigitalApprovals     = lazy(() => import('../pages/modules/documents/DigitalApprovals'))
const DocumentSearch       = lazy(() => import('../pages/modules/documents/DocumentSearch'))

// Settings
const SettingsDashboard          = lazy(() => import('../pages/modules/settings/Dashboard'))
const SettingsOverview           = lazy(() => import('../pages/modules/settings/Overview'))
const GeneralSettings            = lazy(() => import('../pages/modules/settings/GeneralSettings'))
const UserManagement             = lazy(() => import('../pages/modules/settings/UserManagement'))
const SettingsRoles              = lazy(() => import('../pages/modules/settings/RolesPermissions'))
const NotificationSettings       = lazy(() => import('../pages/modules/settings/NotificationSettings'))
const IntegrationSettings        = lazy(() => import('../pages/modules/settings/IntegrationSettings'))
const ApprovalWorkflowSettings   = lazy(() => import('../pages/modules/settings/ApprovalWorkflowSettings'))
const BackupSecurity             = lazy(() => import('../pages/modules/settings/BackupSecurity'))

// AI Assistant
const BusinessAssistant    = lazy(() => import('../pages/modules/aiAssistant/BusinessAssistant'))
const DashboardAnalytics   = lazy(() => import('../pages/modules/aiAssistant/DashboardAnalytics'))
const ForecastingEngine    = lazy(() => import('../pages/modules/aiAssistant/ForecastingEngine'))
const DocumentProcessing   = lazy(() => import('../pages/modules/aiAssistant/DocumentProcessing'))
const WorkflowAutomation   = lazy(() => import('../pages/modules/aiAssistant/WorkflowAutomation'))
const FraudDetection       = lazy(() => import('../pages/modules/aiAssistant/FraudDetection'))
const SupportChatbot       = lazy(() => import('../pages/modules/aiAssistant/SupportChatbot'))
const ReportGenerator      = lazy(() => import('../pages/modules/aiAssistant/ReportGenerator'))

// Employee self-service — reuse HR module pages until dedicated pages are created
const EmployeeProfile       = lazy(() => import('../pages/modules/hr/EmployeeDatabase'))
const EmployeeAttendance    = lazy(() => import('../pages/modules/hr/Attendance'))
const EmployeeLeave         = lazy(() => import('../pages/modules/hr/LeaveManagement'))
const EmployeePayroll       = lazy(() => import('../pages/modules/hr/Payroll'))
const EmployeeTasks         = lazy(() => import('../pages/modules/projects/Tasks'))
const EmployeeDocuments     = lazy(() => import('../pages/modules/documents/Dashboard'))
const EmployeeNotifications = lazy(() => import('../pages/modules/settings/NotificationSettings'))

/* ========================================================================== */
/*  Loader                                                                     */
/* ========================================================================== */
const Loader = () => (
  <div className="flex items-center justify-center h-screen text-gray-500">
    Loading…
  </div>
)

/* ========================================================================== */
/*  AppRoutes                                                                  */
/* ========================================================================== */
const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>

        {/* ════════════════════════════════════════════════════════════════
            PUBLIC — marketing / landing pages
        ════════════════════════════════════════════════════════════════ */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME}     element={<Home/>} />
          <Route path={ROUTES.PRICING}  element={<Pricing />} />
          <Route path={ROUTES.ABOUT}    element={<AboutUs />} />
          <Route path={ROUTES.CONTACT}  element={<ContactUs />} />
        </Route>

        {/* ════════════════════════════════════════════════════════════════
            AUTH
        ════════════════════════════════════════════════════════════════ */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN}           element={<Login />} />
          <Route path={ROUTES.SIGNUP}          element={<Signup />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD}  element={<ResetPassword />} />
          <Route path={ROUTES.VERIFY_OTP}      element={<VerifyOtp />} />
        </Route>

        {/* /app → redirect to role dashboard */}
        <Route path={ROUTES.APP} element={<RoleRedirect />} />

        {/* ════════════════════════════════════════════════════════════════
            SUPER ADMIN
        ════════════════════════════════════════════════════════════════ */}
        <Route element={<ProtectedRoute allowedRoles={['superAdmin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.SUPER_ADMIN_DASHBOARD}   element={<SuperAdminDashboardPage />} />

            {/* Platform */}
            <Route path={ROUTES.SUPER_ADMIN_TENANTS}           element={<Tenants />} />
            <Route path={ROUTES.SUPER_ADMIN_TENANT_DETAIL}     element={<TenantDetails />} />
            <Route path={ROUTES.SUPER_ADMIN_SUBSCRIPTIONS}     element={<SubscriptionPlans />} />
            <Route path={ROUTES.SUPER_ADMIN_PLATFORM_USERS}    element={<PlatformUsers />} />
            <Route path={ROUTES.SUPER_ADMIN_PLATFORM_SETTINGS} element={<PlatformSettings />} />

            {/* Company */}
            <Route path={ROUTES.SUPER_ADMIN_COMPANY}                    element={<Dashboard/>} />
            <Route path={ROUTES.SUPER_ADMIN_COMPANY_OVERVIEW}           element={<Dashboard/>} />
            <Route path={ROUTES.SUPER_ADMIN_COMPANY_PROFILE}            element={<CompanyProfile />} />
            <Route path={ROUTES.SUPER_ADMIN_COMPANY_BRANCHES}           element={<Branches />} />
            <Route path={ROUTES.SUPER_ADMIN_COMPANY_DEPARTMENTS}        element={<Departments />} />
            <Route path={ROUTES.SUPER_ADMIN_COMPANY_COST_CENTERS}       element={<CostCenters />} />
            <Route path={ROUTES.SUPER_ADMIN_COMPANY_ORG_CHART}          element={<OrganizationChart />} />
            <Route path={ROUTES.SUPER_ADMIN_COMPANY_USERS}              element={<CompanyUsers />} />
            <Route path={ROUTES.SUPER_ADMIN_COMPANY_ROLES}              element={<CompanyRoles />} />
            <Route path={ROUTES.SUPER_ADMIN_COMPANY_APPROVAL_WORKFLOWS} element={<ApprovalWorkflows />} />
            <Route path={ROUTES.SUPER_ADMIN_COMPANY_SETTINGS}           element={<CompanySettings />} />
            <Route path={ROUTES.SUPER_ADMIN_COMPANY_BRANCH_SETTINGS}    element={<BranchSettings />} />
            <Route path={ROUTES.SUPER_ADMIN_COMPANY_HOLIDAYS}           element={<Holidays />} />
            <Route path={ROUTES.SUPER_ADMIN_COMPANY_SUBSCRIPTION}       element={<Subscription />} />

            {/* CRM */}
            <Route path={ROUTES.SUPER_ADMIN_CRM}               element={<CrmDashboard />} />
            <Route path={ROUTES.SUPER_ADMIN_CRM_OVERVIEW}      element={<CrmOverview />} />
            <Route path={ROUTES.SUPER_ADMIN_CRM_LEADS}         element={<Leads />} />
            <Route path={ROUTES.SUPER_ADMIN_CRM_CUSTOMERS}     element={<Customers />} />
            <Route path={ROUTES.SUPER_ADMIN_CRM_PIPELINE}      element={<SalesPipeline />} />
            <Route path={ROUTES.SUPER_ADMIN_CRM_FOLLOW_UPS}    element={<FollowUps />} />
            <Route path={ROUTES.SUPER_ADMIN_CRM_COMMUNICATION} element={<CommunicationHistory />} />

            {/* Sales */}
            <Route path={ROUTES.SUPER_ADMIN_SALES}                  element={<SalesDashboard />} />
            <Route path={ROUTES.SUPER_ADMIN_SALES_OVERVIEW}         element={<SalesOverview />} />
            <Route path={ROUTES.SUPER_ADMIN_SALES_QUOTATIONS}       element={<Quotations />} />
            <Route path={ROUTES.SUPER_ADMIN_SALES_ORDERS}           element={<SalesOrders />} />
            <Route path={ROUTES.SUPER_ADMIN_SALES_INVOICES}         element={<Invoices />} />
            <Route path={ROUTES.SUPER_ADMIN_SALES_ANALYTICS}         element={<Analytics />} />
            <Route path={ROUTES.SUPER_ADMIN_SALES_CUSTOMER_REPORTS} element={<CustomerReports />} />

            {/* Purchase */}
            <Route path={ROUTES.SUPER_ADMIN_PURCHASE}               element={<PurchaseDashboard />} />
            <Route path={ROUTES.SUPER_ADMIN_PURCHASE_OVERVIEW}      element={<PurchaseOverview />} />
            <Route path={ROUTES.SUPER_ADMIN_PURCHASE_VENDORS}       element={<Vendors />} />
            <Route path={ROUTES.SUPER_ADMIN_PURCHASE_REQUESTS}      element={<PurchaseRequests />} />
            <Route path={ROUTES.SUPER_ADMIN_PURCHASE_ORDERS}        element={<PurchaseOrders />} />
            <Route path={ROUTES.SUPER_ADMIN_PURCHASE_GOODS_RECEIPTS} element={<GoodsReceipts />} />
            <Route path={ROUTES.SUPER_ADMIN_PURCHASE_PAYMENTS}      element={<SupplierPayments />} />
            <Route path={ROUTES.SUPER_ADMIN_PURCHASE_PAYABLES_AGING} element={<PayablesAging />} />

            {/* Inventory */}
            <Route path={ROUTES.SUPER_ADMIN_INVENTORY}               element={<InventoryDashboard />} />
            <Route path={ROUTES.SUPER_ADMIN_INVENTORY_OVERVIEW}      element={<InventoryOverview />} />
            <Route path={ROUTES.SUPER_ADMIN_INVENTORY_STOCK}         element={<Stock />} />
            <Route path={ROUTES.SUPER_ADMIN_INVENTORY_WAREHOUSES}    element={<Warehouses />} />
            <Route path={ROUTES.SUPER_ADMIN_INVENTORY_BATCH_TRACKING} element={<BatchLotTracking />} />
            <Route path={ROUTES.SUPER_ADMIN_INVENTORY_BARCODE}       element={<BarcodeQrManagement />} />
            <Route path={ROUTES.SUPER_ADMIN_INVENTORY_TRANSFERS}     element={<StockTransfers />} />

            {/* Manufacturing */}
            <Route path={ROUTES.SUPER_ADMIN_MANUFACTURING}            element={<ManufacturingDashboard />} />
            <Route path={ROUTES.SUPER_ADMIN_MANUFACTURING_OVERVIEW}   element={<ManufacturingOverview />} />
            <Route path={ROUTES.SUPER_ADMIN_MANUFACTURING_BOM}        element={<BillOfMaterials />} />
            <Route path={ROUTES.SUPER_ADMIN_MANUFACTURING_WORK_ORDERS} element={<WorkOrders />} />
            <Route path={ROUTES.SUPER_ADMIN_MANUFACTURING_MACHINES}   element={<MachineTracking />} />
            <Route path={ROUTES.SUPER_ADMIN_MANUFACTURING_QUALITY}    element={<QualityControl />} />

            {/* Finance */}
            <Route path={ROUTES.SUPER_ADMIN_FINANCE}              element={<FinanceDashboard />} />
            <Route path={ROUTES.SUPER_ADMIN_FINANCE_OVERVIEW}     element={<FinanceOverview />} />
            <Route path={ROUTES.SUPER_ADMIN_FINANCE_LEDGER}       element={<GeneralLedger />} />
            <Route path={ROUTES.SUPER_ADMIN_FINANCE_JOURNAL}      element={<JournalEntries />} />
            <Route path={ROUTES.SUPER_ADMIN_FINANCE_EXPENSES}     element={<ExpenseTracking />} />
            <Route path={ROUTES.SUPER_ADMIN_FINANCE_ALERTS}       element={<Alerts />} />
            <Route path={ROUTES.SUPER_ADMIN_FINANCE_TAX}          element={<TaxManagement />} />
            <Route path={ROUTES.SUPER_ADMIN_FINANCE_GST}          element={<CashFlow />} />
            <Route path={ROUTES.SUPER_ADMIN_FINANCE_BALANCE_SHEET} element={<BalanceSheet />} />

            {/* HR */}
            <Route path={ROUTES.SUPER_ADMIN_HR}            element={<HrDashboard />} />
            <Route path={ROUTES.SUPER_ADMIN_HR_OVERVIEW}   element={<HrOverview />} />
            <Route path={ROUTES.SUPER_ADMIN_HR_EMPLOYEES}  element={<EmployeeDatabase />} />
            <Route path={ROUTES.SUPER_ADMIN_HR_ATTENDANCE} element={<Attendance />} />
            <Route path={ROUTES.SUPER_ADMIN_HR_LEAVE}      element={<LeaveManagement />} />
            <Route path={ROUTES.SUPER_ADMIN_HR_PAYROLL}    element={<Payroll />} />
            <Route path={ROUTES.SUPER_ADMIN_HR_PERFORMANCE} element={<PerformanceTracking />} />

            {/* Projects */}
            <Route path={ROUTES.SUPER_ADMIN_PROJECTS}              element={<ProjectsDashboard />} />
            <Route path={ROUTES.SUPER_ADMIN_PROJECTS_OVERVIEW}     element={<ProjectsOverview />} />
            <Route path={ROUTES.SUPER_ADMIN_PROJECTS_PLANNING}     element={<ProjectPlanning />} />
            <Route path={ROUTES.SUPER_ADMIN_PROJECTS_TASKS}        element={<Tasks />} />
            <Route path={ROUTES.SUPER_ADMIN_PROJECTS_TIME_TRACKING} element={<TimeTracking />} />
            <Route path={ROUTES.SUPER_ADMIN_PROJECTS_BUDGET}       element={<BudgetMonitoring />} />
            <Route path={ROUTES.SUPER_ADMIN_PROJECTS_DOCUMENTS}    element={<ProjectDocuments />} />

            {/* Documents */}
            <Route path={ROUTES.SUPER_ADMIN_DOCUMENTS}                element={<DocumentsDashboard />} />
            <Route path={ROUTES.SUPER_ADMIN_DOCUMENTS_OVERVIEW}       element={<DocumentsOverview />} />
            <Route path={ROUTES.SUPER_ADMIN_DOCUMENTS_UPLOAD}         element={<UploadDocuments />} />
            <Route path={ROUTES.SUPER_ADMIN_DOCUMENTS_VERSION_CONTROL} element={<VersionControl />} />
            <Route path={ROUTES.SUPER_ADMIN_DOCUMENTS_APPROVALS}      element={<DigitalApprovals />} />
            <Route path={ROUTES.SUPER_ADMIN_DOCUMENTS_SEARCH}         element={<DocumentSearch />} />

            {/* Reports */}
            <Route path={ROUTES.SUPER_ADMIN_REPORTS}           element={<ReportsDashboard/>} />
            <Route path={ROUTES.SUPER_ADMIN_REPORTS_OVERVIEW}  element={<ReportsOverview />} />
            <Route path={ROUTES.SUPER_ADMIN_REPORTS_SALES}     element={<SalesReports />} />
            <Route path={ROUTES.SUPER_ADMIN_REPORTS_PURCHASE}  element={<PurchaseReports />} />
            <Route path={ROUTES.SUPER_ADMIN_REPORTS_INVENTORY} element={<InventoryReports />} />
            <Route path={ROUTES.SUPER_ADMIN_REPORTS_FINANCE}   element={<FinanceReports />} />
            <Route path={ROUTES.SUPER_ADMIN_REPORTS_HR}        element={<HrReports />} />
            <Route path={ROUTES.SUPER_ADMIN_REPORTS_PROJECTS}  element={<ProjectReports />} />

            {/* Settings */}
            <Route path={ROUTES.SUPER_ADMIN_SETTINGS}               element={<SettingsDashboard />} />
            <Route path={ROUTES.SUPER_ADMIN_SETTINGS_GENERAL}       element={<GeneralSettings />} />
            <Route path={ROUTES.SUPER_ADMIN_SETTINGS_USERS}         element={<UserManagement />} />
            <Route path={ROUTES.SUPER_ADMIN_SETTINGS_ROLES}         element={<SettingsRoles />} />
            <Route path={ROUTES.SUPER_ADMIN_SETTINGS_NOTIFICATIONS} element={<NotificationSettings />} />
            <Route path={ROUTES.SUPER_ADMIN_SETTINGS_INTEGRATIONS}  element={<IntegrationSettings />} />
            <Route path={ROUTES.SUPER_ADMIN_SETTINGS_APPROVALS}     element={<ApprovalWorkflowSettings />} />
            <Route path={ROUTES.SUPER_ADMIN_SETTINGS_BACKUP}        element={<BackupSecurity />} />

            {/* AI */}
            <Route path={ROUTES.SUPER_ADMIN_AI}                        element={<BusinessAssistant />} />
            <Route path={ROUTES.SUPER_ADMIN_AI_BUSINESS_ASSISTANT}     element={<BusinessAssistant />} />
            <Route path={ROUTES.SUPER_ADMIN_AI_ANALYTICS}              element={<DashboardAnalytics />} />
            <Route path={ROUTES.SUPER_ADMIN_AI_FORECASTING}            element={<ForecastingEngine />} />
            <Route path={ROUTES.SUPER_ADMIN_AI_DOCUMENT_PROCESSING}    element={<DocumentProcessing />} />
            <Route path={ROUTES.SUPER_ADMIN_AI_WORKFLOW_AUTOMATION}    element={<WorkflowAutomation />} />
            <Route path={ROUTES.SUPER_ADMIN_AI_FRAUD_DETECTION}        element={<FraudDetection />} />
            <Route path={ROUTES.SUPER_ADMIN_AI_CHATBOT}                element={<SupportChatbot />} />
            <Route path={ROUTES.SUPER_ADMIN_AI_REPORT_GENERATOR}       element={<ReportGenerator />} />
          </Route>
        </Route>

        {/* ════════════════════════════════════════════════════════════════
            ADMIN
        ════════════════════════════════════════════════════════════════ */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />

            {/* Company */}
            <Route path={ROUTES.ADMIN_COMPANY}                    element={<CompanyDashboard />} />
            <Route path={ROUTES.ADMIN_COMPANY_OVERVIEW}           element={<CompanyOverview />} />
            <Route path={ROUTES.ADMIN_COMPANY_PROFILE}            element={<CompanyProfile />} />
            <Route path={ROUTES.ADMIN_COMPANY_BRANCHES}           element={<Branches />} />
            <Route path={ROUTES.ADMIN_COMPANY_DEPARTMENTS}        element={<Departments />} />
            <Route path={ROUTES.ADMIN_COMPANY_COST_CENTERS}       element={<CostCenters />} />
            <Route path={ROUTES.ADMIN_COMPANY_ORG_CHART}          element={<OrganizationChart />} />
            <Route path={ROUTES.ADMIN_COMPANY_USERS}              element={<CompanyUsers />} />
            <Route path={ROUTES.ADMIN_COMPANY_ROLES}              element={<CompanyRoles />} />
            <Route path={ROUTES.ADMIN_COMPANY_APPROVAL_WORKFLOWS} element={<ApprovalWorkflows />} />
            <Route path={ROUTES.ADMIN_COMPANY_SETTINGS}           element={<CompanySettings />} />
            <Route path={ROUTES.ADMIN_COMPANY_BRANCH_SETTINGS}    element={<BranchSettings />} />
            <Route path={ROUTES.ADMIN_COMPANY_HOLIDAYS}           element={<Holidays />} />
            <Route path={ROUTES.ADMIN_COMPANY_SUBSCRIPTION}       element={<Subscription />} />

            {/* CRM */}
            <Route path={ROUTES.ADMIN_CRM}               element={<CrmDashboard />} />
            <Route path={ROUTES.ADMIN_CRM_OVERVIEW}      element={<CrmOverview />} />
            <Route path={ROUTES.ADMIN_CRM_LEADS}         element={<Leads />} />
            <Route path={ROUTES.ADMIN_CRM_CUSTOMERS}     element={<Customers />} />
            <Route path={ROUTES.ADMIN_CRM_PIPELINE}      element={<SalesPipeline />} />
            <Route path={ROUTES.ADMIN_CRM_FOLLOW_UPS}    element={<FollowUps />} />
            <Route path={ROUTES.ADMIN_CRM_COMMUNICATION} element={<CommunicationHistory />} />

            {/* Sales */}
            <Route path={ROUTES.ADMIN_SALES}                  element={<SalesDashboard />} />
            <Route path={ROUTES.ADMIN_SALES_OVERVIEW}         element={<SalesOverview />} />
            <Route path={ROUTES.ADMIN_SALES_QUOTATIONS}       element={<Quotations />} />
            <Route path={ROUTES.ADMIN_SALES_ORDERS}           element={<SalesOrders />} />
            <Route path={ROUTES.ADMIN_SALES_INVOICES}         element={<Invoices />} />
            <Route path={ROUTES.ADMIN_SALES_ANALYTICS}         element={<Analytics />} />
            <Route path={ROUTES.ADMIN_SALES_CUSTOMER_REPORTS} element={<CustomerReports />} />

            {/* Purchase */}
            <Route path={ROUTES.ADMIN_PURCHASE}               element={<PurchaseDashboard />} />
            <Route path={ROUTES.ADMIN_PURCHASE_OVERVIEW}      element={<PurchaseOverview />} />
            <Route path={ROUTES.ADMIN_PURCHASE_VENDORS}       element={<Vendors />} />
            <Route path={ROUTES.ADMIN_PURCHASE_REQUESTS}      element={<PurchaseRequests />} />
            <Route path={ROUTES.ADMIN_PURCHASE_ORDERS}        element={<PurchaseOrders />} />
            <Route path={ROUTES.ADMIN_PURCHASE_GOODS_RECEIPTS} element={<GoodsReceipts />} />
            <Route path={ROUTES.ADMIN_PURCHASE_PAYMENTS}      element={<SupplierPayments />} />
            <Route path={ROUTES.ADMIN_PURCHASE_PAYABLES_AGING} element={<PayablesAging />} />

            {/* Inventory */}
            <Route path={ROUTES.ADMIN_INVENTORY}               element={<InventoryDashboard />} />
            <Route path={ROUTES.ADMIN_INVENTORY_OVERVIEW}      element={<InventoryOverview />} />
            <Route path={ROUTES.ADMIN_INVENTORY_STOCK}         element={<Stock />} />
            <Route path={ROUTES.ADMIN_INVENTORY_WAREHOUSES}    element={<Warehouses />} />
            <Route path={ROUTES.ADMIN_INVENTORY_BATCH_TRACKING} element={<BatchLotTracking />} />
            <Route path={ROUTES.ADMIN_INVENTORY_BARCODE}       element={<BarcodeQrManagement />} />
            <Route path={ROUTES.ADMIN_INVENTORY_TRANSFERS}     element={<StockTransfers />} />

            {/* Manufacturing */}
            <Route path={ROUTES.ADMIN_MANUFACTURING}            element={<ManufacturingDashboard />} />
            <Route path={ROUTES.ADMIN_MANUFACTURING_OVERVIEW}   element={<ManufacturingOverview />} />
            <Route path={ROUTES.ADMIN_MANUFACTURING_BOM}        element={<BillOfMaterials />} />
            <Route path={ROUTES.ADMIN_MANUFACTURING_WORK_ORDERS} element={<WorkOrders />} />
            <Route path={ROUTES.ADMIN_MANUFACTURING_MACHINES}   element={<MachineTracking />} />
            <Route path={ROUTES.ADMIN_MANUFACTURING_QUALITY}    element={<QualityControl />} />

            {/* Finance */}
            <Route path={ROUTES.ADMIN_FINANCE}              element={<FinanceDashboard />} />
            <Route path={ROUTES.ADMIN_FINANCE_OVERVIEW}     element={<FinanceOverview />} />
            <Route path={ROUTES.ADMIN_FINANCE_LEDGER}       element={<GeneralLedger />} />
            <Route path={ROUTES.ADMIN_FINANCE_JOURNAL}      element={<JournalEntries />} />
            <Route path={ROUTES.ADMIN_FINANCE_EXPENSES}     element={<ExpenseTracking />} />
            <Route path={ROUTES.ADMIN_FINANCE_ALERTS}       element={<Alerts />} />
            <Route path={ROUTES.ADMIN_FINANCE_TAX}          element={<TaxManagement />} />
            <Route path={ROUTES.ADMIN_FINANCE_GST}          element={<CashFlow />} />
            <Route path={ROUTES.ADMIN_FINANCE_BALANCE_SHEET} element={<BalanceSheet />} />

            {/* HR */}
            <Route path={ROUTES.ADMIN_HR}            element={<HrDashboard />} />
            <Route path={ROUTES.ADMIN_HR_OVERVIEW}   element={<HrOverview />} />
            <Route path={ROUTES.ADMIN_HR_EMPLOYEES}  element={<EmployeeDatabase />} />
            <Route path={ROUTES.ADMIN_HR_ATTENDANCE} element={<Attendance />} />
            <Route path={ROUTES.ADMIN_HR_LEAVE}      element={<LeaveManagement />} />
            <Route path={ROUTES.ADMIN_HR_PAYROLL}    element={<Payroll />} />
            <Route path={ROUTES.ADMIN_HR_PERFORMANCE} element={<PerformanceTracking />} />

            {/* Projects */}
            <Route path={ROUTES.ADMIN_PROJECTS}              element={<ProjectsDashboard />} />
            <Route path={ROUTES.ADMIN_PROJECTS_OVERVIEW}     element={<ProjectsOverview />} />
            <Route path={ROUTES.ADMIN_PROJECTS_PLANNING}     element={<ProjectPlanning />} />
            <Route path={ROUTES.ADMIN_PROJECTS_TASKS}        element={<Tasks />} />
            <Route path={ROUTES.ADMIN_PROJECTS_TIME_TRACKING} element={<TimeTracking />} />
            <Route path={ROUTES.ADMIN_PROJECTS_BUDGET}       element={<BudgetMonitoring />} />
            <Route path={ROUTES.ADMIN_PROJECTS_DOCUMENTS}    element={<ProjectDocuments />} />

            {/* Documents */}
            <Route path={ROUTES.ADMIN_DOCUMENTS}                element={<DocumentsDashboard />} />
            <Route path={ROUTES.ADMIN_DOCUMENTS_OVERVIEW}       element={<DocumentsOverview />} />
            <Route path={ROUTES.ADMIN_DOCUMENTS_UPLOAD}         element={<UploadDocuments />} />
            <Route path={ROUTES.ADMIN_DOCUMENTS_VERSION_CONTROL} element={<VersionControl />} />
            <Route path={ROUTES.ADMIN_DOCUMENTS_APPROVALS}      element={<DigitalApprovals />} />
            <Route path={ROUTES.ADMIN_DOCUMENTS_SEARCH}         element={<DocumentSearch />} />

            {/* Reports */}
            <Route path={ROUTES.ADMIN_REPORTS}           element={<ReportsDashboard />} />
            <Route path={ROUTES.ADMIN_REPORTS_OVERVIEW}  element={<ReportsOverview />} />
            <Route path={ROUTES.ADMIN_REPORTS_SALES}     element={<SalesReports />} />
            <Route path={ROUTES.ADMIN_REPORTS_PURCHASE}  element={<PurchaseReports />} />
            <Route path={ROUTES.ADMIN_REPORTS_INVENTORY} element={<InventoryReports />} />
            <Route path={ROUTES.ADMIN_REPORTS_FINANCE}   element={<FinanceReports />} />
            <Route path={ROUTES.ADMIN_REPORTS_HR}        element={<HrReports />} />
            <Route path={ROUTES.ADMIN_REPORTS_PROJECTS}  element={<ProjectReports />} />

            {/* Settings */}
            <Route path={ROUTES.ADMIN_SETTINGS}               element={<SettingsDashboard />} />
            <Route path={ROUTES.ADMIN_SETTINGS_GENERAL}       element={<GeneralSettings />} />
            <Route path={ROUTES.ADMIN_SETTINGS_USERS}         element={<UserManagement />} />
            <Route path={ROUTES.ADMIN_SETTINGS_ROLES}         element={<SettingsRoles />} />
            <Route path={ROUTES.ADMIN_SETTINGS_NOTIFICATIONS} element={<NotificationSettings />} />
            <Route path={ROUTES.ADMIN_SETTINGS_INTEGRATIONS}  element={<IntegrationSettings />} />
            <Route path={ROUTES.ADMIN_SETTINGS_APPROVALS}     element={<ApprovalWorkflowSettings />} />
            <Route path={ROUTES.ADMIN_SETTINGS_BACKUP}        element={<BackupSecurity />} />

            {/* AI */}
            <Route path={ROUTES.ADMIN_AI}                     element={<BusinessAssistant />} />
            <Route path={ROUTES.ADMIN_AI_BUSINESS_ASSISTANT}  element={<BusinessAssistant />} />
            <Route path={ROUTES.ADMIN_AI_ANALYTICS}           element={<DashboardAnalytics />} />
            <Route path={ROUTES.ADMIN_AI_FORECASTING}         element={<ForecastingEngine />} />
            <Route path={ROUTES.ADMIN_AI_DOCUMENT_PROCESSING} element={<DocumentProcessing />} />
            <Route path={ROUTES.ADMIN_AI_WORKFLOW_AUTOMATION} element={<WorkflowAutomation />} />
            <Route path={ROUTES.ADMIN_AI_FRAUD_DETECTION}     element={<FraudDetection />} />
            <Route path={ROUTES.ADMIN_AI_CHATBOT}             element={<SupportChatbot />} />
            <Route path={ROUTES.ADMIN_AI_REPORT_GENERATOR}    element={<ReportGenerator />} />
          </Route>
        </Route>

        {/* ════════════════════════════════════════════════════════════════
            FINANCE MANAGER
        ════════════════════════════════════════════════════════════════ */}
        <Route element={<ProtectedRoute allowedRoles={['financeManager']} />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.FINANCE_MANAGER_DASHBOARD}              element={<FinanceDashboardPage />} />
            <Route path={ROUTES.FINANCE_MANAGER_FINANCE}                element={<FinanceDashboard />} />
            <Route path={ROUTES.FINANCE_MANAGER_FINANCE_OVERVIEW}       element={<FinanceOverview />} />
            <Route path={ROUTES.FINANCE_MANAGER_FINANCE_LEDGER}         element={<GeneralLedger />} />
            <Route path={ROUTES.FINANCE_MANAGER_FINANCE_JOURNAL}        element={<JournalEntries />} />
            <Route path={ROUTES.FINANCE_MANAGER_FINANCE_EXPENSES}       element={<ExpenseTracking />} />
            <Route path={ROUTES.FINANCE_MANAGER_FINANCE_ALERTS}         element={<Alerts />} />
            <Route path={ROUTES.FINANCE_MANAGER_FINANCE_TAX}            element={<TaxManagement />} />
            <Route path={ROUTES.FINANCE_MANAGER_FINANCE_GST}            element={<CashFlow />} />
            <Route path={ROUTES.FINANCE_MANAGER_FINANCE_BALANCE_SHEET}  element={<BalanceSheet />} />
            <Route path={ROUTES.FINANCE_MANAGER_REPORTS}                element={<ReportsDashboard />} />
            <Route path={ROUTES.FINANCE_MANAGER_AI}                     element={<BusinessAssistant />} />
            <Route path={ROUTES.FINANCE_MANAGER_SETTINGS}               element={<SettingsDashboard />} />
          </Route>
        </Route>

        {/* ════════════════════════════════════════════════════════════════
            SALES MANAGER
        ════════════════════════════════════════════════════════════════ */}
        <Route element={<ProtectedRoute allowedRoles={['salesManager']} />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.SALES_MANAGER_DASHBOARD}         element={<SalesDashboardPage />} />
            <Route path={ROUTES.SALES_MANAGER_CRM}               element={<CrmDashboard />} />
            <Route path={ROUTES.SALES_MANAGER_CRM_LEADS}         element={<Leads />} />
            <Route path={ROUTES.SALES_MANAGER_CRM_CUSTOMERS}     element={<Customers />} />
            <Route path={ROUTES.SALES_MANAGER_CRM_PIPELINE}      element={<SalesPipeline />} />
            <Route path={ROUTES.SALES_MANAGER_SALES}             element={<SalesDashboard />} />
            <Route path={ROUTES.SALES_MANAGER_SALES_QUOTATIONS}  element={<Quotations />} />
            <Route path={ROUTES.SALES_MANAGER_SALES_ORDERS}      element={<SalesOrders />} />
            <Route path={ROUTES.SALES_MANAGER_SALES_INVOICES}    element={<Invoices />} />
            <Route path={ROUTES.SALES_MANAGER_REPORTS}           element={<ReportsDashboard />} />
            <Route path={ROUTES.SALES_MANAGER_AI}                element={<BusinessAssistant />} />
            <Route path={ROUTES.SALES_MANAGER_SETTINGS}          element={<SettingsDashboard />} />
          </Route>
        </Route>

        {/* ════════════════════════════════════════════════════════════════
            HR MANAGER
        ════════════════════════════════════════════════════════════════ */}
        <Route element={<ProtectedRoute allowedRoles={['hrManager']} />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.HR_MANAGER_DASHBOARD}      element={<HRDashboardPage />} />
            <Route path={ROUTES.HR_MANAGER_HR}             element={<HrDashboard />} />
            <Route path={ROUTES.HR_MANAGER_HR_OVERVIEW}    element={<HrOverview />} />
            <Route path={ROUTES.HR_MANAGER_HR_EMPLOYEES}   element={<EmployeeDatabase />} />
            <Route path={ROUTES.HR_MANAGER_HR_ATTENDANCE}  element={<Attendance />} />
            <Route path={ROUTES.HR_MANAGER_HR_LEAVE}       element={<LeaveManagement />} />
            <Route path={ROUTES.HR_MANAGER_HR_PAYROLL}     element={<Payroll />} />
            <Route path={ROUTES.HR_MANAGER_HR_PERFORMANCE} element={<PerformanceTracking />} />
            <Route path={ROUTES.HR_MANAGER_REPORTS}        element={<ReportsDashboard />} />
            <Route path={ROUTES.HR_MANAGER_AI}             element={<BusinessAssistant />} />
            <Route path={ROUTES.HR_MANAGER_SETTINGS}       element={<SettingsDashboard />} />
          </Route>
        </Route>

        {/* ════════════════════════════════════════════════════════════════
            OPERATIONS MANAGER
        ════════════════════════════════════════════════════════════════ */}
        <Route element={<ProtectedRoute allowedRoles={['operationsManager']} />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.OPERATIONS_MANAGER_DASHBOARD}                element={<OperationsDashboardPage />} />
            <Route path={ROUTES.OPERATIONS_MANAGER_INVENTORY}                element={<InventoryDashboard />} />
            <Route path={ROUTES.OPERATIONS_MANAGER_INVENTORY_STOCK}          element={<Stock />} />
            <Route path={ROUTES.OPERATIONS_MANAGER_INVENTORY_WAREHOUSES}     element={<Warehouses />} />
            <Route path={ROUTES.OPERATIONS_MANAGER_MANUFACTURING}            element={<ManufacturingDashboard />} />
            <Route path={ROUTES.OPERATIONS_MANAGER_MANUFACTURING_BOM}        element={<BillOfMaterials />} />
            <Route path={ROUTES.OPERATIONS_MANAGER_MANUFACTURING_WORK_ORDERS} element={<WorkOrders />} />
            <Route path={ROUTES.OPERATIONS_MANAGER_PURCHASE}                 element={<PurchaseDashboard />} />
            <Route path={ROUTES.OPERATIONS_MANAGER_PROJECTS}                 element={<ProjectsDashboard />} />
            <Route path={ROUTES.OPERATIONS_MANAGER_REPORTS}                  element={<ReportsDashboard />} />
            <Route path={ROUTES.OPERATIONS_MANAGER_AI}                       element={<BusinessAssistant />} />
            <Route path={ROUTES.OPERATIONS_MANAGER_SETTINGS}                 element={<SettingsDashboard />} />
          </Route>
        </Route>

        {/* ════════════════════════════════════════════════════════════════
            EMPLOYEE
        ════════════════════════════════════════════════════════════════ */}
        <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.EMPLOYEE_DASHBOARD}     element={<EmployeeDashboardPage />} />
            <Route path={ROUTES.EMPLOYEE_PROFILE}       element={<EmployeeProfile />} />
            <Route path={ROUTES.EMPLOYEE_ATTENDANCE}    element={<EmployeeAttendance />} />
            <Route path={ROUTES.EMPLOYEE_LEAVE}         element={<EmployeeLeave />} />
            <Route path={ROUTES.EMPLOYEE_PAYROLL}       element={<EmployeePayroll />} />
            <Route path={ROUTES.EMPLOYEE_TASKS}         element={<EmployeeTasks />} />
            <Route path={ROUTES.EMPLOYEE_DOCUMENTS}     element={<EmployeeDocuments />} />
            <Route path={ROUTES.EMPLOYEE_NOTIFICATIONS} element={<EmployeeNotifications />} />
          </Route>
        </Route>

        {/* ════════════════════════════════════════════════════════════════
            404
        ════════════════════════════════════════════════════════════════ */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  )
}

export default AppRoutes
