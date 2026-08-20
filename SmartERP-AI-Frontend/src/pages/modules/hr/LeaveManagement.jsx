import React, { useState } from "react";

const initialLeaves = [
    {
        id: "LV-2026-0389",
        employee: "Rohan Verma",
        dept: "Sales",
        type: "Casual Leave",
        from: "11 Aug 2026",
        to: "12 Aug 2026",
        days: "2d",
        status: "PENDING",
    },
    {
        id: "LV-2026-0388",
        employee: "Smita Gupta",
        dept: "HR",
        type: "Sick Leave",
        from: "09 Aug 2026",
        to: "10 Aug 2026",
        days: "2d",
        status: "APPROVED",
    },
    {
        id: "LV-2026-0387",
        employee: "Aditya Kumar",
        dept: "IT",
        type: "Earned Leave",
        from: "15 Aug 2026",
        to: "20 Aug 2026",
        days: "4d",
        status: "PENDING",
    },
    {
        id: "LV-2026-0386",
        employee: "Kavya Reddy",
        dept: "Marketing",
        type: "Casual Leave",
        from: "08 Aug 2026",
        to: "08 Aug 2026",
        days: "1d",
        status: "REJECTED",
    },
];

const statusStyle = {
    PENDING: "bg-[#eeeef2] text-[#717389]",
    APPROVED: "bg-[#e3ebdf] text-[#53624f]",
    REJECTED: "bg-[#eee2df] text-[#8a635b]",
};

export default function LeaveManagement() {
    const [leaves, setLeaves] = useState(initialLeaves);

    const handleApprove = (id) => {
        setLeaves((currentLeaves) =>
            currentLeaves.map((leave) =>
                leave.id === id
                    ? { ...leave, status: "APPROVED" }
                    : leave
            )
        );
    };

    const handleReject = (id) => {
        setLeaves((currentLeaves) =>
            currentLeaves.map((leave) =>
                leave.id === id
                    ? { ...leave, status: "REJECTED" }
                    : leave
            )
        );
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
                        {pendingCount} pending approval
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


                    {/* TABLE ROWS */}
                    {leaves.map((leave) => (

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
                                {leave.id}
                            </div>


                            {/* EMPLOYEE */}
                            <div
                                className="
                                    font-serif
                                    text-[15px]
                                    text-[#171916]
                                "
                            >
                                {leave.employee}
                            </div>


                            {/* DEPARTMENT */}
                            <div
                                className="
                                    text-[11px]
                                    text-[#68716a]
                                "
                            >
                                {leave.dept}
                            </div>


                            {/* TYPE */}
                            <div
                                className="
                                    text-[11px]
                                    text-[#68716a]
                                "
                            >
                                {leave.type}
                            </div>


                            {/* FROM */}
                            <div
                                className="
                                    text-[10px]
                                    text-[#858b85]
                                "
                            >
                                {leave.from}
                            </div>


                            {/* TO */}
                            <div
                                className="
                                    text-[10px]
                                    text-[#858b85]
                                "
                            >
                                {leave.to}
                            </div>


                            {/* DAYS */}
                            <div
                                className="
                                    text-[11px]
                                    font-medium
                                    text-[#171916]
                                "
                            >
                                {leave.days}
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
                                        ${statusStyle[leave.status]}
                                    `}
                                >
                                    {leave.status}
                                </span>


                                {/* ACTION BUTTONS
                                    ONLY FOR PENDING
                                    AND ONLY VISIBLE ON HOVER
                                */}
                                {leave.status === "PENDING" && (

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                            opacity-0
                                            pointer-events-none
                                            translate-x-1
                                            transition-all
                                            duration-200
                                            group-hover:translate-x-0
                                            group-hover:opacity-100
                                            group-hover:pointer-events-auto
                                        "
                                    >

                                        {/* APPROVE */}
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


                                        {/* REJECT */}
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

                                    </div>

                                )}

                            </div>

                        </div>

                    ))}

                </div>

            </section>

        </div>
    );
}