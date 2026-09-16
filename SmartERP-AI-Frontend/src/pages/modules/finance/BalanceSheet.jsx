import React, { useState, useEffect, useCallback } from "react";
import financeService from "../../../core/services/modules/finance.service";

const BalanceSheet = () => {
    const [viewMode, setViewMode] = useState("balancesheet"); // "balancesheet" | "trialbalance"
    const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [bsData, setBsData] = useState(null);
    const [tbData, setTbData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [bsRes, tbRes] = await Promise.all([
                financeService.getBalanceSheet({ asOfDate }),
                financeService.getTrialBalance({ asOfDate }),
            ]);
            setBsData(bsRes);
            setTbData(tbRes);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load financial statements"
            );
        } finally {
            setLoading(false);
        }
    }, [asOfDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const fmtCurrency = (n) =>
        Number(n || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    // Quick date preset handlers
    const setDatePreset = (preset) => {
        const today = new Date();
        if (preset === "today") {
            setAsOfDate(today.toISOString().slice(0, 10));
        } else if (preset === "endOfLastMonth") {
            const d = new Date(today.getFullYear(), today.getMonth(), 0);
            setAsOfDate(d.toISOString().slice(0, 10));
        } else if (preset === "endOfLastQuarter") {
            const currentQuarter = Math.floor(today.getMonth() / 3);
            const d = new Date(today.getFullYear(), currentQuarter * 3, 0);
            setAsOfDate(d.toISOString().slice(0, 10));
        } else if (preset === "endOfFY") {
            // India FY ends on March 31
            const year = today.getMonth() >= 3 ? today.getFullYear() + 1 : today.getFullYear();
            setAsOfDate(`${year}-03-31`);
        }
    };

    // Export to CSV
    const exportCSV = () => {
        if (viewMode === "balancesheet" && bsData) {
            let csv = `SmartERP - Balance Sheet (As of ${bsData.asOfDate})\n\n`;
            csv += `Section,Account Code,Account Name,Category,Balance (INR)\n`;
            (bsData.assets || []).forEach(a => {
                csv += `Assets,"${a.accountCode}","${a.accountName}","${a.accountCategory}",${a.balance}\n`;
            });
            csv += `Assets,,,Total Assets,${bsData.totalAssets}\n\n`;
            (bsData.liabilities || []).forEach(l => {
                csv += `Liabilities,"${l.accountCode}","${l.accountName}","${l.accountCategory}",${l.balance}\n`;
            });
            csv += `Liabilities,,,Total Liabilities,${bsData.totalLiabilities}\n\n`;
            (bsData.equity || []).forEach(e => {
                csv += `Equity,"${e.accountCode}","${e.accountName}","${e.accountCategory}",${e.balance}\n`;
            });
            csv += `Equity,,"Current Period Net Profit",Equity,${bsData.currentPeriodNetProfit}\n`;
            csv += `Equity,,,Total Liabilities & Equity,${bsData.totalLiabilitiesAndEquity}\n`;

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Balance_Sheet_${bsData.asOfDate}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } else if (viewMode === "trialbalance" && tbData) {
            let csv = `SmartERP - Trial Balance (As of ${tbData.asOfDate})\n\n`;
            csv += `Account Code,Account Name,Type,Debit (INR),Credit (INR)\n`;
            (tbData.items || []).forEach(item => {
                csv += `"${item.accountCode}","${item.accountName}","${item.accountType}",${item.totalDebit},${item.totalCredit}\n`;
            });
            csv += `Totals,,Grand Total,${tbData.grandTotalDebit},${tbData.grandTotalCredit}\n`;

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Trial_Balance_${tbData.asOfDate}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    // Categorized assets
    const currentAssets = (bsData?.assets || []).filter(a => a.accountCategory === "Current Assets");
    const nonCurrentAssets = (bsData?.assets || []).filter(a => a.accountCategory !== "Current Assets");

    // Categorized liabilities
    const currentLiabilities = (bsData?.liabilities || []).filter(l => l.accountCategory === "Current Liabilities");
    const longTermLiabilities = (bsData?.liabilities || []).filter(l => l.accountCategory !== "Current Liabilities");

    return (
        <div className="space-y-6">
            {/* =================================================
                PAGE HEADER & CONTROLS
            ================================================== */}
            <div className="flex flex-col gap-4 rounded-2xl border border-[#e4e2dd] bg-[#ffffff] p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold tracking-tight text-[#11130f]">
                            Statement of Financial Position
                        </h2>
                        {bsData && (
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                    bsData.isBalanced
                                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                                        : "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20"
                                }`}
                            >
                                {bsData.isBalanced ? "✓ Equation Balanced" : `⚠ Variance: ₹${fmtCurrency(bsData.balanceVariance)}`}
                            </span>
                        )}
                    </div>
                    <p className="mt-1 text-xs text-[#7d8584]">
                        Double-entry verification of Assets, Liabilities, Equity, and Trial Balance
                    </p>
                </div>

                {/* CONTROLS: Mode switch + AsOf Date + Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* View Switch */}
                    <div className="inline-flex rounded-lg border border-[#e4e2dd] bg-[#f6f5f1] p-1 text-xs font-semibold text-[#4f5958]">
                        <button
                            type="button"
                            onClick={() => setViewMode("balancesheet")}
                            className={`rounded-md px-3 py-1.5 transition-all ${
                                viewMode === "balancesheet"
                                    ? "bg-white text-[#11130f] shadow-sm"
                                    : "hover:text-[#11130f]"
                            }`}
                        >
                            Balance Sheet
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("trialbalance")}
                            className={`rounded-md px-3 py-1.5 transition-all ${
                                viewMode === "trialbalance"
                                    ? "bg-white text-[#11130f] shadow-sm"
                                    : "hover:text-[#11130f]"
                            }`}
                        >
                            Trial Balance
                        </button>
                    </div>

                    {/* As Of Date Input */}
                    <div className="flex items-center gap-1.5 rounded-lg border border-[#e4e2dd] bg-white px-2.5 py-1.5 text-xs">
                        <span className="font-medium text-[#7d8584]">As of:</span>
                        <input
                            type="date"
                            value={asOfDate}
                            onChange={(e) => setAsOfDate(e.target.value)}
                            className="bg-transparent font-mono text-xs font-semibold text-[#11130f] outline-none"
                        />
                    </div>

                    {/* Export Button */}
                    <button
                        type="button"
                        onClick={exportCSV}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#e4e2dd] bg-white px-3 py-2 text-xs font-semibold text-[#4f5958] shadow-sm hover:bg-[#f6f5f1]"
                    >
                        <span>📥</span> Export CSV
                    </button>

                    {/* Print Button */}
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#e4e2dd] bg-white px-3 py-2 text-xs font-semibold text-[#4f5958] shadow-sm hover:bg-[#f6f5f1]"
                    >
                        <span>🖨</span> Print
                    </button>
                </div>
            </div>

            {/* Date Preset Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-xs font-medium text-[#7d8584]">Date presets:</span>
                <button
                    type="button"
                    onClick={() => setDatePreset("today")}
                    className="rounded-full border border-[#e4e2dd] bg-white px-2.5 py-0.5 text-xs text-[#4f5958] hover:border-[#11130f] hover:text-[#11130f]"
                >
                    Today
                </button>
                <button
                    type="button"
                    onClick={() => setDatePreset("endOfLastMonth")}
                    className="rounded-full border border-[#e4e2dd] bg-white px-2.5 py-0.5 text-xs text-[#4f5958] hover:border-[#11130f] hover:text-[#11130f]"
                >
                    End of Last Month
                </button>
                <button
                    type="button"
                    onClick={() => setDatePreset("endOfLastQuarter")}
                    className="rounded-full border border-[#e4e2dd] bg-white px-2.5 py-0.5 text-xs text-[#4f5958] hover:border-[#11130f] hover:text-[#11130f]"
                >
                    End of Last Quarter
                </button>
                <button
                    type="button"
                    onClick={() => setDatePreset("endOfFY")}
                    className="rounded-full border border-[#e4e2dd] bg-white px-2.5 py-0.5 text-xs text-[#4f5958] hover:border-[#11130f] hover:text-[#11130f]"
                >
                    End of Financial Year
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
                    ⚠ {error}
                </div>
            )}

            {/* =================================================
                EXECUTIVE KPI CARDS
            ================================================== */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Assets */}
                <div className="rounded-2xl border border-[#e4e2dd] bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold tracking-wider text-[#7d8584]">TOTAL ASSETS</p>
                    <p className="mt-2 text-2xl font-bold text-[#11130f]">
                        {loading ? "..." : `₹${fmtCurrency(bsData?.totalAssets)}`}
                    </p>
                    <p className="mt-1 text-[11px] text-[#7d8584]">
                        {(bsData?.assets || []).length} registered accounts
                    </p>
                </div>

                {/* Total Liabilities */}
                <div className="rounded-2xl border border-[#e4e2dd] bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold tracking-wider text-[#7d8584]">TOTAL LIABILITIES</p>
                    <p className="mt-2 text-2xl font-bold text-[#11130f]">
                        {loading ? "..." : `₹${fmtCurrency(bsData?.totalLiabilities)}`}
                    </p>
                    <p className="mt-1 text-[11px] text-[#7d8584]">
                        {(bsData?.liabilities || []).length} registered accounts
                    </p>
                </div>

                {/* Total Equity & Profit */}
                <div className="rounded-2xl border border-[#e4e2dd] bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold tracking-wider text-[#7d8584]">TOTAL EQUITY & PROFIT</p>
                    <p className="mt-2 text-2xl font-bold text-[#11130f]">
                        {loading ? "..." : `₹${fmtCurrency(Number(bsData?.totalEquity || 0) + Number(bsData?.currentPeriodNetProfit || 0))}`}
                    </p>
                    <p className="mt-1 text-[11px] text-[#7d8584]">
                        Net Profit: ₹{fmtCurrency(bsData?.currentPeriodNetProfit)}
                    </p>
                </div>

                {/* Equation Balance Status */}
                <div className="rounded-2xl border border-[#e4e2dd] bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold tracking-wider text-[#7d8584]">ACCOUNTING EQUATION</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className={`text-xl font-bold ${bsData?.isBalanced ? "text-emerald-600" : "text-rose-600"}`}>
                            {bsData?.isBalanced ? "A = L + E" : "DISCREPANCY"}
                        </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#7d8584]">
                        Variance: ₹{fmtCurrency(bsData?.balanceVariance)}
                    </p>
                </div>
            </div>

            {/* =================================================
                MAIN REPORT BODY: BALANCE SHEET VIEW
            ================================================== */}
            {viewMode === "balancesheet" && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* LEFT COLUMN: ASSETS */}
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-[#e4e2dd] bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between border-b border-[#e4e2dd] pb-3">
                                <h3 className="text-base font-bold text-[#11130f]">Assets</h3>
                                <span className="font-mono text-xs font-bold text-[#11130f]">
                                    ₹{fmtCurrency(bsData?.totalAssets)}
                                </span>
                            </div>

                            {/* Current Assets */}
                            <div className="mt-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7d8584]">Current Assets</h4>
                                <div className="mt-2 divide-y divide-[#f1f0eb]">
                                    {currentAssets.length === 0 ? (
                                        <p className="py-2 text-xs italic text-[#7d8584]">No current assets</p>
                                    ) : (
                                        currentAssets.map((item) => (
                                            <div key={item.accountCode} className="flex items-center justify-between py-2 text-xs">
                                                <div>
                                                    <span className="font-mono font-medium text-[#11130f]">{item.accountCode}</span>
                                                    <span className="ml-2 text-[#4f5958]">{item.accountName}</span>
                                                </div>
                                                <span className="font-mono font-semibold text-[#11130f]">
                                                    ₹{fmtCurrency(item.balance)}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Non-Current / Fixed Assets */}
                            <div className="mt-6">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7d8584]">Non-Current / Fixed Assets</h4>
                                <div className="mt-2 divide-y divide-[#f1f0eb]">
                                    {nonCurrentAssets.length === 0 ? (
                                        <p className="py-2 text-xs italic text-[#7d8584]">No non-current assets</p>
                                    ) : (
                                        nonCurrentAssets.map((item) => (
                                            <div key={item.accountCode} className="flex items-center justify-between py-2 text-xs">
                                                <div>
                                                    <span className="font-mono font-medium text-[#11130f]">{item.accountCode}</span>
                                                    <span className="ml-2 text-[#4f5958]">{item.accountName}</span>
                                                </div>
                                                <span className="font-mono font-semibold text-[#11130f]">
                                                    ₹{fmtCurrency(item.balance)}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Assets Total Row */}
                            <div className="mt-6 flex items-center justify-between rounded-lg bg-[#f6f5f1] p-3 text-xs font-bold text-[#11130f]">
                                <span>TOTAL ASSETS</span>
                                <span className="font-mono text-sm">₹{fmtCurrency(bsData?.totalAssets)}</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: LIABILITIES & EQUITY */}
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-[#e4e2dd] bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between border-b border-[#e4e2dd] pb-3">
                                <h3 className="text-base font-bold text-[#11130f]">Liabilities & Equity</h3>
                                <span className="font-mono text-xs font-bold text-[#11130f]">
                                    ₹{fmtCurrency(bsData?.totalLiabilitiesAndEquity)}
                                </span>
                            </div>

                            {/* Current Liabilities */}
                            <div className="mt-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7d8584]">Current Liabilities</h4>
                                <div className="mt-2 divide-y divide-[#f1f0eb]">
                                    {currentLiabilities.length === 0 ? (
                                        <p className="py-2 text-xs italic text-[#7d8584]">No current liabilities</p>
                                    ) : (
                                        currentLiabilities.map((item) => (
                                            <div key={item.accountCode} className="flex items-center justify-between py-2 text-xs">
                                                <div>
                                                    <span className="font-mono font-medium text-[#11130f]">{item.accountCode}</span>
                                                    <span className="ml-2 text-[#4f5958]">{item.accountName}</span>
                                                </div>
                                                <span className="font-mono font-semibold text-[#11130f]">
                                                    ₹{fmtCurrency(item.balance)}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Long-Term Liabilities */}
                            <div className="mt-6">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7d8584]">Long-Term Liabilities</h4>
                                <div className="mt-2 divide-y divide-[#f1f0eb]">
                                    {longTermLiabilities.length === 0 ? (
                                        <p className="py-2 text-xs italic text-[#7d8584]">No long-term liabilities</p>
                                    ) : (
                                        longTermLiabilities.map((item) => (
                                            <div key={item.accountCode} className="flex items-center justify-between py-2 text-xs">
                                                <div>
                                                    <span className="font-mono font-medium text-[#11130f]">{item.accountCode}</span>
                                                    <span className="ml-2 text-[#4f5958]">{item.accountName}</span>
                                                </div>
                                                <span className="font-mono font-semibold text-[#11130f]">
                                                    ₹{fmtCurrency(item.balance)}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Equity Section */}
                            <div className="mt-6">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7d8584]">Equity</h4>
                                <div className="mt-2 divide-y divide-[#f1f0eb]">
                                    {(bsData?.equity || []).length === 0 ? (
                                        <p className="py-2 text-xs italic text-[#7d8584]">No prior equity accounts</p>
                                    ) : (
                                        (bsData?.equity || []).map((item) => (
                                            <div key={item.accountCode} className="flex items-center justify-between py-2 text-xs">
                                                <div>
                                                    <span className="font-mono font-medium text-[#11130f]">{item.accountCode}</span>
                                                    <span className="ml-2 text-[#4f5958]">{item.accountName}</span>
                                                </div>
                                                <span className="font-mono font-semibold text-[#11130f]">
                                                    ₹{fmtCurrency(item.balance)}
                                                </span>
                                            </div>
                                        ))
                                    )}

                                    {/* Current Period Net Profit line */}
                                    <div className="flex items-center justify-between py-2 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-medium text-[#11130f]">Current Period Net Profit</span>
                                            <span className="rounded bg-[#f1f4ef] px-1.5 py-0.5 text-[10px] font-semibold text-[#4f5958]">
                                                From P&L
                                            </span>
                                        </div>
                                        <span className={`font-mono font-semibold ${
                                            Number(bsData?.currentPeriodNetProfit || 0) >= 0 ? "text-emerald-700" : "text-rose-700"
                                        }`}>
                                            ₹{fmtCurrency(bsData?.currentPeriodNetProfit)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Liabilities & Equity Total Row */}
                            <div className="mt-6 flex items-center justify-between rounded-lg bg-[#f6f5f1] p-3 text-xs font-bold text-[#11130f]">
                                <span>TOTAL LIABILITIES & EQUITY</span>
                                <span className="font-mono text-sm">₹{fmtCurrency(bsData?.totalLiabilitiesAndEquity)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* =================================================
                MAIN REPORT BODY: TRIAL BALANCE VIEW
            ================================================== */}
            {viewMode === "trialbalance" && (
                <div className="overflow-hidden rounded-2xl border border-[#e4e2dd] bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#e4e2dd] p-5">
                        <div>
                            <h3 className="text-base font-bold text-[#11130f]">Trial Balance Summary</h3>
                            <p className="text-xs text-[#7d8584]">Comprehensive debit and credit verification as of {tbData?.asOfDate}</p>
                        </div>
                        {tbData && (
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                    tbData.isBalanced
                                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                                        : "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20"
                                }`}
                            >
                                {tbData.isBalanced ? "✓ Trial Balance Balanced" : `⚠ Discrepancy: ₹${fmtCurrency(tbData.difference)}`}
                            </span>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#e4e2dd] bg-[#fbfaf8] text-[11px] uppercase tracking-wider text-[#7d8584]">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Code</th>
                                    <th className="px-5 py-3 font-semibold">Account Name</th>
                                    <th className="px-5 py-3 font-semibold">Type</th>
                                    <th className="px-5 py-3 text-right font-semibold">Debit (₹)</th>
                                    <th className="px-5 py-3 text-right font-semibold">Credit (₹)</th>
                                    <th className="px-5 py-3 text-right font-semibold">Net Debit (₹)</th>
                                    <th className="px-5 py-3 text-right font-semibold">Net Credit (₹)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f0eb]">
                                {(tbData?.items || []).length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-5 py-8 text-center text-xs italic text-[#7d8584]">
                                            No ledger activity recorded up to this date
                                        </td>
                                    </tr>
                                ) : (
                                    (tbData?.items || []).map((item) => (
                                        <tr key={item.accountCode} className="hover:bg-[#fcfbf9]">
                                            <td className="px-5 py-3 font-mono font-medium text-[#11130f]">
                                                {item.accountCode}
                                            </td>
                                            <td className="px-5 py-3 font-medium text-[#11130f]">
                                                {item.accountName}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="rounded bg-[#f1f4ef] px-2 py-0.5 text-[10px] font-semibold text-[#4f5958]">
                                                    {item.accountType}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right font-mono text-[#4f5958]">
                                                {Number(item.totalDebit) > 0 ? `₹${fmtCurrency(item.totalDebit)}` : "—"}
                                            </td>
                                            <td className="px-5 py-3 text-right font-mono text-[#4f5958]">
                                                {Number(item.totalCredit) > 0 ? `₹${fmtCurrency(item.totalCredit)}` : "—"}
                                            </td>
                                            <td className="px-5 py-3 text-right font-mono font-semibold text-[#11130f]">
                                                {Number(item.netDebit) > 0 ? `₹${fmtCurrency(item.netDebit)}` : "—"}
                                            </td>
                                            <td className="px-5 py-3 text-right font-mono font-semibold text-[#11130f]">
                                                {Number(item.netCredit) > 0 ? `₹${fmtCurrency(item.netCredit)}` : "—"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot className="border-t-2 border-[#e4e2dd] bg-[#f6f5f1] font-bold text-[#11130f]">
                                <tr>
                                    <td colSpan="3" className="px-5 py-3.5 uppercase tracking-wider">
                                        Grand Totals
                                    </td>
                                    <td className="px-5 py-3.5 text-right font-mono">
                                        ₹{fmtCurrency(tbData?.grandTotalDebit)}
                                    </td>
                                    <td className="px-5 py-3.5 text-right font-mono">
                                        ₹{fmtCurrency(tbData?.grandTotalCredit)}
                                    </td>
                                    <td colSpan="2" className="px-5 py-3.5 text-right font-mono text-emerald-700">
                                        {tbData?.isBalanced ? "✓ Balanced (Diff: ₹0.00)" : `⚠ Diff: ₹${fmtCurrency(tbData?.difference)}`}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BalanceSheet;
