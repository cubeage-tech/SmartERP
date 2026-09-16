import { useState, useRef, useEffect } from "react";

/* ================================================================
   CONSTANTS
================================================================ */
const STEPS = [
    { id: 1, label: "Personal Information" },
    { id: 2, label: "Job Information" },
    { id: 3, label: "Salary & Payroll" },
    { id: 4, label: "Documents" },
    { id: 5, label: "Review & Confirm" },
];

const GENDERS         = ["Male", "Female", "Other", "Prefer not to say"];
const MARITAL         = ["Single", "Married", "Divorced", "Widowed"];
const BLOOD_GROUPS    = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const NATIONALITIES   = ["Indian", "American", "British", "Canadian", "Australian", "Other"];
const RELIGIONS       = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other"];
const LANGUAGES       = ["Hindi", "English", "Marathi", "Tamil", "Telugu", "Kannada", "Bengali", "Gujarati"];
const RELATIONSHIPS   = ["Father", "Mother", "Spouse", "Sibling", "Friend", "Other"];

const COMPANIES       = ["ABC Manufacturing Pvt Ltd", "XYZ Corp", "SmartERP Solutions"];
const BRANCHES        = ["Pune Branch", "Mumbai Branch", "Delhi Branch", "Bangalore Branch"];
const DEPARTMENTS     = ["Production", "HR", "Finance", "IT", "Sales", "Operations", "Admin"];
const DESIGNATIONS    = ["Production Manager", "HR Manager", "Senior Engineer", "Analyst", "Executive", "Director"];
const EMP_TYPES       = ["Full Time", "Part Time", "Contract", "Intern"];
const EMP_STATUSES    = ["Active", "Probation", "Notice Period", "Inactive"];
const PROBATIONS      = ["1 Month", "3 Months", "6 Months", "No Probation"];
const WORK_SHIFTS     = ["General Shift (9 AM - 6 PM)", "Morning Shift (6 AM - 3 PM)", "Night Shift (10 PM - 7 AM)"];
const WORK_DAYS       = ["Mon, Tue, Wed, Thu, Fri, Sat", "Mon, Tue, Wed, Thu, Fri"];
const WORK_MODES      = ["In Office", "Remote", "Hybrid"];
const WORK_LOCATIONS  = ["Pune – Office", "Mumbai – Office", "Delhi – Office", "Remote"];

const SALARY_TYPES    = ["Monthly", "Weekly", "Daily"];
const CURRENCIES      = ["INR - Indian Rupee", "USD - US Dollar", "EUR - Euro"];
const TAX_REGIMES     = ["Old Regime", "New Regime"];

const DOC_TYPES       = [
    "PAN Card", "Aadhaar Card", "Passport", "Driving License",
    "Voter ID", "Degree Certificate", "Experience Letter", "Offer Letter",
];

/* ================================================================
   HELPERS
================================================================ */
const fmt = (n) =>
    Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const emptyDoc = () => ({
    id: Date.now() + Math.random(),
    type: "",
    number: "",
    issueDate: "",
    expiryDate: "",
    file: null,
    tab: "identity",
});

const emptySalaryComponent = () => ({
    id: Date.now() + Math.random(),
    name: "",
    type: "Earnings",
    amount: "",
    calculation: "Fixed",
});

/* ================================================================
   STEP INDICATOR
================================================================ */
const StepIndicator = ({ current }) => (
    <div className="flex items-center gap-0 overflow-x-auto px-7 py-5 border-b border-[#e3e0d9] bg-white">
        {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
                <div className="flex items-center gap-2 shrink-0">
                    <div className={`
                        flex h-7 w-7 items-center justify-center rounded-full
                        font-mono text-[11px] font-semibold shrink-0 transition-all
                        ${current > s.id
                            ? "bg-[#11130f] text-white"
                            : current === s.id
                                ? "bg-[#11130f] text-white"
                                : "border border-[#d5d2ca] bg-white text-[#91a0a0]"
                        }
                    `}>
                        {current > s.id ? (
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                <path d="M2.5 7l3.5 3.5 5.5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        ) : s.id}
                    </div>
                    <span className={`
                        font-mono text-[11px] whitespace-nowrap
                        ${current === s.id ? "text-[#11130f] font-semibold" : "text-[#91a0a0]"}
                    `}>
                        {s.label}
                    </span>
                </div>
                {i < STEPS.length - 1 && (
                    <div className={`mx-3 h-px w-8 shrink-0 ${current > s.id ? "bg-[#11130f]" : "bg-[#e3e0d9]"}`} />
                )}
            </div>
        ))}
    </div>
);

