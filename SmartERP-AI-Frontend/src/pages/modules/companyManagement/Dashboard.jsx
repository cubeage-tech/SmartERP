import React, { useEffect, useState, useRef } from "react";

import Overview from "./Overview";
import Branches from "./Branches";
import Departments from "./Departments";
import Users from "./Users";
import RolesPermissions from "./RolesPermissions";
import ApprovalWorkflows from "./ApprovalWorkflows";
import Holidays from "./Holidays";
import CompanySettings from "./CompanySettings";
import CompanyManagementService from "../../../core/services/modules/companyManagement.service";

// ─── Add Company Modal ────────────────────────────────────────────────────────
const COMPANY_TYPES = ["Private Limited", "Public Limited", "LLP", "Partnership", "Sole Proprietorship", "OPC", "Section 8 / NGO"];
const INDUSTRIES    = ["Manufacturing", "IT & Technology", "Finance & Banking", "Healthcare", "Retail", "Logistics", "Construction", "Education", "FMCG", "Other"];
const CURRENCIES    = ["INR (₹) – Indian Rupee", "USD ($) – US Dollar", "EUR (€) – Euro", "GBP (£) – British Pound", "AED – UAE Dirham"];
const TIMEZONES     = ["IST (UTC+5:30) – India", "UTC+0:00 – London", "UTC-5:00 – New York", "UTC+8:00 – Singapore", "UTC+4:00 – Dubai"];
const FIN_YEARS     = ["April – March", "January – December", "July – June", "October – September"];
const COUNTRIES     = ["India", "United States", "United Kingdom", "UAE", "Singapore", "Australia"];
const STATES_IN     = ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat", "Rajasthan", "Uttar Pradesh", "West Bengal", "Telangana", "Kerala"];

const EMPTY_FORM = {
  companyName: "", companyCode: "", companyType: "", industry: "",
  registrationNumber: "", taxGst: "", website: "",
  email: "", phone: "", address: "",
  country: "", state: "", city: "", pincode: "",
  currency: "", timezone: "", financialYear: "",
  logo: null, status: "active",
};

