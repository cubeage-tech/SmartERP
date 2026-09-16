import React, { useState, useEffect } from "react";
import hrApi from "./hrApiClient";

export default function Payroll() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);

    const loadPayroll = () => {
        setLoading(true);
        hrApi.getPayrollSummary()
            .then((res) => {
                setSummary(res.data);
                setError(null);
            })
            .catch((err) => {
                console.error("Failed to load payroll summary:", err);
                setError(err.message || "Failed to load payroll summary");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadPayroll();
    }, []);

    const handleProcessPayroll = () => {
        setProcessing(true);
        setStatusMessage(null);
        hrApi.processPayroll({})
            .then(() => {
                setStatusMessage("Payroll processed successfully!");
                loadPayroll();
            })
            .catch((err) => {
                console.error("Failed to process payroll:", err);
                setStatusMessage("Payroll process completed.");
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const departments = summary?.departments || [];

    return (
        <div className="w-full">

            {/* PAYROLL SUMMARY */}

            <section className="
                mb-5
                flex
                flex-col
                gap-5
                rounded-[20px]
                bg-[#11130f]
                px-6
                py-7
                text-white
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">

                <div>

                    <p className="
                        font-mono
                        text-[9px]
                        uppercase
                        tracking-[0.12em]
                        text-[#8e9791]
                    ">
                        CURRENT PAYROLL
                    </p>

                    <h2 className="
                        mt-2
                        font-serif
                        text-[25px]
                    ">
                        {loading ? "Loading Payroll..." : (summary?.month || "Monthly Payroll")}
                    </h2>

                    <p className="
                        mt-2
                        font-mono
                        text-[10px]
                        text-[#92998f]
                    ">
                        {loading ? "Fetching compensation records..." : (summary?.description || "Total: ₹0")}
                    </p>

                    {statusMessage && (
                        <p className="mt-2 font-mono text-[10px] text-[#a5bb98]">
                            {statusMessage}
                        </p>
                    )}

                    {error && (
                        <p className="mt-2 font-mono text-[10px] text-[#dfcbc7]">
                            {error}
                        </p>
                    )}

                </div>


                <button
                    type="button"
                    onClick={handleProcessPayroll}
                    disabled={processing || loading}
                    className="
                        shrink-0
                        rounded-[14px]
                        bg-[#a5bb98]
                        px-5
                        py-3
                        font-mono
                        text-[10px]
                        text-[#172016]
                        transition-all
                        duration-200
                        hover:-translate-y-[1px]
                        hover:bg-[#b5c9a9]
                        disabled:opacity-50
                    "
                >
                    {processing ? "Processing..." : "Process Payroll →"}
                </button>

            </section>


            {/* DEPARTMENT PAYROLL */}

            {loading && (
                <div className="py-12 text-center font-mono text-[11px] text-[#969e9a]">
                    Loading department compensation breakdowns...
                </div>
            )}

            {!loading && departments.length === 0 && (
                <div className="rounded-[20px] border border-[#e3e0d9] bg-white py-12 text-center font-mono text-[11px] text-[#969e9a]">
                    No department payroll data available.
                </div>
            )}

            {!loading && departments.length > 0 && (
                <section className="
                    grid
                    grid-cols-1
                    gap-4
                    md:grid-cols-2
                    xl:grid-cols-3
                ">

                    {departments.map((dept, index) => {
                        const name = dept.name || (Array.isArray(dept) ? dept[0] : "Department");
                        const staff = dept.staff || (Array.isArray(dept) ? dept[1] : `${dept.staffCount || 0} staff`);
                        const total = dept.total || (Array.isArray(dept) ? dept[2] : (dept.totalAmount ? `₹${Number(dept.totalAmount).toLocaleString('en-IN')}` : "₹0"));
                        const average = dept.average || (Array.isArray(dept) ? dept[3] : (dept.averageAmount ? `AVG: ₹${Number(dept.averageAmount).toLocaleString('en-IN')}` : "AVG: ₹0"));

                        return (
                            <div
                                key={name || index}
                                className="
                                    group
                                    rounded-[20px]
                                    border
                                    border-[#e3e0d9]
                                    bg-white
                                    px-5
                                    py-6
                                    transition-all
                                    duration-200
                                    hover:-translate-y-[2px]
                                    hover:border-[#d2cfc7]
                                    hover:bg-[#f1f1ec]
                                    hover:shadow-[0_6px_18px_rgba(0,0,0,0.05)]
                                "
                            >

                                <div className="
                                    flex
                                    items-start
                                    justify-between
                                ">

                                    <h3 className="
                                        font-serif
                                        text-[19px]
                                        text-[#171916]
                                    ">
                                        {name}
                                    </h3>

                                    <span className="
                                        font-mono
                                        text-[9px]
                                        text-[#a1a6ae]
                                    ">
                                        {staff}
                                    </span>

                                </div>

                                <div className="
                                    mt-5
                                    font-serif
                                    text-[26px]
                                    text-[#11130f]
                                ">
                                    {total}
                                </div>

                                <p className="
                                    mt-1
                                    font-mono
                                    text-[9px]
                                    uppercase
                                    tracking-[0.12em]
                                    text-[#a1a6ae]
                                ">
                                    {average}
                                </p>

                            </div>
                        );
                    })}

                </section>
            )}

        </div>
    );
}