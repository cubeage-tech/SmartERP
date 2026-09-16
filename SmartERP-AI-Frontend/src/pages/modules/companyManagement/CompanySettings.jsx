import { useEffect, useState } from "react";
import CompanyManagementService from "../../../core/services/modules/companyManagement.service";
import useActiveCompany from "../../../core/hooks/useActiveCompany";

// ─── Reusable primitives ──────────────────────────────────────────────────────

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-medium text-[#6a6a60]">{label}</label>
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder, readOnly }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    readOnly={readOnly}
    className="w-full px-3 py-2.5 border border-[#e0ddd5] rounded-[10px] text-[13px] text-[#10130f] bg-[#faf9f5] outline-none focus:border-[#10130f] focus:bg-white transition placeholder-[#b8b5ad]"
  />
);

const Select = ({ value, onChange, options }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2.5 pr-8 border border-[#e0ddd5] rounded-[10px] text-[13px] text-[#10130f] bg-[#faf9f5] outline-none appearance-none cursor-pointer focus:border-[#10130f] transition"
    >
      {options.map(o => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}
    </select>
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9890] text-[10px] pointer-events-none">▾</span>
  </div>
);

const Toggle = ({ checked, onChange, label }) => (
  <div className="flex items-center gap-2">
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-[#3d8a30]" : "bg-[#d0cdc5]"}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
    {label && <span className="text-[12px] text-[#555]">{checked ? "Yes" : "No"}</span>}
  </div>
);

const SectionCard = ({ icon, title, children }) => (
  <div className="bg-white border border-[#e1dfd8] rounded-2xl p-5">
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#ece9e0]">
      <span className="text-[16px]">{icon}</span>
      <h3 className="text-[14px] font-semibold text-[#10130f]">{title}</h3>
    </div>
    <div className="flex flex-col gap-3">{children}</div>
  </div>
);

const NotifRow = ({ label, email, inApp, sms, reminder, onToggle }) => (
  <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_0.4fr] items-center py-2.5 border-b border-[#f0ede6] last:border-0 gap-2">
    <span className="text-[12px] text-[#3a3a30]">{label}</span>
    <div className="flex items-center gap-1.5">
      <Toggle checked={email.on} onChange={v => onToggle("email", v)} />
      <span className={`text-[10px] font-semibold ${email.on ? "text-[#3d8a30]" : "text-[#aaa]"}`}>{email.on ? "ON" : "OFF"}</span>
    </div>
    <div className="flex items-center gap-1.5">
      <Toggle checked={inApp.on} onChange={v => onToggle("inApp", v)} />
      <span className={`text-[10px] font-semibold ${inApp.on ? "text-[#3d8a30]" : "text-[#aaa]"}`}>{inApp.on ? "ON" : "OFF"}</span>
    </div>
    <div className="flex items-center gap-1.5">
      <Toggle checked={sms.on} onChange={v => onToggle("sms", v)} />
      <span className={`text-[10px] font-semibold ${sms.on ? "text-[#3d8a30]" : "text-[#aaa]"}`}>{sms.on ? "ON" : "OFF"}</span>
    </div>
    <Select value={reminder} onChange={() => {}} options={["Instant","1 Day Before","3 Days Before","1 Week Before"]} />
    <button className="w-7 h-7 border border-[#e0ddd5] rounded-lg flex items-center justify-center text-[12px] text-[#777] hover:bg-[#f0efe9]">✏</button>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function CompanySettings({ companyId: providedCompanyId }) {
  const activeCompany = useActiveCompany(providedCompanyId);
  const companyId = providedCompanyId || activeCompany.companyId;
  const [activeSection, setActiveSection] = useState("general");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ── General state ─────────────────────────────────────────────────────────
  const [general, setGeneral] = useState({
    companyName: "Acme Manufacturing Ltd", companyCode: "ACME001",
    orgType: "Manufacturing", orgStatus: "Active",
    defaultBranch: "Pune Branch", defaultDept: "Administration",
    financialYear: "2026 - 2027", currency: "INR - Indian Rupee (₹)",
    currencySymbol: "₹", numberFormat: "1,23,456.78",
    taxCalc: "Exclusive", gstApplicable: true,
    dateFormat: "DD/MM/YYYY", timeFormat: "12 Hours (hh:mm AM/PM)",
    timezone: "(GMT+05:30) Asia/Kolkata", weekStarts: "Monday",
    autoGenId: true, idPrefix: "CMP-", nextId: "CMP-0005", idLength: "4 Digits",
    docUpload: true, auditLogs: true, dataExport: true, maintenanceMode: false, showInactive: false,
  });

  // ── Localization state ────────────────────────────────────────────────────
  const [local, setLocal] = useState({
    country: "India", state: "Maharashtra", city: "Pune",
    timezone: "(GMT+05:30) Asia/Kolkata", currency: "INR - Indian Rupee (₹)", currencyPos: "1,234.56 (Left)",
    dateFormat: "DD/MM/YYYY", timeFormat: "12 Hours (hh:mm AM/PM)", weekStarts: "Monday",
    language: "English", numberFormat: "1,23,456.78", measurement: "Metric (kg, cm, m)",
  });

  // ── Work schedule state ───────────────────────────────────────────────────
  const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const [workDays, setWorkDays] = useState({
    Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true, Saturday: false, Sunday: false,
  });
  const [work, setWork] = useState({
    startTime: "09:00 AM", endTime: "06:00 PM",
    breakDuration: "60", breakStart: "01:00 PM",
    weeklyHours: "48", branchSchedule: true,
  });

  // ── Leave & Holidays state ────────────────────────────────────────────────
  const [leave, setLeave] = useState({
    holidayCalendar: "India - 2026", weekendPolicy: "Saturday & Sunday",
    branchHolidays: true, holidayApproval: true, autoCarry: true, notifyHolidays: true,
    upcomingReminder: "3", reminderUnit: "Days Before",
    annualAllowed: "3", forwardLeaves: true, optionalHolidays: true, maxCarry: "10",
    approvalRequired: true, encashmentAllowed: true,
  });

  // ── Notifications state ───────────────────────────────────────────────────
  const [notifs, setNotifs] = useState([
    { key: "holiday",    label: "Holiday Reminders",        email: true, inApp: true, sms: false, reminder: "3 Days Before" },
    { key: "approval",   label: "Approval Notifications",   email: true, inApp: true, sms: false, reminder: "Instant" },
    { key: "newUser",    label: "New User Notifications",   email: true, inApp: false, sms: false, reminder: "Instant" },
    { key: "leaveNotif", label: "Leave Notifications",      email: true, inApp: true, sms: false, reminder: "1 Day Before" },
    { key: "attendance", label: "Attendance Alerts",        email: true, inApp: true, sms: false, reminder: "Instant" },
    { key: "payroll",    label: "Payroll Notifications",    email: true, inApp: true, sms: false, reminder: "Instant" },
    { key: "system",     label: "System Announcements",     email: true, inApp: true, sms: false, reminder: "Instant" },
  ]);

  const toggleNotif = (key, channel, val) =>
    setNotifs(p => p.map(n => n.key === key ? { ...n, [channel]: val } : n));

  // ── System preferences state ──────────────────────────────────────────────
  const [sys, setSys] = useState({
    pageSize: "10", theme: "Light", dashboardAnalytics: true, auditLogs: true, sessionTimeout: "30",
    docUpload: true, dataExport: true, autoBackup: true, backupFreq: "Daily", backupRetention: "30",
    twoFactor: true, passwordExpiry: "50", minPwdLength: "8", loginAttempts: "5", strongPwd: true,
    approvalNewUsers: true, approvalCompanyChanges: true, defaultApprovalLevels: "2",
    escalateApprovals: true, escalateAfter: "2",
    maintenanceMode: false, maintenanceMsg: "System is under maintenance. Please try again soon.",
    showInactive: false, purgeAfter: "180",
  });

  useEffect(() => {
    if (!companyId) return;
    CompanyManagementService.getSettings(companyId)
      .then(({ data }) => {
        setGeneral((current) => ({ ...current, ...data.general }));
        setLocal((current) => ({ ...current, ...data.localization }));
        const schedule = data.workSchedule || {};
        setWork((current) => ({ ...current, ...schedule, workDays: undefined }));
        if (Array.isArray(schedule.workDays)) {
          setWorkDays(Object.fromEntries(DAYS.map((day) => [day, schedule.workDays.includes(day)])));
        }
        setLeave((current) => ({ ...current, ...data.leaveAndHolidays }));
        if (data.notifications?.length) setNotifs(data.notifications);
        setSys((current) => ({ ...current, ...data.systemPreferences }));
        setMessage("");
      })
      .catch((requestError) => setMessage(requestError.response?.data?.detail || "Unable to load company settings."));
  }, [companyId]);

  const saveSettings = async () => {
    if (!companyId) return;
    setSaving(true);
    try {
      await CompanyManagementService.updateSettings(companyId, {
        general,
        localization: local,
        workSchedule: {
          ...work,
          workDays: Object.entries(workDays).filter(([, enabled]) => enabled).map(([day]) => day),
        },
        leaveAndHolidays: leave,
        notifications: notifs,
        systemPreferences: sys,
      });
      setMessage("Settings saved successfully.");
    } catch (requestError) {
      setMessage(requestError.response?.data?.detail || "Unable to save company settings.");
    } finally {
      setSaving(false);
    }
  };

  // ── Sidebar nav ───────────────────────────────────────────────────────────
  const NAV = [
    { key: "general",  icon: "⚙", label: "General" },
    { key: "local",    icon: "🌐", label: "Localization" },
    { key: "work",     icon: "📅", label: "Work Schedule" },
    { key: "leave",    icon: "🏖", label: "Leave & Holidays" },
    { key: "notifs",   icon: "🔔", label: "Notifications" },
    { key: "sys",      icon: "🖥", label: "System Preferences" },
  ];

  const setG = (k, v) => setGeneral(p => ({ ...p, [k]: v }));
  const setL = (k, v) => setLocal(p => ({ ...p, [k]: v }));
  const setW = (k, v) => setWork(p => ({ ...p, [k]: v }));
  const setLv = (k, v) => setLeave(p => ({ ...p, [k]: v }));
  const setSy = (k, v) => setSys(p => ({ ...p, [k]: v }));

  // ─── Section renderers ────────────────────────────────────────────────────

  const renderGeneral = () => (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-[18px] font-bold text-[#10130f]">General Settings</h2>
        <p className="text-[12px] text-[#99988f] mt-0.5">Configure general settings for your organization.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Organization Details */}
        <SectionCard icon="🏢" title="Organization Details">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company Name"><Input value={general.companyName} onChange={e => setG("companyName", e.target.value)} /></Field>
            <Field label="Company Code"><Input value={general.companyCode} onChange={e => setG("companyCode", e.target.value)} /></Field>
            <Field label="Organization Type">
              <Select value={general.orgType} onChange={e => setG("orgType", e.target.value)} options={["Manufacturing","IT & Technology","Finance","Retail","Logistics","Healthcare"]} />
            </Field>
            <Field label="Organization Status">
              <Select value={general.orgStatus} onChange={e => setG("orgStatus", e.target.value)} options={["Active","Inactive","Suspended"]} />
            </Field>
            <Field label="Default Branch">
              <Select value={general.defaultBranch} onChange={e => setG("defaultBranch", e.target.value)} options={["Mumbai Head Office","Pune Branch","Delhi Office","Bengaluru Branch"]} />
            </Field>
            <Field label="Default Department">
              <Select value={general.defaultDept} onChange={e => setG("defaultDept", e.target.value)} options={["Administration","Finance","HR","Operations","Sales","IT"]} />
            </Field>
          </div>
        </SectionCard>

        {/* Financial Settings */}
        <SectionCard icon="$" title="Financial Settings">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Financial Year">
              <Select value={general.financialYear} onChange={e => setG("financialYear", e.target.value)} options={["2024 - 2025","2025 - 2026","2026 - 2027","2027 - 2028"]} />
            </Field>
            <Field label="Default Currency">
              <Select value={general.currency} onChange={e => setG("currency", e.target.value)} options={["INR - Indian Rupee (₹)","USD - US Dollar ($)","EUR - Euro (€)","GBP - Pound (£)"]} />
            </Field>
            <Field label="Currency Symbol"><Input value={general.currencySymbol} onChange={e => setG("currencySymbol", e.target.value)} /></Field>
            <Field label="Number Format">
              <Select value={general.numberFormat} onChange={e => setG("numberFormat", e.target.value)} options={["1,23,456.78","1,234,567.89","1.234.567,89"]} />
            </Field>
            <Field label="Tax Calculation">
              <Select value={general.taxCalc} onChange={e => setG("taxCalc", e.target.value)} options={["Exclusive","Inclusive"]} />
            </Field>
            <Field label="GST Applicable">
              <div className="flex items-center gap-3 pt-1">
                <Toggle checked={general.gstApplicable} onChange={v => setG("gstApplicable", v)} label />
              </div>
            </Field>
          </div>
        </SectionCard>

        {/* Date & Time */}
        <SectionCard icon="🗓" title="Date & Time Settings">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date Format">
              <Select value={general.dateFormat} onChange={e => setG("dateFormat", e.target.value)} options={["DD/MM/YYYY","MM/DD/YYYY","YYYY-MM-DD"]} />
            </Field>
            <Field label="Time Format">
              <Select value={general.timeFormat} onChange={e => setG("timeFormat", e.target.value)} options={["12 Hours (hh:mm AM/PM)","24 Hours (HH:mm)"]} />
            </Field>
            <Field label="Time Zone">
              <Select value={general.timezone} onChange={e => setG("timezone", e.target.value)} options={["(GMT+05:30) Asia/Kolkata","(GMT+00:00) UTC","(GMT-05:00) New York","(GMT+08:00) Singapore"]} />
            </Field>
            <Field label="Week Starts On">
              <Select value={general.weekStarts} onChange={e => setG("weekStarts", e.target.value)} options={["Monday","Sunday","Saturday"]} />
            </Field>
          </div>
        </SectionCard>

        {/* Organization Identification */}
        <SectionCard icon="🆔" title="Organization Identification">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Auto Generate Company ID">
              <div className="flex items-center gap-3 pt-1"><Toggle checked={general.autoGenId} onChange={v => setG("autoGenId", v)} label /></div>
            </Field>
            <Field label="Company ID Prefix"><Input value={general.idPrefix} onChange={e => setG("idPrefix", e.target.value)} /></Field>
            <Field label="Next Company ID"><Input value={general.nextId} onChange={e => setG("nextId", e.target.value)} /></Field>
            <Field label="Company ID Length">
              <Select value={general.idLength} onChange={e => setG("idLength", e.target.value)} options={["4 Digits","5 Digits","6 Digits"]} />
            </Field>
          </div>
        </SectionCard>
      </div>

      {/* Additional Settings — full width */}
      <SectionCard icon="🔧" title="Additional Settings">
        <div className="grid grid-cols-5 gap-6">
          {[
            { label: "Enable Document Upload", key: "docUpload" },
            { label: "Enable Audit Logs",       key: "auditLogs" },
            { label: "Allow Data Export",        key: "dataExport" },
            { label: "Enable Maintenance Mode",  key: "maintenanceMode" },
            { label: "Show Inactive Records",    key: "showInactive" },
          ].map(({ label, key }) => (
            <div key={key} className="flex flex-col gap-2">
              <span className="text-[11px] font-medium text-[#6a6a60]">{label}</span>
              <Toggle checked={general[key]} onChange={v => setG(key, v)} label />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );

  const renderLocalization = () => (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-[18px] font-bold text-[#10130f]">Localization</h2>
        <p className="text-[12px] text-[#99988f] mt-0.5">Set your organization's regional, language and localization preferences.</p>
      </div>
      <SectionCard icon="🌐" title="Regional Settings">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Country">
            <Select value={local.country} onChange={e => setL("country", e.target.value)} options={["India","United States","United Kingdom","UAE","Singapore"]} />
          </Field>
          <Field label="State / Region">
            <Select value={local.state} onChange={e => setL("state", e.target.value)} options={["Maharashtra","Karnataka","Tamil Nadu","Delhi","Gujarat","Rajasthan"]} />
          </Field>
          <Field label="City">
            <Select value={local.city} onChange={e => setL("city", e.target.value)} options={["Mumbai","Pune","Bengaluru","Chennai","Delhi","Ahmedabad"]} />
          </Field>
          <Field label="Time Zone">
            <Select value={local.timezone} onChange={e => setL("timezone", e.target.value)} options={["(GMT+05:30) Asia/Kolkata","(GMT+00:00) UTC","(GMT-05:00) New York"]} />
          </Field>
          <Field label="Currency">
            <Select value={local.currency} onChange={e => setL("currency", e.target.value)} options={["INR - Indian Rupee (₹)","USD - US Dollar ($)","EUR - Euro (€)"]} />
          </Field>
          <Field label="Currency Position">
            <Select value={local.currencyPos} onChange={e => setL("currencyPos", e.target.value)} options={["1,234.56 (Left)","1,234.56 (Right)"]} />
          </Field>
          <Field label="Date Format">
            <Select value={local.dateFormat} onChange={e => setL("dateFormat", e.target.value)} options={["DD/MM/YYYY","MM/DD/YYYY","YYYY-MM-DD"]} />
          </Field>
          <Field label="Time Format">
            <Select value={local.timeFormat} onChange={e => setL("timeFormat", e.target.value)} options={["12 Hours (hh:mm AM/PM)","24 Hours (HH:mm)"]} />
          </Field>
          <Field label="Week Starts On">
            <Select value={local.weekStarts} onChange={e => setL("weekStarts", e.target.value)} options={["Monday","Sunday"]} />
          </Field>
          <Field label="Language">
            <Select value={local.language} onChange={e => setL("language", e.target.value)} options={["English","Hindi","Marathi","Tamil","Telugu","Kannada"]} />
          </Field>
          <Field label="Number Format">
            <Select value={local.numberFormat} onChange={e => setL("numberFormat", e.target.value)} options={["1,23,456.78","1,234,567.89","1.234.567,89"]} />
          </Field>
          <Field label="Measurement System">
            <Select value={local.measurement} onChange={e => setL("measurement", e.target.value)} options={["Metric (kg, cm, m)","Imperial (lb, in, ft)"]} />
          </Field>
        </div>
      </SectionCard>
    </div>
  );

  const renderWork = () => (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-[18px] font-bold text-[#10130f]">Work Schedule</h2>
        <p className="text-[12px] text-[#99988f] mt-0.5">Configure working days, working hours and breaks for your organization.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Working Days */}
        <SectionCard icon="📅" title="Working Days">
          <div className="flex flex-col gap-2">
            {DAYS.map(day => (
              <div key={day} className="flex items-center justify-between py-1.5 border-b border-[#f0ede6] last:border-0">
                <span className="text-[13px] text-[#3a3a30]">{day}</span>
                <Toggle checked={workDays[day]} onChange={v => setWorkDays(p => ({ ...p, [day]: v }))} label />
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="flex flex-col gap-4">
          {/* Working Hours */}
          <SectionCard icon="🕐" title="Working Hours">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start Time"><Input value={work.startTime} onChange={e => setW("startTime", e.target.value)} placeholder="09:00 AM" /></Field>
              <Field label="End Time"><Input value={work.endTime} onChange={e => setW("endTime", e.target.value)} placeholder="06:00 PM" /></Field>
            </div>
          </SectionCard>

          {/* Break Settings */}
          <SectionCard icon="☕" title="Break Settings">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Break Duration (Minutes)"><Input value={work.breakDuration} onChange={e => setW("breakDuration", e.target.value)} /></Field>
              <Field label="Break Start Time (Optional)"><Input value={work.breakStart} onChange={e => setW("breakStart", e.target.value)} placeholder="01:00 PM" /></Field>
            </div>
          </SectionCard>

          {/* Additional */}
          <SectionCard icon="⚙" title="Additional Settings">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Weekly Working Hours"><Input value={work.weeklyHours} onChange={e => setW("weeklyHours", e.target.value)} /></Field>
              <Field label="Allow Branch-specific Schedule">
                <div className="flex items-center gap-3 pt-1"><Toggle checked={work.branchSchedule} onChange={v => setW("branchSchedule", v)} label /></div>
              </Field>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );

  const renderLeave = () => (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-[18px] font-bold text-[#10130f]">Leave & Holidays</h2>
        <p className="text-[12px] text-[#99988f] mt-0.5">Configure leave policies and holiday settings for your organization.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Holiday Settings */}
        <SectionCard icon="🏖" title="Holiday Settings">
          <div className="flex flex-col gap-3">
            <Field label="Default Holiday Calendar">
              <Select value={leave.holidayCalendar} onChange={e => setLv("holidayCalendar", e.target.value)} options={["India - 2026","India - 2027","Custom"]} />
            </Field>
            <Field label="Weekend Policy">
              <Select value={leave.weekendPolicy} onChange={e => setLv("weekendPolicy", e.target.value)} options={["Saturday & Sunday","Sunday Only","No Weekend"]} />
            </Field>
            {[
              { label: "Allow Branch-specific Holidays", key: "branchHolidays" },
              { label: "Holiday Approval Required",      key: "holidayApproval" },
              { label: "Auto Carry Holidays to Next Year", key: "autoCarry" },
              { label: "Notify Upcoming Holidays",       key: "notifyHolidays" },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[12px] text-[#4a4a40]">{label}</span>
                <Toggle checked={leave[key]} onChange={v => setLv(key, v)} label />
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Field label="Upcoming Holiday Reminder">
                <Input value={leave.upcomingReminder} onChange={e => setLv("upcomingReminder", e.target.value)} />
              </Field>
              <div className="pt-6">
                <Select value={leave.reminderUnit} onChange={e => setLv("reminderUnit", e.target.value)} options={["Days Before","Hours Before","Weeks Before"]} />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Leave Settings */}
        <SectionCard icon="📋" title="Leave Settings">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Field label="Annual Leave Days Allowed">
                <Input value={leave.annualAllowed} onChange={e => setLv("annualAllowed", e.target.value)} />
              </Field>
              <div className="pt-6">
                <Select value="Days" onChange={() => {}} options={["Days","Hours"]} />
              </div>
            </div>
            {[
              { label: "Allow Employees to Select Optional Holidays", key: "forwardLeaves" },
              { label: "Leave Carry Forward Allowed",                 key: "optionalHolidays" },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[12px] text-[#4a4a40]">{label}</span>
                <Toggle checked={leave[key]} onChange={v => setLv(key, v)} label />
              </div>
            ))}
            <div className="flex items-center gap-3">
              <Field label="Maximum Carry Forward Leaves">
                <Input value={leave.maxCarry} onChange={e => setLv("maxCarry", e.target.value)} />
              </Field>
              <div className="pt-6">
                <Select value="Days" onChange={() => {}} options={["Days","Hours"]} />
              </div>
            </div>
            {[
              { label: "Leave Approval Required",   key: "approvalRequired" },
              { label: "Leave Encashment Allowed",  key: "encashmentAllowed" },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[12px] text-[#4a4a40]">{label}</span>
                <Toggle checked={leave[key]} onChange={v => setLv(key, v)} label />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );

  const renderNotifs = () => (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-[18px] font-bold text-[#10130f]">Notifications</h2>
        <p className="text-[12px] text-[#99988f] mt-0.5">Configure notification preferences for your organization.</p>
      </div>
      <div className="bg-white border border-[#e1dfd8] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_0.4fr] px-5 py-3 bg-[#faf9f5] border-b border-[#e4e1d8]">
          {["NOTIFICATION TYPE","EMAIL","IN-APP","SMS","REMINDER SETTINGS","ACTION"].map(h => (
            <span key={h} className="text-[9px] font-semibold text-[#a3a6a5] tracking-widest">{h}</span>
          ))}
        </div>
        <div className="px-5">
          {notifs.map(n => (
            <NotifRow
              key={n.key}
              label={n.label}
              email={{ on: n.email }}
              inApp={{ on: n.inApp }}
              sms={{ on: n.sms }}
              reminder={n.reminder}
              onToggle={(channel, val) => toggleNotif(n.key, channel, val)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderSys = () => (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-[18px] font-bold text-[#10130f]">System Preferences</h2>
        <p className="text-[12px] text-[#99988f] mt-0.5">Configure general system preferences and security options.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">

        {/* General Preferences */}
        <SectionCard icon="⚙" title="General Preferences">
          <div className="flex flex-col gap-3">
            <Field label="Default Page Size">
              <Select value={sys.pageSize} onChange={e => setSy("pageSize", e.target.value)} options={["10","25","50","100"]} />
            </Field>
            <Field label="Theme">
              <Select value={sys.theme} onChange={e => setSy("theme", e.target.value)} options={["Light","Dark","System"]} />
            </Field>
            {[
              { label: "Enable Dashboard Analytics", key: "dashboardAnalytics" },
              { label: "Enable Audit Logs",           key: "auditLogs" },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[12px] text-[#4a4a40]">{label}</span>
                <Toggle checked={sys[key]} onChange={v => setSy(key, v)} label />
              </div>
            ))}
            <Field label="Session Timeout (Minutes)"><Input value={sys.sessionTimeout} onChange={e => setSy("sessionTimeout", e.target.value)} /></Field>
          </div>
        </SectionCard>

        {/* Data Management */}
        <SectionCard icon="💾" title="Data Management">
          <div className="flex flex-col gap-3">
            {[
              { label: "Enable Document Upload", key: "docUpload" },
              { label: "Allow Data Export",      key: "dataExport" },
              { label: "Auto Backup",            key: "autoBackup" },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[12px] text-[#4a4a40]">{label}</span>
                <Toggle checked={sys[key]} onChange={v => setSy(key, v)} label />
              </div>
            ))}
            <Field label="Backup Frequency">
              <Select value={sys.backupFreq} onChange={e => setSy("backupFreq", e.target.value)} options={["Daily","Weekly","Monthly"]} />
            </Field>
            <div className="flex items-center gap-3">
              <Field label="Backup Retention"><Input value={sys.backupRetention} onChange={e => setSy("backupRetention", e.target.value)} /></Field>
              <div className="pt-6"><Select value="Days" onChange={() => {}} options={["Days","Months"]} /></div>
            </div>
          </div>
        </SectionCard>

        {/* Security Preferences */}
        <SectionCard icon="🔒" title="Security Preferences">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#4a4a40]">Two-Factor Authentication</span>
              <Toggle checked={sys.twoFactor} onChange={v => setSy("twoFactor", v)} label />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Password Expiry (Days)"><Input value={sys.passwordExpiry} onChange={e => setSy("passwordExpiry", e.target.value)} /></Field>
              <Field label="Minimum Password Length">
                <div className="flex items-center gap-2">
                  <Input value={sys.minPwdLength} onChange={e => setSy("minPwdLength", e.target.value)} />
                  <span className="text-[11px] text-[#99988f] whitespace-nowrap">Characters</span>
                </div>
              </Field>
              <Field label="Login Attempt Limit"><Input value={sys.loginAttempts} onChange={e => setSy("loginAttempts", e.target.value)} /></Field>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#4a4a40]">Require Strong Password</span>
              <Toggle checked={sys.strongPwd} onChange={v => setSy("strongPwd", v)} label />
            </div>
          </div>
        </SectionCard>

        {/* Approval Preferences */}
        <SectionCard icon="✅" title="Approval Preferences">
          <div className="flex flex-col gap-3">
            {[
              { label: "Require Approval for New Users",         key: "approvalNewUsers" },
              { label: "Require Approval for Company Changes",   key: "approvalCompanyChanges" },
              { label: "Acme Escalate Pending Approvals",        key: "escalateApprovals" },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[12px] text-[#4a4a40]">{label}</span>
                <Toggle checked={sys[key]} onChange={v => setSy(key, v)} label />
              </div>
            ))}
            <div className="flex items-center gap-3">
              <Field label="Default Approval Levels">
                <Input value={sys.defaultApprovalLevels} onChange={e => setSy("defaultApprovalLevels", e.target.value)} />
              </Field>
              <div className="pt-6"><Select value="Levels" onChange={() => {}} options={["Levels"]} /></div>
            </div>
            <div className="flex items-center gap-3">
              <Field label="Escalation After (Days)">
                <Input value={sys.escalateAfter} onChange={e => setSy("escalateAfter", e.target.value)} />
              </Field>
              <div className="pt-6"><Select value="Days" onChange={() => {}} options={["Days","Hours"]} /></div>
            </div>
          </div>
        </SectionCard>

        {/* System Maintenance — full width */}
        <div className="col-span-2">
          <SectionCard icon="🔧" title="System Maintenance">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#4a4a40]">Enable Maintenance Mode</span>
                  <Toggle checked={sys.maintenanceMode} onChange={v => setSy("maintenanceMode", v)} label />
                </div>
                <Field label="Maintenance Message">
                  <textarea
                    rows={3}
                    value={sys.maintenanceMsg}
                    onChange={e => setSy("maintenanceMsg", e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#e0ddd5] rounded-[10px] text-[13px] text-[#10130f] bg-[#faf9f5] outline-none focus:border-[#10130f] resize-none transition"
                  />
                </Field>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#4a4a40]">Show Inactive Records</span>
                  <Toggle checked={sys.showInactive} onChange={v => setSy("showInactive", v)} label />
                </div>
                <div className="flex items-center gap-3">
                  <Field label="Purge Inactive Records After">
                    <Input value={sys.purgeAfter} onChange={e => setSy("purgeAfter", e.target.value)} />
                  </Field>
                  <div className="pt-6"><Select value="Days" onChange={() => {}} options={["Days","Months"]} /></div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

      </div>
    </div>
  );

  const SECTIONS = {
    general: renderGeneral,
    local:   renderLocalization,
    work:    renderWork,
    leave:   renderLeave,
    notifs:  renderNotifs,
    sys:     renderSys,
  };

  return (
    <div className="w-full flex gap-0 min-h-[600px]">

      {/* ── Sidebar ── */}
      <aside className="w-44 flex-shrink-0 border-r border-[#e1dfd8] bg-[#faf9f5] pt-4">
        <p className="text-[9px] font-bold text-[#a3a6a5] tracking-widest px-4 mb-3">SETTINGS</p>
        {NAV.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition text-left
              ${activeSection === key
                ? "bg-[#edeae2] text-[#10130f] border-r-2 border-[#10130f]"
                : "text-[#6a6a60] hover:bg-[#ece9e0] hover:text-[#10130f]"}`}
          >
            <span className="text-[14px]">{icon}</span>
            {label}
          </button>
        ))}
      </aside>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {(message || activeCompany.error) && <div className="mx-6 mt-4 px-4 py-2.5 border border-[#dfd8c9] rounded-xl bg-[#fffaf0] text-[#6b5b3e] text-xs">{message || activeCompany.error}</div>}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {SECTIONS[activeSection]?.()}
        </div>

        {/* ── Footer actions ── */}
        <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-[#e1dfd8] bg-[#faf9f5]">
          <button className="h-9 px-5 border border-[#e0ddd5] rounded-xl bg-white text-[#20221e] text-[12px] font-medium hover:bg-[#ece9e0] transition">
            Cancel
          </button>
          <button onClick={saveSettings} disabled={saving || !companyId} className="h-9 px-5 bg-[#111410] text-white border-none rounded-xl text-[12px] font-medium flex items-center gap-2 hover:bg-[#1e2419] transition disabled:opacity-50">
            💾 {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

    </div>
  );
}
