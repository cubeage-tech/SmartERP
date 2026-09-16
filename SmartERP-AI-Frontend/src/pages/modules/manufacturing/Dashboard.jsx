import React, { useEffect, useState } from "react";
import ManufacturingService from "../../../core/services/modules/manufacturing.service";

import WorkOrders from "./WorkOrders";
import BillOfMaterials from "./BillOfMaterials";
import MachineTracking from "./MachineTracking";
import QualityControl from "./QualityControl";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Sel = ({ value, onChange, options, placeholder, disabled }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full appearance-none rounded-[10px] border border-[#e4e2dc] bg-white px-3 py-2.5 pr-8 text-[13px] text-[#151714] outline-none focus:border-[#151714] transition disabled:bg-[#f7f6f2] disabled:text-[#aaa]"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}
    </select>
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#aaa]">▾</span>
  </div>
);

const Inp = ({ value, onChange, placeholder, readOnly, type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    readOnly={readOnly}
    className="w-full rounded-[10px] border border-[#e4e2dc] bg-white px-3 py-2.5 text-[13px] text-[#151714] outline-none placeholder-[#c0bdb5] focus:border-[#151714] transition read-only:bg-[#f7f6f2] read-only:text-[#888]"
  />
);

const F = ({ label, required, children, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-[11px] font-medium text-[#6a6a60]">
      {label}{required && <span className="ml-0.5 text-[#c0392b]"> *</span>}
    </label>
    {children}
  </div>
);

const SecHead = ({ title }) => (
  <h3 className="mb-3 text-[13px] font-semibold text-[#151714]">{title}</h3>
);

// ─── New Work Order Modal ─────────────────────────────────────────────────────
function NewWorkOrderModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    woNo:         "WO-2025-0013",
    woDate:       "2025-08-24",
    requiredDate: "2025-08-31",
    priority:     "High",
    productionType: "Manufacturing",
    orderType:    "Production",
    status:       "PENDING",
    source:       "Internal",
    customer:     "",
    referenceNo:  "",
    notes:        "",
    product:      "",
    itemCode:     "",
    uom:          "",
    quantity:     "1",
    bom:          "",
    bomVersion:   "",
    totalComponents: "0",
    machine:      "",
    workCenter:   "",
    operation:    "",
    estimatedTime: "0.00",
    operator:     "",
    teamMembers:  "",
    shift:        "",
  });

  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  const validate = () => {
    const req = { woNo: "Work Order No.", woDate: "Work Order Date", requiredDate: "Required Date", priority: "Priority", productionType: "Production Type", orderType: "Order Type", product: "Product / Item", uom: "UOM", bom: "BOM", machine: "Machine", operator: "Operator / Lead" };
    const e = {};
    Object.entries(req).forEach(([k, l]) => { if (!form[k]?.trim()) e[k] = `${l} is required`; });
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (asDraft = false) => {if (!asDraft && !validate()) {return;}

  const payload = {
    productName: form.product,
    quantity: Number(form.quantity),
    bomNumber: form.bom,
    machineName: form.machine,
    operatorName: form.operator,
    dueDate: form.requiredDate,
    status: asDraft ? "PENDING" : form.status,
    progress: 0,
  };

  try {
    await onSubmit(payload);
    onClose();
  } catch (error) {
      console.error("Error creating work order:", error);
  console.error("STATUS:", error.response?.status);
  console.error("BACKEND RESPONSE:", error.response?.data);
  }
};

  const err = k => errors[k] && <span className="text-[11px] text-[#c0392b]">{errors[k]}</span>;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="flex max-h-[92vh] w-full max-w-[900px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#ece9e2] px-7 py-5">
          <div>
            <h2 className="text-[20px] font-bold text-[#151714]">New Work Order</h2>
            <p className="mt-0.5 text-[12px] text-[#999a94]">Create a new manufacturing work order</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e4e2dc] bg-[#f7f6f2] text-[14px] text-[#777] hover:bg-[#ece9e2] transition">✕</button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-7 py-5 space-y-6">

          {/* ── Work Order Information ── */}
          <div>
            <SecHead title="Work Order Information" />
            <div className="grid grid-cols-4 gap-3">
              <F label="Work Order No." required>
                <Inp value={form.woNo} onChange={e => set("woNo", e.target.value)} placeholder="WO-2025-0013" />
                {err("woNo")}
              </F>
              <F label="Work Order Date" required>
                <Inp type="date" value={form.woDate} onChange={e => set("woDate", e.target.value)} />
                {err("woDate")}
              </F>
              <F label="Required Date" required>
                <Inp type="date" value={form.requiredDate} onChange={e => set("requiredDate", e.target.value)} />
                {err("requiredDate")}
              </F>
              <F label="Priority" required>
                <Sel value={form.priority} onChange={e => set("priority", e.target.value)} options={["Low","Medium","High","Critical"]} placeholder="Select priority" />
                {err("priority")}
              </F>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-3">
              <F label="Production Type" required>
                <Sel value={form.productionType} onChange={e => set("productionType", e.target.value)} options={["Manufacturing","Assembly","Sub-contracting","Rework"]} placeholder="Select type" />
                {err("productionType")}
              </F>
              <F label="Order Type" required>
                <Sel value={form.orderType} onChange={e => set("orderType", e.target.value)} options={["Production","Sample","Trial","Rework"]} placeholder="Select order type" />
                {err("orderType")}
              </F>
              <F label="Status">
                <Sel
                  value={form.status}
                  onChange={e => set("status", e.target.value)}
                  options={[
                    { v: "PENDING", l: "Pending" },
                    { v: "IN_PROGRESS", l: "In Progress" },
                    { v: "COMPLETED", l: "Completed" },
                    { v: "ON_HOLD", l: "On Hold" },
                    { v: "CANCELLED", l: "Cancelled" },
                  ]}
                />
              </F>
              <F label="Source">
                <Sel value={form.source} onChange={e => set("source", e.target.value)} options={["Internal","Customer Order","Sales Order","Project"]} />
              </F>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              <F label="Customer / Project">
                <Sel value={form.customer} onChange={e => set("customer", e.target.value)} options={["Tata Steel Ltd","Bajaj Auto Ltd","Infosys BPO","—"]} placeholder="Select customer or project" />
              </F>
              <F label="Reference No.">
                <Inp value={form.referenceNo} onChange={e => set("referenceNo", e.target.value)} placeholder="Enter reference number" />
              </F>
              <F label="Notes">
                <Inp value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Enter any notes (optional)" />
              </F>
            </div>
          </div>

          {/* ── Product Information ── */}
          <div>
            <SecHead title="Product Information" />
            <div className="grid grid-cols-4 gap-3">
              <F label="Product / Item" required>
                <Sel value={form.product} onChange={e => set("product", e.target.value)} options={["Steel Rod 12mm","Aluminium Sheet","Copper Wire 4mm","Bolt M10"]} placeholder="Select product or item" />
                {err("product")}
              </F>
              <F label="Item Code">
                <Inp value={form.itemCode || "Auto-generated"} readOnly placeholder="Auto-generated" />
              </F>
              <F label="UOM" required>
                <Sel value={form.uom} onChange={e => set("uom", e.target.value)} options={["Nos","Kg","Meter","Litre","Box","Set"]} placeholder="Select unit" />
                {err("uom")}
              </F>
              <F label="Quantity" required>
                <Inp type="number" value={form.quantity} onChange={e => set("quantity", e.target.value)} placeholder="0" />
              </F>
            </div>
          </div>

          {/* ── Bill of Materials ── */}
          <div>
            <SecHead title="Bill of Materials" />
            <div className="grid grid-cols-4 gap-3">
              <F label="BOM" required>
                <Sel value={form.bom} onChange={e => set("bom", e.target.value)} options={["BOM-001 Steel Rod","BOM-002 Aluminium","BOM-003 Copper"]} placeholder="Select BOM" />
                {err("bom")}
              </F>
              <F label="BOM Version">
                <Sel value={form.bomVersion} onChange={e => set("bomVersion", e.target.value)} options={["v1.0","v1.1","v2.0"]} placeholder="Select version" />
              </F>
              <F label="Total Components">
                <Inp value={form.totalComponents} readOnly />
              </F>
              {/* BOM Summary card */}
              <div className="flex items-end">
                <div className={`w-full rounded-[10px] border px-4 py-3 ${form.bom ? "border-[#bfdbfe] bg-[#eff6ff]" : "border-[#e4e2dc] bg-[#f7f6f2]"}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px]">ℹ</span>
                    <span className={`text-[12px] font-semibold ${form.bom ? "text-[#1d4ed8]" : "text-[#888]"}`}>BOM Summary</span>
                  </div>
                  <p className={`mt-1 text-[11px] ${form.bom ? "text-[#3b82f6]" : "text-[#aaa]"}`}>
                    {form.bom ? `${form.totalComponents} components loaded` : "Select a BOM to view components"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Machine & Operation ── */}
          <div>
            <SecHead title="Machine & Operation" />
            <div className="grid grid-cols-4 gap-3">
              <F label="Machine" required>
                <Sel value={form.machine} onChange={e => set("machine", e.target.value)} options={["CNC-01","CNC-02","Lathe-01","Press-01","Grinder-02"]} placeholder="Select machine" />
                {err("machine")}
              </F>
              <F label="Work Center">
                <Sel value={form.workCenter} onChange={e => set("workCenter", e.target.value)} options={["WC-Machining","WC-Assembly","WC-Quality","WC-Packaging"]} placeholder="Select work center" />
              </F>
              <F label="Operation">
                <Sel value={form.operation} onChange={e => set("operation", e.target.value)} options={["Cutting","Drilling","Welding","Assembly","Inspection"]} placeholder="Select operation" />
              </F>
              <F label="Estimated Time (Hours)">
                <Inp type="number" value={form.estimatedTime} onChange={e => set("estimatedTime", e.target.value)} placeholder="0.00" />
              </F>
            </div>
          </div>

          {/* ── Assignment ── */}
          <div>
            <SecHead title="Assignment" />
            <div className="grid grid-cols-3 gap-3">
              <F label="Operator / Lead" required>
                <Sel value={form.operator} onChange={e => set("operator", e.target.value)} options={["Arjun Mehta","Vikram Joshi","Rahul Sharma","Suresh Patil"]} placeholder="Select operator or lead" />
                {err("operator")}
              </F>
              <F label="Team Members">
                <Sel value={form.teamMembers} onChange={e => set("teamMembers", e.target.value)} options={["Team A","Team B","Team C"]} placeholder="Select team members" />
              </F>
              <F label="Shift">
                <Sel value={form.shift} onChange={e => set("shift", e.target.value)} options={["Morning (6AM-2PM)","Afternoon (2PM-10PM)","Night (10PM-6AM)"]} placeholder="Select shift" />
              </F>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#ece9e2] px-7 py-4">
          <button onClick={onClose} className="rounded-[12px] border border-[#e4e2dc] bg-white px-5 py-2.5 text-[13px] font-medium text-[#444] hover:bg-[#f7f6f2] transition">Cancel</button>
          <button onClick={() => submit(true)} className="rounded-[12px] border border-[#e4e2dc] bg-[#f7f6f2] px-5 py-2.5 text-[13px] font-medium text-[#444] hover:bg-[#ece9e2] transition">Save as Draft</button>
          <button onClick={() => submit(false)} className="rounded-[12px] bg-[#151714] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#2a2c28] transition">Create Work Order</button>
        </div>

      </div>
    </div>
  );
}

const tabs = [
  {
    label: "WORK ORDERS",
    key: "work-orders",
  },
  {
    label: "BOM",
    key: "bom",
  },
  {
    label: "MACHINES",
    key: "machines",
  },
  {
    label: "QUALITY",
    key: "quality",
  },
];

function StatCard({ value, label, description, type }) {
  return (
    <div className="rounded-[20px] border border-[#e5e3de] bg-white px-4 py-2 sm:px-5">
      <div className="font-serif text-[26px] leading-none tracking-[-0.03em] text-[#151714] sm:text-[28px]">
        {value}
      </div>

      <div className="mt-0.5 font-mono text-[9px] tracking-[0.14em] text-[#9b9b95] sm:text-[10px]">
        {label}
      </div>

      <div
        className={`mt-0.5 font-mono text-[12px] sm:text-[13px] ${
          type === "danger" ? "text-[#8e4f46]" : "text-[#53664a]"
        }`}
      >
        {description}
      </div>
    </div>
  );
}

function PageContent({ activeTab, workOrdersRefreshKey, machineCreateRequest }) {
  switch (activeTab) {
    case "work-orders":
      return <WorkOrders refreshKey={workOrdersRefreshKey} />;

    case "bom":
      return <BillOfMaterials />;

    case "machines":
      return <MachineTracking createRequest={machineCreateRequest} />;

    case "quality":
      return <QualityControl />;

    default:
      return null;
  }
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("work-orders");
  const [showModal, setShowModal] = useState(false);
  const [workOrdersRefreshKey, setWorkOrdersRefreshKey] = useState(0);
  const [machineCreateRequest, setMachineCreateRequest] = useState(0);

  const [dashboardStats, setDashboardStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      setLoadingStats(true);

      const response = await ManufacturingService.getDashboard();

      setDashboardStats(response.data?.stats || []);
    } catch (error) {
      console.error("Error fetching manufacturing dashboard:", error);
      setDashboardStats([]);
    } finally {
      setLoadingStats(false);
    }
  };

  fetchDashboard();
}, [workOrdersRefreshKey]);

const stats = loadingStats
  ? [
      {
        value: "...",
        label: "ACTIVE WOS",
        description: "Loading...",
        type: "positive",
      },
      {
        value: "...",
        label: "OEE",
        description: "Loading...",
        type: "positive",
      },
      {
        value: "...",
        label: "QUALITY RATE",
        description: "Loading...",
        type: "positive",
      },
      {
        value: "...",
        label: "MACHINE DOWN",
        description: "Loading...",
        type: "positive",
      },
    ]
  : dashboardStats;

  return (
    <main className="bg-[#f7f6f2] text-[#171815]">
      {/* Dashboard Header */}
      <section className="px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.14em] text-[#999a94] sm:text-[11px]">
              PRODUCTION
            </p>

            <h1 className="mt-2 font-serif text-[26px] leading-none tracking-[-0.02em] text-[#151714] sm:text-[28px]">
              Manufacturing
            </h1>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3 sm:pt-1">
            <button
              type="button"
              className="w-full rounded-[16px] border border-[#e4e2dc] bg-[#f9f8f5] px-5 py-3 font-mono text-[11px] text-[#252622] transition-all duration-200 hover:border-[#c9c7c0] hover:bg-white sm:w-auto sm:text-[12px]"
            >
              Schedule View
            </button>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full rounded-[16px] bg-[#151714] px-5 py-3 font-mono text-[11px] text-white transition-all duration-200 hover:bg-[#2a2c28] hover:shadow-md sm:w-auto sm:text-[12px]"
            >
              + New Work Order
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <section className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        {/* Manufacturing Tabs */}
        <nav className="mt-6 flex flex-wrap items-center justify-between gap-3 sm:mt-8">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`
                  rounded-[11px]
                  px-3
                  py-2
                  font-mono
                  text-[9px]
                  tracking-[0.07em]
                  transition-all
                  duration-200
                  sm:px-5
                  sm:text-[11px]
                  sm:tracking-[0.08em]
                  ${
                    isActive
                      ? "bg-white text-[#171815] shadow-[0_2px_5px_rgba(0,0,0,0.12)]"
                      : "text-[#999a94] hover:bg-[#efeee9] hover:text-[#171815]"
                  }
                `}
              >
                {tab.label}
              </button>
            );
            })}
          </div>
          {activeTab === "machines" && (
            <button
              type="button"
              onClick={() => setMachineCreateRequest((request) => request + 1)}
              className="shrink-0 rounded-[14px] bg-[#151714] px-4 py-2.5 font-mono text-[11px] text-white hover:bg-[#2b2d28] hover:shadow-sm"
            >
              + Add Machine
            </button>
          )}
        </nav>
      </section>

      {/* Selected Page Content */}
      <section className="mt-0 overflow-x-hidden">
        <PageContent activeTab={activeTab} workOrdersRefreshKey={workOrdersRefreshKey} machineCreateRequest={machineCreateRequest} />
      </section>

      {/* New Work Order Modal */}
      {showModal && (
        <NewWorkOrderModal
          onClose={() => setShowModal(false)}
          onSubmit={async (payload) => {
            try {
              await ManufacturingService.create(payload);
            
              setWorkOrdersRefreshKey((key) => key + 1);
            } catch (error) {
              console.error("Error creating work order:", error);
              throw error;
            }
          }}
        />
      )}
    </main>
  );
};

export default Dashboard;