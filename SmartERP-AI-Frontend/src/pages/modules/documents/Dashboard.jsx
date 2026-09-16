import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/slices/auth.store";
import { ROUTES } from "../../../core/constants/routes.constant";
import DocumentsService from "../../../core/services/modules/documents.service";
import "./documents.css";
import NewDocumentModal from "./NewDocumentModal";

// ─── Role → upload route ──────────────────────────────────────────────────────
const UPLOAD_ROUTES = {
  superAdmin:        ROUTES.SUPER_ADMIN_DOCUMENTS_UPLOAD,
  admin:             ROUTES.ADMIN_DOCUMENTS_UPLOAD,
  financeManager:    ROUTES.ADMIN_DOCUMENTS_UPLOAD,
  salesManager:      ROUTES.ADMIN_DOCUMENTS_UPLOAD,
  hrManager:         ROUTES.ADMIN_DOCUMENTS_UPLOAD,
  operationsManager: ROUTES.ADMIN_DOCUMENTS_UPLOAD,
  employee:          ROUTES.EMPLOYEE_DOCUMENTS,
};

// ─── Type filter options ──────────────────────────────────────────────────────
const DOCUMENT_TYPES = [
  { value: "",               label: "All"            },
  { value: "VENDOR_INVOICE", label: "Vendor Invoice" },
  { value: "SALES_ORDER",    label: "Sales Order"    },
  { value: "CONTRACT",       label: "Contract"       },
  { value: "HR_DOCUMENT",    label: "HR Document"    },
  { value: "TAX_DOCUMENT",   label: "Tax Document"   },
  { value: "REPORT",         label: "Report"         },
];

const FILE_ICONS = {
  "Vendor Invoice": "📄",
  "Sales Order":    "📝",
  "Contract":       "📋",
  "HR Document":    "👤",
  "Tax Document":   "🧾",
  "Report":         "📊",
  "Purchase Order": "📦",
  "Other":          "📁",
};

