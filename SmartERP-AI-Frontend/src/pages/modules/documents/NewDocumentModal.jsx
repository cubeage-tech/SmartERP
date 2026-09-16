import { useState, useRef, useEffect } from "react";
import useAuthStore from "../../../store/slices/auth.store";
import DocumentsService from "../../../core/services/modules/documents.service";
import "./documents.css";

/* ================================================================
   CONSTANTS
================================================================ */
const DOC_TYPES = [
  "Vendor Invoice", "Sales Order", "Contract", "HR Document",
  "Tax Document", "Report", "Purchase Order", "Delivery Note",
  "Credit Note", "Debit Note", "Legal Agreement", "Other",
];

const CATEGORIES = [
  "Finance", "HR", "Legal", "Operations", "Sales",
  "Purchase", "Compliance", "IT", "General",
];

const SUB_CATEGORIES = {
  Finance:    ["Invoice", "Receipt", "Budget", "Audit Report"],
  HR:         ["Offer Letter", "Contract", "Policy", "Appraisal"],
  Legal:      ["Agreement", "NDA", "License", "MOU"],
  Operations: ["SOP", "Work Order", "Delivery Note", "Inspection"],
  Sales:      ["Quotation", "Sales Order", "Invoice", "Agreement"],
  Purchase:   ["Purchase Order", "Vendor Invoice", "GRN", "Bill"],
  Compliance: ["License", "Certificate", "Filing", "Report"],
  IT:         ["Software License", "Asset Register", "Policy"],
  General:    ["Memo", "Circular", "Notice", "Other"],
};

const MODULES    = ["Finance", "HR", "Sales", "Purchase", "Projects", "CRM", "Inventory", "Manufacturing"];
const COMPANIES  = ["ABC Manufacturing Pvt Ltd", "XYZ Corp", "SmartERP Solutions"];
const BRANCHES   = ["Pune Branch", "Mumbai Branch", "Delhi Branch", "Bangalore Branch"];
const DEPARTMENTS= ["Finance", "HR", "IT", "Sales", "Operations", "Admin", "Legal"];
const VENDORS    = ["Tata Steel Ltd", "Infosys BPO", "Hero MotoCorp", "Bajaj Auto", "Reliance Industries", "Customer: Alpha Tech", "Customer: Zenith Global"];
const EMPLOYEES  = ["Rohit Sharma", "Neha Verma", "Amit Patel", "Priya Singh", "Rahul Joshi"];
const APPROVERS  = ["Amit Sharma", "Neha Verma", "Rahul Patil", "Sneha Shah"];
const WORKFLOWS  = ["Standard Approval", "Finance Approval", "Legal Review", "HR Approval", "Two-Step Approval"];
const ACCESS     = ["Public", "Private", "Restricted", "Department Only", "Management Only"];
const OCR_LANGS  = ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Gujarati", "Mixed"];
const OCR_TMPLS  = ["Vendor Invoice", "Purchase Order", "Sales Order", "HR Document", "Generic"];

/* ================================================================
   HELPERS
================================================================ */
const Field = ({ label, required, children, className = "" }) => (
  <div className={`doc-field ${className}`}>
    <label className="doc-field-label">
      {label}{required && <span className="doc-required">*</span>}
    </label>
    {children}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input className={`doc-input ${className}`} {...props} />
);

const Sel = ({ children, className = "", ...props }) => (
  <div className="doc-select-wrap">
    <select className={`doc-select ${className}`} {...props}>{children}</select>
    <svg className="doc-select-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const DatePick = ({ value, onChange, placeholder }) => (
  <div className="doc-date-wrap">
    <input
      type="date"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="doc-input doc-date-input"
    />
    <svg className="doc-date-icon" width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  </div>
);

const Toggle = ({ checked, onChange, label }) => (
  <label className="doc-toggle-row">
    <div
      onClick={() => onChange(!checked)}
      className={`doc-toggle ${checked ? "doc-toggle--on" : ""}`}
    >
      <div className="doc-toggle-knob" />
    </div>
    {label && <span className="doc-toggle-label">{label}</span>}
  </label>
);

