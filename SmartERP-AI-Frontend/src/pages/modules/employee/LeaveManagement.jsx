import React, { useState, useEffect, useMemo } from "react";
import {
  Download,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileSpreadsheet,
  Check,
  X,
} from "lucide-react";
import storageService from "../../../core/services/storage.service";
import hrApi from "../hr/hrApiClient";
import ApplyLeaveModal from "./ApplyLeaveModal";
import ViewLeaveModal from "./ViewLeaveModal";

const AVAILABLE_YEARS = [2026, 2025, 2024, 2023];

const STATUS_FILTERS = [
  { id: "ALL", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
];

export default function LeaveManagement() {
  const user = storageService.getUser();
  // Normalize all possible role formats:
  //   ROLE_HR_MANAGER  → HR_MANAGER
  //   HR_MANAGER       → HR_MANAGER
  //   hrManager        → HR_MANAGER
  //   ROLE_TENANT_ADMIN → TENANT_ADMIN
  //   tenantAdmin      → TENANT_ADMIN
  //   ROLE_SUPER_ADMIN → SUPER_ADMIN
  //   superAdmin       → SUPER_ADMIN
  const _rawRole = String(user?.role || user?.roles?.[0] || "");
  const _camelToSnake = (s) =>
    s.replace(/([A-Z])/g, "_$1").toUpperCase().replace(/^_/, "");
  const role = _rawRole.includes("_")
    ? _rawRole.toUpperCase().replace(/^ROLE_/, "")
    : _camelToSnake(_rawRole).replace(/^ROLE_/, "");
  const isApprover = ["HR_MANAGER", "TENANT_ADMIN", "SUPER_ADMIN"].includes(role);

  const [selectedYear, setSelectedYear] = useState(2026);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState({
    totalLeaves: 18,
    remainingLeaves: 18,
    pendingLeaves: 0,
    takenLeaves: 0,
    leaveYear: 2026,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [editingLeave, setEditingLeave] = useState(null);

  // Confirmation state
  const [cancellingId, setCancellingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch balance and leaves
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [balanceRes, leavesRes] = await Promise.all([
        hrApi.getLeaveBalance(selectedYear).catch(() => null),
        hrApi.getLeaves().catch(() => null),
      ]);

      if (balanceRes?.data) {
        setBalance(balanceRes.data);
      }

      if (leavesRes?.data) {
        setLeaves(Array.isArray(leavesRes.data) ? leavesRes.data : []);
      }
    } catch (err) {
      console.error("Failed to fetch leave data:", err);
      setError("Unable to load leave details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  // Filter leaves
  const filteredLeaves = useMemo(() => {
    return leaves.filter((item) => {
      // Filter by year if applicable
      const startYear = item.startDate
        ? new Date(item.startDate).getFullYear()
        : null;
      if (startYear && startYear !== selectedYear) return false;

      // Filter by status tab
      if (activeFilter === "ALL") return true;
      return item.status === activeFilter;
    });
  }, [leaves, selectedYear, activeFilter]);

  // Handlers
  const handleOpenApply = () => {
    setEditingLeave(null);
    setApplyModalOpen(true);
  };

  const handleOpenEdit = (leave) => {
    setEditingLeave(leave);
    setApplyModalOpen(true);
  };

  const handleOpenView = (leave) => {
    setSelectedLeave(leave);
    setViewModalOpen(true);
  };

  const handleCancelLeave = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this leave request?")) {
      return;
    }
    setActionLoading(true);
    try {
      await hrApi.deleteLeave(id);
      await fetchData();
    } catch (err) {
      console.error("Failed to cancel leave request:", err);
      alert(
        err.response?.data?.message || "Failed to cancel leave request."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveLeave = async (id) => {
    if (!window.confirm("Are you sure you want to approve this leave request?")) {
      return;
    }
    setActionLoading(true);
    try {
      await hrApi.approveLeave(id);
      await fetchData();
    } catch (err) {
      console.error("Failed to approve leave request:", err);
      const msg = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to approve leave request.";
      alert(`Approval failed: ${msg}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectLeave = async (id) => {
    if (!window.confirm("Are you sure you want to reject this leave request?")) {
      return;
    }
    setActionLoading(true);
    try {
      await hrApi.rejectLeave(id);
      await fetchData();
    } catch (err) {
      console.error("Failed to reject leave request:", err);
      const msg = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to reject leave request.";
      alert(`Rejection failed: ${msg}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const res = await hrApi.exportLeaves(selectedYear);
      // Trigger browser download
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `leave_requests_${selectedYear}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export leaves CSV:", err);
      alert("Failed to export leave requests to CSV.");
    }
  };

  // Status badge renderer
  const renderStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e3ebdf] px-3 py-1 font-mono text-[11px] font-medium text-[#3b593a]">
            <CheckCircle size={12} />
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fce8e6] px-3 py-1 font-mono text-[11px] font-medium text-[#a84439]">
            <XCircle size={12} />
            Rejected
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eae9e5] px-3 py-1 font-mono text-[11px] font-medium text-[#737875]">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3dc] px-3 py-1 font-mono text-[11px] font-medium text-[#996a1e]">
            <Clock size={12} />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* =========================================================
          TOP BAR / CONTROLS
          ========================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-[28px] leading-tight text-[#11130f]">
            Leave Management
          </h2>
          <p className="mt-1 font-mono text-[12px] text-[#8e9291]">
            Track leave entitlements, balances, and request history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Year selector */}
          <div className="flex items-center gap-2 rounded-[14px] border border-[#e3e0d9] bg-white px-3 py-2 shadow-sm">
            <Calendar size={14} className="text-[#8e9291]" />
            <span className="font-mono text-[11px] text-[#8e9291] uppercase tracking-wider">
              Year:
            </span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent font-mono text-[13px] font-semibold text-[#11130f] focus:outline-none cursor-pointer"
            >
              {AVAILABLE_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="
              inline-flex
              items-center
              gap-2
              rounded-[14px]
              border
              border-[#e3e0d9]
              bg-white
              px-4
              py-2.5
              font-mono
              text-[12px]
              text-[#333835]
              shadow-sm
              transition-colors
              hover:bg-[#f2f1ec]
              hover:border-[#d5d1c8]
            "
          >
            <Download size={14} />
            Export
          </button>

          {/* + Apply Leave Button */}
          <button
            type="button"
            onClick={handleOpenApply}
            className="
              inline-flex
              items-center
              gap-2
              rounded-[14px]
              border
              border-[#151714]
              bg-[#151714]
              px-5
              py-2.5
              font-mono
              text-[12px]
              font-medium
              text-white
              shadow-sm
              transition-all
              hover:bg-[#2b2f29]
              hover:shadow-md
            "
          >
            <Plus size={15} />
            Apply Leave
          </button>
        </div>
      </div>

      {/* =========================================================
          4 BALANCE CARDS
          ========================================================= */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL LEAVES */}
        <div
          className="
            min-h-[125px]
            rounded-[20px]
            border
            border-[#e3e0d9]
            bg-white
            px-5
            py-5
            shadow-[0_2px_8px_rgba(32,34,31,0.02)]
            transition-all
            duration-200
            hover:-translate-y-[2px]
            hover:border-[#d5d1c8]
            hover:shadow-[0_8px_24px_rgba(32,34,31,0.04)]
          "
        >
          <p className="font-mono text-[10px] tracking-[0.16em] text-[#9da3a8] uppercase">
            TOTAL LEAVES
          </p>
          <p className="mt-3 font-serif text-[30px] leading-none text-[#11130f]">
            {loading ? "—" : balance.totalLeaves ?? 18}
          </p>
          <p className="mt-4 font-mono text-[11px] text-[#6b726f]">
            Casual + Sick
          </p>
        </div>

        {/* REMAINING */}
        <div
          className="
            min-h-[125px]
            rounded-[20px]
            border
            border-[#e3e0d9]
            bg-white
            px-5
            py-5
            shadow-[0_2px_8px_rgba(32,34,31,0.02)]
            transition-all
            duration-200
            hover:-translate-y-[2px]
            hover:border-[#d5d1c8]
            hover:shadow-[0_8px_24px_rgba(32,34,31,0.04)]
          "
        >
          <p className="font-mono text-[10px] tracking-[0.16em] text-[#9da3a8] uppercase">
            REMAINING
          </p>
          <p className="mt-3 font-serif text-[30px] leading-none text-[#2d6a4f] font-semibold">
            {loading ? "—" : balance.remainingLeaves ?? 18}
          </p>
          <p className="mt-4 font-mono text-[11px] text-[#2d6a4f]">
            Available to use
          </p>
        </div>

        {/* PENDING */}
        <div
          className="
            min-h-[125px]
            rounded-[20px]
            border
            border-[#e3e0d9]
            bg-white
            px-5
            py-5
            shadow-[0_2px_8px_rgba(32,34,31,0.02)]
            transition-all
            duration-200
            hover:-translate-y-[2px]
            hover:border-[#d5d1c8]
            hover:shadow-[0_8px_24px_rgba(32,34,31,0.04)]
          "
        >
          <p className="font-mono text-[10px] tracking-[0.16em] text-[#9da3a8] uppercase">
            PENDING
          </p>
          <p className="mt-3 font-serif text-[30px] leading-none text-[#b07d3b]">
            {loading ? "—" : balance.pendingLeaves ?? 0}
          </p>
          <p className="mt-4 font-mono text-[11px] text-[#b07d3b]">
            Awaiting approval
          </p>
        </div>

        {/* TAKEN */}
        <div
          className="
            min-h-[125px]
            rounded-[20px]
            border
            border-[#e3e0d9]
            bg-white
            px-5
            py-5
            shadow-[0_2px_8px_rgba(32,34,31,0.02)]
            transition-all
            duration-200
            hover:-translate-y-[2px]
            hover:border-[#d5d1c8]
            hover:shadow-[0_8px_24px_rgba(32,34,31,0.04)]
          "
        >
          <p className="font-mono text-[10px] tracking-[0.16em] text-[#9da3a8] uppercase">
            TAKEN
          </p>
          <p className="mt-3 font-serif text-[30px] leading-none text-[#11130f]">
            {loading ? "—" : balance.takenLeaves ?? 0}
          </p>
          <p className="mt-4 font-mono text-[11px] text-[#6b726f]">
            This year
          </p>
        </div>
      </section>

      {/* =========================================================
          TABLE CONTAINER
          ========================================================= */}
      <section
        className="
          w-full
          overflow-hidden
          rounded-[20px]
          border
          border-[#e3e0d9]
          bg-white
          shadow-[0_4px_16px_rgba(32,34,31,0.03)]
        "
      >
        {/* Filter Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#eee] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`
                  rounded-[10px]
                  px-3.5
                  py-1.5
                  font-mono
                  text-[11px]
                  tracking-wide
                  transition-all
                  ${
                    activeFilter === f.id
                      ? "border border-[#d8d5cc] bg-[#f6f5f1] font-semibold text-[#11130f] shadow-xs"
                      : "text-[#8d9696] hover:bg-[#faf9f5] hover:text-[#11130f]"
                  }
                `}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="font-mono text-[11px] text-[#8e9291]">
            Showing {filteredLeaves.length} of {leaves.length} requests
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#eee] bg-[#faf9f5]">
                {isApprover && (
                  <th className="px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8e9291]">
                    Employee
                  </th>
                )}
                <th className="px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8e9291]">
                  From Date
                </th>
                <th className="px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8e9291]">
                  To Date
                </th>
                <th className="px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8e9291]">
                  Leave Type
                </th>
                <th className="px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8e9291]">
                  Days
                </th>
                <th className="px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8e9291]">
                  Reason
                </th>
                <th className="px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8e9291]">
                  Status
                </th>
                <th className="px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8e9291]">
                  Applied On
                </th>
                <th className="px-5 py-3.5 text-right font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8e9291]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eee8]">
              {loading ? (
                <tr>
                  <td colSpan={isApprover ? 9 : 8} className="py-12 text-center">
                    <p className="font-mono text-[13px] text-[#8e9291]">
                      Loading leave requests...
                    </p>
                  </td>
                </tr>
              ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={isApprover ? 9 : 8} className="py-12 text-center">
                    <p className="font-mono text-[13px] text-[#8e9291]">
                      No leave requests found for {selectedYear}{" "}
                      {activeFilter !== "ALL" ? `(${activeFilter})` : ""}.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr
                    key={leave.id || leave.leaveCode}
                    className="transition-colors hover:bg-[#fcfbfa]"
                  >
                    {/* Employee (Approvers only) */}
                    {isApprover && (
                      <td className="px-5 py-4 font-serif text-[14px] font-medium text-[#11130f]">
                        {leave.employeeName || leave.employee || "—"}
                      </td>
                    )}

                    {/* From Date */}
                    <td className="px-5 py-4 font-mono text-[12px] font-medium text-[#11130f]">
                      {leave.formattedFrom || leave.startDate || "—"}
                    </td>

                    {/* To Date */}
                    <td className="px-5 py-4 font-mono text-[12px] font-medium text-[#11130f]">
                      {leave.formattedTo || leave.endDate || "—"}
                    </td>

                    {/* Leave Type */}
                    <td className="px-5 py-4 font-mono text-[12px] text-[#333835]">
                      {leave.leaveType || leave.type || "Casual Leave"}
                    </td>

                    {/* Days */}
                    <td className="px-5 py-4 font-mono text-[12px] font-semibold text-[#11130f]">
                      {leave.days || `${leave.numberOfDays || 1} Days`}
                    </td>

                    {/* Reason */}
                    <td className="max-w-[200px] truncate px-5 py-4 font-mono text-[12px] text-[#6b726f]" title={leave.reason}>
                      {leave.reason || "—"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {renderStatusBadge(leave.status)}
                    </td>

                    {/* Applied On */}
                    <td className="px-5 py-4 font-mono text-[11px] text-[#8e9291]">
                      {leave.appliedOn || (leave.createdAt ? String(leave.createdAt).slice(0, 10) : "—")}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Approver Approve / Reject on PENDING */}
                        {isApprover && leave.status === "PENDING" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApproveLeave(leave.id)}
                              disabled={actionLoading}
                              title="Approve Request"
                              className="inline-flex items-center gap-1 rounded-[8px] border border-[#cfdacb] bg-[#f1f5ee] px-2.5 py-1 font-mono text-[11px] font-medium text-[#53624f] transition-colors hover:bg-[#dfe9db]"
                            >
                              <Check size={13} />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectLeave(leave.id)}
                              disabled={actionLoading}
                              title="Reject Request"
                              className="inline-flex items-center gap-1 rounded-[8px] border border-[#dfcbc7] bg-[#f6efed] px-2.5 py-1 font-mono text-[11px] font-medium text-[#8a635b] transition-colors hover:bg-[#eadbd8]"
                            >
                              <X size={13} />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        {/* View */}
                        <button
                          type="button"
                          onClick={() => handleOpenView(leave)}
                          title="View Details"
                          className="rounded-[8px] p-1.5 text-[#6c7471] transition-colors hover:bg-[#f2f1ec] hover:text-[#11130f]"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Edit (standard employee if pending) */}
                        {!isApprover && leave.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(leave)}
                            title="Edit Request"
                            className="rounded-[8px] p-1.5 text-[#6c7471] transition-colors hover:bg-[#f2f1ec] hover:text-[#11130f]"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}

                        {/* Cancel / Delete (standard employee if pending) */}
                        {!isApprover && leave.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => handleCancelLeave(leave.id)}
                            disabled={actionLoading}
                            title="Cancel Request"
                            className="rounded-[8px] p-1.5 text-[#a84439] transition-colors hover:bg-[#fce8e6]"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================
          MODALS
          ========================================================= */}
      <ApplyLeaveModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onSuccess={fetchData}
        balance={balance}
        editItem={editingLeave}
      />

      <ViewLeaveModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        leave={selectedLeave}
        onEdit={!isApprover ? (leave) => {
          setViewModalOpen(false);
          handleOpenEdit(leave);
        } : null}
        onCancel={!isApprover ? handleCancelLeave : null}
      />
    </div>
  );
}
