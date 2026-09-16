import React, { useState, useEffect, useCallback } from "react";
import storageService from "../../../core/services/storage.service";
import CompanyManagementService from "../../../core/services/modules/companyManagement.service";
import useAuthStore from "../../../store/slices/auth.store";

// ─── Dropdown options ─────────────────────────────────────────────────────────
const COUNTRY_CODES = ["+91", "+1", "+44", "+971", "+65"];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  roleId: "",
  countryCode: "+91",
  mobile: "",
  employeeId: "",
  company: "",
  branch: "",
  department: "",
  status: "active",
  sendEmail: "yes",
  joiningDate: "",
  message: "",
};

// ─── Invite User Modal ────────────────────────────────────────────────────────
function InviteUserModal({ onClose, onSuccess, rolesList, tenantId, companyName }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (f, v) => {
    setForm(p => ({ ...p, [f]: v }));
    setErrors(p => ({ ...p, [f]: "" }));
    setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) {
      e.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Enter a valid email address";
    }
    if (!form.password) {
      e.password = "Password is required";
    } else if (form.password.length < 8) {
      e.password = "Password must contain at least 8 characters";
    }
    if (!form.roleId) e.roleId = "Please select a role";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");
    try {
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
      const payload = {
        name: fullName,
        email: form.email.trim().toLowerCase(),
        password: form.password,
        tenantId: Number(tenantId),
        roleIds: form.roleId ? [Number(form.roleId)] : [],
      };
      await CompanyManagementService.createUser(payload);
      onSuccess(`User "${fullName}" invited successfully!`);
      onClose();
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      let msg = data?.detail || data?.message || err.message;
      if (status === 422 && data?.detail) {
        msg = data.detail;
      } else if (
        status === 500 &&
        (data?.error === "Internal Server Error" ||
          String(msg).toLowerCase().includes("duplicate") ||
          String(msg).toLowerCase().includes("email"))
      ) {
        msg = "A user with this email address already exists in this tenant.";
      }
      setServerError(msg || "Failed to invite user. Please verify input data.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ivm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ivm-modal">

        {/* Header */}
        <div className="ivm-head">
          <div>
            <h2>Invite User</h2>
            <p>Invite a new user to join {companyName || "Organization"}</p>
          </div>
          <button className="ivm-close" onClick={onClose} disabled={submitting}>✕</button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="ivm-server-error">
            <span>⚠</span> {serverError}
          </div>
        )}

        {/* Body */}
        <div className="ivm-body">

          {/* Row container for 2-column layout */}
          <div className="ivm-row">

            {/* ── Left: User Information ── */}
            <div className="ivm-section">
              <div className="ivm-sec-head">
                <div className="ivm-sec-icon">👤</div>
                <div>
                  <strong>User Information</strong>
                  <span>Enter the basic details of the user</span>
                </div>
              </div>

              <div className="ivm-grid-2">
                <div className="ivm-field">
                  <label>First Name <span className="ivm-req">*</span></label>
                  <div className="ivm-icon-wrap">
                    <span className="ivm-fi">👤</span>
                    <input value={form.firstName} onChange={e => set("firstName", e.target.value)}
                      placeholder="Enter first name" className={`ivm-input ivm-input--icon${errors.firstName ? " ivm-input--err" : ""}`} />
                  </div>
                  {errors.firstName && <span className="ivm-err">{errors.firstName}</span>}
                </div>

                <div className="ivm-field">
                  <label>Last Name <span className="ivm-req">*</span></label>
                  <div className="ivm-icon-wrap">
                    <span className="ivm-fi">👤</span>
                    <input value={form.lastName} onChange={e => set("lastName", e.target.value)}
                      placeholder="Enter last name" className={`ivm-input ivm-input--icon${errors.lastName ? " ivm-input--err" : ""}`} />
                  </div>
                  {errors.lastName && <span className="ivm-err">{errors.lastName}</span>}
                </div>
              </div>

              <div className="ivm-grid-2">
                <div className="ivm-field">
                  <label>Email Address <span className="ivm-req">*</span></label>
                  <div className="ivm-icon-wrap">
                    <span className="ivm-fi">✉</span>
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                      placeholder="Enter email address" className={`ivm-input ivm-input--icon${errors.email ? " ivm-input--err" : ""}`} />
                  </div>
                  {errors.email && <span className="ivm-err">{errors.email}</span>}
                </div>

                <div className="ivm-field">
                  <label>Password <span className="ivm-req">*</span></label>
                  <div className="ivm-icon-wrap">
                    <span className="ivm-fi">🔑</span>
                    <input type="password" value={form.password} onChange={e => set("password", e.target.value)}
                      placeholder="Minimum 8 characters" className={`ivm-input ivm-input--icon${errors.password ? " ivm-input--err" : ""}`} />
                  </div>
                  {errors.password && <span className="ivm-err">{errors.password}</span>}
                </div>
              </div>

              <div className="ivm-grid-2">
                <div className="ivm-field">
                  <label>Mobile Number (Optional)</label>
                  <div className="ivm-mobile-wrap">
                    <select value={form.countryCode} onChange={e => set("countryCode", e.target.value)} className="ivm-cc">
                      {COUNTRY_CODES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="ivm-icon-wrap" style={{ flex: 1 }}>
                      <span className="ivm-fi">📞</span>
                      <input value={form.mobile} onChange={e => set("mobile", e.target.value)}
                        placeholder="Enter mobile number" className="ivm-input ivm-input--icon" />
                    </div>
                  </div>
                </div>

                <div className="ivm-field">
                  <label>Employee ID (Optional)</label>
                  <div className="ivm-icon-wrap">
                    <span className="ivm-fi">🆔</span>
                    <input value={form.employeeId} onChange={e => set("employeeId", e.target.value)}
                      placeholder="Enter employee ID" className="ivm-input ivm-input--icon" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Organization Assignment ── */}
            <div className="ivm-section">
              <div className="ivm-sec-head">
                <div className="ivm-sec-icon">🏢</div>
                <div>
                  <strong>Role & Organization</strong>
                  <span>Assign role and organization</span>
                </div>
              </div>

              <div className="ivm-field">
                <label>Role <span className="ivm-req">*</span></label>
                <div className="ivm-sel-wrap">
                  <select value={form.roleId} onChange={e => set("roleId", e.target.value)}
                    className={`ivm-select${errors.roleId ? " ivm-input--err" : ""}`}>
                    <option value="">Select role</option>
                    {(rolesList || []).map(r => (
                      <option key={r.id} value={r.id}>
                        {String(r.name).replace(/^ROLE_/, "").replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                  <span className="ivm-chev">▾</span>
                </div>
                {errors.roleId && <span className="ivm-err">{errors.roleId}</span>}
              </div>

              <div className="ivm-field">
                <label>Organization</label>
                <input value={companyName || "Current Organization"} disabled className="ivm-input ivm-input--disabled" />
              </div>
            </div>

          </div>

          {/* ── Full-width: Access & Invitation Settings ── */}
          <div className="ivm-section">
            <div className="ivm-sec-head">
              <div className="ivm-sec-icon">🔒</div>
              <div>
                <strong>Access & Invitation Settings</strong>
                <span>Set access status and invitation preferences</span>
              </div>
            </div>

            <div className="ivm-grid-3">
              {/* User Status */}
              <div className="ivm-field">
                <label>User Status <span className="ivm-req">*</span></label>
                <div className="ivm-pill-row">
                  <label className={`ivm-pill${form.status === "active" ? " ivm-pill--on" : ""}`}>
                    <input type="radio" name="ivm-status" value="active" checked={form.status === "active"} onChange={() => set("status", "active")} />
                    <span className="ivm-dot" />
                    Active
                  </label>
                  <label className={`ivm-pill${form.status === "inactive" ? " ivm-pill--off" : ""}`}>
                    <input type="radio" name="ivm-status" value="inactive" checked={form.status === "inactive"} onChange={() => set("status", "inactive")} />
                    <span className="ivm-dot ivm-dot--grey" />
                    Inactive
                  </label>
                </div>
              </div>

              {/* Send Invitation Email */}
              <div className="ivm-field">
                <label>Send Invitation Email <span className="ivm-req">*</span></label>
                <div className="ivm-pill-row">
                  <label className={`ivm-pill${form.sendEmail === "yes" ? " ivm-pill--on" : ""}`}>
                    <input type="radio" name="ivm-email" value="yes" checked={form.sendEmail === "yes"} onChange={() => set("sendEmail", "yes")} />
                    <span className="ivm-dot" />
                    Yes, send invitation email
                  </label>
                  <label className={`ivm-pill${form.sendEmail === "no" ? " ivm-pill--off" : ""}`}>
                    <input type="radio" name="ivm-email" value="no" checked={form.sendEmail === "no"} onChange={() => set("sendEmail", "no")} />
                    <span className="ivm-dot ivm-dot--grey" />
                    No, I will invite later
                  </label>
                </div>
              </div>

              {/* Joining Date */}
              <div className="ivm-field">
                <label>Joining Date (Optional)</label>
                <div className="ivm-icon-wrap">
                  <span className="ivm-fi">📅</span>
                  <input type="date" value={form.joiningDate} onChange={e => set("joiningDate", e.target.value)}
                    placeholder="Select joining date" className="ivm-input ivm-input--icon" />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="ivm-field">
              <label>Message (Optional)</label>
              <textarea rows={3} value={form.message} onChange={e => set("message", e.target.value)}
                placeholder="Add a personal message to the invitation email..." className="ivm-input ivm-textarea" maxLength={250} />
              <div className="ivm-char-count">{form.message.length}/250</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="ivm-footer">
          <button className="ivm-btn-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="ivm-btn-submit" onClick={submit} disabled={submitting}>
            <span style={{ marginRight: 6 }}>✉</span> {submitting ? "Inviting..." : "Send Invitation"}
          </button>
        </div>

      </div>

      {/* Styles */}
      <style>{`
        .ivm-overlay { position: fixed; inset: 0; background: rgba(16,19,15,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .ivm-modal { background: #f5f4ef; border: 1px solid #e1dfd8; border-radius: 18px; width: 100%; max-width: 920px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,0.16); overflow: hidden; }
        
        .ivm-head { display: flex; justify-content: space-between; align-items: flex-start; padding: 22px 26px 16px; border-bottom: 1px solid #e1dfd8; background: #f5f4ef; flex-shrink: 0; }
        .ivm-head h2 { margin: 0 0 4px; font-family: Georgia, "Times New Roman", serif; font-size: 20px; font-weight: 700; color: #10130f; }
        .ivm-head p { margin: 0; font-size: 12px; color: #99988f; }
        .ivm-close { background: #fff; border: 1px solid #e1dfd8; width: 32px; height: 32px; border-radius: 9px; font-size: 14px; color: #7a7970; cursor: pointer; display: grid; place-items: center; flex-shrink: 0; }
        .ivm-close:hover:not(:disabled) { background: #ece9e0; color: #10130f; }
        
        .ivm-server-error { margin: 12px 26px 0; padding: 10px 14px; border-radius: 10px; background: #fdeded; border: 1px solid #f5c6cb; color: #b71c1c; font-size: 12px; display: flex; align-items: center; gap: 8px; }
        
        .ivm-body { overflow-y: auto; padding: 14px 26px 20px; display: flex; flex-direction: column; gap: 14px; background: #f5f4ef; }
        .ivm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        
        .ivm-section { background: #fff; border: 1px solid #e1dfd8; border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 12px; }
        .ivm-sec-head { display: flex; align-items: flex-start; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid #ece9e0; }
        .ivm-sec-icon { width: 34px; height: 34px; background: #f5f4ef; border: 1px solid #e1dfd8; border-radius: 10px; display: grid; place-items: center; font-size: 15px; flex-shrink: 0; }
        .ivm-sec-head strong { display: block; font-size: 13px; font-weight: 600; color: #10130f; margin-bottom: 2px; }
        .ivm-sec-head span { font-size: 11px; color: #99988f; }
        
        .ivm-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .ivm-field { display: flex; flex-direction: column; gap: 5px; }
        .ivm-field label { font-size: 11px; font-weight: 500; color: #4a4a40; }
        .ivm-req { color: #c0392b; }
        
        .ivm-input { width: 100%; padding: 9px 12px; border: 1px solid #e0ddd5; border-radius: 10px; font-size: 12px; color: #10130f; background: #faf9f5; outline: none; box-sizing: border-box; transition: border-color 0.15s, background 0.15s; }
        .ivm-input::placeholder { color: #b8b5ad; }
        .ivm-input:focus { border-color: #10130f; background: #fff; }
        .ivm-input--err { border-color: #c0392b !important; background: #fef8f7 !important; }
        .ivm-input--disabled { background: #eeebe3; color: #888; cursor: not-allowed; }
        .ivm-textarea { resize: vertical; min-height: 52px; }
        
        .ivm-icon-wrap { position: relative; }
        .ivm-fi { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); font-size: 12px; color: #b0ada5; pointer-events: none; }
        .ivm-input--icon { padding-left: 30px; }
        
        .ivm-mobile-wrap { display: flex; gap: 8px; }
        .ivm-cc { width: 75px; padding: 9px 6px; border: 1px solid #e0ddd5; border-radius: 10px; font-size: 12px; color: #10130f; background: #faf9f5; outline: none; cursor: pointer; }
        
        .ivm-sel-wrap { position: relative; }
        .ivm-select { width: 100%; padding: 9px 34px 9px 12px; border: 1px solid #e0ddd5; border-radius: 10px; font-size: 12px; color: #10130f; background: #faf9f5; appearance: none; outline: none; cursor: pointer; box-sizing: border-box; transition: border-color 0.15s; }
        .ivm-select:focus { border-color: #10130f; background: #fff; }
        .ivm-chev { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); color: #9a9890; font-size: 11px; pointer-events: none; }
        
        .ivm-err { font-size: 10px; color: #c0392b; }
        
        .ivm-pill-row { display: flex; gap: 8px; flex-wrap: wrap; padding-top: 2px; }
        .ivm-pill { display: flex; align-items: center; gap: 8px; padding: 7px 14px; border: 1.5px solid #e1dfd8; border-radius: 50px; cursor: pointer; font-size: 11px; color: #3a3a30; background: #faf9f5; transition: all 0.15s; user-select: none; }
        .ivm-pill input[type="radio"] { display: none; }
        .ivm-dot { width: 8px; height: 8px; border-radius: 50%; background: #3d8a30; flex-shrink: 0; }
        .ivm-dot--grey { background: #b0b0a8; }
        .ivm-pill--on { border-color: #7dba6a; background: #f2faf0; color: #2e6e22; }
        .ivm-pill--off { border-color: #e1dfd8; background: #faf9f5; }
        
        .ivm-char-count { text-align: right; font-size: 10px; color: #9a9890; margin-top: -2px; }
        
        .ivm-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 26px; border-top: 1px solid #e1dfd8; background: #f5f4ef; flex-shrink: 0; }
        .ivm-btn-cancel { height: 36px; padding: 0 18px; border: 1px solid #e0ddd5; border-radius: 11px; background: #fff; color: #20221e; font-size: 12px; font-weight: 500; cursor: pointer; }
        .ivm-btn-cancel:hover:not(:disabled) { background: #ece9e0; }
        .ivm-btn-submit { height: 36px; padding: 0 20px; border: none; border-radius: 11px; background: #111410; color: #fff; font-size: 12px; font-weight: 500; cursor: pointer; display: flex; align-items: center; transition: background 0.15s; }
        .ivm-btn-submit:hover:not(:disabled) { background: #1e2419; }
        .ivm-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        
        @media (max-width: 860px) {
          .ivm-row { grid-template-columns: 1fr; }
          .ivm-grid-2 { grid-template-columns: 1fr; }
          .ivm-modal { border-radius: 14px; }
          .ivm-head, .ivm-footer { padding-left: 16px; padding-right: 16px; }
          .ivm-body { padding: 0 16px 18px; }
        }
      `}</style>
    </div>
  );
}

// ─── Users Component ──────────────────────────────────────────────────────────
const Users = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  // Authenticated user & tenant detection
  const authUser = useAuthStore((state) => state.user);
  const currentUser = authUser || storageService.getUser();
  const tenantId = currentUser?.tenantId;

  // RBAC validation: Check if user has TENANT_ADMIN or SUPER_ADMIN role
  const isAuthorizedAdmin = useCallback(() => {
    if (!currentUser) return false;
    const rawRoles = Array.isArray(currentUser.roles)
      ? currentUser.roles
      : typeof currentUser.roles === "string"
      ? [currentUser.roles]
      : currentUser.role
      ? Array.isArray(currentUser.role)
        ? currentUser.role
        : [currentUser.role]
      : [];
    return rawRoles.some((r) => {
      const normalized = String(r)
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .toUpperCase()
        .replace(/^ROLE_/, "")
        .replace(/[\s-]/g, "_");
      return (
        normalized === "TENANT_ADMIN" ||
        normalized === "SUPER_ADMIN" ||
        normalized === "ADMIN"
      );
    });
  }, [currentUser]);

  const hasAdminAccess = isAuthorizedAdmin();

  // Load live users from backend
  const loadUsers = useCallback(async () => {
    if (!hasAdminAccess || !tenantId) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const { data } = await CompanyManagementService.getUsers(tenantId);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Unable to load users from server.");
    } finally {
      setLoading(false);
    }
  }, [hasAdminAccess, tenantId]);

  // Load live roles from backend
  const loadRoles = useCallback(async () => {
    if (!hasAdminAccess || !tenantId) return;
    try {
      const { data } = await CompanyManagementService.getRoles(tenantId);
      setRolesList(Array.isArray(data) ? data : []);
    } catch {
      // Non-blocking: Roles will retry or show empty list
    }
  }, [hasAdminAccess, tenantId]);

  useEffect(() => {
    if (hasAdminAccess) {
      loadUsers();
      loadRoles();
    } else {
      setLoading(false);
    }
  }, [hasAdminAccess, loadUsers, loadRoles]);

  // Activate / Deactivate user status
  const handleToggleStatus = async (user) => {
    if (!tenantId || togglingId !== null) return;
    const newActive = !user.active;
    setTogglingId(user.id);
    try {
      await CompanyManagementService.changeUserStatus(user.id, tenantId, newActive);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, active: newActive } : u))
      );
      setSuccessMsg(`User "${user.name}" ${newActive ? "activated" : "deactivated"} successfully.`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Failed to update user status.");
      setTimeout(() => setErrorMsg(""), 4000);
    } finally {
      setTogglingId(null);
    }
  };

  // Helper formatting
  const getInitials = (name, email) => {
    if (name) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2 && parts[0] && parts[1]) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.trim().slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return "U";
  };

  const formatRoles = (roles) => {
    if (!roles || !roles.length) return "No Role";
    const list = Array.isArray(roles) ? roles : [roles];
    return list
      .map((r) => String(r).replace(/^ROLE_/, "").replace(/_/g, " "))
      .join(", ");
  };

  // Filter users by search query
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const name = (u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const role = formatRoles(u.roles).toLowerCase();
    const branch = (u.branchName || "").toLowerCase();
    return name.includes(q) || email.includes(q) || role.includes(q) || branch.includes(q);
  });

  // Non-Admin UI: Clean permission restriction state
  if (!hasAdminAccess) {
    return (
      <div className="users-content">
        <section className="users-card">
          <div className="users-header">
            <div className="users-title">
              <h2>Users</h2>
            </div>
          </div>
          <div className="users-permission-denied">
            <div className="upd-icon">🔒</div>
            <h3>Access Restricted</h3>
            <p>
              Only Administrators have permission to view and manage company users.
              <br />
              Please contact your organization administrator if you need access.
            </p>
          </div>
        </section>

        <style>{`
          .users-content { width: 100%; }
          .users-card { background: #fff; border: 1px solid #e1dfd8; border-radius: 15px; overflow: hidden; }
          .users-header { min-height: 66px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e3e0d8; }
          .users-title h2 { margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: 17px; font-weight: 400; color: #11140f; }
          .users-permission-denied { padding: 60px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
          .upd-icon { font-size: 36px; margin-bottom: 12px; opacity: 0.7; }
          .users-permission-denied h3 { font-family: Georgia, "Times New Roman", serif; font-size: 16px; font-weight: 600; color: #11140f; margin: 0 0 6px; }
          .users-permission-denied p { font-family: monospace; font-size: 11px; color: #7a776f; max-width: 460px; line-height: 1.6; margin: 0; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="users-content">
      {/* Toast Feedback notifications */}
      {successMsg && (
        <div className="users-alert users-alert--success">
          <span>✓</span> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="users-alert users-alert--error">
          <span>⚠</span> {errorMsg}
        </div>
      )}

      <section className="users-card">
        <div className="users-header">
          <div className="users-title">
            <h2>Users</h2>
            <div className="user-search">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <button className="invite-btn" onClick={() => setShowModal(true)}>
            + Invite User
          </button>
        </div>

        <div className="users-table-header">
          <div>USER</div>
          <div>ROLE</div>
          <div>BRANCH</div>
          <div>LAST LOGIN</div>
          <div>STATUS</div>
        </div>

        {loading ? (
          <div className="users-state-box">
            <div className="users-spinner" />
            <p>Loading company users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="users-state-box">
            <p className="users-empty-text">
              {search ? `No users matching "${search}"` : "No users found in this organization."}
            </p>
            {!search && (
              <button className="invite-btn" style={{ marginTop: 10 }} onClick={() => setShowModal(true)}>
                + Invite First User
              </button>
            )}
          </div>
        ) : (
          <div className="users-list">
            {filteredUsers.map((u) => (
              <div className="user-row" key={u.id}>
                <div className="user-info">
                  <div className="user-avatar">{getInitials(u.name, u.email)}</div>
                  <div>
                    <div className="user-name">{u.name}</div>
                    <div className="user-email">{u.email}</div>
                  </div>
                </div>
                <div className="user-role">{formatRoles(u.roles)}</div>
                <div className="user-branch">{u.branchName || "—"}</div>
                <div className="last-login">{u.active ? "Active" : "Inactive"}</div>
                <div className="user-status-cell">
                  <span className={`user-status ${u.active ? "active" : "inactive"}`}>
                    {u.active ? "ACTIVE" : "INACTIVE"}
                  </span>
                  <button
                    className="status-toggle-btn"
                    onClick={() => handleToggleStatus(u)}
                    disabled={togglingId === u.id}
                    title={u.active ? "Deactivate user" : "Activate user"}
                  >
                    {togglingId === u.id ? "..." : u.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showModal && (
        <InviteUserModal
          rolesList={rolesList}
          tenantId={tenantId}
          companyName={currentUser?.companyName}
          onClose={() => setShowModal(false)}
          onSuccess={(msg) => {
            setSuccessMsg(msg);
            setTimeout(() => setSuccessMsg(""), 4000);
            loadUsers();
          }}
        />
      )}

      <style>{`
        .users-content { width: 100%; }
        
        .users-alert { margin-bottom: 14px; padding: 10px 16px; border-radius: 10px; font-family: monospace; font-size: 11px; display: flex; align-items: center; gap: 8px; }
        .users-alert--success { background: #e8f0e4; border: 1px solid #c4dec0; color: #2e6e22; }
        .users-alert--error { background: #fdeded; border: 1px solid #f5c6cb; color: #b71c1c; }
        
        .users-card { background: #fff; border: 1px solid #e1dfd8; border-radius: 15px; overflow: hidden; }
        .users-header { min-height: 66px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e3e0d8; }
        .users-title { display: flex; align-items: center; gap: 16px; }
        .users-header h2 { margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: 17px; font-weight: 400; color: #11140f; }
        .user-search { width: 320px; height: 35px; border-radius: 11px; background: #f5f4f0; border: 1px solid #e2dfd8; display: flex; align-items: center; padding: 0 11px; }
        .search-icon { font-size: 17px; color: #aaa69f; margin-right: 7px; }
        .user-search input { width: 100%; border: none; outline: none; background: transparent; font-family: monospace; font-size: 9px; color: #555; }
        .user-search input::placeholder { color: #aaa69f; }
        
        .invite-btn { height: 32px; padding: 0 15px; border: none; border-radius: 11px; background: #111410; color: #fff; font-family: monospace; font-size: 9px; cursor: pointer; transition: background 0.15s; }
        .invite-btn:hover { background: #262c20; }
        
        .users-table-header { height: 38px; display: grid; grid-template-columns: 2.1fr 1.8fr 1.4fr 1.3fr 1.4fr; align-items: center; padding: 0 20px; border-bottom: 1px solid #e3e0d8; color: #aaa69e; font-family: monospace; font-size: 7px; letter-spacing: 0.6px; }
        .user-row { min-height: 61px; display: grid; grid-template-columns: 2.1fr 1.8fr 1.4fr 1.3fr 1.4fr; align-items: center; padding: 0 20px; border-bottom: 1px solid #e3e0d8; }
        .user-row:last-child { border-bottom: none; }
        
        .user-info { display: flex; align-items: center; gap: 12px; }
        .user-avatar { width: 32px; height: 32px; flex-shrink: 0; border-radius: 50%; background: #f0f3ed; border: 1px solid #dce4d7; display: flex; align-items: center; justify-content: center; font-family: monospace; font-size: 8px; color: #6c7768; }
        .user-name { font-family: monospace; font-size: 11px; color: #11140f; margin-bottom: 2px; }
        .user-email { font-family: monospace; font-size: 8px; color: #aaa69e; }
        .user-role, .user-branch, .last-login { font-family: monospace; font-size: 9px; color: #817e77; }
        
        .user-status-cell { display: flex; align-items: center; gap: 8px; }
        .user-status { display: inline-block; padding: 5px 10px; border-radius: 8px; font-family: monospace; font-size: 8px; }
        .user-status.active { background: #e8f0e4; color: #63755c; }
        .user-status.inactive { background: #e9e7e1; color: #969188; }
        
        .status-toggle-btn { padding: 4px 8px; border-radius: 6px; border: 1px solid #e0ddd5; background: #fff; font-family: monospace; font-size: 8px; color: #55534c; cursor: pointer; transition: all 0.15s; }
        .status-toggle-btn:hover:not(:disabled) { background: #ece9e0; border-color: #cac6bc; color: #111410; }
        .status-toggle-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .users-state-box { padding: 50px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .users-spinner { width: 22px; height: 22px; border: 2px solid #e1dfd8; border-top-color: #111410; border-radius: 50%; animation: users-spin 0.8s linear infinite; margin-bottom: 12px; }
        @keyframes users-spin { to { transform: rotate(360deg); } }
        .users-state-box p { font-family: monospace; font-size: 10px; color: #99968d; margin: 0; }
        
        @media (max-width: 1000px) { .users-card { overflow-x: auto; } .users-table-header, .user-row { min-width: 950px; } }
        @media (max-width: 700px) { .users-title { flex-direction: column; align-items: flex-start; } .users-header { height: auto; padding: 15px; gap: 15px; } .user-search { width: 240px; } }
      `}</style>
    </div>
  );
};

export default Users;
