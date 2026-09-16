import React, { useEffect, useState } from "react";
import ManufacturingService from "../../../core/services/modules/manufacturing.service";

// ─── Shared form primitives ───────────────────────────────────────────────────
const Sel = ({ value, onChange, options, placeholder }) => (
  <div className="relative">
    <select value={value} onChange={onChange}
      className="w-full appearance-none rounded-[9px] border border-[#e4e2dc] bg-white px-3 py-2 pr-7 text-[12px] text-[#151714] outline-none focus:border-[#151714] transition">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}
    </select>
    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#bbb]">▾</span>
  </div>
);

const Inp = ({ value, onChange, placeholder, readOnly, type = "text", className = "" }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
    className={`w-full rounded-[9px] border border-[#e4e2dc] bg-white px-3 py-2 text-[12px] text-[#151714] outline-none placeholder-[#bbb] focus:border-[#151714] transition read-only:bg-[#f7f6f2] read-only:text-[#999] ${className}`} />
);

const F = ({ label, required, half, children }) => (
  <div className={`flex flex-col gap-1 ${half ? "col-span-1" : ""}`}>
    <label className="text-[10px] font-medium text-[#777]">{label}{required && <span className="text-[#c0392b] ml-0.5">*</span>}</label>
    {children}
  </div>
);

const SecTitle = ({ n, title, sub }) => (
  <div className="flex items-start gap-1.5 mb-3">
    <h3 className="text-[13px] font-semibold text-[#151714]">{n}. {title}</h3>
    {sub && <span className="mt-0.5 text-[10px] text-[#999]">{sub}</span>}
  </div>
);

