import { useState, useEffect, useCallback } from "react";
import DocumentsService from "../../../core/services/modules/documents.service";
import "./documents.css";

const fmt = (date) => {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return String(date);
  }
};

export default function DigitalApprovals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actingId, setActingId] = useState(null);

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await DocumentsService.getApprovals();
      setApprovals(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load approvals:", err);
      setError("Failed to load digital approvals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const handleApprove = async (id) => {
    try {
      setActingId(id);
      await DocumentsService.approve(id, "Approved digitally");
      await fetchApprovals();
    } catch (err) {
      console.error("Failed to approve document:", err);
      alert("Failed to approve document.");
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id) => {
    const comment = prompt("Please provide a reason for rejection:");
    if (comment === null) return;
    try {
      setActingId(id);
      await DocumentsService.reject(id, comment || "Rejected digitally");
      await fetchApprovals();
    } catch (err) {
      console.error("Failed to reject document:", err);
      alert("Failed to reject document.");
    } finally {
      setActingId(null);
    }
  };

  const handleViewDoc = async (approval) => {
    try {
      await DocumentsService.download(approval.documentId, approval.documentTitle || "document");
    } catch (err) {
      console.error("Failed to download document:", err);
      alert("Failed to load document.");
    }
  };

  return (
    <div className="documents-page">
      {/* ── Header ── */}
      <div className="doc-title-row">
        <div>
          <div className="doc-eyebrow">DOCUMENTS</div>
          <h1>Digital Approvals</h1>
          <p>Review documents waiting for your approval.</p>
        </div>
      </div>

      {/* ── Summary banner ── */}
      <div className="approval-summary">
        <div>
          <strong>{approvals.length}</strong>
          <span>Pending Approval</span>
        </div>
      </div>

      {/* ── Approval list ── */}
      {loading && <div className="doc-empty">Loading pending approvals...</div>}
      {error && (
        <div className="doc-empty" style={{ color: "#d9534f" }}>
          {error} <button className="doc-btn doc-btn-light" onClick={fetchApprovals} style={{ marginLeft: 10 }}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="doc-list">
          {approvals.map((approval) => (
            <div className="doc-row" key={approval.id}>
              <div className="doc-row-left">
                <div className="doc-file-icon">📋</div>
                <div>
                  <h3>{approval.documentTitle}</h3>
                  <div className="doc-meta">
                    <span>{approval.documentType}</span>
                    <span>·</span>
                    <span>Submitted by {approval.submittedByName || "User"}</span>
                    <span>·</span>
                    <span>{fmt(approval.submittedAt || approval.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="approval-actions">
                {approval.dueDate && (
                  <span className="due-date">
                    Due: {fmt(approval.dueDate)}
                  </span>
                )}
                <button className="doc-btn doc-btn-light" onClick={() => handleViewDoc(approval)}>
                  View Doc
                </button>
                <button
                  className="doc-btn approve-button"
                  onClick={() => handleApprove(approval.id)}
                  disabled={actingId === approval.id}
                >
                  {actingId === approval.id ? "Processing..." : "Approve"}
                </button>
                <button
                  className="doc-btn reject-button"
                  onClick={() => handleReject(approval.id)}
                  disabled={actingId === approval.id}
                >
                  {actingId === approval.id ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          ))}

          {!approvals.length && (
            <div className="doc-empty">No pending approvals. You're all caught up!</div>
          )}
        </div>
      )}
    </div>
  );
}