const SectionBlock = ({ number, title, children }) => (
  <div className="ndoc-section" style={{ flexShrink: 0, width: "100%", minHeight: "min-content", overflow: "visible" }}>
    <div className="ndoc-section-head">
      <span className="ndoc-section-num">{number}.</span>
      <span className="ndoc-section-title">{title}</span>
    </div>
    <div className="ndoc-section-body" style={{ display: "block", height: "auto", minHeight: "min-content", overflow: "visible" }}>
      {children}
    </div>
  </div>
);

/* ================================================================
   MODAL COMPONENT
================================================================ */
const NewDocumentModal = ({ open, onClose, onSuccess, editDocument = null }) => {
  const { user } = useAuthStore();
  const uploadedByName = user?.name || "Current User";
  const isEdit = Boolean(editDocument);

  /* ---- Section 1 State ---- */
  const [title,          setTitle]          = useState("");
  const [docType,        setDocType]        = useState("");
  const [docNumber,      setDocNumber]      = useState("");
  const [docDate,        setDocDate]        = useState("");
  const [effectiveDate,  setEffectiveDate]  = useState("");
  const [expiryDate,     setExpiryDate]     = useState("");
  const [description,    setDescription]    = useState("");

  /* ---- Section 2 State ---- */
  const [file,           setFile]           = useState(null);
  const [dragging,       setDragging]       = useState(false);
  const [version,        setVersion]        = useState("1.0");

  /* ---- Section 3 State ---- */
  const [category,       setCategory]       = useState("");
  const [subCategory,    setSubCategory]    = useState("");
  const [tags,           setTags]           = useState([]);
  const [tagInput,       setTagInput]       = useState("");
  const [company,        setCompany]        = useState("");
  const [branch,         setBranch]         = useState("");
  const [department,     setDepartment]     = useState("");

  /* ---- Section 4 State ---- */
  const [relatedModule,  setRelatedModule]  = useState("");
  const [relatedRecord,  setRelatedRecord]  = useState("");
  const [vendor,         setVendor]         = useState("");
  const [docOwner,       setDocOwner]       = useState("");
  const [employee,       setEmployee]       = useState("");

  /* ---- Section 5 State ---- */
  const [enableOcr,      setEnableOcr]      = useState(true);
  const [autoExtract,    setAutoExtract]    = useState(true);
  const [ocrLang,        setOcrLang]        = useState("English");
  const [ocrTemplate,    setOcrTemplate]    = useState("");

  /* ---- Section 6 State ---- */
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [workflow,       setWorkflow]       = useState("");
  const [approver,       setApprover]       = useState("");
  const [accessLevel,    setAccessLevel]    = useState("");
  const [sharedWith,     setSharedWith]     = useState("");

  /* ---- Section 7 State ---- */
  const [confidential,   setConfidential]   = useState(false);
  const [allowDownload,  setAllowDownload]  = useState(true);
  const [allowPrint,     setAllowPrint]     = useState(false);
  const [allowShare,     setAllowShare]     = useState(false);

  /* ---- Section 8 State ---- */
  const [internalNotes,  setInternalNotes]  = useState("");
  const [comments,       setComments]       = useState("");

  /* ---- Action States ---- */
  const [saving,         setSaving]         = useState(false);
  const [error,          setError]          = useState(null);

  const fileRef = useRef();
  const bodyRef = useRef();

  /* reset / prefill on open */
  useEffect(() => {
    if (open) {
      if (editDocument) {
        setTitle(editDocument.title || "");
        const matchedType = DOC_TYPES.find(
          (t) => t.toUpperCase().replace(/\s+/g, "_") === editDocument.type || t === editDocument.type
        ) || editDocument.type || "";
        setDocType(matchedType);
        setDocNumber(editDocument.documentNumber || "");
        setDocDate(editDocument.documentDate || "");
        setEffectiveDate(editDocument.effectiveDate || "");
        setExpiryDate(editDocument.expiryDate || "");
        setDescription(editDocument.description || "");
        setFile(null);
        setVersion(editDocument.currentVersion || "1.0");
        setCategory(editDocument.category || "");
        setSubCategory(editDocument.subCategory || "");
        setTags(editDocument.tags ? editDocument.tags.split(",").map((t) => t.trim()).filter(Boolean) : []);
        setTagInput("");
        setCompany(editDocument.companyName || "");
        setBranch(editDocument.branchName || "");
        setDepartment(editDocument.departmentName || "");
        setRelatedModule(editDocument.relatedModule || "");
        setRelatedRecord(editDocument.relatedRecord || "");
        setVendor(editDocument.vendorName || "");
        setDocOwner(editDocument.documentOwner || "");
        setEmployee(editDocument.employeeName || "");
        setEnableOcr(true);
        setAutoExtract(true);
        setOcrLang("English");
        setOcrTemplate("");
        setApprovalRequired(false);
        setWorkflow("");
        setApprover("");
        setAccessLevel(editDocument.accessLevel || "Public");
        setSharedWith(editDocument.sharedWith || "");
        setConfidential(Boolean(editDocument.confidential));
        setAllowDownload(editDocument.allowDownload !== false);
        setAllowPrint(Boolean(editDocument.allowPrint));
        setAllowShare(Boolean(editDocument.allowShare));
        setInternalNotes(editDocument.internalNotes || "");
        setComments(editDocument.comments || "");
        setError(null);
        setSaving(false);
      } else {
        setTitle(""); setDocType(""); setDocNumber(""); setDocDate("");
        setEffectiveDate(""); setExpiryDate(""); setDescription("");
        setFile(null); setVersion("1.0"); setCategory(""); setSubCategory("");
        setTags([]); setTagInput(""); setCompany(""); setBranch(""); setDepartment("");
        setRelatedModule(""); setRelatedRecord(""); setVendor(""); setDocOwner(""); setEmployee("");
        setEnableOcr(true); setAutoExtract(true); setOcrLang("English"); setOcrTemplate("");
        setApprovalRequired(false); setWorkflow(""); setApprover(""); setAccessLevel(""); setSharedWith("");
        setConfidential(false); setAllowDownload(true); setAllowPrint(false); setAllowShare(false);
        setInternalNotes(""); setComments(""); setError(null); setSaving(false);
      }
    }
  }, [open, editDocument]);

  /* escape key */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, saving]);

  if (!open) return null;

  /* file handling */
  const handleFiles = (files) => {
    const f = Array.from(files)[0];
    if (!f) return;
    if (f.size > 25 * 1024 * 1024) {
      setError("File exceeds 25 MB limit");
      return;
    }
    setError(null);
    setFile({
      name: f.name,
      type: f.type || f.name.split(".").pop().toUpperCase(),
      size: (f.size / 1024).toFixed(0) + " KB",
      raw: f
    });
    if (!title) {
      setTitle(f.name.replace(/\.[^/.]+$/, ""));
    }
  };

  /* tag handling */
  const addTag = (v) => {
    const t = v.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  const handleSubmit = async (isDraft = false) => {
    if (isEdit) {
      if (!title) {
        setError("Please enter a document title.");
        return;
      }
      try {
        setSaving(true);
        setError(null);
        const updatePayload = {
          title,
          type: docType ? docType.toUpperCase().replace(/\s+/g, "_") : editDocument.type,
          documentNumber: docNumber || null,
          documentDate: docDate || null,
          effectiveDate: effectiveDate || null,
          expiryDate: expiryDate || null,
          description: description || null,
          category: category || null,
          subCategory: subCategory || null,
          tags: tags.length ? tags.join(",") : null,
          companyName: company || null,
          branchName: branch || null,
          departmentName: department || null,
          relatedModule: relatedModule || null,
          relatedRecord: relatedRecord || null,
          vendorName: vendor || null,
          employeeName: employee || null,
          documentOwner: docOwner || null,
          accessLevel: accessLevel || "Public",
          sharedWith: sharedWith || null,
          confidential,
          allowDownload,
          allowPrint,
          allowShare,
          internalNotes: internalNotes || null,
          comments: comments || null,
          status: editDocument.status
            ? String(editDocument.status).toUpperCase()
            : undefined,
        };
        await DocumentsService.update(editDocument.id, updatePayload);
        if (file && file.raw) {
          const vFormData = new FormData();
          vFormData.append("file", file.raw);
          vFormData.append("versionNumber", version || "1.1");
          vFormData.append("changeSummary", "Updated file in document editor");
          await DocumentsService.uploadVersion(editDocument.id, vFormData);
        }
        if (onSuccess) onSuccess();
        onClose();
      } catch (err) {
        console.error("Error updating document:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to update document.");
      } finally {
        setSaving(false);
      }
      return;
    }

    if (!file && !title) {
      setError("Please select a file or enter a document title.");
      return;
    }
    if (!docType && !isDraft) {
      setError("Please select a document type.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const formData = new FormData();
      if (file && file.raw) {
        formData.append("file", file.raw);
      } else {
        const dummyBlob = new Blob([description || "Draft document created without binary file."], { type: "text/plain" });
        formData.append("file", dummyBlob, `${title || "document"}.txt`);
      }

      formData.append("title", title || (file ? file.name : "Untitled Document"));
      formData.append("type", docType || "OTHER");
      if (docNumber) formData.append("documentNumber", docNumber);
      if (docDate) formData.append("documentDate", docDate);
      if (effectiveDate) formData.append("effectiveDate", effectiveDate);
      if (expiryDate) formData.append("expiryDate", expiryDate);
      if (description) formData.append("description", description);
      if (category) formData.append("category", category);
      if (subCategory) formData.append("subCategory", subCategory);
      if (tags.length) formData.append("tags", tags.join(","));
      if (company) formData.append("companyName", company);
      if (branch) formData.append("branchName", branch);
      if (department) formData.append("departmentName", department);
      if (relatedModule) formData.append("relatedModule", relatedModule);
      if (relatedRecord) formData.append("relatedRecord", relatedRecord);
      if (vendor) formData.append("vendorName", vendor);
      if (employee) formData.append("employeeName", employee);
      if (docOwner) formData.append("documentOwner", docOwner);
      formData.append("ocrEnabled", enableOcr);
      formData.append("autoExtract", autoExtract);
      if (ocrLang) formData.append("ocrLanguage", ocrLang);
      if (ocrTemplate) formData.append("ocrTemplate", ocrTemplate);
      formData.append("approvalRequired", isDraft ? false : approvalRequired);
      if (workflow) formData.append("workflowName", workflow);
      if (approver) formData.append("approverName", approver);
      if (accessLevel) formData.append("accessLevel", accessLevel);
      if (sharedWith) formData.append("sharedWith", sharedWith);
      formData.append("confidential", confidential);
      formData.append("allowDownload", allowDownload);
      formData.append("allowPrint", allowPrint);
      formData.append("allowShare", allowShare);
      if (internalNotes) formData.append("internalNotes", internalNotes);
      if (comments) formData.append("comments", comments);

      await DocumentsService.create(formData);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Error creating document:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to upload document. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const subCatOptions = SUB_CATEGORIES[category] || [];

  /* ----------------------------------------------------------------
     RENDER
  ---------------------------------------------------------------- */
  return (
    <div
      className="ndoc-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget && !saving) onClose(); }}
    >
      <div className="ndoc-modal" style={{ maxHeight: "90vh", height: "90vh", display: "flex", flexDirection: "column" }}>

        {/* ---- TOP BAR ---- */}
        <div className="ndoc-topbar">
          <div>
            <button className="ndoc-back" onClick={onClose} disabled={saving}>← Back to Documents</button>
            <h2 className="ndoc-title">{isEdit ? "Edit Document" : "New Document"}</h2>
            <p className="ndoc-subtitle">
              {isEdit
                ? (editDocument?.documentNumber ? `Editing Document #${editDocument.documentNumber}` : "Update existing document metadata")
                : "Upload and manage a new document"}
            </p>
          </div>
          <div className="ndoc-topbar-actions">
            {error && <span style={{ color: "#d9534f", fontSize: 13, marginRight: 10 }}>{error}</span>}
            {!isEdit && (
              <button className="ndoc-btn ndoc-btn-outline" onClick={() => handleSubmit(true)} disabled={saving}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M1 13V4.5L7 1l6 3.5V13H9v-4H5v4H1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                </svg>
                {saving ? "Saving..." : "Save Draft"}
              </button>
            )}
            <button className="ndoc-btn ndoc-btn-dark" onClick={() => handleSubmit(false)} disabled={saving}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M7 10V3m0 0L4 6m3-3 3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 11h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {saving ? "Saving..." : (isEdit ? "Save Changes" : "Upload Document")}
            </button>
            <button className="ndoc-close" onClick={onClose} disabled={saving} title="Close">×</button>
          </div>
        </div>

        {/* ---- BODY (SCROLL CONTAINER) ---- */}
        <div className="ndoc-body" ref={bodyRef} style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto" }}>

          {/* ========== 1. DOCUMENT INFORMATION ========== */}
          <SectionBlock number="1" title="DOCUMENT INFORMATION">
            <div className="ndoc-grid-3">
              <Field label="Document Title" required>
                <Input placeholder="Enter document title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </Field>
              <Field label="Document Type" required>
                <Sel value={docType} onChange={(e) => setDocType(e.target.value)}>
                  <option value="">Select document type</option>
                  {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </Sel>
              </Field>
              <Field label="Document Number">
                <Input placeholder="Enter document number (auto if blank)" value={docNumber} onChange={(e) => setDocNumber(e.target.value)} />
              </Field>
            </div>
            <div className="ndoc-grid-3 ndoc-mt">
              <Field label="Document Date">
                <DatePick value={docDate} onChange={(e) => setDocDate(e.target.value)} placeholder="Select date" />
              </Field>
              <Field label="Effective Date">
                <DatePick value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} placeholder="Select date" />
              </Field>
              <Field label="Expiry Date">
                <DatePick value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} placeholder="Select date" />
              </Field>
            </div>
            <div className="ndoc-mt">
              <Field label="Description">
                <textarea
                  className="ndoc-textarea"
                  rows={3}
                  placeholder="Enter a brief description of the document"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ minHeight: "76px", width: "100%" }}
                />
              </Field>
            </div>
          </SectionBlock>

          {/* ========== 2. UPLOAD DOCUMENT ========== */}
          <SectionBlock number="2" title="UPLOAD DOCUMENT">
            <div
              className={`ndoc-dropzone ${dragging ? "ndoc-dropzone--drag" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileRef.current?.click()}
              style={{ minHeight: "110px", padding: "24px 20px" }}
            >
              <input
                ref={fileRef}
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="ndoc-drop-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V8m0 0L8.5 11.5M12 8l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 16.5a4.5 4.5 0 0 0-1.5-8.74A6 6 0 0 0 7 9a4.5 4.5 0 0 0-3 4.24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="ndoc-drop-main">
                Drag and drop files here, or <span className="ndoc-drop-link">browse</span>
              </p>
              <p className="ndoc-drop-sub">PDF, DOCX, XLSX, PNG, JPG, TXT up to 25 MB</p>
            </div>

            {file && (
              <div className="ndoc-file-chip">
                <span className="ndoc-file-chip-type">{file.type}</span>
                <span className="ndoc-file-chip-name">{file.name}</span>
                <span className="ndoc-file-chip-size">{file.size}</span>
                <button
                  type="button"
                  className="ndoc-file-chip-del"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  title="Remove file"
                >
                  ×
                </button>
              </div>
            )}

            <div className="ndoc-grid-3 ndoc-mt">
              <Field label="Version Number">
                <Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0" />
              </Field>
            </div>
          </SectionBlock>

          {/* ========== 3. DOCUMENT CLASSIFICATION ========== */}
          <SectionBlock number="3" title="DOCUMENT CLASSIFICATION">
            <div className="ndoc-grid-3">
              <Field label="Category">
                <Sel value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory(""); }}>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Sel>
              </Field>
              <Field label="Sub Category">
                <Sel value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                  <option value="">Select sub-category</option>
                  {subCatOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </Sel>
              </Field>
              <Field label="Tags">
                <div className="ndoc-tags-box">
                  {tags.map((t) => (
                    <span className="ndoc-tag" key={t}>
                      {t}
                      <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}>×</button>
                    </span>
                  ))}
                  <input
                    className="ndoc-tag-input"
                    placeholder="Add tag + Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); } }}
                  />
                </div>
              </Field>
            </div>
            <div className="ndoc-grid-3 ndoc-mt">
              <Field label="Company">
                <Sel value={company} onChange={(e) => setCompany(e.target.value)}>
                  <option value="">Select company</option>
                  {COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Sel>
              </Field>
              <Field label="Branch">
                <Sel value={branch} onChange={(e) => setBranch(e.target.value)}>
                  <option value="">Select branch</option>
                  {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </Sel>
              </Field>
              <Field label="Department">
                <Sel value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </Sel>
              </Field>
            </div>
          </SectionBlock>

          {/* ========== 4. DOCUMENT ASSOCIATION ========== */}
          <SectionBlock number="4" title="DOCUMENT ASSOCIATION">
            <div className="ndoc-grid-3">
              <Field label="Related Module">
                <Sel value={relatedModule} onChange={(e) => setRelatedModule(e.target.value)}>
                  <option value="">Select module</option>
                  {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
                </Sel>
              </Field>
              <Field label="Related Record">
                <Input placeholder="e.g. PO-2026-001" value={relatedRecord} onChange={(e) => setRelatedRecord(e.target.value)} />
              </Field>
              <Field label="Vendor / Customer">
                <Sel value={vendor} onChange={(e) => setVendor(e.target.value)}>
                  <option value="">Select vendor / customer</option>
                  {VENDORS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Field>
            </div>
            <div className="ndoc-grid-3 ndoc-mt">
              <Field label="Document Owner">
                <Input placeholder="Enter owner name" value={docOwner} onChange={(e) => setDocOwner(e.target.value)} />
              </Field>
              <Field label="Uploaded By">
                <Input value={uploadedByName} readOnly className="ndoc-readonly" />
              </Field>
              <Field label="Employee (Optional)">
                <Sel value={employee} onChange={(e) => setEmployee(e.target.value)}>
                  <option value="">Select employee</option>
                  {EMPLOYEES.map((em) => <option key={em} value={em}>{em}</option>)}
                </Sel>
              </Field>
            </div>
          </SectionBlock>

          {/* ========== 5. AI & OCR PROCESSING ========== */}
          <SectionBlock number="5" title="AI & OCR PROCESSING">
            <div className="ndoc-ocr-row">
              <div className="ndoc-ocr-toggles">
                <Toggle checked={enableOcr}   onChange={setEnableOcr}   label="Enable OCR" />
                <Toggle checked={autoExtract} onChange={setAutoExtract} label="Auto Extract Information" />
              </div>
              <Field label="OCR Language">
                <Sel value={ocrLang} onChange={(e) => setOcrLang(e.target.value)} className={!enableOcr ? "ndoc-disabled" : ""}>
                  {OCR_LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
                </Sel>
              </Field>
              <Field label="OCR Template">
                <Sel value={ocrTemplate} onChange={(e) => setOcrTemplate(e.target.value)} className={!enableOcr ? "ndoc-disabled" : ""}>
                  <option value="">Select template</option>
                  {OCR_TMPLS.map((t) => <option key={t} value={t}>{t}</option>)}
                </Sel>
              </Field>
            </div>
          </SectionBlock>

          {/* ========== 6. APPROVAL & ACCESS ========== */}
          <SectionBlock number="6" title="APPROVAL & ACCESS">
            <div className="ndoc-approval-row">
              <div style={{ paddingTop: 22 }}>
                <Toggle checked={approvalRequired} onChange={setApprovalRequired} label="Approval Required" />
              </div>
              <Field label="Approval Workflow">
                <Sel value={workflow} onChange={(e) => setWorkflow(e.target.value)} className={!approvalRequired ? "ndoc-disabled" : ""}>
                  <option value="">Select workflow</option>
                  {WORKFLOWS.map((w) => <option key={w} value={w}>{w}</option>)}
                </Sel>
              </Field>
              <Field label="Approver">
                <Sel value={approver} onChange={(e) => setApprover(e.target.value)} className={!approvalRequired ? "ndoc-disabled" : ""}>
                  <option value="">Select approver</option>
                  {APPROVERS.map((a) => <option key={a}>{a}</option>)}
                </Sel>
              </Field>
            </div>
            <div className="ndoc-grid-2 ndoc-mt">
              <Field label="Access Level">
                <Sel value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)}>
                  <option value="">Select access level</option>
                  {ACCESS.map((a) => <option key={a}>{a}</option>)}
                </Sel>
              </Field>
              <Field label="Shared With">
                <Input placeholder="Select users or roles" value={sharedWith} onChange={(e) => setSharedWith(e.target.value)} />
              </Field>
            </div>
          </SectionBlock>

          {/* ========== 7. SECURITY & PERMISSIONS ========== */}
          <SectionBlock number="7" title="SECURITY & PERMISSIONS">
            <div className="ndoc-security-row">
              <Toggle checked={confidential}  onChange={setConfidential}  label="Confidential Document" />
              <Toggle checked={allowDownload} onChange={setAllowDownload} label="Allow Download" />
              <Toggle checked={allowPrint}    onChange={setAllowPrint}    label="Allow Printing" />
              <Toggle checked={allowShare}    onChange={setAllowShare}    label="Allow Sharing" />
            </div>
          </SectionBlock>

          {/* ========== 8. NOTES & COMMENTS ========== */}
          <SectionBlock number="8" title="NOTES & COMMENTS">
            <div className="ndoc-grid-2">
              <Field label="Internal Notes">
                <textarea
                  className="ndoc-textarea"
                  rows={4}
                  maxLength={500}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  style={{ minHeight: "84px", width: "100%" }}
                />
                <span className="ndoc-char-count">{internalNotes.length}/500</span>
              </Field>
              <Field label="Comments">
                <textarea
                  className="ndoc-textarea"
                  rows={4}
                  maxLength={500}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add comments..."
                  style={{ minHeight: "84px", width: "100%" }}
                />
                <span className="ndoc-char-count">{comments.length}/500</span>
              </Field>
            </div>
          </SectionBlock>

        </div>{/* end body */}

        {/* ---- FOOTER ---- */}
        <div className="ndoc-footer">
          <button className="ndoc-btn ndoc-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          {!isEdit && (
            <button className="ndoc-btn ndoc-btn-outline" onClick={() => handleSubmit(true)} disabled={saving}>
              {saving ? "Saving..." : "Save Draft"}
            </button>
          )}
          <button className="ndoc-btn ndoc-btn-dark" onClick={() => handleSubmit(false)} disabled={saving}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 10V3m0 0L4 6m3-3 3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 11h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {saving ? "Saving..." : (isEdit ? "Save Changes" : "Upload Document")}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewDocumentModal;
