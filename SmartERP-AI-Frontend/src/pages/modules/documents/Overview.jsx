import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/slices/auth.store";
import { ROUTES } from "../../../core/constants/routes.constant";
import DocumentsService from "../../../core/services/modules/documents.service";
import "./documents.css";

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

export default function Overview() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [ocrStats, setOcrStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, docsRes, ocrRes] = await Promise.allSettled([
        DocumentsService.getDashboard(),
        DocumentsService.getAll(),
        DocumentsService.getOcrStats(),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (docsRes.status === "fulfilled" && Array.isArray(docsRes.value?.data)) {
        setRecentDocs(docsRes.value.data.slice(0, 5));
      }
      if (ocrRes.status === "fulfilled") setOcrStats(ocrRes.value.data);
    } catch (err) {
      console.error("Failed to load document overview:", err);
      setError("Failed to load overview data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const uploadRoute = user?.role === "superAdmin"
    ? ROUTES.SUPER_ADMIN_DOCUMENTS_UPLOAD
    : ROUTES.ADMIN_DOCUMENTS_UPLOAD;

  return (
    <div className="documents-page">
      <div className="doc-title-row">
        <div>
          <div className="doc-eyebrow">DOCUMENTS</div>
          <h1>System Overview</h1>
          <p>Comprehensive status of document lifecycle, OCR pipeline, and storage.</p>
        </div>
        <div className="doc-header-actions">
          <button className="doc-btn doc-btn-dark" onClick={() => navigate(uploadRoute)}>
            + Upload Document
          </button>
        </div>
      </div>

      {loading && <div className="doc-empty">Loading overview metrics...</div>}
      {error && (
        <div className="doc-empty" style={{ color: "#d9534f" }}>
          {error} <button className="doc-btn doc-btn-light" onClick={loadOverview} style={{ marginLeft: 10 }}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* KPI Grid */}
          <div className="doc-kpi-grid">
            <div className="doc-kpi-card">
              <div className="doc-kpi-value">{stats?.totalDocuments || recentDocs.length || 0}</div>
              <div className="doc-kpi-label">TOTAL DOCUMENTS</div>
              <div className="doc-kpi-helper">↑ {stats?.documentsThisMonth || 0} this month</div>
            </div>
            <div className="doc-kpi-card">
              <div className="doc-kpi-value">{((stats?.ocrAccuracy || ocrStats?.averageAccuracy || 95.0)).toFixed(1)}%</div>
              <div className="doc-kpi-label">OCR PIPELINE ACCURACY</div>
              <div className="doc-kpi-helper">{stats?.ocrExtractedCount || 0} processed</div>
            </div>
            <div className="doc-kpi-card">
              <div className="doc-kpi-value">{stats?.pendingApprovalCount || 0}</div>
              <div className="doc-kpi-label">PENDING APPROVALS</div>
              <div className="doc-kpi-helper">Across all departments</div>
            </div>
            <div className="doc-kpi-card">
              <div className="doc-kpi-value">{((stats?.storageUsedGb || 0)).toFixed(2)} GB</div>
              <div className="doc-kpi-label">STORAGE UTILIZATION</div>
              <div className="doc-kpi-helper">{((stats?.storageRemainingGb || 100)).toFixed(1)} GB free quota</div>
            </div>
          </div>

          {/* Detailed Overview Panels */}
          <div className="overview-grid" style={{ marginTop: 24 }}>
            <div className="overview-panel">
              <h2>Recent Documents</h2>
              <div className="doc-list" style={{ marginTop: 12 }}>
                {recentDocs.map((doc) => (
                  <div className="doc-row" key={doc.id} style={{ padding: "10px 14px" }}>
                    <div className="doc-row-left">
                      <div className="doc-file-icon">📄</div>
                      <div>
                        <h3 style={{ fontSize: 13 }}>{doc.title}</h3>
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
                      <button
                        className="download-button"
                        onClick={() => DocumentsService.download(doc.id, doc.originalFileName || doc.title)}
                        title="Download"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
                {!recentDocs.length && <div className="doc-empty">No recent documents found.</div>}
              </div>
            </div>

            <div className="overview-panel">
              <h2>OCR Processing Summary</h2>
              <div className="ocr-stats" style={{ marginTop: 12 }}>
                <div className="overview-metric">
                  <div>
                    <span>Total Processed</span>
                    <small>All historical runs</small>
                  </div>
                  <strong style={{ fontSize: 22 }}>{ocrStats?.documentsProcessed || 0}</strong>
                </div>
                <div className="overview-metric">
                  <div>
                    <span>Auto-posted to Ledger</span>
                    <small>{ocrStats?.autoPostedDocuments || 0} documents</small>
                  </div>
                  <strong style={{ fontSize: 22 }}>{(ocrStats?.autoPostedToGlPercent || 0).toFixed(0)}%</strong>
                </div>
                <div className="overview-metric">
                  <div>
                    <span>Manual Review Flagged</span>
                    <small>Confidence &lt; 90%</small>
                  </div>
                  <strong style={{ fontSize: 22 }}>{ocrStats?.manualReviewCount || 0}</strong>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}