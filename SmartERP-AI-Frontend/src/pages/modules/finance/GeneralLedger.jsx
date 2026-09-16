import { useState, useEffect, useCallback, useMemo } from "react";
import financeService from "../../../core/services/modules/finance.service";

const GeneralLedger = () => {
    const [period, setPeriod] = useState("All");
    const [accountCode, setAccountCode] = useState("");
    const [ledgerData, setLedgerData] = useState({
        entries: [],
        totalDebit: 0,
        totalCredit: 0,
        netBalance: 0,
        totalRecords: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getDateRangeForPeriod = (selectedPeriod) => {
        const now = new Date();
        const toIsoDate = (d) => d.toISOString().split("T")[0];
        const todayStr = toIsoDate(now);

        if (selectedPeriod === "Today") {
            return { startDate: todayStr, endDate: todayStr };
        }
        if (selectedPeriod === "This Week") {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return { startDate: toIsoDate(weekAgo), endDate: todayStr };
        }
        if (selectedPeriod === "This Month") {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return { startDate: toIsoDate(startOfMonth), endDate: todayStr };
        }
        if (selectedPeriod === "FY") {
            const currentYear = now.getFullYear();
            const fyStartYear = now.getMonth() >= 3 ? currentYear : currentYear - 1;
            const fyStart = new Date(fyStartYear, 3, 1); // 1st April
            return { startDate: toIsoDate(fyStart), endDate: todayStr };
        }
        return {};
    };

    const fetchLedger = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = {};
            if (accountCode.trim()) {
                params.accountCode = accountCode.trim();
            }
            const dateRange = getDateRangeForPeriod(period);
            if (dateRange.startDate) params.startDate = dateRange.startDate;
            if (dateRange.endDate) params.endDate = dateRange.endDate;

            const data = await financeService.getLedger(params);
            setLedgerData(
                data || {
                    entries: [],
                    totalDebit: 0,
                    totalCredit: 0,
                    netBalance: 0,
                    totalRecords: 0,
                }
            );
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load general ledger records"
            );
        } finally {
            setLoading(false);
        }
    }, [period, accountCode]);

    useEffect(() => {
        fetchLedger();
    }, [fetchLedger]);

    const fmtDate = (dateStr) => {
        if (!dateStr) return "-";
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
        } catch {
            return dateStr;
        }
    };

    const fmtCurrency = (n) =>
        Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const entries = ledgerData.entries || [];

    return (
        <section
            className="
                overflow-hidden
                rounded-[20px]
                border
                border-[#e3e0d8]
                bg-white
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
                    border-b
                    border-[#e4e1da]
                    px-6 py-6
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >
                <div>
                    <h2 className="font-serif text-[22px] text-[#11130f]">
                        General Ledger
                    </h2>
                    <p className="mt-1 font-mono text-[11px] text-[#91a0a0]">
                        Double-entry transaction ledger from database · {ledgerData.totalRecords} entries
                    </p>
                </div>

                {/* PERIOD & ACCOUNT FILTERS */}
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        type="text"
                        placeholder="Filter by Account Code (e.g. 1001)"
                        value={accountCode}
                        onChange={(e) => setAccountCode(e.target.value)}
                        className="
                            rounded-xl border border-[#e3e0d8] bg-[#faf9f6]
                            px-3 py-2 font-mono text-[11px] text-[#11130f]
                            placeholder:text-[#a0a6a5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#11130f]
                        "
                    />

                    {["All", "Today", "This Week", "This Month", "FY"].map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setPeriod(item)}
                            className={`
                                rounded-xl border px-3.5 py-2 font-mono text-[11px] transition-all
                                ${
                                    period === item
                                        ? "border-[#11130f] bg-[#11130f] text-white"
                                        : "border-[#e3e0d8] bg-white text-[#9aa1a7] hover:bg-[#f6f5f1]"
                                }
                            `}
                        >
                            {item}
                        </button>
                    ))}

                    <button
                        onClick={fetchLedger}
                        title="Refresh"
                        className="
                            rounded-xl border border-[#e3e0d8] bg-white
                            px-3 py-2 font-mono text-[11px] text-[#53616e]
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
                        onClick={fetchLedger}
                        className="font-mono text-[11px] underline hover:no-underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* SUMMARY STRIP */}
            <div className="grid grid-cols-2 border-b border-[#e4e1da] bg-[#faf9f6] px-6 py-3 sm:grid-cols-4">
                <div>
                    <div className="font-mono text-[10px] tracking-wider text-[#9ba2a2] uppercase">Total Debits</div>
                    <div className="mt-0.5 font-mono text-[13px] font-semibold text-[#11130f]">₹{fmtCurrency(ledgerData.totalDebit)}</div>
                </div>
                <div>
                    <div className="font-mono text-[10px] tracking-wider text-[#9ba2a2] uppercase">Total Credits</div>
                    <div className="mt-0.5 font-mono text-[13px] font-semibold text-[#11130f]">₹{fmtCurrency(ledgerData.totalCredit)}</div>
                </div>
                <div>
                    <div className="font-mono text-[10px] tracking-wider text-[#9ba2a2] uppercase">Net Balance</div>
                    <div className={`mt-0.5 font-mono text-[13px] font-semibold ${Number(ledgerData.netBalance) >= 0 ? "text-[#3f7a4b]" : "text-[#b04040]"}`}>
                        ₹{fmtCurrency(ledgerData.netBalance)}
                    </div>
                </div>
                <div>
                    <div className="font-mono text-[10px] tracking-wider text-[#9ba2a2] uppercase">Records Count</div>
                    <div className="mt-0.5 font-mono text-[13px] font-semibold text-[#11130f]">{ledgerData.totalRecords}</div>
                </div>
            </div>

            {/* =================================================
                LEDGER TABLE
            ================================================== */}
            <div className="hidden overflow-x-auto lg:block">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-[#faf9f6]">
                            <TableHeader>ENTRY #</TableHeader>
                            <TableHeader>DATE</TableHeader>
                            <TableHeader>DESCRIPTION</TableHeader>
                            <TableHeader>ACCOUNT</TableHeader>
                            <TableHeader align="right">DEBIT</TableHeader>
                            <TableHeader align="right">CREDIT</TableHeader>
                            <TableHeader align="right">BALANCE</TableHeader>
                            <TableHeader align="right">REF</TableHeader>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="py-12 text-center font-mono text-[12px] text-[#91a0a0]">
                                    Loading general ledger entries...
                                </td>
                            </tr>
                        ) : entries.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-12 text-center font-mono text-[12px] text-[#91a0a0]">
                                    No ledger entries found in this period. Post a new journal entry to populate the ledger.
                                </td>
                            </tr>
                        ) : (
                            entries.map((entry) => (
                                <tr
                                    key={entry.id}
                                    className="border-t border-[#e5e2dc] transition-colors hover:bg-[#faf9f6]"
                                >
                                    <TableCell>
                                        <span className="font-semibold text-[#82909a]">
                                            {entry.entryNumber}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {fmtDate(entry.entryDate)}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[#11130f]">
                                            {entry.description || "-"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[#65758a]">
                                            {entry.accountCode} · {entry.accountName}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right">
                                        <span className="font-mono text-[#11130f]">
                                            {Number(entry.debit) > 0 ? `₹${fmtCurrency(entry.debit)}` : "-"}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right">
                                        <span className="font-mono text-[#11130f]">
                                            {Number(entry.credit) > 0 ? `₹${fmtCurrency(entry.credit)}` : "-"}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right">
                                        <span className={`font-mono font-medium ${Number(entry.runningBalance) >= 0 ? "text-[#3f7a4b]" : "text-[#b04040]"}`}>
                                            ₹{fmtCurrency(entry.runningBalance)}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right">
                                        <span className="text-[#9da5aa]">
                                            {entry.reference || "-"}
                                        </span>
                                    </TableCell>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* =================================================
                MOBILE CARDS
            ================================================== */}
            <div className="divide-y divide-[#e5e2dc] lg:hidden">
                {loading ? (
                    <div className="p-8 text-center font-mono text-[12px] text-[#91a0a0]">
                        Loading general ledger entries...
                    </div>
                ) : entries.length === 0 ? (
                    <div className="p-8 text-center font-mono text-[12px] text-[#91a0a0]">
                        No ledger entries found.
                    </div>
                ) : (
                    entries.map((entry) => (
                        <div key={entry.id} className="space-y-4 p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-mono text-[11px] font-semibold text-[#82909a]">
                                        {entry.entryNumber}
                                    </p>
                                    <h3 className="mt-1 font-serif text-[15px] text-[#11130f]">
                                        {entry.description || "-"}
                                    </h3>
                                    <p className="mt-1 font-mono text-[11px] text-[#65758a]">
                                        {entry.accountCode} · {entry.accountName}
                                    </p>
                                </div>
                                <span className="rounded-full bg-[#f1f5f2] px-2.5 py-1 font-mono text-[10px] text-[#55695d]">
                                    POSTED
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-3 border-t border-[#e5e2dc] pt-3 font-mono text-[12px]">
                                <div>
                                    <p className="text-[10px] text-[#9aa1a7]">DEBIT</p>
                                    <p className="mt-1 text-[#11130f]">
                                        {Number(entry.debit) > 0 ? `₹${fmtCurrency(entry.debit)}` : "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#9aa1a7]">CREDIT</p>
                                    <p className="mt-1 text-[#11130f]">
                                        {Number(entry.credit) > 0 ? `₹${fmtCurrency(entry.credit)}` : "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#9aa1a7]">BALANCE</p>
                                    <p className={`mt-1 font-medium ${Number(entry.runningBalance) >= 0 ? "text-[#3f7a4b]" : "text-[#b04040]"}`}>
                                        ₹{fmtCurrency(entry.runningBalance)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

const TableHeader = ({ children, align = "left" }) => {
    return (
        <th
            className={`
                px-6 py-4 font-mono text-[11px] font-medium tracking-[0.08em] text-[#9aa1a7]
                ${align === "right" ? "text-right" : "text-left"}
            `}
        >
            {children}
        </th>
    );
};

const TableCell = ({ children, align = "left" }) => {
    return (
        <td
            className={`
                px-6 py-4 font-mono text-[12px]
                ${align === "right" ? "text-right" : "text-left"}
            `}
        >
            {children}
        </td>
    );
};

export default GeneralLedger;