import { useState, useEffect, useCallback } from "react";
import DocumentsService from "../../../core/services/modules/documents.service";
import "./documents.css";

const DOC_TYPES = [
  { value: "",               label: "All Types"      },
  { value: "VENDOR_INVOICE", label: "Vendor Invoice" },
  { value: "SALES_ORDER",    label: "Sales Order"    },
  { value: "CONTRACT",       label: "Contract"       },
  { value: "HR_DOCUMENT",    label: "HR Document"    },
  { value: "TAX_DOCUMENT",   label: "Tax Document"   },
  { value: "REPORT",         label: "Report"         },
  { value: "PURCHASE_ORDER", label: "Purchase Order" },
  { value: "OTHER",          label: "Other"          },
];

const CATEGORIES = [
  "", "Finance", "HR", "Legal", "Operations", "Sales",
  "Purchase", "Compliance", "IT", "General",
];

const STATUSES = [
  { value: "",         label: "All Statuses" },
  { value: "ACTIVE",   label: "Active"       },
  { value: "PENDING",  label: "Pending"      },
  { value: "APPROVED", label: "Approved"     },
  { value: "REJECTED", label: "Rejected"     },
  { value: "ARCHIVED", label: "Archived"     },
];

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

const formatSize = (bytes = 0) => {
  const num = Number(bytes) || 0;
  if (num >= 1024 * 1024) return `${(num / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(num / 1024))} KB`;
};

export default function DocumentSearch() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const executeSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const payload = {
        search: search || undefined,
        type: type || undefined,
        category: category || undefined,
        status: status || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      };

      const res = await DocumentsService.search(payload);
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Search query failed:", err);
      setError("Search query failed. Please verify filter inputs.");
    } finally {
      setLoading(false);
    }
  }, [search, type, category, status, fromDate, toDate]);

  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  const handleReset = () => {
    setSearch("");
    setType("");
    setCategory("");
    setStatus("");
    setFromDate("");
    setToDate("");
  };

  const handleDownload = async (doc) => {
    try {
      await DocumentsService.download(doc.id, doc.originalFileName || doc.title || "document");
    } catch (err) {
      console.error("Failed to download document:", err);
      alert("Failed to download document.");
    }
  };

  return (
    <div className="documents-page">
      <div className="doc-title-row">
        <div>
          <div className="doc-eyebrow">DOCUMENTS</div>
          <h1>Advanced Document Search</h1>
          <p>Multi-attribute search across title, metadata, tags, vendor names, and OCR contents.</p>
        </div>
      </div>

      {/* Filter Card */}
      <div style={{ background: "#fff", border: "1px solid #d5d2ca", borderRadius: 4, padding: 20, marginTop: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#53605e", marginBottom: 4 }}>
              KEYWORDS / TITLE / TAGS
            </label>
            <input
              className="doc-input"
              placeholder="Search across titles, tags, and document numbers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#53605e", marginBottom: 4 }}>
              DOCUMENT TYPE
            </label>
            <select
              className="doc-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {DOC_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#53605e", marginBottom: 4 }}>
              CATEGORY
            </label>
            <select
              className="doc-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c ? c : "All Categories"}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 14, alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#53605e", marginBottom: 4 }}>
              STATUS
            </label>
            <select
              className="doc-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#53605e", marginBottom: 4 }}>
              FROM DATE
            </label>
            <input
              type="date"
              className="doc-input"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#53605e", marginBottom: 4 }}>
              TO DATE
            </label>
            <input
              type="date"
              className="doc-input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div>
            <button className="doc-btn doc-btn-light" onClick={handleReset} style={{ height: 34 }}>
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ fontSize: 14, textTransform: "uppercase", color: "#53605e", letterSpacing: "0.05em", margin: 0 }}>
            {hasSearched ? `SEARCH RESULTS (${results.length})` : "RESULTS"}
          </h2>
        </div>

        {loading && <div className="doc-empty">Executing search query...</div>}
        {error && <div className="doc-empty" style={{ color: "#d9534f" }}>{error}</div>}

        {!loading && !error && (
          <div className="doc-list">
            {results.map((doc) => (
              <div className="doc-row" key={doc.id}>
                <div className="doc-row-left">
                  <div className="doc-file-icon">📄</div>
                  <div>
                    <h3>{doc.title}</h3>
                    <div className="doc-meta">
                      <span>{doc.type}</span>
                      <span>·</span>
                      <span>{formatSize(doc.fileSize)}</span>
                      <span>·</span>
                      <span>{fmtDate(doc.createdAt)}</span>
                      {doc.category && (
                        <>
                          <span>·</span>
                          <span style={{ fontWeight: 600 }}>{doc.category}</span>
                        </>
                      )}
                      {doc.documentNumber && (
                        <>
                          <span>·</span>
                          <span style={{ fontFamily: "monospace" }}>#{doc.documentNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="doc-row-right">
                  <span className={`doc-status doc-status--${String(doc.status || "active").toLowerCase()}`}>
                    {String(doc.status || "active").toUpperCase()}
                  </span>
                  <button
                    className="download-button"
                    onClick={() => handleDownload(doc)}
                    title="Download File"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
            {!results.length && (
              <div className="doc-empty">No documents matched the specified search criteria.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}