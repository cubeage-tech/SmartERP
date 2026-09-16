import React, { useEffect, useState } from "react";
import CompanyManagementService from "../../../core/services/modules/companyManagement.service";
import useActiveCompany from "../../../core/hooks/useActiveCompany";

// ─── Mock data for dropdowns ──────────────────────────────────────────────────
const COMPANIES = ["Acme Manufacturing Ltd", "Acme Exports Pvt Ltd"];
const DEPT_TYPES = ["Operations", "Finance", "Human Resources", "Sales & Marketing", "Information Technology", "Procurement", "Legal & Compliance", "R&D", "Customer Support"];

const EMPTY = {
  company: "Acme Manufacturing Ltd",
  branch: "Mumbai Head Office",
  name: "", code: "", head: "", type: "",
  description: "", status: "active",
};

// ─── Reusable field components (Module-level to prevent remounting/focus loss) ───
const Input = ({ label, value, onChange, placeholder, required, icon, error }) => (
  <div className="adm-field">
    <label>{label}{required && <span className="adm-req"> *</span>}</label>
    <div className={icon ? "adm-icon-wrap" : ""}>
      {icon && <span className="adm-icon">{icon}</span>}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`adm-input${icon ? " adm-input--icon" : ""}${error ? " adm-input--err" : ""}`}
      />
    </div>
    {error && <span className="adm-err">{error}</span>}
  </div>
);

const Select = ({ label, value, onChange, options, placeholder, required, error }) => (
  <div className="adm-field">
    <label>{label}{required && <span className="adm-req"> *</span>}</label>
    <div className="adm-sel-wrap">
      <select
        value={value}
        onChange={onChange}
        className={`adm-select${error ? " adm-input--err" : ""}`}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="adm-chevron">▾</span>
    </div>
    {error && <span className="adm-err">{error}</span>}
  </div>
);

