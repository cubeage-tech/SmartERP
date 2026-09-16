import { useState, useEffect, useRef } from "react";
import financeService from "../../../core/services/modules/finance.service";

/* ================================================================
   QUICK ACCOUNTS — sidebar list
================================================================ */
const QUICK_ACCOUNTS = [
    { code: "1001", name: "Cash in Hand", type: "Asset" },
    { code: "1002", name: "Cash at Bank", type: "Asset" },
    { code: "1100", name: "Accounts Receivable", type: "Current Asset" },
    { code: "1200", name: "Inventory", type: "Asset" },
    { code: "1500", name: "Computer Equipment", type: "Fixed Asset" },
    { code: "2000", name: "Accounts Payable", type: "Current Liability" },
    { code: "3000", name: "Salary Expense", type: "Expense" },
    { code: "3100", name: "Rent Expense", type: "Expense" },
];

const TRANSACTION_TYPES = [
    "General Journal",
    "Sales Invoice",
    "Purchase Invoice",
    "Payment Voucher",
    "Receipt Voucher",
    "Contra Entry",
    "Debit Note",
    "Credit Note",
];

const CURRENCIES = [
    "INR - Indian Rupee",
    "USD - US Dollar",
    "EUR - Euro",
    "GBP - British Pound",
];

const BRANCHES = ["All Branches", "Head Office", "Mumbai", "Delhi", "Bangalore"];
const FIN_YEARS = ["2026-27", "2025-26", "2024-25"];
const COST_CTRS = ["", "IT Department", "HR", "Finance", "Operations", "Sales"];
const DEPTS = ["", "Administration", "Engineering", "Marketing", "Accounts"];
const TAX_OPTS = ["", "GST 18%", "GST 12%", "GST 5%", "TDS 10%", "Exempt"];
const USERS = ["Rohit Sharma", "Neha Verma", "Amit Patel", "Priya Singh"];