/* ================================================================
   EMPLOYEE PREVIEW SIDEBAR
================================================================ */
const EmployeePreview = ({ data }) => {
    const name = [data.personal.firstName, data.personal.lastName].filter(Boolean).join(" ");
    return (
        <div className="w-[220px] shrink-0 flex flex-col gap-4">
            {/* Avatar + name */}
            <div className="rounded-[16px] border border-[#e3e0d9] bg-white p-5 flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-[#e8e4dc] flex items-center justify-center overflow-hidden">
                    {data.personal.photoUrl ? (
                        <img src={data.personal.photoUrl} alt="employee" className="h-full w-full object-cover" />
                    ) : (
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <circle cx="16" cy="12" r="7" fill="#b5a898"/>
                            <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#b5a898"/>
                        </svg>
                    )}
                </div>
                {name && <p className="font-mono text-[12px] font-semibold text-[#11130f] text-center">{name}</p>}
                {data.job.designation && <p className="font-mono text-[10px] text-[#91a0a0] text-center">{data.job.designation}</p>}
            </div>

            {/* Info rows */}
            <div className="rounded-[16px] border border-[#e3e0d9] bg-white p-5 flex flex-col gap-3">
                {[
                    ["Employee Code", data.personal.employeeCode || "—"],
                    ["Employee Name", name || "—"],
                    ["Department", data.job.department || "—"],
                    ["Designation", data.job.designation || "—"],
                    ["Work Location", data.job.workLocation || "—"],
                ].map(([label, value]) => (
                    <div key={label}>
                        <p className="font-mono text-[10px] text-[#91a0a0]">{label}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-[#11130f]">{value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Tips */}
            <div className="rounded-[16px] border border-[#e3e0d9] bg-white p-5">
                <p className="mb-3 font-mono text-[11px] font-semibold text-[#11130f]">Quick Tips</p>
                <ul className="space-y-1.5">
                    {[
                        "Employee Code will be auto-generated",
                        "Fields marked with * are mandatory",
                        "You can upload photo later from profile",
                        "Review all details before final submission",
                    ].map((tip) => (
                        <li key={tip} className="flex items-start gap-1.5">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#91a0a0]" />
                            <span className="font-mono text-[10px] text-[#53605e]">{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

/* ================================================================
   SMALL FIELD PRIMITIVES
================================================================ */
const Field = ({ label, required, children, className = "" }) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="font-mono text-[11px] text-[#8d9696]">
            {label}{required && <span className="ml-0.5 text-[#d9534f]">*</span>}
        </label>
        {children}
    </div>
);

const Input = ({ className = "", ...props }) => (
    <input
        className={`w-full rounded-[10px] border border-[#e3e0d9] bg-white px-3 py-2 font-mono text-[12px] text-[#11130f] placeholder-[#c0c8c8] outline-none focus:border-[#11130f] transition ${className}`}
        {...props}
    />
);

const Sel = ({ children, className = "", ...props }) => (
    <select
        className={`w-full rounded-[10px] border border-[#e3e0d9] bg-white px-3 py-2 font-mono text-[12px] text-[#11130f] outline-none focus:border-[#11130f] transition appearance-none ${className}`}
        {...props}
    >
        {children}
    </select>
);

const PhoneInput = ({ flag = "🇮🇳", code = "+91", value, onChange, placeholder }) => (
    <div className="flex overflow-hidden rounded-[10px] border border-[#e3e0d9] bg-white focus-within:border-[#11130f] transition">
        <div className="flex items-center gap-1 border-r border-[#e3e0d9] px-2.5 font-mono text-[12px] text-[#11130f] shrink-0">
            {flag} {code}
        </div>
        <input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="flex-1 bg-transparent px-3 py-2 font-mono text-[12px] text-[#11130f] placeholder-[#c0c8c8] outline-none"
        />
    </div>
);

const Section = ({ title, children }) => (
    <div className="mb-5">
        <h3 className="mb-4 font-mono text-[13px] font-semibold text-[#11130f]">{title}</h3>
        {children}
    </div>
);

/* ================================================================
   STEP 1 — PERSONAL INFORMATION
================================================================ */
const Step1 = ({ data, setData }) => {
    const p = data.personal;
    const set = (k, v) => setData((d) => ({ ...d, personal: { ...d.personal, [k]: v } }));
    const photoRef = useRef();

    const handlePhoto = (file) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        set("photoUrl", url);
    };

    return (
        <div className="flex flex-col gap-6">
            <Section title="Personal Information">
                {/* Photo + name row */}
                <div className="flex items-start gap-5 mb-4">
                    {/* Photo upload */}
                    <div
                        onClick={() => photoRef.current?.click()}
                        className="flex w-[120px] shrink-0 cursor-pointer flex-col items-center justify-center rounded-[12px] border-2 border-dashed border-[#d5d2ca] bg-[#f6f5f1] py-5 transition hover:bg-[#f0efeb]"
                    >
                        {p.photoUrl ? (
                            <img src={p.photoUrl} alt="preview" className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#91a0a0]">
                                <path d="M12 12m-4 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0M3 21c0-4 4-7 9-7s9 3 9 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                            </svg>
                        )}
                        <p className="mt-2 font-mono text-[10px] text-[#8d9696]">Upload Photo</p>
                        <p className="font-mono text-[9px] text-[#b0b8b8]">JPG, PNG (Max 2MB)</p>
                        <input ref={photoRef} type="file" accept=".jpg,.jpeg,.png" className="hidden"
                            onChange={(e) => handlePhoto(e.target.files[0])} />
                    </div>

                    {/* Name fields */}
                    <div className="flex-1 grid grid-cols-3 gap-3">
                        <Field label="First Name" required>
                            <Input placeholder="Enter first name" value={p.firstName} onChange={(e) => set("firstName", e.target.value)} />
                        </Field>
                        <Field label="Middle Name">
                            <Input placeholder="Enter middle name" value={p.middleName} onChange={(e) => set("middleName", e.target.value)} />
                        </Field>
                        <Field label="Last Name" required>
                            <Input placeholder="Enter last name" value={p.lastName} onChange={(e) => set("lastName", e.target.value)} />
                        </Field>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Field label="Employee Code" required>
                        <Input value="Auto-generated" readOnly className="bg-[#f0efeb] text-[#91a0a0]" />
                    </Field>
                    <Field label="Date of Birth" required>
                        <div className="relative">
                            <Input type="date" value={p.dob} onChange={(e) => set("dob", e.target.value)} className="pr-9" />
                        </div>
                    </Field>
                    <Field label="Gender" required>
                        <Sel value={p.gender} onChange={(e) => set("gender", e.target.value)}>
                            <option value="">Select gender</option>
                            {GENDERS.map((g) => <option key={g}>{g}</option>)}
                        </Sel>
                    </Field>
                    <Field label="Marital Status">
                        <Sel value={p.maritalStatus} onChange={(e) => set("maritalStatus", e.target.value)}>
                            <option value="">Select status</option>
                            {MARITAL.map((m) => <option key={m}>{m}</option>)}
                        </Sel>
                    </Field>
                </div>

                {/* Row 3 */}
                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Field label="Email ID" required>
                        <Input type="email" placeholder="Enter email id" value={p.email} onChange={(e) => set("email", e.target.value)} />
                    </Field>
                    <Field label="Mobile Number" required>
                        <PhoneInput value={p.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="Enter mobile number" />
                    </Field>
                    <Field label="Alternate Mobile">
                        <PhoneInput value={p.altMobile} onChange={(e) => set("altMobile", e.target.value)} placeholder="Enter alternate number" />
                    </Field>
                    <Field label="Personal Email">
                        <Input type="email" placeholder="Enter personal email" value={p.personalEmail} onChange={(e) => set("personalEmail", e.target.value)} />
                    </Field>
                </div>

                {/* Row 4 */}
                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Field label="Blood Group">
                        <Sel value={p.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)}>
                            <option value="">Select blood group</option>
                            {BLOOD_GROUPS.map((b) => <option key={b}>{b}</option>)}
                        </Sel>
                    </Field>
                    <Field label="Nationality" required>
                        <Sel value={p.nationality} onChange={(e) => set("nationality", e.target.value)}>
                            <option value="">Select nationality</option>
                            {NATIONALITIES.map((n) => <option key={n}>{n}</option>)}
                        </Sel>
                    </Field>
                    <Field label="Religion">
                        <Sel value={p.religion} onChange={(e) => set("religion", e.target.value)}>
                            <option value="">Select religion</option>
                            {RELIGIONS.map((r) => <option key={r}>{r}</option>)}
                        </Sel>
                    </Field>
                    <Field label="Languages Known">
                        <Sel value={p.languages} onChange={(e) => set("languages", e.target.value)}>
                            <option value="">Select languages</option>
                            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                        </Sel>
                    </Field>
                </div>

                {/* Row 5 — addresses */}
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Current Address" required>
                        <textarea
                            rows={3} maxLength={200} value={p.currentAddress}
                            onChange={(e) => set("currentAddress", e.target.value)}
                            placeholder="Enter current address"
                            className="w-full resize-none rounded-[10px] border border-[#e3e0d9] bg-white px-3 py-2 font-mono text-[12px] text-[#11130f] placeholder-[#c0c8c8] outline-none focus:border-[#11130f] transition"
                        />
                        <p className="text-right font-mono text-[10px] text-[#b0b8b8]">{(p.currentAddress || "").length}/200</p>
                    </Field>
                    <Field label="Permanent Address">
                        <div>
                            <textarea
                                rows={3} maxLength={200}
                                value={p.sameAddress ? p.currentAddress : p.permanentAddress}
                                disabled={p.sameAddress}
                                onChange={(e) => set("permanentAddress", e.target.value)}
                                placeholder="Enter permanent address"
                                className="w-full resize-none rounded-[10px] border border-[#e3e0d9] bg-white px-3 py-2 font-mono text-[12px] text-[#11130f] placeholder-[#c0c8c8] outline-none focus:border-[#11130f] transition disabled:bg-[#f6f5f1]"
                            />
                            <div className="mt-1 flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={!!p.sameAddress}
                                        onChange={(e) => set("sameAddress", e.target.checked)}
                                        className="h-3.5 w-3.5 rounded accent-[#11130f]" />
                                    <span className="font-mono text-[10px] text-[#53605e]">Same as current address</span>
                                </label>
                                <p className="font-mono text-[10px] text-[#b0b8b8]">{(p.permanentAddress || "").length}/200</p>
                            </div>
                        </div>
                    </Field>
                </div>
            </Section>

            {/* Emergency Contact */}
            <Section title="Emergency Contact">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Field label="Emergency Contact Name" required>
                        <Input placeholder="Enter contact name" value={p.emergencyName} onChange={(e) => set("emergencyName", e.target.value)} />
                    </Field>
                    <Field label="Relationship" required>
                        <Sel value={p.emergencyRelation} onChange={(e) => set("emergencyRelation", e.target.value)}>
                            <option value="">Select relationship</option>
                            {RELATIONSHIPS.map((r) => <option key={r}>{r}</option>)}
                        </Sel>
                    </Field>
                    <Field label="Contact Number" required>
                        <PhoneInput value={p.emergencyPhone} onChange={(e) => set("emergencyPhone", e.target.value)} placeholder="Enter contact number" />
                    </Field>
                    <Field label="Alternate Number">
                        <PhoneInput value={p.emergencyAlt} onChange={(e) => set("emergencyAlt", e.target.value)} placeholder="Enter alternate number" />
                    </Field>
                </div>
            </Section>
        </div>
    );
};

/* ================================================================
   STEP 2 — JOB INFORMATION
================================================================ */
const Step2 = ({ data, setData }) => {
    const j = data.job;
    const set = (k, v) => setData((d) => ({ ...d, job: { ...d.job, [k]: v } }));

    return (
        <div className="flex flex-col gap-6">
            <Section title="Job Information">
                {/* Org Details */}
                <div>
                    <p className="mb-3 font-mono text-[11px] text-[#91a0a0] tracking-[0.06em]">ORGANISATION DETAILS</p>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <Field label="Company" required>
                            <Sel value={j.company} onChange={(e) => set("company", e.target.value)}>
                                <option value="">Select company</option>
                                {COMPANIES.map((c) => <option key={c}>{c}</option>)}
                            </Sel>
                        </Field>
                        <Field label="Branch / Location" required>
                            <Sel value={j.branch} onChange={(e) => set("branch", e.target.value)}>
                                <option value="">Select branch</option>
                                {BRANCHES.map((b) => <option key={b}>{b}</option>)}
                            </Sel>
                        </Field>
                        <Field label="Department" required>
                            <Sel value={j.department} onChange={(e) => set("department", e.target.value)}>
                                <option value="">Select department</option>
                                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                            </Sel>
                        </Field>
                        <Field label="Designation" required>
                            <Sel value={j.designation} onChange={(e) => set("designation", e.target.value)}>
                                <option value="">Select designation</option>
                                {DESIGNATIONS.map((d) => <option key={d}>{d}</option>)}
                            </Sel>
                        </Field>
                    </div>
                </div>

                {/* Employment Details */}
                <div className="mt-4">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <Field label="Employment Type" required>
                            <Sel value={j.empType} onChange={(e) => set("empType", e.target.value)}>
                                <option value="">Select type</option>
                                {EMP_TYPES.map((t) => <option key={t}>{t}</option>)}
                            </Sel>
                        </Field>
                        <Field label="Employee Status" required>
                            <Sel value={j.empStatus} onChange={(e) => set("empStatus", e.target.value)}>
                                <option value="">Select status</option>
                                {EMP_STATUSES.map((s) => <option key={s}>{s}</option>)}
                            </Sel>
                        </Field>
                        <Field label="Joining Date" required>
                            <Input type="date" value={j.joiningDate} onChange={(e) => set("joiningDate", e.target.value)} />
                        </Field>
                        <Field label="Probation Period">
                            <Sel value={j.probation} onChange={(e) => set("probation", e.target.value)}>
                                <option value="">Select period</option>
                                {PROBATIONS.map((p) => <option key={p}>{p}</option>)}
                            </Sel>
                        </Field>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                        <Field label="Confirmation Date">
                            <Input type="date" value={j.confirmDate} onChange={(e) => set("confirmDate", e.target.value)} />
                        </Field>
                    </div>
                </div>

                {/* Reporting Structure */}
                <div className="mt-4">
                    <p className="mb-3 font-mono text-[11px] text-[#91a0a0] tracking-[0.06em]">REPORTING STRUCTURE</p>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <Field label="Reporting Manager">
                            <Input placeholder="Enter name" value={j.reportingManager} onChange={(e) => set("reportingManager", e.target.value)} />
                        </Field>
                        <Field label="Department Head">
                            <Input placeholder="Enter name" value={j.deptHead} onChange={(e) => set("deptHead", e.target.value)} />
                        </Field>
                        <Field label="HR Manager">
                            <Input placeholder="Enter name" value={j.hrManager} onChange={(e) => set("hrManager", e.target.value)} />
                        </Field>
                        <Field label="Team">
                            <Input placeholder="Enter team name" value={j.team} onChange={(e) => set("team", e.target.value)} />
                        </Field>
                    </div>
                </div>

                {/* Work Details */}
                <div className="mt-4">
                    <p className="mb-3 font-mono text-[11px] text-[#91a0a0] tracking-[0.06em]">WORK DETAILS</p>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                        <Field label="Work Shift">
                            <Sel value={j.workShift} onChange={(e) => set("workShift", e.target.value)}>
                                <option value="">Select shift</option>
                                {WORK_SHIFTS.map((s) => <option key={s}>{s}</option>)}
                            </Sel>
                        </Field>
                        <Field label="Working Days">
                            <Sel value={j.workDays} onChange={(e) => set("workDays", e.target.value)}>
                                <option value="">Select days</option>
                                {WORK_DAYS.map((d) => <option key={d}>{d}</option>)}
                            </Sel>
                        </Field>
                        <Field label="Weekly Hours">
                            <Input placeholder="48 hours" value={j.weeklyHours} onChange={(e) => set("weeklyHours", e.target.value)} />
                        </Field>
                        <Field label="Work Mode">
                            <Sel value={j.workMode} onChange={(e) => set("workMode", e.target.value)}>
                                <option value="">Select mode</option>
                                {WORK_MODES.map((m) => <option key={m}>{m}</option>)}
                            </Sel>
                        </Field>
                        <Field label="Work Location">
                            <Sel value={j.workLocation} onChange={(e) => set("workLocation", e.target.value)}>
                                <option value="">Select location</option>
                                {WORK_LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                            </Sel>
                        </Field>
                    </div>
                </div>

                {/* Employee Access */}
                <div className="mt-4">
                    <p className="mb-3 font-mono text-[11px] text-[#91a0a0] tracking-[0.06em]">EMPLOYEE ACCESS</p>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        <Field label="Employee ID / Badging No.">
                            <Input placeholder="Enter biometric ID" value={j.empId} onChange={(e) => set("empId", e.target.value)} />
                        </Field>
                        <Field label="Biometric ID (Optional)">
                            <Input placeholder="Enter biometric id" value={j.biometricId} onChange={(e) => set("biometricId", e.target.value)} />
                        </Field>
                        <Field label="User Account Required">
                            <div className="flex items-center gap-4 mt-1">
                                {["Yes", "No"].map((opt) => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                        <div
                                            onClick={() => set("userAccount", opt)}
                                            className={`flex h-6 w-11 items-center rounded-full transition-all ${j.userAccount === opt ? "bg-[#11130f]" : "bg-[#e3e0d9]"}`}
                                        >
                                            <div className={`h-5 w-5 rounded-full bg-white shadow transition-all mx-0.5 ${j.userAccount === opt ? "translate-x-5" : "translate-x-0"}`} />
                                        </div>
                                        <span className="font-mono text-[11px] text-[#11130f]">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </Field>
                    </div>
                </div>
            </Section>
        </div>
    );
};

/* ================================================================
   STEP 3 — SALARY & PAYROLL
================================================================ */
const Step3 = ({ data, setData }) => {
    const s = data.salary;
    const set = (k, v) => setData((d) => ({ ...d, salary: { ...d.salary, [k]: v } }));

    const addComponent = () =>
        set("components", [...(s.components || []), emptySalaryComponent()]);

    const updateComponent = (id, field, value) =>
        set("components", s.components.map((c) => c.id === id ? { ...c, [field]: value } : c));

    const removeComponent = (id) =>
        set("components", s.components.filter((c) => c.id !== id));

    const totalEarnings = (s.components || [])
        .filter((c) => c.type === "Earnings")
        .reduce((sum, c) => sum + Number(c.amount || 0), 0);

    const totalDeductions = (s.components || [])
        .filter((c) => c.type === "Deduction")
        .reduce((sum, c) => sum + Number(c.amount || 0), 0);

    return (
        <div className="flex flex-col gap-6">
            <Section title="Salary Details">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                    <Field label="Salary Type" required>
                        <Sel value={s.salaryType} onChange={(e) => set("salaryType", e.target.value)}>
                            <option value="">Select type</option>
                            {SALARY_TYPES.map((t) => <option key={t}>{t}</option>)}
                        </Sel>
                    </Field>
                    <Field label="Annual CTC (₹)" required>
                        <Input type="number" placeholder="0.00" value={s.annualCTC} onChange={(e) => set("annualCTC", e.target.value)} />
                    </Field>
                    <Field label="Monthly Gross Salary (₹)" required>
                        <Input type="number" placeholder="0.00" value={s.monthlyGross} onChange={(e) => set("monthlyGross", e.target.value)} />
                    </Field>
                    <Field label="Currency" required>
                        <Sel value={s.currency} onChange={(e) => set("currency", e.target.value)}>
                            <option value="">Select currency</option>
                            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                        </Sel>
                    </Field>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Field label="Basic Salary (₹)">
                        <Input type="number" placeholder="0.00" value={s.basicSalary} onChange={(e) => set("basicSalary", e.target.value)} />
                    </Field>
                    <Field label="HRA (₹)">
                        <Input type="number" placeholder="0.00" value={s.hra} onChange={(e) => set("hra", e.target.value)} />
                    </Field>
                    <Field label="Other Allowances (₹)">
                        <Input type="number" placeholder="0.00" value={s.otherAllowances} onChange={(e) => set("otherAllowances", e.target.value)} />
                    </Field>
                    <Field label="Variable Pay (₹)">
                        <Input type="number" placeholder="0.00" value={s.variablePay} onChange={(e) => set("variablePay", e.target.value)} />
                    </Field>
                </div>
            </Section>

            {/* Salary Components */}
            <Section title="Salary Components">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse">
                        <thead>
                            <tr className="border-b border-[#e3e0d9]">
                                {["#", "Component Name", "Type", "Amount (₹)", "Calculation", "Action"].map((h) => (
                                    <th key={h} className="pb-2 text-left font-mono text-[10px] tracking-[0.06em] text-[#91a0a0] pr-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(s.components || []).map((comp, idx) => (
                                <tr key={comp.id} className="border-b border-[#f0efeb]">
                                    <td className="py-2 pr-2 font-mono text-[11px] text-[#91a0a0]">{idx + 1}</td>
                                    <td className="py-2 pr-3 min-w-[120px]">
                                        <Input placeholder="e.g. Basic Salary" value={comp.name}
                                            onChange={(e) => updateComponent(comp.id, "name", e.target.value)} />
                                    </td>
                                    <td className="py-2 pr-3 min-w-[110px]">
                                        <Sel value={comp.type} onChange={(e) => updateComponent(comp.id, "type", e.target.value)}>
                                            <option>Earnings</option>
                                            <option>Deduction</option>
                                        </Sel>
                                    </td>
                                    <td className="py-2 pr-3 min-w-[100px]">
                                        <Input type="number" placeholder="0.00" value={comp.amount}
                                            onChange={(e) => updateComponent(comp.id, "amount", e.target.value)} className="text-right" />
                                    </td>
                                    <td className="py-2 pr-3 min-w-[110px]">
                                        <Sel value={comp.calculation} onChange={(e) => updateComponent(comp.id, "calculation", e.target.value)}>
                                            <option>Fixed</option>
                                            <option>% of Basic</option>
                                            <option>% of Gross</option>
                                        </Sel>
                                    </td>
                                    <td className="py-2">
                                        <button onClick={() => removeComponent(comp.id)}
                                            className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#fde8e8] text-[#d9534f] hover:bg-[#f8d0d0] font-bold text-sm">
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={addComponent}
                    className="mt-3 flex items-center gap-1.5 rounded-[10px] border border-[#e3e0d9] bg-white px-4 py-2 font-mono text-[11px] text-[#303531] transition hover:bg-[#f0efeb]">
                    + Add Component
                </button>
                <div className="mt-3 flex items-center justify-end gap-8 border-t border-[#e3e0d9] pt-3">
                    <span className="font-mono text-[12px] text-[#8d9696]">Total Earnings</span>
                    <span className="font-mono text-[12px] font-semibold text-[#11130f]">₹{fmt(totalEarnings)}</span>
                    <span className="font-mono text-[12px] text-[#8d9696]">Total Deductions</span>
                    <span className="font-mono text-[12px] font-semibold text-[#d9534f]">₹{fmt(totalDeductions)}</span>
                </div>
            </Section>

            {/* Statutory */}
            <Section title="Statutory & Payroll Information">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    <Field label="PAN Number" required>
                        <Input placeholder="ABCDE1234F" value={s.pan} onChange={(e) => set("pan", e.target.value)} />
                    </Field>
                    <Field label="Aadhaar Number">
                        <Input placeholder="XXXX XXXX 4682" value={s.aadhaar} onChange={(e) => set("aadhaar", e.target.value)} />
                    </Field>
                    <Field label="UAN Number">
                        <Input placeholder="101234567890" value={s.uan} onChange={(e) => set("uan", e.target.value)} />
                    </Field>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                        { key: "pfApplicable", label: "PF Applicable" },
                        { key: "esicApplicable", label: "ESIC Applicable" },
                        { key: "ptApplicable", label: "Professional Tax Applicable" },
                    ].map(({ key, label }) => (
                        <Field key={key} label={label}>
                            <div className="flex items-center gap-3 mt-1">
                                <div
                                    onClick={() => set(key, !s[key])}
                                    className={`flex h-6 w-11 cursor-pointer items-center rounded-full transition-all ${s[key] ? "bg-[#11130f]" : "bg-[#e3e0d9]"}`}
                                >
                                    <div className={`h-5 w-5 rounded-full bg-white shadow transition-all mx-0.5 ${s[key] ? "translate-x-5" : "translate-x-0"}`} />
                                </div>
                                <span className="font-mono text-[11px] text-[#11130f]">{s[key] ? "Yes" : "No"}</span>
                            </div>
                        </Field>
                    ))}
                    <Field label="Tax Regime">
                        <Sel value={s.taxRegime} onChange={(e) => set("taxRegime", e.target.value)}>
                            <option value="">Select regime</option>
                            {TAX_REGIMES.map((t) => <option key={t}>{t}</option>)}
                        </Sel>
                    </Field>
                </div>

                {/* Bank */}
                <div className="mt-4">
                    <p className="mb-3 font-mono text-[11px] text-[#91a0a0] tracking-[0.06em]">BANK DETAILS</p>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <Field label="Bank Name">
                            <Input placeholder="Enter bank name" value={s.bankName} onChange={(e) => set("bankName", e.target.value)} />
                        </Field>
                        <Field label="Account Number">
                            <Input placeholder="Enter account number" value={s.accountNo} onChange={(e) => set("accountNo", e.target.value)} />
                        </Field>
                        <Field label="IFSC Code">
                            <Input placeholder="Enter IFSC code" value={s.ifsc} onChange={(e) => set("ifsc", e.target.value)} />
                        </Field>
                        <Field label="Account Type">
                            <Sel value={s.accountType} onChange={(e) => set("accountType", e.target.value)}>
                                <option value="">Select type</option>
                                <option>Savings</option>
                                <option>Current</option>
                            </Sel>
                        </Field>
                    </div>
                </div>
            </Section>
        </div>
    );
};

/* ================================================================
   STEP 4 — DOCUMENTS
================================================================ */
const DOC_TABS = [
    { id: "identity",    label: "Identity Documents" },
    { id: "employment",  label: "Employment Documents" },
    { id: "education",   label: "Education Documents" },
    { id: "bank",        label: "Bank Documents" },
    { id: "other",       label: "Other Documents" },
];

const Step4 = ({ data, setData }) => {
    const [activeTab, setActiveTab] = useState("identity");
    const fileRefs = useRef({});

    const docs = data.documents || [];
    const setDocs = (fn) => setData((d) => ({ ...d, documents: typeof fn === "function" ? fn(d.documents || []) : fn }));

    const tabDocs = docs.filter((d) => d.tab === activeTab);

    const addDoc = () => setDocs((prev) => [...prev, { ...emptyDoc(), tab: activeTab }]);

    const updateDoc = (id, field, value) =>
        setDocs((prev) => prev.map((d) => d.id === id ? { ...d, [field]: value } : d));

    const removeDoc = (id) => setDocs((prev) => prev.filter((d) => d.id !== id));

    const handleFile = (id, file) => {
        if (!file) return;
        updateDoc(id, "file", { name: file.name, size: (file.size / 1024).toFixed(0) + " KB" });
    };

    return (
        <div>
            {/* Tab bar */}
            <div className="flex flex-wrap gap-1 mb-4 border-b border-[#e3e0d9] pb-3">
                {DOC_TABS.map((t) => {
                    const count = docs.filter((d) => d.tab === t.id).length;
                    return (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            className={`rounded-[10px] px-4 py-2 font-mono text-[11px] transition ${activeTab === t.id ? "bg-[#11130f] text-white" : "border border-[#e3e0d9] bg-white text-[#8d9696] hover:bg-[#f0efeb]"}`}>
                            {t.label} {count > 0 && <span className="ml-1 rounded-full bg-white/20 px-1.5 text-[10px]">{count}</span>}
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                    <thead>
                        <tr className="border-b border-[#e3e0d9]">
                            {["#", "Document Type", "Document Number", "Issue Date", "Expiry Date", "File", "Action"].map((h) => (
                                <th key={h} className="pb-2 text-left font-mono text-[10px] tracking-[0.06em] text-[#91a0a0] pr-3">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tabDocs.map((doc, idx) => (
                            <tr key={doc.id} className="border-b border-[#f0efeb]">
                                <td className="py-2 pr-2 font-mono text-[11px] text-[#91a0a0]">{idx + 1}</td>
                                <td className="py-2 pr-3 min-w-[140px]">
                                    <Sel value={doc.type} onChange={(e) => updateDoc(doc.id, "type", e.target.value)}>
                                        <option value="">Select type</option>
                                        {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
                                    </Sel>
                                </td>
                                <td className="py-2 pr-3 min-w-[120px]">
                                    <Input placeholder="Enter number" value={doc.number}
                                        onChange={(e) => updateDoc(doc.id, "number", e.target.value)} />
                                </td>
                                <td className="py-2 pr-3 min-w-[120px]">
                                    <Input type="date" value={doc.issueDate}
                                        onChange={(e) => updateDoc(doc.id, "issueDate", e.target.value)} />
                                </td>
                                <td className="py-2 pr-3 min-w-[120px]">
                                    <Input type="date" value={doc.expiryDate}
                                        onChange={(e) => updateDoc(doc.id, "expiryDate", e.target.value)} />
                                </td>
                                <td className="py-2 pr-3 min-w-[130px]">
                                    {doc.file ? (
                                        <div className="flex items-center gap-2">
                                            <span className="truncate font-mono text-[10px] text-[#53605e] max-w-[90px]">{doc.file.name}</span>
                                            <button onClick={() => updateDoc(doc.id, "file", null)}
                                                className="text-[#d9534f] hover:text-[#a02020] text-xs">×</button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                if (!fileRefs.current[doc.id]) {
                                                    const inp = document.createElement("input");
                                                    inp.type = "file";
                                                    inp.accept = ".pdf,.jpg,.jpeg,.png";
                                                    inp.onchange = (e) => handleFile(doc.id, e.target.files[0]);
                                                    inp.click();
                                                }
                                            }}
                                            className="flex items-center gap-1.5 rounded-[8px] border border-[#e3e0d9] bg-white px-3 py-1.5 font-mono text-[10px] text-[#53605e] hover:bg-[#f0efeb] transition">
                                            <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                                                <path d="M7 10V4m0 0L4.5 6.5M7 4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>
                                            Upload
                                        </button>
                                    )}
                                </td>
                                <td className="py-2">
                                    <button onClick={() => removeDoc(doc.id)}
                                        className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#fde8e8] text-[#d9534f] hover:bg-[#f8d0d0] font-bold text-sm">
                                        ×
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {tabDocs.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-8 text-center font-mono text-[12px] text-[#b0b8b8]">
                                    No documents added yet. Click "+ Upload Document" to add.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <button onClick={addDoc}
                className="mt-4 flex items-center gap-1.5 rounded-[10px] border border-[#e3e0d9] bg-white px-4 py-2.5 font-mono text-[11px] text-[#303531] transition hover:bg-[#f0efeb]">
                + Upload Document
            </button>

            <p className="mt-3 font-mono text-[10px] text-[#91a0a0]">
                Supported formats: PDF, JPG, PNG (Max 5MB)
            </p>
        </div>
    );
};

/* ================================================================
   STEP 5 — REVIEW & CONFIRM
================================================================ */
const ReviewRow = ({ label, value }) => (
    <div className="flex flex-col gap-0.5">
        <span className="font-mono text-[10px] text-[#91a0a0]">{label}</span>
        <span className="font-mono text-[12px] text-[#11130f]">{value || "—"}</span>
    </div>
);

const ReviewSection = ({ title, onEdit, children }) => (
    <div className="rounded-[14px] border border-[#e3e0d9] bg-white p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-[12px] font-semibold text-[#11130f]">{title}</h3>
            <button onClick={onEdit}
                className="font-mono text-[11px] text-[#91a0a0] underline-offset-2 hover:underline hover:text-[#11130f] transition">
                Edit
            </button>
        </div>
        {children}
    </div>
);

const Step5 = ({ data, onEditStep }) => {
    const p = data.personal;
    const j = data.job;
    const s = data.salary;
    const docs = data.documents || [];
    const [confirmed, setConfirmed] = useState(false);

    const name = [p.firstName, p.lastName].filter(Boolean).join(" ");
    const docCounts = DOC_TABS.map((t) => ({ label: t.label, count: docs.filter((d) => d.tab === t.id).length }));

    return (
        <div className="flex flex-col gap-1">
            <div className="mb-4 flex items-start gap-3 rounded-[12px] border border-[#e3e0d9] bg-[#fffdf8] px-4 py-3">
                <span className="text-[#d9a520] mt-0.5">ℹ</span>
                <p className="font-mono text-[11px] text-[#53605e]">
                    Please review all the information carefully before creating the employee profile.
                </p>
            </div>

            {/* Personal */}
            <ReviewSection title="Personal Information" onEdit={() => onEditStep(1)}>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    <ReviewRow label="Employee Name" value={name} />
                    <ReviewRow label="Employee Code" value="Auto-generated" />
                    <ReviewRow label="Date of Birth" value={p.dob} />
                    <ReviewRow label="Gender" value={p.gender} />
                    <ReviewRow label="Mobile" value={p.mobile ? `+91 ${p.mobile}` : ""} />
                    <ReviewRow label="Personal Email" value={p.personalEmail || p.email} />
                    <ReviewRow label="Nationality" value={p.nationality} />
                    <ReviewRow label="Current Address" value={p.currentAddress} />
                </div>
            </ReviewSection>

            {/* Job */}
            <ReviewSection title="Job Information" onEdit={() => onEditStep(2)}>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    <ReviewRow label="Company" value={j.company} />
                    <ReviewRow label="Branch" value={j.branch} />
                    <ReviewRow label="Department" value={j.department} />
                    <ReviewRow label="Designation" value={j.designation} />
                    <ReviewRow label="Employment Type" value={j.empType} />
                    <ReviewRow label="Work Location" value={j.workLocation} />
                    <ReviewRow label="Work Shift" value={j.workShift} />
                    <ReviewRow label="Joining Date" value={j.joiningDate} />
                    <ReviewRow label="Reporting Manager" value={j.reportingManager} />
                </div>
            </ReviewSection>

            {/* Salary */}
            <ReviewSection title="Salary & Payroll" onEdit={() => onEditStep(3)}>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    <ReviewRow label="Annual CTC" value={s.annualCTC ? `₹${fmt(s.annualCTC)}` : ""} />
                    <ReviewRow label="Monthly Gross" value={s.monthlyGross ? `₹${fmt(s.monthlyGross)}` : ""} />
                    <ReviewRow label="Basic Salary" value={s.basicSalary ? `₹${fmt(s.basicSalary)}` : ""} />
                    <ReviewRow label="Total Deductions" value={s.components ? `₹${fmt(s.components.filter(c => c.type === "Deduction").reduce((a, c) => a + Number(c.amount || 0), 0))}` : ""} />
                    <ReviewRow label="Bank" value={s.bankName} />
                    <ReviewRow label="PF Applicable" value={s.pfApplicable ? "Yes" : "No"} />
                    <ReviewRow label="Tax Regime" value={s.taxRegime} />
                </div>
            </ReviewSection>

            {/* Documents */}
            <ReviewSection title="Documents Summary" onEdit={() => onEditStep(4)}>
                <div className="flex flex-wrap gap-3">
                    {docCounts.map(({ label, count }) => (
                        <div key={label} className="flex items-center gap-2 rounded-[10px] border border-[#e3e0d9] bg-[#f6f5f1] px-3 py-2">
                            <span className="font-mono text-[11px] text-[#53605e]">{label.replace(" Documents", "")}</span>
                            <span className="font-mono text-[11px] font-semibold text-[#11130f]">{count}</span>
                        </div>
                    ))}
                    <div className="flex items-center gap-2 rounded-[10px] border border-[#e3e0d9] bg-[#f6f5f1] px-3 py-2">
                        <span className="font-mono text-[11px] text-[#53605e]">Total</span>
                        <span className="font-mono text-[11px] font-semibold text-[#11130f]">{docs.length}</span>
                    </div>
                </div>
            </ReviewSection>

            {/* Confirm checkbox */}
            <label className="flex cursor-pointer items-start gap-3 rounded-[12px] border border-[#e3e0d9] bg-white p-4">
                <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded accent-[#11130f]" />
                <span className="font-mono text-[12px] text-[#53605e]">
                    I confirm that all the information provided is correct and complete.
                </span>
            </label>
        </div>
    );
};

/* ================================================================
   MAIN MODAL
================================================================ */
const emptyData = () => ({
    personal: {
        firstName: "", middleName: "", lastName: "", photoUrl: "",
        employeeCode: "", dob: "", gender: "", maritalStatus: "",
        email: "", mobile: "", altMobile: "", personalEmail: "",
        bloodGroup: "", nationality: "", religion: "", languages: "",
        currentAddress: "", permanentAddress: "", sameAddress: false,
        emergencyName: "", emergencyRelation: "", emergencyPhone: "", emergencyAlt: "",
    },
    job: {
        company: "", branch: "", department: "", designation: "",
        empType: "", empStatus: "", joiningDate: "", probation: "",
        confirmDate: "", reportingManager: "", deptHead: "", hrManager: "", team: "",
        workShift: "", workDays: "", weeklyHours: "", workMode: "", workLocation: "",
        empId: "", biometricId: "", userAccount: "Yes",
    },
    salary: {
        salaryType: "Monthly", annualCTC: "", monthlyGross: "", currency: "INR - Indian Rupee",
        basicSalary: "", hra: "", otherAllowances: "", variablePay: "",
        components: [
            { id: 1, name: "Basic Salary",        type: "Earnings",   amount: "", calculation: "Fixed" },
            { id: 2, name: "HRA",                 type: "Earnings",   amount: "", calculation: "40% of Basic" },
            { id: 3, name: "Conveyance Allowance",type: "Earnings",   amount: "", calculation: "Fixed" },
            { id: 4, name: "PF (Employee)",       type: "Deduction",  amount: "", calculation: "12% of Basic" },
        ],
        pan: "", aadhaar: "", uan: "",
        pfApplicable: true, esicApplicable: false, ptApplicable: true,
        taxRegime: "Old Regime",
        bankName: "", accountNo: "", ifsc: "", accountType: "",
    },
    documents: [],
});

const AddEmployeeModal = ({ open, onClose, onSuccess }) => {
    const [step, setStep]   = useState(1);
    const [data, setData]   = useState(emptyData());
    const [error, setError] = useState("");
    const bodyRef           = useRef();

    /* reset on open */
    useEffect(() => {
        if (open) { setStep(1); setData(emptyData()); setError(""); }
    }, [open]);

    /* escape key */
    useEffect(() => {
        const h = (e) => { if (e.key === "Escape") onClose(); };
        if (open) document.addEventListener("keydown", h);
        return () => document.removeEventListener("keydown", h);
    }, [open, onClose]);

    if (!open) return null;

    /* scroll body to top on step change */
    const goToStep = (s) => {
        setStep(s);
        setError("");
        if (bodyRef.current) bodyRef.current.scrollTop = 0;
    };

    const next = () => { if (step < 5) goToStep(step + 1); };
    const back = () => { if (step > 1) goToStep(step - 1); };

    const stepLabel = () => {
        if (step < 5) return `Next: ${STEPS[step].label} →`;
        return null;
    };

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1 data={data} setData={setData} />;
            case 2: return <Step2 data={data} setData={setData} />;
            case 3: return <Step3 data={data} setData={setData} />;
            case 4: return <Step4 data={data} setData={setData} />;
            case 5: return <Step5 data={data} onEditStep={goToStep} />;
            default: return null;
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="relative flex h-[92vh] w-full max-w-[1060px] flex-col rounded-[20px] bg-[#f6f5f1] shadow-2xl overflow-hidden">

                {/* TOP BAR */}
                <div className="flex items-start justify-between border-b border-[#e3e0d9] bg-white px-7 py-5">
                    <div>
                        <h2 className="font-serif text-[22px] leading-none text-[#11130f]">Add New Employee</h2>
                        <p className="mt-1 font-mono text-[11px] text-[#91a0a0]">Create a new employee profile</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={onClose}
                            className="rounded-[12px] border border-[#e3e0d9] bg-white px-5 py-2.5 font-mono text-[12px] text-[#303531] transition hover:bg-[#f0efeb]">
                            Save as Draft
                        </button>
                        <button onClick={onClose}
                            className="rounded-[12px] border border-[#e3e0d9] bg-white px-5 py-2.5 font-mono text-[12px] text-[#303531] transition hover:bg-[#f0efeb]">
                            Cancel
                        </button>
                        <button
                            onClick={onClose}
                            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-[#91a0a0] transition hover:bg-[#f0efeb] hover:text-[#11130f] text-xl"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* STEP INDICATOR */}
                <StepIndicator current={step} />

                {/* ERROR BANNER */}
                {error && (
                    <div className="mx-6 mt-3 flex items-start gap-3 rounded-[12px] border border-[#f5c6c6] bg-[#fde8e8] px-4 py-3">
                        <span className="text-[#d9534f] mt-0.5">⚠</span>
                        <p className="flex-1 font-mono text-[12px] text-[#a02020]">{error}</p>
                        <button onClick={() => setError("")} className="text-[#d9534f] hover:text-[#a02020] text-lg leading-none">×</button>
                    </div>
                )}

                {/* BODY */}
                <div ref={bodyRef} className="flex flex-1 gap-5 overflow-hidden px-6 py-5">

                    {/* Main content */}
                    <div className="flex-1 overflow-y-auto pr-1">
                        <div className="rounded-[16px] border border-[#e3e0d9] bg-white p-6">
                            {renderStep()}
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <EmployeePreview data={data} />

                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between border-t border-[#e3e0d9] bg-white px-7 py-4">
                    <button
                        onClick={back}
                        disabled={step === 1}
                        className="flex items-center gap-2 rounded-[12px] border border-[#e3e0d9] bg-white px-6 py-2.5 font-mono text-[12px] text-[#303531] transition hover:bg-[#f0efeb] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        ← Back
                    </button>

                    <div className="flex items-center gap-3">
                        {step < 5 ? (
                            <button
                                onClick={next}
                                className="flex items-center gap-2 rounded-[12px] bg-[#11130f] px-6 py-2.5 font-mono text-[12px] text-white transition hover:bg-[#292c27]"
                            >
                                {stepLabel()}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    className="rounded-[12px] border border-[#e3e0d9] bg-white px-6 py-2.5 font-mono text-[12px] text-[#303531] transition hover:bg-[#f0efeb]"
                                >
                                    Save as Draft
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            const payload = {
                                                employeeCode: data.personal?.employeeCode || data.job?.empId || data.job?.employeeId || data.job?.empCode || `EMP-${Date.now().toString().slice(-4)}`,
                                                firstName: data.personal?.firstName || "New",
                                                lastName: data.personal?.lastName || "Employee",
                                                email: data.personal?.email || `employee-${Date.now()}@company.com`,
                                                phone: data.personal?.mobile || data.personal?.phone || "+91 00000 00000",
                                                department: data.job?.department || "General",
                                                designation: data.job?.designation || "Staff",
                                                branch: data.job?.branch || "Main Branch",
                                                joiningDate: data.job?.joiningDate || new Date().toISOString().split("T")[0],
                                                salary: parseFloat(data.salary?.basicSalary) || parseFloat(data.salary?.monthlyGross) || parseFloat(data.salary?.annualCTC) || parseFloat(data.salary?.basic) || parseFloat(data.salary?.gross) || 50000,
                                                status: data.job?.empStatus || data.job?.status || "Active",
                                            };
                                            await hrApi.createEmployee(payload);
                                            if (onSuccess) {
                                                onSuccess();
                                            }
                                            onClose();
                                        } catch (err) {
                                            console.error("Failed to create employee:", err);
                                            setError(err.message || "Failed to create employee in database");
                                        }
                                    }}
                                    className="flex items-center gap-2 rounded-[12px] bg-[#11130f] px-6 py-2.5 font-mono text-[12px] text-white transition hover:bg-[#292c27]"
                                >
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8l4 4 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Create Employee
                                </button>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddEmployeeModal;

