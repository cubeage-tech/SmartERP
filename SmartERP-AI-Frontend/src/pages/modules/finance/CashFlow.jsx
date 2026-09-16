import React, { useState, useEffect, useCallback } from "react";
import financeService from "../../../core/services/modules/finance.service";

const CashFlow = () => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [cfData, setCfData] = useState({
        monthlyFlows: [],
        totalOperating: 0,
        totalInvesting: 0,
        totalFinancing: 0,
        netCashFlow: 0,
        openingCash: 0,
        closingCash: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCashFlow = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await financeService.getCashFlow({ year: selectedYear });
            setCfData(
                data || {
                    monthlyFlows: [],
                    totalOperating: 0,
                    totalInvesting: 0,
                    totalFinancing: 0,
                    netCashFlow: 0,
                    openingCash: 0,
                    closingCash: 0,
                }
            );
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load cash flow statement"
            );
        } finally {
            setLoading(false);
        }
    }, [selectedYear]);

    useEffect(() => {
        fetchCashFlow();
    }, [fetchCashFlow]);

    const fmtCurrency = (n) =>
        Number(n || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const months = cfData.monthlyFlows || [];

    // Compute chart scaling
    const maxVal = Math.max(
        1000,
        ...months.flatMap((m) => [
            Math.abs(Number(m.operating) || 0),
            Math.abs(Number(m.investing) || 0),
            Math.abs(Number(m.financing) || 0),
        ])
    );

    return (
        <div
            className="
                rounded-[20px]
                border
                border-[#e3e0d9]
                bg-white
                px-6
                py-7
            "
        >
            {/* =================================================
                HEADER
            ================================================== */}
            <div
                className="
                    flex
                    flex-col
                    gap-5
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
                        Cash Flow Statement
                    </h2>
                    <p className="mt-1 font-mono text-[11px] text-[#929999]">
                        Real cash movements derived from double-entry bank and cash transactions
                    </p>
                </div>

                {/* LEGEND & YEAR SELECTOR */}
                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-4
                    "
                >
                    <Legend label="Operating" className="bg-[#9caf8c]" />
                    <Legend label="Investing" className="bg-[#aaa7ba]" />
                    <Legend label="Financing" className="bg-[#b0a176]" />

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="
                            rounded-xl border border-[#e3e0d8] bg-[#faf9f6]
                            px-3 py-1.5 font-mono text-[11px] text-[#11130f]
                            focus:outline-none focus:ring-1 focus:ring-[#11130f]
                        "
                    >
                        {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                            <option key={y} value={y}>
                                FY {y}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={fetchCashFlow}
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
                <div className="mt-4 flex items-center justify-between rounded-xl border border-[#f5c6c6] bg-[#fde8e8] px-4 py-2 text-[#a02020]">
                    <span className="font-mono text-[12px]">⚠️ {error}</span>
                    <button
                        onClick={fetchCashFlow}
                        className="font-mono text-[11px] underline hover:no-underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* =================================================
                CHART
            ================================================== */}
            <div
                className="
                    mt-10
                    h-[310px]
                    border-b
                    border-[#e4e1db]
                    px-1
                "
            >
                {loading ? (
                    <div className="flex h-full items-center justify-center font-mono text-[12px] text-[#929999]">
                        Loading cash flow movements...
                    </div>
                ) : (
                    <div
                        className="
                            flex
                            h-full
                            items-end
                            justify-between
                            gap-2
                            overflow-x-auto
                        "
                    >
                        {months.map((item) => {
                            const op = Number(item.operating || 0);
                            const inv = Number(item.investing || 0);
                            const fin = Number(item.financing || 0);

                            const opHeight = (Math.abs(op) / maxVal) * 100;
                            const invHeight = (Math.abs(inv) / maxVal) * 100;
                            const finHeight = (Math.abs(fin) / maxVal) * 100;

                            return (
                                <div
                                    key={item.month}
                                    className="
                                        flex
                                        min-w-[60px]
                                        flex-1
                                        flex-col
                                        items-center
                                        justify-end
                                    "
                                >
                                    {/* BARS */}
                                    <div
                                        className="
                                            flex
                                            h-[255px]
                                            w-full
                                            items-end
                                            justify-center
                                            gap-[2px]
                                        "
                                    >
                                        {/* OPERATING */}
                                        <div
                                            title={`Operating: ₹${fmtCurrency(op)}`}
                                            className={`
                                                w-[28%]
                                                rounded-t-[4px]
                                                ${op >= 0 ? "bg-[#9caf8c]" : "bg-[#c4a0a0]"}
                                            `}
                                            style={{
                                                height: `${Math.max(op !== 0 ? 6 : 2, opHeight)}%`,
                                            }}
                                        />

                                        {/* INVESTING */}
                                        <div
                                            title={`Investing: ₹${fmtCurrency(inv)}`}
                                            className={`
                                                w-[28%]
                                                rounded-t-[4px]
                                                ${inv >= 0 ? "bg-[#aaa7ba]" : "bg-[#c7b4ba]"}
                                            `}
                                            style={{
                                                height: `${Math.max(inv !== 0 ? 6 : 2, invHeight)}%`,
                                            }}
                                        />

                                        {/* FINANCING */}
                                        <div
                                            title={`Financing: ₹${fmtCurrency(fin)}`}
                                            className={`
                                                w-[28%]
                                                rounded-t-[4px]
                                                ${fin >= 0 ? "bg-[#b0a176]" : "bg-[#c7bc99]"}
                                            `}
                                            style={{
                                                height: `${Math.max(fin !== 0 ? 6 : 2, finHeight)}%`,
                                            }}
                                        />
                                    </div>

                                    {/* MONTH LABEL */}
                                    <span
                                        className="
                                            mt-3
                                            font-mono
                                            text-[11px]
                                            text-[#929999]
                                        "
                                    >
                                        {item.month}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* =================================================
                SUMMARY CARDS
            ================================================== */}
            <div
                className="
                    mt-8
                    grid
                    grid-cols-2
                    gap-4
                    border-t
                    border-[#e4e1db]
                    pt-6
                    sm:grid-cols-3
                    lg:grid-cols-5
                "
            >
                <CashFlowSummary
                    value={`₹${fmtCurrency(cfData.totalOperating)}`}
                    label="OPERATING CASH FLOW"
                    positive={Number(cfData.totalOperating) >= 0}
                />

                <CashFlowSummary
                    value={`₹${fmtCurrency(cfData.totalInvesting)}`}
                    label="INVESTING CASH FLOW"
                    positive={Number(cfData.totalInvesting) >= 0}
                />

                <CashFlowSummary
                    value={`₹${fmtCurrency(cfData.totalFinancing)}`}
                    label="FINANCING CASH FLOW"
                    positive={Number(cfData.totalFinancing) >= 0}
                />

                <CashFlowSummary
                    value={`₹${fmtCurrency(cfData.netCashFlow)}`}
                    label="NET CASH FLOW"
                    positive={Number(cfData.netCashFlow) >= 0}
                />

                <CashFlowSummary
                    value={`₹${fmtCurrency(cfData.closingCash)}`}
                    label="CLOSING CASH POSITION"
                    positive={Number(cfData.closingCash) >= 0}
                    highlight
                />
            </div>
        </div>
    );
};

/* ================================================================
   LEGEND
================================================================ */
const Legend = ({ label, className }) => {
    return (
        <div
            className="
                flex
                items-center
                gap-2
            "
        >
            <span
                className={`
                    h-3.5
                    w-3.5
                    rounded-[4px]
                    ${className}
                `}
            />

            <span
                className="
                    font-mono
                    text-[11px]
                    text-[#929999]
                "
            >
                {label}
            </span>
        </div>
    );
};

/* ================================================================
   SUMMARY
================================================================ */
const CashFlowSummary = ({ value, label, positive = true, highlight = false }) => {
    return (
        <div
            className={`
                rounded-xl px-4 py-3 text-center
                ${highlight ? "border border-[#e3e0d8] bg-[#f9f8f4]" : "bg-[#faf9f6]"}
            `}
        >
            <div
                className={`
                    font-serif text-[18px] font-semibold sm:text-[20px]
                    ${highlight ? "text-[#11130f]" : positive ? "text-[#3f7a4b]" : "text-[#b04040]"}
                `}
            >
                {value}
            </div>

            <div
                className="
                    mt-1
                    font-mono
                    text-[9px]
                    tracking-[0.1em]
                    text-[#a0a6a5]
                "
            >
                {label}
            </div>
        </div>
    );
};

export default CashFlow;