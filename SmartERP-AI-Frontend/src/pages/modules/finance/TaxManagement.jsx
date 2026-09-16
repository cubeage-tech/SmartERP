import React, { useState, useEffect, useMemo, useCallback } from "react";
import financeService from "../../../core/services/modules/finance.service";

const TaxManagement = () => {
    const [journals, setJournals] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Modal state
    const [recordModalOpen, setRecordModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [creatingStandardAccounts, setCreatingStandardAccounts] = useState(false);

    // Detail modal state
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const [voucherDetail, setVoucherDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");

    // Form state
    const [transactionMode, setTransactionMode] = useState("INPUT_GST"); // INPUT_GST | OUTPUT_GST | GST_PAYMENT
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        reference: "",
        description: "",
        // For INPUT_GST (Expense + Tax):
        expenseAccountCode: "",
        baseAmount: "",
        inputTaxAccountCode: "1300",
        taxAmount: "",
        paymentAccountCode: "1001",
        // For OUTPUT_GST (Sale + Tax):
        revenueAccountCode: "4001",
        outputTaxAccountCode: "2200",
        receiptAccountCode: "1001",
        // For GST_PAYMENT:
        taxPayableAccountCode: "2200",
        paymentTaxAmount: "",
        paidFromAccountCode: "1001",
    });

    // Filters
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Fetch data
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
            console.error("Failed to load tax data:", err);
            setError(err.response?.data?.message || err.message || "Failed to load tax data");
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

    // Detect Input Tax accounts (Asset)
    const inputTaxAccounts = useMemo(() => {
        return accounts.filter((a) => {
            const name = a.name.toLowerCase();
            const code = a.code;
            return a.active && (code === "1300" || name.includes("input gst") || name.includes("itc") || (a.type === "ASSET" && name.includes("tax")));
        });
    }, [accounts]);

    // Detect Output Tax / GST Payable accounts (Liability)
    const outputTaxAccounts = useMemo(() => {
        return accounts.filter((a) => {
            const name = a.name.toLowerCase();
            const code = a.code;
            return a.active && (code === "2200" || name.includes("output gst") || name.includes("gst payable") || (a.type === "LIABILITY" && name.includes("tax")));
        });
    }, [accounts]);

    // Expense accounts for Input Tax transactions
    const expenseAccounts = useMemo(() => {
        return accounts.filter((a) => a.type === "EXPENSE" && a.active);
    }, [accounts]);

    // Revenue accounts for Output Tax transactions
    const revenueAccounts = useMemo(() => {
        return accounts.filter((a) => a.type === "REVENUE" && a.active);
    }, [accounts]);

    // Cash / Bank accounts for settlement
    const paymentAccounts = useMemo(() => {
        return accounts.filter((a) =>
            a.type === "ASSET" &&
            a.active &&
            (a.code.startsWith("10") ||
                a.name.toLowerCase().includes("cash") ||
                a.name.toLowerCase().includes("bank"))
        );
    }, [accounts]);

    // Check if standard GST accounts are present
    const hasTaxAccounts = inputTaxAccounts.length > 0 || outputTaxAccounts.length > 0;

    // Helper to create standard GST accounts if missing
    const handleInitializeGstAccounts = async () => {
        setCreatingStandardAccounts(true);
        setError("");
        try {
            const promises = [];
            if (!accountMap.has("1300")) {
                promises.push(
                    financeService.createAccount({
                        code: "1300",
                        name: "Input Tax Credit (GST)",
                        type: "ASSET",
                    })
                );
            }
            if (!accountMap.has("2200")) {
                promises.push(
                    financeService.createAccount({
                        code: "2200",
                        name: "GST Output Payable",
                        type: "LIABILITY",
                    })
                );
            }
            await Promise.all(promises);
            setSuccessMessage("Standard GST Accounts (1300 & 2200) registered successfully!");
            await fetchData();
            setTimeout(() => setSuccessMessage(""), 6000);
        } catch (err) {
            console.error("Failed to initialize GST accounts:", err);
            setError(err.response?.data?.message || err.message || "Failed to initialize GST accounts");
        } finally {
            setCreatingStandardAccounts(false);
        }
    };

    // Derive flat Tax transactions from posted double-entry journal vouchers
    const taxRecords = useMemo(() => {
        const records = [];

        journals.forEach((entry) => {
            if (entry.status !== "POSTED") return;
            const lines = entry.lines || [];

            // Check lines for tax accounts
            lines.forEach((line) => {
                const code = line.accountCode?.toUpperCase();
                const acc = accountMap.get(code);
                if (!acc) return;

                const name = acc.name.toLowerCase();
                const isInputTax = code === "1300" || name.includes("input gst") || name.includes("itc") || (acc.type === "ASSET" && name.includes("tax"));
                const isOutputTax = code === "2200" || name.includes("output gst") || name.includes("gst payable") || (acc.type === "LIABILITY" && name.includes("tax"));

                if (!isInputTax && !isOutputTax) return;

                // Determine transaction category and counter line
                let category = "OTHER_TAX";
                let taxAmount = 0;
                let counterLine = null;

                if (isInputTax) {
                    if (Number(line.debit) > 0) {
                        category = "INPUT_GST";
                        taxAmount = Number(line.debit);
                        counterLine = lines.find((l) => Number(l.credit) > 0);
                    } else if (Number(line.credit) > 0) {
                        category = "GST_SETTLEMENT";
                        taxAmount = Number(line.credit);
                        counterLine = lines.find((l) => Number(l.debit) > 0);
                    }
                } else if (isOutputTax) {
                    if (Number(line.credit) > 0) {
                        category = "OUTPUT_GST";
                        taxAmount = Number(line.credit);
                        counterLine = lines.find((l) => Number(l.debit) > 0);
                    } else if (Number(line.debit) > 0) {
                        category = "GST_PAYMENT";
                        taxAmount = Number(line.debit);
                        counterLine = lines.find((l) => Number(l.credit) > 0);
                    }
                }

                records.push({
                    id: `${entry.id}-${line.accountCode}-${category}`,
                    voucherId: entry.id,
                    voucherNumber: entry.entryNumber,
                    date: entry.entryDate,
                    reference: entry.reference || "—",
                    description: entry.description || acc.name,
                    category,
                    taxAccountCode: acc.code,
                    taxAccountName: acc.name,
                    counterAccountCode: counterLine ? counterLine.accountCode : "—",
                    counterAccountName: counterLine ? counterLine.accountName : "—",
                    taxAmount,
                    status: entry.status,
                });
            });
        });

        return records.sort((a, b) => {
            if (b.date !== a.date) return b.date.localeCompare(a.date);
            return b.voucherId - a.voucherId;
        });
    }, [journals, accountMap]);

    // Apply UI filters
    const filteredRecords = useMemo(() => {
        return taxRecords.filter((rec) => {
            if (search.trim()) {
                const s = search.toLowerCase();
                const matchDesc = rec.description.toLowerCase().includes(s);
                const matchVoucher = rec.voucherNumber.toLowerCase().includes(s);
                const matchRef = rec.reference.toLowerCase().includes(s);
                const matchTaxAcc = rec.taxAccountName.toLowerCase().includes(s);
                const matchCounter = rec.counterAccountName.toLowerCase().includes(s);
                if (!matchDesc && !matchVoucher && !matchRef && !matchTaxAcc && !matchCounter) {
                    return false;
                }
            }
            if (selectedCategory && rec.category !== selectedCategory) {
                return false;
            }
            if (startDate && rec.date < startDate) return false;
            if (endDate && rec.date > endDate) return false;

            return true;
        });
    }, [taxRecords, search, selectedCategory, startDate, endDate]);

    // Currency Formatter
    const fmt = (val) => {
        const num = Number(val || 0);
        return "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Calculate dynamic Tax KPIs
    const kpis = useMemo(() => {
        let inputGst = 0;
        let outputGst = 0;
        let gstPaid = 0;

        filteredRecords.forEach((r) => {
            if (r.category === "INPUT_GST") {
                inputGst += r.taxAmount;
            } else if (r.category === "OUTPUT_GST") {
                outputGst += r.taxAmount;
            } else if (r.category === "GST_PAYMENT") {
                gstPaid += r.taxAmount;
            }
        });

        const netGst = outputGst - inputGst;
        const totalCount = filteredRecords.length;

        return {
            totalCount,
            inputGst,
            outputGst,
            netGst,
            gstPaid,
        };
    }, [filteredRecords]);

    // Format double-entry preview before submit
    const previewData = useMemo(() => {
        const lines = [];
        let totalDebit = 0;
        let totalCredit = 0;

        if (transactionMode === "INPUT_GST") {
            const base = Number(formData.baseAmount || 0);
            const tax = Number(formData.taxAmount || 0);
            const total = base + tax;
            const expAcc = accountMap.get(formData.expenseAccountCode?.toUpperCase());
            const taxAcc = accountMap.get(formData.inputTaxAccountCode?.toUpperCase());
            const payAcc = accountMap.get(formData.paymentAccountCode?.toUpperCase());

            if (base > 0 && expAcc) {
                lines.push({ code: expAcc.code, name: expAcc.name, debit: base, credit: 0 });
                totalDebit += base;
            }
            if (tax > 0 && taxAcc) {
                lines.push({ code: taxAcc.code, name: taxAcc.name, debit: tax, credit: 0 });
                totalDebit += tax;
            }
            if (total > 0 && payAcc) {
                lines.push({ code: payAcc.code, name: payAcc.name, debit: 0, credit: total });
                totalCredit += total;
            }
        } else if (transactionMode === "OUTPUT_GST") {
            const base = Number(formData.baseAmount || 0);
            const tax = Number(formData.taxAmount || 0);
            const total = base + tax;
            const recAcc = accountMap.get(formData.receiptAccountCode?.toUpperCase());
            const revAcc = accountMap.get(formData.revenueAccountCode?.toUpperCase());
            const taxAcc = accountMap.get(formData.outputTaxAccountCode?.toUpperCase());

            if (total > 0 && recAcc) {
                lines.push({ code: recAcc.code, name: recAcc.name, debit: total, credit: 0 });
                totalDebit += total;
            }
            if (base > 0 && revAcc) {
                lines.push({ code: revAcc.code, name: revAcc.name, debit: 0, credit: base });
                totalCredit += base;
            }
            if (tax > 0 && taxAcc) {
                lines.push({ code: taxAcc.code, name: taxAcc.name, debit: 0, credit: tax });
                totalCredit += tax;
            }
        } else if (transactionMode === "GST_PAYMENT") {
            const tax = Number(formData.paymentTaxAmount || 0);
            const taxAcc = accountMap.get(formData.taxPayableAccountCode?.toUpperCase());
            const payAcc = accountMap.get(formData.paidFromAccountCode?.toUpperCase());

            if (tax > 0 && taxAcc) {
                lines.push({ code: taxAcc.code, name: taxAcc.name, debit: tax, credit: 0 });
                totalDebit += tax;
            }
            if (tax > 0 && payAcc) {
                lines.push({ code: payAcc.code, name: payAcc.name, debit: 0, credit: tax });
                totalCredit += tax;
            }
        }

        const isBalanced = totalDebit > 0 && Math.abs(totalDebit - totalCredit) < 0.001;

        return {
            lines,
            totalDebit,
            totalCredit,
            isBalanced,
        };
    }, [transactionMode, formData, accountMap]);

    // Handle Submit
    const handleRecordSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");

        if (!formData.date) {
            setSubmitError("Please select a valid transaction date.");
            return;
        }

        if (!previewData.isBalanced || previewData.lines.length < 2) {
            setSubmitError("Transaction must have balanced Debit and Credit lines totaling greater than zero.");
            return;
        }

        const payload = {
            entryDate: formData.date,
            description: formData.description.trim() || `Tax Transaction: ${transactionMode}`,
            reference: formData.reference.trim() || `TAX-${Date.now()}`,
            lines: previewData.lines.map((l) => ({
                accountCode: l.code,
                accountName: l.name,
                debit: l.debit,
                credit: l.credit,
            })),
        };

        setSubmitting(true);
        try {
            const res = await financeService.recordTaxTransaction(payload);
            setSuccessMessage(`Tax transaction recorded successfully! Voucher: ${res.entryNumber}`);
            setRecordModalOpen(false);
            // Reset form
            setFormData({
                date: new Date().toISOString().split("T")[0],
                reference: "",
                description: "",
                expenseAccountCode: "",
                baseAmount: "",
                inputTaxAccountCode: inputTaxAccounts[0]?.code || "1300",
                taxAmount: "",
                paymentAccountCode: "1001",
                revenueAccountCode: "4001",
                outputTaxAccountCode: outputTaxAccounts[0]?.code || "2200",
                receiptAccountCode: "1001",
                taxPayableAccountCode: outputTaxAccounts[0]?.code || "2200",
                paymentTaxAmount: "",
                paidFromAccountCode: "1001",
            });
            await fetchData();
            setTimeout(() => setSuccessMessage(""), 6000);
        } catch (err) {
            console.error("Failed to record tax transaction:", err);
            setSubmitError(err.response?.data?.message || err.message || "Failed to record tax transaction");
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
        if (!filteredRecords.length) return;
        const headers = ["Voucher Number", "Date", "Reference", "Transaction Type", "Tax Account", "Counter Account", "Description", "Tax Amount", "Status"];
        const rows = filteredRecords.map((r) => [
            `"${r.voucherNumber}"`,
            r.date,
            `"${r.reference}"`,
            r.category,
            `"${r.taxAccountName} (${r.taxAccountCode})"`,
            `"${r.counterAccountName} (${r.counterAccountCode})"`,
            `"${r.description.replace(/"/g, '""')}"`,
            r.taxAmount,
            r.status,
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `GST_Tax_Report_${new Date().toISOString().split("T")[0]}.csv`);
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
                        <span>🏛</span> Tax Management & GST Compliance
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Track Input Tax Credit (ITC), Output GST liability, tax payments, and statutory settlements.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={exportCsv}
                        disabled={!filteredRecords.length}
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
                        <span>+</span> Record Tax Transaction
                    </button>
                </div>
            </div>

            {/* Missing Accounts Notice Banner */}
            {!hasTaxAccounts && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div>
                        <p className="font-bold flex items-center gap-1.5">
                            <span>ℹ</span> Standard GST Accounts Not Found in Chart of Accounts
                        </p>
                        <p className="text-amber-700 mt-0.5">
                            To record GST purchases and sales, add standard tax accounts (Code 1300: Input Tax Credit [Asset] and Code 2200: GST Output Payable [Liability]).
                        </p>
                    </div>
                    <button
                        onClick={handleInitializeGstAccounts}
                        disabled={creatingStandardAccounts}
                        className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg text-xs whitespace-nowrap transition disabled:opacity-50"
                    >
                        {creatingStandardAccounts ? "Initializing..." : "+ Setup Standard GST Accounts"}
                    </button>
                </div>
            )}

            {/* Success Alert */}
            {successMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm">
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
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tax Transactions</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{kpis.totalCount}</p>
                    <p className="text-xs text-gray-400 mt-1">Filtered vouchers count</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Input GST (ITC)</p>
                    <p className="text-2xl font-black text-emerald-700 mt-1">{fmt(kpis.inputGst)}</p>
                    <p className="text-xs text-gray-400 mt-1">Total credit accrued</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Output GST</p>
                    <p className="text-2xl font-black text-rose-700 mt-1">{fmt(kpis.outputGst)}</p>
                    <p className="text-xs text-gray-400 mt-1">Total tax collected</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Net GST Position</p>
                    <p className={`text-2xl font-black mt-1 ${kpis.netGst > 0 ? "text-rose-700" : kpis.netGst < 0 ? "text-emerald-700" : "text-gray-900"}`}>
                        {fmt(Math.abs(kpis.netGst))}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        kpis.netGst > 0 ? "bg-rose-100 text-rose-800" : kpis.netGst < 0 ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700"
                    }`}>
                        {kpis.netGst > 0 ? "Payable to Govt" : kpis.netGst < 0 ? "ITC Carryforward" : "Balanced"}
                    </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">GST Paid / Settled</p>
                    <p className="text-2xl font-black text-indigo-700 mt-1">{fmt(kpis.gstPaid)}</p>
                    <p className="text-xs text-gray-400 mt-1">Remitted to tax authority</p>
                </div>
            </div>

            {/* GST Summary & Formula Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                    Statutory GST Reconciliation Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-500 block">Total Output GST (Liability)</span>
                        <span className="font-mono font-bold text-sm text-gray-900">{fmt(kpis.outputGst)}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-500 block">Less: Input Tax Credit (Asset)</span>
                        <span className="font-mono font-bold text-sm text-emerald-700">− {fmt(kpis.inputGst)}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <span className="text-emerald-900 block font-semibold">Net Statutory Position</span>
                        <span className="font-mono font-black text-sm text-emerald-900">
                            {kpis.netGst > 0 ? `${fmt(kpis.netGst)} (Payable)` : kpis.netGst < 0 ? `${fmt(Math.abs(kpis.netGst))} (Receivable)` : "₹0.00 (Balanced)"}
                        </span>
                    </div>
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
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">All Tax Types</option>
                            <option value="INPUT_GST">Input GST (Purchase / ITC)</option>
                            <option value="OUTPUT_GST">Output GST (Sales)</option>
                            <option value="GST_PAYMENT">GST Payment (To Govt)</option>
                            <option value="GST_SETTLEMENT">GST Settlement</option>
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

            {/* Tax Transaction Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-xs text-gray-500 font-medium">
                        Loading tax transactions from General Ledger...
                    </div>
                ) : filteredRecords.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 space-y-3">
                        <div className="text-3xl">🧾</div>
                        <p className="text-sm font-semibold text-gray-800">No tax transactions found</p>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto">
                            No GST or tax transactions match your current filters. Record your first tax transaction to begin tracking statutory compliance.
                        </p>
                        <button
                            onClick={() => setRecordModalOpen(true)}
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1b4332] text-white hover:bg-[#143225] transition"
                        >
                            + Record Tax Transaction
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Voucher #</th>
                                    <th className="py-3 px-4">Type</th>
                                    <th className="py-3 px-4">Tax Account</th>
                                    <th className="py-3 px-4">Counter Account</th>
                                    <th className="py-3 px-4">Narration</th>
                                    <th className="py-3 px-4 text-right">Tax Amount (₹)</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                    <th className="py-3 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredRecords.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/75 transition">
                                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap font-medium">
                                            {item.date}
                                        </td>
                                        <td className="py-3 px-4 font-mono font-bold text-gray-900">
                                            {item.voucherNumber}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                                                    item.category === "INPUT_GST"
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : item.category === "OUTPUT_GST"
                                                        ? "bg-rose-100 text-rose-800"
                                                        : "bg-blue-100 text-blue-800"
                                                }`}
                                            >
                                                {item.category.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="font-semibold text-gray-900 block">{item.taxAccountName}</span>
                                            <span className="font-mono text-[11px] text-gray-400">{item.taxAccountCode}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-gray-700 block">{item.counterAccountName}</span>
                                            <span className="font-mono text-[11px] text-gray-400">{item.counterAccountCode}</span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-800 max-w-xs truncate" title={item.description}>
                                            {item.description}
                                        </td>
                                        <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">
                                            {fmt(item.taxAmount)}
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
                        </table>
                    </div>
                )}
            </div>

            {/* Record Tax Transaction Modal */}
            {recordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <span>⚖</span> Record GST / Tax Transaction
                            </h3>
                            <button
                                onClick={() => setRecordModalOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 text-lg transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleRecordSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
                            {submitError && (
                                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-semibold">
                                    ⚠ {submitError}
                                </div>
                            )}

                            {/* Mode Toggle */}
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1.5">Tax Transaction Type *</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setTransactionMode("INPUT_GST")}
                                        className={`py-2 px-2 text-center rounded-lg border text-xs font-bold transition ${
                                            transactionMode === "INPUT_GST"
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        Purchase (Input GST)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTransactionMode("OUTPUT_GST")}
                                        className={`py-2 px-2 text-center rounded-lg border text-xs font-bold transition ${
                                            transactionMode === "OUTPUT_GST"
                                                ? "bg-rose-50 border-rose-500 text-rose-800"
                                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        Sale (Output GST)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTransactionMode("GST_PAYMENT")}
                                        className={`py-2 px-2 text-center rounded-lg border text-xs font-bold transition ${
                                            transactionMode === "GST_PAYMENT"
                                                ? "bg-blue-50 border-blue-500 text-blue-800"
                                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        Payment to Govt
                                    </button>
                                </div>
                            </div>

                            {/* Date & Reference */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">Reference (Bill / Inv #)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. GST-INV-001"
                                        value={formData.reference}
                                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Mode Specific Inputs */}
                            {transactionMode === "INPUT_GST" && (
                                <div className="space-y-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">Expense / Purchase Account (Dr) *</label>
                                        <select
                                            required
                                            value={formData.expenseAccountCode}
                                            onChange={(e) => setFormData({ ...formData, expenseAccountCode: e.target.value })}
                                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white"
                                        >
                                            <option value="">-- Select Expense Category --</option>
                                            {expenseAccounts.map((a) => (
                                                <option key={a.code} value={a.code}>
                                                    {a.code} - {a.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-1">Base Amount (₹) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                required
                                                placeholder="0.00"
                                                value={formData.baseAmount}
                                                onChange={(e) => setFormData({ ...formData, baseAmount: e.target.value })}
                                                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 font-mono font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-1">Input GST Amount (₹) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                required
                                                placeholder="0.00"
                                                value={formData.taxAmount}
                                                onChange={(e) => setFormData({ ...formData, taxAmount: e.target.value })}
                                                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 font-mono font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-1">Input Tax Account *</label>
                                            <select
                                                required
                                                value={formData.inputTaxAccountCode}
                                                onChange={(e) => setFormData({ ...formData, inputTaxAccountCode: e.target.value })}
                                                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white"
                                            >
                                                {inputTaxAccounts.length > 0 ? (
                                                    inputTaxAccounts.map((a) => (
                                                        <option key={a.code} value={a.code}>
                                                            {a.code} - {a.name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="1300">1300 - Input Tax Credit (GST)</option>
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-1">Paid From Account (Cr) *</label>
                                            <select
                                                required
                                                value={formData.paymentAccountCode}
                                                onChange={(e) => setFormData({ ...formData, paymentAccountCode: e.target.value })}
                                                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white"
                                            >
                                                {paymentAccounts.map((a) => (
                                                    <option key={a.code} value={a.code}>
                                                        {a.code} - {a.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {transactionMode === "OUTPUT_GST" && (
                                <div className="space-y-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">Revenue / Sales Account (Cr) *</label>
                                        <select
                                            required
                                            value={formData.revenueAccountCode}
                                            onChange={(e) => setFormData({ ...formData, revenueAccountCode: e.target.value })}
                                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white"
                                        >
                                            {revenueAccounts.map((a) => (
                                                <option key={a.code} value={a.code}>
                                                    {a.code} - {a.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-1">Base Sales Amount (₹) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                required
                                                placeholder="0.00"
                                                value={formData.baseAmount}
                                                onChange={(e) => setFormData({ ...formData, baseAmount: e.target.value })}
                                                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 font-mono font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-1">Output GST Amount (₹) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                required
                                                placeholder="0.00"
                                                value={formData.taxAmount}
                                                onChange={(e) => setFormData({ ...formData, taxAmount: e.target.value })}
                                                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 font-mono font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-1">Output Tax Account *</label>
                                            <select
                                                required
                                                value={formData.outputTaxAccountCode}
                                                onChange={(e) => setFormData({ ...formData, outputTaxAccountCode: e.target.value })}
                                                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white"
                                            >
                                                {outputTaxAccounts.length > 0 ? (
                                                    outputTaxAccounts.map((a) => (
                                                        <option key={a.code} value={a.code}>
                                                            {a.code} - {a.name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="2200">2200 - GST Output Payable</option>
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-1">Received Into Account (Dr) *</label>
                                            <select
                                                required
                                                value={formData.receiptAccountCode}
                                                onChange={(e) => setFormData({ ...formData, receiptAccountCode: e.target.value })}
                                                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white"
                                            >
                                                {paymentAccounts.map((a) => (
                                                    <option key={a.code} value={a.code}>
                                                        {a.code} - {a.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {transactionMode === "GST_PAYMENT" && (
                                <div className="space-y-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">GST Liability Account (Dr) *</label>
                                        <select
                                            required
                                            value={formData.taxPayableAccountCode}
                                            onChange={(e) => setFormData({ ...formData, taxPayableAccountCode: e.target.value })}
                                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white"
                                        >
                                            {outputTaxAccounts.length > 0 ? (
                                                outputTaxAccounts.map((a) => (
                                                    <option key={a.code} value={a.code}>
                                                        {a.code} - {a.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="2200">2200 - GST Output Payable</option>
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">Tax Remitted Amount (₹) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            required
                                            placeholder="0.00"
                                            value={formData.paymentTaxAmount}
                                            onChange={(e) => setFormData({ ...formData, paymentTaxAmount: e.target.value })}
                                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 font-mono font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">Paid From Account (Cr) *</label>
                                        <select
                                            required
                                            value={formData.paidFromAccountCode}
                                            onChange={(e) => setFormData({ ...formData, paidFromAccountCode: e.target.value })}
                                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white"
                                        >
                                            {paymentAccounts.map((a) => (
                                                <option key={a.code} value={a.code}>
                                                    {a.code} - {a.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Narration */}
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Narration / Description</label>
                                <textarea
                                    rows={2}
                                    placeholder="Explanation of statutory tax transaction..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Double-Entry Journal Preview */}
                            {previewData.lines.length > 0 && (
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-[11px] text-emerald-900">
                                    <p className="font-bold uppercase tracking-wider text-[10px] text-emerald-800">
                                        Double-Entry Journal Preview
                                    </p>
                                    {previewData.lines.map((l, idx) => (
                                        <div key={idx} className={`flex justify-between font-mono ${l.credit > 0 ? "pl-4" : ""}`}>
                                            <span>
                                                {l.debit > 0 ? "Dr" : "Cr"} {l.name} ({l.code})
                                            </span>
                                            <span className="font-bold">{fmt(l.debit > 0 ? l.debit : l.credit)}</span>
                                        </div>
                                    ))}
                                    <div className="pt-1.5 border-t border-emerald-200 flex justify-between font-bold">
                                        <span>Total Debit: {fmt(previewData.totalDebit)}</span>
                                        <span>Total Credit: {fmt(previewData.totalCredit)}</span>
                                    </div>
                                    <p className="text-[10px] text-emerald-700 font-semibold">
                                        {previewData.isBalanced ? "✓ BALANCED — Ready for General Ledger posting" : "⚠ UNBALANCED — Please check amounts"}
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
                                    disabled={submitting || !previewData.isBalanced}
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

export default TaxManagement;
