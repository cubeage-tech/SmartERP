import axios from '../../../utils/axios';
import storageService from '../storage.service';

const BASE_URL = '/finance';

/**
 * Finance Service — connects to implemented Spring Boot backend endpoints:
 * 1. GET    /api/v1/finance/dashboard
 * 2. POST   /api/v1/finance/journals
 * 3. GET    /api/v1/finance/journals
 * 4. GET    /api/v1/finance/alerts
 * 5. DELETE /api/v1/finance/alerts/{id}
 */
const getTenantHeader = () => {
  const user = storageService.getUser();
  const tenantId = user?.tenantId ?? user?.tenant_id ?? 1;
  return { 'X-Tenant-Id': String(tenantId) };
};

const financeService = {
  /**
   * GET /api/v1/finance/dashboard
   * Returns: { journalEntries, totalDebits, totalCredits, netMovement }
   */
  getDashboardSummary: () => {
    return axios.get(`${BASE_URL}/dashboard`, {
      headers: getTenantHeader(),
    }).then((res) => res.data);
  },

  /**
   * POST /api/v1/finance/journals
   * Body: { entryDate, description, reference, lines: [{ accountCode, accountName, debit, credit }] }
   * Returns: JournalEntryResponse
   */
  createJournalEntry: (payload) => {
    return axios.post(`${BASE_URL}/journals`, payload, {
      headers: getTenantHeader(),
    }).then((res) => res.data);
  },

  /**
   * GET /api/v1/finance/journals
   * Returns: List<JournalEntryResponse>
   */
  getJournals: () => {
    return axios.get(`${BASE_URL}/journals`, {
      headers: getTenantHeader(),
    }).then((res) => res.data);
  },

  /**
   * GET /api/v1/finance/alerts
   * Returns: List<FinanceAlertResponse>
   */
  getActiveAlerts: () => {
    return axios.get(`${BASE_URL}/alerts`, {
      headers: getTenantHeader(),
    }).then((res) => res.data);
  },

  /**
   * DELETE /api/v1/finance/alerts/{id}
   * Returns: void (HTTP 204)
   */
  dismissAlert: (id) => {
    return axios.delete(`${BASE_URL}/alerts/${id}`, {
      headers: getTenantHeader(),
    }).then((res) => res.data);
  },

  /**
   * GET /api/v1/finance/ledger
   * Params: { accountCode, startDate, endDate }
   * Returns: GeneralLedgerResponse { entries, totalDebit, totalCredit, netBalance, totalRecords }
   */
  getLedger: (params = {}) => {
    return axios.get(`${BASE_URL}/ledger`, {
      headers: getTenantHeader(),
      params,
    }).then((res) => res.data);
  },

  /**
   * GET /api/v1/finance/profit-loss
   * Params: { startDate, endDate }
   * Returns: ProfitLossResponse { startDate, endDate, revenues, totalRevenue, expenses, totalExpense, grossProfit, netProfit }
   */
  getProfitLoss: (params = {}) => {
    return axios.get(`${BASE_URL}/profit-loss`, {
      headers: getTenantHeader(),
      params,
    }).then((res) => res.data);
  },

  /**
   * GET /api/v1/finance/cash-flow
   * Params: { year }
   * Returns: CashFlowResponse { monthlyFlows, totalOperating, totalInvesting, totalFinancing, netCashFlow, openingCash, closingCash }
   */
  /**
   * GET /api/v1/finance/cash-flow
   * Params: { year }
   * Returns: CashFlowResponse { monthlyFlows, totalOperating, totalInvesting, totalFinancing, netCashFlow, openingCash, closingCash }
   */
  getCashFlow: (params = {}) => {
    return axios.get(`${BASE_URL}/cash-flow`, {
      headers: getTenantHeader(),
      params,
    }).then((res) => res.data);
  },

  /**
   * GET /api/v1/finance/accounts
   * Params: { type, active, search }
   * Returns: List<AccountResponse>
   */
  getAccounts: (params = {}) => {
    return axios.get(`${BASE_URL}/accounts`, {
      headers: getTenantHeader(),
      params,
    }).then((res) => res.data);
  },

  /**
   * POST /api/v1/finance/accounts
   * Body: { code, name, type }
   * Returns: AccountResponse
   */
  createAccount: (payload) => {
    return axios.post(`${BASE_URL}/accounts`, payload, {
      headers: getTenantHeader(),
    }).then((res) => res.data);
  },

  /**
   * PUT /api/v1/finance/accounts/{id}
   * Body: { name, active }
   * Returns: AccountResponse
   */
  updateAccount: (id, payload) => {
    return axios.put(`${BASE_URL}/accounts/${id}`, payload, {
      headers: getTenantHeader(),
    }).then((res) => res.data);
  },

  /**
   * GET /api/v1/finance/balance-sheet
   * Params: { asOfDate: 'YYYY-MM-DD' }
   * Returns: BalanceSheetResponse
   */
  getBalanceSheet: (params = {}) => {
    return axios.get(`${BASE_URL}/balance-sheet`, {
      headers: getTenantHeader(),
      params,
    }).then((res) => res.data);
  },

  /**
   * GET /api/v1/finance/trial-balance
   * Params: { asOfDate: 'YYYY-MM-DD' }
   * Returns: TrialBalanceResponse
   */
  getTrialBalance: (params = {}) => {
    return axios.get(`${BASE_URL}/trial-balance`, {
      headers: getTenantHeader(),
      params,
    }).then((res) => res.data);
  },

  /**
   * GET /api/v1/finance/journals/{id}
   */
  getJournalById: (id) => {
    return axios.get(`${BASE_URL}/journals/${id}`, {
      headers: getTenantHeader(),
    }).then((res) => res.data);
  },

  /**
   * GET /api/v1/finance/export/tally/masters
   */
  exportTallyMasters: () => {
    return axios.get(`${BASE_URL}/export/tally/masters`, {
      headers: getTenantHeader(),
      responseType: "blob",
    });
  },

  /**
   * GET /api/v1/finance/export/tally/daybook
   */
  exportTallyDaybook: (params = {}) => {
    return axios.get(`${BASE_URL}/export/tally/daybook`, {
      headers: getTenantHeader(),
      params,
      responseType: "blob",
    });
  },

  /**
   * Helper to record an expense via the double-entry journal engine
   * POST /api/v1/finance/journals
   */
  recordExpense: (expenseData) => {
    const { date, amount, expenseAccount, paymentAccount, description, reference } = expenseData;
    const numAmount = Number(amount);
    const payload = {
      entryDate: date,
      description: description || `Expense: ${expenseAccount.name}`,
      reference: reference || `EXP-${Date.now()}`,
      lines: [
        {
          accountCode: expenseAccount.code,
          accountName: expenseAccount.name,
          debit: numAmount,
          credit: 0,
        },
        {
          accountCode: paymentAccount.code,
          accountName: paymentAccount.name,
          debit: 0,
          credit: numAmount,
        },
      ],
    };
    return axios.post(`${BASE_URL}/journals`, payload, {
      headers: getTenantHeader(),
    }).then((res) => res.data);
  },

  /**
   * Helper to record a tax-related transaction via the double-entry journal engine
   * POST /api/v1/finance/journals
   */
  recordTaxTransaction: (payload) => {
    return axios.post(`${BASE_URL}/journals`, payload, {
      headers: getTenantHeader(),
    }).then((res) => res.data);
  },
};

export default financeService;
export { financeService };
