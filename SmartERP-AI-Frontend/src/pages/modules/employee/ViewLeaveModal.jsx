import React from "react";
import { X, Calendar, User, Phone, FileText, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

export default function ViewLeaveModal({ isOpen, onClose, leave, onEdit, onCancel }) {
  if (!isOpen || !leave) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e3ebdf] px-3 py-1 font-mono text-[11px] font-medium text-[#3b593a]">
            <CheckCircle size={12} />
            APPROVED
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fce8e6] px-3 py-1 font-mono text-[11px] font-medium text-[#a84439]">
            <XCircle size={12} />
            REJECTED
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eae9e5] px-3 py-1 font-mono text-[11px] font-medium text-[#737875]">
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3dc] px-3 py-1 font-mono text-[11px] font-medium text-[#996a1e]">
            <Clock size={12} />
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div
        className="
          relative
          w-full
          max-w-[540px]
          rounded-[24px]
          border
          border-[#e3e0d9]
          bg-white
          p-6
          shadow-2xl
          sm:p-8
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#eee] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] tracking-[0.14em] text-[#9ca0a0] uppercase">
                LEAVE DETAILS
              </span>
              <span className="font-mono text-[11px] text-[#555]">
                {leave.leaveCode || `LV-${leave.id}`}
              </span>
            </div>
            <h2 className="mt-1 font-serif text-[24px] text-[#11130f]">
              {leave.leaveType || leave.type || "Leave Request"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#9da3a8] transition-colors hover:bg-[#f2f1ec] hover:text-[#11130f]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status bar */}
        <div className="mt-5 flex items-center justify-between rounded-[14px] bg-[#f9f8f5] p-4 border border-[#e3e0d9]">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#69706d]">
            Current Status
          </span>
          {getStatusBadge(leave.status)}
        </div>

        {/* Details Grid */}
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[12px] border border-[#eee] bg-white p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#9da3a8]">
                From Date
              </p>
              <p className="mt-1 font-mono text-[13px] font-semibold text-[#11130f]">
                {leave.formattedFrom || leave.startDate || "—"}
              </p>
            </div>
            <div className="rounded-[12px] border border-[#eee] bg-white p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#9da3a8]">
                To Date
              </p>
              <p className="mt-1 font-mono text-[13px] font-semibold text-[#11130f]">
                {leave.formattedTo || leave.endDate || "—"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[12px] border border-[#eee] bg-white p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#9da3a8]">
                Total Days
              </p>
              <p className="mt-1 font-serif text-[18px] text-[#11130f]">
                {leave.days || `${leave.numberOfDays || 1} Days`}
              </p>
            </div>
            <div className="rounded-[12px] border border-[#eee] bg-white p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#9da3a8]">
                Applied On
              </p>
              <p className="mt-1 font-mono text-[13px] text-[#555]">
                {leave.appliedOn || leave.createdAt ? String(leave.appliedOn || leave.createdAt).slice(0, 10) : "—"}
              </p>
            </div>
          </div>

          {/* Reason */}
          <div className="rounded-[12px] border border-[#eee] bg-white p-3.5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#9da3a8]">
              Reason
            </p>
            <p className="mt-1 font-mono text-[13px] leading-relaxed text-[#2c302d]">
              {leave.reason || "No reason provided."}
            </p>
          </div>

          {/* Contact During Leave */}
          {leave.contactDuringLeave && (
            <div className="rounded-[12px] border border-[#eee] bg-white p-3.5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#9da3a8]">
                Contact During Leave
              </p>
              <p className="mt-1 font-mono text-[13px] text-[#2c302d]">
                {leave.contactDuringLeave}
              </p>
            </div>
          )}

          {/* Attachment */}
          {leave.attachmentUrl && (
            <div className="rounded-[12px] border border-[#eee] bg-white p-3.5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#9da3a8]">
                Attachment
              </p>
              <a
                href={leave.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 font-mono text-[12px] text-[#2d6a4f] underline hover:text-[#1b4332]"
              >
                <FileText size={14} />
                View Attachment Document
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#eee] pt-4">
          {leave.status === "PENDING" && onCancel && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onCancel(leave.id);
              }}
              className="rounded-[12px] border border-[#e3d0cc] bg-[#fdf4f2] px-4 py-2 font-mono text-[11px] text-[#a84439] transition-colors hover:bg-[#fae4e1]"
            >
              Cancel Request
            </button>
          )}

          {leave.status === "PENDING" && onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(leave);
              }}
              className="rounded-[12px] border border-[#d8d5cc] bg-white px-4 py-2 font-mono text-[11px] text-[#4d5350] transition-colors hover:bg-[#f6f5f1]"
            >
              Edit Request
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-[12px] border border-[#151714] bg-[#151714] px-5 py-2 font-mono text-[11px] font-medium text-white transition-colors hover:bg-[#2b2f29]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
