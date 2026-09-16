import React, { useState, useEffect, useCallback } from "react";
import financeService from "../../../core/services/modules/finance.service";

const ProfitLoss = () => {
    const [plData, setPlData] = useState({
        revenues: [],
        totalRevenue: 0,
        expenses: [],
        totalExpense: 0,
        grossProfit: 0,
        netProfit: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProfitLoss = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await financeService.getProfitLoss();
            setPlData(
                data || {
                    revenues: [],
                    totalRevenue: 0,
                    expenses: [],
                    totalExpense: 0,
                    grossProfit: 0,
                    netProfit: 0,
                }
            );
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load profit and loss statement"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfitLoss();
    }, [fetchProfitLoss]);

    const fmtCurrency = (n) =>
        Number(n || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    // Construct statement rows dynamically from real database response
    const rows = [];

    // Revenues
    if (plData.revenues && plData.revenues.length > 0) {
        plData.revenues.forEach((item) => {
            rows.push({
                name: item.accountName || item.accountCode,
                amount: `₹${fmtCurrency(item.amount)}`,
            });
        });
    } else {
        rows.push({
            name: "Operating Revenue",
            amount: "₹0.00",
        });
    }
    rows.push({
        name: "Total Income",
        amount: `₹${fmtCurrency(plData.totalRevenue)}`,
        total: true,
    });

    // Expenses
    if (plData.expenses && plData.expenses.length > 0) {
        plData.expenses.forEach((item) => {
            rows.push({
                name: item.accountName || item.accountCode,
                amount: `₹${fmtCurrency(item.amount)}`,
            });
        });
    } else {
        rows.push({
            name: "Operating Expenses",
            amount: "₹0.00",
        });
    }
    rows.push({
        name: "Total Expenses",
        amount: `₹${fmtCurrency(plData.totalExpense)}`,
        total: true,
    });

    // Gross & Net Profit
    rows.push({
        name: "Gross Profit",
        amount: `₹${fmtCurrency(plData.grossProfit)}`,
        strong: true,
    });
    rows.push({
        name: "Net Profit / (Loss)",
        amount: `₹${fmtCurrency(plData.netProfit)}`,
        strong: true,
        final: true,
    });

    // Real ratios
    const rev = Number(plData.totalRevenue || 0);
    const exp = Number(plData.totalExpense || 0);
    const net = Number(plData.netProfit || 0);
    const gross = Number(plData.grossProfit || 0);

    const grossMargin = rev > 0 ? ((gross / rev) * 100).toFixed(1) + "%" : "0.0%";
    const netMargin = rev > 0 ? ((net / rev) * 100).toFixed(1) + "%" : "0.0%";
    const expenseRatio = rev > 0 ? ((exp / rev) * 100).toFixed(1) + "%" : "0.0%";
    const coverage = exp > 0 ? (rev / exp).toFixed(2) + "x" : "N/A";

    return (
        <div
            className="
                grid
                grid-cols-1
                gap-5
                xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]
            "
        >
            {/* =================================================
                P&L STATEMENT
            ================================================== */}
            <div
                className="
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
                        flex-col
                        gap-3
                        border-b
                        border-[#e3e0d9]
                        px-6
                        py-6
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div>
                        <h2
                            className="
                                font-serif
                                text-[22px]
                                text-[#11130f]
                            "
                        >
                            Profit &amp; Loss Statement
                        </h2>
                        <p className="mt-1 font-mono text-[11px] text-[#929999]">
                            Derived from real posted journal entries
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span
                            className="
                                font-mono
                                text-[11px]
                                text-[#929999]
                            "
                        >
                            Current Financial Year
                        </span>
                        <button
                            onClick={fetchProfitLoss}
                            title="Refresh"
                            className="
                                rounded-xl border border-[#e3e0d8] bg-white
                                px-3 py-1.5 font-mono text-[11px] text-[#53616e]
                                transition hover:bg-[#f6f5f1]
                            "
                        >
                            ↻
                        </button>
                    </div>
                </div>

                {/* ERROR BANNER */}
                {error && (
                    <div className="flex items-center justify-between border-b border-[#f5c6c6] bg-[#fde8e8] px-6 py-3 text-[#a02020]">
                        <span className="font-mono text-[12px]">⚠️ {error}</span>
                        <button
                            onClick={fetchProfitLoss}
                            className="font-mono text-[11px] underline hover:no-underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* TABLE */}
                <div className="px-6 py-5">
                    {loading ? (
                        <div className="py-12 text-center font-mono text-[12px] text-[#929999]">
                            Loading profit &amp; loss statement...
                        </div>
                    ) : (
                        rows.map((row, index) => (
                            <div
                                key={row.name + index}
                                className={`
                                    flex
                                    min-h-[54px]
                                    items-center
                                    justify-between
                                    gap-5
                                    border-b
                                    border-[#e7e4de]
                                    px-0
                                    py-3

                                    ${
                                        row.total
                                            ? "rounded-lg bg-[#f5f4f0] px-4"
                                            : ""
                                    }

                                    ${
                                        row.strong
                                            ? "bg-[#f7f7f4] px-4 font-semibold"
                                            : ""
                                    }

                                    ${
                                        row.final
                                            ? "rounded-lg bg-[#f1f4ef] px-4 font-bold"
                                            : ""
                                    }

                                    ${
                                        index === rows.length - 1
                                            ? "border-b-0"
                                            : ""
                                    }
                                `}
                            >
                                <span
                                    className={`
                                        font-mono
                                        text-[13px]
                                        ${
                                            row.strong
                                                ? "text-[#11130f]"
                                                : "text-[#7d8584]"
                                        }
                                    `}
                                >
                                    {row.name}
                                </span>

                                <span
                                    className={`
                                        shrink-0
                                        font-mono
                                        text-[13px]
                                        ${
                                            row.strong
                                                ? "text-[#11130f]"
                                                : "text-[#4f5958]"
                                        }
                                        ${
                                            row.final && net < 0
                                                ? "text-[#b04040]"
                                                : ""
                                        }
                                    `}
                                >
                                    {row.amount}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================== */}
            <div className="space-y-5">
                {/* AI INSIGHTS */}
                <div
                    className="
                        rounded-[20px]
                        bg-[#11130f]
                        px-6
                        py-6
                        text-white
                    "
                >
                    <p
                        className="
                            font-mono
                            text-[11px]
                            tracking-[0.12em]
                            text-[#9caf8c]
                        "
                    >
                        AI INSIGHTS
                    </p>

                    <ul
                        className="
                            mt-5
                            space-y-4
                            font-mono
                            text-[12px]
                            leading-relaxed
                            text-[#aeb5ad]
                        "
                    >
                        <li className="flex gap-3">
                            <span className="text-[#9caf8c]">●</span>
                            <span>
                                {rev > 0
                                    ? `Total registered revenue stands at ₹${fmtCurrency(rev)} with net profit of ₹${fmtCurrency(net)} (${netMargin} margin).`
                                    : "No revenue transactions recorded yet for this financial period."}
                            </span>
                        </li>

                        <li className="flex gap-3">
                            <span className="text-[#9caf8c]">●</span>
                            <span>
                                {exp > 0
                                    ? `Operating expenses represent ${expenseRatio} of revenue across ${plData.expenses?.length || 0} active expense accounts.`
                                    : "Operating expenses are currently at ₹0.00."}
                            </span>
                        </li>

                        <li className="flex gap-3">
                            <span className="text-[#9caf8c]">●</span>
                            <span>
                                All revenue and expense balances reflect strict double-entry ledger postings.
                            </span>
                        </li>
                    </ul>
                </div>

                {/* QUICK RATIOS */}
                <div
                    className="
                        rounded-[20px]
                        border
                        border-[#e3e0d9]
                        bg-white
                        px-6
                        py-6
                    "
                >
                    <p
                        className="
                            font-mono
                            text-[11px]
                            tracking-[0.12em]
                            text-[#9ba2a2]
                        "
                    >
                        QUICK RATIOS
                    </p>

                    <div className="mt-5">
                        <Ratio name="Gross Margin" value={grossMargin} />
                        <Ratio name="Net Margin" value={netMargin} />
                        <Ratio name="Expense Ratio" value={expenseRatio} />
                        <Ratio name="Revenue/Expense Coverage" value={coverage} last />
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ================================================================
   RATIO
================================================================ */
const Ratio = ({ name, value, last }) => {
    return (
        <div
            className={`
                flex
                items-center
                justify-between
                py-4
                ${last ? "" : "border-b border-[#e5e2dc]"}
            `}
        >
            <span
                className="
                    font-mono
                    text-[12px]
                    text-[#929999]
                "
            >
                {name}
            </span>

            <span
                className="
                    font-serif
                    text-[17px]
                    text-[#11130f]
                "
            >
                {value}
            </span>
        </div>
    );
};

export default ProfitLoss;