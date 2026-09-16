import { useState, useEffect, useCallback } from "react";

import ProfitLoss from "./ProfitLoss";
import BalanceSheet from "./BalanceSheet";
import JournalEntries from "./JournalEntries";
import ExpenseTracking from "./ExpenseTracking";
import TaxManagement from "./TaxManagement";
import GeneralLedger from "./GeneralLedger";
import CashFlow from "./CashFlow";
import ChartOfAccounts from "./ChartOfAccounts";
import Alerts from "./Alerts";
import JournalEntryModal from "./JournalEntryModal";
import financeService from "../../../core/services/modules/finance.service";

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState("pnl");
    const [journalModalOpen, setJournalModalOpen] = useState(false);
    const [summary, setSummary] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [summaryError, setSummaryError] = useState("");
    const [topAlert, setTopAlert] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const navigation = [
        {
            id: "pnl",
            label: "P&L"
        },
        {
            id: "balancesheet",
            label: "BALANCE SHEET"
        },
        {
            id: "journals",
            label: "JOURNALS"
        },
        {
            id: "expenses",
            label: "EXPENSES"
        },
        {
            id: "tax",
            label: "TAX & GST"
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
            id: "accounts",
            label: "CHART OF ACCOUNTS"
        },
        {
            id: "alerts",
            label: "ALERTS"
        }
    ];

    const fetchDashboardData = useCallback(async () => {
        setSummaryLoading(true);
        setSummaryError("");
        try {
            const [summaryData, alertsData] = await Promise.allSettled([
                financeService.getDashboardSummary(),
                financeService.getActiveAlerts(),
            ]);

            if (summaryData.status === "fulfilled") {
                setSummary(summaryData.value);
            } else {
                setSummaryError(summaryData.reason?.response?.data?.message || "Failed to load summary");
            }

            if (alertsData.status === "fulfilled" && Array.isArray(alertsData.value) && alertsData.value.length > 0) {
                setTopAlert(alertsData.value[0]);
            } else {
                setTopAlert(null);
            }
        } catch (err) {
            setSummaryError(err?.response?.data?.message || err?.message || "Connection error");
        } finally {
            setSummaryLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData, refreshKey]);

    const handleJournalCreated = () => {
        setRefreshKey((k) => k + 1);
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const fmtCurrency = (val) => {
        const num = Number(val || 0);
        return "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const renderSection = () => {
        switch (activeSection) {
            case "pnl":
                return <ProfitLoss />;
            case "balancesheet":
                return <BalanceSheet key={refreshKey} />;
            case "journals":
                return <JournalEntries key={refreshKey} />;
            case "expenses":
                return <ExpenseTracking key={refreshKey} />;
            case "tax":
                return <TaxManagement key={refreshKey} />;
            case "ledger":
                return <GeneralLedger key={refreshKey} />;
            case "cashflow":
                return <CashFlow />;
            case "accounts":
                return <ChartOfAccounts key={refreshKey} />;
            case "alerts":
                return <Alerts key={refreshKey} onDismiss={() => setRefreshKey((k) => k + 1)} />;
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
                            onClick={() => setJournalModalOpen(true)}
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

                {summaryError && (
                    <div className="mt-6 flex items-center justify-between rounded-[16px] border border-[#f5c6c6] bg-[#fde8e8] px-5 py-3 text-[#a02020]">
                        <p className="font-mono text-[12px]">⚠️ {summaryError}</p>
                        <button
                            onClick={fetchDashboardData}
                            className="font-mono text-[11px] underline hover:no-underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                <div className="
                    mt-10
                    grid
                    grid-cols-1
                    gap-4
                    md:grid-cols-2
                    xl:grid-cols-4
                ">

                    <SummaryCard
                        amount={summaryLoading ? "..." : fmtCurrency(summary?.totalDebits)}
                        label="TOTAL DEBITS"
                        description="Total debits from posted journals"
                    />

                    <SummaryCard
                        amount={summaryLoading ? "..." : fmtCurrency(summary?.totalCredits)}
                        label="TOTAL CREDITS"
                        description="Total credits from posted journals"
                    />

                    <SummaryCard
                        amount={summaryLoading ? "..." : fmtCurrency(summary?.netMovement)}
                        label="NET MOVEMENT"
                        description="Credits minus debits"
                    />

                    <SummaryCard
                        amount={summaryLoading ? "..." : String(summary?.journalEntries ?? 0)}
                        label="JOURNAL ENTRIES"
                        description="Total posted double-entry records"
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
                            {topAlert
                                ? `${topAlert.level || "HIGH"}: ${topAlert.title} (${topAlert.time || "Recent"})`
                                : "All financial transactions and AI compliance checks are clear."}
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
            ====================================================== */}

            <div className="px-8 pb-10 pt-7">

                {renderSection()}

            </div>

            <JournalEntryModal
                open={journalModalOpen}
                onClose={() => setJournalModalOpen(false)}
                onSuccess={handleJournalCreated}
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