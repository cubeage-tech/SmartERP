import { useState, useRef, useEffect } from "react";
import apiService from "../../../core/services/api.service";
import storageService from "../../../core/services/storage.service";
import CompanyManagementService from "../../../core/services/modules/companyManagement.service";

/* ================================================================
   CONSTANTS (STATIC UI ENUMS / CHOICES)
================================================================ */
const PROJECT_TYPES   = ["Fixed Price", "Time & Material", "Retainer", "Internal", "R&D"];
const PRIORITIES      = ["Critical", "High", "Medium", "Low"];
const STATUSES        = ["Not Started", "Planning", "In Progress", "On Hold", "Completed", "Cancelled"];
const BUDGET_TYPES    = ["Fixed Budget", "Time & Material", "Cost Plus", "Not Applicable"];
const CURRENCIES      = ["INR - Indian Rupee", "USD - US Dollar", "EUR - Euro", "GBP - British Pound"];
const BILLING_TYPES   = ["Fixed Price", "Hourly", "Daily", "Monthly", "Milestone Based"];
const COST_CENTERS    = ["IT Department", "Finance", "Operations", "Sales", "HR"];
const CATEGORIES      = ["Software Development", "Infrastructure", "Consulting", "Research", "Marketing"];
const RISK_LEVELS     = ["Low", "Medium", "High", "Critical"];

/* ================================================================
   HELPERS
================================================================ */
const calcDuration = (start, end) => {
    if (!start || !end) return "";
    const s = new Date(start);
    const e = new Date(end);
    if (e <= s) return "";
    const days = Math.round((e - s) / 86400000);
    if (days < 30) return `${days} day${days !== 1 ? "s" : ""}`;
    const months = Math.round(days / 30);
    return `${months} month${months !== 1 ? "s" : ""}`;
};

/* ================================================================
   FIELD PRIMITIVES
================================================================ */
const Field = ({ label, required, hint, children, className = "" }) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="font-mono text-[11px] text-[#8d9696]">
            {label}{required && <span className="ml-0.5 text-[#d9534f]">*</span>}
        </label>
        {children}
        {hint && <p className="font-mono text-[10px] text-[#b0b8b8]">{hint}</p>}
    </div>
);

const Input = ({ className = "", ...props }) => (
    <input
        className={`w-full rounded-[10px] border border-[#e3e0d9] bg-white px-3 py-2.5 font-mono text-[12px] text-[#11130f] placeholder-[#c0c8c8] outline-none focus:border-[#11130f] transition ${className}`}
        {...props}
    />
);

const Sel = ({ children, className = "", ...props }) => (
    <div className="relative">
        <select
            className={`w-full appearance-none rounded-[10px] border border-[#e3e0d9] bg-white px-3 py-2.5 pr-8 font-mono text-[12px] text-[#11130f] outline-none focus:border-[#11130f] transition ${className}`}
            {...props}
        >
            {children}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#91a0a0]" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
);

