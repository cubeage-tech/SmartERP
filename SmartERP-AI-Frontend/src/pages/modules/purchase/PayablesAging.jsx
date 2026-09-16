import React, { useEffect, useState } from "react";
import PurchaseService from "../../../core/services/modules/purchase.service";

function SummaryCard({ value, label, type }) {
  const valueColor =
    type === "warning"
      ? "text-[#8b7a4d]"
      : type === "danger"
      ? "text-[#8d5148]"
      : "text-[#171815]";

  return (
    <div
      className="
        rounded-[18px]
        border border-[#e4e2dd]
        bg-white
        px-5
        py-4
        transition-all
        duration-200
        hover:border-[#d8d5ce]
        hover:shadow-[0_3px_12px_rgba(0,0,0,0.025)]
        sm:rounded-[20px]
        sm:px-6
        sm:py-[17px]
      "
    >
      <div
        className={`
          font-serif
          text-[28px]
          leading-none
          tracking-[-0.03em]
          sm:text-[30px]
          ${valueColor}
        `}
      >
        {value}
      </div>

      <div className="mt-[8px] text-[9px] font-semibold leading-none tracking-[0.14em] text-[#a0a09a]">
        {label}
      </div>
    </div>
  );
}

function PayableCard({ item, onPay }) {
  const amount = Number(item.balanceDue ?? 0).toLocaleString("en-IN");
  const total = Number(item.totalAmount ?? 0).toLocaleString("en-IN");
  const paid = Number(item.paidAmount ?? 0).toLocaleString("en-IN");

  const statusBg =
    item.status === "PAID"
      ? "bg-green-100 text-green-800"
      : item.status === "OVERDUE"
      ? "bg-red-100 text-red-800"
      : item.status === "PARTIALLY_PAID"
      ? "bg-amber-100 text-amber-800"
      : "bg-gray-100 text-gray-700";

  return (
    <article className="group flex min-h-[90px] flex-col gap-4 rounded-[18px] border border-[#e4e2dd] bg-white px-5 py-4 transition hover:border-[#cfcdc6] sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h2 className="font-serif text-[18px] text-[#171815]">
            {item.vendorName}
          </h2>
          <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${statusBg}`}>
            {item.status}
          </span>
        </div>

        <p className="mt-[7px] text-[10px] text-[#999a94]">
          Invoice: <span className="font-mono font-medium text-[#444]">{item.invoiceReference}</span>
          <span className="mx-[8px]">·</span>
          Total: ₹{total}
          <span className="mx-[8px]">·</span>
          Paid: ₹{paid}
          {item.paymentReference && (
            <>
              <span className="mx-[8px]">·</span>
              Ref: <span className="font-mono">{item.paymentReference}</span>
            </>
          )}
        </p>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
        <div className="text-left sm:text-right">
          <div className="text-[14px] font-bold text-[#171815]">
            ₹{amount}
          </div>

          <div className="mt-[4px] text-[10px] text-[#aaa9a4]">
            Due: {item.dueDate || "-"}
          </div>
        </div>

        {item.status !== "PAID" && (
          <button
            type="button"
            onClick={() => onPay(item)}
            className="rounded-[13px] border border-[#d6dfd1] bg-[#e9eee5] px-[15px] py-[9px] text-[11px] font-semibold text-[#52614c] transition hover:bg-[#dce5d7]"
          >
            Pay Now
          </button>
        )}
      </div>
    </article>
  );
}

const PayablesAging = () => {
  const [payables, setPayables] = useState([]);
  const [summary, setSummary] = useState({
    totalPayables: 0,
    dueThisWeek: 0,
    overduePayables: 0,
    pendingCount: 0,
    currency: "INR",
  });
  const [loading, setLoading] = useState(true);

  // Modals state
  const [payingItem, setPayingItem] = useState(null);
  const [payForm, setPayForm] = useState({
    amount: "",
    paymentReference: "",
    notes: "",
  });
  const [submittingPay, setSubmittingPay] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [createForm, setCreateForm] = useState({
    purchaseOrderId: "",
    invoiceReference: "",
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    totalAmount: "",
    notes: "",
  });
  const [submittingCreate, setSubmittingCreate] = useState(false);

  const fetchPayables = async () => {
    try {
      setLoading(true);
      const [payablesResponse, summaryResponse] = await Promise.all([
        PurchaseService.getAllPayables(),
        PurchaseService.getPayablesSummary(),
      ]);

      setPayables(payablesResponse.data || []);
      setSummary(summaryResponse.data || {});
    } catch (error) {
      console.error("Failed to load payables:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayables();
  }, []);

  const openPayModal = (item) => {
    setPayingItem(item);
    setPayForm({
      amount: item.balanceDue || "",
      paymentReference: `PAY-${Date.now().toString().slice(-6)}`,
      notes: "",
    });
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!payingItem) return;
    if (!payForm.amount || Number(payForm.amount) <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }
    if (!payForm.paymentReference.trim()) {
      alert("Please enter a payment reference.");
      return;
    }

    try {
      setSubmittingPay(true);
      await PurchaseService.recordPayment(payingItem.id, {
        amount: Number(payForm.amount),
        paymentReference: payForm.paymentReference.trim(),
        notes: payForm.notes,
      });
      setPayingItem(null);
      await fetchPayables();
    } catch (error) {
      console.error("Error recording payment:", error);
      alert(error?.response?.data?.message || "Failed to record payment.");
    } finally {
      setSubmittingPay(false);
    }
  };

  const openCreateModal = async () => {
    try {
      const res = await PurchaseService.getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
    setCreateForm({
      purchaseOrderId: "",
      invoiceReference: `INV-${Date.now().toString().slice(-6)}`,
      invoiceDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      totalAmount: "",
      notes: "",
    });
    setShowCreateModal(true);
  };

  const handleCreatePayable = async (e) => {
    e.preventDefault();
    if (!createForm.purchaseOrderId) {
      alert("Please select a Purchase Order.");
      return;
    }
    if (!createForm.invoiceReference.trim()) {
      alert("Please enter an Invoice Reference.");
      return;
    }
    if (!createForm.totalAmount || Number(createForm.totalAmount) <= 0) {
      alert("Please enter a valid total amount.");
      return;
    }

    try {
      setSubmittingCreate(true);
      await PurchaseService.createPayable({
        purchaseOrderId: Number(createForm.purchaseOrderId),
        invoiceReference: createForm.invoiceReference.trim(),
        invoiceDate: createForm.invoiceDate,
        dueDate: createForm.dueDate,
        totalAmount: Number(createForm.totalAmount),
        notes: createForm.notes,
      });
      setShowCreateModal(false);
      await fetchPayables();
    } catch (error) {
      console.error("Error creating payable:", error);
      alert(error?.response?.data?.message || "Failed to create payable.");
    } finally {
      setSubmittingCreate(false);
    }
  };

  return (
    <main className="bg-[#f7f6f2] px-4 py-4 text-[#171815] sm:px-6 sm:py-[18px] lg:px-[30px]">
      {/* Header with actions */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-[20px] text-[#171815]">Payables & Aging</h1>
          <p className="text-[11px] text-[#999]">Manage supplier invoices, outstanding aging, and payments</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-[12px] bg-[#151714] px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#2c2e29]"
        >
          + Create Payable / Invoice
        </button>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard
          value={`₹${Number(summary.totalPayables || 0).toLocaleString("en-IN")}`}
          label="TOTAL PAYABLES"
          type="normal"
        />

        <SummaryCard
          value={`₹${Number(summary.dueThisWeek || 0).toLocaleString("en-IN")}`}
          label="DUE THIS WEEK"
          type="warning"
        />

        <SummaryCard
          value={`₹${Number(summary.overduePayables || 0).toLocaleString("en-IN")}`}
          label="OVERDUE"
          type="danger"
        />
      </section>

      {/* Payables */}
      <section className="mt-5 space-y-3">
        {loading ? (
          <div className="py-10 text-center text-sm text-gray-400">
            Loading payables...
          </div>
        ) : payables.length === 0 ? (
          <div className="rounded-[18px] border border-[#e4e2dd] bg-white py-12 text-center text-sm text-gray-400">
            No payables found. Click "+ Create Payable / Invoice" to add an invoice.
          </div>
        ) : (
          payables.map((item) => (
            <PayableCard key={item.id} item={item} onPay={openPayModal} />
          ))
        )}
      </section>

      {/* Record Payment Modal */}
      {payingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-[18px] bg-white p-6 shadow-xl">
            <h2 className="text-[17px] font-bold text-[#151714]">Record Payment</h2>
            <p className="mt-1 text-[11px] text-[#888]">
              Vendor: <strong>{payingItem.vendorName}</strong> | Invoice: <strong>{payingItem.invoiceReference}</strong>
            </p>
            <div className="mt-3 rounded-[10px] bg-[#f7f6f2] p-3 text-[11px]">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <strong>₹{Number(payingItem.totalAmount).toLocaleString("en-IN")}</strong>
              </div>
              <div className="flex justify-between mt-1 text-[#8b7a4d]">
                <span>Outstanding Balance:</span>
                <strong>₹{Number(payingItem.balanceDue).toLocaleString("en-IN")}</strong>
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-3 text-[11px]">
              <div>
                <label className="block font-semibold mb-1 text-[#333]">Payment Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  max={payingItem.balanceDue}
                  required
                  value={payForm.amount}
                  onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                  className="w-full rounded-[9px] border border-[#d9d7d1] px-3 py-2 outline-none focus:border-[#151714]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-[#333]">Payment Reference *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UTR / Transaction / Cheque #"
                  value={payForm.paymentReference}
                  onChange={(e) => setPayForm({ ...payForm, paymentReference: e.target.value })}
                  className="w-full rounded-[9px] border border-[#d9d7d1] px-3 py-2 outline-none focus:border-[#151714]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-[#333]">Notes / Remarks</label>
                <textarea
                  rows={2}
                  value={payForm.notes}
                  onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })}
                  className="w-full rounded-[9px] border border-[#d9d7d1] px-3 py-2 outline-none focus:border-[#151714]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingItem(null)}
                  className="rounded-[10px] border border-[#d9d7d1] px-4 py-2 text-[#555] hover:bg-[#f5f4f0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPay}
                  className="rounded-[10px] bg-[#151714] px-4 py-2 font-semibold text-white hover:bg-[#2b2d28]"
                >
                  {submittingPay ? "Recording..." : "Confirm Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Payable Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-[18px] bg-white p-6 shadow-xl">
            <h2 className="text-[17px] font-bold text-[#151714]">Create Supplier Invoice / Payable</h2>
            <p className="mt-1 text-[11px] text-[#888]">
              Link an invoice to a Purchase Order to track payment aging.
            </p>

            <form onSubmit={handleCreatePayable} className="mt-4 space-y-3 text-[11px]">
              <div>
                <label className="block font-semibold mb-1 text-[#333]">Purchase Order *</label>
                <select
                  required
                  value={createForm.purchaseOrderId}
                  onChange={(e) => {
                    const poId = e.target.value;
                    const selectedPo = orders.find((o) => String(o.id) === String(poId));
                    setCreateForm({
                      ...createForm,
                      purchaseOrderId: poId,
                      totalAmount: selectedPo?.totalAmount ? String(selectedPo.totalAmount) : createForm.totalAmount,
                    });
                  }}
                  className="w-full rounded-[9px] border border-[#d9d7d1] px-3 py-2 outline-none focus:border-[#151714]"
                >
                  <option value="">-- Select Purchase Order --</option>
                  {orders.map((po) => (
                    <option key={po.id} value={po.id}>
                      {po.orderNumber} — {po.vendorName} (₹{Number(po.totalAmount || 0).toLocaleString("en-IN")})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#333]">Invoice Reference *</label>
                  <input
                    type="text"
                    required
                    value={createForm.invoiceReference}
                    onChange={(e) => setCreateForm({ ...createForm, invoiceReference: e.target.value })}
                    className="w-full rounded-[9px] border border-[#d9d7d1] px-3 py-2 outline-none focus:border-[#151714]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#333]">Total Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={createForm.totalAmount}
                    onChange={(e) => setCreateForm({ ...createForm, totalAmount: e.target.value })}
                    className="w-full rounded-[9px] border border-[#d9d7d1] px-3 py-2 outline-none focus:border-[#151714]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#333]">Invoice Date *</label>
                  <input
                    type="date"
                    required
                    value={createForm.invoiceDate}
                    onChange={(e) => setCreateForm({ ...createForm, invoiceDate: e.target.value })}
                    className="w-full rounded-[9px] border border-[#d9d7d1] px-3 py-2 outline-none focus:border-[#151714]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#333]">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={createForm.dueDate}
                    onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
                    className="w-full rounded-[9px] border border-[#d9d7d1] px-3 py-2 outline-none focus:border-[#151714]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-[#333]">Notes / Description</label>
                <textarea
                  rows={2}
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  className="w-full rounded-[9px] border border-[#d9d7d1] px-3 py-2 outline-none focus:border-[#151714]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-[10px] border border-[#d9d7d1] px-4 py-2 text-[#555] hover:bg-[#f5f4f0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCreate}
                  className="rounded-[10px] bg-[#151714] px-4 py-2 font-semibold text-white hover:bg-[#2b2d28]"
                >
                  {submittingCreate ? "Creating..." : "Create Payable"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default PayablesAging;