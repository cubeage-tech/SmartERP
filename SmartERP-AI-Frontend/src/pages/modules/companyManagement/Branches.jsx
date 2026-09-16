import React, { useEffect, useState } from "react";
import CompanyManagementService from "../../../core/services/modules/companyManagement.service";
import useActiveCompany from "../../../core/hooks/useActiveCompany";

// ─── Dropdown options ─────────────────────────────────────────────────────────
const COMPANIES    = ["Acme Manufacturing Ltd", "Acme Exports Pvt Ltd"];
const BRANCH_TYPES = ["Head Office", "Sales Office", "Manufacturing", "Regional Office", "Warehouse", "Service Centre"];
const COUNTRIES    = ["India", "United States", "United Kingdom", "UAE", "Singapore", "Australia"];
const STATES       = ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat", "Rajasthan", "Uttar Pradesh", "West Bengal", "Telangana", "Kerala"];
const CITIES       = ["Mumbai", "Pune", "Bengaluru", "Chennai", "Delhi", "Hyderabad", "Ahmedabad", "Kolkata", "Surat", "Jaipur"];

const EMPTY = {
  company: "Acme Manufacturing Ltd",
  branchName: "", branchCode: "", branchType: "",
  manager: "", contactNumber: "", email: "",
  address1: "", address2: "",
  country: "", state: "", city: "", pincode: "",
  gstNumber: "", status: "active",
};

// ─── Reusable field helpers (Module-level to prevent remounting/focus loss) ───
const Input = ({ label, value, onChange, placeholder, required, icon, type = "text", error }) => (
  <div className="abm-field">
    <label>{label}{required && <span className="abm-req"> *</span>}</label>
    <div className={icon ? "abm-icon-wrap" : ""}>
      {icon && <span className="abm-fi">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`abm-input${icon ? " abm-input--icon" : ""}${error ? " abm-input--err" : ""}`}
      />
    </div>
    {error && <span className="abm-err">{error}</span>}
  </div>
);

const Select = ({ label, value, onChange, options, placeholder, required, error }) => (
  <div className="abm-field">
    <label>{label}{required && <span className="abm-req"> *</span>}</label>
    <div className="abm-sel-wrap">
      <select
        value={value}
        onChange={onChange}
        className={`abm-select${error ? " abm-input--err" : ""}`}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="abm-chev">▾</span>
    </div>
    {error && <span className="abm-err">{error}</span>}
  </div>
);

