import { useState } from "react";

import ProfitLoss from "./ProfitLoss";
import GeneralLedger from "./GeneralLedger";
import CashFlow from "./CashFlow";
import Alerts from "./Alerts";

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState("pnl");

    const navigation = [
        {
            id: "pnl",
            label: "P&L"
        },
        {
            id: "ledger",
            label: "GENERAL LEDGER"
        },
        {
            id: "cashflow",
            label: "CASH FLOW"
        },
        {
            id: "alerts",
            label: "ALERTS"
        }
    ];

    const handleSectionChange = (section) => {
        setActiveSection(section);

        // Move to the beginning of the Finance content
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const renderSection = () => {
        switch (activeSection) {

            case "pnl":
                return <ProfitLoss />;

            case "ledger":
                return <GeneralLedger />;

            case "cashflow":
                return <CashFlow />;

            case "alerts":
                return <Alerts />;

            default:
                return <ProfitLoss />;
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f6f5f1] text-[#11130f]">

            {/* =====================================================
                FINANCE HEADER
            ====================================================== */}

            <div className="px-8 pt-8">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                    <div>

                        <p className="
                            mb-3
                            font-mono
                            text-[11px]
                            tracking-[0.12em]
                            text-[#91a0a0]
                        ">
                            ACCOUNTS
                        </p>

                        <h1 className="
                            font-serif
                            text-[34px]
                            leading-none
                            text-[#11130f]
                        ">
                            Finance &amp; Accounts
                        </h1>

                    </div>


                    {/* HEADER ACTIONS */}

                    <div className="flex items-center gap-3">

                        <button
                            className="
                                rounded-[15px]
                                border
                                border-[#e2dfd7]
                                bg-white
                                px-5
                                py-3
                                font-mono
                                text-[12px]
                                text-[#303531]
                                transition
                                hover:bg-[#f0efeb]
                            "
                        >
                            Export to Tally
                        </button>


                        <button
                            className="
                                rounded-[15px]
                                bg-[#11130f]
                                px-5
                                py-3
                                font-mono
                                text-[12px]
                                text-white
                                transition
                                hover:bg-[#292c27]
                            "
                        >
                            + Journal Entry
                        </button>

                    </div>

                </div>


                {/* =================================================
                    SUMMARY CARDS
                ================================================== */}

                <div className="
                    mt-10
                    grid
                    grid-cols-1
                    gap-4
                    md:grid-cols-2
                    xl:grid-cols-4
                ">

                    <SummaryCard
                        amount="₹1.60 Cr"
                        label="NET PROFIT YTD"
                        description="↑ 18.4% vs last year"
                    />

                    <SummaryCard
                        amount="₹1.42 Cr"
                        label="REVENUE MTD"
                        description="Vs target: ₹1.20 Cr"
                    />

                    <SummaryCard
                        amount="₹3.14 Cr"
                        label="RECEIVABLES"
                        description="12 invoices pending"
                    />

                    <SummaryCard
                        amount="₹1.20 Cr"
                        label="PAYABLES"
                        description="₹38L due this week"
                    />

                </div>


                {/* =================================================
                    HIGH PRIORITY ALERT
                ================================================== */}

                <div className="
                    mt-6
                    flex
                    flex-col
                    gap-4
                    rounded-[20px]
                    border
                    border-[#decac4]
                    bg-[#eee8e4]
                    px-5
                    py-5
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                ">

                    <div className="flex items-center gap-4">

                        <div className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#dfd1cc]
                            text-[#5c514d]
                        ">
                            ⚠
                        </div>

                        <p className="
                            font-mono
                            text-[13px]
                            leading-relaxed
                            text-[#75483f]
                        ">
                            High-priority alert: Duplicate vendor invoice
                            detected: BILL-127 matches BILL-091 (Tata Steel)
                        </p>

                    </div>


                    <button
                        onClick={() => handleSectionChange("alerts")}
                        className="
                            shrink-0
                            rounded-xl
                            border
                            border-[#d6c3bd]
                            bg-transparent
                            px-5
                            py-2.5
                            font-mono
                            text-[11px]
                            text-[#75483f]
                            transition
                            hover:bg-[#e5dcd8]
                        "
                    >
                        View All →
                    </button>

                </div>


                {/* =================================================
                    FINANCE NAVIGATION
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
                            onClick={() => handleSectionChange(item.id)}
                            className={`
                                rounded-[12px]
                                px-5
                                py-3
                                font-mono
                                text-[11px]
                                tracking-[0.05em]
                                transition
                                ${
                                    activeSection === item.id
                                        ? `
                                            border
                                            border-[#e3e0d9]
                                            bg-white
                                            text-[#11130f]
                                            shadow-sm
                                        `
                                        : `
                                            border
                                            border-transparent
                                            bg-transparent
                                            text-[#8d9696]
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
                CONTENT AREA

                The selected component is rendered HERE.
                It does NOT navigate to another browser page.
            ====================================================== */}

            <div className="px-8 pb-10 pt-7">

                {renderSection()}

            </div>

        </div>
    );
};


/* ================================================================
   SUMMARY CARD
================================================================ */

const SummaryCard = ({
    amount,
    label,
    description
}) => {

    return (
        <div className="
            rounded-[20px]
            border
            border-[#e3e0d9]
            bg-white
            px-5
            py-6
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
                text-[10px]
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