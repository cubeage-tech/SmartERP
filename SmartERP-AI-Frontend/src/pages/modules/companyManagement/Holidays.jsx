import { useCallback, useEffect, useRef, useState } from "react";
import CompanyManagementService from "../../../core/services/modules/companyManagement.service";
import useActiveCompany from "../../../core/hooks/useActiveCompany";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TYPE_COLORS = {
  "Public Holiday":   "bg-[#e8f5e2] text-[#3d7030]",
  "Regional Holiday": "bg-[#fff3e0] text-[#8a5800]",
  "Optional Holiday": "bg-[#f0edff] text-[#5b4aad]",
  "Company Holiday":  "bg-[#e3f2fd] text-[#1565c0]",
};

const PER_PAGE = 7;
const TYPES    = ["Public Holiday", "Regional Holiday", "Optional Holiday", "Company Holiday"];
const BRANCHES = ["All Branches", "Mumbai Office", "Pune, Mumbai", "Delhi Office", "Bengaluru Branch"];

/** Normalise a `HolidayResponse` from the backend into display-friendly shape */
function normalise(h) {
  const rawDate = h.date || "";
  // Backend returns LocalDate as "YYYY-MM-DD"; convert to "26 Jan 2026"
  let displayDate = rawDate;
  let displayDay  = h.day || "";
  if (rawDate && rawDate.includes("-")) {
    const d = new Date(rawDate + "T00:00:00");
    if (!isNaN(d)) {
      displayDate = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      displayDay  = h.day || d.toLocaleDateString("en-GB", { weekday: "long" });
    }
  }
  // optional: backend sends "yes"/"no"/"true"/"false"
  const optRaw = (h.optional || "").toString().toLowerCase();
  const optional = (optRaw === "yes" || optRaw === "true") ? "Yes" : "No";
  // status: ACTIVE → Active
  const status = h.status
    ? h.status.charAt(0).toUpperCase() + h.status.slice(1).toLowerCase()
    : "Active";

  return { ...h, date: displayDate, _isoDate: rawDate, day: displayDay, optional, status };
}

