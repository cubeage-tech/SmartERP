import { useState, useEffect } from "react";

import EmployeeDatabase from "./EmployeeDatabase";
import Attendance from "./Attendance";
import LeaveManagement from "./LeaveManagement";
import Payroll from "./Payroll";
import PerformanceTracking from "./PerformanceTracking";
import AddEmployeeModal from "./AddEmployeeModal";
import hrApi from "./hrApiClient";

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState("employees");
    const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchDashboardData = () => {
        setLoading(true);
        hrApi.getDashboard()
            .then((res) => {
                setDashboardData(res.data);
            })
            .catch((err) => {
                console.error("Failed to load HR dashboard data:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleEmployeeCreated = () => {
        setRefreshKey((prev) => prev + 1);
        fetchDashboardData();
    };

    const navigation = [
        {
            id: "employees",
            label: "EMPLOYEES",
        },
        {
            id: "attendance",
            label: "ATTENDANCE",
        },
        {
            id: "leaves",
            label: "LEAVES",
        },
        {
            id: "payroll",
            label: "PAYROLL",
        },
        {
            id: "performance",
            label: "PERFORMANCE",
        },
    ];

    const handleSectionChange = (section) => {
        setActiveSection(section);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const renderSection = () => {
        switch (activeSection) {
            case "employees":
                return <EmployeeDatabase key={refreshKey} />;

            case "attendance":
                return <Attendance />;

            case "leaves":
                return <LeaveManagement />;

            case "payroll":
                return <Payroll />;

            case "performance":
                return <PerformanceTracking />;

            default:
                return <EmployeeDatabase key={refreshKey} />;
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f6f5f1] text-[#11130f]">

            {/* =====================================================
                HR HEADER
            ====================================================== */}

            <div className="px-5 pt-7 sm:px-7 lg:px-8 lg:pt-8">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                    {/* TITLE */}

                    <div>

                        <p className="
                            mb-3
                            font-mono
                            text-[10px]
                            tracking-[0.12em]
                            text-[#91a0a0]
                        ">
                            PEOPLE
                        </p>

                        <h1 className="
                            font-serif
                            text-[32px]
                            leading-none
                            text-[#11130f]
                            sm:text-[34px]
                        ">
                            HR &amp; Payroll
                        </h1>

                        <p className="
                            mt-3
                            max-w-[620px]
                            font-mono
                            text-[11px]
                            leading-relaxed
                            text-[#929a97]
                        ">
                            Manage employees, attendance, leaves, payroll and
                            performance.
                        </p>

                    </div>


                    {/* HEADER ACTIONS */}

                    <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                    ">

                        <button
                            type="button"
                            onClick={() => handleSectionChange("payroll")}
                            className="
                                rounded-[15px]
                                border
                                border-[#e2dfd7]
                                bg-white
                                px-5
                                py-3
                                font-mono
                                text-[11px]
                                text-[#303531]
                                transition-all
                                duration-200
                                hover:-translate-y-[1px]
                                hover:bg-[#efeee9]
                                hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                            "
                        >
                            Run Payroll
                        </button>

                        <button
                            type="button"
                            onClick={() => setAddEmployeeOpen(true)}
                            className="
                                rounded-[15px]
                                bg-[#11130f]
                                px-5
                                py-3
                                font-mono
                                text-[11px]
                                text-white
                                transition-all
                                duration-200
                                hover:-translate-y-[1px]
                                hover:bg-[#292c27]
                                hover:shadow-[0_5px_14px_rgba(0,0,0,0.12)]
                            "
                        >
                            + Add Employee
                        </button>

                    </div>

                </div>


                {/* =================================================
                    SUMMARY CARDS
                ================================================== */}

                <div className="
                    mt-9
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                ">

                    <SummaryCard
                        amount={loading ? "—" : (dashboardData?.totalEmployees != null ? String(dashboardData.totalEmployees) : "0")}
                        label="TOTAL EMPLOYEES"
                        description={loading ? "Loading..." : (dashboardData?.totalEmployeesChange || "Active workforce")}
                    />

                    <SummaryCard
                        amount={loading ? "—" : (dashboardData?.monthlyPayroll || "₹0")}
                        label="MONTHLY PAYROLL"
                        description={loading ? "Loading..." : (dashboardData?.monthlyPayrollPeriod || "Current cycle")}
                    />

                    <SummaryCard
                        amount={loading ? "—" : (dashboardData?.leaveRequestsPending != null ? String(dashboardData.leaveRequestsPending) : "0")}
                        label="LEAVE REQUESTS"
                        description={loading ? "Loading..." : (dashboardData?.leaveRequestsDescription || "Pending review")}
                    />

                    <SummaryCard
                        amount={loading ? "—" : (dashboardData?.attendanceRate || "—")}
                        label="ATTENDANCE"
                        description={loading ? "Loading..." : (dashboardData?.attendanceRateToday || "Today's rate")}
                    />

                </div>


                {/* =================================================
                    HR NAVIGATION
                ================================================== */}

                <div className="
                    mt-7
                    flex
                    flex-wrap
                    items-center
                    gap-2
                ">

                    {navigation.map((item) => (

                        <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSectionChange(item.id)}
                            className={`
                                rounded-[12px]
                                px-5
                                py-3
                                font-mono
                                text-[10px]
                                tracking-[0.06em]
                                transition-all
                                duration-200

                                ${activeSection === item.id
                                    ? `
                                            border
                                            border-[#e3e0d9]
                                            bg-white
                                            text-[#11130f]
                                            shadow-[0_2px_5px_rgba(0,0,0,0.06)]
                                        `
                                    : `
                                            border
                                            border-transparent
                                            bg-transparent
                                            text-[#8d9696]
                                            hover:bg-[#eeede8]
                                            hover:text-[#11130f]
                                        `
                                }
                            `}
                        >
                            {item.label}
                        </button>

                    ))}

                </div>

            </div>


            {/* =====================================================
                SELECTED HR SECTION
            ====================================================== */}

            <div className="
                px-5
                pb-10
                pt-7
                sm:px-7
                lg:px-8
            ">

                {renderSection()}

            </div>

            <AddEmployeeModal
                open={addEmployeeOpen}
                onClose={() => setAddEmployeeOpen(false)}
                onSuccess={handleEmployeeCreated}
            />

        </div>
    );
};


/* ================================================================
   SUMMARY CARD
================================================================ */

const SummaryCard = ({
    amount,
    label,
    description,
}) => {

    return (
        <div className="
            rounded-[20px]
            border
            border-[#e3e0d9]
            bg-white
            px-5
            py-6
            transition-all
            duration-200
            hover:-translate-y-[2px]
            hover:border-[#d5d2ca]
            hover:shadow-[0_6px_18px_rgba(0,0,0,0.05)]
        ">

            <div className="
                font-serif
                text-[29px]
                leading-none
                text-[#9b8050]
            ">
                {amount}
            </div>

            <div className="
                mt-3
                font-mono
                text-[9px]
                tracking-[0.12em]
                text-[#9ba2a2]
            ">
                {label}
            </div>

            <div className="
                mt-2
                font-mono
                text-[11px]
                text-[#53605e]
            ">
                {description}
            </div>

        </div>
    );
};


export default Dashboard;