const DateInput = ({ value, onChange, placeholder }) => (
    <div className="relative">
        <input
            type="date"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full rounded-[10px] border border-[#e3e0d9] bg-white px-3 py-2.5 pr-9 font-mono text-[12px] text-[#11130f] outline-none focus:border-[#11130f] transition"
        />
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#91a0a0]" width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
    </div>
);

const Toggle = ({ checked, onChange }) => (
    <div
        onClick={() => onChange(!checked)}
        className={`flex h-5 w-9 cursor-pointer items-center rounded-full transition-all ${checked ? "bg-[#11130f]" : "bg-[#d5d2ca]"}`}
    >
        <div className={`h-4 w-4 rounded-full bg-white shadow transition-all mx-0.5 ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </div>
);

const SectionCard = ({ number, title, children }) => (
    <div className="rounded-[14px] border border-[#e3e0d9] bg-white overflow-hidden mb-4">
        <div className="border-b border-[#f0efeb] px-6 py-4">
            <h3 className="font-mono text-[11px] font-semibold tracking-[0.1em] text-[#11130f]">
                <span className="mr-2 text-[#91a0a0]">{number}.</span>{title}
            </h3>
        </div>
        <div className="px-6 py-5">
            {children}
        </div>
    </div>
);

/* ================================================================
   TEAM MEMBER PICKER
=============================================================== */
const MemberPicker = ({ members, onChange, allMembers = [] }) => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const ref = useRef();

    const filtered = allMembers.filter(
        (m) => !members.includes(m) && m.toLowerCase().includes(search.toLowerCase())
    );

    const initials = (name) => name.split(" ").map((n) => n[0]).join("").toUpperCase();
    const colors = ["#b5cfa8", "#a8bfd4", "#d4c1a8", "#c8a8d4", "#a8d4c1", "#d4a8b5"];
    const colorFor = (name) => colors[name.charCodeAt(0) % colors.length];

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <div
                onClick={() => setOpen(true)}
                className="min-h-[42px] w-full cursor-text rounded-[10px] border border-[#e3e0d9] bg-white px-3 py-2 focus-within:border-[#11130f] transition"
            >
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    placeholder={members.length === 0 ? (allMembers.length === 0 ? "No team members available" : "Search and select team members") : ""}
                    className="w-full bg-transparent font-mono text-[12px] text-[#11130f] placeholder-[#c0c8c8] outline-none"
                />
            </div>

            {open && filtered.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-[10px] border border-[#e3e0d9] bg-white shadow-lg">
                    {filtered.map((m) => (
                        <button
                            key={m}
                            onClick={() => { onChange([...members, m]); setSearch(""); }}
                            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left font-mono text-[12px] text-[#11130f] transition hover:bg-[#f6f5f1]"
                        >
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white"
                                style={{ background: colorFor(m) }}>
                                {initials(m)}
                            </div>
                            {m}
                        </button>
                    ))}
                </div>
            )}

            {/* Selected chips */}
            {members.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {members.map((m) => (
                        <div key={m} className="flex items-center gap-1.5 rounded-full border border-[#e3e0d9] bg-[#f6f5f1] px-2.5 py-1">
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold text-white"
                                style={{ background: colorFor(m) }}>
                                {initials(m)}
                            </div>
                            <span className="font-mono text-[11px] text-[#11130f]">{m}</span>
                            <button
                                onClick={() => onChange(members.filter((x) => x !== m))}
                                className="ml-0.5 text-[#91a0a0] hover:text-[#d9534f] transition text-sm leading-none"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ================================================================
   MAIN MODAL
================================================================ */
const emptyForm = () => ({
    // 1. Project Information
    projectName: "",
    projectCode: `PRJ-${Date.now()}`,
    projectType: "",
    client: "",
    company: "",
    branch: "",
    department: "",
    description: "",

    // 2. Timeline
    startDate: "",
    expectedEnd: "",
    actualEnd: "",
    priority: "Medium",
    status: "",

    // 3. Management
    projectManager: "",
    projectOwner: "",
    projectSponsor: "",
    teamMembers: [],

    // 4. Budget
    budgetType: "",
    totalBudget: "",
    currency: "INR - Indian Rupee",
    estimatedCost: "",
    billingType: "",
    contractValue: "",
    costCenter: "",

    // 5. Configuration
    category: "",
    riskLevel: "",
    tags: [],
    initialProgress: 0,
    allowTaskCreation: true,
    allowExpenseTracking: false,
    allowEmployeeTimeTracking: true,
    enableNotifications: false,

    // 6. Documents & Notes
    documents: [],
    internalNotes: "",
});

const NewProjectModal = ({ open, onClose, onCreate, onUpdate, initialData }) => {
    const [form, setForm]   = useState(emptyForm());
    const [tagInput, setTagInput] = useState("");
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [clients, setClients] = useState([]);
    const [dragging, setDragging] = useState(false);
    const fileRef = useRef();
    const bodyRef = useRef();

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const duration = calcDuration(form.startDate, form.expectedEnd);

    const isEdit = Boolean(initialData?.id);

    /* Fetch real users, companies, branches, departments on open */
    useEffect(() => {
        if (open) {
            if (initialData) {
                setForm({
                    ...emptyForm(),
                    projectName: initialData.name || "",
                    projectCode: initialData.projectCode || `PRJ-${Date.now()}`,
                    projectType: initialData.projectType || "Fixed Price",
                    client: initialData.customerName || "",
                    company: initialData.companyName || "",
                    branch: initialData.branchName || "",
                    department: initialData.departmentName || "",
                    description: initialData.description || "",
                    startDate: initialData.startDate || "",
                    expectedEnd: initialData.endDate || "",
                    actualEnd: initialData.actualEndDate || "",
                    priority: initialData.priority
                        ? initialData.priority.charAt(0).toUpperCase() + initialData.priority.slice(1).toLowerCase()
                        : "Medium",
                    status: initialData.status
                        ? initialData.status.charAt(0).toUpperCase() + initialData.status.slice(1).toLowerCase().replaceAll("_", " ")
                        : "Planning",
                    projectManager: initialData.managerName || "",
                    projectOwner: initialData.ownerName || "",
                    projectSponsor: initialData.sponsorName || "",
                    teamMembers: Array.isArray(initialData.teamMembers) ? initialData.teamMembers : [],
                    budgetType: initialData.budgetType || "Fixed Budget",
                    totalBudget: initialData.plannedBudget != null ? String(initialData.plannedBudget) : "",
                    currency: initialData.currency || "INR - Indian Rupee",
                    estimatedCost: initialData.estimatedCost != null ? String(initialData.estimatedCost) : "",
                    billingType: initialData.billingType || "Fixed Price",
                    contractValue: initialData.contractValue != null ? String(initialData.contractValue) : "",
                    costCenter: initialData.costCenterName || "",
                    category: initialData.category || "",
                    riskLevel: initialData.riskLevel || "Low",
                    tags: Array.isArray(initialData.tags) ? initialData.tags : [],
                    initialProgress: initialData.progressPercent ?? 0,
                    allowTaskCreation: true,
                    allowExpenseTracking: false,
                    allowEmployeeTimeTracking: true,
                    enableNotifications: false,
                    documents: [],
                    internalNotes: initialData.internalNotes || "",
                });
            } else {
                setForm(emptyForm());
            }
            setTagInput("");

            const currentUser = storageService.getUser();
            const tenantId = currentUser?.tenantId;

            if (tenantId) {
                apiService.get(`/admin/users?tenantId=${tenantId}`)
                    .then((res) => {
                        const userList = Array.isArray(res.data) ? res.data : [];
                        const userNames = userList.map((u) => u.name || u.email || u.username).filter(Boolean);
                        setUsers(userNames);
                    })
                    .catch(() => setUsers([]));
            }

            CompanyManagementService.getAll()
                .then((res) => {
                    const compList = Array.isArray(res.data) ? res.data : [];
                    setCompanies(compList);
                    const firstComp = compList[0];
                    if (firstComp?.id) {
                        CompanyManagementService.getBranches(firstComp.id)
                            .then((bRes) => {
                                const bList = Array.isArray(bRes.data) ? bRes.data : [];
                                setBranches(bList.map((b) => b.branchName || b.name).filter(Boolean));
                            })
                            .catch(() => setBranches([]));

                        CompanyManagementService.getDepartments(firstComp.id)
                            .then((dRes) => {
                                const dList = Array.isArray(dRes.data) ? dRes.data : [];
                                setDepartments(dList.map((d) => d.departmentName || d.name).filter(Boolean));
                            })
                            .catch(() => setDepartments([]));
                    }
                })
                .catch(() => setCompanies([]));
        }
    }, [open, initialData]);

    /* escape key */
    useEffect(() => {
        const h = (e) => { if (e.key === "Escape") onClose(); };
        if (open) document.addEventListener("keydown", h);
        return () => document.removeEventListener("keydown", h);
    }, [open, onClose]);

    if (!open) return null;

    /* file helpers */
    const handleFiles = (files) => {
        const valid = Array.from(files).filter(
            (f) => f.size <= 10 * 1024 * 1024 && /\.(pdf|docx|xlsx|jpg|jpeg|png)$/i.test(f.name)
        );
        set("documents", [...form.documents, ...valid.map((f) => ({ name: f.name, size: (f.size / 1024).toFixed(0) + " KB" }))]);
    };

    /* tag helpers */
    const addTag = (val) => {
        const v = val.trim();
        if (v && !form.tags.includes(v)) set("tags", [...form.tags, v]);
        setTagInput("");
    };

    const handleSave = () => {
        if (isEdit && onUpdate) {
            onUpdate(initialData.id, form);
        } else if (onCreate) {
            onCreate(form);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="relative flex h-[92vh] w-full max-w-[860px] flex-col rounded-[20px] bg-[#f6f5f1] shadow-2xl overflow-hidden">

                {/* ---- TOP BAR ---- */}
                <div className="flex items-start justify-between border-b border-[#e3e0d9] bg-white px-7 py-5 shrink-0">
                    <div>
                        <button
                            onClick={onClose}
                            className="mb-2 flex items-center gap-1 font-mono text-[11px] text-[#91a0a0] transition hover:text-[#11130f]"
                        >
                            ← Back to Projects
                        </button>
                        <h2 className="font-serif text-[24px] leading-none text-[#11130f]">
                            {isEdit ? "Edit Project" : "Create New Project"}
                        </h2>
                        <p className="mt-1 font-mono text-[11px] text-[#91a0a0]">
                            {isEdit ? `Update details for ${initialData.name || "the project"}` : "Fill in the details to create a new project"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 rounded-[12px] border border-[#e3e0d9] bg-white px-5 py-2.5 font-mono text-[12px] text-[#303531] transition hover:bg-[#f0efeb]"
                        >
                            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                                <path d="M2 4h10M4 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M6 7v4M8 7v4M3 4l1 8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l1-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="rounded-[12px] bg-[#11130f] px-5 py-2.5 font-mono text-[12px] text-white transition hover:bg-[#292c27]"
                        >
                            {isEdit ? "Save Changes" : "Create Project"}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-[#91a0a0] transition hover:bg-[#f0efeb] hover:text-[#11130f] text-xl"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* ---- SCROLLABLE BODY ---- */}
                <div ref={bodyRef} className="flex-1 overflow-y-auto px-6 py-5">

                    {/* ================================================
                        1. PROJECT INFORMATION
                    ================================================ */}
                    <SectionCard number="1" title="PROJECT INFORMATION">
                        <div className="flex flex-col gap-4">

                            {/* Row 1 */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Field label="Project Name" required>
                                    <Input
                                        placeholder="Enter project name"
                                        value={form.projectName}
                                        onChange={(e) => set("projectName", e.target.value)}
                                    />
                                </Field>
                                <Field label="Project Code" required hint="Auto generated">
                                    <Input value={form.projectCode} readOnly className="bg-[#f6f5f1] text-[#91a0a0]" />
                                </Field>
                                <Field label="Project Type" required>
                                    <Sel value={form.projectType} onChange={(e) => set("projectType", e.target.value)}>
                                        <option value="">Select project type</option>
                                        {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
                                    </Sel>
                                </Field>
                                <Field label="Client / Customer">
                                    <Sel value={form.client} onChange={(e) => set("client", e.target.value)}>
                                        <option value="">Select client</option>
                                        {clients.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </Sel>
                                </Field>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <Field label="Company" required>
                                    <Sel value={form.company} onChange={(e) => {
                                        const compName = e.target.value;
                                        set("company", compName);
                                        const found = companies.find((c) => (c.companyName || c.name) === compName);
                                        if (found?.id) {
                                            CompanyManagementService.getBranches(found.id)
                                                .then((bRes) => {
                                                    const bList = Array.isArray(bRes.data) ? bRes.data : [];
                                                    setBranches(bList.map((b) => b.branchName || b.name).filter(Boolean));
                                                })
                                                .catch(() => setBranches([]));
                                            CompanyManagementService.getDepartments(found.id)
                                                .then((dRes) => {
                                                    const dList = Array.isArray(dRes.data) ? dRes.data : [];
                                                    setDepartments(dList.map((d) => d.departmentName || d.name).filter(Boolean));
                                                })
                                                .catch(() => setDepartments([]));
                                        }
                                    }}>
                                        <option value="">Select company</option>
                                        {companies.map((c) => {
                                            const name = c.companyName || c.name;
                                            return <option key={c.id || name} value={name}>{name}</option>;
                                        })}
                                    </Sel>
                                </Field>
                                <Field label="Branch">
                                    <Sel value={form.branch} onChange={(e) => set("branch", e.target.value)}>
                                        <option value="">Select branch</option>
                                        {branches.map((b) => <option key={b} value={b}>{b}</option>)}
                                    </Sel>
                                </Field>
                                <Field label="Department">
                                    <Sel value={form.department} onChange={(e) => set("department", e.target.value)}>
                                        <option value="">Select department</option>
                                        {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </Sel>
                                </Field>
                            </div>

                            {/* Description */}
                            <Field label="Project Description">
                                <textarea
                                    rows={4}
                                    maxLength={500}
                                    value={form.description}
                                    onChange={(e) => set("description", e.target.value)}
                                    placeholder="Enter project description..."
                                    className="w-full resize-none rounded-[10px] border border-[#e3e0d9] bg-white px-3 py-2.5 font-mono text-[12px] text-[#11130f] placeholder-[#c0c8c8] outline-none focus:border-[#11130f] transition"
                                />
                                <p className="text-right font-mono text-[10px] text-[#b0b8b8]">{form.description.length}/500</p>
                            </Field>
                        </div>
                    </SectionCard>

                    {/* ================================================
                        2. PROJECT TIMELINE
                    ================================================ */}
                    <SectionCard number="2" title="PROJECT TIMELINE">
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Field label="Start Date" required>
                                    <DateInput
                                        value={form.startDate}
                                        onChange={(e) => set("startDate", e.target.value)}
                                        placeholder="Select start date"
                                    />
                                </Field>
                                <Field label="Expected End Date" required>
                                    <DateInput
                                        value={form.expectedEnd}
                                        onChange={(e) => set("expectedEnd", e.target.value)}
                                        placeholder="Select expected end date"
                                    />
                                </Field>
                                <Field label="Actual End Date">
                                    <DateInput
                                        value={form.actualEnd}
                                        onChange={(e) => set("actualEnd", e.target.value)}
                                        placeholder="Select actual end date"
                                    />
                                </Field>
                                <Field label="Project Duration">
                                    <Input
                                        value={duration}
                                        readOnly
                                        placeholder="Auto calculated"
                                        className="bg-[#f6f5f1] text-[#91a0a0]"
                                    />
                                </Field>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field label="Priority" required>
                                    <Sel value={form.priority} onChange={(e) => set("priority", e.target.value)}>
                                        <option value="">Select priority</option>
                                        {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                                    </Sel>
                                </Field>
                                <Field label="Status" required>
                                    <Sel value={form.status} onChange={(e) => set("status", e.target.value)}>
                                        <option value="">Select status</option>
                                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                                    </Sel>
                                </Field>
                            </div>
                        </div>
                    </SectionCard>

                    {/* ================================================
                        3. PROJECT MANAGEMENT
                    ================================================ */}
                    <SectionCard number="3" title="PROJECT MANAGEMENT">
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <Field label="Project Manager" required hint="Person responsible for this project">
                                    <Sel value={form.projectManager} onChange={(e) => set("projectManager", e.target.value)}>
                                        <option value="">Select project manager</option>
                                        {users.map((m) => <option key={m} value={m}>{m}</option>)}
                                    </Sel>
                                </Field>
                                <Field label="Project Owner" hint="Owner of the project">
                                    <Sel value={form.projectOwner} onChange={(e) => set("projectOwner", e.target.value)}>
                                        <option value="">Select project owner</option>
                                        {users.map((m) => <option key={m} value={m}>{m}</option>)}
                                    </Sel>
                                </Field>
                                <Field label="Project Sponsor" hint="Sponsor or key stakeholder">
                                    <Sel value={form.projectSponsor} onChange={(e) => set("projectSponsor", e.target.value)}>
                                        <option value="">Select project sponsor</option>
                                        {users.map((m) => <option key={m} value={m}>{m}</option>)}
                                    </Sel>
                                </Field>
                            </div>
                            <Field label="Team Members" required>
                                <MemberPicker
                                    allMembers={users}
                                    members={form.teamMembers}
                                    onChange={(v) => set("teamMembers", v)}
                                />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* ================================================
                        4. BUDGET & FINANCIAL INFORMATION
                    ================================================ */}
                    <SectionCard number="4" title="BUDGET & FINANCIAL INFORMATION">
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Field label="Budget Type" required>
                                    <Sel value={form.budgetType} onChange={(e) => set("budgetType", e.target.value)}>
                                        <option value="">Select budget type</option>
                                        {BUDGET_TYPES.map((b) => <option key={b}>{b}</option>)}
                                    </Sel>
                                </Field>
                                <Field label="Total Budget" required>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-[#91a0a0]">₹</span>
                                        <Input
                                            type="number"
                                            placeholder="Enter total budget"
                                            value={form.totalBudget}
                                            onChange={(e) => set("totalBudget", e.target.value)}
                                            className="pl-7"
                                        />
                                    </div>
                                </Field>
                                <Field label="Currency" required>
                                    <Sel value={form.currency} onChange={(e) => set("currency", e.target.value)}>
                                        {["INR - Indian Rupee", "USD - US Dollar", "EUR - Euro", "GBP - British Pound"].map((c) => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </Sel>
                                </Field>
                                <Field label="Estimated Cost">
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-[#91a0a0]">₹</span>
                                        <Input
                                            type="number"
                                            placeholder="Enter estimated cost"
                                            value={form.estimatedCost}
                                            onChange={(e) => set("estimatedCost", e.target.value)}
                                            className="pl-7"
                                        />
                                    </div>
                                </Field>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <Field label="Billing Type">
                                    <Sel value={form.billingType} onChange={(e) => set("billingType", e.target.value)}>
                                        <option value="">Select billing type</option>
                                        {BILLING_TYPES.map((b) => <option key={b}>{b}</option>)}
                                    </Sel>
                                </Field>
                                <Field label="Client Contract Value">
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-[#91a0a0]">₹</span>
                                        <Input
                                            type="number"
                                            placeholder="Enter contract value"
                                            value={form.contractValue}
                                            onChange={(e) => set("contractValue", e.target.value)}
                                            className="pl-7"
                                        />
                                    </div>
                                </Field>
                                <Field label="Cost Center" required>
                                    <Sel value={form.costCenter} onChange={(e) => set("costCenter", e.target.value)}>
                                        <option value="">Select cost center</option>
                                        {COST_CENTERS.map((c) => <option key={c}>{c}</option>)}
                                    </Sel>
                                </Field>
                            </div>
                        </div>
                    </SectionCard>

                    {/* ================================================
                        5. PROJECT CONFIGURATION
                    ================================================ */}
                    <SectionCard number="5" title="PROJECT CONFIGURATION">
                        <div className="flex flex-col gap-5">
                            {/* Row 1 */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <Field label="Project Category">
                                    <Sel value={form.category} onChange={(e) => set("category", e.target.value)}>
                                        <option value="">Select category</option>
                                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                                    </Sel>
                                </Field>
                                <Field label="Risk Level">
                                    <Sel value={form.riskLevel} onChange={(e) => set("riskLevel", e.target.value)}>
                                        <option value="">Select risk level</option>
                                        {RISK_LEVELS.map((r) => <option key={r}>{r}</option>)}
                                    </Sel>
                                </Field>
                                <Field label="Tags">
                                    <div className="rounded-[10px] border border-[#e3e0d9] bg-white px-3 py-2 focus-within:border-[#11130f] transition min-h-[42px]">
                                        <div className="flex flex-wrap gap-1.5">
                                            {form.tags.map((tag) => (
                                                <span key={tag} className="flex items-center gap-1 rounded-full bg-[#f0efeb] px-2.5 py-0.5 font-mono text-[10px] text-[#11130f]">
                                                    {tag}
                                                    <button onClick={() => set("tags", form.tags.filter((t) => t !== tag))}
                                                        className="text-[#91a0a0] hover:text-[#d9534f] transition">×</button>
                                                </span>
                                            ))}
                                            <input
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); }
                                                    if (e.key === "Backspace" && !tagInput && form.tags.length > 0) {
                                                        set("tags", form.tags.slice(0, -1));
                                                    }
                                                }}
                                                placeholder={form.tags.length === 0 ? "Select or add tags" : ""}
                                                className="flex-1 min-w-[80px] bg-transparent font-mono text-[12px] text-[#11130f] placeholder-[#c0c8c8] outline-none"
                                            />
                                        </div>
                                    </div>
                                </Field>
                            </div>

                            {/* Progress slider */}
                            <Field label={`Initial Progress — ${form.initialProgress}%`}>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-[10px] text-[#91a0a0]">0</span>
                                    <input
                                        type="range" min={0} max={100} step={1}
                                        value={form.initialProgress}
                                        onChange={(e) => set("initialProgress", Number(e.target.value))}
                                        className="flex-1 accent-[#11130f] h-1.5 rounded-full cursor-pointer"
                                    />
                                    <span className="font-mono text-[10px] text-[#91a0a0]">100</span>
                                </div>
                            </Field>

                            {/* Toggles */}
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 md:grid-cols-4">
                                {[
                                    { key: "allowTaskCreation",         label: "Allow Task Creation" },
                                    { key: "allowEmployeeTimeTracking", label: "Allow Employee Time Tracking" },
                                    { key: "allowExpenseTracking",      label: "Allow Expense Tracking" },
                                    { key: "enableNotifications",       label: "Enable Notifications" },
                                ].map(({ key, label }) => (
                                    <div key={key} className="flex items-center gap-2.5">
                                        <Toggle checked={form[key]} onChange={(v) => set(key, v)} />
                                        <span className="font-mono text-[11px] text-[#53605e]">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SectionCard>

                    {/* ================================================
                        6. DOCUMENTS & NOTES
                    ================================================ */}
                    <SectionCard number="6" title="DOCUMENTS & NOTES">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/* Upload zone */}
                            <Field label="Project Documents">
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                                    onClick={() => fileRef.current?.click()}
                                    className={`flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-[12px] border-2 border-dashed transition ${dragging ? "border-[#11130f] bg-[#f0efeb]" : "border-[#d5d2ca] bg-[#fafaf8] hover:bg-[#f6f5f1]"}`}
                                >
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-2 text-[#91a0a0]">
                                        <path d="M16 22V14m0 0l-4 4m4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M26 21.5A5 5 0 0 0 24 12h-1.6A9 9 0 1 0 6 19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <p className="font-mono text-[12px] text-[#8d9696]">Drag & drop files here or</p>
                                    <p className="mt-1 font-mono text-[12px] font-semibold text-[#11130f] underline underline-offset-2">Browse Files</p>
                                    <p className="mt-1 font-mono text-[10px] text-[#b0b8b8]">PDF, DOCX, XLSX, JPG, PNG up to 10 MB</p>
                                    <input ref={fileRef} type="file" multiple accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png" className="hidden"
                                        onChange={(e) => handleFiles(e.target.files)} />
                                </div>

                                {form.documents.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {form.documents.map((f, i) => (
                                            <li key={i} className="flex items-center justify-between rounded-[8px] bg-[#f6f5f1] px-3 py-2">
                                                <span className="font-mono text-[11px] text-[#53605e] truncate">{f.name}</span>
                                                <div className="flex items-center gap-2 ml-2 shrink-0">
                                                    <span className="font-mono text-[10px] text-[#91a0a0]">{f.size}</span>
                                                    <button onClick={() => set("documents", form.documents.filter((_, j) => j !== i))}
                                                        className="text-[#d9534f] hover:text-[#a02020] transition">×</button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </Field>

                            {/* Internal notes */}
                            <Field label="Internal Notes">
                                <textarea
                                    rows={5}
                                    maxLength={500}
                                    value={form.internalNotes}
                                    onChange={(e) => set("internalNotes", e.target.value)}
                                    placeholder="Add internal notes or any special instructions..."
                                    className="w-full resize-none rounded-[12px] border border-[#e3e0d9] bg-white px-3 py-2.5 font-mono text-[12px] text-[#11130f] placeholder-[#c0c8c8] outline-none focus:border-[#11130f] transition"
                                />
                                <p className="text-right font-mono text-[10px] text-[#b0b8b8]">{form.internalNotes.length}/500</p>
                            </Field>
                        </div>
                    </SectionCard>

                </div>

                {/* ---- FOOTER ---- */}
                <div className="flex items-center justify-end gap-3 border-t border-[#e3e0d9] bg-white px-7 py-4 shrink-0">
                    <button
                        onClick={onClose}
                        className="rounded-[12px] border border-[#e3e0d9] bg-white px-6 py-2.5 font-mono text-[12px] text-[#303531] transition hover:bg-[#f0efeb]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 rounded-[12px] border border-[#e3e0d9] bg-white px-6 py-2.5 font-mono text-[12px] text-[#303531] transition hover:bg-[#f0efeb]"
                    >
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                            <path d="M2 4h10M4 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M6 7v4M8 7v4M3 4l1 8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l1-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Save as Draft
                    </button>
                    <button
                        onClick={() => onCreate(form)}
                        className="rounded-[12px] bg-[#11130f] px-6 py-2.5 font-mono text-[12px] text-white transition hover:bg-[#292c27]"
                    >
                        Create Project
                    </button>
                </div>

            </div>
        </div>
    );
};

export default NewProjectModal;