// ─── View Details Modal ───────────────────────────────────────────────────────
function ViewHolidayModal({ holiday, onClose }) {
  if (!holiday) return null;
  const rows = [
    ["Holiday Name", holiday.name],
    ["Date",         holiday.date],
    ["Day",          holiday.day],
    ["Type",         holiday.type],
    ["Applies To",   holiday.appliesTo],
    ["Optional",     holiday.optional],
    ["Status",       holiday.status],
  ];
  return (
    <div className="fixed inset-0 bg-[rgba(16,19,15,0.45)] flex items-center justify-center z-50 p-5"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#f5f4ef] border border-[#e1dfd8] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-start px-6 py-5 border-b border-[#e1dfd8]">
          <div>
            <h2 className="text-[18px] font-bold text-[#10130f]">Holiday Details</h2>
            <p className="text-[12px] text-[#99988f] mt-0.5">Read-only view</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white border border-[#e1dfd8] rounded-[9px] text-[#7a7970] text-[14px] grid place-items-center hover:bg-[#ece9e0]">✕</button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-3">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between text-[13px]">
              <span className="text-[#7a7970] font-medium">{label}</span>
              {label === "Type" ? (
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${TYPE_COLORS[value] || "bg-gray-100 text-gray-600"}`}>{value}</span>
              ) : label === "Status" ? (
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${value === "Active" ? "bg-[#e8f0e4] text-[#3d6630]" : "bg-[#f0ede6] text-[#7a7060]"}`}>{value}</span>
              ) : (
                <span className="text-[#10130f]">{value || "—"}</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end px-6 py-4 border-t border-[#e1dfd8]">
          <button onClick={onClose} className="h-9 px-5 bg-[#111410] text-white rounded-xl text-[12px] font-medium hover:bg-[#1e2419] transition">Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add / Edit Holiday Modal ─────────────────────────────────────────────────
function HolidayFormModal({ onClose, onSave, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    name:     initial?.name       || "",
    date:     initial?._isoDate   || "",
    type:     initial?.type       || "",
    branch:   initial?.appliesTo  || "All Branches",
    optional: initial?.optional   || "No",
    status:   initial?.status     || "Active",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: "" })); };

  const submit = async () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.date)        e.date = "Required";
    if (!form.type)        e.type = "Required";
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      await onSave({
        name:     form.name,
        date:     form.date,          // ISO "YYYY-MM-DD" — what backend expects
        type:     form.type,
        appliesTo: form.branch,
        optional: form.optional,
        status:   form.status.toUpperCase(),
      });
      onClose();
    } catch (err) {
      setErrors({ _global: err.response?.data?.detail || err.response?.data?.message || "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(16,19,15,0.45)] flex items-center justify-center z-50 p-5"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#f5f4ef] border border-[#e1dfd8] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-start px-6 py-5 border-b border-[#e1dfd8] bg-[#f5f4ef]">
          <div>
            <h2 className="text-[18px] font-bold text-[#10130f] mb-1">{isEdit ? "Edit Holiday" : "Add Holiday"}</h2>
            <p className="text-[12px] text-[#99988f]">{isEdit ? "Update holiday details." : "Add a new holiday to the organization calendar."}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white border border-[#e1dfd8] rounded-[9px] text-[#7a7970] text-[14px] grid place-items-center hover:bg-[#ece9e0]">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">

          {errors._global && <div className="px-3 py-2 bg-[#fff0f0] border border-[#f5c2c2] rounded-xl text-[12px] text-[#c0392b]">{errors._global}</div>}

          {/* Holiday Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[#4a4a40]">Holiday Name <span className="text-[#c0392b]">*</span></label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Independence Day"
              className={`w-full px-3 py-[10px] border rounded-[10px] text-[13px] bg-[#faf9f5] outline-none text-[#10130f] placeholder-[#b8b5ad] transition ${errors.name ? "border-[#c0392b]" : "border-[#e0ddd5] focus:border-[#10130f]"}`} />
            {errors.name && <span className="text-[11px] text-[#c0392b]">{errors.name}</span>}
          </div>

          {/* Date + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#4a4a40]">Date <span className="text-[#c0392b]">*</span></label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                className={`w-full px-3 py-[10px] border rounded-[10px] text-[13px] bg-[#faf9f5] outline-none text-[#10130f] transition ${errors.date ? "border-[#c0392b]" : "border-[#e0ddd5] focus:border-[#10130f]"}`} />
              {errors.date && <span className="text-[11px] text-[#c0392b]">{errors.date}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#4a4a40]">Holiday Type <span className="text-[#c0392b]">*</span></label>
              <div className="relative">
                <select value={form.type} onChange={e => set("type", e.target.value)}
                  className={`w-full px-3 py-[10px] pr-8 border rounded-[10px] text-[13px] bg-[#faf9f5] outline-none appearance-none text-[#10130f] transition ${errors.type ? "border-[#c0392b]" : "border-[#e0ddd5] focus:border-[#10130f]"}`}>
                  <option value="">Select type</option>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9890] text-[11px] pointer-events-none">▾</span>
              </div>
              {errors.type && <span className="text-[11px] text-[#c0392b]">{errors.type}</span>}
            </div>
          </div>

          {/* Branch + Optional */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#4a4a40]">Applies To</label>
              <div className="relative">
                <select value={form.branch} onChange={e => set("branch", e.target.value)}
                  className="w-full px-3 py-[10px] pr-8 border border-[#e0ddd5] rounded-[10px] text-[13px] bg-[#faf9f5] outline-none appearance-none text-[#10130f] focus:border-[#10130f] transition">
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9890] text-[11px] pointer-events-none">▾</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#4a4a40]">Optional</label>
              <div className="relative">
                <select value={form.optional} onChange={e => set("optional", e.target.value)}
                  className="w-full px-3 py-[10px] pr-8 border border-[#e0ddd5] rounded-[10px] text-[13px] bg-[#faf9f5] outline-none appearance-none text-[#10130f] focus:border-[#10130f] transition">
                  <option>No</option>
                  <option>Yes</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9890] text-[11px] pointer-events-none">▾</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[#4a4a40]">Status</label>
            <div className="flex gap-2">
              {["Active", "Inactive"].map(s => (
                <label key={s} className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer text-[12px] transition select-none
                  ${form.status === s ? (s === "Active" ? "border-[#7dba6a] bg-[#f2faf0] text-[#2e6e22]" : "border-[#e1dfd8] bg-[#faf9f5] text-[#555]") : "border-[#e1dfd8] bg-[#faf9f5] text-[#555]"}`}>
                  <input type="radio" name="hol-status" className="hidden" checked={form.status === s} onChange={() => set("status", s)} />
                  <span className={`w-2 h-2 rounded-full ${s === "Active" ? "bg-[#3d8a30]" : "bg-[#b0b0a8]"}`} />
                  {s}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-[#e1dfd8] bg-[#f5f4ef]">
          <button onClick={onClose} disabled={saving} className="h-9 px-5 border border-[#e0ddd5] rounded-xl bg-white text-[#20221e] text-[12px] font-medium hover:bg-[#ece9e0] transition disabled:opacity-50">Cancel</button>
          <button onClick={submit} disabled={saving} className="h-9 px-5 bg-[#111410] text-white border-none rounded-xl text-[12px] font-medium hover:bg-[#1e2419] transition disabled:opacity-60">
            {saving ? "Saving…" : (isEdit ? "Save Changes" : "+ Add Holiday")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirmModal({ holiday, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState("");
  const confirm = async () => {
    setDeleting(true);
    setErr("");
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setErr(e.response?.data?.detail || e.response?.data?.message || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-[rgba(16,19,15,0.45)] flex items-center justify-center z-50 p-5"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#f5f4ef] border border-[#e1dfd8] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e1dfd8]">
          <h2 className="text-[16px] font-bold text-[#10130f]">Delete Holiday</h2>
          <p className="text-[12px] text-[#99988f] mt-1">This action cannot be undone.</p>
        </div>
        <div className="px-6 py-5">
          {err && <div className="mb-3 px-3 py-2 bg-[#fff0f0] border border-[#f5c2c2] rounded-xl text-[12px] text-[#c0392b]">{err}</div>}
          <p className="text-[13px] text-[#3a3a30]">Are you sure you want to delete <strong>{holiday?.name}</strong>?</p>
        </div>
        <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-[#e1dfd8]">
          <button onClick={onClose} disabled={deleting} className="h-9 px-5 border border-[#e0ddd5] rounded-xl bg-white text-[#20221e] text-[12px] font-medium hover:bg-[#ece9e0] transition disabled:opacity-50">Cancel</button>
          <button onClick={confirm} disabled={deleting} className="h-9 px-5 bg-[#c0392b] text-white rounded-xl text-[12px] font-medium hover:bg-[#a93226] transition disabled:opacity-60">
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Action menu ──────────────────────────────────────────────────────────────
function ActionMenu({ holiday, onView, onEdit, onDelete, onClose }) {
  return (
    <div className="absolute right-0 top-7 z-50 w-36 bg-white border border-[#e4e1d8] rounded-xl shadow-lg py-1 text-[12px]">
      <button onClick={() => { onView(holiday); onClose(); }} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#f5f4ef] text-[#3a3a30]">
        <span>👁</span> View Details
      </button>
      <button onClick={() => { onEdit(holiday); onClose(); }} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#f5f4ef] text-[#3a3a30]">
        <span>✏️</span> Edit
      </button>
      <div className="border-t border-[#e4e1d8] my-1" />
      <button onClick={() => { onDelete(holiday); onClose(); }} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#fff0f0] text-[#c0392b]">
        <span>🗑</span> Delete
      </button>
    </div>
  );
}

// ─── Holidays page ────────────────────────────────────────────────────────────
export default function Holidays({ companyId: providedCompanyId, dashboard: providedDashboard }) {
  const activeCompany = useActiveCompany(providedCompanyId);
  const companyId = providedCompanyId || activeCompany.companyId;
  const dashboard = providedDashboard || activeCompany.dashboard;

  const [holidays,     setHolidays]    = useState([]);
  const [loading,      setLoading]     = useState(false);
  const [error,        setError]       = useState("");

  // filters
  const [search,       setSearch]      = useState("");
  const [yearFilter,   setYearFilter]  = useState(String(new Date().getFullYear()));
  const [typeFilter,   setTypeFilter]  = useState("All Types");
  const [branchFilter, setBranchFilter]= useState("All Branches");
  const [statusFilter, setStatusFilter]= useState("Active");

  const [view,         setView]        = useState("list");
  const [page,         setPage]        = useState(1);
  const [openMenu,     setOpenMenu]    = useState(null);

  // modals
  const [showAddEdit,  setShowAddEdit] = useState(false);
  const [editTarget,   setEditTarget]  = useState(null);   // null = add, holiday = edit
  const [viewTarget,   setViewTarget]  = useState(null);
  const [deleteTarget, setDeleteTarget]= useState(null);

  // import / export
  const importFileRef                  = useRef(null);
  const [importing,    setImporting]   = useState(false);
  const [importResult, setImportResult]= useState(null); // { imported, skipped, errors[] } | null

  // ── Load holidays ────────────────────────────────────────────────────────
  const loadHolidays = useCallback(() => {
    if (!companyId) { setHolidays([]); return; }
    setLoading(true);
    setError("");
    CompanyManagementService.getHolidays(companyId, { year: yearFilter })
      .then(({ data }) => {
        setHolidays(Array.isArray(data) ? data.map(normalise) : []);
      })
      .catch(err => {
        setError(err.response?.data?.detail || err.response?.data?.message || "Unable to load holidays.");
      })
      .finally(() => setLoading(false));
  }, [companyId, yearFilter]);

  useEffect(() => { loadHolidays(); }, [loadHolidays]);

  // ── Derived stats ────────────────────────────────────────────────────────
  const total    = holidays.length;
  const publicH  = holidays.filter(h => h.type === "Public Holiday").length;
  const optional = holidays.filter(h => h.optional === "Yes").length;
  const company  = holidays.filter(h => h.type === "Company Holiday").length;
  const upcoming = [...holidays]
    .filter(h => h._isoDate && new Date(h._isoDate) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a._isoDate) - new Date(b._isoDate))[0];

  // ── Client-side filters ──────────────────────────────────────────────────
  const filtered = holidays.filter(h => {
    const q = search.toLowerCase();
    const matchSearch  = !q || h.name.toLowerCase().includes(q) || (h.type || "").toLowerCase().includes(q);
    const matchType    = typeFilter === "All Types"   || h.type === typeFilter;
    const matchBranch  = branchFilter === "All Branches" || (h.appliesTo || "").includes(branchFilter);
    const matchStatus  = statusFilter === "All"       || h.status === statusFilter;
    return matchSearch && matchType && matchBranch && matchStatus;
  });

  // ── Pagination ───────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleAdd = async (payload) => {
    const { data } = await CompanyManagementService.createHoliday(companyId, payload);
    setHolidays(cur => [...cur, normalise(data)]);
  };

  const handleEdit = async (payload) => {
    const { data } = await CompanyManagementService.updateHoliday(companyId, editTarget.id, payload);
    setHolidays(cur => cur.map(h => h.id === editTarget.id ? normalise(data) : h));
  };

  const handleDelete = async () => {
    await CompanyManagementService.removeHoliday(companyId, deleteTarget.id);
    setHolidays(cur => cur.filter(h => h.id !== deleteTarget.id));
  };

  const openEdit = (h) => { setEditTarget(h); setShowAddEdit(true); };
  const openAdd  = ()  => { setEditTarget(null); setShowAddEdit(true); };

  // ── Export ───────────────────────────────────────────────────────────────
  const handleExport = async () => {
    if (!companyId) return;
    try {
      const response = await CompanyManagementService.exportHolidays(companyId, yearFilter);
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `holidays-${companyId}-${yearFilter}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.message || "Export failed.");
    }
  };

  // ── Import ───────────────────────────────────────────────────────────────
  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !companyId) return;
    // Reset so the same file can be re-selected after correction
    e.target.value = "";
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setError("Import requires a CSV file (.csv).");
      return;
    }
    setImporting(true);
    setError("");
    setImportResult(null);
    try {
      const { data } = await CompanyManagementService.importHolidays(companyId, file);
      setImportResult(data);
      if (data.imported > 0) loadHolidays();  // refresh list if any rows persisted
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.message || "Import failed.";
      setError(msg);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f4ef] px-7 pb-12 pt-1">

      {(error || activeCompany.error) && (
        <div className="mb-3 px-4 py-2.5 border border-[#dfd8c9] rounded-xl bg-[#fffaf0] text-[#6b5b3e] text-xs flex items-center justify-between">
          <span>{error || activeCompany.error}</span>
          <button onClick={loadHolidays} className="ml-4 text-[11px] underline text-[#6b5b3e]">Retry</button>
        </div>
      )}

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-[10px] text-[#a3a6a5] mb-3 tracking-wide">
        <span>ADMINISTRATION</span><span>›</span>
        <span>COMPANY MANAGEMENT</span><span>›</span>
        <span className="text-[#10130f] font-semibold">HOLIDAYS</span>
      </div>

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[28px] font-bold text-[#10130f] leading-tight">Holidays</h1>
          <p className="text-[12px] text-[#99988f] mt-1">Manage public, company and optional holidays for your organization.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Hidden CSV file input for import */}
          <input
            ref={importFileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleImportFile}
          />
          <button
            onClick={handleExport}
            disabled={!companyId}
            className="h-9 px-4 bg-white border border-[#e0ddd5] rounded-xl text-[12px] text-[#20221e] font-medium flex items-center gap-2 hover:bg-[#f0efe9] transition disabled:opacity-50">
            <span>↑</span> Export
          </button>
          <button
            onClick={() => importFileRef.current?.click()}
            disabled={!companyId || importing}
            className="h-9 px-4 bg-white border border-[#e0ddd5] rounded-xl text-[12px] text-[#20221e] font-medium flex items-center gap-2 hover:bg-[#f0efe9] transition disabled:opacity-50">
            <span>↓</span> {importing ? "Importing…" : "Import Holidays"}
          </button>
          <button onClick={openAdd}
            className="h-9 px-4 bg-[#111410] text-white border-none rounded-xl text-[12px] font-medium flex items-center gap-2 hover:bg-[#1e2419] transition">
            + Add Holiday
          </button>
        </div>
      </div>

      {/* ── Company summary bar ── */}
      <div className="bg-white border border-[#e1dfd8] rounded-2xl flex items-center justify-between px-5 py-4 mb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#111410] grid grid-cols-2 gap-1 p-2.5 flex-shrink-0">
            {[0,1,2,3].map(i => <span key={i} className={`rounded-[3px] ${i===0?"bg-[#a1b294]":i===2?"bg-[#343a31]":"bg-[#4e574b]"}`} />)}
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-[#10130f]">{dashboard?.company?.companyName || "Company"}</h2>
            <p className="text-[10px] text-[#99988f] mt-0.5">GST: {dashboard?.company?.gstNumber || "—"} · PAN: {dashboard?.company?.pan || "—"} · CIN: {dashboard?.company?.cin || "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-10">
          {[[dashboard?.branches ?? 0,"BRANCHES"],[dashboard?.employees ?? 0,"EMPLOYEES"],[dashboard?.departments ?? 0,"DEPARTMENTS"],[dashboard?.plan || "—","PLAN"]].map(([v,l]) => (
            <div key={l} className="text-center">
              <div className="text-[18px] font-semibold text-[#10130f]">{v}</div>
              <div className="text-[9px] text-[#a0a09a] tracking-widest mt-0.5">{l}</div>
            </div>
          ))}
          <span className="bg-[#edf2e8] text-[#63755c] text-[9px] font-semibold px-3 py-1.5 rounded-xl tracking-wide">ACTIVE</span>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {[
          { icon: "📅", color: "text-blue-500",   bg: "bg-blue-50",   value: total,    label: "Total Holidays" },
          { icon: "🏛",  color: "text-green-600",  bg: "bg-green-50",  value: publicH,  label: "Public Holidays" },
          { icon: "⭐",  color: "text-orange-400", bg: "bg-orange-50", value: optional, label: "Optional Holidays" },
          { icon: "💼",  color: "text-purple-500", bg: "bg-purple-50", value: company,  label: "Company Holidays" },
          {
            icon: "🕐", color: "text-cyan-600", bg: "bg-cyan-50",
            value: upcoming ? upcoming.date : "—",
            label: "Upcoming Holiday",
            sub:   upcoming ? upcoming.name : "",
            wide:  true,
          },
        ].map(({ icon, color, bg, value, label, sub }) => (
          <div key={label} className="bg-white border border-[#e1dfd8] rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center text-[17px] flex-shrink-0`}>{icon}</div>
            <div>
              <div className="text-[20px] font-bold text-[#10130f] leading-tight">{value}</div>
              <div className="text-[9px] text-[#a0a09a] tracking-wide uppercase mt-0.5">{label}</div>
              {sub && <div className="text-[10px] text-[#60706a] mt-0.5">{sub}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters + View toggle ── */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {/* Year */}
        <div className="relative">
          <select value={yearFilter} onChange={e => { setYearFilter(e.target.value); setPage(1); }}
            className="h-9 pl-3 pr-7 border border-[#e0ddd5] rounded-xl bg-white text-[12px] text-[#10130f] outline-none appearance-none cursor-pointer">
            {["2024","2025","2026","2027"].map(y => <option key={y}>{y}</option>)}
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9a9890] text-[10px] pointer-events-none">▾</span>
          <span className="absolute left-3 -top-2.5 text-[9px] text-[#a0a09a] bg-white px-0.5">Year</span>
        </div>

        {/* Holiday Type */}
        <div className="relative">
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
            className="h-9 pl-3 pr-7 border border-[#e0ddd5] rounded-xl bg-white text-[12px] text-[#10130f] outline-none appearance-none cursor-pointer min-w-[120px]">
            {["All Types", ...TYPES].map(t => <option key={t}>{t}</option>)}
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9a9890] text-[10px] pointer-events-none">▾</span>
          <span className="absolute left-3 -top-2.5 text-[9px] text-[#a0a09a] bg-white px-0.5">Holiday Type</span>
        </div>

        {/* Branch */}
        <div className="relative">
          <select value={branchFilter} onChange={e => { setBranchFilter(e.target.value); setPage(1); }}
            className="h-9 pl-3 pr-7 border border-[#e0ddd5] rounded-xl bg-white text-[12px] text-[#10130f] outline-none appearance-none cursor-pointer min-w-[120px]">
            {["All Branches", ...BRANCHES.slice(1)].map(b => <option key={b}>{b}</option>)}
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9a9890] text-[10px] pointer-events-none">▾</span>
          <span className="absolute left-3 -top-2.5 text-[9px] text-[#a0a09a] bg-white px-0.5">Branch</span>
        </div>

        {/* Status */}
        <div className="relative">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-9 pl-3 pr-7 border border-[#e0ddd5] rounded-xl bg-white text-[12px] text-[#10130f] outline-none appearance-none cursor-pointer">
            {["Active", "Inactive", "All"].map(s => <option key={s}>{s}</option>)}
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9a9890] text-[10px] pointer-events-none">▾</span>
          <span className="absolute left-3 -top-2.5 text-[9px] text-[#a0a09a] bg-white px-0.5">Status</span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 h-9 px-3 bg-white border border-[#e0ddd5] rounded-xl flex-1 min-w-[180px]">
          <span className="text-[#b0b4b3] text-[14px]">⌕</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search holiday..." className="flex-1 text-[12px] outline-none bg-transparent text-[#10130f] placeholder-[#b8b5ad]" />
        </div>

        {/* View toggle */}
        <div className="ml-auto flex items-center border border-[#e0ddd5] rounded-xl overflow-hidden bg-white">
          <button onClick={() => setView("list")}
            className={`h-9 px-4 text-[12px] font-medium flex items-center gap-1.5 transition ${view === "list" ? "bg-[#111410] text-white" : "text-[#70746f] hover:bg-[#f5f4ef]"}`}>
            ☰ List View
          </button>
          <button onClick={() => setView("calendar")}
            className={`h-9 px-4 text-[12px] font-medium flex items-center gap-1.5 transition ${view === "calendar" ? "bg-[#111410] text-white" : "text-[#70746f] hover:bg-[#f5f4ef]"}`}>
            📅 Calendar View
          </button>
        </div>
      </div>

      {/* ── List view ── */}
      {view === "list" && (
        <div className="bg-white border border-[#e1dfd8] rounded-2xl overflow-hidden">

          {/* Table header */}
          <div className="grid grid-cols-[2fr_1.2fr_1fr_1.4fr_1.4fr_0.7fr_0.8fr_0.6fr] px-5 py-3 border-b border-[#e4e1d8] bg-[#faf9f5]">
            {["HOLIDAY NAME","DATE","DAY","TYPE","APPLIES TO","OPTIONAL","STATUS","ACTION"].map(h => (
              <div key={h} className="text-[9px] font-semibold text-[#a3a6a5] tracking-widest">{h}</div>
            ))}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="py-14 text-center text-[13px] text-[#a0a09a]">Loading holidays…</div>
          )}

          {/* Rows */}
          {!loading && paginated.map(h => (
            <div key={h.id} className="grid grid-cols-[2fr_1.2fr_1fr_1.4fr_1.4fr_0.7fr_0.8fr_0.6fr] px-5 py-[14px] border-b border-[#f0ede6] last:border-0 hover:bg-[#faf9f5] transition items-center">
              <div className="text-[13px] font-medium text-[#10130f]">{h.name}</div>
              <div className="text-[12px] text-[#555]">{h.date}</div>
              <div className="text-[12px] text-[#555]">{h.day}</div>
              <div>
                <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg ${TYPE_COLORS[h.type] || "bg-gray-100 text-gray-600"}`}>{h.type}</span>
              </div>
              <div className="text-[12px] text-[#555]">{h.appliesTo}</div>
              <div className="text-[12px] text-[#555]">{h.optional}</div>
              <div>
                <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg ${h.status === "Active" ? "bg-[#e8f0e4] text-[#3d6630]" : "bg-[#f0ede6] text-[#7a7060]"}`}>{h.status}</span>
              </div>
              <div className="relative flex justify-end">
                <button onClick={() => setOpenMenu(openMenu === h.id ? null : h.id)}
                  className="w-7 h-7 flex flex-col items-center justify-center gap-[3px] rounded-lg hover:bg-[#f0efe9] transition">
                  {[0,1,2].map(i => <span key={i} className="w-1 h-1 bg-[#9a9890] rounded-full" />)}
                </button>
                {openMenu === h.id && (
                  <ActionMenu
                    holiday={h}
                    onView={setViewTarget}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                    onClose={() => setOpenMenu(null)}
                  />
                )}
              </div>
            </div>
          ))}

          {!loading && !paginated.length && (
            <div className="py-14 text-center text-[13px] text-[#a0a09a]">No holidays found.</div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#e4e1d8] bg-[#faf9f5]">
            <span className="text-[11px] text-[#9a9890]">
              Showing {filtered.length ? (safePage - 1) * PER_PAGE + 1 : 0} to {Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length} holidays
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
                  className="w-8 h-8 border border-[#e0ddd5] rounded-lg text-[12px] text-[#555] bg-white hover:bg-[#f0efe9] disabled:opacity-40 transition">‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-8 h-8 border rounded-lg text-[12px] font-medium transition ${n === safePage ? "bg-[#111410] text-white border-[#111410]" : "bg-white border-[#e0ddd5] text-[#555] hover:bg-[#f0efe9]"}`}>{n}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                  className="w-8 h-8 border border-[#e0ddd5] rounded-lg text-[12px] text-[#555] bg-white hover:bg-[#f0efe9] disabled:opacity-40 transition">›</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Calendar view ── */}
      {view === "calendar" && (
        <div className="bg-white border border-[#e1dfd8] rounded-2xl p-6">
          <h2 className="text-[16px] font-semibold text-[#10130f] mb-4">{yearFilter} Holiday Calendar</h2>
          {loading && <div className="py-14 text-center text-[13px] text-[#a0a09a]">Loading…</div>}
          {!loading && (
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 12 }, (_, mi) => {
                const yr = parseInt(yearFilter, 10);
                const monthName = new Date(yr, mi, 1).toLocaleString("default", { month: "long" });
                const monthHols = holidays.filter(h => {
                  if (!h._isoDate) return false;
                  const d = new Date(h._isoDate + "T00:00:00");
                  return d.getFullYear() === yr && d.getMonth() === mi;
                });
                return (
                  <div key={mi} className="border border-[#e4e1d8] rounded-xl p-4">
                    <div className="text-[11px] font-semibold text-[#10130f] tracking-widest uppercase mb-3">{monthName}</div>
                    {monthHols.length ? monthHols.map(h => (
                      <div key={h.id} className="flex items-center gap-2 mb-2">
                        <span className={`text-[9px] font-medium px-2 py-0.5 rounded-md ${TYPE_COLORS[h.type] || "bg-gray-100 text-gray-600"}`}>
                          {h.date ? h.date.slice(0, 6) : ""}
                        </span>
                        <span className="text-[11px] text-[#3a3a30]">{h.name}</span>
                      </div>
                    )) : (
                      <p className="text-[11px] text-[#c0bdb5]">No holidays</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Modals ── */}
      {showAddEdit && (
        <HolidayFormModal
          initial={editTarget}
          onClose={() => { setShowAddEdit(false); setEditTarget(null); }}
          onSave={editTarget ? handleEdit : handleAdd}
        />
      )}
      {viewTarget && (
        <ViewHolidayModal
          holiday={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          holiday={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

      {/* ── Import result notification ── */}
      {importResult && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-white border border-[#e1dfd8] rounded-2xl shadow-2xl overflow-hidden">
          <div className={`px-4 py-3 flex items-center justify-between ${importResult.imported > 0 ? "bg-[#f2faf0] border-b border-[#d0e8c8]" : "bg-[#fff8f0] border-b border-[#f5e0c2]"}`}>
            <span className="text-[13px] font-semibold text-[#10130f]">
              {importResult.imported > 0 ? "✅ Import Complete" : "⚠️ Import Warning"}
            </span>
            <button onClick={() => setImportResult(null)} className="text-[#9a9890] hover:text-[#10130f] text-[16px] leading-none">✕</button>
          </div>
          <div className="px-4 py-3 text-[12px] text-[#3a3a30]">
            <p><strong>{importResult.imported}</strong> holiday{importResult.imported !== 1 ? "s" : ""} imported successfully.</p>
            {importResult.skipped > 0 && <p className="mt-1 text-[#7a6040]"><strong>{importResult.skipped}</strong> row{importResult.skipped !== 1 ? "s" : ""} skipped.</p>}
            {importResult.errors?.length > 0 && (
              <ul className="mt-2 max-h-28 overflow-y-auto space-y-1">
                {importResult.errors.map((e, i) => (
                  <li key={i} className="text-[11px] text-[#c0392b] border-l-2 border-[#f5c2c2] pl-2">{e}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
