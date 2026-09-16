import React, { useState, useEffect } from "react";
import { X, Download, FileText, Calendar, Tag, Layers, RefreshCw } from "lucide-react";
import ReportsService from "../../../../core/services/modules/reports.service";

export default function ViewReportModal({ report, onClose, onExportFormat }) {
  const [loading, setLoading] = useState(true);
  const [previewCols, setPreviewCols] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!report?.id) return;
    setLoading(true);
    setError(null);

    if (report.isCustom) {
      ReportsService.getPreview(report.id)
        .then(({ data }) => {
          setPreviewCols(data.columns || []);
          setPreviewData(data.data || []);
        })
        .catch((err) => {
          setError(err.response?.data?.detail || "Failed to load custom report preview.");
        })
        .finally(() => setLoading(false));
    } else {
      // Standard report: fetch preview columns/data or template preview
      ReportsService.getById(report.id)
        .then(({ data }) => {
          setPreviewCols(["Field", "Configuration / Value"]);
          setPreviewData([
            { "Field": "Report Name", "Configuration / Value": data.name || report.name },
            { "Field": "Category", "Configuration / Value": data.category || report.category },
            { "Field": "Default Format", "Configuration / Value": data.format || report.format },
            { "Field": "Schedule Frequency", "Configuration / Value": data.schedule || report.schedule },
            { "Field": "Status", "Configuration / Value": data.status || "ACTIVE" },
            { "Field": "Last Generated", "Configuration / Value": data.lastRun || report.lastRun || "Recent" },
          ]);
        })
        .catch(() => {
          setPreviewCols(["Attribute", "Value"]);
          setPreviewData([
            { "Attribute": "Report Name", "Value": report.name },
            { "Attribute": "Category", "Value": report.category },
            { "Attribute": "Format", "Value": report.format },
            { "Attribute": "Schedule", "Value": report.schedule },
            { "Attribute": "Last Run", "Value": report.lastRun },
          ]);
        })
        .finally(() => setLoading(false));
    }
  }, [report]);

  return (
    <>
      {/* Darkened backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Centered Modal */}
      <div className="fixed left-1/2 top-1/2 z-[60] flex h-[85vh] max-h-[750px] w-[90vw] max-w-[960px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[16px] border border-[#e2e0d8] bg-[#fbfaf7] shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e3dc] px-6 py-4 bg-[#fbfaf7] flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#ebe9e2] px-2 py-0.5 font-mono text-[9px] font-semibold uppercase text-[#5a5245]">
                {report.isCustom ? "Custom Report" : "Standard Report"}
              </span>
              <span className="font-mono text-[10px] text-[#8d9696]">{report.category}</span>
            </div>
            <h2 className="font-serif text-[20px] font-bold text-[#11130f] mt-1">{report.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onExportFormat(report, "PDF")}
              className="flex items-center gap-1.5 rounded-[9px] border border-[#dedcd4] bg-white px-3 py-1.5 font-mono text-[10px] font-medium text-[#41453d] shadow-sm hover:bg-[#f3f2ec]"
            >
              <Download size={12} />
              Export PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e0d8] bg-[#fbfaf7] text-[#777a73] transition hover:bg-[#f0efe9] hover:text-[#11130f]"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Metadata Summary Banner */}
        <div className="grid grid-cols-2 gap-3 border-b border-[#e5e3dc] bg-white px-6 py-3 font-mono text-[10px] sm:grid-cols-4 flex-shrink-0">
          <div>
            <span className="block text-[#8d9696] uppercase text-[8px] tracking-[0.05em]">Category</span>
            <span className="font-medium text-[#11130f]">{report.category}</span>
          </div>
          <div>
            <span className="block text-[#8d9696] uppercase text-[8px] tracking-[0.05em]">Format</span>
            <span className="font-medium text-[#11130f]">{report.format}</span>
          </div>
          <div>
            <span className="block text-[#8d9696] uppercase text-[8px] tracking-[0.05em]">Schedule</span>
            <span className="font-medium text-[#11130f]">{report.schedule}</span>
          </div>
          <div>
            <span className="block text-[#8d9696] uppercase text-[8px] tracking-[0.05em]">Last Run</span>
            <span className="font-medium text-[#11130f]">{report.lastRun}</span>
          </div>
        </div>

        {/* Scrollable Data / Preview Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
          {loading ? (
            <div className="flex h-48 items-center justify-center font-mono text-[11px] text-[#8d9696]">
              <RefreshCw size={16} className="animate-spin mr-2" />
              Loading report preview data...
            </div>
          ) : error ? (
            <div className="rounded-[10px] border border-[#f5c6cb] bg-[#f8d7da] p-4 font-mono text-[11px] text-[#721c24]">
              {error}
            </div>
          ) : previewData.length > 0 ? (
            <div className="rounded-[12px] border border-[#e2dfd7] bg-white shadow-sm overflow-hidden">
              <div className="border-b border-[#f0eee8] bg-[#fcfbf9] px-4 py-2.5 flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase text-[#6b7268]">
                  Live Report Records ({previewData.length})
                </span>
                <span className="font-mono text-[9px] text-[#9ca3af]">Tenant Isolated</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-[#e5e3dc] bg-[#f8f7f3]">
                      {previewCols.map((col) => (
                        <th key={col} className="px-4 py-2.5 font-semibold text-[#5a5245] uppercase text-[9px] tracking-[0.06em] whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, idx) => (
                      <tr key={idx} className="border-b border-[#f0eee8] hover:bg-[#faf9f5]">
                        {previewCols.map((col) => (
                          <td key={col} className="px-4 py-2.5 text-[#20231f] whitespace-nowrap">
                            {row[col] != null ? String(row[col]) : "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-[12px] border border-dashed border-[#dedcd4] bg-white font-mono text-[11px] text-[#8d9696]">
              No records available for this report.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#e5e3dc] bg-white px-6 py-3.5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-[#999b94]">Export formats:</span>
            <button
              type="button"
              onClick={() => onExportFormat(report, "CSV")}
              className="rounded bg-[#f4f8f2] px-2.5 py-1 font-mono text-[9px] font-semibold text-[#3e5c38] hover:bg-[#e8f0e4]"
            >
              CSV
            </button>
            <button
              type="button"
              onClick={() => onExportFormat(report, "PDF")}
              className="rounded bg-[#fdf3f2] px-2.5 py-1 font-mono text-[9px] font-semibold text-[#c93b2b] hover:bg-[#fae7e5]"
            >
              PDF
            </button>
            <button
              type="button"
              onClick={() => onExportFormat(report, "EXCEL")}
              className="rounded bg-[#f4f8f2] px-2.5 py-1 font-mono text-[9px] font-semibold text-[#2b8a3e] hover:bg-[#e8f0e4]"
            >
              Excel
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-[9px] border border-[#dedcd4] bg-[#fbfaf7] px-5 py-2 font-mono text-[11px] font-medium text-[#41453d] transition hover:bg-[#f0efe9]"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