// ─── Add Branch Modal ─────────────────────────────────────────────────────────
function AddBranchModal({ onClose, onSubmit, companyOptions = COMPANIES, companyName }) {
  const [form,   setForm]   = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const set = (f, v) => {
    setForm(p => ({ ...p, [f]: v }));
    setErrors(p => ({ ...p, [f]: "" }));
  };

  const validate = () => {
    const rules = {
      company:       "Company",
      branchName:    "Branch Name",
      branchCode:    "Branch Code",
      branchType:    "Branch Type",
      contactNumber: "Contact Number",
      email:         "Email",
      address1:      "Address Line 1",
      country:       "Country",
      state:         "State",
      city:          "City",
      pincode:       "Pincode",
    };
    const e = {};
    Object.entries(rules).forEach(([k, label]) => {
      if (!form[k]?.trim()) e[k] = `${label} is required`;
    });
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = () => { if (validate()) { onSubmit(form); onClose(); } };

  return (
    <div className="abm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="abm-modal">

        {/* ── Header ── */}
        <div className="abm-head">
          <div>
            <h2>Add Branch</h2>
            <p>Add a new branch under {companyName || "selected company"}</p>
          </div>
          <button className="abm-close" onClick={onClose}>✕</button>
        </div>

        {/* ── Body ── */}
        <div className="abm-body">

          {/* ─ Section 1: Branch Information ─ */}
          <div className="abm-section">
            <div className="abm-sec-head">
              <div className="abm-sec-icon">🏢</div>
              <div>
                <strong>Branch Information</strong>
                <span>Enter basic details about the branch</span>
              </div>
            </div>

            {/* Row 1 */}
            <div className="abm-grid-2">
              <Select label="Company"     value={form.company} onChange={e => set("company", e.target.value)} options={companyOptions} placeholder="Select company" required error={errors.company} />
              <Input  label="Branch Name" value={form.branchName} onChange={e => set("branchName", e.target.value)} placeholder="Enter branch name" required error={errors.branchName} />
            </div>

            {/* Row 2 */}
            <div className="abm-grid-2">
              <Input  label="Branch Code" value={form.branchCode} onChange={e => set("branchCode", e.target.value)} placeholder="Enter branch code" required error={errors.branchCode} />
              <Select label="Branch Type" value={form.branchType} onChange={e => set("branchType", e.target.value)} options={BRANCH_TYPES} placeholder="Select branch type" required error={errors.branchType} />
            </div>

            {/* Row 3 */}
            <div className="abm-grid-2">
              <Input label="Branch Manager"  value={form.manager} onChange={e => set("manager", e.target.value)} placeholder="Enter branch manager name" icon="👤" error={errors.manager} />
              <Input label="Contact Number"  value={form.contactNumber} onChange={e => set("contactNumber", e.target.value)} placeholder="Enter contact number" icon="📞" required error={errors.contactNumber} />
            </div>

            {/* Row 4 — Email half-width */}
            <div className="abm-grid-2">
              <Input label="Email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="Enter branch email" icon="✉" type="email" required error={errors.email} />
              <div />
            </div>
          </div>

          {/* ─ Section 2: Branch Address ─ */}
          <div className="abm-section">
            <div className="abm-sec-head">
              <div className="abm-sec-icon">📍</div>
              <div>
                <strong>Branch Address</strong>
                <span>Enter the complete address of the branch</span>
              </div>
            </div>

            <div className="abm-grid-2">
              <Input label="Address Line 1" value={form.address1} onChange={e => set("address1", e.target.value)} placeholder="Enter address line 1" required error={errors.address1} />
              <Input label="Address Line 2" value={form.address2} onChange={e => set("address2", e.target.value)} placeholder="Enter address line 2 (optional)" error={errors.address2} />
            </div>

            <div className="abm-grid-4">
              <Select label="Country" value={form.country} onChange={e => set("country", e.target.value)} options={COUNTRIES} placeholder="Select country" required error={errors.country} />
              <Select label="State"   value={form.state} onChange={e => set("state", e.target.value)} options={STATES} placeholder="Select state" required error={errors.state} />
              <Select label="City"    value={form.city} onChange={e => set("city", e.target.value)} options={CITIES} placeholder="Select city" required error={errors.city} />
              <Input  label="Pincode" value={form.pincode} onChange={e => set("pincode", e.target.value)} placeholder="Enter pincode" required error={errors.pincode} />
            </div>
          </div>

          {/* ─ Section 3: Additional Information ─ */}
          <div className="abm-section">
            <div className="abm-sec-head">
              <div className="abm-sec-icon">ℹ</div>
              <div>
                <strong>Additional Information</strong>
                <span>Other details about the branch</span>
              </div>
            </div>

            <div className="abm-grid-2">
              {/* GST Number */}
              <Input label="GST Number" value={form.gstNumber} onChange={e => set("gstNumber", e.target.value)} placeholder="Enter GST number (optional)" error={errors.gstNumber} />

              {/* Status */}
              <div className="abm-field">
                <label>Status <span className="abm-req">*</span></label>
                <div className="abm-status-row">
                  <label className={`abm-status-pill${form.status === "active" ? " abm-pill--on" : ""}`}>
                    <input
                      type="radio" name="abm-status" value="active"
                      checked={form.status === "active"}
                      onChange={() => set("status", "active")}
                    />
                    <span className="abm-dot" />
                    Active
                  </label>
                  <label className={`abm-status-pill${form.status === "inactive" ? " abm-pill--off" : ""}`}>
                    <input
                      type="radio" name="abm-status" value="inactive"
                      checked={form.status === "inactive"}
                      onChange={() => set("status", "inactive")}
                    />
                    <span className="abm-dot abm-dot--grey" />
                    Inactive
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="abm-footer">
          <button className="abm-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="abm-btn-submit" onClick={submit}>Create Branch</button>
        </div>

      </div>

      {/* ── Scoped styles ── */}
      <style>{`
        /* Overlay */
        .abm-overlay {
          position: fixed; inset: 0;
          background: rgba(16,19,15,0.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px;
        }

        /* Modal shell */
        .abm-modal {
          background: #f5f4ef;
          border: 1px solid #e1dfd8;
          border-radius: 18px;
          width: 100%; max-width: 760px;
          max-height: 90vh;
          display: flex; flex-direction: column;
          box-shadow: 0 20px 50px rgba(0,0,0,0.16);
          overflow: hidden;
        }

        /* Header */
        .abm-head {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 22px 26px 16px;
          border-bottom: 1px solid #e1dfd8;
          background: #f5f4ef;
          flex-shrink: 0;
        }

        .abm-head h2 {
          margin: 0 0 4px;
          font-size: 20px; font-weight: 700; color: #10130f;
        }

        .abm-head p {
          margin: 0; font-size: 12px; color: #99988f;
        }

        .abm-close {
          background: #fff; border: 1px solid #e1dfd8;
          width: 32px; height: 32px; border-radius: 9px;
          font-size: 14px; color: #7a7970; cursor: pointer;
          display: grid; place-items: center; flex-shrink: 0;
        }

        .abm-close:hover { background: #ece9e0; color: #10130f; }

        /* Scrollable body */
        .abm-body {
          overflow-y: auto;
          padding: 0 26px 20px;
          display: flex; flex-direction: column; gap: 0;
          background: #f5f4ef;
        }

        /* Section card */
        .abm-section {
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 14px;
          padding: 20px 18px;
          margin-top: 14px;
          display: flex; flex-direction: column; gap: 14px;
        }

        /* Section heading */
        .abm-sec-head {
          display: flex; align-items: flex-start; gap: 12px;
          padding-bottom: 14px;
          border-bottom: 1px solid #ece9e0;
        }

        .abm-sec-icon {
          width: 36px; height: 36px;
          background: #f5f4ef;
          border: 1px solid #e1dfd8;
          border-radius: 10px;
          display: grid; place-items: center;
          font-size: 16px; flex-shrink: 0;
        }

        .abm-sec-head strong {
          display: block;
          font-size: 14px; font-weight: 600; color: #10130f;
          margin-bottom: 3px;
        }

        .abm-sec-head span {
          font-size: 11px; color: #99988f;
        }

        /* Grids */
        .abm-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .abm-grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; }

        /* Field */
        .abm-field { display: flex; flex-direction: column; gap: 5px; }

        .abm-field label {
          font-size: 12px; font-weight: 500; color: #4a4a40;
        }

        .abm-req { color: #c0392b; }

        /* Input */
        .abm-input {
          width: 100%; padding: 11px 13px;
          border: 1px solid #e0ddd5; border-radius: 10px;
          font-size: 13px; color: #10130f;
          background: #faf9f5;
          outline: none; box-sizing: border-box;
          transition: border-color 0.15s, background 0.15s;
        }

        .abm-input::placeholder { color: #b8b5ad; }
        .abm-input:focus  { border-color: #10130f; background: #fff; }
        .abm-input--err   { border-color: #c0392b !important; }

        /* Icon-prefixed input */
        .abm-icon-wrap  { position: relative; }
        .abm-fi {
          position: absolute; left: 11px; top: 50%;
          transform: translateY(-50%);
          font-size: 13px; color: #b0ada5; pointer-events: none;
        }
        .abm-input--icon { padding-left: 32px; }

        /* Select */
        .abm-sel-wrap { position: relative; }

        .abm-select {
          width: 100%; padding: 11px 34px 11px 13px;
          border: 1px solid #e0ddd5; border-radius: 10px;
          font-size: 13px; color: #10130f;
          background: #faf9f5;
          appearance: none; outline: none; cursor: pointer;
          box-sizing: border-box;
          transition: border-color 0.15s;
        }

        .abm-select:focus { border-color: #10130f; background: #fff; }

        .abm-chev {
          position: absolute; right: 11px; top: 50%;
          transform: translateY(-50%);
          color: #9a9890; font-size: 11px; pointer-events: none;
        }

        .abm-err { font-size: 11px; color: #c0392b; }

        /* Status pills — matching the screenshot */
        .abm-status-row {
          display: flex; gap: 10px; flex-wrap: wrap;
          padding-top: 2px;
        }

        .abm-status-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 18px;
          border: 1.5px solid #e1dfd8;
          border-radius: 50px;
          cursor: pointer; font-size: 13px; color: #3a3a30;
          background: #faf9f5;
          transition: border-color 0.15s, background 0.15s;
          user-select: none;
        }

        .abm-status-pill input[type="radio"] { display: none; }

        .abm-dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: #3d8a30; flex-shrink: 0;
        }

        .abm-dot--grey { background: #b0b0a8; }

        .abm-pill--on {
          border-color: #7dba6a;
          background: #f2faf0;
          color: #2e6e22;
        }

        .abm-pill--on .abm-dot  { background: #3d8a30; }

        /* Footer */
        .abm-footer {
          display: flex; justify-content: flex-end; gap: 10px;
          padding: 16px 26px;
          border-top: 1px solid #e1dfd8;
          background: #f5f4ef;
          flex-shrink: 0;
        }

        .abm-btn-cancel {
          height: 38px; padding: 0 20px;
          border: 1px solid #e0ddd5; border-radius: 12px;
          background: #fff; color: #20221e;
          font-size: 12px; font-weight: 500; cursor: pointer;
        }

        .abm-btn-cancel:hover { background: #ece9e0; }

        .abm-btn-submit {
          height: 38px; padding: 0 22px;
          border: none; border-radius: 12px;
          background: #111410; color: #fff;
          font-size: 12px; font-weight: 500; cursor: pointer;
          transition: background 0.15s;
        }

        .abm-btn-submit:hover { background: #1e2419; }

        /* Responsive */
        @media (max-width: 680px) {
          .abm-grid-2, .abm-grid-4 { grid-template-columns: 1fr; }
          .abm-modal  { border-radius: 14px; }
          .abm-head, .abm-footer { padding-left: 16px; padding-right: 16px; }
          .abm-body   { padding: 0 16px 18px; }
        }
      `}</style>
    </div>
  );
}

// ─── Branches ─────────────────────────────────────────────────────────────────

const Branches = ({ companyId: providedCompanyId, companyName: providedCompanyName, companies: providedCompanies }) => {
  const { companyId, error: companyError } = useActiveCompany(providedCompanyId);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const companyOptions = (providedCompanies && providedCompanies.length > 0)
    ? providedCompanies.map(c => c.companyName || c.name)
    : (providedCompanyName ? [providedCompanyName] : COMPANIES);
  const [branches, setBranches] = useState([
    {
      initials: "HM",
      name: "HQ — Mumbai",
      type: "Head Office",
      head: "Arjun Mehta",
      employees: 142,
    },
    {
      initials: "WP",
      name: "West — Pune",
      type: "Sales Office",
      head: "Ananya Singh",
      employees: 68,
    },
    {
      initials: "FP",
      name: "Factory — Pune",
      type: "Manufacturing",
      head: "Vikram Joshi",
      employees: 58,
    },
    {
      initials: "SB",
      name: "South — Bangalore",
      type: "Regional Office",
      head: "Deepika Rao",
      employees: 16,
    },
  ]);

  const mapBranch = (branch) => ({
    id: branch.id,
    initials: branch.branchName.split(/\s+/).map((word) => word[0]?.toUpperCase() || "").slice(0, 2).join("") || "BR",
    name: branch.branchName,
    type: branch.branchType,
    head: branch.manager || "—",
    employees: branch.employees || 0,
    status: branch.status,
  });

  useEffect(() => {
    if (!companyId) {
      setBranches([]);
      return;
    }
    CompanyManagementService.getBranches(companyId)
      .then(({ data }) => {
        setBranches(data.map(mapBranch));
        setError("");
      })
      .catch((requestError) => setError(requestError.response?.data?.detail || "Unable to load branches."));
  }, [companyId]);

  const createBranch = async (form) => {
    try {
      const { data } = await CompanyManagementService.createBranch(companyId, {
        ...form,
        status: form.status.toUpperCase(),
      });
      setBranches((current) => [...current, mapBranch(data)]);
      setShowModal(false);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to create the branch.");
    }
  };

  return (
    <div className="branches-content">

      {(error || companyError) && <div className="branches-api-message">{error || companyError}</div>}

      {/* ================= BRANCHES CARD ================= */}

      <section className="branches-card">

        {/* Card Header */}
        <div className="branches-header">

          <h2>
            Branches <span>({branches.length})</span>
          </h2>

          <button className="add-branch-btn" onClick={() => setShowModal(true)}>
            + Add Branch
          </button>

        </div>

        {/* Branch List */}
        <div className="branch-list">

          {branches.map((branch, index) => (

            <div
              className={`branch-row ${
                index === 0 ? "first-row" : ""
              }`}
              key={branch.id || branch.name}
            >

              {/* Branch Icon */}
              <div className="branch-icon">
                {branch.initials}
              </div>

              {/* Branch Information */}
              <div className="branch-info">

                <div className="branch-name">
                  {branch.name}
                </div>

                <div className="branch-meta">
                  {branch.type} · Head: {branch.head}
                </div>

              </div>

              {/* Employee Count */}
              <div className="employee-count">

                <strong>
                  {branch.employees}
                </strong>

                <span>
                  EMPLOYEES
                </span>

              </div>

              {/* Status */}
              <div className="branch-status">
                {branch.status || "ACTIVE"}
              </div>

              {/* Arrow */}
              <div className="branch-arrow">
                ›
              </div>

            </div>

          ))}

        </div>

      </section>

      {/* ── Add Branch Modal ── */}
      {showModal && (
        <AddBranchModal
          onClose={() => setShowModal(false)}
          onSubmit={createBranch}
          companyOptions={companyOptions}
          companyName={providedCompanyName}
        />
      )}


      {/* ================= STYLES ================= */}

      <style>{`

        .branches-content {
          width: 100%;
        }

        .branches-api-message {
          margin-bottom: 12px; padding: 10px 14px; border: 1px solid #dfd8c9;
          border-radius: 10px; background: #fffaf0; color: #6b5b3e; font-size: 12px;
        }

        /* =========================================
           BRANCHES CARD
        ========================================= */

        .branches-card {
          width: 100%;
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 15px;
          overflow: hidden;
        }

        /* =========================================
           BRANCH HEADER
        ========================================= */

        .branches-header {
          height: 63px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 20px;

          border-bottom: 1px solid #e3e0d8;
        }

        .branches-header h2 {
          margin: 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 17px;
          font-weight: 400;

          color: #11140f;
        }

        .branches-header h2 span {
          color: #a19d95;
          font-size: 14px;
        }

        /* =========================================
           ADD BRANCH BUTTON
        ========================================= */

        .add-branch-btn {
          height: 32px;

          padding: 0 15px;

          border: none;
          border-radius: 11px;

          background: #111410;
          color: #fff;

          font-family: monospace;
          font-size: 9px;

          cursor: pointer;
        }

        .add-branch-btn:hover {
          background: #20231f;
        }

        /* =========================================
           BRANCH ROW
        ========================================= */

        .branch-row {
          min-height: 73px;

          display: flex;
          align-items: center;

          padding: 0 20px;

          border-bottom: 1px solid #e3e0d8;

          transition: background 0.15s ease;
        }

        .branch-row:last-child {
          border-bottom: none;
        }

        .branch-row:hover {
          background: #faf9f5;
        }

        .branch-row.first-row {
          background: #f7f6f1;
        }

        /* =========================================
           BRANCH ICON
        ========================================= */

        .branch-icon {
          width: 40px;
          height: 40px;

          flex-shrink: 0;

          border-radius: 12px;

          border: 1px solid #e5e2da;

          background: #f7f6f1;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #64735f;

          font-family: monospace;
          font-size: 8px;
        }

        /* =========================================
           BRANCH INFORMATION
        ========================================= */

        .branch-info {
          margin-left: 16px;
          flex: 1;
        }

        .branch-name {
          margin-bottom: 5px;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 16px;

          color: #11140f;
        }

        .branch-meta {
          font-family: monospace;
          font-size: 8px;
          color: #99968e;
        }

        /* =========================================
           EMPLOYEE COUNT
        ========================================= */

        .employee-count {
          width: 80px;

          margin-right: 17px;

          text-align: center;
        }

        .employee-count strong {
          display: block;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 18px;
          font-weight: 400;

          color: #11140f;
        }

        .employee-count span {
          display: block;

          margin-top: 2px;

          font-family: monospace;
          font-size: 7px;

          color: #aaa69e;
        }

        /* =========================================
           STATUS
        ========================================= */

        .branch-status {
          width: 62px;

          padding: 6px 9px;

          text-align: center;

          border-radius: 10px;

          background: #edf2e8;

          color: #63755c;

          font-family: monospace;
          font-size: 8px;
        }

        /* =========================================
           ARROW
        ========================================= */

        .branch-arrow {
          width: 25px;

          margin-left: 12px;

          color: #d1cec6;

          font-size: 27px;
          font-family: Arial, sans-serif;

          line-height: 1;

          text-align: right;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 850px) {

          .branch-row {
            min-width: 650px;
          }

          .branches-card {
            overflow-x: auto;
          }

        }

      `}</style>

    </div>
  );
};

export default Branches;