// ─── New BOM Modal ────────────────────────────────────────────────────────────
function NewBOMModal({ onClose, onSubmit, initialData = null, mode = "new" }) {

  // ── State ──────────────────────────────────────────────────────────────────
  const [step, setStep]   = useState(1); // 1=Basic, 2=Components, 3=Operations, 4=Costing
  const [form, setForm]   = useState({
    bomNumber: "BOM-043", bomName: "Steel Frame Assembly A", bomType: "Manufacturing", status: "Draft",
    product: "Steel Frame Assembly A", productCode: "SFA-001", version: "v1.0",
    revisionDate: "2026-08-24", effectiveFrom: "2026-08-24", effectiveTo: "", revisionNotes: "Initial BOM creation",
    description: "Standard steel frame assembly used in industrial equipment.",
    rawWarehouse: "Main Warehouse", componentStore: "Raw Material Store",
    fgWarehouse: "Finished Goods Store", backflush: "Yes",
    inspectionRequired: "Yes", inspectionOp: "Quality Inspection",
    qualitySpec: "As per drawing STD-2026", minQuality: "A Grade",
    notes: "• Use galvanized steel only.\n• Welding must follow approved specification.\n• Components must be inspected before assembly.",
    ...initialData,
  });

  const [components, setComponents] = useState([
    { id: 1, code: "RM-001", name: "Steel Plate",   type: "Raw Material", qty: 4,  uom: "PCS", scrap: "2%",  netQty: 4.08, unitCost: 800,  totalCost: 3264, operation: "Cutting"  },
    { id: 2, code: "RM-002", name: "Steel Rod",     type: "Raw Material", qty: 6,  uom: "PCS", scrap: "0%",  netQty: 6,    unitCost: 120,  totalCost: 727,  operation: "Cutting"  },
    { id: 3, code: "RM-003", name: "M8 Bolt",       type: "Component",   qty: 12, uom: "PCS", scrap: "0%",  netQty: 12,   unitCost: 15,   totalCost: 180,  operation: "Assembly" },
    { id: 4, code: "RM-004", name: "Welding Wire",  type: "Raw Material", qty: 1.5,uom: "KG",  scrap: "3%",  netQty: 1.55, unitCost: 400,  totalCost: 618,  operation: "Welding"  },
  ].map((component) => component));

  const [operations, setOperations] = useState([
    { id: 1, seq: 10, name: "Cutting",           wc: "CNC-01",    machine: "CNC-01",    setup: "30 min", run: "2 hr",   labor: "1 hr",   instructions: "Cut steel as per drawing" },
    { id: 2, seq: 20, name: "Welding",           wc: "Welding",   machine: "WELD-02",   setup: "20 min", run: "3 hr",   labor: "2 hr",   instructions: "Use MIG welding process" },
    { id: 3, seq: 30, name: "Painting",          wc: "Finishing", machine: "PAINT-01",  setup: "15 min", run: "1.5 hr", labor: "1 hr",   instructions: "Apply primer and paint" },
    { id: 4, seq: 40, name: "Quality Inspection",wc: "Quality",   machine: "QC-01",     setup: "10 min", run: "0.5 hr", labor: "0.5 hr", instructions: "Dimensional check" },
  ].map((operation) => operation));

  const [files, setFiles] = useState([
    { name: "Steel_Frame_Drawing.pdf", size: "1.2 MB" },
    { name: "Assembly_Instructions.pdf", size: "2.4 MB" },
  ]);

  useEffect(() => {
    if (initialData?.components) setComponents(initialData.components);
    if (initialData?.operations) setOperations(initialData.operations);
    if (initialData?.files) setFiles(initialData.files);
  }, [initialData]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // ── Derived costs ──────────────────────────────────────────────────────────
  const materialCost = components.reduce((s, c) => s + c.totalCost, 0);
  const scrapCost    = 32.40;
  const laborCost    = 1200;
  const machineCost  = 800;
  const overhead     = 500;
  const totalCost    = materialCost + laborCost + machineCost + overhead;

  const STEPS = ["Basic Information","Components","Operations","Costing & Review"];

  const submit = (asDraft) => { onSubmit({ ...form, components, operations, savedAs: asDraft ? "draft" : "submitted" }); };

  // ── Section: Basic Information ─────────────────────────────────────────────
  const renderBasic = () => (
    <div className="space-y-4">
      {/* BOM Information */}
      <div>
        <SecTitle n="1" title="BOM Information" />
        <div className="grid grid-cols-4 gap-3 mb-3">
          <F label="BOM Number" required>
            <div className="relative">
              <Inp value={form.bomNumber} onChange={e => set("bomNumber", e.target.value)} placeholder="BOM-043" />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] text-[#bbb]">🔒</span>
            </div>
          </F>
          <F label="BOM Name" required>
            <Inp value={form.bomName} onChange={e => set("bomName", e.target.value)} placeholder="BOM Name" />
          </F>
          <F label="BOM Type" required>
            <Sel value={form.bomType} onChange={e => set("bomType", e.target.value)} options={["Manufacturing","Assembly","Sub-contracting","Rework","Template"]} />
          </F>
          <F label="Status" required>
            <Sel value={form.status} onChange={e => set("status", e.target.value)} options={["Draft","Active","Inactive","Obsolete"]} />
          </F>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-3">
          <F label="Product / Finished Good" required>
            <Sel value={form.product} onChange={e => set("product", e.target.value)} options={["Steel Frame Assembly A","Bracket Kit M8","Drive Shaft Assembly","Zinc Cast Housing B"]} />
          </F>
          <F label="Product Code">
            <Inp value={form.productCode} readOnly />
          </F>
          <F label="Version">
            <Inp value={form.version} onChange={e => set("version", e.target.value)} />
          </F>
          <F label="Revision Date">
            <Inp type="date" value={form.revisionDate} onChange={e => set("revisionDate", e.target.value)} />
          </F>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-3">
          <F label="Effective From" required>
            <Inp type="date" value={form.effectiveFrom} onChange={e => set("effectiveFrom", e.target.value)} />
          </F>
          <F label="Effective To">
            <Inp type="date" value={form.effectiveTo} onChange={e => set("effectiveTo", e.target.value)} placeholder="Select date" />
          </F>
          <F label="Revision Notes" half>
            <Inp value={form.revisionNotes} onChange={e => set("revisionNotes", e.target.value)} placeholder="Revision notes" />
          </F>
          <div />
        </div>
        <F label="Description">
          <div className="relative">
            <textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)}
              maxLength={600}
              className="w-full rounded-[9px] border border-[#e4e2dc] bg-white px-3 py-2 text-[12px] text-[#151714] outline-none focus:border-[#151714] transition resize-none" />
            <span className="absolute bottom-2 right-3 text-[10px] text-[#bbb]">{form.description.length}/600</span>
          </div>
        </F>
      </div>
    </div>
  );

  // ── Section: Components ────────────────────────────────────────────────────
  const renderComponents = () => (
    <div className="space-y-4">
      <SecTitle n="2" title="Components" sub="ⓘ" />
      <div className="overflow-x-auto rounded-[12px] border border-[#e4e2dc]">
        <table className="w-full min-w-[800px] text-[11px]">
          <thead>
            <tr className="bg-[#f7f6f2] border-b border-[#e4e2dc]">
              {["#","Component Code","Component Name","Type","Qty","UOM","Scrap%","Net Qty","Unit Cost","Total Cost","Operation","Actions"].map(h => (
                <th key={h} className="px-3 py-2 text-left font-mono text-[9px] tracking-wider text-[#999] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {components.map((c, i) => (
              <tr key={c.id} className="border-b border-[#f0ede6] last:border-0 hover:bg-[#faf9f7]">
                <td className="px-3 py-2.5 text-[#999]">{i + 1}</td>
                <td className="px-3 py-2.5 font-mono text-[#666]">{c.code}</td>
                <td className="px-3 py-2.5 font-medium text-[#151714]">{c.name}</td>
                <td className="px-3 py-2.5">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${c.type === "Raw Material" ? "bg-[#fff3cd] text-[#856404]" : "bg-[#d1ecf1] text-[#0c5460]"}`}>{c.type}</span>
                </td>
                <td className="px-3 py-2.5 text-[#151714]">{c.qty}</td>
                <td className="px-3 py-2.5 text-[#666]">{c.uom}</td>
                <td className="px-3 py-2.5 text-[#666]">{c.scrap}</td>
                <td className="px-3 py-2.5 text-[#666]">{c.netQty}</td>
                <td className="px-3 py-2.5 text-[#151714]">₹{c.unitCost}</td>
                <td className="px-3 py-2.5 text-[#151714]">₹{c.totalCost.toLocaleString("en-IN")}</td>
                <td className="px-3 py-2.5 text-[#666]">{c.operation}</td>
                <td className="px-3 py-2.5">
                  <div className="flex gap-1.5">
                    <button className="text-[#888] hover:text-[#151714] transition">✏</button>
                    <button onClick={() => setComponents(p => p.filter(x => x.id !== c.id))} className="text-[#e05050] hover:text-[#c0392b] transition">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary row */}
      <div className="flex items-center justify-between rounded-[10px] bg-[#f7f6f2] px-4 py-3 text-[11px]">
        <span className="text-[#666]">Total Components: <strong className="text-[#151714]">{components.length}</strong></span>
        <span className="text-[#666]">Material Cost: <strong className="text-[#151714]">₹{(materialCost - scrapCost).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></span>
        <span className="text-[#666]">Scrap Cost: <strong className="text-[#151714]">₹{scrapCost}</strong></span>
        <span className="text-[#666]">Total Material Cost: <strong className="text-green-700">₹{materialCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></span>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setComponents(p => [...p, { id: Date.now(), code: "", name: "", type: "Raw Material", qty: 1, uom: "PCS", scrap: "0%", netQty: 1, unitCost: 0, totalCost: 0, operation: "" }])}
          className="rounded-[10px] border border-[#e4e2dc] bg-white px-4 py-2 text-[11px] font-medium text-[#555] hover:bg-[#f7f6f2] transition">
          + Add Component
        </button>
      </div>
    </div>
  );

  // ── Section: Operations ────────────────────────────────────────────────────
  const renderOperations = () => (
    <div className="space-y-4">
      <SecTitle n="3" title="Operations / Routing" sub="ⓘ" />
      <div className="overflow-x-auto rounded-[12px] border border-[#e4e2dc]">
        <table className="w-full min-w-[900px] text-[11px]">
          <thead>
            <tr className="bg-[#f7f6f2] border-b border-[#e4e2dc]">
              {["Seq.","Operation Name","Work Center","Machine","Setup Time","Run Time","Labor Time","Instructions","Actions"].map(h => (
                <th key={h} className="px-3 py-2 text-left font-mono text-[9px] tracking-wider text-[#999] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {operations.map(op => (
              <tr key={op.id} className="border-b border-[#f0ede6] last:border-0 hover:bg-[#faf9f7]">
                <td className="px-3 py-2.5 font-mono text-[#999]">{op.seq}</td>
                <td className="px-3 py-2.5 font-medium text-[#151714]">{op.name}</td>
                <td className="px-3 py-2.5 text-[#666]">{op.wc}</td>
                <td className="px-3 py-2.5 text-[#666]">{op.machine}</td>
                <td className="px-3 py-2.5 text-[#666]">{op.setup}</td>
                <td className="px-3 py-2.5 text-[#666]">{op.run}</td>
                <td className="px-3 py-2.5 text-[#666]">{op.labor}</td>
                <td className="px-3 py-2.5 text-[#666] max-w-[160px] truncate">{op.instructions}</td>
                <td className="px-3 py-2.5">
                  <div className="flex gap-1.5">
                    <button className="text-[#888] hover:text-[#151714]">✏</button>
                    <button onClick={() => setOperations(p => p.filter(x => x.id !== op.id))} className="text-[#e05050] hover:text-[#c0392b]">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex items-center gap-6 rounded-[10px] bg-[#f7f6f2] px-4 py-3 text-[11px]">
        <span className="text-[#666]">Total Operations: <strong className="text-[#151714]">{operations.length}</strong></span>
        <span className="text-[#666]">Total Setup Time: <strong className="text-[#151714]">75 min</strong></span>
        <span className="text-[#666]">Total Run Time: <strong className="text-[#151714]">7 hr</strong></span>
        <span className="text-[#666]">Total Labor Time: <strong className="text-[#151714]">4.5 hr</strong></span>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setOperations(p => [...p, { id: Date.now(), seq: (p.length + 1) * 10, name: "", wc: "", machine: "", setup: "", run: "", labor: "", instructions: "" }])}
          className="rounded-[10px] border border-[#e4e2dc] bg-white px-4 py-2 text-[11px] font-medium text-[#555] hover:bg-[#f7f6f2] transition">
          + Add Operation
        </button>
      </div>
    </div>
  );

  // ── Section: Costing & Review ──────────────────────────────────────────────
  const renderCosting = () => (
    <div className="space-y-4">
      {/* Inventory & Quality */}
      <div>
        <SecTitle n="4" title="Inventory & Quality" />
        <div className="grid grid-cols-4 gap-3 mb-3">
          <F label="Raw Material Warehouse" required>
            <Sel value={form.rawWarehouse} onChange={e => set("rawWarehouse", e.target.value)} options={["Main Warehouse","Secondary Store","Vendor Store"]} />
          </F>
          <F label="Component Store">
            <Sel value={form.componentStore} onChange={e => set("componentStore", e.target.value)} options={["Raw Material Store","Component Rack","Staging Area"]} />
          </F>
          <F label="Finished Goods Warehouse" required>
            <Sel value={form.fgWarehouse} onChange={e => set("fgWarehouse", e.target.value)} options={["Finished Goods Store","Dispatch Bay","Export Zone"]} />
          </F>
          <F label="Backflush Material" required>
            <Sel value={form.backflush} onChange={e => set("backflush", e.target.value)} options={["Yes","No"]} />
          </F>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <F label="Inspection Required">
            <Sel value={form.inspectionRequired} onChange={e => set("inspectionRequired", e.target.value)} options={["Yes","No"]} />
          </F>
          <F label="Inspection Operation">
            <Sel value={form.inspectionOp} onChange={e => set("inspectionOp", e.target.value)} options={["Quality Inspection","Visual Check","Dimensional Check"]} />
          </F>
          <F label="Quality Specification">
            <Inp value={form.qualitySpec} onChange={e => set("qualitySpec", e.target.value)} />
          </F>
          <F label="Minimum Quality Level">
            <Sel value={form.minQuality} onChange={e => set("minQuality", e.target.value)} options={["A Grade","B Grade","C Grade","Reject"]} />
          </F>
        </div>
      </div>

      {/* Attachments */}
      <div>
        <SecTitle n="5" title="Attachments" />
        <div className="flex gap-4">
          {/* Drop zone */}
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-[#e4e2dc] bg-[#f7f6f2] px-8 py-6 hover:border-[#151714] transition w-64">
            <span className="text-2xl text-[#ccc]">☁</span>
            <span className="text-[11px] text-[#999] text-center">Drag and drop files here<br/>or</span>
            <span className="rounded-[8px] border border-[#e4e2dc] bg-white px-4 py-1.5 text-[11px] font-medium text-[#555]">Browse Files</span>
            <span className="text-[9px] text-[#bbb]">Allowed formats: PDF, JPG, PNG, DWG (Max 10MB each)</span>
            <input type="file" multiple className="hidden" onChange={e => {
              const newFiles = Array.from(e.target.files).map(f => ({ name: f.name, size: `${(f.size / 1024 / 1024).toFixed(1)} MB` }));
              setFiles(p => [...p, ...newFiles]);
            }} />
          </label>

          {/* Uploaded files */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] text-[#999]">Uploaded Files ({files.length})</span>
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 rounded-[10px] border border-[#e4e2dc] bg-white px-3 py-2.5">
                <span className="text-[16px]">📄</span>
                <div>
                  <p className="text-[11px] font-medium text-[#151714]">{f.name}</p>
                  <p className="text-[10px] text-[#999]">{f.size}</p>
                </div>
                <button onClick={() => setFiles(p => p.filter((_, j) => j !== i))} className="ml-auto text-[#e05050] text-[12px] hover:text-[#c0392b]">🗑</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <SecTitle n="6" title="Notes" />
        <F label="BOM Notes">
          <div className="relative">
            <textarea rows={4} value={form.notes} onChange={e => set("notes", e.target.value)}
              maxLength={500}
              className="w-full rounded-[9px] border border-[#e4e2dc] bg-white px-3 py-2 text-[12px] text-[#151714] outline-none focus:border-[#151714] transition resize-none" />
            <span className="absolute bottom-2 right-3 text-[10px] text-[#bbb]">{form.notes.length}/500</span>
          </div>
        </F>
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="flex max-h-[94vh] w-full max-w-[980px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ── Header ── */}
        <div className="flex items-start justify-between border-b border-[#ece9e2] px-6 py-4 flex-shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-[#151714]">{mode === "edit" ? "Edit Bill of Materials" : "New Bill of Materials"}</h2>
            <p className="mt-0.5 text-[11px] text-[#999]">{mode === "edit" ? "Update all BOM information" : "Create a new BOM for your product"}</p>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#e4e2dc] bg-[#f7f6f2] text-[13px] text-[#777] hover:bg-[#ece9e2] transition">✕</button>
        </div>

        {/* ── Step indicator ── */}
        <div className="flex items-center border-b border-[#ece9e2] px-6 py-3 flex-shrink-0 bg-[#faf9f7]">
          {STEPS.map((s, i) => {
            const n = i + 1;
            const active = step === n;
            const done   = step > n;
            return (
              <React.Fragment key={n}>
                <button onClick={() => setStep(n)} className="flex items-center gap-2 group">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition
                    ${active ? "bg-[#151714] text-white" : done ? "bg-[#4ade80] text-white" : "bg-[#e4e2dc] text-[#999]"}`}>
                    {done ? "✓" : n}
                  </span>
                  <span className={`text-[11px] font-medium transition ${active ? "text-[#151714]" : "text-[#999] group-hover:text-[#555]"}`}>{s}</span>
                </button>
                {i < STEPS.length - 1 && <div className="mx-4 h-px flex-1 bg-[#e4e2dc]" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Body — scrollable content + sticky summary ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Main content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {step === 1 && renderBasic()}
            {step === 2 && renderComponents()}
            {step === 3 && renderOperations()}
            {step === 4 && renderCosting()}
          </div>

          {/* ── Sticky right summary panel ── */}
          <aside className="w-[220px] flex-shrink-0 overflow-y-auto border-l border-[#ece9e2] bg-[#faf9f7] px-4 py-5 space-y-5">

            {/* BOM Summary */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-[13px]">📋</span>
                <span className="text-[12px] font-semibold text-[#151714]">BOM Summary</span>
              </div>
              <div className="space-y-2 text-[11px]">
                {[
                  { l: "BOM Number",  v: form.bomNumber },
                  { l: "Product",     v: form.bomName },
                  { l: "Version",     v: form.version },
                  { l: "Status",      v: form.status, badge: true },
                  { l: "Effective From", v: form.effectiveFrom ? new Date(form.effectiveFrom).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : "—" },
                  { l: "Components",  v: components.length },
                  { l: "Operations",  v: operations.length },
                ].map(({ l, v, badge }) => (
                  <div key={l} className="flex justify-between items-center border-b border-[#ede9e2] pb-1.5 last:border-0">
                    <span className="text-[#999]">{l}</span>
                    {badge
                      ? <span className="rounded-md bg-[#dbeafe] px-2 py-0.5 text-[10px] font-medium text-[#1d4ed8]">{v}</span>
                      : <span className="font-medium text-[#151714] text-right">{v || "—"}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Summary */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-[13px]">💰</span>
                <span className="text-[12px] font-semibold text-[#151714]">Cost Summary</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                {[
                  { l: "Material Cost", v: `₹${materialCost.toLocaleString("en-IN",{minimumFractionDigits:2})}` },
                  { l: "Labor Cost",    v: `₹${laborCost.toLocaleString("en-IN",{minimumFractionDigits:2})}` },
                  { l: "Machine Cost",  v: `₹${machineCost.toLocaleString("en-IN",{minimumFractionDigits:2})}` },
                  { l: "Overhead",      v: `₹${overhead.toLocaleString("en-IN",{minimumFractionDigits:2})}` },
                  { l: "Scrap Cost",    v: `₹${scrapCost.toFixed(2)}` },
                ].map(({ l, v }) => (
                  <div key={l} className="flex justify-between border-b border-[#ede9e2] pb-1.5 last:border-0">
                    <span className="text-[#999]">{l}</span>
                    <span className="font-medium text-[#151714]">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-[#151714]">Total Cost</span>
                  <span className="font-bold text-green-700 text-[12px]">₹{totalCost.toLocaleString("en-IN",{minimumFractionDigits:2})}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#999]">Cost Per Unit</span>
                  <span className="font-semibold text-[#151714]">₹{totalCost.toLocaleString("en-IN",{minimumFractionDigits:2})}</span>
                </div>
              </div>
            </div>

            {/* Approval */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-[13px]">✅</span>
                <span className="text-[12px] font-semibold text-[#151714]">Approval Information</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                {["Approval Status","Submitted By","Submittal Date","Approved By","Approval Date","Rejection Reason"].map(l => (
                  <div key={l} className="flex justify-between border-b border-[#ede9e2] pb-1.5 last:border-0">
                    <span className="text-[#999]">{l}</span>
                    <span className="text-[#ccc]">—</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[13px]">💡</span>
                <span className="text-[12px] font-semibold text-[#151714]">Quick Tips</span>
              </div>
              <ul className="space-y-1.5 text-[10px] text-[#777]">
                <li>• Add all components required to manufacture the product.</li>
                <li>• Define operations in correct sequence.</li>
                <li>• Costs will be calculated automatically.</li>
                <li>• Submit for <span className="text-[#3b82f6]">approval</span> after review.</li>
              </ul>
            </div>
          </aside>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between border-t border-[#ece9e2] px-6 py-3.5 flex-shrink-0 bg-white">
          <div className="flex gap-2">
            {step > 1 && (
              <button onClick={() => setStep(p => p - 1)}
                className="rounded-[10px] border border-[#e4e2dc] bg-white px-4 py-2 text-[12px] font-medium text-[#555] hover:bg-[#f7f6f2] transition">
                ← Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className="rounded-[10px] border border-[#e4e2dc] bg-white px-4 py-2 text-[12px] font-medium text-[#555] hover:bg-[#f7f6f2] transition">
              Cancel
            </button>
            <button onClick={() => submit(true)}
              className="rounded-[10px] border border-[#e4e2dc] bg-[#f7f6f2] px-4 py-2 text-[12px] font-medium text-[#555] hover:bg-[#ece9e2] transition">
              {mode === "edit" ? "Save Changes" : "Save as Draft"}
            </button>
            {step < 4
              ? <button onClick={() => setStep(p => p + 1)}
                  className="rounded-[10px] bg-[#151714] px-5 py-2 text-[12px] font-medium text-white hover:bg-[#2a2c28] transition">
                  Next →
                </button>
              : <button onClick={() => submit(false)}
                  className="rounded-[10px] bg-[#1d4ed8] px-5 py-2 text-[12px] font-medium text-white hover:bg-[#1e40af] transition">
                  {mode === "edit" ? "Save Changes" : "Submit for Approval"}
                </button>
            }
          </div>
        </div>

      </div>
    </div>
  );
}

function BomDetailsModal({ bomId, onClose, onEdit }) {
  const [bom, setBom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const res = await ManufacturingService.getBomById(bomId);
        setBom(res.data);
      } catch (err) {
        console.error("Error loading BOM details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (bomId) loadDetails();
  }, [bomId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#ece9e2] pb-3">
          <div>
            <span className="font-mono text-[10px] text-[#999]">{bom?.bomNumber}</span>
            <h2 className="font-serif text-[19px] font-bold text-[#151714]">
              {bom?.product || "BOM Breakdown"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#e4e2dc] bg-[#f7f6f2] text-[13px] text-[#777] hover:bg-[#ece9e2]"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center font-mono text-xs text-[#999]">
            Loading BOM breakdown...
          </div>
        ) : !bom ? (
          <div className="py-12 text-center font-mono text-xs text-red-500">
            Failed to load BOM breakdown.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-3 rounded-[12px] bg-[#f7f6f2] p-3 text-[11px]">
              <div>
                <span className="text-[#888]">Version:</span>{" "}
                <span className="font-mono font-medium text-[#151714]">{bom.version}</span>
              </div>
              <div>
                <span className="text-[#888]">Total Components:</span>{" "}
                <span className="font-medium text-[#151714]">{bom.components || bom.items?.length || 0}</span>
              </div>
              <div>
                <span className="text-[#888]">Total Unit Cost:</span>{" "}
                <span className="font-mono font-bold text-green-700">
                  {bom.formattedCost || `₹${Number(bom.cost || 0).toLocaleString("en-IN")}`}
                </span>
              </div>
            </div>

            {bom.notes && (
              <div className="rounded-[10px] border border-[#e4e2dc] bg-[#faf9f7] p-3 text-[11px]">
                <span className="font-semibold text-[#555]">Notes:</span>
                <p className="mt-1 whitespace-pre-wrap text-[#666]">{bom.notes}</p>
              </div>
            )}

            {bom.details && (
              <div className="rounded-[10px] border border-[#e4e2dc] bg-white p-3 text-[11px]">
                <h3 className="mb-3 font-mono text-[10px] font-semibold tracking-wider text-[#999]">BOM INFORMATION</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                  {Object.entries(bom.details)
                    .filter(([key, value]) => !["components", "operations", "files", "id", "savedAs"].includes(key) && value !== null && value !== "")
                    .map(([key, value]) => (
                      <div key={key} className="min-w-0 border-b border-[#f0eee8] pb-1.5">
                        <div className="text-[9px] uppercase tracking-wide text-[#999]">{key.replace(/([A-Z])/g, " $1")}</div>
                        <div className="truncate font-medium text-[#151714]">{String(value)}</div>
                      </div>
                    ))}
                </div>
                {["operations", "files"].map((section) => (
                  <div key={section} className="mt-4">
                    <div className="mb-1 text-[9px] uppercase tracking-wide text-[#999]">{section}</div>
                    <pre className="max-h-[180px] overflow-auto whitespace-pre-wrap rounded-md bg-[#faf9f7] p-2 text-[10px] text-[#555]">
                      {JSON.stringify(bom.details[section] || [], null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h3 className="mb-2 font-mono text-[10px] font-semibold tracking-wider text-[#999]">
                COMPONENT BREAKDOWN (EXPLODED VIEW)
              </h3>
              <div className="max-h-[260px] overflow-y-auto rounded-[12px] border border-[#e4e2dc]">
                <table className="w-full text-left text-[11px]">
                  <thead className="border-b border-[#e4e2dc] bg-[#f5f4f0]">
                    <tr>
                      <th className="px-4 py-2 font-mono text-[9px] text-[#888]">#</th>
                      <th className="px-4 py-2 font-mono text-[9px] text-[#888]">DESCRIPTION</th>
                      <th className="px-4 py-2 font-mono text-[9px] text-[#888]">QTY</th>
                      <th className="px-4 py-2 font-mono text-[9px] text-[#888]">UNIT COST</th>
                      <th className="px-4 py-2 font-mono text-[9px] text-[#888]">LINE TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0eee8]">
                    {(!bom.items || bom.items.length === 0) ? (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-[#999]">
                          No component line items found.
                        </td>
                      </tr>
                    ) : (
                      bom.items.map((item, i) => (
                        <tr key={item.id || i} className="hover:bg-[#fbfaf8]">
                          <td className="px-4 py-2 text-[#999]">{i + 1}</td>
                          <td className="px-4 py-2 font-medium text-[#151714]">{item.description}</td>
                          <td className="px-4 py-2 font-mono text-[#555]">{item.quantity}</td>
                          <td className="px-4 py-2 font-mono text-[#555]">₹{Number(item.unitCost || 0).toLocaleString("en-IN")}</td>
                          <td className="px-4 py-2 font-mono font-medium text-[#151714]">
                            ₹{Number(item.lineTotal || (item.quantity * item.unitCost) || 0).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#ece9e2]">
              <button
                type="button"
                onClick={onClose}
                className="rounded-[10px] border border-[#e4e2dc] bg-white px-4 py-2 font-mono text-[11px] text-[#555] hover:bg-[#f7f6f2]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(bom);
                }}
                className="rounded-[10px] bg-[#151714] px-4 py-2 font-mono text-[11px] text-white hover:bg-[#2b2d28]"
              >
                Edit BOM Info
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EditBomModal({ bom, onClose, onSave }) {
  return (
    <NewBOMModal
      mode="edit"
      onClose={onClose}
      initialData={{ ...(bom?.details || {}), bomNumber: bom?.bomNumber, product: bom?.product, version: bom?.version, notes: bom?.notes || "" }}
      onSubmit={async (data) => {
        await ManufacturingService.updateBom(bom.id, {
          product: data.product,
          version: data.version,
          notes: data.notes,
          details: { ...data, id: undefined },
        });
        onSave();
      }}
    />
  );
}

const BillOfMaterials = () => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBomId, setSelectedBomId] = useState(null);
  const [editingBom, setEditingBom] = useState(null);

  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoms();
  }, []);
  
  const fetchBoms = async () => {
    try {
      setLoading(true);
      const response = await ManufacturingService.getBoms();
      setBoms(response.data || []);
    } catch (error) {
      console.error("Error fetching BOMs:", error);
      setBoms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBom = async (bom) => {
    if (!window.confirm(`Delete BOM ${bom.bomNumber} (${bom.product})?`)) return;
    try {
      await ManufacturingService.deleteBom(bom.id);
      setBoms((prev) => prev.filter((b) => b.id !== bom.id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete BOM.");
    }
  };

  const handleEditBom = async (bom) => {
    try {
      const response = await ManufacturingService.getBomById(bom.id);
      setEditingBom(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load BOM for editing.");
    }
  };

  return (
    <main className="bg-[#f7f6f2] px-4 py-4 text-[#171815] sm:px-6 sm:py-[18px] lg:px-[30px]">
      {/* BOM Container */}
      <section className="overflow-hidden rounded-[18px] border border-[#e4e2dd] bg-white sm:rounded-[20px]">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-[#e4e2dd] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-[19px]">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-[19px] leading-none tracking-[-0.015em] text-[#171815] sm:text-[20px]">
              Bill of Materials
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="w-full rounded-[15px] bg-[#151714] px-[18px] py-[11px] font-mono text-[11px] leading-none text-white transition-all duration-200 hover:bg-[#292b27] hover:shadow-sm sm:w-auto"
          >
            + New BOM
          </button>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[980px]">
            {/* Table Header */}
            <div className="grid grid-cols-[120px_280px_90px_100px_100px_130px_1fr] border-b border-[#e4e2dd] bg-[#f5f4f0] px-6 py-[8px]">
              <div className="font-mono text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                BOM #
              </div>
              <div className="font-mono text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                PRODUCT
              </div>
              <div className="font-mono text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                VERSION
              </div>
              <div className="font-mono text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                COMPONENTS
              </div>
              <div className="font-mono text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                UNIT COST
              </div>
              <div className="font-mono text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                LAST UPDATED
              </div>
              <div className="font-mono text-[9px] font-medium tracking-[0.1em] text-[#9b9b95] text-right">
                ACTIONS
              </div>
            </div>

            {loading ? (
              <div className="px-6 py-10 text-center font-mono text-[11px] text-[#999]">
                Loading BOMs...
              </div>
            ) : boms.length === 0 ? (
              <div className="px-6 py-10 text-center font-mono text-[11px] text-[#999]">
                No bills of materials found.
              </div>
            ) : (
              boms.map((bom) => (
                <div
                  key={bom.id || bom.bomNumber}
                  onMouseEnter={() => setHoveredRow(bom.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className="grid grid-cols-[120px_280px_90px_100px_100px_130px_1fr] items-center border-b border-[#eeeae3] px-6 py-3 text-[11px] last:border-0 hover:bg-[#faf9f7]"
                >
                  <div className="font-mono font-medium text-[#151714]">{bom.bomNumber || "-"}</div>
                  <div className="truncate pr-4 font-medium text-[#151714]">{bom.product || "-"}</div>
                  <div className="font-mono text-[#666]">{bom.version || "-"}</div>
                  <div className="text-[#666]">{bom.components ?? bom.items?.length ?? 0}</div>
                  <div className="font-mono text-[#151714]">
                    {bom.formattedCost || `₹${Number(bom.cost ?? bom.totalCost ?? 0).toLocaleString("en-IN")}`}
                  </div>
                  <div className="text-[#666]">
                    {bom.updatedAt ? new Date(bom.updatedAt).toLocaleDateString("en-GB") : "-"}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBomId(bom.id)}
                      className="rounded-md border border-[#e4e2dc] px-2 py-1 text-[#555] hover:bg-[#f0eee8]"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditBom(bom)}
                      className="rounded-md border border-[#e4e2dc] px-2 py-1 text-[#555] hover:bg-[#f0eee8]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBom(bom)}
                      className={`rounded-md border border-[#f1c7c2] px-2 py-1 text-[#c0392b] hover:bg-[#fff3f1] ${hoveredRow === bom.id ? "opacity-100" : "opacity-70"}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>
      </section>

      {/* Explode / View Details Modal */}
      {selectedBomId && (
        <BomDetailsModal
          bomId={selectedBomId}
          onClose={() => setSelectedBomId(null)}
          onEdit={(bom) => setEditingBom(bom)}
        />
      )}

      {/* Edit BOM Modal */}
      {editingBom && (
        <EditBomModal
          bom={editingBom}
          onClose={() => setEditingBom(null)}
          onSave={() => {
            setEditingBom(null);
            fetchBoms();
          }}
        />
      )}

      {/* New BOM Modal */}
      {showModal && (
        <NewBOMModal
          onClose={() => setShowModal(false)}
          onSubmit={async (data) => {
            try {
              const payload = {
                product: data.product,
                version: data.version,
                notes: data.notes,
                details: { ...data, id: undefined },
                items: data.components.map((component) => ({
                  productId: null,
                  description: component.name,
                  quantity: Number(component.qty),
                  unitCost: Number(component.unitCost),
                })),
              };

              await ManufacturingService.createBom(payload);
              setShowModal(false);
              await fetchBoms();
            } catch (error) {
              console.error("Error creating BOM:", error);
              alert(error.response?.data?.message || "Failed to create BOM.");
            }
          }}
        />
      )}
    </main>
  );
};

export default BillOfMaterials;