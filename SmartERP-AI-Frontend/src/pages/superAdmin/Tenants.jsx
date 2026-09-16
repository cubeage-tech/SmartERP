import React, { useState, useMemo, useEffect, useCallback } from "react";
import TenantService from "../../core/services/modules/tenant.service";

// ─── Dropdown Options ────────────────────────────────────────────────────────
const INDUSTRIES = [
  "Manufacturing",
  "IT & Technology",
  "Finance & Banking",
  "Healthcare",
  "Retail & E-commerce",
  "Logistics & Supply Chain",
  "Construction & Real Estate",
  "Education",
  "FMCG",
  "Professional Services",
  "Other",
];

const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees",
];

const PLANS = [
  "Starter Plan",
  "Professional Plan",
  "Enterprise Plan",
  "Custom Plan",
];

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Singapore",
  "Australia",
];



const INITIAL_FORM = {
  // Section 1: Company Information
  companyName: "",
  subdomain: "",
  logo: null,
  industry: "",
  companySize: "",

  // Section 2: Admin User Details
  adminName: "",
  adminEmail: "",
  phoneNumber: "",
  designation: "",

  // Section 3: Subscription & Settings
  plan: "",
  startDate: "",
  endDate: "",
  trialPeriod: "0",
  maxUsers: "10",
  allowModuleCustomization: true,
  allowApiAccess: false,
  enableSso: false,

  // Section 4: Address Information
  address: "",
  city: "",
  state: "",
  country: "India",
  pinCode: "",
  website: "",

  // Section 5: Additional Information
  notes: "",
};

// ─── Toggle Switch Helper Component ──────────────────────────────────────────
const ToggleSwitch = ({ checked, onChange, label, description }) => (
  <div className="td-toggle-row">
    <div className="td-toggle-meta">
      <span className="td-toggle-label">{label}</span>
      {description && <span className="td-toggle-desc">{description}</span>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`td-toggle-btn ${checked ? "td-toggle-btn--on" : "td-toggle-btn--off"}`}
    >
      <span className={`td-toggle-thumb ${checked ? "td-toggle-thumb--on" : "td-toggle-thumb--off"}`} />
    </button>
  </div>
);

