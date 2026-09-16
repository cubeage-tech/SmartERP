import React, { useState } from "react";
import { X, Check, AlertCircle } from "lucide-react";
import ReportsService from "../../../../core/services/modules/reports.service";

const CATEGORIES = ["FINANCE", "SALES", "OPERATIONS", "HR", "INVENTORY", "PURCHASE", "MANUFACTURING", "PROJECTS"];
const SCHEDULES = ["NONE", "DAILY", "WEEKLY", "MONTHLY", "QUARTERLY"];

export default function EditReportModal({ report, onClose, onSuccess }) {
  const [name, setName] = useState(report.name || "");
  const [category, setCategory] = useState((report.category || "FINANCE").toUpperCase());
  const [format, setFormat] = useState(report.format || "PDF / Excel / CSV");
  const [schedule, setSchedule] = useState((report.schedule || "NONE").toUpperCase());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Report name is required.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (report.isCustom) {
        await ReportsService.updateCustom(report.id, {
          name: name.trim(),
          module: category,
        });
      } else {
        await ReportsService.update(report.id, {
          name: name.trim(),
          category: category,
          format: format,
          schedule: schedule,
        });
      }
      onSuccess();
    } catch (err) {
      const res = err?.response?.data;
      setError(res?.detail || res?.message || "Failed to save report updates.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" onClick={!loading ? onClose : undefined} />
      <div className="fixed left-1/2 top-1/2 z-[60] w-full max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-[#e2e0d8] bg-[#fbfaf7] p-6 shadow-2xl animate-in fade-in-50 zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#e5e3dc] pb-3.5">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#999b94]">
              Report Configuration
            </span>
            <h3 className="font-serif text-[18px] font-bold text-[#20231f]">Edit Report</h3>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
              Report Name <span className="text-[#d9534f]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-[9px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
              Category / Domain Module <span className="text-[#d9534f]">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-[9px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
              Supported Formats
            </label>
            <input
              type="text"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="mt-1 w-full rounded-[9px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7268]">
              Schedule Frequency
            </label>
            <select
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="mt-1 w-full rounded-[9px] border border-[#dedcd4] bg-white px-3 py-2 font-mono text-[11px] text-[#11130f] outline-none focus:border-[#11130f]"
            >
              {SCHEDULES.map((sch) => (
                <option key={sch} value={sch}>{sch}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-[8px] border border-[#f5c6cb] bg-[#f8d7da] px-3 py-2 font-mono text-[10px] text-[#721c24]">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-6 flex gap-2.5 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="flex-1 rounded-[10px] border border-[#e2e0d8] bg-[#fbfaf7] py-2.5 font-mono text-[11px] text-[#666a63] transition hover:bg-[#f0efe9] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-[10px] bg-[#111410] py-2.5 font-mono text-[11px] font-medium text-white transition hover:bg-[#20231f] disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                "Saving…"
              ) : (
                <>
                  <Check size={14} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