function AddCompanyModal({ onClose, onSubmit }) {
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const logoRef             = useRef();

  const set = (field, value) => {
    let cleanVal = value;
    if (field === "phone" || field === "pincode") {
      cleanVal = typeof value === "string" ? value.replace(/\D/g, "") : value;
    }
    setForm(f => ({ ...f, [field]: cleanVal }));
    setErrors(e => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const req = {
      companyName: "Company Name", companyCode: "Company Code",
      companyType: "Company Type", industry: "Industry",
      email: "Official Email",    phone: "Phone Number",
      address: "Address",         country: "Country",
      state: "State",             city: "City",
      pincode: "Pincode",         currency: "Currency",
      timezone: "Time Zone",      financialYear: "Financial Year",
    };
    const e = {};
    Object.entries(req).forEach(([k, label]) => {
      if (!form[k]?.trim()) e[k] = `${label} is required`;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };

  return (
    <div className="acm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="acm-modal">

        {/* ── Modal header ── */}
        <div className="acm-modal-head">
          <div>
            <h2>Add New Company</h2>
            <p>Enter the details to create a new company in the system.</p>
          </div>
          <button className="acm-close" onClick={onClose}>✕</button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="acm-body">

          {/* Section 1 — Basic Information */}
          <div className="acm-section">
            <div className="acm-section-title">
              <span className="acm-section-icon">🏢</span>
              Basic Information
            </div>

            <div className="acm-grid-2">
              <div className="acm-field">
                <label>Company Name<span className="acm-req">*</span></label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={e => set("companyName", e.target.value)}
                  placeholder="Enter company name"
                  className={errors.companyName ? "acm-input acm-input--error" : "acm-input"}
                />
                {errors.companyName && <span className="acm-err">{errors.companyName}</span>}
              </div>

              <div className="acm-field">
                <label>Company Code<span className="acm-req">*</span></label>
                <input
                  type="text"
                  value={form.companyCode}
                  onChange={e => set("companyCode", e.target.value)}
                  placeholder="Enter company code"
                  className={errors.companyCode ? "acm-input acm-input--error" : "acm-input"}
                />
                {errors.companyCode && <span className="acm-err">{errors.companyCode}</span>}
              </div>

              <div className="acm-field">
                <label>Company Type<span className="acm-req">*</span></label>
                <div className="acm-select-wrap">
                  <select
                    value={form.companyType}
                    onChange={e => set("companyType", e.target.value)}
                    className={errors.companyType ? "acm-select acm-input--error" : "acm-select"}
                  >
                    <option value="">Select company type</option>
                    {COMPANY_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className="acm-chevron">▾</span>
                </div>
                {errors.companyType && <span className="acm-err">{errors.companyType}</span>}
              </div>

              <div className="acm-field">
                <label>Industry<span className="acm-req">*</span></label>
                <div className="acm-select-wrap">
                  <select
                    value={form.industry}
                    onChange={e => set("industry", e.target.value)}
                    className={errors.industry ? "acm-select acm-input--error" : "acm-select"}
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className="acm-chevron">▾</span>
                </div>
                {errors.industry && <span className="acm-err">{errors.industry}</span>}
              </div>

              <div className="acm-field">
                <label>Registration Number</label>
                <input
                  type="text"
                  value={form.registrationNumber}
                  onChange={e => set("registrationNumber", e.target.value)}
                  placeholder="Enter registration number"
                  className={errors.registrationNumber ? "acm-input acm-input--error" : "acm-input"}
                />
                {errors.registrationNumber && <span className="acm-err">{errors.registrationNumber}</span>}
              </div>

              <div className="acm-field">
                <label>Tax / GST Number</label>
                <input
                  type="text"
                  value={form.taxGst}
                  onChange={e => set("taxGst", e.target.value)}
                  placeholder="Enter GST number"
                  className={errors.taxGst ? "acm-input acm-input--error" : "acm-input"}
                />
                {errors.taxGst && <span className="acm-err">{errors.taxGst}</span>}
              </div>
            </div>

            <div className="acm-grid-1">
              <div className="acm-field">
                <label>Website</label>
                <div className="acm-icon-input">
                  <span>🌐</span>
                  <input
                    value={form.website}
                    onChange={e => set("website", e.target.value)}
                    placeholder="Enter website (e.g. www.company.com)"
                    className="acm-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 — Contact Information */}
          <div className="acm-section">
            <div className="acm-section-title">
              <span className="acm-section-icon">📞</span>
              Contact Information
            </div>

            <div className="acm-grid-2">
              <div className="acm-field">
                <label>Official Email <span className="acm-req">*</span></label>
                <div className="acm-icon-input">
                  <span>✉</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                    placeholder="Enter official email"
                    className={errors.email ? "acm-input acm-input--error" : "acm-input"}
                  />
                </div>
                {errors.email && <span className="acm-err">{errors.email}</span>}
              </div>

              <div className="acm-field">
                <label>Phone Number <span className="acm-req">*</span></label>
                <div className="acm-icon-input">
                  <span>📱</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={e => set("phone", e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter phone number"
                    className={errors.phone ? "acm-input acm-input--error" : "acm-input"}
                  />
                </div>
                {errors.phone && <span className="acm-err">{errors.phone}</span>}
              </div>
            </div>

            <div className="acm-grid-1">
              <div className="acm-field">
                <label>Address <span className="acm-req">*</span></label>
                <div className="acm-icon-textarea">
                  <span>📍</span>
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={e => set("address", e.target.value)}
                    placeholder="Enter complete address"
                    className={errors.address ? "acm-input acm-textarea acm-input--error" : "acm-input acm-textarea"}
                  />
                </div>
                {errors.address && <span className="acm-err">{errors.address}</span>}
              </div>
            </div>

            <div className="acm-grid-4">
              <div className="acm-field">
                <label>Country<span className="acm-req">*</span></label>
                <div className="acm-select-wrap">
                  <select
                    value={form.country}
                    onChange={e => set("country", e.target.value)}
                    className={errors.country ? "acm-select acm-input--error" : "acm-select"}
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className="acm-chevron">▾</span>
                </div>
                {errors.country && <span className="acm-err">{errors.country}</span>}
              </div>

              <div className="acm-field">
                <label>State<span className="acm-req">*</span></label>
                <div className="acm-select-wrap">
                  <select
                    value={form.state}
                    onChange={e => set("state", e.target.value)}
                    className={errors.state ? "acm-select acm-input--error" : "acm-select"}
                  >
                    <option value="">Select state</option>
                    {STATES_IN.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className="acm-chevron">▾</span>
                </div>
                {errors.state && <span className="acm-err">{errors.state}</span>}
              </div>

              <div className="acm-field">
                <label>City<span className="acm-req">*</span></label>
                <div className="acm-select-wrap">
                  <select
                    value={form.city}
                    onChange={e => set("city", e.target.value)}
                    className={errors.city ? "acm-select acm-input--error" : "acm-select"}
                  >
                    <option value="">Select city</option>
                    {["Mumbai", "Pune", "Bengaluru", "Chennai", "Delhi", "Hyderabad", "Ahmedabad", "Kolkata"].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className="acm-chevron">▾</span>
                </div>
                {errors.city && <span className="acm-err">{errors.city}</span>}
              </div>

              <div className="acm-field">
                <label>Pincode<span className="acm-req">*</span></label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.pincode}
                  onChange={e => set("pincode", e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter pincode"
                  className={errors.pincode ? "acm-input acm-input--error" : "acm-input"}
                />
                {errors.pincode && <span className="acm-err">{errors.pincode}</span>}
              </div>
            </div>
          </div>

          {/* Section 3 — Company Settings */}
          <div className="acm-section">
            <div className="acm-section-title">
              <span className="acm-section-icon">⚙️</span>
              Company Settings
            </div>

            <div className="acm-grid-3">
              <div className="acm-field">
                <label>Currency<span className="acm-req">*</span></label>
                <div className="acm-select-wrap">
                  <select
                    value={form.currency}
                    onChange={e => set("currency", e.target.value)}
                    className={errors.currency ? "acm-select acm-input--error" : "acm-select"}
                  >
                    <option value="">Select currency</option>
                    {CURRENCIES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className="acm-chevron">▾</span>
                </div>
                {errors.currency && <span className="acm-err">{errors.currency}</span>}
              </div>

              <div className="acm-field">
                <label>Time Zone<span className="acm-req">*</span></label>
                <div className="acm-select-wrap">
                  <select
                    value={form.timezone}
                    onChange={e => set("timezone", e.target.value)}
                    className={errors.timezone ? "acm-select acm-input--error" : "acm-select"}
                  >
                    <option value="">Select time zone</option>
                    {TIMEZONES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className="acm-chevron">▾</span>
                </div>
                {errors.timezone && <span className="acm-err">{errors.timezone}</span>}
              </div>

              <div className="acm-field">
                <label>Financial Year<span className="acm-req">*</span></label>
                <div className="acm-select-wrap">
                  <select
                    value={form.financialYear}
                    onChange={e => set("financialYear", e.target.value)}
                    className={errors.financialYear ? "acm-select acm-input--error" : "acm-select"}
                  >
                    <option value="">Select financial year</option>
                    {FIN_YEARS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className="acm-chevron">▾</span>
                </div>
                {errors.financialYear && <span className="acm-err">{errors.financialYear}</span>}
              </div>
            </div>

            <div className="acm-grid-2">
              {/* Logo upload */}
              <div className="acm-field">
                <label>Company Logo</label>
                <div
                  className="acm-dropzone"
                  onClick={() => logoRef.current.click()}
                >
                  <input
                    ref={logoRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    style={{ display: "none" }}
                    onChange={e => set("logo", e.target.files?.[0] || null)}
                  />
                  {form.logo ? (
                    <span className="acm-logo-name">✓ {form.logo.name}</span>
                  ) : (
                    <>
                      <span className="acm-upload-icon">☁</span>
                      <strong>Upload Logo</strong>
                      <span>PNG, JPG up to 2MB</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="acm-field">
                <label>Status <span className="acm-req">*</span></label>
                <div className="acm-status-options">
                  <label className="acm-radio">
                    <input
                      type="radio" name="status" value="active"
                      checked={form.status === "active"}
                      onChange={() => set("status", "active")}
                    />
                    <span>Active</span>
                    <span className="acm-badge acm-badge--active">Active</span>
                  </label>
                  <label className="acm-radio">
                    <input
                      type="radio" name="status" value="inactive"
                      checked={form.status === "inactive"}
                      onChange={() => set("status", "inactive")}
                    />
                    <span>Inactive</span>
                    <span className="acm-badge acm-badge--inactive">Inactive</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="acm-footer">
          <button className="acm-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="acm-btn-submit" onClick={handleSubmit}>
            🏢 Create Company
          </button>
        </div>

      </div>

      {/* ── Modal styles — beige/off-white palette matching the app ── */}
      <style>{`
        /* ── Overlay ── */
        .acm-overlay {
          position: fixed; inset: 0;
          background: rgba(16,19,15,0.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px;
        }

        /* ── Modal shell ── */
        .acm-modal {
          background: #f5f4ef;
          border-radius: 18px;
          width: 100%; max-width: 780px;
          max-height: 90vh;
          display: flex; flex-direction: column;
          box-shadow: 0 20px 50px rgba(0,0,0,0.18);
          overflow: hidden;
          border: 1px solid #e1dfd8;
        }

        /* ── Header ── */
        .acm-modal-head {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 26px 28px 16px;
          border-bottom: 1px solid #e1dfd8;
          background: #f5f4ef;
          flex-shrink: 0;
        }

        .acm-modal-head h2 {
          margin: 0 0 5px;
          font-size: 21px; font-weight: 700;
          color: #10130f;
        }

        .acm-modal-head p {
          margin: 0; font-size: 12px; color: #99988f;
        }

        .acm-close {
          background: none; border: 1px solid #e1dfd8;
          font-size: 15px; color: #7a7970;
          cursor: pointer; padding: 5px 9px;
          border-radius: 9px; line-height: 1;
          background: #fff;
        }

        .acm-close:hover { background: #ece9e0; border-color: #d0cdc5; color: #10130f; }

        /* ── Scrollable body ── */
        .acm-body {
          overflow-y: auto; padding: 0 28px 24px;
          display: flex; flex-direction: column; gap: 0;
          background: #f5f4ef;
        }

        /* ── Section card ── */
        .acm-section {
          background: #ffffff;
          border: 1px solid #e1dfd8;
          border-radius: 14px;
          padding: 20px 18px;
          margin-top: 14px;
          display: flex; flex-direction: column; gap: 14px;
        }

        /* ── Section title ── */
        .acm-section-title {
          font-size: 13px; font-weight: 600;
          color: #10130f;
          display: flex; align-items: center; gap: 8px;
          padding-bottom: 10px;
          border-bottom: 1px solid #ece9e0;
        }

        .acm-section-icon { font-size: 15px; }

        /* ── Grids ── */
        .acm-grid-1 { display: grid; }
        .acm-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .acm-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .acm-grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; }

        /* ── Field ── */
        .acm-field { display: flex; flex-direction: column; gap: 5px; }

        .acm-field label {
          font-size: 11px; font-weight: 500;
          color: #6a6a60;
          letter-spacing: 0.1px;
        }

        .acm-req { color: #c0392b; margin-left: 2px; }

        /* ── Input / Textarea ── */
        .acm-input {
          width: 100%; padding: 10px 12px;
          border: 1px solid #e0ddd5;
          border-radius: 10px;
          font-size: 13px; color: #10130f;
          background: #faf9f5;
          outline: none; box-sizing: border-box;
          transition: border-color 0.15s, background 0.15s;
        }

        .acm-input::placeholder { color: #b8b5ad; }
        .acm-input:focus { border-color: #10130f; background: #fff; }
        .acm-input--error { border-color: #c0392b !important; background: #fef8f7 !important; }
        .acm-textarea { resize: vertical; min-height: 70px; }

        /* ── Select ── */
        .acm-select-wrap { position: relative; }

        .acm-select {
          width: 100%; padding: 10px 34px 10px 12px;
          border: 1px solid #e0ddd5;
          border-radius: 10px;
          font-size: 13px; color: #10130f;
          background: #faf9f5;
          appearance: none; outline: none; cursor: pointer;
          box-sizing: border-box;
          transition: border-color 0.15s;
        }

        .acm-select:focus { border-color: #10130f; background: #fff; }

        .acm-chevron {
          position: absolute; right: 11px; top: 50%;
          transform: translateY(-50%);
          color: #9a9890; font-size: 11px; pointer-events: none;
        }

        .acm-err { font-size: 11px; color: #c0392b; margin-top: 1px; }

        /* ── Icon-prefixed inputs ── */
        .acm-icon-input,
        .acm-icon-textarea { position: relative; }

        .acm-icon-input > span,
        .acm-icon-textarea > span {
          position: absolute; left: 11px; top: 50%;
          transform: translateY(-50%);
          font-size: 13px; color: #b0ada5;
          pointer-events: none; z-index: 1;
        }

        .acm-icon-textarea > span { top: 13px; transform: none; }

        .acm-icon-input .acm-input,
        .acm-icon-textarea .acm-input { padding-left: 32px; }

        /* ── Logo drop zone ── */
        .acm-dropzone {
          border: 1.5px dashed #ccc9c0;
          border-radius: 12px;
          padding: 26px 14px;
          display: flex; flex-direction: column; align-items: center;
          gap: 5px; cursor: pointer;
          background: #f7f6f1;
          transition: border-color 0.15s, background 0.15s;
        }

        .acm-dropzone:hover { border-color: #10130f; background: #f0efe9; }
        .acm-upload-icon { font-size: 24px; color: #b0ada5; }
        .acm-dropzone strong { font-size: 13px; color: #3a3a30; font-weight: 500; }
        .acm-dropzone span   { font-size: 11px; color: #a8a59d; }
        .acm-logo-name { font-size: 13px; color: #4d7240; font-weight: 500; }

        /* ── Status radios ── */
        .acm-status-options {
          display: flex; flex-direction: column; gap: 12px;
          padding-top: 4px;
        }

        .acm-radio {
          display: flex !important; flex-direction: row !important;
          align-items: center; gap: 10px;
          cursor: pointer; font-size: 13px; color: #3a3a30;
        }

        .acm-radio input[type="radio"] {
          accent-color: #10130f; width: 15px; height: 15px;
        }

        /* ── Status badges ── */
        .acm-badge {
          padding: 3px 9px; border-radius: 7px;
          font-size: 10px; font-weight: 500;
        }

        .acm-badge--active   { background: #edf2e8; color: #4a6340; }
        .acm-badge--inactive { background: #f3ece8; color: #7a4030; }

        /* ── Footer ── */
        .acm-footer {
          display: flex; justify-content: flex-end; align-items: center;
          gap: 10px; padding: 16px 28px;
          border-top: 1px solid #e1dfd8;
          background: #f5f4ef;
          flex-shrink: 0;
        }

        /* ── Cancel button — matches Export btn from dashboard ── */
        .acm-btn-cancel {
          height: 38px;
          padding: 0 18px;
          border-radius: 12px;
          border: 1px solid #e0ddd5;
          background: #fff;
          color: #20221e;
          font-size: 12px; font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }

        .acm-btn-cancel:hover { background: #ece9e0; }

        /* ── Submit button — matches + Add btn from dashboard ── */
        .acm-btn-submit {
          height: 38px;
          padding: 0 20px;
          border-radius: 12px;
          background: #111410;
          border: none;
          color: #fff;
          font-size: 12px; font-weight: 500;
          cursor: pointer;
          display: flex; align-items: center; gap: 7px;
          transition: background 0.15s;
        }

        .acm-btn-submit:hover { background: #1e2419; }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          .acm-grid-2, .acm-grid-3, .acm-grid-4 { grid-template-columns: 1fr; }
          .acm-modal { border-radius: 14px; }
          .acm-modal-head, .acm-footer { padding-left: 16px; padding-right: 16px; }
          .acm-body { padding: 0 16px 20px; }
        }
      `}</style>
    </div>
  );
}

const Dashboard = () => {
  const [activeTab,  setActiveTab]  = useState("overview");
  const [showModal,  setShowModal]  = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    CompanyManagementService.getAll()
      .then(({ data }) => {
        if (!active) return;
        setCompanies(data);
        setCompanyId(data[0]?.id ?? null);
        if (!data.length) setLoading(false);
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.response?.data?.detail || "Unable to load companies.");
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!companyId) return;
    let active = true;
    setLoading(true);
    CompanyManagementService.getDashboard(companyId)
      .then(({ data }) => {
        if (active) {
          setDashboard(data);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.detail || "Unable to load the company dashboard.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [companyId]);

  const createCompany = async (form) => {
    try {
      const payload = { ...form, gstNumber: form.taxGst, logo: undefined, status: form.status.toUpperCase() };
      const { data } = await CompanyManagementService.create(payload);
      try {
        const res = await CompanyManagementService.getAll();
        setCompanies(res.data);
      } catch {
        setCompanies((current) => {
          const exists = current.some((c) => c.id === data.id);
          return exists ? current : [...current, data];
        });
      }
      setCompanyId(data.id);
      setShowModal(false);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to create the company.");
    }
  };

  const company = dashboard?.company || companies.find((item) => item.id === companyId);

  const tabs = [
    { id: "overview", label: "OVERVIEW" },
    { id: "branches", label: "BRANCHES" },
    { id: "departments", label: "DEPARTMENTS" },
    { id: "users", label: "USERS" },
    { id: "roles", label: "ROLES & PERMISSIONS" },
    { id: "approval", label: "APPROVAL WORKFLOWS" },
    { id: "holidays", label: "HOLIDAYS" },
    { id: "settings", label: "SETTINGS" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview company={company} dashboard={dashboard} />;

      case "branches":
        return <Branches companyId={companyId} companyName={company?.companyName} companies={companies} />;

      case "departments":
        return <Departments companyId={companyId} companyName={company?.companyName} companies={companies} />;

      case "users":
        return <Users />;

      case "roles":
        return <RolesPermissions />;

      case "approval":
        return <ApprovalWorkflows companyId={companyId} />;

      case "holidays":
        return <Holidays companyId={companyId} dashboard={dashboard} />;

      case "settings":
        return <CompanySettings companyId={companyId} />;

      default:
        return <Overview company={company} dashboard={dashboard} />;
    }
  };

  return (
    <div className="company-dashboard">

      {/* ================= COMPANY MANAGEMENT HEADER ================= */}

      <div className="company-dashboard-header">

        <div className="company-title-section">
          <div className="company-eyebrow">
            ADMINISTRATION
          </div>

          <h1>Company Management</h1>
        </div>

        <div className="company-actions">
          <div className="company-select-wrap">
            <select
              aria-label="Select Company"
              className="company-select"
              value={companyId || ""}
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                if (selectedId) setCompanyId(selectedId);
              }}
            >
              {companies.length === 0 && <option value="">Select Company</option>}
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName || c.name}
                </option>
              ))}
            </select>
            <span className="company-select-chevron">▾</span>
          </div>

          <button className="export-btn">
            Export
          </button>

          <button className="add-btn" onClick={() => setShowModal(true)}>
            + Add
          </button>
        </div>

      </div>

      {/* ── Add Company Modal ── */}
      {showModal && (
        <AddCompanyModal
          onClose={() => setShowModal(false)}
          onSubmit={createCompany}
        />
      )}

      {error && <div className="company-api-message">{error}</div>}
      {loading && <div className="company-api-message">Loading company data...</div>}


      {/* ================= COMPANY SUMMARY ================= */}

      <section className="company-summary">

        <div className="company-left">

          <div className="company-logo">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="company-info">

            <h2>{company?.companyName || "No company configured"}</h2>

            <div className="company-identifiers">
              <span>GST: {company?.gstNumber || "—"}</span>
              <span>•</span>
              <span>PAN: {company?.pan || "—"}</span>
              <span>•</span>
              <span>CIN: {company?.cin || "—"}</span>
            </div>

          </div>

        </div>


        <div className="company-stats">

          <div className="stat">
            <strong>{dashboard?.branches ?? 0}</strong>
            <span>BRANCHES</span>
          </div>

          <div className="stat">
            <strong>{dashboard?.employees ?? 0}</strong>
            <span>EMPLOYEES</span>
          </div>

          <div className="stat">
            <strong>{dashboard?.departments ?? 0}</strong>
            <span>DEPARTMENTS</span>
          </div>

          <div className="stat">
            <strong>{dashboard?.plan || "—"}</strong>
            <span>PLAN</span>
          </div>

          <div className="status">
            {dashboard?.status || company?.status || "INACTIVE"}
          </div>

        </div>

      </section>


      {/* ================= 8 COMMON TABS ================= */}

      <div className="company-tabs">

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`company-tab ${
              activeTab === tab.id ? "active" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}

      </div>


      {/* ================= ACTIVE TAB CONTENT ================= */}

      <div className="company-tab-content">
        {renderTabContent()}
      </div>


      {/* ================= CSS ================= */}

      <style>{`

        /* =========================================
           MAIN DASHBOARD
        ========================================= */

        .company-dashboard {
          width: 100%;
          min-height: 100%;
          background: #f5f4ef;

          /* COMMON PAGE MARGIN */
          padding-top: 0;
          padding-left: 35px;
          padding-right: 35px;
          padding-bottom: 40px;

          box-sizing: border-box;
        }

        .company-api-message {
          margin: 0 0 12px;
          padding: 10px 14px;
          border: 1px solid #dfd8c9;
          border-radius: 10px;
          background: #fffaf0;
          color: #6b5b3e;
          font-size: 12px;
        }


        /* =========================================
           COMPANY MANAGEMENT HEADER
        ========================================= */

        .company-dashboard-header {
          min-height: 76px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          /* SPACE ABOVE AND BELOW HEADING */
          padding: 18px 0 14px;

          box-sizing: border-box;
        }


        .company-title-section {
          display: flex;
          flex-direction: column;
        }


        .company-eyebrow {
          font-family: monospace;

          font-size: 9px;

          letter-spacing: 1.5px;

          color: #99988f;

          margin-bottom: 6px;
        }


        .company-dashboard-header h1 {
          margin: 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 28px;

          line-height: 1.1;

          font-weight: 400;

          color: #10130f;
        }


        /* =========================================
           HEADER BUTTONS
        ========================================= */

        .company-actions {
          display: flex;

          align-items: center;

          gap: 9px;
        }

        .company-select-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .company-select {
          height: 38px;
          padding: 0 32px 0 14px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          box-sizing: border-box;
          background: #fff;
          border: 1px solid #e0ddd5;
          color: #20221e;
          appearance: none;
          outline: none;
          min-width: 170px;
          max-width: 260px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          transition: border-color 0.15s, background 0.15s;
        }

        .company-select:focus {
          border-color: #10130f;
          background: #fff;
        }

        .company-select-chevron {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          color: #9a9890;
          pointer-events: none;
        }


        .export-btn,
        .add-btn {
          height: 38px;

          padding: 0 17px;

          border-radius: 12px;

          font-size: 10px;

          cursor: pointer;

          box-sizing: border-box;
        }


        .export-btn {
          background: #fff;

          border: 1px solid #e0ddd5;

          color: #20221e;
        }


        .add-btn {
          background: #111410;

          border: none;

          color: #fff;
        }


        /* =========================================
           COMPANY SUMMARY
        ========================================= */

        .company-summary {
          min-height: 108px;

          width: 100%;

          /* GAP BETWEEN HEADING AND ACME CARD */
          margin-top: 8px;

          background: #fff;

          border: 1px solid #e1dfd8;

          border-radius: 15px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 20px;

          box-sizing: border-box;
        }


        /* =========================================
           COMPANY LEFT SIDE
        ========================================= */

        .company-left {
          display: flex;

          align-items: center;

          gap: 23px;

          min-width: 0;
        }


        .company-logo {
          width: 65px;

          height: 65px;

          flex-shrink: 0;

          border-radius: 15px;

          background: #121511;

          display: grid;

          grid-template-columns:
            repeat(2, 13px);

          grid-template-rows:
            repeat(2, 13px);

          gap: 4px;

          align-content: center;

          justify-content: center;
        }


        .company-logo span {
          width: 13px;

          height: 13px;

          border-radius: 3px;

          background: #4e574b;
        }


        .company-logo span:first-child {
          background: #a1b294;
        }


        .company-logo span:nth-child(3) {
          background: #343a31;
        }


        /* =========================================
           COMPANY INFORMATION
        ========================================= */

        .company-info h2 {
          margin: 0 0 6px;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 20px;

          line-height: 1.2;

          font-weight: 400;

          color: #10130f;
        }


        .company-identifiers {
          display: flex;

          align-items: center;

          gap: 8px;

          color: #98958d;

          font-family: monospace;

          font-size: 9px;

          white-space: nowrap;
        }


        /* =========================================
           COMPANY STATS
        ========================================= */

        .company-stats {
          display: flex;

          align-items: center;

          gap: 55px;

          flex-shrink: 0;
        }


        .stat {
          min-width: 60px;

          text-align: center;
        }


        .stat strong {
          display: block;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 21px;

          line-height: 1.2;

          font-weight: 400;

          color: #10130f;
        }


        .stat span {
          display: block;

          margin-top: 4px;

          font-family: monospace;

          font-size: 8px;

          color: #a09d96;
        }


        .status {
          font-family: monospace;

          font-size: 8px;

          color: #63755c;

          background: #edf2e8;

          padding: 7px 12px;

          border-radius: 12px;

          white-space: nowrap;
        }


        /* =========================================
           TABS
        ========================================= */

        .company-tabs {
          height: 88px;

          display: flex;

          align-items: center;

          gap: 6px;

          padding-left: 3px;

          margin-top: 4px;

          overflow-x: auto;

          white-space: nowrap;

          box-sizing: border-box;

          scrollbar-width: none;
        }


        .company-tabs::-webkit-scrollbar {
          display: none;
        }


        .company-tab {
          height: 48px;

          min-width: 92px;

          border: 1px solid transparent;

          background: transparent;

          border-radius: 10px;

          padding: 0 24px;

          font-family: monospace;

          font-size: 10px;

          letter-spacing: 1px;

          color: #8b8982;

          cursor: pointer;

          flex-shrink: 0;

          white-space: nowrap;

          display: flex;

          align-items: center;

          justify-content: center;

          box-sizing: border-box;

          transition:
            background 0.15s ease,
            border-color 0.15s ease,
            box-shadow 0.15s ease;
        }


        .company-tab:hover {
          color: #151713;
        }


        .company-tab.active {
          background: #fff;

          color: #151713;

          border: 1px solid #e8e5de;

          box-shadow:
            0 2px 6px
            rgba(0, 0, 0, 0.07);
        }


        /* =========================================
           TAB CONTENT
        ========================================= */

        .company-tab-content {
          width: 100%;

          box-sizing: border-box;
        }


        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 1200px) {

          .company-stats {
            gap: 30px;
          }

        }


        @media (max-width: 1000px) {

          .company-summary {
            flex-direction: column;

            align-items: flex-start;

            gap: 20px;
          }


          .company-stats {
            width: 100%;

            justify-content: space-between;

            flex-wrap: wrap;

            gap: 20px;
          }

        }


        @media (max-width: 900px) {

          .company-dashboard {
            padding-left: 18px;

            padding-right: 18px;
          }


          .company-dashboard-header {
            align-items: flex-start;
          }


          .company-dashboard-header h1 {
            font-size: 25px;
          }

        }


        @media (max-width: 600px) {

          .company-dashboard {
            padding-left: 12px;

            padding-right: 12px;
          }


          .company-dashboard-header {
            flex-direction: column;

            gap: 15px;

            align-items: flex-start;
          }


          .company-actions {
            width: 100%;
          }


          .company-summary {
            padding: 16px;
          }


          .company-left {
            width: 100%;
          }


          .company-identifiers {
            white-space: normal;

            flex-wrap: wrap;
          }


          .company-stats {
            justify-content: flex-start;
          }

        }

      `}</style>

    </div>
  );
};

export default Dashboard;
