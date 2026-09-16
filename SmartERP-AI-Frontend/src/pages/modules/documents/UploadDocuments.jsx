import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/slices/auth.store";
import { ROUTES } from "../../../core/constants/routes.constant";
import DocumentsService from "../../../core/services/modules/documents.service";
import "./documents.css";

const DOC_TYPES = [
  "Vendor Invoice", "Sales Order", "Contract", "HR Document",
  "Tax Document", "Report", "Purchase Order", "Delivery Note",
  "Credit Note", "Debit Note", "Legal Agreement", "Other",
];

const CATEGORIES = [
  "Finance", "HR", "Legal", "Operations", "Sales",
  "Purchase", "Compliance", "IT", "General",
];

export default function UploadDocuments() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const fileRef = useRef();

  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("Vendor Invoice");
  const [category, setCategory] = useState("Finance");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [ocrEnabled, setOcrEnabled] = useState(true);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (files) => {
    const f = files[0];
    if (!f) return;
    if (f.size > 25 * 1024 * 1024) {
      setError("File exceeds 25 MB limit.");
      return;
    }
    setError(null);
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(false);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name);
      formData.append("type", docType);
      formData.append("category", category);
      if (description) formData.append("description", description);
      if (tags) formData.append("tags", tags);
      formData.append("ocrEnabled", ocrEnabled);

      await DocumentsService.create(formData);
      setSuccess(true);
      setTimeout(() => {
        const dashboardRoute = user?.role === "superAdmin"
          ? ROUTES.SUPER_ADMIN_DOCUMENTS
          : ROUTES.ADMIN_DOCUMENTS;
        navigate(dashboardRoute);
      }, 1200);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="documents-page">
      <div className="doc-title-row">
        <div>
          <div className="doc-eyebrow">DOCUMENTS</div>
          <h1>Upload Documents</h1>
          <p>Securely upload and index new documents with automated OCR metadata extraction.</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, background: "#fff", border: "1px solid #d5d2ca", borderRadius: 4, padding: 24, marginTop: 16 }}>
        {error && (
          <div style={{ background: "#fdf2f2", color: "#d9534f", padding: "10px 14px", borderRadius: 4, marginBottom: 16, fontSize: 13 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: "#f0f9eb", color: "#52c41a", padding: "10px 14px", borderRadius: 4, marginBottom: 16, fontSize: 13 }}>
            ✓ Document uploaded successfully! Redirecting to Dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Dropzone */}
          <div
            className={`ndoc-dropzone ${dragging ? "ndoc-dropzone--drag" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFileChange(e.dataTransfer.files); }}
            onClick={() => fileRef.current?.click()}
            style={{
              border: "2px dashed #d5d2ca",
              borderRadius: 4,
              padding: 32,
              textAlign: "center",
              cursor: "pointer",
              background: "#faf9f6",
              marginBottom: 20
            }}
          >
            <input
              ref={fileRef}
              type="file"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e.target.files)}
            />
            <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#11130f", margin: "0 0 4px" }}>
              {file ? file.name : "Drag & drop file here, or click to browse"}
            </p>
            <p style={{ fontSize: 12, color: "#53605e", margin: 0 }}>
              {file ? `${(file.size / 1024).toFixed(0)} KB` : "Supports PDF, DOCX, XLSX, PNG, JPG, TXT up to 25 MB"}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#53605e", marginBottom: 4 }}>
                DOCUMENT TITLE *
              </label>
              <input
                className="doc-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Tata Steel August Invoice"
                required
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#53605e", marginBottom: 4 }}>
                DOCUMENT TYPE *
              </label>
              <select
                className="doc-select"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                required
              >
                {DOC_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#53605e", marginBottom: 4 }}>
                CATEGORY
              </label>
              <select
                className="doc-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#53605e", marginBottom: 4 }}>
                TAGS (comma-separated)
              </label>
              <input
                className="doc-input"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. steel, invoice, august"
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#53605e", marginBottom: 4 }}>
              DESCRIPTION
            </label>
            <textarea
              className="doc-input"
              rows={3}
              style={{ height: "auto", padding: "8px 10px" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add optional notes or descriptions..."
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <input
              type="checkbox"
              id="ocrCheckbox"
              checked={ocrEnabled}
              onChange={(e) => setOcrEnabled(e.target.checked)}
            />
            <label htmlFor="ocrCheckbox" style={{ fontSize: 13, color: "#11130f", cursor: "pointer" }}>
              Enable Automated OCR field extraction & GL matching
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              type="button"
              className="doc-btn doc-btn-light"
              onClick={() => navigate(-1)}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="doc-btn doc-btn-dark"
              disabled={uploading}
            >
              {uploading ? "Uploading Document..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}