// ─── Add Department Modal ─────────────────────────────────────────────────────
function AddDepartmentModal({ onClose, onSubmit, branchOptions, companyName, companyOptions = (companyName ? [companyName] : COMPANIES) }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    company: companyName || "",
    branch: branchOptions[0]?.name || "",
  }));
  const [errors, setErrors] = useState({});

  const set = (f, v) => {
    setForm(p => ({ ...p, [f]: v }));
    setErrors(p => ({ ...p, [f]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.company) e.company = "Required";
    if (!form.branch)  e.branch  = "Required";
    if (!form.name.trim())  e.name  = "Department Name is required";
    if (!form.code.trim())  e.code  = "Department Code is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = () => { if (validate()) { onSubmit(form); onClose(); } };

  return (
    <div className="adm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal">

        {/* ── Header ── */}
        <div className="adm-head">
          <div className="adm-head-left">
            <div className="adm-head-icon">🏢</div>
            <div>
              <h2>Add Department</h2>
              <p>Create a new department under the selected branch.</p>
            </div>
          </div>
          <button className="adm-close" onClick={onClose}>✕</button>
        </div>

        {/* ── Body ── */}
        <div className="adm-body">

          {/* Section 1 — Department Information */}
          <div className="adm-section">
            <div className="adm-section-head">
              <div className="adm-sec-icon">💼</div>
              <div>
                <strong>Department Information</strong>
                <span>Enter the basic details of the department.</span>
              </div>
            </div>

            <div className="adm-grid-2">
              <Select label="Company" value={form.company} onChange={e => set("company", e.target.value)} options={companyOptions} placeholder="Select company" required error={errors.company} />
              <Select label="Branch" value={form.branch} onChange={e => set("branch", e.target.value)} options={branchOptions.map((branch) => branch.name)} placeholder="Select branch" required error={errors.branch} />
              <Input  label="Department Name" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Enter department name" required error={errors.name} />
              <Input  label="Department Code" value={form.code} onChange={e => set("code", e.target.value)} placeholder="Enter department code" required error={errors.code} />
              <Input  label="Department Head" value={form.head} onChange={e => set("head", e.target.value)} placeholder="Select or enter department head" icon="👤" error={errors.head} />
              <Select label="Department Type" value={form.type} onChange={e => set("type", e.target.value)} options={DEPT_TYPES} placeholder="Select department type" error={errors.type} />
            </div>

            <div className="adm-field" style={{ marginTop: 4 }}>
              <label>Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => set("description", e.target.value)}
                placeholder="Enter department description (optional)"
                className="adm-input adm-textarea"
              />
            </div>
          </div>

          {/* Section 2 — Department Settings */}
          <div className="adm-section">
            <div className="adm-section-head">
              <div className="adm-sec-icon">🛡</div>
              <div>
                <strong>Department Settings</strong>
                <span>Set the status of the department.</span>
              </div>
            </div>

            <div className="adm-field">
              <label>Status <span className="adm-req">*</span></label>
              <div className="adm-status-grid">
                <label className={`adm-status-card${form.status === "active" ? " adm-status-card--on" : ""}`}>
                  <input type="radio" name="adm-status" value="active"
                    checked={form.status === "active"}
                    onChange={() => set("status", "active")} />
                  <div>
                    <strong>Active</strong>
                    <span>Department is active</span>
                  </div>
                </label>
                <label className={`adm-status-card${form.status === "inactive" ? " adm-status-card--off" : ""}`}>
                  <input type="radio" name="adm-status" value="inactive"
                    checked={form.status === "inactive"}
                    onChange={() => set("status", "inactive")} />
                  <div>
                    <strong>Inactive</strong>
                    <span>Department is inactive</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="adm-footer">
          <button className="adm-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="adm-btn-submit" onClick={submit}>Create Department</button>
        </div>

      </div>

      {/* ── Styles ── */}
      <style>{`
        .adm-overlay {
          position: fixed; inset: 0;
          background: rgba(16,19,15,0.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px;
        }

        .adm-modal {
          background: #f5f4ef;
          border: 1px solid #e1dfd8;
          border-radius: 18px;
          width: 100%; max-width: 740px;
          max-height: 90vh;
          display: flex; flex-direction: column;
          box-shadow: 0 20px 50px rgba(0,0,0,0.16);
          overflow: hidden;
        }

        /* Header */
        .adm-head {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 22px 26px 16px;
          border-bottom: 1px solid #e1dfd8;
          background: #f5f4ef;
          flex-shrink: 0;
        }

        .adm-head-left {
          display: flex; align-items: flex-start; gap: 14px;
        }

        .adm-head-icon {
          width: 46px; height: 46px;
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 13px;
          display: grid; place-items: center;
          font-size: 20px; flex-shrink: 0;
        }

        .adm-head h2 {
          margin: 0 0 4px;
          font-size: 19px; font-weight: 700; color: #10130f;
        }

        .adm-head p {
          margin: 0; font-size: 12px; color: #99988f;
        }

        .adm-close {
          background: #fff; border: 1px solid #e1dfd8;
          width: 32px; height: 32px; border-radius: 9px;
          font-size: 14px; color: #7a7970; cursor: pointer;
          display: grid; place-items: center;
          flex-shrink: 0;
        }

        .adm-close:hover { background: #ece9e0; color: #10130f; }

        /* Body */
        .adm-body {
          overflow-y: auto;
          padding: 0 26px 20px;
          display: flex; flex-direction: column; gap: 0;
          background: #f5f4ef;
        }

        /* Sections */
        .adm-section {
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 14px;
          padding: 20px 18px;
          margin-top: 14px;
          display: flex; flex-direction: column; gap: 14px;
        }

        .adm-section-head {
          display: flex; align-items: flex-start; gap: 12px;
          padding-bottom: 14px;
          border-bottom: 1px solid #ece9e0;
        }

        .adm-sec-icon {
          width: 36px; height: 36px;
          background: #f5f4ef;
          border: 1px solid #e1dfd8;
          border-radius: 10px;
          display: grid; place-items: center;
          font-size: 16px; flex-shrink: 0;
        }

        .adm-section-head strong {
          display: block;
          font-size: 14px; font-weight: 600; color: #10130f;
          margin-bottom: 3px;
        }

        .adm-section-head span {
          font-size: 11px; color: #99988f;
        }

        /* Grid */
        .adm-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* Fields */
        .adm-field {
          display: flex; flex-direction: column; gap: 5px;
        }

        .adm-field label {
          font-size: 12px; font-weight: 500; color: #4a4a40;
        }

        .adm-req { color: #c0392b; }

        /* Input */
        .adm-input {
          width: 100%; padding: 11px 13px;
          border: 1px solid #e0ddd5; border-radius: 10px;
          font-size: 13px; color: #10130f;
          background: #faf9f5;
          outline: none; box-sizing: border-box;
          transition: border-color 0.15s, background 0.15s;
        }

        .adm-input::placeholder { color: #b8b5ad; }
        .adm-input:focus { border-color: #10130f; background: #fff; }
        .adm-input--err { border-color: #c0392b !important; }
        .adm-textarea { resize: vertical; min-height: 72px; }

        /* Icon-prefixed input */
        .adm-icon-wrap { position: relative; }
        .adm-icon {
          position: absolute; left: 11px; top: 50%;
          transform: translateY(-50%);
          font-size: 13px; color: #b0ada5; pointer-events: none;
        }
        .adm-input--icon { padding-left: 32px; }

        /* Select */
        .adm-sel-wrap { position: relative; }

        .adm-select {
          width: 100%; padding: 11px 34px 11px 13px;
          border: 1px solid #e0ddd5; border-radius: 10px;
          font-size: 13px; color: #10130f;
          background: #faf9f5;
          appearance: none; outline: none; cursor: pointer;
          box-sizing: border-box;
          transition: border-color 0.15s;
        }

        .adm-select:focus { border-color: #10130f; background: #fff; }

        .adm-chevron {
          position: absolute; right: 11px; top: 50%;
          transform: translateY(-50%);
          color: #9a9890; font-size: 11px; pointer-events: none;
        }

        .adm-err { font-size: 11px; color: #c0392b; }

        /* Status cards */
        .adm-status-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin-top: 2px;
        }

        .adm-status-card {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 16px;
          border: 1.5px solid #e1dfd8;
          border-radius: 12px;
          cursor: pointer;
          background: #faf9f5;
          transition: border-color 0.15s, background 0.15s;
        }

        .adm-status-card input[type="radio"] {
          accent-color: #3d8a30;
          width: 17px; height: 17px; flex-shrink: 0;
        }

        .adm-status-card div { display: flex; flex-direction: column; gap: 2px; }

        .adm-status-card strong {
          font-size: 13px; font-weight: 600; color: #10130f;
        }

        .adm-status-card span {
          font-size: 11px; color: #99988f;
        }

        .adm-status-card--on {
          border-color: #7dba6a;
          background: #f2faf0;
        }

        .adm-status-card--on strong { color: #2e6e22; }
        .adm-status-card--on span   { color: #5a9a48; }

        .adm-status-card--off {
          border-color: #e1dfd8;
          background: #faf9f5;
        }

        /* Footer */
        .adm-footer {
          display: flex; justify-content: flex-end; gap: 10px;
          padding: 16px 26px;
          border-top: 1px solid #e1dfd8;
          background: #f5f4ef;
          flex-shrink: 0;
        }

        .adm-btn-cancel {
          height: 38px; padding: 0 20px;
          border: 1px solid #e0ddd5; border-radius: 12px;
          background: #fff; color: #20221e;
          font-size: 12px; font-weight: 500; cursor: pointer;
        }

        .adm-btn-cancel:hover { background: #ece9e0; }

        .adm-btn-submit {
          height: 38px; padding: 0 22px;
          border: none; border-radius: 12px;
          background: #111410; color: #fff;
          font-size: 12px; font-weight: 500; cursor: pointer;
          transition: background 0.15s;
        }

        .adm-btn-submit:hover { background: #1e2419; }

        @media (max-width: 640px) {
          .adm-grid-2 { grid-template-columns: 1fr; }
          .adm-status-grid { grid-template-columns: 1fr; }
          .adm-modal { border-radius: 14px; }
          .adm-head, .adm-footer { padding-left: 16px; padding-right: 16px; }
          .adm-body { padding: 0 16px 18px; }
        }
      `}</style>
    </div>
  );
}

// ─── Departments ──────────────────────────────────────────────────────────────

const Departments = ({ companyId: providedCompanyId, companyName: providedCompanyName, companies: providedCompanies }) => {
  const activeCompany = useActiveCompany(providedCompanyId);
  const companyId = providedCompanyId || activeCompany.companyId;
  const companyName = providedCompanyName || activeCompany.company?.companyName;
  const companyOptions = (providedCompanies && providedCompanies.length > 0)
    ? providedCompanies.map(c => c.companyName || c.name)
    : (companyName ? [companyName] : COMPANIES);
  const [showModal, setShowModal] = useState(false);
  const [branchOptions, setBranchOptions] = useState([]);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([
    {
      department: "Finance & Accounts",
      head: "Rahul Sharma",
      employees: 18,
      costCenter: "CC-001",
    },
    {
      department: "Sales",
      head: "Ananya Singh",
      employees: 34,
      costCenter: "CC-002",
    },
    {
      department: "Operations",
      head: "Vikram Joshi",
      employees: 82,
      costCenter: "CC-003",
    },
    {
      department: "Human Resources",
      head: "Deepika Rao",
      employees: 12,
      costCenter: "CC-004",
    },
    {
      department: "IT",
      head: "Rohan Verma",
      employees: 9,
      costCenter: "CC-005",
    },
    {
      department: "Marketing",
      head: "Kavya Reddy",
      employees: 8,
      costCenter: "CC-006",
    },
    {
      department: "Procurement",
      head: "Suresh Patil",
      employees: 11,
      costCenter: "CC-007",
    },
  ]);

  const mapDepartment = (department) => ({
    id: department.id,
    department: department.name,
    head: department.head || "—",
    employees: department.employees || 0,
    costCenter: department.costCenter || "—",
    status: department.status,
  });

  useEffect(() => {
    if (!companyId) {
      setDepartments([]);
      setBranchOptions([]);
      return;
    }
    Promise.all([
      CompanyManagementService.getDepartments(companyId),
      CompanyManagementService.getBranches(companyId),
    ])
      .then(([departmentResponse, branchResponse]) => {
        setDepartments(departmentResponse.data.map(mapDepartment));
        setBranchOptions(branchResponse.data.map((branch) => ({ id: branch.id, name: branch.branchName })));
        setError("");
      })
      .catch((requestError) => setError(requestError.response?.data?.detail || "Unable to load departments."));
  }, [companyId]);

  const createDepartment = async (form) => {
    const branch = branchOptions.find((item) => item.name === form.branch);
    try {
      const { data } = await CompanyManagementService.createDepartment(companyId, {
        ...form,
        branchId: branch?.id,
        type: form.type || "Operations",
        employees: 0,
        status: form.status.toUpperCase(),
      });
      setDepartments((current) => [...current, mapDepartment(data)]);
      setShowModal(false);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to create the department.");
    }
  };

  return (
    <div className="departments-content">

      {(error || activeCompany.error) && <div className="departments-api-message">{error || activeCompany.error}</div>}

      {/* ================= DEPARTMENTS CARD ================= */}

      <section className="departments-card">

        {/* CARD HEADER */}
        <div className="departments-header">
          <h2>
            Departments <span>({departments.length})</span>
          </h2>

          <button className="add-dept-btn" onClick={() => setShowModal(true)}>
            + Add Dept.
          </button>
        </div>

        {/* TABLE HEADER */}
        <div className="table-header">
          <div>DEPARTMENT</div>
          <div>HEAD</div>
          <div>EMPLOYEES</div>
          <div>COST CENTER</div>
          <div></div>
        </div>

        {/* DEPARTMENT ROWS */}
        <div className="department-list">

          {departments.map((item, index) => (
            <div
              className={`department-row ${
                index === 2 ? "highlighted" : ""
              }`}
              key={item.id || item.department}
            >
              <div className="department-name">
                {item.department}
              </div>

              <div className="department-head">
                {item.head}
              </div>

              <div className="department-employees">
                {item.employees}
              </div>

              <div className="cost-center">
                <span>{item.costCenter}</span>
              </div>

              <div className="view-action">
                View →
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* ── Add Department Modal ── */}
      {showModal && (
        <AddDepartmentModal
          onClose={() => setShowModal(false)}
          onSubmit={createDepartment}
          branchOptions={branchOptions}
          companyName={companyName}
          companyOptions={companyOptions}
        />
      )}

      {/* ================= STYLES ================= */}

      <style>{`

        .departments-content {
          width: 100%;
        }

        .departments-api-message {
          margin-bottom: 12px; padding: 10px 14px; border: 1px solid #dfd8c9;
          border-radius: 10px; background: #fffaf0; color: #6b5b3e; font-size: 12px;
        }

        .departments-card {
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 15px;
          overflow: hidden;
        }

        /* CARD HEADER */

        .departments-header {
          height: 63px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 20px;

          border-bottom: 1px solid #e3e0d8;
        }

        .departments-header h2 {
          margin: 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 17px;
          font-weight: 400;

          color: #11140f;
        }

        .departments-header h2 span {
          color: #a19d95;
          font-size: 14px;
        }

        .add-dept-btn {
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

        /* TABLE HEADER */

        .table-header {
          height: 37px;

          display: grid;

          grid-template-columns:
            2.2fr
            1.5fr
            1.1fr
            1.3fr
            0.45fr;

          align-items: center;

          padding: 0 20px;

          border-bottom: 1px solid #e3e0d8;

          color: #aaa69e;

          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.5px;
        }

        /* ROWS */

        .department-row {
          min-height: 53px;

          display: grid;

          grid-template-columns:
            2.2fr
            1.5fr
            1.1fr
            1.3fr
            0.45fr;

          align-items: center;

          padding: 0 20px;

          border-bottom: 1px solid #e3e0d8;
        }

        .department-row:last-child {
          border-bottom: none;
        }

        .department-row.highlighted {
          background: #f7f6f1;
        }

        .department-name {
          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 15px;
          color: #11140f;
        }

        .department-head {
          font-family: monospace;
          font-size: 9px;
          color: #817e77;
        }

        .department-employees {
          font-family: monospace;
          font-size: 9px;
          color: #171914;
        }

        .cost-center span {
          display: inline-block;

          padding: 5px 9px;

          border-radius: 9px;

          background: #f0eff1;
          color: #817d88;

          font-family: monospace;
          font-size: 8px;
        }

        .view-action {
          text-align: right;

          font-family: monospace;
          font-size: 8px;

          color: #aaa69e;

          white-space: nowrap;
        }

        /* RESPONSIVE */

        @media (max-width: 850px) {

          .departments-card {
            overflow-x: auto;
          }

          .table-header,
          .department-row {
            min-width: 900px;
          }
        }

      `}</style>

    </div>
  );
};

export default Departments;