// ─── Add Tenant Drawer Component ─────────────────────────────────────────────
function AddTenantDrawer({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.companyName.trim()) errs.companyName = "Company Name is required";
    if (!form.subdomain.trim()) errs.subdomain = "Domain / Subdomain is required";
    if (!form.industry) errs.industry = "Industry is required";
    if (!form.adminName.trim()) errs.adminName = "Admin Name is required";
    if (!form.adminEmail.trim()) {
      errs.adminEmail = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail.trim())) {
      errs.adminEmail = "Enter a valid email address";
    }
    if (!form.plan) errs.plan = "Subscription Plan is required";
    if (!form.startDate) errs.startDate = "Start Date is required";
    if (!form.maxUsers) errs.maxUsers = "Maximum Users is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };

  return (
    <div className="td-drawer-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="td-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        {/* ================= FIXED HEADER ================= */}
        <div className="td-drawer-header">
          <div>
            <h2 id="drawer-title" className="td-drawer-title">Add New Tenant</h2>
            <p className="td-drawer-subtitle">
              Create a new organization/tenant to access the ERP platform.
            </p>
          </div>
          <button
            type="button"
            className="td-drawer-close"
            onClick={onClose}
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        {/* ================= SCROLLABLE FORM BODY ================= */}
        <form className="td-drawer-body" onSubmit={handleSubmit}>
          {/* ──── SECTION 1 — COMPANY INFORMATION ──── */}
          <div className="td-form-section">
            <div className="td-section-head">
              <span className="td-section-icon">🏢</span>
              <div>
                <h3 className="td-section-title">SECTION 1 — COMPANY INFORMATION</h3>
                <span className="td-section-desc">Basic details about the tenant organization</span>
              </div>
            </div>

            <div className="td-grid-2">
              <div className="td-field">
                <label className="td-label">
                  Company Name <span className="td-req">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={form.companyName}
                  onChange={(e) => setField("companyName", e.target.value)}
                  className={`td-input ${errors.companyName ? "td-input--err" : ""}`}
                />
                {errors.companyName && <span className="td-err-msg">{errors.companyName}</span>}
              </div>

              <div className="td-field">
                <label className="td-label">
                  Company Domain / Subdomain <span className="td-req">*</span>
                </label>
                <div className="td-domain-wrap">
                  <span className="td-domain-prefix">https://</span>
                  <input
                    type="text"
                    placeholder="company"
                    value={form.subdomain}
                    onChange={(e) =>
                      setField("subdomain", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                    }
                    className={`td-input td-input--domain ${errors.subdomain ? "td-input--err" : ""}`}
                  />
                  <span className="td-domain-suffix">.erp.com</span>
                </div>
                {errors.subdomain && <span className="td-err-msg">{errors.subdomain}</span>}
              </div>
            </div>

            <div className="td-grid-2">
              <div className="td-field">
                <label className="td-label">
                  Industry <span className="td-req">*</span>
                </label>
                <div className="td-select-wrap">
                  <select
                    value={form.industry}
                    onChange={(e) => setField("industry", e.target.value)}
                    className={`td-select ${errors.industry ? "td-input--err" : ""}`}
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                  <span className="td-chevron">▾</span>
                </div>
                {errors.industry && <span className="td-err-msg">{errors.industry}</span>}
              </div>

              <div className="td-field">
                <label className="td-label">Company Size</label>
                <div className="td-select-wrap">
                  <select
                    value={form.companySize}
                    onChange={(e) => setField("companySize", e.target.value)}
                    className="td-select"
                  >
                    <option value="">Select company size</option>
                    {COMPANY_SIZES.map((sz) => (
                      <option key={sz} value={sz}>
                        {sz}
                      </option>
                    ))}
                  </select>
                  <span className="td-chevron">▾</span>
                </div>
              </div>
            </div>

            {/* Company Logo Upload */}
            <div className="td-field">
              <label className="td-label">Company Logo</label>
              <label className="td-dropzone">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="td-file-hidden"
                  onChange={(e) => setField("logo", e.target.files?.[0] || null)}
                />
                <span className="td-dropzone-icon">☁</span>
                <span className="td-dropzone-text">
                  {form.logo ? (
                    <strong style={{ color: "#2e6e22" }}>✓ {form.logo.name}</strong>
                  ) : (
                    <>
                      <strong>Upload Logo</strong>
                      <span>PNG, JPG (Max 2MB)</span>
                    </>
                  )}
                </span>
              </label>
            </div>
          </div>

          {/* ──── SECTION 2 — ADMIN USER DETAILS ──── */}
          <div className="td-form-section">
            <div className="td-section-head">
              <span className="td-section-icon">👤</span>
              <div>
                <h3 className="td-section-title">SECTION 2 — ADMIN USER DETAILS</h3>
                <span className="td-section-desc">Primary administrative user account for this tenant</span>
              </div>
            </div>

            <div className="td-grid-2">
              <div className="td-field">
                <label className="td-label">
                  Admin Name <span className="td-req">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter admin name"
                  value={form.adminName}
                  onChange={(e) => setField("adminName", e.target.value)}
                  className={`td-input ${errors.adminName ? "td-input--err" : ""}`}
                />
                {errors.adminName && <span className="td-err-msg">{errors.adminName}</span>}
              </div>

              <div className="td-field">
                <label className="td-label">
                  Email Address <span className="td-req">*</span>
                </label>
                <input
                  type="email"
                  placeholder="admin@company.com"
                  value={form.adminEmail}
                  onChange={(e) => setField("adminEmail", e.target.value)}
                  className={`td-input ${errors.adminEmail ? "td-input--err" : ""}`}
                />
                {errors.adminEmail && <span className="td-err-msg">{errors.adminEmail}</span>}
              </div>
            </div>

            <div className="td-grid-2">
              <div className="td-field">
                <label className="td-label">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={form.phoneNumber}
                  onChange={(e) => setField("phoneNumber", e.target.value)}
                  className="td-input"
                />
              </div>

              <div className="td-field">
                <label className="td-label">Designation</label>
                <input
                  type="text"
                  placeholder="Enter designation"
                  value={form.designation}
                  onChange={(e) => setField("designation", e.target.value)}
                  className="td-input"
                />
              </div>
            </div>
          </div>

          {/* ──── SECTION 3 — SUBSCRIPTION & SETTINGS ──── */}
          <div className="td-form-section">
            <div className="td-section-head">
              <span className="td-section-icon">⚙️</span>
              <div>
                <h3 className="td-section-title">SECTION 3 — SUBSCRIPTION & SETTINGS</h3>
                <span className="td-section-desc">License quotas, plan limits, and system permissions</span>
              </div>
            </div>

            <div className="td-grid-2">
              <div className="td-field">
                <label className="td-label">
                  Subscription Plan <span className="td-req">*</span>
                </label>
                <div className="td-select-wrap">
                  <select
                    value={form.plan}
                    onChange={(e) => setField("plan", e.target.value)}
                    className={`td-select ${errors.plan ? "td-input--err" : ""}`}
                  >
                    <option value="">Select plan</option>
                    {PLANS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <span className="td-chevron">▾</span>
                </div>
                {errors.plan && <span className="td-err-msg">{errors.plan}</span>}
              </div>

              <div className="td-field">
                <label className="td-label">
                  Maximum Users <span className="td-req">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="10"
                  value={form.maxUsers}
                  onChange={(e) => setField("maxUsers", e.target.value)}
                  className={`td-input ${errors.maxUsers ? "td-input--err" : ""}`}
                />
                {errors.maxUsers && <span className="td-err-msg">{errors.maxUsers}</span>}
              </div>
            </div>

            <div className="td-grid-3">
              <div className="td-field">
                <label className="td-label">
                  Start Date <span className="td-req">*</span>
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setField("startDate", e.target.value)}
                  className={`td-input ${errors.startDate ? "td-input--err" : ""}`}
                />
                {errors.startDate && <span className="td-err-msg">{errors.startDate}</span>}
              </div>

              <div className="td-field">
                <label className="td-label">End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setField("endDate", e.target.value)}
                  className="td-input"
                />
              </div>

              <div className="td-field">
                <label className="td-label">Trial Period (Days)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.trialPeriod}
                  onChange={(e) => setField("trialPeriod", e.target.value)}
                  className="td-input"
                />
              </div>
            </div>

            <div className="td-toggles-box">
              <ToggleSwitch
                label="Allow Module Customization"
                description="Grant organization administrators permissions to toggle module visibility"
                checked={form.allowModuleCustomization}
                onChange={(val) => setField("allowModuleCustomization", val)}
              />
              <ToggleSwitch
                label="Allow API Access"
                description="Enable REST API tokens and Webhook integration capabilities"
                checked={form.allowApiAccess}
                onChange={(val) => setField("allowApiAccess", val)}
              />
              <ToggleSwitch
                label="Enable SSO"
                description="Support SAML 2.0 and OAuth2 enterprise identity providers"
                checked={form.enableSso}
                onChange={(val) => setField("enableSso", val)}
              />
            </div>
          </div>

          {/* ──── SECTION 4 — ADDRESS INFORMATION ──── */}
          <div className="td-form-section">
            <div className="td-section-head">
              <span className="td-section-icon">📍</span>
              <div>
                <h3 className="td-section-title">SECTION 4 — ADDRESS INFORMATION</h3>
                <span className="td-section-desc">Physical head office and regional address</span>
              </div>
            </div>

            <div className="td-field">
              <label className="td-label">Address</label>
              <textarea
                rows={2}
                placeholder="Enter company address"
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                className="td-input td-textarea"
              />
            </div>

            <div className="td-grid-2">
              <div className="td-field">
                <label className="td-label">City</label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                  className="td-input"
                />
              </div>

              <div className="td-field">
                <label className="td-label">State</label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={form.state}
                  onChange={(e) => setField("state", e.target.value)}
                  className="td-input"
                />
              </div>
            </div>

            <div className="td-grid-2">
              <div className="td-field">
                <label className="td-label">Country</label>
                <div className="td-select-wrap">
                  <select
                    value={form.country}
                    onChange={(e) => setField("country", e.target.value)}
                    className="td-select"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span className="td-chevron">▾</span>
                </div>
              </div>

              <div className="td-field">
                <label className="td-label">PIN Code</label>
                <input
                  type="text"
                  placeholder="Enter PIN code"
                  value={form.pinCode}
                  onChange={(e) =>
                    setField("pinCode", e.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                  className="td-input"
                />
              </div>
            </div>

            <div className="td-field">
              <label className="td-label">Website</label>
              <input
                type="url"
                placeholder="https://www.company.com"
                value={form.website}
                onChange={(e) => setField("website", e.target.value)}
                className="td-input"
              />
            </div>
          </div>

          {/* ──── SECTION 5 — ADDITIONAL INFORMATION ──── */}
          <div className="td-form-section">
            <div className="td-section-head">
              <span className="td-section-icon">📝</span>
              <div>
                <h3 className="td-section-title">SECTION 5 — ADDITIONAL INFORMATION</h3>
                <span className="td-section-desc">Internal notes and provisioning instructions</span>
              </div>
            </div>

            <div className="td-field">
              <label className="td-label">Notes (Optional)</label>
              <textarea
                rows={3}
                placeholder="Enter any additional notes..."
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                className="td-input td-textarea"
              />
            </div>
          </div>
        </form>

        {/* ================= FIXED FOOTER ================= */}
        <div className="td-drawer-footer">
          <button type="button" className="td-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="td-btn-submit" onClick={handleSubmit}>
            Create Tenant
          </button>
        </div>
      </aside>
    </div>
  );
}

