import { useState, useEffect, useCallback } from "react";
import financeService from "../../../core/services/modules/finance.service";

const ACCOUNT_TYPES = ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"];

const ChartOfAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    // Create Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [formCode, setFormCode] = useState("");
    const [formName, setFormName] = useState("");
    const [formType, setFormType] = useState("EXPENSE");
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const fetchAccounts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = {};
            if (selectedType) params.type = selectedType;
            if (selectedStatus === "ACTIVE") params.active = true;
            if (selectedStatus === "INACTIVE") params.active = false;
            if (search.trim()) params.search = search.trim();

            const data = await financeService.getAccounts(params);
            setAccounts(Array.isArray(data) ? data : []);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Failed to load accounts";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [search, selectedType, selectedStatus]);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        if (!formCode.trim() || !formName.trim()) {
            setFormError("Account code and name are required.");
            return;
        }

        setSubmitting(true);
        setFormError("");
        try {
            await financeService.createAccount({
                code: formCode.trim(),
                name: formName.trim(),
                type: formType,
            });
            setFormCode("");
            setFormName("");
            setFormType("EXPENSE");
            setModalOpen(false);
            fetchAccounts();
        } catch (err) {
            const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to create account";
            setFormError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleActive = async (account) => {
        try {
            await financeService.updateAccount(account.id, {
                active: !account.active,
            });
            fetchAccounts();
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to update account status");
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "ASSET":
                return "bg-[#e8f0fe] text-[#1a73e8]";
            case "LIABILITY":
                return "bg-[#fce8e6] text-[#c5221f]";
            case "EQUITY":
                return "bg-[#fef7e0] text-[#b06000]";
            case "REVENUE":
                return "bg-[#e6f4ea] text-[#137333]";
            case "EXPENSE":
                return "bg-[#f3e8fd] text-[#8430ce]";
            default:
                return "bg-[#f0efeb] text-[#53605e]";
        }
    };

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search code or name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-[12px] border border-[#e3e0d9] bg-white px-3 py-2 font-mono text-[12px] text-[#11130f] outline-none focus:border-[#11130f] transition w-56"
                    />

                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="rounded-[12px] border border-[#e3e0d9] bg-white px-3 py-2 font-mono text-[12px] text-[#11130f] outline-none focus:border-[#11130f] transition"
                    >
                        <option value="">All Account Types</option>
                        {ACCOUNT_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="rounded-[12px] border border-[#e3e0d9] bg-white px-3 py-2 font-mono text-[12px] text-[#11130f] outline-none focus:border-[#11130f] transition"
                    >
                        <option value="">All Statuses</option>
                        <option value="ACTIVE">Active Only</option>
                        <option value="INACTIVE">Inactive Only</option>
                    </select>
                </div>

                <button
                    onClick={() => { setFormError(""); setModalOpen(true); }}
                    className="flex items-center gap-2 rounded-[12px] bg-[#11130f] px-4 py-2 font-mono text-[12px] font-semibold text-white transition hover:bg-[#303531]"
                >
                    + Add New Account
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="rounded-[14px] border border-red-200 bg-red-50 p-4 font-mono text-[12px] text-red-700">
                    {error}
                </div>
            )}

            {/* Accounts Table */}
            <div className="overflow-hidden rounded-[20px] border border-[#e3e0d9] bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-[12px]">
                        <thead className="border-b border-[#e3e0d9] bg-[#faf9f6]">
                            <tr>
                                <th className="px-6 py-4 font-semibold tracking-[0.06em] text-[#91a0a0]">CODE</th>
                                <th className="px-6 py-4 font-semibold tracking-[0.06em] text-[#91a0a0]">ACCOUNT NAME</th>
                                <th className="px-6 py-4 font-semibold tracking-[0.06em] text-[#91a0a0]">TYPE</th>
                                <th className="px-6 py-4 font-semibold tracking-[0.06em] text-[#91a0a0]">STATUS</th>
                                <th className="px-6 py-4 text-right font-semibold tracking-[0.06em] text-[#91a0a0]">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0efeb]">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-[#91a0a0]">
                                        Loading chart of accounts...
                                    </td>
                                </tr>
                            ) : accounts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-[#91a0a0]">
                                        No finance accounts found matching filters.
                                    </td>
                                </tr>
                            ) : (
                                accounts.map((acc) => (
                                    <tr key={acc.id} className="transition hover:bg-[#faf9f6]">
                                        <td className="px-6 py-3.5 font-bold text-[#11130f]">{acc.code}</td>
                                        <td className="px-6 py-3.5 text-[#303531]">{acc.name}</td>
                                        <td className="px-6 py-3.5">
                                            <span className={`inline-block rounded-[6px] px-2.5 py-0.5 text-[10px] font-semibold ${getTypeColor(acc.type)}`}>
                                                {acc.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${acc.active ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>
                                                {acc.active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-right">
                                            <button
                                                onClick={() => handleToggleActive(acc)}
                                                className="rounded-[8px] border border-[#e3e0d9] px-2.5 py-1 text-[11px] text-[#53605e] transition hover:bg-[#f0efeb]"
                                            >
                                                {acc.active ? "Deactivate" : "Activate"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Account Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-2xl">
                        <h3 className="font-serif text-[18px] text-[#11130f]">Create Chart of Account</h3>
                        <p className="mt-1 font-mono text-[11px] text-[#91a0a0]">
                            Register a new account code for this organization
                        </p>

                        {formError && (
                            <div className="mt-3 rounded-[10px] border border-red-200 bg-red-50 p-2.5 font-mono text-[11px] text-red-700">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleCreateAccount} className="mt-4 space-y-4">
                            <div>
                                <label className="block font-mono text-[11px] font-semibold text-[#53605e]">Account Code *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 6002"
                                    value={formCode}
                                    onChange={(e) => setFormCode(e.target.value)}
                                    className="mt-1 w-full rounded-[10px] border border-[#e3e0d9] px-3 py-2 font-mono text-[12px] outline-none focus:border-[#11130f]"
                                />
                            </div>

                            <div>
                                <label className="block font-mono text-[11px] font-semibold text-[#53605e]">Account Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Software Subscriptions"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    className="mt-1 w-full rounded-[10px] border border-[#e3e0d9] px-3 py-2 font-mono text-[12px] outline-none focus:border-[#11130f]"
                                />
                            </div>

                            <div>
                                <label className="block font-mono text-[11px] font-semibold text-[#53605e]">Account Type *</label>
                                <select
                                    value={formType}
                                    onChange={(e) => setFormType(e.target.value)}
                                    className="mt-1 w-full rounded-[10px] border border-[#e3e0d9] px-3 py-2 font-mono text-[12px] outline-none focus:border-[#11130f]"
                                >
                                    {ACCOUNT_TYPES.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-[10px] border border-[#e3e0d9] px-4 py-2 font-mono text-[12px] text-[#53605e] hover:bg-[#f0efeb]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-[10px] bg-[#11130f] px-5 py-2 font-mono text-[12px] font-semibold text-white transition hover:bg-[#303531] disabled:opacity-50"
                                >
                                    {submitting ? "Creating..." : "Save Account"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChartOfAccounts;
