import React, { useState, useEffect, useCallback } from "react";
import financeService from "../../../core/services/modules/finance.service";
import JournalEntryModal from "./JournalEntryModal";

const JournalEntries = () => {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newEntryModalOpen, setNewEntryModalOpen] = useState(false);

    // Filter states
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [search, setSearch] = useState("");
    const [accountCode, setAccountCode] = useState("");
    const [status, setStatus] = useState("");

    // Detail modal state
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const [voucherDetail, setVoucherDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");

    // Fetch Journals
    const fetchJournals = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            if (search) params.search = search;
            if (accountCode) params.accountCode = accountCode;
            if (status) params.status = status;

            const res = await financeService.getJournals(params);
            setJournals(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error("Failed to load journals:", err);
            setError(err.response?.data?.message || err.message || "Failed to load journal entries");
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, search, accountCode, status]);

    useEffect(() => {
        fetchJournals();
    }, [fetchJournals]);

    // Fetch Voucher Detail by ID
    const openVoucherDetail = async (id) => {
        setSelectedVoucherId(id);
        setDetailLoading(true);
        setDetailError("");
        setVoucherDetail(null);
        try {
            const data = await financeService.getJournalById(id);
            setVoucherDetail(data);
        } catch (err) {
            console.error("Failed to load voucher detail:", err);
            setDetailError(err.response?.data?.message || err.message || "Failed to load voucher details");
        } finally {
            setDetailLoading(false);
        }
    };

    const closeVoucherDetail = () => {
        setSelectedVoucherId(null);
        setVoucherDetail(null);
    };

    // Date range helpers
    const applyToday = () => {
        const today = new Date().toISOString().split("T")[0];
        setStartDate(today);
        setEndDate(today);
    };

    const applyThisMonth = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
        setStartDate(start);
        setEndDate(end);
    };

    const clearFilters = () => {
        setStartDate("");
        setEndDate("");
        setSearch("");
        setAccountCode("");
        setStatus("");
    };

    // Format currency INR
    const fmt = (val) => {
        const num = Number(val || 0);
        return "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Totals calculations
    const totalDebitSum = journals.reduce((acc, j) => acc + Number(j.totalDebit || 0), 0);
    const totalCreditSum = journals.reduce((acc, j) => acc + Number(j.totalCredit || 0), 0);
    const isDaybookBalanced = Math.abs(totalDebitSum - totalCreditSum) < 0.01;

    // Export CSV
    const exportDaybookCsv = () => {
        if (!journals.length) return;
        const headers = ["ID", "Voucher Number", "Date", "Reference", "Description", "Debit", "Credit", "Status"];
        const rows = journals.map(j => [
            j.id,
            `"${j.entryNumber || ""}"`,
            j.entryDate || "",
            `"${j.reference || ""}"`,
            `"${(j.description || "").replace(/"/g, '""')}"`,
            j.totalDebit || 0,
            j.totalCredit || 0,
            j.status || ""
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Journal_Daybook_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Export Tally Daybook XML
    const downloadTallyDaybook = async () => {
        try {
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            const res = await financeService.exportTallyDaybook(params);
            const blob = new Blob([res.data], { type: "application/xml" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Tally_Daybook.xml");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to export Tally Daybook:", err);
            alert("Error exporting Tally Daybook: " + (err.message || "Unknown error"));
        }
    };

    // Export Tally Masters XML
    const downloadTallyMasters = async () => {
        try {
            const res = await financeService.exportTallyMasters();
            const blob = new Blob([res.data], { type: "application/xml" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Tally_Masters.xml");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to export Tally Masters:", err);
            alert("Error exporting Tally Masters: " + (err.message || "Unknown error"));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Main Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span>📖</span> Journal Voucher Registry & Daybook
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Book of Original Entry. Audit, search, inspect line items, and export financial transactions.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={downloadTallyMasters}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-amber-600 text-amber-700 bg-amber-50 hover:bg-amber-100 transition shadow-sm"
                        title="Export Chart of Accounts as Tally Masters XML"
                    >
                        Export Tally Masters
                    </button>
                    <button
                        onClick={downloadTallyDaybook}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-indigo-600 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition shadow-sm"
                        title="Export Posted Vouchers as Tally Daybook XML"
                    >
                        Export Tally Daybook
                    </button>
                    <button
                        onClick={exportDaybookCsv}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm"
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={() => setNewEntryModalOpen(true)}
                        className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#1b4332] text-white hover:bg-[#143225] transition shadow-sm flex items-center gap-1"
                    >
                        <span>+</span> New Journal Entry
                    </button>
                </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Vouchers</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{journals.length}</p>
                    <p className="text-xs text-gray-400 mt-1">Matching current filters</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Debit Volume</p>
                    <p className="text-2xl font-black text-blue-700 mt-1">{fmt(totalDebitSum)}</p>
                    <p className="text-xs text-gray-400 mt-1">Sum of posted debit lines</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Credit Volume</p>
                    <p className="text-2xl font-black text-emerald-700 mt-1">{fmt(totalCreditSum)}</p>
                    <p className="text-xs text-gray-400 mt-1">Sum of posted credit lines</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Daybook Equilibrium</p>
                    <div className="mt-1 flex items-center gap-1.5">
                        {isDaybookBalanced ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                ✓ Balanced (Diff: ₹0.00)
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                                ⚠ Unbalanced ({fmt(Math.abs(totalDebitSum - totalCreditSum))})
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Σ Debits ≡ Σ Credits</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Search voucher #, reference, description..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="w-36">
                        <input
                            type="text"
                            placeholder="Account Code (e.g. 1001)"
                            value={accountCode}
                            onChange={(e) => setAccountCode(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="w-28">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">All Status</option>
                            <option value="POSTED">POSTED</option>
                            <option value="DRAFT">DRAFT</option>
                            <option value="VOID">VOID</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span>From:</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-2 py-1 text-xs rounded border border-gray-300"
                        />
                        <span>To:</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-2 py-1 text-xs rounded border border-gray-300"
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={applyToday}
                            className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            Today
                        </button>
                        <button
                            onClick={applyThisMonth}
                            className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            This Month
                        </button>
                        <button
                            onClick={clearFilters}
                            className="px-2 py-1 text-xs rounded bg-rose-50 text-rose-700 hover:bg-rose-100"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center justify-between">
                    <span>⚠ {error}</span>
                    <button onClick={fetchJournals} className="underline hover:no-underline">Retry</button>
                </div>
            )}

            {/* Voucher Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-xs text-gray-500 font-medium">
                        Loading journal entries...
                    </div>
                ) : journals.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 space-y-2">
                        <p className="text-sm font-semibold">No journal entries found</p>
                        <p className="text-xs text-gray-400">Try adjusting your date filters or search terms.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                                    <th className="py-3 px-4">Voucher Number</th>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Reference</th>
                                    <th className="py-3 px-4">Description</th>
                                    <th className="py-3 px-4 text-right">Debit (₹)</th>
                                    <th className="py-3 px-4 text-right">Credit (₹)</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                    <th className="py-3 px-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {journals.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-gray-50/75 transition">
                                        <td className="py-3 px-4 font-mono font-bold text-gray-900">
                                            {entry.entryNumber}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                                            {entry.entryDate}
                                        </td>
                                        <td className="py-3 px-4 font-mono text-gray-500">
                                            {entry.reference || "—"}
                                        </td>
                                        <td className="py-3 px-4 text-gray-800 max-w-xs truncate" title={entry.description}>
                                            {entry.description || "—"}
                                        </td>
                                        <td className="py-3 px-4 text-right font-mono font-semibold text-blue-700">
                                            {fmt(entry.totalDebit)}
                                        </td>
                                        <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700">
                                            {fmt(entry.totalCredit)}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                                                entry.status === "POSTED"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : entry.status === "VOID"
                                                    ? "bg-rose-100 text-rose-800"
                                                    : "bg-amber-100 text-amber-800"
                                            }`}>
                                                {entry.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => openVoucherDetail(entry.id)}
                                                className="px-2.5 py-1 text-xs font-medium rounded bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Voucher Detail Modal */}
            {selectedVoucherId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <span>🧾</span> Journal Voucher Detail
                                </h3>
                                <p className="text-xs text-gray-500 font-mono mt-0.5">
                                    Voucher ID: #{selectedVoucherId}
                                </p>
                            </div>
                            <button
                                onClick={closeVoucherDetail}
                                className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 text-lg transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 overflow-y-auto space-y-4 flex-1">
                            {detailLoading ? (
                                <div className="p-8 text-center text-xs text-gray-500">
                                    Loading voucher lines...
                                </div>
                            ) : detailError ? (
                                <div className="p-4 bg-rose-50 text-rose-800 text-xs font-semibold rounded-lg">
                                    ⚠ {detailError}
                                </div>
                            ) : voucherDetail ? (
                                <div className="space-y-4">
                                    {/* Voucher Meta Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-xl text-xs border border-gray-200">
                                        <div>
                                            <span className="text-gray-400 block">Voucher Number</span>
                                            <span className="font-mono font-bold text-gray-900">{voucherDetail.entryNumber}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block">Date</span>
                                            <span className="font-semibold text-gray-900">{voucherDetail.entryDate}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block">Reference</span>
                                            <span className="font-mono text-gray-700">{voucherDetail.reference || "—"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block">Status</span>
                                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                                {voucherDetail.status}
                                            </span>
                                        </div>
                                        <div className="col-span-2 sm:col-span-4 mt-1 pt-2 border-t border-gray-200">
                                            <span className="text-gray-400 block">Narration / Description</span>
                                            <span className="text-gray-800">{voucherDetail.description || "—"}</span>
                                        </div>
                                    </div>

                                    {/* Line Items Table */}
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                            Double-Entry Line Items
                                        </h4>
                                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                                            <table className="w-full text-xs text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-100 border-b border-gray-200 font-semibold text-gray-600">
                                                        <th className="py-2.5 px-3">Account Code</th>
                                                        <th className="py-2.5 px-3">Account Name</th>
                                                        <th className="py-2.5 px-3 text-right">Debit (₹)</th>
                                                        <th className="py-2.5 px-3 text-right">Credit (₹)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {(voucherDetail.lines || []).map((line, idx) => (
                                                        <tr key={idx} className="hover:bg-gray-50/50">
                                                            <td className="py-2.5 px-3 font-mono text-gray-600">{line.accountCode}</td>
                                                            <td className="py-2.5 px-3 font-medium text-gray-900">{line.accountName}</td>
                                                            <td className="py-2.5 px-3 text-right font-mono font-semibold text-blue-700">
                                                                {Number(line.debit) > 0 ? fmt(line.debit) : "—"}
                                                            </td>
                                                            <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-700">
                                                                {Number(line.credit) > 0 ? fmt(line.credit) : "—"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="bg-gray-50 border-t-2 border-gray-300 font-bold">
                                                        <td colSpan={2} className="py-2.5 px-3 text-gray-900 uppercase">
                                                            Grand Totals
                                                        </td>
                                                        <td className="py-2.5 px-3 text-right font-mono text-blue-800">
                                                            {fmt(voucherDetail.totalDebit)}
                                                        </td>
                                                        <td className="py-2.5 px-3 text-right font-mono text-emerald-800">
                                                            {fmt(voucherDetail.totalCredit)}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Balanced Verification Banner */}
                                    <div className="pt-1">
                                        {Math.abs(Number(voucherDetail.totalDebit || 0) - Number(voucherDetail.totalCredit || 0)) < 0.01 ? (
                                            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between font-semibold">
                                                <span>✓ BALANCED</span>
                                                <span className="font-mono font-normal">
                                                    Total Debit ({fmt(voucherDetail.totalDebit)}) == Total Credit ({fmt(voucherDetail.totalCredit)})
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center justify-between font-semibold">
                                                <span>⚠ UNBALANCED</span>
                                                <span className="font-mono font-normal">
                                                    Discrepancy: {fmt(Math.abs(Number(voucherDetail.totalDebit) - Number(voucherDetail.totalCredit)))}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                            <button
                                onClick={() => window.print()}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition shadow-sm"
                            >
                                🖨 Print Voucher Slip
                            </button>
                            <button
                                onClick={closeVoucherDetail}
                                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Entry Modal */}
            <JournalEntryModal
                isOpen={newEntryModalOpen}
                onClose={() => setNewEntryModalOpen(false)}
                onSuccess={() => {
                    setNewEntryModalOpen(false);
                    fetchJournals();
                }}
            />
        </div>
    );
};

export default JournalEntries;