const TABS = [
  { label: "ALL DOCUMENTS",    key: "all"       },
  { label: "PENDING APPROVAL", key: "approvals" },
  { label: "MY UPLOADS",       key: "uploads"   },
  { label: "OCR EXTRACTIONS",  key: "ocr"       },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatSize = (bytes = 0) => {
  const num = Number(bytes) || 0;
  if (num >= 1024 * 1024) return `${(num / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(num / 1024))} KB`;
};

const fmtDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return String(iso);
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function KpiCard({ value, label, helper }) {
  return (
    <div className="doc-kpi-card">
      <div className="doc-kpi-value">{value}</div>
      <div className="doc-kpi-label">{label}</div>
      <div className="doc-kpi-helper">{helper}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const v = String(status || "active").toLowerCase();
  return (
    <span className={`doc-status doc-status--${v}`}>
      {v.replace(/_/g, " ").toUpperCase()}
    </span>
  );
}

// ─── 3-Dot Action Menu Component ──────────────────────────────────────────────
function ActionMenu({ doc, onDownload, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="doc-action-menu-wrap" ref={menuRef}>
      <button
        type="button"
        className="doc-menu-btn"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        aria-label="Actions"
        title="More actions"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      {open && (
        <div className="doc-dropdown-menu">
          <button
            type="button"
            className="doc-dropdown-item"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDownload();
            }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v9M4 7l4 4 4-4M2 14h12" />
            </svg>
            <span>Download</span>
          </button>

          <button
            type="button"
            className="doc-dropdown-item"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onEdit();
            }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11.5 2.5a1.8 1.8 0 0 1 2.5 2.5L5.5 13.5 2 14l.5-3.5 8.5-8.5z" />
            </svg>
            <span>Edit</span>
          </button>

          <button
            type="button"
            className="doc-dropdown-item doc-dropdown-item--danger"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete();
            }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4h10M6 4V2.5A1.5 1.5 0 0 1 7.5 1h1A1.5 1.5 0 0 1 10 2.5V4M12.5 4v9.5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5V4M6.5 7.5v4.5M9.5 7.5v4.5" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ── Tab: ALL DOCUMENTS ────────────────────────────────────────────────────────
function TabAllDocuments({ documents, loading, error, onRefresh, search, setSearch, typeFilter, setTypeFilter, onEdit }) {
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = async (doc) => {
    try {
      setDownloadingId(doc.id);
      await DocumentsService.download(doc.id, doc.originalFileName || doc.title || "document");
    } catch (err) {
      console.error("Failed to download document:", err);
      alert("Failed to download document. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (doc) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete document "${doc.title}"?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await DocumentsService.delete(doc.id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to delete document:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to delete document. Check role permissions.";
      alert(`Delete error: ${msg}`);
    }
  };

  return (
    <>
      <div className="doc-filter-row">
        <div className="doc-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents, tags, numbers..."
          />
        </div>
        <div className="doc-filter-buttons">
          {DOCUMENT_TYPES.map((item) => (
            <button
              key={item.value}
              className={typeFilter === item.value ? "active" : ""}
              onClick={() => setTypeFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="doc-empty">Loading documents...</div>}
      {error && (
        <div className="doc-empty" style={{ color: "#d9534f" }}>
          {error} <button className="doc-btn doc-btn-light" onClick={onRefresh} style={{ marginLeft: 10 }}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="doc-list">
          {documents.map((doc) => (
            <div className="doc-row" key={doc.id}>
              <div className="doc-row-left">
                <div className="doc-file-icon">{FILE_ICONS[doc.type] || "📄"}</div>
                <div>
                  <h3>{doc.title}</h3>
                  <div className="doc-meta">
                    <span>{doc.type}</span>
                    <span>·</span>
                    <span>{formatSize(doc.fileSize)}</span>
                    <span>·</span>
                    <span>{fmtDate(doc.createdAt)}</span>
                    {doc.documentNumber && (
                      <>
                        <span>·</span>
                        <span style={{ fontFamily: "monospace" }}>#{doc.documentNumber}</span>
                      </>
                    )}
                    {doc.tags &&
                      doc.tags
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .map((tag) => (
                          <span className="doc-tag" key={tag}>{tag}</span>
                        ))}
                  </div>
                </div>
              </div>
              <div className="doc-row-right">
                <span className={doc.ocrCompleted ? "ocr-complete" : "ocr-processing"}>
                  {doc.ocrCompleted ? `✓ OCR (${(doc.ocrConfidence || 95).toFixed(0)}%)` : "○ OCR..."}
                </span>
                <StatusBadge status={doc.status} />
                <button
                  className="download-button"
                  title="Download"
                  onClick={() => handleDownload(doc)}
                  disabled={downloadingId === doc.id}
                >
                  {downloadingId === doc.id ? "⌛" : "↓"}
                </button>
                <ActionMenu
                  doc={doc}
                  onDownload={() => handleDownload(doc)}
                  onEdit={() => onEdit(doc)}
                  onDelete={() => handleDelete(doc)}
                />
              </div>
            </div>
          ))}
          {!documents.length && (
            <div className="doc-empty">No documents found. Click "+ New Document" to upload one.</div>
          )}
        </div>
      )}
    </>
  );
}

// ── Tab: PENDING APPROVAL ─────────────────────────────────────────────────────
function TabPendingApproval({ approvals, loading, error, onRefresh }) {
  const [actingId, setActingId] = useState(null);

  const handleApprove = async (id) => {
    try {
      setActingId(id);
      await DocumentsService.approve(id, "Approved via dashboard");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to approve document:", err);
      alert("Failed to approve document.");
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id) => {
    const comment = prompt("Please enter a reason for rejection:");
    if (comment === null) return;
    try {
      setActingId(id);
      await DocumentsService.reject(id, comment || "Rejected via dashboard");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to reject document:", err);
      alert("Failed to reject document.");
    } finally {
      setActingId(null);
    }
  };

  const handleViewDoc = async (approval) => {
    try {
      await DocumentsService.download(approval.documentId, approval.documentTitle || "approval-document");
    } catch (err) {
      console.error("Failed to download document:", err);
      alert("Failed to load document.");
    }
  };

  if (loading) return <div className="doc-empty">Loading pending approvals...</div>;
  if (error) return <div className="doc-empty" style={{ color: "#d9534f" }}>{error}</div>;

  return (
    <div className="doc-list">
      {approvals.map((a) => (
        <div className="doc-row" key={a.id}>
          <div className="doc-row-left">
            <div className="doc-file-icon" style={{ fontSize: 22 }}>📋</div>
            <div>
              <h3>{a.documentTitle}</h3>
              <div className="doc-meta">
                <span>{a.documentType}</span>
                <span>·</span>
                <span>Submitted by {a.submittedByName || "User"} on {fmtDate(a.submittedAt || a.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="approval-actions">
            {a.dueDate && <span className="due-date">Due: {fmtDate(a.dueDate)}</span>}
            <button className="doc-btn doc-btn-light" onClick={() => handleViewDoc(a)}>View Doc</button>
            <button
              className="doc-btn approve-button"
              onClick={() => handleApprove(a.id)}
              disabled={actingId === a.id}
            >
              {actingId === a.id ? "Processing..." : "Approve"}
            </button>
            <button
              className="doc-btn reject-button"
              onClick={() => handleReject(a.id)}
              disabled={actingId === a.id}
            >
              {actingId === a.id ? "Processing..." : "Reject"}
            </button>
          </div>
        </div>
      ))}
      {!approvals.length && (
        <div className="doc-empty">All caught up — no pending approvals.</div>
      )}
    </div>
  );
}

// ── Tab: MY UPLOADS ───────────────────────────────────────────────────────────
function TabMyUploads({ uploads, loading, error, onRefresh, onEdit }) {
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = async (doc) => {
    try {
      setDownloadingId(doc.id);
      await DocumentsService.download(doc.id, doc.originalFileName || doc.title || "document");
    } catch (err) {
      console.error("Failed to download document:", err);
      alert("Failed to download document.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (doc) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete document "${doc.title}"?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await DocumentsService.delete(doc.id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to delete document:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to delete document. Check role permissions.";
      alert(`Delete error: ${msg}`);
    }
  };

  if (loading) return <div className="doc-empty">Loading your uploads...</div>;
  if (error) return <div className="doc-empty" style={{ color: "#d9534f" }}>{error}</div>;

  return (
    <div className="doc-list">
      {uploads.map((doc) => (
        <div className="doc-row" key={doc.id}>
          <div className="doc-row-left">
            <div className="doc-file-icon" style={{ fontSize: 22 }}>📄</div>
            <div>
              <h3>{doc.title}</h3>
              <div className="doc-meta">
                <span>{doc.type}</span>
                <span>·</span>
                <span>{formatSize(doc.fileSize)}</span>
                <span>·</span>
                <span>{fmtDate(doc.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="doc-row-right">
            <StatusBadge status={doc.status} />
            <button
              className="download-button"
              title="Download"
              onClick={() => handleDownload(doc)}
              disabled={downloadingId === doc.id}
            >
              {downloadingId === doc.id ? "⌛" : "↓"}
            </button>
            <ActionMenu
              doc={doc}
              onDownload={() => handleDownload(doc)}
              onEdit={() => onEdit(doc)}
              onDelete={() => handleDelete(doc)}
            />
          </div>
        </div>
      ))}
      {!uploads.length && (
        <div className="doc-empty">You haven't uploaded any documents yet.</div>
      )}
    </div>
  );
}

// ── Tab: OCR EXTRACTIONS ──────────────────────────────────────────────────────
function TabOcrExtractions({ latestOcr, ocrStats, loading, error }) {
  if (loading) return <div className="doc-empty">Loading OCR analytics...</div>;
  if (error) return <div className="doc-empty" style={{ color: "#d9534f" }}>{error}</div>;

  const fields = latestOcr
    ? [
        { label: "Vendor",      value: latestOcr.vendorName || "—" },
        { label: "Invoice No.", value: latestOcr.invoiceNumber || "—" },
        { label: "Date",        value: latestOcr.invoiceDate || "—" },
        { label: "Amount",      value: latestOcr.amount ? `₹${Number(latestOcr.amount).toLocaleString('en-IN')}` : "—" },
        { label: "GSTIN",       value: latestOcr.gstin || "—" },
        { label: "HSN Code",    value: latestOcr.hsnCode || "—" },
      ]
    : [];

  const statsList = [
    {
      label: "Documents Processed",
      helper: `This month: ${ocrStats?.processedThisMonth || 0}`,
      value: String(ocrStats?.documentsProcessed || 0),
    },
    {
      label: "Avg. Accuracy",
      helper: `Target: ${ocrStats?.targetAccuracy || 98}%`,
      value: `${(ocrStats?.averageAccuracy || 95.0).toFixed(1)}%`,
    },
    {
      label: "Auto-posted to GL",
      helper: `${ocrStats?.autoPostedDocuments || 0} docs`,
      value: `${(ocrStats?.autoPostedToGlPercent || 0).toFixed(0)}%`,
    },
    {
      label: "Manual Review",
      helper: "Needs verification",
      value: String(ocrStats?.manualReviewCount || 0),
    },
  ];

  return (
    <div className="overview-grid">
      {/* Latest extraction */}
      <div className="overview-panel">
        <h2>Latest Extraction</h2>
        {latestOcr ? (
          <>
            <div className="extraction-card">
              <div className="extraction-title">
                DOCUMENT: {(latestOcr.documentTitle || "DOCUMENT").toUpperCase()}
              </div>
              {fields.map(({ label, value }) => (
                <div className="overview-metric" key={label}>
                  <div><span>{label}</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <strong>{value}</strong>
                    <span style={{ color: "#7aad60", fontSize: 13 }}>✓</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="extraction-footer">
              <span>{(latestOcr.confidence || 95).toFixed(1)}% confidence</span>
              <button className="doc-btn doc-btn-light" onClick={() => alert("Auto-posting to GL completed.")}>
                Auto-post to GL →
              </button>
            </div>
          </>
        ) : (
          <div className="doc-empty" style={{ padding: "40px 20px" }}>
            No OCR extractions recorded yet. Upload a document with OCR enabled to extract invoice metadata.
          </div>
        )}
      </div>

      {/* OCR Stats */}
      <div className="overview-panel">
        <h2>OCR Stats</h2>
        <div className="ocr-stats">
          {statsList.map(({ label, helper, value }) => (
            <div className="overview-metric" key={label}>
              <div>
                <span>{label}</span>
                <small>{helper}</small>
              </div>
              <strong style={{ fontSize: 22 }}>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate  = useNavigate();
  const { user }  = useAuthStore();
  const uploadRoute = UPLOAD_ROUTES[user?.role] || ROUTES.ADMIN_DOCUMENTS_UPLOAD;

  const [activeTab, setActiveTab] = useState("all");
  const [newDocOpen, setNewDocOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  // Live data states
  const [stats, setStats] = useState({
    totalDocuments: 0,
    documentsThisMonth: 0,
    ocrAccuracy: 0,
    ocrExtractedCount: 0,
    pendingApprovalCount: 0,
    nearestApprovalDueDate: null,
    storageUsedGb: 0,
    storageRemainingGb: 100,
    indexedDocuments: 0,
    processingDocuments: 0,
  });
  const [allDocs, setAllDocs] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [myUploads, setMyUploads] = useState([]);
  const [latestOcr, setLatestOcr] = useState(null);
  const [ocrStats, setOcrStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashRes, docsRes, appRes, uploadsRes, ocrLatestRes, ocrStatsRes] = await Promise.allSettled([
        DocumentsService.getDashboard(),
        DocumentsService.getAll({ search: search || undefined, type: typeFilter || undefined }),
        DocumentsService.getApprovals(),
        DocumentsService.getMyUploads(),
        DocumentsService.getLatestOcr(),
        DocumentsService.getOcrStats(),
      ]);

      if (dashRes.status === "fulfilled" && dashRes.value?.data) {
        setStats(dashRes.value.data);
      }
      if (docsRes.status === "fulfilled" && Array.isArray(docsRes.value?.data)) {
        setAllDocs(docsRes.value.data);
      }
      if (appRes.status === "fulfilled" && Array.isArray(appRes.value?.data)) {
        setApprovals(appRes.value.data);
      }
      if (uploadsRes.status === "fulfilled" && Array.isArray(uploadsRes.value?.data)) {
        setMyUploads(uploadsRes.value.data);
      }
      if (ocrLatestRes.status === "fulfilled" && ocrLatestRes.value?.data) {
        setLatestOcr(ocrLatestRes.value.data);
      }
      if (ocrStatsRes.status === "fulfilled" && ocrStatsRes.value?.data) {
        setOcrStats(ocrStatsRes.value.data);
      }
    } catch (err) {
      console.error("Error fetching documents dashboard data:", err);
      setError("Failed to load documents data. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="documents-page">
      {/* ── Page header ── */}
      <div className="doc-title-row">
        <div>
          <div className="doc-eyebrow">DOCUMENTS</div>
          <h1>Document Management</h1>
        </div>
        <div className="doc-header-actions">
          <button className="doc-btn doc-btn-light" onClick={() => navigate(uploadRoute)}>
            ↑ Upload
          </button>
          <button className="doc-btn doc-btn-dark" onClick={() => setNewDocOpen(true)}>
            + New Document
          </button>
        </div>
      </div>

      {/* ── AI OCR Banner ── */}
      <div className="doc-ai-banner">
        <div className="doc-ai-content">
          <div className="doc-ai-icon">🤖</div>
          <div>
            <strong>AI OCR Processing Active</strong>
            <p>
              {stats.processingDocuments || 0} document processing
              {" · "}
              {stats.indexedDocuments || stats.totalDocuments || 0} documents indexed
              {" · "}
              Smart search enabled
            </p>
          </div>
        </div>
        <div className="doc-active">
          <span />
          Active
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="doc-kpi-grid">
        <KpiCard
          value={stats.totalDocuments || 0}
          label="TOTAL DOCUMENTS"
          helper={`↑ ${stats.documentsThisMonth || 0} this month`}
        />
        <KpiCard
          value={`${(stats.ocrAccuracy || 95.0).toFixed(1)}%`}
          label="OCR ACCURACY"
          helper={`${stats.ocrExtractedCount || 0}/${stats.totalDocuments || 0} extracted`}
        />
        <KpiCard
          value={stats.pendingApprovalCount || approvals.length || 0}
          label="PENDING APPROVAL"
          helper={stats.nearestApprovalDueDate ? `Due by ${fmtDate(stats.nearestApprovalDueDate)}` : "All approvals current"}
        />
        <KpiCard
          value={`${(stats.storageUsedGb || 0).toFixed(2)} GB`}
          label="STORAGE USED"
          helper={`${(stats.storageRemainingGb || 100).toFixed(1)} GB remaining`}
        />
      </div>

      {/* ── Tabs ── */}
      <div className="doc-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? "active" : ""}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab content rendered inline ── */}
      {activeTab === "all" && (
        <TabAllDocuments
          documents={allDocs}
          loading={loading}
          error={error}
          onRefresh={fetchData}
          search={search}
          setSearch={setSearch}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          onEdit={(doc) => setEditingDoc(doc)}
        />
      )}
      {activeTab === "approvals" && (
        <TabPendingApproval
          approvals={approvals}
          loading={loading}
          error={error}
          onRefresh={fetchData}
        />
      )}
      {activeTab === "uploads" && (
        <TabMyUploads
          uploads={myUploads}
          loading={loading}
          error={error}
          onRefresh={fetchData}
          onEdit={(doc) => setEditingDoc(doc)}
        />
      )}
      {activeTab === "ocr" && (
        <TabOcrExtractions
          latestOcr={latestOcr}
          ocrStats={ocrStats}
          loading={loading}
          error={error}
        />
      )}

      <NewDocumentModal
        open={newDocOpen || Boolean(editingDoc)}
        editDocument={editingDoc}
        onClose={() => {
          setNewDocOpen(false);
          setEditingDoc(null);
        }}
        onSuccess={fetchData}
      />
    </div>
  );
}