// ─── Main Tenants Component ──────────────────────────────────────────────────
const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTenantDetails, setSelectedTenantDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  const PAGE_SIZE = 10;

  // Fetch Dashboard KPI Data from GET /api/v1/tenants/dashboard
  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await TenantService.getTenantDashboard();
      const data = res?.data?.data || res?.data || res;
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to fetch tenant dashboard data:", err);
    }
  }, []);

  // Fetch Tenants List from GET /api/v1/tenants
  const fetchTenants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await TenantService.getTenants();
      const raw = res?.data?.data || res?.data || res;
      const list = Array.isArray(raw) ? raw : [];

      const mapped = list.map((t) => {
        const statusRaw = t.status || "ACTIVE";
        const statusStr =
          statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1).toLowerCase();
        const planRaw = t.plan || "STARTER";
        const planStr =
          planRaw.charAt(0).toUpperCase() + planRaw.slice(1).toLowerCase();
        const formattedDate = t.createdAt
          ? new Date(t.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—";

        return {
          id: t.id,
          name: t.name || "Untitled Tenant",
          code: t.code || "",
          domain: t.domain || (t.code ? `${t.code.toLowerCase()}.erp.com` : "—"),
          plan: planStr,
          users: t.users || `${t.activeUsers || 0} active`,
          activeUsers: t.activeUsers || 0,
          status: statusStr,
          createdOn: formattedDate,
          createdAt: t.createdAt,
          adminName: t.adminName || t.name,
          email:
            t.email ||
            t.contactEmail ||
            (t.code ? `${t.code.toLowerCase()}@tenant.com` : "—"),
        };
      });

      setTenants(mapped);
    } catch (err) {
      console.error("Failed to load tenants list:", err);
      setError("Failed to load tenants. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchTenants();
  }, [fetchDashboardData, fetchTenants]);

  // KPI Calculations (real backend metrics with live tenant count fallback)
  const kpis = useMemo(() => {
    if (dashboardData) {
      const total = Number(dashboardData.totalTenants ?? tenants.length);
      const active = Number(dashboardData.activeTenants ?? 0);
      const trial = Number(dashboardData.trialTenants ?? 0);
      const suspended = Number(dashboardData.suspendedTenants ?? 0);
      const inactive = Number(
        dashboardData.inactiveTenants ?? Math.max(0, total - active - trial)
      );
      return {
        total,
        active,
        inactive: Math.max(0, inactive + suspended),
        trial,
      };
    }
    const total = tenants.length;
    const active = tenants.filter((t) => t.status === "Active").length;
    const inactive = tenants.filter(
      (t) => t.status === "Inactive" || t.status === "Suspended"
    ).length;
    const trial = tenants.filter((t) => t.status === "Trial").length;
    return { total, active, inactive, trial };
  }, [dashboardData, tenants]);

  // Status toggle handler using PUT /api/v1/tenants/{id}
  const handleToggleStatus = async (tenant) => {
    const nextStatus = tenant.status === "Active" ? "Inactive" : "Active";
    setOpenActionMenuId(null);
    try {
      await TenantService.updateTenantStatus(tenant.id, nextStatus);
      setTenants((current) =>
        current.map((item) =>
          item.id === tenant.id ? { ...item, status: nextStatus } : item
        )
      );
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to toggle tenant status:", err);
      alert("Failed to update tenant status. Please try again.");
    }
  };

  // View Details handler using GET /api/v1/tenants/{id}
  const handleViewDetails = async (tenant) => {
    setOpenActionMenuId(null);
    setDetailsLoading(true);
    try {
      const res = await TenantService.getTenant(tenant.id);
      const detail = res?.data?.data || res?.data || res;
      setSelectedTenantDetails(detail || tenant);
    } catch (err) {
      console.error("Failed to fetch tenant details:", err);
      setSelectedTenantDetails(tenant);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Search and Filter (client-side over live tenant list)
  const filteredTenants = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tenants.filter((t) => {
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.domain.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.adminName.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "All Status" ||
        t.status.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [tenants, search, statusFilter]);

  // Pagination
  const totalItems = filteredTenants.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedTenants = filteredTenants.slice(startIndex, startIndex + PAGE_SIZE);
  const displayStart = totalItems === 0 ? 0 : startIndex + 1;
  const displayEnd = Math.min(startIndex + PAGE_SIZE, totalItems);

  // UI-Only Local Drawer Creation (strictly non-API as requested)
  const handleCreateTenant = (form) => {
    const newTenant = {
      id: Date.now(),
      name: form.companyName,
      code: form.companyName.slice(0, 3).toUpperCase(),
      domain: `${form.subdomain || "company"}.erp.com`,
      plan: form.plan.replace(" Plan", "") || "Starter",
      users: `1 / ${form.maxUsers || 10}`,
      status: Number(form.trialPeriod) > 0 ? "Trial" : "Active",
      createdOn: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      adminName: form.adminName,
      email: form.adminEmail,
    };
    setTenants((prev) => [newTenant, ...prev]);
  };

  return (
    <div className="tenants-page-container">
      {/* ================= PAGE HEADER ================= */}
      <header className="tenants-header">
        <div className="tenants-header-left">
          <h1 className="tenants-title">Tenants</h1>
          <p className="tenants-subtitle">Manage all organizations using your ERP platform.</p>
        </div>
        <button
          type="button"
          className="td-btn-add-tenant"
          onClick={() => setIsDrawerOpen(true)}
        >
          <span className="td-plus-icon">+</span> Add Tenant
        </button>
      </header>

      {/* ================= 1. FOUR KPI CARDS ================= */}
      <section className="tenants-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL TENANTS</span>
            <div className="kpi-icon-wrap kpi-icon-wrap--total">🏢</div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{kpis.total}</span>
            <span className="kpi-badge kpi-badge--neutral">All registered</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">ACTIVE TENANTS</span>
            <div className="kpi-icon-wrap kpi-icon-wrap--active">✓</div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{kpis.active}</span>
            <span className="kpi-badge kpi-badge--active">Active accounts</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">INACTIVE TENANTS</span>
            <div className="kpi-icon-wrap kpi-icon-wrap--inactive">⊘</div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{kpis.inactive}</span>
            <span className="kpi-badge kpi-badge--inactive">Suspended</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">TRIAL TENANTS</span>
            <div className="kpi-icon-wrap kpi-icon-wrap--trial">⏳</div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{kpis.trial}</span>
            <span className="kpi-badge kpi-badge--trial">In evaluation</span>
          </div>
        </div>
      </section>

      {/* ================= 2. SEARCH & STATUS FILTER ================= */}
      <section className="tenants-filter-bar">
        <div className="tenants-search-box">
          <span className="tenants-search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search tenants by name, domain, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="tenants-search-input"
          />
          {search && (
            <button
              type="button"
              className="tenants-search-clear"
              onClick={() => setSearch("")}
            >
              ✕
            </button>
          )}
        </div>

        <div className="tenants-status-dropdown-wrap">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="tenants-status-select"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Trial">Trial</option>
          </select>
          <span className="tenants-select-chevron">▾</span>
        </div>
      </section>

      {/* ================= 3. TENANTS TABLE ================= */}
      <section className="tenants-table-card">
        <div className="tenants-table-responsive">
          <table className="tenants-table">
            <thead>
              <tr>
                <th className="th-col-num">#</th>
                <th className="th-col-company">Company Name</th>
                <th className="th-col-domain">Domain</th>
                <th className="th-col-plan">Plan</th>
                <th className="th-col-users">Users</th>
                <th className="th-col-status">Status</th>
                <th className="th-col-created">Created On</th>
                <th className="th-col-actions text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="tenants-empty-cell">
                    <div className="tenants-empty-state">
                      <span className="tenants-empty-icon">⏳</span>
                      <p className="tenants-empty-title">Loading tenants...</p>
                      <p className="tenants-empty-desc">
                        Fetching live organization records from ERP platform.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="tenants-empty-cell">
                    <div className="tenants-empty-state">
                      <span className="tenants-empty-icon">⚠️</span>
                      <p className="tenants-empty-title" style={{ color: "#b91c1c" }}>
                        {error}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          fetchDashboardData();
                          fetchTenants();
                        }}
                        className="pagination-btn"
                        style={{ marginTop: "12px", padding: "6px 14px", border: "1px solid #d1d5db" }}
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : paginatedTenants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="tenants-empty-cell">
                    <div className="tenants-empty-state">
                      <span className="tenants-empty-icon">🏢</span>
                      <p className="tenants-empty-title">No tenants found</p>
                      <p className="tenants-empty-desc">
                        No organization matched your current filter criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTenants.map((tenant, idx) => {
                  const rowNumber = startIndex + idx + 1;
                  const isMenuOpen = openActionMenuId === tenant.id;

                  return (
                    <tr key={tenant.id} className="tenants-table-row">
                      {/* # */}
                      <td className="td-col-num">{rowNumber}</td>

                      {/* Company Name */}
                      <td className="td-col-company">
                        <div className="tenant-company-info">
                          <div className="tenant-avatar">
                            {tenant.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <strong className="tenant-name">{tenant.name}</strong>
                            <span className="tenant-admin-email">{tenant.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Domain */}
                      <td className="td-col-domain">
                        <a
                          href={`https://${tenant.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="tenant-domain-link"
                        >
                          {tenant.domain}
                        </a>
                      </td>

                      {/* Plan */}
                      <td className="td-col-plan">
                        <span className="tenant-plan-pill">{tenant.plan}</span>
                      </td>

                      {/* Users */}
                      <td className="td-col-users">
                        <span className="tenant-users-count">{tenant.users}</span>
                      </td>

                      {/* Status */}
                      <td className="td-col-status">
                        <span
                          className={`tenant-status-badge tenant-status-badge--${tenant.status.toLowerCase()}`}
                        >
                          <span className="status-dot" />
                          {tenant.status}
                        </span>
                      </td>

                      {/* Created On */}
                      <td className="td-col-created">{tenant.createdOn}</td>

                      {/* Actions */}
                      <td className="td-col-actions text-right">
                        <div className="action-menu-container">
                          <button
                            type="button"
                            className="action-menu-trigger"
                            onClick={() =>
                              setOpenActionMenuId(isMenuOpen ? null : tenant.id)
                            }
                            aria-label="Actions"
                          >
                            •••
                          </button>

                          {isMenuOpen && (
                            <>
                              <div
                                className="action-menu-backdrop"
                                onClick={() => setOpenActionMenuId(null)}
                              />
                              <div className="action-menu-popover">
                                <button
                                  type="button"
                                  className="action-menu-item"
                                  onClick={() => handleViewDetails(tenant)}
                                >
                                  <span>👁</span> View Details
                                </button>
                                <button
                                  type="button"
                                  className="action-menu-item"
                                  onClick={() => setOpenActionMenuId(null)}
                                >
                                  <span>✏️</span> Edit Tenant
                                </button>
                                <button
                                  type="button"
                                  className="action-menu-item"
                                  onClick={() => setOpenActionMenuId(null)}
                                >
                                  <span>💳</span> Manage Subscription
                                </button>
                                <div className="action-menu-divider" />
                                <button
                                  type="button"
                                  className={`action-menu-item ${
                                    tenant.status === "Active"
                                      ? "action-menu-item--danger"
                                      : "action-menu-item--success"
                                  }`}
                                  onClick={() => handleToggleStatus(tenant)}
                                >
                                  <span>{tenant.status === "Active" ? "⊘" : "✓"}</span>
                                  {tenant.status === "Active"
                                    ? "Deactivate Tenant"
                                    : "Activate Tenant"}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ================= 5. PAGINATION ================= */}
        <div className="tenants-pagination-bar">
          <div className="tenants-pagination-info">
            Showing {displayStart} to {displayEnd} of {totalItems} tenants
          </div>

          <div className="tenants-pagination-controls">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="pagination-btn pagination-btn--nav"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`pagination-btn ${
                  currentPage === pageNum ? "pagination-btn--active" : ""
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages || totalItems === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="pagination-btn pagination-btn--nav"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* ================= TENANT DETAILS MODAL ================= */}
      {selectedTenantDetails && (
        <div
          className="td-drawer-backdrop"
          onClick={(e) => e.target === e.currentTarget && setSelectedTenantDetails(null)}
        >
          <div className="td-details-modal" role="dialog" aria-modal="true">
            <div className="td-drawer-header">
              <div>
                <h2 className="td-drawer-title">Tenant Details</h2>
                <p className="td-drawer-subtitle">
                  {selectedTenantDetails.name || "Organization Overview"}
                </p>
              </div>
              <button
                type="button"
                className="td-drawer-close"
                onClick={() => setSelectedTenantDetails(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="td-details-body">
              <div className="td-details-grid">
                <div className="td-detail-item">
                  <span className="td-detail-label">Tenant ID</span>
                  <span className="td-detail-val">#{selectedTenantDetails.id}</span>
                </div>
                <div className="td-detail-item">
                  <span className="td-detail-label">Tenant Code</span>
                  <span className="td-detail-val">{selectedTenantDetails.code || "—"}</span>
                </div>
                <div className="td-detail-item">
                  <span className="td-detail-label">Company Name</span>
                  <span className="td-detail-val"><strong>{selectedTenantDetails.name}</strong></span>
                </div>
                <div className="td-detail-item">
                  <span className="td-detail-label">Status</span>
                  <span className="td-detail-val">
                    <span
                      className={`tenant-status-badge tenant-status-badge--${(
                        selectedTenantDetails.status || "active"
                      ).toLowerCase()}`}
                    >
                      <span className="status-dot" />
                      {selectedTenantDetails.status}
                    </span>
                  </span>
                </div>
                <div className="td-detail-item">
                  <span className="td-detail-label">Plan</span>
                  <span className="td-detail-val">
                    <span className="tenant-plan-pill">{selectedTenantDetails.plan}</span>
                  </span>
                </div>
                <div className="td-detail-item">
                  <span className="td-detail-label">Max Users</span>
                  <span className="td-detail-val">{selectedTenantDetails.maxUsers ?? 10}</span>
                </div>
                <div className="td-detail-item">
                  <span className="td-detail-label">Contact Email</span>
                  <span className="td-detail-val">
                    {selectedTenantDetails.contactEmail || selectedTenantDetails.email || "—"}
                  </span>
                </div>
                <div className="td-detail-item">
                  <span className="td-detail-label">Contact Phone</span>
                  <span className="td-detail-val">{selectedTenantDetails.contactPhone || "—"}</span>
                </div>
                <div className="td-detail-item">
                  <span className="td-detail-label">Currency</span>
                  <span className="td-detail-val">{selectedTenantDetails.currency || "INR"}</span>
                </div>
                <div className="td-detail-item">
                  <span className="td-detail-label">Timezone</span>
                  <span className="td-detail-val">{selectedTenantDetails.timezone || "Asia/Kolkata"}</span>
                </div>
                <div className="td-detail-item">
                  <span className="td-detail-label">Created On</span>
                  <span className="td-detail-val">
                    {selectedTenantDetails.createdAt
                      ? new Date(selectedTenantDetails.createdAt).toLocaleString("en-GB")
                      : (selectedTenantDetails.createdOn || "—")}
                  </span>
                </div>
                <div className="td-detail-item">
                  <span className="td-detail-label">Last Updated</span>
                  <span className="td-detail-val">
                    {selectedTenantDetails.updatedAt
                      ? new Date(selectedTenantDetails.updatedAt).toLocaleString("en-GB")
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="td-drawer-footer">
              <button
                type="button"
                className="td-btn-cancel"
                onClick={() => setSelectedTenantDetails(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 6-10. ADD TENANT DRAWER ================= */}
      <AddTenantDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleCreateTenant}
      />

      {/* ================= STYLES ================= */}
      <style>{`
        /* ── Details Modal ── */
        .td-details-modal {
          background: #ffffff;
          width: 100%;
          max-width: 540px;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: tdFadeIn 0.2s ease-out;
        }
        .td-details-body {
          padding: 24px;
          overflow-y: auto;
          max-height: 70vh;
        }
        .td-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .td-detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: #faf9f6;
          border: 1px solid #e5e4de;
          border-radius: 8px;
          padding: 10px 14px;
        }
        .td-detail-label {
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .td-detail-val {
          font-size: 13px;
          color: #111410;
          word-break: break-all;
        }

        /* ── Page Root ── */
        .tenants-page-container {
          width: 100%;
          min-height: 100%;
          background: #f5f4ef;
          padding: 24px 32px 48px;
          box-sizing: border-box;
          color: #111410;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* ── Header ── */
        .tenants-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .tenants-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 26px;
          font-weight: 700;
          color: #111410;
          letter-spacing: -0.3px;
        }

        .tenants-subtitle {
          margin: 4px 0 0;
          font-size: 13px;
          color: #7a7970;
        }

        .td-btn-add-tenant {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 20px;
          background: #111410;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, transform 0.05s;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .td-btn-add-tenant:hover {
          background: #222620;
        }

        .td-plus-icon {
          font-size: 16px;
          line-height: 1;
        }

        /* ── 1. KPI Cards Grid ── */
        .tenants-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 22px;
        }

        .kpi-card {
          background: #ffffff;
          border: 1px solid #e1dfd8;
          border-radius: 14px;
          padding: 18px 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .kpi-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .kpi-label {
          font-size: 11px;
          font-weight: 700;
          color: #8c897f;
          letter-spacing: 0.8px;
        }

        .kpi-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          display: grid;
          place-items: center;
          font-size: 14px;
        }

        .kpi-icon-wrap--total {
          background: #f5f4ef;
          color: #333;
        }

        .kpi-icon-wrap--active {
          background: #edf2e8;
          color: #2e6e22;
        }

        .kpi-icon-wrap--inactive {
          background: #fdf0ec;
          color: #c0392b;
        }

        .kpi-icon-wrap--trial {
          background: #fbf5e6;
          color: #b45309;
        }

        .kpi-value-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }

        .kpi-value {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
          font-weight: 700;
          color: #111410;
          line-height: 1;
        }

        .kpi-badge {
          font-size: 11px;
          font-weight: 500;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .kpi-badge--neutral {
          background: #f5f4ef;
          color: #6a6a60;
        }

        .kpi-badge--active {
          background: #eef6eb;
          color: #2e6e22;
        }

        .kpi-badge--inactive {
          background: #faebe8;
          color: #a8281a;
        }

        .kpi-badge--trial {
          background: #fef3c7;
          color: #92400e;
        }

        /* ── 2. Filter Bar ── */
        .tenants-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .tenants-search-box {
          flex: 1;
          max-width: 480px;
          height: 40px;
          background: #ffffff;
          border: 1px solid #e1dfd8;
          border-radius: 11px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          transition: border-color 0.15s;
        }

        .tenants-search-box:focus-within {
          border-color: #111410;
        }

        .tenants-search-icon {
          font-size: 18px;
          color: #a6a39b;
          margin-right: 10px;
        }

        .tenants-search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 13px;
          color: #111410;
        }

        .tenants-search-input::placeholder {
          color: #a6a39b;
        }

        .tenants-search-clear {
          background: none;
          border: none;
          color: #8c897f;
          font-size: 12px;
          cursor: pointer;
          padding: 2px 6px;
        }

        .tenants-status-dropdown-wrap {
          position: relative;
          min-width: 170px;
        }

        .tenants-status-select {
          width: 100%;
          height: 40px;
          background: #ffffff;
          border: 1px solid #e1dfd8;
          border-radius: 11px;
          padding: 0 32px 0 14px;
          font-size: 13px;
          color: #111410;
          appearance: none;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s;
        }

        .tenants-status-select:focus {
          border-color: #111410;
        }

        .tenants-select-chevron {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 11px;
          color: #8c897f;
          pointer-events: none;
        }

        /* ── 3. Table Card ── */
        .tenants-table-card {
          background: #ffffff;
          border: 1px solid #e1dfd8;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }

        .tenants-table-responsive {
          overflow-x: auto;
          width: 100%;
        }

        .tenants-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
        }

        .tenants-table thead th {
          background: #faf9f5;
          color: #8c897f;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          padding: 12px 18px;
          border-bottom: 1px solid #e5e2db;
          white-space: nowrap;
        }

        .tenants-table tbody tr {
          border-bottom: 1px solid #ece9e0;
          transition: background 0.1s;
        }

        .tenants-table tbody tr:last-child {
          border-bottom: none;
        }

        .tenants-table tbody tr:hover {
          background: #faf9f5;
        }

        .tenants-table td {
          padding: 14px 18px;
          vertical-align: middle;
        }

        .td-col-num {
          color: #8c897f;
          font-size: 12px;
          width: 40px;
        }

        .tenant-company-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tenant-avatar {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: #f3f1e9;
          border: 1px solid #dfdbd0;
          color: #444;
          font-weight: 700;
          font-size: 11px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .tenant-name {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #111410;
        }

        .tenant-admin-email {
          display: block;
          font-size: 11px;
          color: #8c897f;
        }

        .tenant-domain-link {
          color: #1b4d3e;
          font-family: monospace;
          font-size: 12px;
          text-decoration: none;
        }

        .tenant-domain-link:hover {
          text-decoration: underline;
        }

        .tenant-plan-pill {
          display: inline-block;
          padding: 4px 10px;
          background: #f5f4ef;
          border: 1px solid #e1dfd8;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 500;
          color: #333;
        }

        .tenant-users-count {
          font-family: monospace;
          font-size: 12px;
          color: #555;
        }

        /* ── Status Badges ── */
        .tenant-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 600;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .tenant-status-badge--active {
          background: #edf6ea;
          color: #2a6a1f;
        }
        .tenant-status-badge--active .status-dot {
          background: #388e2c;
        }

        .tenant-status-badge--inactive {
          background: #faece8;
          color: #9d2b1f;
        }
        .tenant-status-badge--inactive .status-dot {
          background: #c0392b;
        }

        .tenant-status-badge--trial {
          background: #fef3c7;
          color: #92400e;
        }
        .tenant-status-badge--trial .status-dot {
          background: #d97706;
        }

        .td-col-created {
          font-size: 12px;
          color: #7a7970;
          white-space: nowrap;
        }

        /* ── 4. Action Menu ── */
        .action-menu-container {
          position: relative;
          display: inline-block;
        }

        .action-menu-trigger {
          width: 32px;
          height: 32px;
          background: #ffffff;
          border: 1px solid #e1dfd8;
          border-radius: 8px;
          color: #6a6a60;
          cursor: pointer;
          font-size: 13px;
          display: grid;
          place-items: center;
          letter-spacing: 1px;
          transition: all 0.15s;
        }

        .action-menu-trigger:hover {
          background: #f5f4ef;
          border-color: #cac6bc;
          color: #111410;
        }

        .action-menu-backdrop {
          position: fixed;
          inset: 0;
          z-index: 99;
        }

        .action-menu-popover {
          position: absolute;
          right: 0;
          top: 36px;
          width: 190px;
          background: #ffffff;
          border: 1px solid #e1dfd8;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          z-index: 100;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .action-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 10px;
          background: none;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          color: #333330;
          cursor: pointer;
          text-align: left;
          transition: background 0.1s;
        }

        .action-menu-item:hover {
          background: #f5f4ef;
        }

        .action-menu-item--danger {
          color: #c0392b;
        }
        .action-menu-item--danger:hover {
          background: #fef2f2;
        }

        .action-menu-item--success {
          color: #2e6e22;
        }
        .action-menu-item--success:hover {
          background: #f0fdf4;
        }

        .action-menu-divider {
          height: 1px;
          background: #ece9e0;
          margin: 4px 0;
        }

        /* ── Empty State ── */
        .tenants-empty-cell {
          text-align: center;
          padding: 60px 20px !important;
        }

        .tenants-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .tenants-empty-icon {
          font-size: 36px;
          margin-bottom: 10px;
          opacity: 0.6;
        }

        .tenants-empty-title {
          font-size: 15px;
          font-weight: 600;
          color: #111410;
          margin: 0 0 4px;
        }

        .tenants-empty-desc {
          font-size: 12px;
          color: #8c897f;
          margin: 0;
        }

        /* ── 5. Pagination Bar ── */
        .tenants-pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-top: 1px solid #ece9e0;
          background: #ffffff;
        }

        .tenants-pagination-info {
          font-size: 12px;
          color: #7a7970;
        }

        .tenants-pagination-controls {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pagination-btn {
          min-width: 32px;
          height: 32px;
          padding: 0 10px;
          background: #ffffff;
          border: 1px solid #e1dfd8;
          border-radius: 8px;
          font-size: 12px;
          color: #333330;
          cursor: pointer;
          transition: all 0.15s;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f5f4ef;
          border-color: #cac6bc;
        }

        .pagination-btn--active {
          background: #111410 !important;
          color: #ffffff !important;
          border-color: #111410 !important;
          font-weight: 600;
        }

        .pagination-btn--nav {
          font-weight: 500;
        }

        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* ── 6-10. Drawer Component Styles ── */
        .td-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(16, 19, 15, 0.48);
          backdrop-filter: blur(2px);
          z-index: 1040;
          display: flex;
          justify-content: flex-end;
          animation: td-fade-in 0.2s ease-out;
        }

        @keyframes td-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .td-drawer {
          width: 640px;
          max-width: 96vw;
          height: 100vh;
          background: #f5f4ef;
          border-left: 1px solid #e1dfd8;
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.18);
          display: flex;
          flex-direction: column;
          animation: td-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          overflow: hidden;
        }

        @keyframes td-slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        /* Fixed Header */
        .td-drawer-header {
          flex-shrink: 0;
          padding: 22px 28px 18px;
          background: #f5f4ef;
          border-bottom: 1px solid #e1dfd8;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .td-drawer-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 21px;
          font-weight: 700;
          color: #111410;
        }

        .td-drawer-subtitle {
          margin: 4px 0 0;
          font-size: 12px;
          color: #7a7970;
        }

        .td-drawer-close {
          width: 32px;
          height: 32px;
          background: #ffffff;
          border: 1px solid #e1dfd8;
          border-radius: 9px;
          font-size: 14px;
          color: #7a7970;
          cursor: pointer;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          transition: all 0.15s;
        }

        .td-drawer-close:hover {
          background: #ece9e0;
          color: #111410;
        }

        /* Scrollable Body */
        .td-drawer-body {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 16px 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .td-form-section {
          background: #ffffff;
          border: 1px solid #e1dfd8;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .td-section-head {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #ece9e0;
        }

        .td-section-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f5f4ef;
          border: 1px solid #e1dfd8;
          display: grid;
          place-items: center;
          font-size: 15px;
          flex-shrink: 0;
        }

        .td-section-title {
          margin: 0;
          font-size: 12px;
          font-weight: 700;
          color: #111410;
          letter-spacing: 0.5px;
        }

        .td-section-desc {
          font-size: 11px;
          color: #8c897f;
        }

        /* Form Grids */
        .td-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .td-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }

        .td-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .td-label {
          font-size: 11px;
          font-weight: 600;
          color: #4a4a40;
        }

        .td-req {
          color: #c0392b;
        }

        .td-input {
          width: 100%;
          height: 38px;
          padding: 0 12px;
          border: 1px solid #e0ddd5;
          border-radius: 9px;
          background: #faf9f5;
          font-size: 12px;
          color: #111410;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s, background 0.15s;
        }

        .td-input:focus {
          border-color: #111410;
          background: #ffffff;
        }

        .td-input--err {
          border-color: #c0392b !important;
          background: #fef8f7 !important;
        }

        .td-err-msg {
          font-size: 10px;
          color: #c0392b;
        }

        .td-textarea {
          height: auto;
          min-height: 60px;
          padding: 8px 12px;
          resize: vertical;
        }

        /* Domain Input Group */
        .td-domain-wrap {
          display: flex;
          align-items: center;
          height: 38px;
          border: 1px solid #e0ddd5;
          border-radius: 9px;
          background: #faf9f5;
          overflow: hidden;
          transition: border-color 0.15s;
        }

        .td-domain-wrap:focus-within {
          border-color: #111410;
          background: #ffffff;
        }

        .td-domain-prefix,
        .td-domain-suffix {
          padding: 0 8px;
          font-size: 11px;
          font-family: monospace;
          color: #8c897f;
          user-select: none;
          background: #f0eee6;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .td-input--domain {
          border: none !important;
          background: transparent !important;
          padding: 0 8px;
          height: 100%;
          flex: 1;
        }

        /* Select Wrappers */
        .td-select-wrap {
          position: relative;
        }

        .td-select {
          width: 100%;
          height: 38px;
          padding: 0 32px 0 12px;
          border: 1px solid #e0ddd5;
          border-radius: 9px;
          background: #faf9f5;
          font-size: 12px;
          color: #111410;
          appearance: none;
          outline: none;
          cursor: pointer;
          box-sizing: border-box;
          transition: border-color 0.15s;
        }

        .td-select:focus {
          border-color: #111410;
          background: #ffffff;
        }

        .td-chevron {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          color: #8c897f;
          pointer-events: none;
        }

        /* Dropzone */
        .td-dropzone {
          border: 1.5px dashed #ccc9be;
          border-radius: 11px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          background: #fbfaf6;
          transition: border-color 0.15s, background 0.15s;
        }

        .td-dropzone:hover {
          border-color: #111410;
          background: #f3f1e9;
        }

        .td-file-hidden {
          display: none;
        }

        .td-dropzone-icon {
          font-size: 20px;
          color: #9a988f;
        }

        .td-dropzone-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 12px;
          color: #4a4a40;
        }

        .td-dropzone-text span {
          font-size: 10px;
          color: #8c897f;
        }

        /* Phone Input Group */
        .td-phone-wrap {
          display: flex;
          gap: 8px;
        }

        .td-phone-code {
          width: 92px;
          height: 38px;
          padding: 0 8px;
          border: 1px solid #e0ddd5;
          border-radius: 9px;
          background: #faf9f5;
          font-size: 11px;
          color: #111410;
          outline: none;
          cursor: pointer;
        }

        .td-input--phone {
          flex: 1;
        }

        /* Toggles Box */
        .td-toggles-box {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 8px;
          border-top: 1px solid #ece9e0;
        }

        .td-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .td-toggle-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .td-toggle-label {
          font-size: 12px;
          font-weight: 600;
          color: #111410;
        }

        .td-toggle-desc {
          font-size: 11px;
          color: #8c897f;
        }

        .td-toggle-btn {
          width: 42px;
          height: 24px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          position: relative;
          transition: background 0.15s;
          flex-shrink: 0;
        }

        .td-toggle-btn--on {
          background: #2e6e22;
        }

        .td-toggle-btn--off {
          background: #d3cfc5;
        }

        .td-toggle-thumb {
          position: absolute;
          top: 2px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          transition: left 0.15s;
        }

        .td-toggle-thumb--on {
          left: 20px;
        }

        .td-toggle-thumb--off {
          left: 2px;
        }

        /* Fixed Footer */
        .td-drawer-footer {
          flex-shrink: 0;
          padding: 16px 28px;
          background: #f5f4ef;
          border-top: 1px solid #e1dfd8;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .td-btn-cancel {
          height: 38px;
          padding: 0 18px;
          background: #ffffff;
          border: 1px solid #e0ddd5;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 500;
          color: #333330;
          cursor: pointer;
          transition: background 0.15s;
        }

        .td-btn-cancel:hover {
          background: #ece9e0;
        }

        .td-btn-submit {
          height: 38px;
          padding: 0 22px;
          background: #111410;
          border: none;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
          transition: background 0.15s;
        }

        .td-btn-submit:hover {
          background: #222620;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .tenants-kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .tenants-page-container {
            padding: 18px 16px 36px;
          }

          .tenants-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }

          .tenants-filter-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .tenants-search-box {
            max-width: 100%;
          }

          .td-drawer {
            width: 100vw;
            max-width: 100vw;
          }

          .td-drawer-header,
          .td-drawer-body,
          .td-drawer-footer {
            padding-left: 18px;
            padding-right: 18px;
          }

          .td-grid-2,
          .td-grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Tenants;
