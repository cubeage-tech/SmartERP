import React, { useState, useEffect, useMemo, useCallback } from "react";
import financeService from "../../../core/services/modules/finance.service";

const ExpenseTracking = () => {
    const [journals, setJournals] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Modal state
    const [recordModalOpen, setRecordModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // Detail modal state
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const [voucherDetail, setVoucherDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        expenseAccountCode: "",
        paymentAccountCode: "",
        amount: "",
        description: "",
        reference: "",
    });

    // Filters
    const [search, setSearch] = useState("");
    const [selectedExpenseAccount, setSelectedExpenseAccount] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Fetch Journals and Chart of Accounts
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [journalsRes, accountsRes] = await Promise.all([
                financeService.getJournals(),
                financeService.getAccounts(),
            ]);
            setJournals(Array.isArray(journalsRes) ? journalsRes : []);
            setAccounts(Array.isArray(accountsRes) ? accountsRes : []);
        } catch (err) {
            console.error("Failed to load expense data:", err);
            setError(err.response?.data?.message || err.message || "Failed to load expenses data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Map of accounts by code
    const accountMap = useMemo(() => {
        const map = new Map();
        accounts.forEach((acc) => {
            map.set(acc.code.toUpperCase(), acc);
        });
        return map;
    }, [accounts]);

    // Filter eligible expense accounts (AccountType.EXPENSE)
    const expenseAccounts = useMemo(() => {
        return accounts.filter((a) => a.type === "EXPENSE" && a.active);
    }, [accounts]);

    // Filter eligible payment accounts (Cash/Bank under ASSET)
    const paymentAccounts = useMemo(() => {
        return accounts.filter(
            (a) =>
                a.type === "ASSET" &&
                a.active &&
                (a.code.startsWith("10") ||
                    a.name.toLowerCase().includes("cash") ||
                    a.name.toLowerCase().includes("bank"))
        );
    }, [accounts]);

    // Derive flat expense records from double-entry journal vouchers
    const expenseRecords = useMemo(() => {
        const records = [];

        journals.forEach((entry) => {
            if (entry.status !== "POSTED") return;

            const lines = entry.lines || [];
            // Find debit lines that hit an EXPENSE account
            const expenseLines = lines.filter((l) => {
                const acc = accountMap.get(l.accountCode?.toUpperCase());
                return acc && acc.type === "EXPENSE" && Number(l.debit) > 0;
            });

            // Find credit lines that represent payment (Cash/Bank/Payable)
            const paymentLines = lines.filter((l) => Number(l.credit) > 0);

            expenseLines.forEach((expLine) => {
                // Find primary payment line or fallback to the first credit line
                const payLine = paymentLines[0] || null;

                records.push({
                    id: `${entry.id}-${expLine.accountCode}`,
                    voucherId: entry.id,
                    voucherNumber: entry.entryNumber,
                    date: entry.entryDate,
                    reference: entry.reference || "",
                    description: entry.description || expLine.accountName,
                    expenseAccountCode: expLine.accountCode,
                    expenseAccountName: expLine.accountName,
                    paymentAccountCode: payLine ? payLine.accountCode : "—",
                    paymentAccountName: payLine ? payLine.accountName : "—",
                    amount: Number(expLine.debit),
                    status: entry.status,
                });
            });
        });

        // Sort by date descending, then voucherId descending
        return records.sort((a, b) => {
            if (b.date !== a.date) return b.date.localeCompare(a.date);
            return b.voucherId - a.voucherId;
        });
    }, [journals, accountMap]);

    // Apply UI filters to expense records
    const filteredExpenses = useMemo(() => {
        return expenseRecords.filter((rec) => {
            // Search filter
            if (search.trim()) {
                const s = search.toLowerCase();
                const matchDesc = rec.description.toLowerCase().includes(s);
                const matchVoucher = rec.voucherNumber.toLowerCase().includes(s);
                const matchRef = rec.reference.toLowerCase().includes(s);
                const matchExpAcc = rec.expenseAccountName.toLowerCase().includes(s);
                const matchPayAcc = rec.paymentAccountName.toLowerCase().includes(s);
                if (!matchDesc && !matchVoucher && !matchRef && !matchExpAcc && !matchPayAcc) {
                    return false;
                }
            }
            // Expense account filter
            if (selectedExpenseAccount && rec.expenseAccountCode !== selectedExpenseAccount) {
                return false;
            }
            // Date filters
            if (startDate && rec.date < startDate) return false;
            if (endDate && rec.date > endDate) return false;

            return true;
        });
    }, [expenseRecords, search, selectedExpenseAccount, startDate, endDate]);

    // Format currency INR
    const fmt = (val) => {
        const num = Number(val || 0);
        return "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Calculate Summary KPIs
    const kpis = useMemo(() => {
        const now = new Date();
        const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const currentYearStr = `${now.getFullYear()}`;

        let totalAmount = 0;
        let thisMonthAmount = 0;
        let thisYearAmount = 0;

        filteredExpenses.forEach((rec) => {
            totalAmount += rec.amount;
            if (rec.date && rec.date.startsWith(currentMonthStr)) {
                thisMonthAmount += rec.amount;
            }
            if (rec.date && rec.date.startsWith(currentYearStr)) {
                thisYearAmount += rec.amount;
            }
        });

        const count = filteredExpenses.length;
        const avgAmount = count > 0 ? totalAmount / count : 0;

        return {
            totalAmount,
            thisMonthAmount,
            thisYearAmount,
            count,
            avgAmount,
        };
    }, [filteredExpenses]);

    // Handle Record Expense Submit
    const handleRecordSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");

        const amountNum = Number(formData.amount);
        if (!formData.date) {
            setSubmitError("Please select a valid expense date.");
            return;
        }
        if (!formData.expenseAccountCode) {
            setSubmitError("Please select an Expense Account.");
            return;
        }
        if (!formData.paymentAccountCode) {
            setSubmitError("Please select a Payment Account (Cash / Bank).");
            return;
        }
        if (isNaN(amountNum) || amountNum <= 0) {
            setSubmitError("Amount must be greater than zero.");
            return;
        }
        if (!formData.description.trim()) {
            setSubmitError("Please enter a description for this expense.");
            return;
        }

        const expAcc = accountMap.get(formData.expenseAccountCode.toUpperCase());
        const payAcc = accountMap.get(formData.paymentAccountCode.toUpperCase());

        if (!expAcc) {
            setSubmitError("Selected Expense Account is invalid.");
            return;
        }
        if (!payAcc) {
            setSubmitError("Selected Payment Account is invalid.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await financeService.recordExpense({
                date: formData.date,
                amount: amountNum,
                expenseAccount: expAcc,
                paymentAccount: payAcc,
                description: formData.description.trim(),
                reference: formData.reference ? formData.reference.trim() : `EXP-${Date.now()}`,
            });

            setSuccessMessage(`Expense recorded successfully! Created Voucher: ${res.entryNumber}`);
            setRecordModalOpen(false);
            // Reset form
            setFormData({
                date: new Date().toISOString().split("T")[0],
                expenseAccountCode: "",
                paymentAccountCode: "",
                amount: "",
                description: "",
                reference: "",
            });
            // Auto refresh
            await fetchData();
            setTimeout(() => setSuccessMessage(""), 6000);
        } catch (err) {
            console.error("Failed to record expense:", err);
            setSubmitError(err.response?.data?.message || err.message || "Failed to record expense");
        } finally {
            setSubmitting(false);
        }
    };

    // Open Voucher Detail
    const openVoucherDetail = async (voucherId) => {
        setSelectedVoucherId(voucherId);
        setDetailLoading(true);
        setDetailError("");
        setVoucherDetail(null);
        try {
            const data = await financeService.getJournalById(voucherId);
            setVoucherDetail(data);
        } catch (err) {
            console.error("Failed to load voucher detail:", err);
            setDetailError(err.response?.data?.message || err.message || "Failed to load voucher detail");
        } finally {
            setDetailLoading(false);
        }
    };

    // Export CSV
    const exportCsv = () => {
        if (!filteredExpenses.length) return;
        const headers = ["Voucher Number", "Date", "Reference", "Expense Account", "Payment Account", "Description", "Amount", "Status"];
        const rows = filteredExpenses.map((r) => [
            `"${r.voucherNumber}"`,
            r.date,
            `"${r.reference}"`,
            `"${r.expenseAccountName} (${r.expenseAccountCode})"`,
            `"${r.paymentAccountName} (${r.paymentAccountCode})"`,
            `"${r.description.replace(/"/g, '""')}"`,
            r.amount,
            r.status,
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Expenses_Report_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Date presets
    const applyDatePreset = (preset) => {
        const now = new Date();
        if (preset === "today") {
            const d = now.toISOString().split("T")[0];
            setStartDate(d);
            setEndDate(d);
        } else if (preset === "thisMonth") {
            const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
            setStartDate(start);
            setEndDate(end);
        } else if (preset === "thisQuarter") {
            const qMonth = Math.floor(now.getMonth() / 3) * 3;
            const start = new Date(now.getFullYear(), qMonth, 1).toISOString().split("T")[0];
            const end = new Date(now.getFullYear(), qMonth + 3, 0).toISOString().split("T")[0];
            setStartDate(start);
            setEndDate(end);
        } else if (preset === "thisYear") {
            const start = `${now.getFullYear()}-01-01`;
            const end = `${now.getFullYear()}-12-31`;
            setStartDate(start);
            setEndDate(end);
        } else if (preset === "all") {
            setStartDate("");
            setEndDate("");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span>💳</span> Operational Expense Tracking
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Track, categorize, and record business expenses backed by double-entry General Ledger postings.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={exportCsv}
                        disabled={!filteredExpenses.length}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={() => {
                            setSubmitError("");
                            setRecordModalOpen(true);
                        }}
                        className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#1b4332] text-white hover:bg-[#143225] transition shadow-sm flex items-center gap-1.5"
                    >
                        <span>+</span> Record Expense
                    </button>
                </div>
            </div>

            {/* Success Alert */}
            {successMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
                    <span>✓ {successMessage}</span>
                    <button onClick={() => setSuccessMessage("")} className="text-emerald-600 hover:text-emerald-900">✕</button>
                </div>
            )}

            {/* Error Alert */}
            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm">
                    <span>⚠ {error}</span>
                    <button onClick={fetchData} className="underline hover:no-underline">Retry</button>
                </div>
            )}

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Expenses</p>
                    <p className="text-2xl font-black text-rose-700 mt-1">{fmt(kpis.totalAmount)}</p>
                    <p className="text-xs text-gray-400 mt-1">Filtered period total</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">This Month</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{fmt(kpis.thisMonthAmount)}</p>
                    <p className="text-xs text-gray-400 mt-1">Current calendar month</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">This Year</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{fmt(kpis.thisYearAmount)}</p>
                    <p className="text-xs text-gray-400 mt-1">Current calendar year</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Expense Count</p>
                    <p className="text-2xl font-black text-indigo-700 mt-1">{kpis.count}</p>
                    <p className="text-xs text-gray-400 mt-1">Total vouchers</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Average Expense</p>
                    <p className="text-2xl font-black text-amber-700 mt-1">{fmt(kpis.avgAmount)}</p>
                    <p className="text-xs text-gray-400 mt-1">Per transaction average</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[220px]">
                        <input
                            type="text"
                            placeholder="Search description, voucher #, reference..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="w-48">
                        <select
                            value={selectedExpenseAccount}
                            onChange={(e) => setSelectedExpenseAccount(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">All Expense Accounts</option>
                            {expenseAccounts.map((a) => (
                                <option key={a.code} value={a.code}>
                                    {a.code} - {a.name}
                                </option>
                            ))}
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
                            onClick={() => applyDatePreset("thisMonth")}
                            className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            This Month
                        </button>
                        <button
                            onClick={() => applyDatePreset("thisYear")}
                            className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            This Year
                        </button>
                        <button
                            onClick={() => applyDatePreset("all")}
                            className="px-2 py-1 text-xs rounded bg-rose-50 text-rose-700 hover:bg-rose-100"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Expense Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-xs text-gray-500 font-medium">
                        Loading expenses from General Ledger...
                    </div>
                ) : filteredExpenses.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 space-y-3">
                        <div className="text-3xl">🧾</div>
                        <p className="text-sm font-semibold text-gray-800">No expenses found</p>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto">
                            No operational expense transactions match your filters. Record your first expense to begin tracking.
                        </p>
                        <button
                            onClick={() => setRecordModalOpen(true)}
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1b4332] text-white hover:bg-[#143225] transition"
                        >
                            + Record First Expense
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Voucher Number</th>
                                    <th className="py-3 px-4">Expense Account (Dr)</th>
                                    <th className="py-3 px-4">Payment Account (Cr)</th>
                                    <th className="py-3 px-4">Description</th>
                                    <th className="py-3 px-4 text-right">Amount (₹)</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                    <th className="py-3 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredExpenses.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/75 transition">
                                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap font-medium">
                                            {item.date}
                                        </td>
                                        <td className="py-3 px-4 font-mono font-bold text-gray-900">
                                            {item.voucherNumber}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="font-semibold text-gray-900 block">{item.expenseAccountName}</span>
                                            <span className="font-mono text-[11px] text-gray-400">{item.expenseAccountCode}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-gray-700 block">{item.paymentAccountName}</span>
                                            <span className="font-mono text-[11px] text-gray-400">{item.paymentAccountCode}</span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-800 max-w-xs truncate" title={item.description}>
                                            {item.description}
                                        </td>
                                        <td className="py-3 px-4 text-right font-mono font-bold text-rose-700">
                                            {fmt(item.amount)}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => openVoucherDetail(item.voucherId)}
                                                className="px-2.5 py-1 text-xs font-medium rounded bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
                                            >
                                                View Voucher
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-50 border-t-2 border-gray-300 font-bold">
                                    <td colSpan={5} className="py-3 px-4 text-gray-900 uppercase">
                                        Total Filtered Expenses ({filteredExpenses.length} transactions)
                                    </td>
                                    <td className="py-3 px-4 text-right font-mono text-rose-800 text-sm">
                                        {fmt(kpis.totalAmount)}
                                    </td>
                                    <td colSpan={2}></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>

            {/* Record Expense Modal */}
            {recordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <span>💸</span> Record Business Expense
                            </h3>
                            <button
                                onClick={() => setRecordModalOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 text-lg transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleRecordSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
                            {submitError && (
                                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-semibold">
                                    ⚠ {submitError}
                                </div>
                            )}

                            {/* Date & Reference */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">Expense Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">Reference / Bill # (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. INV-9901, BILL-04"
                                        value={formData.reference}
                                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Expense Account */}
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Expense Account (Debit) *</label>
                                <select
                                    required
                                    value={formData.expenseAccountCode}
                                    onChange={(e) => setFormData({ ...formData, expenseAccountCode: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="">-- Select Expense Category --</option>
                                    {expenseAccounts.map((a) => (
                                        <option key={a.code} value={a.code}>
                                            {a.code} - {a.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Payment Account */}
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Paid Through Account (Credit) *</label>
                                <select
                                    required
                                    value={formData.paymentAccountCode}
                                    onChange={(e) => setFormData({ ...formData, paymentAccountCode: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="">-- Select Payment Method --</option>
                                    {paymentAccounts.map((a) => (
                                        <option key={a.code} value={a.code}>
                                            {a.code} - {a.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Amount (₹) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    required
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Narration / Description *</label>
                                <textarea
                                    required
                                    rows={2}
                                    placeholder="Brief explanation of the expense..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Double-Entry Preview Box */}
                            {formData.expenseAccountCode && formData.paymentAccountCode && Number(formData.amount) > 0 && (
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-[11px] text-emerald-900">
                                    <p className="font-bold uppercase tracking-wider text-[10px] text-emerald-800">
                                        Double-Entry Journal Preview
                                    </p>
                                    <div className="flex justify-between font-mono">
                                        <span>Dr {accountMap.get(formData.expenseAccountCode.toUpperCase())?.name}</span>
                                        <span className="font-bold">{fmt(formData.amount)}</span>
                                    </div>
                                    <div className="flex justify-between font-mono pl-4">
                                        <span>Cr {accountMap.get(formData.paymentAccountCode.toUpperCase())?.name}</span>
                                        <span className="font-bold">{fmt(formData.amount)}</span>
                                    </div>
                                    <p className="text-[10px] text-emerald-700 pt-1 border-t border-emerald-200 font-semibold">
                                        ✓ Balanced Transaction · Ledger, P&L, and Cash Flow will automatically reflect this entry.
                                    </p>
                                </div>
                            )}

                            {/* Footer Buttons */}
                            <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setRecordModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#1b4332] text-white hover:bg-[#143225] transition disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    {submitting ? "Posting..." : "Record & Post Journal"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Voucher Detail Modal */}
            {selectedVoucherId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <span>🧾</span> Voucher Audit Inspection
                                </h3>
                                <p className="text-xs text-gray-500 font-mono mt-0.5">
                                    Voucher ID: #{selectedVoucherId}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedVoucherId(null)}
                                className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 text-lg transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
                            {detailLoading ? (
                                <div className="p-8 text-center text-gray-500">
                                    Loading voucher lines...
                                </div>
                            ) : detailError ? (
                                <div className="p-4 bg-rose-50 text-rose-800 font-semibold rounded-lg">
                                    ⚠ {detailError}
                                </div>
                            ) : voucherDetail ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
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
                                            <span className="text-gray-400 block">Narration</span>
                                            <span className="text-gray-800">{voucherDetail.description || "—"}</span>
                                        </div>
                                    </div>

                                    {/* Lines Table */}
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        <table className="w-full text-xs text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100 border-b border-gray-200 font-semibold text-gray-600">
                                                    <th className="py-2 px-3">Account Code</th>
                                                    <th className="py-2 px-3">Account Name</th>
                                                    <th className="py-2 px-3 text-right">Debit (₹)</th>
                                                    <th className="py-2 px-3 text-right">Credit (₹)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {(voucherDetail.lines || []).map((line, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50/50">
                                                        <td className="py-2 px-3 font-mono text-gray-600">{line.accountCode}</td>
                                                        <td className="py-2 px-3 font-medium text-gray-900">{line.accountName}</td>
                                                        <td className="py-2 px-3 text-right font-mono font-semibold text-blue-700">
                                                            {Number(line.debit) > 0 ? fmt(line.debit) : "—"}
                                                        </td>
                                                        <td className="py-2 px-3 text-right font-mono font-semibold text-emerald-700">
                                                            {Number(line.credit) > 0 ? fmt(line.credit) : "—"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="bg-gray-50 border-t-2 border-gray-300 font-bold">
                                                    <td colSpan={2} className="py-2 px-3 text-gray-900 uppercase">
                                                        Totals
                                                    </td>
                                                    <td className="py-2 px-3 text-right font-mono text-blue-800">
                                                        {fmt(voucherDetail.totalDebit)}
                                                    </td>
                                                    <td className="py-2 px-3 text-right font-mono text-emerald-800">
                                                        {fmt(voucherDetail.totalCredit)}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                            <button
                                onClick={() => window.print()}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition shadow-sm"
                            >
                                🖨 Print Slip
                            </button>
                            <button
                                onClick={() => setSelectedVoucherId(null)}
                                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseTracking;
