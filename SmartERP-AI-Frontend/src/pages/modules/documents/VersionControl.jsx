import { useState, useEffect, useCallback, useRef } from "react";
import DocumentsService from "../../../core/services/modules/documents.service";
import "./documents.css";

const fmtDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

export default function VersionControl() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [versions, setVersions] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [error, setError] = useState(null);

  // New version upload state
  const [showUpload, setShowUpload] = useState(false);
  const [newVersionFile, setNewVersionFile] = useState(null);
  const [changeReason, setChangeReason] = useState("");
  const [comments, setComments] = useState("");
  const [uploading, setUploading] = useState(false);
  const [actioningId, setActioningId] = useState(null);

  const fileInputRef = useRef();

  // Load all documents for selector
  const fetchDocs = useCallback(async () => {
    try {
      setLoadingDocs(true);
      const res = await DocumentsService.getAll();
      const list = Array.isArray(res.data) ? res.data : [];
      setDocuments(list);
      if (list.length > 0 && !selectedDocId) {
        setSelectedDocId(String(list[0].id));
      }
    } catch (err) {
      console.error("Failed to fetch documents for version control:", err);
      setError("Failed to load documents list.");
    } finally {
      setLoadingDocs(false);
    }
  }, [selectedDocId]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  // Load versions for selected document
  const fetchVersions = useCallback(async (docId) => {
    if (!docId) return;
    try {
      setLoadingVersions(true);
      setError(null);
      const res = await DocumentsService.getVersions(docId);
      setVersions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load versions:", err);
      setError("Failed to load version history for this document.");
    } finally {
      setLoadingVersions(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDocId) {
      fetchVersions(selectedDocId);
    }
  }, [selectedDocId, fetchVersions]);

  const handleUploadNewVersion = async (e) => {
    e.preventDefault();
    if (!newVersionFile) {
      alert("Please select a file to upload.");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", newVersionFile);
      if (changeReason) formData.append("changeReason", changeReason);
      if (comments) formData.append("comments", comments);

      await DocumentsService.uploadVersion(selectedDocId, formData);
      setNewVersionFile(null);
      setChangeReason("");
      setComments("");
      setShowUpload(false);
      await fetchVersions(selectedDocId);
      await fetchDocs();
    } catch (err) {
      console.error("Failed to upload new version:", err);
      alert("Failed to upload new version.");
    } finally {
      setUploading(false);
    }
  };

  const handleRestore = async (version) => {
    if (!window.confirm(`Restore Version ${version.versionNumber}? This will set it as the active document version.`)) {
      return;
    }
    try {
      setActioningId(version.id);
      await DocumentsService.restoreVersion(selectedDocId, version.id);
      await fetchVersions(selectedDocId);
      await fetchDocs();
    } catch (err) {
      console.error("Failed to restore version:", err);
      alert("Failed to restore version.");
    } finally {
      setActioningId(null);
    }
  };

  const handleDownloadVersion = async (version) => {
    try {
      await DocumentsService.downloadVersion(
        selectedDocId,
        version.id,
        version.originalFileName || `v${version.versionNumber}-document`
      );
    } catch (err) {
      console.error("Failed to download version:", err);
      alert("Failed to download version file.");
    }
  };

  const selectedDoc = documents.find((d) => String(d.id) === String(selectedDocId));

  return (
    <div className="documents-page">
      <div className="doc-title-row">
        <div>
          <div className="doc-eyebrow">DOCUMENTS</div>
          <h1>Version Control & History</h1>
          <p>Inspect audit trail, revert revisions, and maintain full immutable file history.</p>
        </div>
        <div className="doc-header-actions">
          {selectedDocId && (
            <button className="doc-btn doc-btn-dark" onClick={() => setShowUpload(!showUpload)}>
              {showUpload ? "Cancel Upload" : "+ Upload New Version"}
            </button>
          )}
        </div>
      </div>

      {/* Document Selector Header */}
      <div style={{ background: "#fff", border: "1px solid #d5d2ca", borderRadius: 4, padding: "16px 20px", marginTop: 16 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#53605e", marginBottom: 6 }}>
          SELECT DOCUMENT TO INSPECT VERSIONS
        </label>
        {loadingDocs ? (
          <div>Loading documents...</div>
        ) : (
          <select
            className="doc-select"
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            style={{ maxWidth: 500 }}
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title} (v{d.currentVersion || 1} · {d.type})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* New Version Upload Box */}
      {showUpload && (
        <div style={{ background: "#faf9f6", border: "1px solid #11130f", borderRadius: 4, padding: 20, marginTop: 16 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 14 }}>Upload New Version for: {selectedDoc?.title}</h3>
          <form onSubmit={handleUploadNewVersion}>
            <div style={{ marginBottom: 12 }}>
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => setNewVersionFile(e.target.files[0])}
                required
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#53605e", marginBottom: 4 }}>CHANGE REASON</label>
                <input
                  className="doc-input"
                  placeholder="e.g. Revised vendor prices"
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#53605e", marginBottom: 4 }}>COMMENTS</label>
                <input
                  className="doc-input"
                  placeholder="Additional revision notes"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="doc-btn doc-btn-dark" disabled={uploading}>
                {uploading ? "Uploading Version..." : "Save Revision"}
              </button>
              <button type="button" className="doc-btn doc-btn-light" onClick={() => setShowUpload(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Version List */}
      <div style={{ marginTop: 24 }}>
        {loadingVersions && <div className="doc-empty">Loading version history...</div>}
        {error && <div className="doc-empty" style={{ color: "#d9534f" }}>{error}</div>}

        {!loadingVersions && !error && (
          <div className="doc-list">
            {versions.map((ver) => (
              <div className="doc-row" key={ver.id} style={{ borderColor: ver.current ? "#11130f" : "#e3e0d9" }}>
                <div className="doc-row-left">
                  <div className="doc-file-icon">
                    <span style={{ fontSize: 11, fontWeight: 700 }}>v{ver.versionNumber}</span>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h3>{ver.originalFileName || "document-file"}</h3>
                      {ver.current && (
                        <span className="doc-status doc-status--approved" style={{ fontSize: 10, padding: "2px 6px" }}>
                          CURRENT ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="doc-meta">
                      <span>{formatSize(ver.fileSize)}</span>
                      <span>·</span>
                      <span>Uploaded by {ver.uploadedByName || "User"}</span>
                      <span>·</span>
                      <span>{fmtDate(ver.createdAt)}</span>
                      {ver.changeReason && (
                        <>
                          <span>·</span>
                          <em>Reason: {ver.changeReason}</em>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="approval-actions">
                  <button
                    className="doc-btn doc-btn-light"
                    onClick={() => handleDownloadVersion(ver)}
                  >
                    ↓ Download
                  </button>
                  {!ver.current && (
                    <button
                      className="doc-btn doc-btn-dark"
                      onClick={() => handleRestore(ver)}
                      disabled={actioningId === ver.id}
                    >
                      {actioningId === ver.id ? "Restoring..." : "Restore Version"}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!versions.length && (
              <div className="doc-empty">No versions recorded for this document.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}