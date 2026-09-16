import React, { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import ReportsService from "../../../../core/services/modules/reports.service";

export default function DeleteReportModal({ report, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      if (report.isCustom) {
        await ReportsService.removeCustom(report.id);
      } else {
        await ReportsService.remove(report.id);
      }
      onSuccess();
    } catch (err) {
      const res = err?.response?.data;
      setError(res?.detail || res?.message || "Failed to delete report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" onClick={!loading ? onClose : undefined} />
      <div className="fixed left-1/2 top-1/2 z-[60] w-full max-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-[#e2e0d8] bg-[#fbfaf7] p-6 shadow-2xl animate-in fade-in-50 zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#e5e3dc] pb-3">
          <div className="flex items-center gap-2 text-[#c93b2b]">
            <AlertTriangle size={18} />
            <h3 className="font-serif text-[18px] font-bold text-[#20231f]">Delete Report</h3>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="text-[#999b94] hover:text-[#20231f]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-3 font-mono text-[11px] text-[#555850]">
          <p>
            Are you sure you want to permanently delete the report:
          </p>
          <div className="rounded-[10px] border border-[#e2e0d8] bg-white p-3 font-semibold text-[#11130f]">
            {report.name}
            <span className="ml-2 font-normal text-[9px] text-[#8d9696]">({report.category})</span>
          </div>
          <p className="text-[#c93b2b] text-[10px]">
            ⚠️ This action cannot be undone and will remove all associated configurations and schedules.
          </p>

          {error && (
            <div className="rounded-[8px] border border-[#f5c6cb] bg-[#f8d7da] px-3 py-2 text-[10px] text-[#721c24]">
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex-1 rounded-[10px] border border-[#e2e0d8] bg-[#fbfaf7] py-2.5 font-mono text-[11px] text-[#666a63] transition hover:bg-[#f0efe9] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="flex-1 rounded-[10px] bg-[#c93b2b] py-2.5 font-mono text-[11px] font-medium text-white transition hover:bg-[#a82d1f] disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              "Deleting…"
            ) : (
              <>
                <Trash2 size={13} />
                Delete Report
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
