import React, { useEffect, useState } from "react";
import hrApi from "./hrApiClient";

export default function EmployeeDatabase() {
    const [apiEmployees, setApiEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        hrApi
            .getEmployees()
            .then((response) => {
                setApiEmployees(Array.isArray(response.data) ? response.data : []);
                setError(null);
            })
            .catch((err) => {
                console.error("HR API error:", err);
                setError(err.message || "Failed to load employees from API");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="w-full">

            <div
                className="
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-[#e3e0d9]
                    bg-white
                "
            >

                {/* TITLE */}

                <div className="px-6 py-6">

                    <h2
                        className="
                            font-serif
                            text-[22px]
                            text-[#11130f]
                        "
                    >
                        Employee Database
                    </h2>

                    <p
                        className="
                            mt-1
                            font-mono
                            text-[10px]
                            text-[#969e9a]
                        "
                    >
                        Manage employee records and information
                    </p>

                </div>


                {/* TABLE */}

                <div className="w-full overflow-x-auto">

                    <div className="min-w-[1050px]">

                        {/* HEADER */}

                        <div
                            className="
                                grid
                                grid-cols-[10%_20%_12%_17%_13%_11%_10%_7%]
                                border-y
                                border-[#e5e3dc]
                                bg-[#faf9f6]
                                px-6
                                py-4
                                font-mono
                                text-[9px]
                                font-medium
                                uppercase
                                tracking-[0.12em]
                                text-[#a0a39e]
                            "
                        >

                            <div>ID</div>
                            <div>EMPLOYEE</div>
                            <div>DEPARTMENT</div>
                            <div>DESIGNATION</div>
                            <div>BRANCH</div>
                            <div>JOINED</div>
                            <div>SALARY</div>
                            <div>STATUS</div>

                        </div>


                        {/* LOADING STATE */}
                        {loading && (
                            <div className="px-6 py-12 text-center font-mono text-[11px] text-[#969e9a]">
                                Loading employee records from API...
                            </div>
                        )}

                        {/* ERROR STATE */}
                        {!loading && error && (
                            <div className="px-6 py-12 text-center font-mono text-[11px] text-[#8a635b]">
                                Error loading employee data: {error}
                            </div>
                        )}

                        {/* EMPTY STATE */}
                        {!loading && !error && apiEmployees.length === 0 && (
                            <div className="px-6 py-12 text-center font-mono text-[11px] text-[#969e9a]">
                                No employee records found in database.
                            </div>
                        )}

                        {/* API ROWS */}
                        {!loading && !error && apiEmployees.map((employee) => {
                            const displayName = employee.name || `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || '—';
                            const displayInitials = employee.initials || (displayName !== '—' ? displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'EM');
                            const displaySalary = employee.formattedSalary || (employee.salary ? `₹${Number(employee.salary).toLocaleString('en-IN')}` : '—');
                            const displayJoined = employee.joined || employee.joiningDate || '—';

                            return (
                                <div
                                    key={employee.id}
                                    className="
                                        group
                                        grid
                                        grid-cols-[10%_20%_12%_17%_13%_11%_10%_7%]
                                        items-center
                                        border-b
                                        border-[#e8e6df]
                                        px-6
                                        py-5
                                        last:border-b-0
                                        transition-all
                                        duration-200
                                        hover:bg-[#f1f1ec]
                                    "
                                >

                                    {/* ID */}
                                    <div
                                        className="
                                            text-[11px]
                                            text-[#a1a6ae]
                                        "
                                    >
                                        {employee.employeeCode || employee.id}
                                    </div>


                                    {/* EMPLOYEE */}
                                    <div className="flex items-center gap-3">

                                        <div
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-[#dfe4da]
                                                bg-[#f1f3ee]
                                                text-[9px]
                                                text-[#5e675a]
                                            "
                                        >
                                            {displayInitials}
                                        </div>

                                        <p
                                            className="
                                                truncate
                                                font-serif
                                                text-[15px]
                                                text-[#171916]
                                            "
                                        >
                                            {displayName}
                                        </p>

                                    </div>


                                    {/* DEPARTMENT */}
                                    <div className="text-[11px] text-[#68716a]">
                                        {employee.department || '—'}
                                    </div>


                                    {/* DESIGNATION */}
                                    <div className="text-[11px] text-[#68716a]">
                                        {employee.designation || '—'}
                                    </div>


                                    {/* BRANCH */}
                                    <div className="text-[11px] text-[#858b85]">
                                        {employee.branch || '—'}
                                    </div>


                                    {/* JOINED */}
                                    <div className="text-[10px] text-[#858b85]">
                                        {displayJoined}
                                    </div>


                                    {/* SALARY */}
                                    <div
                                        className="
                                            text-[12px]
                                            font-medium
                                            text-[#171916]
                                        "
                                    >
                                        {displaySalary}
                                    </div>


                                    {/* STATUS */}
                                    <div>

                                        <span
                                            className="
                                                inline-flex
                                                rounded-[10px]
                                                bg-[#e3ebdf]
                                                px-3
                                                py-1.5
                                                text-[8px]
                                                tracking-[0.08em]
                                                text-[#53624f]
                                            "
                                        >
                                            {employee.status || 'Active'}
                                        </span>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </div>

        </div>
    );
}