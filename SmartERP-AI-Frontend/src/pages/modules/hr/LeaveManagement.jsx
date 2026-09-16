import React, { useState, useEffect } from "react";
import hrApi from "./hrApiClient";
import ViewLeaveModal from "../employee/ViewLeaveModal";

const statusStyle = {
    PENDING: "bg-[#eeeef2] text-[#717389]",
    APPROVED: "bg-[#e3ebdf] text-[#53624f]",
    REJECTED: "bg-[#eee2df] text-[#8a635b]",
};

export default function LeaveManagement() {
    const [leaves, setLeaves] = useState([]);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLeaves = () => {
        setLoading(true);
        hrApi.getLeaves()
            .then((res) => {
                setLeaves(Array.isArray(res.data) ? res.data : []);
                setError(null);
            })
            .catch((err) => {
                console.error("Failed to load leave requests:", err);
                setError(err.message || "Failed to load leave requests");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleApprove = (id) => {
        if (!window.confirm("Are you sure you want to approve this leave request?")) {
            return;
        }
        hrApi.approveLeave(id)
            .then(() => {
                fetchLeaves();
            })
            .catch((err) => {
                console.error("Failed to approve leave:", err);
                const msg = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to approve leave";
                alert(`Approval failed: ${msg}`);
            });
    };

    const handleReject = (id) => {
        if (!window.confirm("Are you sure you want to reject this leave request?")) {
            return;
        }
        hrApi.rejectLeave(id)
            .then(() => {
                fetchLeaves();
            })
            .catch((err) => {
                console.error("Failed to reject leave:", err);
                const msg = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to reject leave";
                alert(`Rejection failed: ${msg}`);
            });
    };

    const pendingCount = leaves.filter(
        (leave) => leave.status === "PENDING"
    ).length;

    return (
        <div className="w-full">

            {/* MAIN CARD */}
            <section
                className="
                    w-full
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-[#e3e0d9]
                    bg-white
                "
            >

                {/* HEADER */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-6
                        py-6
                        border-b
                        border-[#e5e3dc]
                    "
                >

                    <div>

                        <h2
                            className="
                                font-serif
                                text-[22px]
                                leading-none
                                text-[#11130f]
                            "
                        >
                            Leave Requests
                        </h2>

                        <p
                            className="
                                mt-2
                                font-mono
                                text-[10px]
                                text-[#969e9a]
                            "
                        >
                            Review and manage employee leave requests
                        </p>

                    </div>

                    <span
                        className="
                            whitespace-nowrap
                            font-mono
                            text-[10px]
                            text-[#8f9694]
                        "
                    >
                        {loading ? "..." : `${pendingCount} pending approval`}
                    </span>

                </div>


                {/* TABLE */}
                <div className="w-full">

                    {/* TABLE HEADER */}
                    <div
                        className="
                            grid
                            grid-cols-[14%_17%_9%_15%_11%_11%_6%_17%]
                            items-center
                            border-b
                            border-[#e5e3dc]
                            bg-[#faf9f6]
                            px-5
                            py-4
                            font-mono
                            text-[9px]
                            uppercase
                            tracking-[0.12em]
                            text-[#a0a39e]
                        "
                    >

                        <div>ID</div>

                        <div>EMPLOYEE</div>

                        <div>DEPT</div>

                        <div>TYPE</div>

                        <div>FROM</div>

                        <div>TO</div>

                        <div>DAYS</div>

                        <div>STATUS</div>

                    </div>

                    {/* LOADING STATE */}
                    {loading && (
                        <div className="px-6 py-12 text-center font-mono text-[11px] text-[#969e9a]">
                            Loading leave requests from API...
                        </div>
                    )}

                    {/* ERROR STATE */}
                    {!loading && error && (
                        <div className="px-6 py-12 text-center font-mono text-[11px] text-[#8a635b]">
                            Error loading leave requests: {error}
                        </div>
                    )}

                    {/* EMPTY STATE */}
                    {!loading && !error && leaves.length === 0 && (
                        <div className="px-6 py-12 text-center font-mono text-[11px] text-[#969e9a]">
                            No leave requests found in database.
                        </div>
                    )}

                    {/* TABLE ROWS */}
                    {!loading && !error && leaves.map((leave) => {
                        const displayId = leave.leaveCode || leave.id;
                        const displayEmployee = leave.employee || leave.employeeName || "—";
                        const displayDept = leave.dept || leave.department || "—";
                        const displayType = leave.type || leave.leaveType || "—";
                        const displayFrom = leave.from || (leave.startDate ? String(leave.startDate) : "—");
                        const displayTo = leave.to || (leave.endDate ? String(leave.endDate) : "—");
                        const displayDays = leave.days || "1d";
                        const displayStatus = leave.status || "PENDING";
                        const statusBadgeClass = statusStyle[displayStatus] || "bg-[#eeeef2] text-[#717389]";

                        return (

                        <div
                            key={leave.id}
                            className="
                                group
                                grid
                                grid-cols-[14%_17%_9%_15%_11%_11%_6%_17%]
                                items-center
                                px-5
                                py-5
                                border-b
                                border-[#e8e6df]
                                last:border-b-0
                                transition-colors
                                duration-200
                                hover:bg-[#f1f1ec]
                            "
                        >

                            {/* ID */}
                            <div
                                className="
                                    text-[10px]
                                    text-[#9ca3ad]
                                "
                            >
                                {displayId}
                            </div>


                            {/* EMPLOYEE */}
                            <div
                                className="
                                    font-serif
                                    text-[15px]
                                    text-[#171916]
                                "
                            >
                                {displayEmployee}
                            </div>


                            {/* DEPARTMENT */}
                            <div
                                className="
                                    text-[11px]
                                    text-[#68716a]
                                "
                            >
                                {displayDept}
                            </div>


                            {/* TYPE */}
                            <div
                                className="
                                    text-[11px]
                                    text-[#68716a]
                                "
                            >
                                {displayType}
                            </div>


                            {/* FROM */}
                            <div
                                className="
                                    text-[10px]
                                    text-[#858b85]
                                "
                            >
                                {displayFrom}
                            </div>


                            {/* TO */}
                            <div
                                className="
                                    text-[10px]
                                    text-[#858b85]
                                "
                            >
                                {displayTo}
                            </div>


                            {/* DAYS */}
                            <div
                                className="
                                    text-[11px]
                                    font-medium
                                    text-[#171916]
                                "
                            >
                                {displayDays}
                            </div>


                            {/* STATUS + ACTIONS */}
                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    justify-between
                                    gap-2
                                "
                            >

                                {/* STATUS */}
                                <span
                                    className={`
                                        inline-flex
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-[10px]
                                        px-3
                                        py-2
                                        text-[8px]
                                        tracking-[0.08em]
                                        ${statusBadgeClass}
                                    `}
                                >
                                    {displayStatus}
                                </span>


                                {/* ACTION BUTTONS — ALWAYS VISIBLE */}
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-1.5
                                    "
                                >

                                    {/* VIEW */}
                                    <button
                                        type="button"
                                        onClick={() => setSelectedLeave(leave)}
                                        className="
                                            shrink-0
                                            rounded-[9px]
                                            border
                                            border-[#d8d5cc]
                                            bg-white
                                            px-2.5
                                            py-2
                                            text-[8px]
                                            text-[#4d5350]
                                            transition-colors
                                            duration-150
                                            hover:bg-[#f1f1ec]
                                        "
                                    >
                                        View
                                    </button>

                                    {/* APPROVE */}
                                    {leave.status === "PENDING" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleApprove(leave.id)
                                            }
                                            className="
                                                shrink-0
                                                rounded-[9px]
                                                border
                                                border-[#cfdacb]
                                                bg-[#f1f5ee]
                                                px-3
                                                py-2
                                                text-[8px]
                                                text-[#53624f]
                                                transition-colors
                                                duration-150
                                                hover:bg-[#dfe9db]
                                            "
                                        >
                                            Approve
                                        </button>
                                    )}

                                    {/* REJECT */}
                                    {leave.status === "PENDING" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleReject(leave.id)
                                            }
                                            className="
                                                shrink-0
                                                rounded-[9px]
                                                border
                                                border-[#dfcbc7]
                                                bg-[#f6efed]
                                                px-3
                                                py-2
                                                text-[8px]
                                                text-[#8a635b]
                                                transition-colors
                                                duration-150
                                                hover:bg-[#eadbd8]
                                            "
                                        >
                                            Reject
                                        </button>
                                    )}

                                </div>

                            </div>

                        </div>
                        );
                    })}

                </div>

            </section>

            <ViewLeaveModal
                isOpen={!!selectedLeave}
                onClose={() => setSelectedLeave(null)}
                leave={selectedLeave}
            />

        </div>
    );
}