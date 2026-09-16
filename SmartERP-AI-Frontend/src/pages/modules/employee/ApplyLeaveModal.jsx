import React, { useState, useEffect } from "react";
import { X, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import hrApi from "../hr/hrApiClient";

const LEAVE_TYPES = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Unpaid Leave",
];

export default function ApplyLeaveModal({
  isOpen,
  onClose,
  onSuccess,
  balance,
  editItem = null,
}) {
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [contactDuringLeave, setContactDuringLeave] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (editItem) {
      setLeaveType(editItem.leaveType || editItem.type || "Casual Leave");
      setFromDate(editItem.startDate || "");
      setToDate(editItem.endDate || "");
      setReason(editItem.reason || "");
      setContactDuringLeave(editItem.contactDuringLeave || "");
      setAttachmentUrl(editItem.attachmentUrl || "");
    } else {
      setLeaveType("Casual Leave");
      const today = new Date().toISOString().split("T")[0];
      setFromDate(today);
      setToDate(today);
      setReason("");
      setContactDuringLeave("");
      setAttachmentUrl("");
    }
    setFormError("");
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  // Calculate day count
  const calculateDays = () => {
    if (!fromDate || !toDate) return 0;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    if (end < start) return -1;
    const diffMs = end - start;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculatedDays = calculateDays();
  const remaining = balance?.remainingLeaves ?? 0;
  const isDaysInvalid = calculatedDays <= 0;
  const exceedsBalance =
    leaveType !== "Unpaid Leave" && calculatedDays > remaining && !editItem;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!fromDate || !toDate) {
      setFormError("Please select both From Date and To Date.");
      return;
    }

    if (calculatedDays <= 0) {
      setFormError("To Date must be on or after From Date.");
      return;
    }

    if (!reason.trim()) {
      setFormError("Please provide a reason for the leave request.");
      return;
    }

    if (exceedsBalance) {
      setFormError(
        `Requested duration (${calculatedDays} days) exceeds available leave balance (${remaining} days).`
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        leaveType,
        startDate: fromDate,
        endDate: toDate,
        days: `${calculatedDays} ${calculatedDays === 1 ? "Day" : "Days"}`,
        numberOfDays: calculatedDays,
        reason: reason.trim(),
        contactDuringLeave: contactDuringLeave.trim(),
        attachmentUrl: attachmentUrl.trim(),
      };

      if (editItem && editItem.id) {
        await hrApi.updateLeave(editItem.id, payload);
      } else {
        await hrApi.createLeave(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to submit leave request:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to submit leave request.";
      setFormError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div
        className="
          relative
          w-full
          max-w-[560px]
          max-h-[90vh]
          overflow-y-auto
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
        <div className="flex items-center justify-between border-b border-[#eee] pb-4">
          <div>
            <span className="font-mono text-[11px] tracking-[0.12em] text-[#9ca0a0] uppercase">
              {editItem ? "UPDATE REQUEST" : "NEW REQUEST"}
            </span>
            <h2 className="mt-0.5 font-serif text-[24px] text-[#11130f]">
              {editItem ? "Edit Leave Request" : "Apply for Leave"}
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

        {/* Balance Summary Banner */}
        <div className="mt-5 rounded-[16px] border border-[#e3e0d9] bg-[#f7f6f2] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] tracking-[0.12em] text-[#78807d] uppercase">
              LEAVE BALANCE SUMMARY
            </span>
            <span className="font-mono text-[10px] text-[#8e9291]">
              Year: {balance?.leaveYear || 2026}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="rounded-[10px] bg-white p-2 border border-[#eee]">
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#9da3a8]">
                Total
              </p>
              <p className="mt-0.5 font-serif text-[18px] text-[#11130f]">
                {balance?.totalLeaves ?? 18}
              </p>
            </div>
            <div className="rounded-[10px] bg-white p-2 border border-[#d8dfd1]">
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#53604e]">
                Remaining
              </p>
              <p className="mt-0.5 font-serif text-[18px] text-[#2d6a4f] font-semibold">
                {balance?.remainingLeaves ?? 18}
              </p>
            </div>
            <div className="rounded-[10px] bg-white p-2 border border-[#eee]">
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#9da3a8]">
                Pending
              </p>
              <p className="mt-0.5 font-serif text-[18px] text-[#b07d3b]">
                {balance?.pendingLeaves ?? 0}
              </p>
            </div>
            <div className="rounded-[10px] bg-white p-2 border border-[#eee]">
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#9da3a8]">
                Taken
              </p>
              <p className="mt-0.5 font-serif text-[18px] text-[#11130f]">
                {balance?.takenLeaves ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="mt-4 flex items-center gap-2 rounded-[12px] border border-[#f3c8c4] bg-[#fdf2f1] px-4 py-3 text-[#a8655c]">
            <AlertCircle size={16} className="shrink-0" />
            <p className="font-mono text-[12px]">{formError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Leave Type */}
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#69706d]">
              Leave Type <span className="text-[#a8655c]">*</span>
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="mt-1.5 w-full rounded-[12px] border border-[#d8d5cc] bg-white px-3.5 py-2.5 font-mono text-[13px] text-[#11130f] focus:border-[#11130f] focus:outline-none"
            >
              {LEAVE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#69706d]">
                From Date <span className="text-[#a8655c]">*</span>
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
                className="mt-1.5 w-full rounded-[12px] border border-[#d8d5cc] bg-white px-3.5 py-2.5 font-mono text-[13px] text-[#11130f] focus:border-[#11130f] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#69706d]">
                To Date <span className="text-[#a8655c]">*</span>
              </label>
              <input
                type="date"
                value={toDate}
                min={fromDate}
                onChange={(e) => setToDate(e.target.value)}
                required
                className="mt-1.5 w-full rounded-[12px] border border-[#d8d5cc] bg-white px-3.5 py-2.5 font-mono text-[13px] text-[#11130f] focus:border-[#11130f] focus:outline-none"
              />
            </div>
          </div>

          {/* Number of Days Display */}
          <div className="flex items-center justify-between rounded-[12px] border border-[#e3e0d9] bg-[#f9f8f5] px-4 py-2.5">
            <span className="font-mono text-[11px] text-[#717875] uppercase tracking-wider">
              Total Duration:
            </span>
            <span
              className={`font-mono text-[13px] font-semibold ${
                calculatedDays <= 0
                  ? "text-[#a8655c]"
                  : exceedsBalance
                  ? "text-[#a8655c]"
                  : "text-[#2d6a4f]"
              }`}
            >
              {calculatedDays > 0
                ? `${calculatedDays} ${calculatedDays === 1 ? "Day" : "Days"}`
                : "Invalid Range"}
            </span>
          </div>

          {/* Reason */}
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#69706d]">
              Reason <span className="text-[#a8655c]">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a brief reason for your leave request..."
              required
              className="mt-1.5 w-full rounded-[12px] border border-[#d8d5cc] bg-white px-3.5 py-2.5 font-mono text-[13px] text-[#11130f] placeholder-[#a2a6a4] focus:border-[#11130f] focus:outline-none"
            />
          </div>

          {/* Contact During Leave */}
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#69706d]">
              Contact During Leave{" "}
              <span className="text-[#9da3a8]">(Optional)</span>
            </label>
            <input
              type="text"
              value={contactDuringLeave}
              onChange={(e) => setContactDuringLeave(e.target.value)}
              placeholder="e.g. +91 98765 43210 or alternate email"
              className="mt-1.5 w-full rounded-[12px] border border-[#d8d5cc] bg-white px-3.5 py-2.5 font-mono text-[13px] text-[#11130f] placeholder-[#a2a6a4] focus:border-[#11130f] focus:outline-none"
            />
          </div>

          {/* Attachment (Optional) */}
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[#69706d]">
              Attachment URL / Document{" "}
              <span className="text-[#9da3a8]">(Optional)</span>
            </label>
            <input
              type="text"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder="e.g. https://documents.smarterp.ai/medical_cert.pdf"
              className="mt-1.5 w-full rounded-[12px] border border-[#d8d5cc] bg-white px-3.5 py-2.5 font-mono text-[13px] text-[#11130f] placeholder-[#a2a6a4] focus:border-[#11130f] focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#eee]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-[12px] border border-[#d8d5cc] bg-white px-5 py-2.5 font-mono text-[12px] text-[#4d5350] transition-colors hover:bg-[#f6f5f1]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isDaysInvalid || exceedsBalance}
              className="
                rounded-[12px]
                border
                border-[#151714]
                bg-[#151714]
                px-6
                py-2.5
                font-mono
                text-[12px]
                font-medium
                text-white
                shadow-sm
                transition-all
                hover:bg-[#2b2f29]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Submitting..."
                : editItem
                ? "Save Changes"
                : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