/* ---- helpers ---- */
const today = () => {
    const d = new Date();
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const fmt = (n) =>
    Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const emptyLine = () => ({
    id: Date.now() + Math.random(),
    account: "",
    accountType: "",
    description: "",
    debit: "",
    credit: "",
    costCenter: "",
    department: "",
    tax: "",
});

/* ================================================================
   MODAL
================================================================ */
const JournalEntryModal = ({ open, onClose, onSuccess }) => {
    /* ---------- form state ---------- */
    const [submitting, setSubmitting] = useState(false);
    const [transactionType, setTransactionType] = useState("General Journal");
    const [currency, setCurrency] = useState("INR - Indian Rupee");
    const [branch, setBranch] = useState("All Branches");
    const [finYear, setFinYear] = useState("2026-27");
    const [narration, setNarration] = useState("");
    const [refNo, setRefNo] = useState("");
    const [preparedBy, setPreparedBy] = useState("Rohit Sharma");
    const [reviewedBy, setReviewedBy] = useState("Neha Verma");
    const [approvedBy, setApprovedBy] = useState("");
    const [tags, setTags] = useState("");
    const [notes, setNotes] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [lines, setLines] = useState([emptyLine(), emptyLine()]);
    const [acSearch, setAcSearch] = useState("");
    const [dragging, setDragging] = useState(false);
    const [postError, setPostError] = useState("");

    const fileRef = useRef();

    /* ---------- derived ---------- */
    const totalDebit = lines.reduce((s, l) => s + Number(l.debit || 0), 0);
    const totalCredit = lines.reduce((s, l) => s + Number(l.credit || 0), 0);
    const diff = Math.abs(totalDebit - totalCredit);
    const balanced = diff < 0.005;

    /* ---------- post validation & submit ---------- */
    const handlePost = async () => {
        if (totalDebit === 0 && totalCredit === 0) {
            setPostError("Please enter at least one debit or credit amount.");
            return;
        }
        if (!balanced) {
            setPostError(`Entry is unbalanced. Difference: ₹${fmt(diff)}. Total Debit and Credit must match.`);
            return;
        }

        const validLines = lines.filter(
            (l) => Number(l.debit || 0) > 0 || Number(l.credit || 0) > 0
        );
        if (validLines.length < 2) {
            setPostError("At least two journal lines (one debit and one credit) are required.");
            return;
        }

        const missingAccount = validLines.some((l) => !l.account?.trim());
        if (missingAccount) {
            setPostError("Please select or enter an account name for each active line.");
            return;
        }

        const payload = {
            entryDate: new Date().toISOString().split("T")[0],
            description: (narration || "General Journal Entry - " + transactionType).trim(),
            reference: refNo ? refNo.trim() : ("REF-" + Date.now().toString().slice(-6)),
            lines: validLines.map((l) => {
                const found = availableAccounts.find(
                    (a) => a.name.toLowerCase() === l.account?.trim().toLowerCase() || a.code === l.account?.trim()
                );
                return {
                    accountCode: (l.accountCode || found?.code || l.account || "1001").trim(),
                    accountName: (found?.name || l.account || "General Account").trim(),
                    debit: Number(l.debit || 0),
                    credit: Number(l.credit || 0),
                };
            }),
        };

        try {
            setSubmitting(true);
            setPostError("");
            const created = await financeService.createJournalEntry(payload);
            setLines([emptyLine(), emptyLine()]);
            setNarration("");
            setRefNo("");
            if (onSuccess) onSuccess(created);
            onClose();
        } catch (err) {
            const serverMsg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Failed to post journal entry to server";
            setPostError(serverMsg);
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------- close on Escape ---------- */
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        if (open) document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onClose]);

    if (!open) return null;

    /* ---------- line helpers ---------- */
    const updateLine = (id, field, value) => {
        setPostError("");
        setLines((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
    }

    const addLine = () => setLines((prev) => [...prev, emptyLine()]);

    const removeLine = (id) =>
        setLines((prev) => prev.length > 1 ? prev.filter((l) => l.id !== id) : prev);

    /* ---------- quick accounts state & fetch ---------- */
    const [availableAccounts, setAvailableAccounts] = useState(QUICK_ACCOUNTS);

    useEffect(() => {
        if (!open) return;
        financeService.getAccounts({ active: true })
            .then((res) => {
                if (Array.isArray(res) && res.length > 0) {
                    setAvailableAccounts(res);
                }
            })
            .catch(() => {});
    }, [open]);

    /* ---------- quick account applicator ---------- */
    const applyQuickAccount = (acc) => {
        const idx = lines.findIndex((l) => !l.account);
        if (idx !== -1) {
            setLines((prev) =>
                prev.map((l, i) =>
                    i === idx ? { ...l, account: acc.name, accountCode: acc.code, accountType: acc.type } : l
                )
            );
        } else {
            setLines((prev) => [
                ...prev,
                { ...emptyLine(), account: acc.name, accountCode: acc.code, accountType: acc.type }
            ]);
        }
    };

    /* ---------- attachment ---------- */
    const handleFiles = (files) => {
        const valid = Array.from(files).filter(
            (f) => f.size <= 5 * 1024 * 1024 && /\.(pdf|jpe?g|png)$/i.test(f.name)
        );
        setAttachments((prev) => [...prev, ...valid]);
    };

    /* ---------- filtered quick accounts ---------- */
    const filteredAccounts = availableAccounts.filter(
        (a) =>
            !acSearch ||
            a.name.toLowerCase().includes(acSearch.toLowerCase()) ||
            a.code.includes(acSearch)
    );

    /* ================================================================
       RENDER
    ================================================================ */
    return (
        /* backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* modal shell */}
            <div className="
                relative flex h-[90vh] w-full max-w-[1100px]
                flex-col rounded-[20px] bg-[#f6f5f1]
                shadow-2xl overflow-hidden
            ">

                {/* ---- TOP BAR ---- */}
                <div className="flex items-start justify-between border-b border-[#e3e0d9] bg-white px-7 py-5">
                    <div>
                        <h2 className="font-serif text-[22px] leading-none text-[#11130f]">
                            Journal Entry
                        </h2>
                        <p className="mt-1 font-mono text-[11px] text-[#91a0a0]">
                            Create a new journal entry
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="
                                rounded-[12px] border border-[#e3e0d9] bg-white
                                px-5 py-2.5 font-mono text-[12px] text-[#303531]
                                transition hover:bg-[#f0efeb]
                            "
                        >
                            Save as Draft
                        </button>
                        <button
                            onClick={handlePost}
                            disabled={submitting}
                            className="
                                flex items-center gap-2 rounded-[12px]
                                bg-[#11130f] px-5 py-2.5 font-mono text-[12px] text-white
                                transition hover:bg-[#292c27] disabled:opacity-50
                            "
                        >
                            {submitting ? (
                                <span>Posting...</span>
                            ) : (
                                <>
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8l4 4 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Post Entry
                                </>
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="
                                ml-1 flex h-8 w-8 items-center justify-center
                                rounded-full text-[#91a0a0] transition hover:bg-[#f0efeb]
                                hover:text-[#11130f] text-lg
                            "
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* ---- ERROR BANNER ---- */}
                {postError && (
                    <div className="
                        mx-6 mt-3 flex items-start gap-3 rounded-[12px]
                        border border-[#f5c6c6] bg-[#fde8e8] px-4 py-3
                    ">
                        <span className="mt-0.5 text-[#d9534f]">⚠</span>
                        <p className="flex-1 font-mono text-[12px] text-[#a02020]">{postError}</p>
                        <button
                            onClick={() => setPostError("")}
                            className="text-[#d9534f] hover:text-[#a02020] text-lg leading-none"
                        >×</button>
                    </div>
                )}

                {/* ---- BODY (scrollable) ---- */}
                <div className="flex flex-1 gap-5 overflow-hidden px-6 py-5">
                    {/* ============ LEFT COLUMN ============ */}
                    <div className="flex flex-1 flex-col gap-5 overflow-y-auto pr-1">

                        {/* ---- Entry Details ---- */}
                        <Section title="Entry Details">

                            {/* Row 1 */}
                            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                                <Field label="Journal Entry No." required>
                                    <Input value="JE-2026-00057" readOnly className="bg-[#f0efeb] text-[#7a8a8a]" />
                                </Field>
                                <Field label="Entry Date" required>
                                    <InputDate value={today()} />
                                </Field>
                                <Field label="Posting Date" required>
                                    <InputDate value={today()} />
                                </Field>
                                <Field label="Reference No.">
                                    <Input
                                        placeholder="Enter reference number"
                                        value={refNo}
                                        onChange={(e) => setRefNo(e.target.value)}
                                    />
                                </Field>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                                <Field label="Transaction Type" required>
                                    <Select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                                        {TRANSACTION_TYPES.map((t) => <option key={t}>{t}</option>)}
                                    </Select>
                                </Field>
                                <Field label="Currency" required>
                                    <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                        {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                                    </Select>
                                </Field>
                                <Field label="Branch" required>
                                    <Select value={branch} onChange={(e) => setBranch(e.target.value)}>
                                        {BRANCHES.map((b) => <option key={b}>{b}</option>)}
                                    </Select>
                                </Field>
                                <Field label="Financial Year" required>
                                    <Select value={finYear} onChange={(e) => setFinYear(e.target.value)}>
                                        {FIN_YEARS.map((y) => <option key={y}>{y}</option>)}
                                    </Select>
                                </Field>
                            </div>

                            {/* Row 3 — narration + attachments */}
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <Field label="Narration" required>
                                    <textarea
                                        rows={4}
                                        maxLength={500}
                                        value={narration}
                                        onChange={(e) => setNarration(e.target.value)}
                                        placeholder="Enter narration..."
                                        className="
                                            w-full resize-none rounded-[10px] border border-[#e3e0d9]
                                            bg-white px-3 py-2.5 font-mono text-[12px]
                                            text-[#11130f] placeholder-[#b0b8b8] outline-none
                                            focus:border-[#11130f] transition
                                        "
                                    />
                                    <p className="mt-1 text-right font-mono text-[10px] text-[#b0b8b8]">
                                        {narration.length}/500
                                    </p>
                                </Field>

                                <Field label="Attachments">
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                        onDragLeave={() => setDragging(false)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setDragging(false);
                                            handleFiles(e.dataTransfer.files);
                                        }}
                                        onClick={() => fileRef.current?.click()}
                                        className={`
                                            flex h-[100px] cursor-pointer flex-col items-center
                                            justify-center rounded-[10px] border-2 border-dashed
                                            transition
                                            ${dragging
                                                ? "border-[#11130f] bg-[#f0efeb]"
                                                : "border-[#d5d1c9] bg-white hover:bg-[#fafaf8]"
                                            }
                                        `}
                                    >
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="mb-1 text-[#b0b8b8]">
                                            <path d="M12 16V8m0 0l-3 3m3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M20 16.7A4 4 0 0 0 18 9h-1.26A7 7 0 1 0 5 15.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="font-mono text-[11px] text-[#8d9696]">Upload or drag files here</p>
                                        <p className="font-mono text-[10px] text-[#b0b8b8]">PDF, JPG, PNG (Max 5MB)</p>
                                    </div>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        multiple
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={(e) => handleFiles(e.target.files)}
                                    />
                                    {attachments.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                            {attachments.map((f, i) => (
                                                <li key={i} className="flex items-center justify-between font-mono text-[11px] text-[#53605e]">
                                                    <span className="truncate">{f.name}</span>
                                                    <button
                                                        onClick={() => setAttachments((p) => p.filter((_, j) => j !== i))}
                                                        className="ml-2 text-[#d9534f] hover:text-[#a02020]"
                                                    >×</button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Field>
                            </div>
                        </Section>

                        {/* ---- Journal Lines ---- */}
                        <Section
                            title="Journal Lines"
                            actions={
                                <div className="flex gap-2">
                                    <button
                                        onClick={addLine}
                                        className="
                                            flex items-center gap-1.5 rounded-[10px] border
                                            border-[#e3e0d9] bg-white px-4 py-2 font-mono
                                            text-[11px] text-[#303531] transition hover:bg-[#f0efeb]
                                        "
                                    >
                                        + Add Line
                                    </button>
                                    <button
                                        className="
                                            flex items-center gap-1.5 rounded-[10px] border
                                            border-[#e3e0d9] bg-white px-4 py-2 font-mono
                                            text-[11px] text-[#303531] transition hover:bg-[#f0efeb]
                                        "
                                    >
                                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                            <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        Import from Excel
                                    </button>
                                </div>
                            }
                        >
                            {/* table */}
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[760px] border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#e3e0d9]">
                                            {["#", "Account *", "Description", "Debit (₹)", "Credit (₹)", "Cost Center", "Department", "Tax", "Actions"].map((h) => (
                                                <th
                                                    key={h}
                                                    className="
                                                        pb-2 pt-1 text-left font-mono
                                                        text-[10px] tracking-[0.06em]
                                                        text-[#91a0a0]
                                                        pr-3 first:pr-2
                                                    "
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lines.map((line, idx) => (
                                            <tr key={line.id} className="border-b border-[#f0efeb]">
                                                <td className="py-2 pr-2 font-mono text-[11px] text-[#91a0a0]">
                                                    {idx + 1}
                                                </td>
                                                <td className="py-2 pr-3 min-w-[140px]">
                                                    <div>
                                                        <input
                                                            list={`ac-list-${line.id}`}
                                                            value={line.account}
                                                            onChange={(e) => {
                                                                const found = availableAccounts.find(
                                                                    (a) => a.name.toLowerCase() === e.target.value.toLowerCase() || a.code === e.target.value
                                                                );
                                                                updateLine(line.id, "account", found ? found.name : e.target.value);
                                                                if (found) {
                                                                    updateLine(line.id, "accountCode", found.code);
                                                                    updateLine(line.id, "accountType", found.type);
                                                                }
                                                            }}
                                                            placeholder="Select account"
                                                            className="
                                                                w-full rounded-[8px] border border-[#e3e0d9]
                                                                bg-white px-2.5 py-1.5 font-mono text-[11px]
                                                                text-[#11130f] outline-none focus:border-[#11130f] transition
                                                            "
                                                        />
                                                        <datalist id={`ac-list-${line.id}`}>
                                                            {availableAccounts.map((a) => (
                                                                <option key={a.code} value={a.name}>
                                                                    {a.code} · {a.type}
                                                                </option>
                                                            ))}
                                                        </datalist>
                                                        {line.accountType && (
                                                            <p className="mt-0.5 font-mono text-[10px] text-[#91a0a0]">
                                                                {line.accountType}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-2 pr-3 min-w-[130px]">
                                                    <input
                                                        value={line.description}
                                                        onChange={(e) => updateLine(line.id, "description", e.target.value)}
                                                        placeholder="Description"
                                                        className="
                                                            w-full rounded-[8px] border border-[#e3e0d9]
                                                            bg-white px-2.5 py-1.5 font-mono text-[11px]
                                                            text-[#11130f] outline-none focus:border-[#11130f] transition
                                                        "
                                                    />
                                                </td>
                                                <td className="py-2 pr-3 min-w-[100px]">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={line.debit}
                                                        onChange={(e) => updateLine(line.id, "debit", e.target.value)}
                                                        placeholder="0.00"
                                                        className="
                                                            w-full rounded-[8px] border border-[#e3e0d9]
                                                            bg-white px-2.5 py-1.5 font-mono text-[11px]
                                                            text-[#11130f] outline-none focus:border-[#11130f] transition
                                                            text-right
                                                        "
                                                    />
                                                </td>
                                                <td className="py-2 pr-3 min-w-[100px]">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={line.credit}
                                                        onChange={(e) => updateLine(line.id, "credit", e.target.value)}
                                                        placeholder="0.00"
                                                        className="
                                                            w-full rounded-[8px] border border-[#e3e0d9]
                                                            bg-white px-2.5 py-1.5 font-mono text-[11px]
                                                            text-[#11130f] outline-none focus:border-[#11130f] transition
                                                            text-right
                                                        "
                                                    />
                                                </td>
                                                <td className="py-2 pr-3 min-w-[110px]">
                                                    <select
                                                        value={line.costCenter}
                                                        onChange={(e) => updateLine(line.id, "costCenter", e.target.value)}
                                                        className="
                                                            w-full rounded-[8px] border border-[#e3e0d9]
                                                            bg-white px-2 py-1.5 font-mono text-[11px]
                                                            text-[#11130f] outline-none focus:border-[#11130f] transition
                                                        "
                                                    >
                                                        {COST_CTRS.map((c) => <option key={c} value={c}>{c || "Select"}</option>)}
                                                    </select>
                                                </td>
                                                <td className="py-2 pr-3 min-w-[110px]">
                                                    <select
                                                        value={line.department}
                                                        onChange={(e) => updateLine(line.id, "department", e.target.value)}
                                                        className="
                                                            w-full rounded-[8px] border border-[#e3e0d9]
                                                            bg-white px-2 py-1.5 font-mono text-[11px]
                                                            text-[#11130f] outline-none focus:border-[#11130f] transition
                                                        "
                                                    >
                                                        {DEPTS.map((d) => <option key={d} value={d}>{d || "Select"}</option>)}
                                                    </select>
                                                </td>
                                                <td className="py-2 pr-3 min-w-[100px]">
                                                    <select
                                                        value={line.tax}
                                                        onChange={(e) => updateLine(line.id, "tax", e.target.value)}
                                                        className="
                                                            w-full rounded-[8px] border border-[#e3e0d9]
                                                            bg-white px-2 py-1.5 font-mono text-[11px]
                                                            text-[#11130f] outline-none focus:border-[#11130f] transition
                                                        "
                                                    >
                                                        {TAX_OPTS.map((t) => <option key={t} value={t}>{t || "Select Tax"}</option>)}
                                                    </select>
                                                </td>
                                                <td className="py-2">
                                                    <button
                                                        onClick={() => removeLine(line.id)}
                                                        className="
                                                            flex h-7 w-7 items-center justify-center
                                                            rounded-[8px] bg-[#fde8e8] text-[#d9534f]
                                                            transition hover:bg-[#f8d0d0] text-sm font-bold
                                                        "
                                                    >
                                                        ×
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* totals row */}
                            <div className="
                                mt-3 flex items-center justify-end gap-8
                                border-t border-[#e3e0d9] pt-3
                            ">
                                <span className="font-mono text-[12px] font-semibold text-[#11130f]">Total</span>
                                <span className="w-[100px] text-right font-mono text-[12px] font-semibold text-[#11130f]">
                                    {fmt(totalDebit)}
                                </span>
                                <span className="w-[100px] text-right font-mono text-[12px] font-semibold text-[#11130f]">
                                    {fmt(totalCredit)}
                                </span>
                                {/* spacer for remaining columns */}
                                <span className="flex-1" />
                            </div>
                        </Section>

                        {/* ---- Additional Information ---- */}
                        <Section title="Additional Information">
                            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
                                <Field label="Prepared By">
                                    <Select value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)}>
                                        {USERS.map((u) => <option key={u}>{u}</option>)}
                                    </Select>
                                </Field>
                                <Field label="Reviewed By">
                                    <Select value={reviewedBy} onChange={(e) => setReviewedBy(e.target.value)}>
                                        {USERS.map((u) => <option key={u}>{u}</option>)}
                                    </Select>
                                </Field>
                                <Field label="Approved By">
                                    <Select value={approvedBy} onChange={(e) => setApprovedBy(e.target.value)}>
                                        <option value="">Select approver</option>
                                        {USERS.map((u) => <option key={u}>{u}</option>)}
                                    </Select>
                                </Field>
                                <Field label="Tags">
                                    <Input
                                        placeholder="Enter tags"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                    />
                                </Field>
                                <Field label="Notes">
                                    <Input
                                        placeholder="Enter notes (optional)"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </Field>
                            </div>
                        </Section>

                    </div>

                    {/* ============ RIGHT SIDEBAR ============ */}
                    <div className="flex w-[220px] shrink-0 flex-col gap-4">

                        {/* Entry Summary */}
                        <div className="rounded-[16px] border border-[#e3e0d9] bg-white p-5">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f0efeb]">
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                        <rect x="2" y="2" width="12" height="12" rx="2" stroke="#53605e" strokeWidth="1.4" />
                                        <path d="M5 6h6M5 9h4" stroke="#53605e" strokeWidth="1.4" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <span className="font-mono text-[11px] font-semibold tracking-[0.06em] text-[#11130f]">
                                    Entry Summary
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[11px] text-[#8d9696]">Total Debit</span>
                                    <span className="font-mono text-[12px] font-semibold text-[#11130f]">
                                        ₹{fmt(totalDebit)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[11px] text-[#8d9696]">Total Credit</span>
                                    <span className="font-mono text-[12px] font-semibold text-[#11130f]">
                                        ₹{fmt(totalCredit)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 border-t border-[#f0efeb] pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[11px] font-semibold text-[#11130f]">Difference</span>
                                    <span className={`font-mono text-[12px] font-semibold ${balanced ? "text-[#3a7d44]" : "text-[#d9534f]"}`}>
                                        ₹{fmt(diff)}
                                    </span>
                                </div>
                                <div className="mt-3">
                                    {balanced ? (
                                        <span className="
                                            inline-flex items-center gap-1.5 rounded-full
                                            bg-[#e6f4ea] px-3 py-1 font-mono text-[10px] text-[#3a7d44]
                                        ">
                                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                                <path d="M2 6l3 3 5-5" stroke="#3a7d44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Balanced
                                        </span>
                                    ) : (
                                        <span className="
                                            inline-flex items-center gap-1.5 rounded-full
                                            bg-[#fde8e8] px-3 py-1 font-mono text-[10px] text-[#d9534f]
                                        ">
                                            ⚠ Unbalanced
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Accounts */}
                        <div className="flex flex-1 flex-col rounded-[16px] border border-[#e3e0d9] bg-white p-4 overflow-hidden">
                            <p className="mb-3 font-mono text-[11px] font-semibold tracking-[0.06em] text-[#11130f]">
                                Quick Accounts
                            </p>
                            <input
                                value={acSearch}
                                onChange={(e) => setAcSearch(e.target.value)}
                                placeholder="Search account..."
                                className="
                                    mb-3 w-full rounded-[8px] border border-[#e3e0d9]
                                    bg-[#f6f5f1] px-3 py-1.5 font-mono text-[11px]
                                    text-[#11130f] outline-none focus:border-[#11130f] transition
                                "
                            />
                            <div className="flex flex-col gap-1 overflow-y-auto">
                                {filteredAccounts.map((acc) => (
                                    <button
                                        key={acc.code}
                                        onClick={() => applyQuickAccount(acc)}
                                        className="
                                            flex items-center gap-3 rounded-[10px] px-3 py-2
                                            text-left transition hover:bg-[#f6f5f1]
                                        "
                                    >
                                        <div className="
                                            flex h-7 w-7 shrink-0 items-center justify-center
                                            rounded-lg bg-[#f0efeb] text-[#53605e]
                                        ">
                                            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
                                                <path d="M5 8h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-mono text-[11px] text-[#11130f]">{acc.name}</p>
                                            <p className="font-mono text-[10px] text-[#91a0a0]">{acc.code} · {acc.type}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* ---- FOOTER ---- */}
                <div className="
                    flex items-center justify-end gap-3
                    border-t border-[#e3e0d9] bg-white px-7 py-4
                ">
                    <button
                        onClick={onClose}
                        className="
                            rounded-[12px] border border-[#e3e0d9] bg-white
                            px-6 py-2.5 font-mono text-[12px] text-[#303531]
                            transition hover:bg-[#f0efeb]
                        "
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePost}
                        disabled={submitting}
                        className="
                            flex items-center gap-2 rounded-[12px]
                            bg-[#11130f] px-6 py-2.5 font-mono text-[12px] text-white
                            transition hover:bg-[#292c27] disabled:opacity-50
                        "
                    >
                        {submitting ? (
                            <span>Posting...</span>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8l4 4 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Post Entry
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};

/* ================================================================
   SMALL REUSABLE PIECES
================================================================ */

const Section = ({ title, children, actions }) => (
    <div className="rounded-[16px] border border-[#e3e0d9] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
            <h3 className="font-mono text-[13px] font-semibold text-[#11130f]">{title}</h3>
            {actions && <div>{actions}</div>}
        </div>
        <div className="flex flex-col gap-4">{children}</div>
    </div>
);

const Field = ({ label, required, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[11px] text-[#8d9696]">
            {label}
            {required && <span className="ml-0.5 text-[#d9534f]">*</span>}
        </label>
        {children}
    </div>
);

const Input = ({ className = "", ...props }) => (
    <input
        className={`
            w-full rounded-[10px] border border-[#e3e0d9] bg-white
            px-3 py-2 font-mono text-[12px] text-[#11130f]
            placeholder-[#b0b8b8] outline-none
            focus:border-[#11130f] transition
            ${className}
        `}
        {...props}
    />
);

const InputDate = ({ value }) => (
    <div className="relative flex items-center">
        <input
            type="text"
            defaultValue={value}
            className="
                w-full rounded-[10px] border border-[#e3e0d9] bg-white
                px-3 py-2 pr-9 font-mono text-[12px] text-[#11130f]
                outline-none focus:border-[#11130f] transition
            "
        />
        <svg
            className="pointer-events-none absolute right-3 text-[#91a0a0]"
            width="14" height="14" viewBox="0 0 16 16" fill="none"
        >
            <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    </div>
);

const Select = ({ children, ...props }) => (
    <select
        className="
            w-full rounded-[10px] border border-[#e3e0d9] bg-white
            px-3 py-2 font-mono text-[12px] text-[#11130f]
            outline-none focus:border-[#11130f] transition
            appearance-none
            bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWw1IDUgNS01IiBzdHJva2U9IiM5MWEwYTAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')]
            bg-no-repeat bg-[right_12px_center]
            pr-8
        "
        {...props}
    >
        {children}
    </select>
);

export default JournalEntryModal;
