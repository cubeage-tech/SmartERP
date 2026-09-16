import React, { useEffect, useState } from "react";
import useAuthStore from "../../../store/slices/auth.store";
import ManufacturingService from "../../../core/services/modules/manufacturing.service";

function StatusBadge({ status, type }) {
  const styles = {
    progress: "bg-[#eeedf3] text-[#5b5870]",
    completed: "bg-[#dfe8dc] text-[#3f513c]",
    pending: "bg-[#f5eedc] text-[#7a6538]",
    hold: "bg-[#eee9dc] text-[#635d49]",
    cancelled: "bg-[#f4dddd] text-[#8d5148] line-through",
  };

  return (
    <span
      className={`inline-flex items-center rounded-[10px] px-2.5 py-[6px] font-mono text-[9px] leading-none tracking-[0.06em] transition-all duration-200 sm:px-3 sm:text-[10px] ${
        styles[type] || styles.pending
      }`}
    >
      {status}
    </span>
  );
}

function WorkOrderCard({ order, onEdit, onDelete, onStatusChange }) {
  const progress = order.progress ?? 0;
  const hasProgress = progress > 0;

  return (
    <article className="group rounded-[18px] border border-[#e4e2dd] bg-white px-4 py-4 transition-all duration-200 hover:border-[#d8d5ce] hover:shadow-[0_3px_12px_rgba(0,0,0,0.035)] sm:rounded-[20px] sm:px-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        {/* Left Content */}
        <div className="min-w-0 flex-1">
          {/* ID + Status */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-mono text-[10px] leading-none tracking-[0.03em] text-[#a0a09a] sm:text-[11px]">
              {order.workOrderNumber}
            </span>

            <StatusBadge
              status={order.status}
              type={order.statusType}
            />
          </div>

          {/* Title */}
          <h2 className="mt-1 font-serif text-[20px] leading-[1.1] tracking-[-0.02em] text-[#171815] sm:mt-0.5 sm:text-[22px]">
            {order.title}
          </h2>

          {/* Details */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mt-0.5 sm:gap-x-[21px] sm:gap-y-[5px]">
            <div className="whitespace-nowrap font-mono text-[10px] leading-[1.2] text-[#555750] sm:text-[11px]">
              <span className="text-[#969791]">Qty:</span> {order.quantity} pcs
            </div>

            <div className="whitespace-nowrap font-mono text-[10px] leading-[1.2] text-[#555750] sm:text-[11px]">
              <span className="text-[#969791]">BOM:</span> {order.bomNumber || "-"}
            </div>

            <div className="whitespace-nowrap font-mono text-[10px] leading-[1.2] text-[#555750] sm:text-[11px]">
              <span className="text-[#969791]">Machine:</span> {order.machineCode || "-"}
            </div>

            <div className="whitespace-nowrap font-mono text-[10px] leading-[1.2] text-[#555750] sm:text-[11px]">
              <span className="text-[#969791]">Operator:</span> {order.operatorName || "-"}
            </div>

            <div className="whitespace-nowrap font-mono text-[10px] leading-[1.2] text-[#555750] sm:text-[11px]">
              <span className="text-[#969791]">Due:</span> {order.dueDate || "-"}
            </div>
          </div>
        </div>

        {/* Right Progress */}
        <div className="flex w-full items-end justify-between sm:w-[85px] sm:shrink-0 sm:flex-col sm:items-end sm:pt-[1px] sm:text-right">
          <div className="font-serif text-[28px] leading-none tracking-[-0.04em] text-[#151714] sm:text-[31px]">
            {progress}%
          </div>

          <div className="font-mono text-[8px] leading-none tracking-[0.08em] text-[#aaa9a4] sm:mt-[7px] sm:text-[9px]">
            COMPLETE
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-[9px] w-full overflow-hidden rounded-full bg-[#f0efeb] sm:mt-[17px] sm:h-[10px]">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            hasProgress ? "bg-[#a9bf9c]" : "w-0"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Actions footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between border-t border-[#f0eee8] pt-3 text-[11px]">
        <div className="flex items-center gap-2">
          {order.status === "PENDING" && (
            <button
              type="button"
              onClick={() => onStatusChange(order, "IN_PROGRESS", 20)}
              className="rounded-[8px] bg-[#151714] px-2.5 py-1 font-mono text-[10px] text-white hover:bg-[#2b2d28]"
            >
              Start Work
            </button>
          )}

          {order.status === "IN_PROGRESS" && (
            <>
              <button
                type="button"
                onClick={() => onStatusChange(order, "COMPLETED", 100)}
                className="rounded-[8px] bg-[#3f513c] px-2.5 py-1 font-mono text-[10px] text-white hover:bg-[#2e3c2c]"
              >
                ✓ Mark Complete
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(order, "ON_HOLD", progress)}
                className="rounded-[8px] border border-[#d8d5ce] bg-white px-2.5 py-1 font-mono text-[10px] text-[#635d49] hover:bg-[#f5f4f0]"
              >
                Pause
              </button>
            </>
          )}

          {order.status === "ON_HOLD" && (
            <button
             type="button"
              onClick={() => onStatusChange(order, "IN_PROGRESS", progress)}
              className="rounded-[8px] bg-[#151714] px-2.5 py-1 font-mono text-[10px] text-white hover:bg-[#2b2d28]"
            >
              Resume
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(order)}
            className="rounded-[8px] border border-[#e4e2dc] bg-white px-3 py-1 font-mono text-[10px] text-[#555] hover:border-[#151714] hover:text-[#151714]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(order)}
            className="rounded-[8px] border border-red-200 px-3 py-1 font-mono text-[10px] text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function WorkOrderModal({ order, onClose, onSave }) {
  const isEditing = Boolean(order?.id);
  const [form, setForm] = useState({
    productName: order?.title || order?.productName || "",
    quantity: order?.quantity || 1,
    bomNumber: order?.bomNumber || "",
    machineName: order?.machineCode || order?.machineName || "",
    operatorName: order?.operatorName || "",
    dueDate: order?.dueDate || "",
    status: order?.status || "PENDING",
    progress: order?.progress ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productName.trim()) {
      setError("Product title / name is required.");
      return;
    }
    if (Number(form.quantity) < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const payload = {
        productName: form.productName.trim(),
        quantity: Number(form.quantity),
        bomNumber: form.bomNumber || null,
        machineName: form.machineName || null,
        operatorName: form.operatorName || null,
        dueDate: form.dueDate || null,
        status: form.status,
        progress: Number(form.progress) || 0,
      };

      if (isEditing) {
        await ManufacturingService.update(order.id, payload);
      } else {
        await ManufacturingService.create(payload);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save work order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#ece9e2] pb-3">
          <h2 className="font-serif text-[18px] font-bold text-[#151714]">
            {isEditing ? `Edit Work Order #${order.workOrderNumber}` : "New Work Order"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#e4e2dc] bg-[#f7f6f2] text-[13px] text-[#777] hover:bg-[#ece9e2]"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 p-2.5 text-[11px] text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-[12px]">
          <div>
            <label className="mb-1 block font-medium text-[#555]">Product Title *</label>
            <input
              type="text"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              placeholder="e.g. Steel Frame Assembly"
              className="w-full rounded-[9px] border border-[#e4e2dc] px-3 py-2 text-[#151714] outline-none focus:border-[#151714]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-medium text-[#555]">Quantity (pcs) *</label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                className="w-full rounded-[9px] border border-[#e4e2dc] px-3 py-2 text-[#151714] outline-none focus:border-[#151714]"
                required
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-[#555]">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full rounded-[9px] border border-[#e4e2dc] px-3 py-2 text-[#151714] outline-none focus:border-[#151714]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-medium text-[#555]">BOM Reference</label>
              <input
                type="text"
                name="bomNumber"
                value={form.bomNumber}
                onChange={handleChange}
                placeholder="e.g. BOM-001"
                className="w-full rounded-[9px] border border-[#e4e2dc] px-3 py-2 text-[#151714] outline-none focus:border-[#151714]"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-[#555]">Machine</label>
              <input
                type="text"
                name="machineName"
                value={form.machineName}
                onChange={handleChange}
                placeholder="e.g. CNC-01"
                className="w-full rounded-[9px] border border-[#e4e2dc] px-3 py-2 text-[#151714] outline-none focus:border-[#151714]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-medium text-[#555]">Operator / Lead</label>
              <input
                type="text"
                name="operatorName"
                value={form.operatorName}
                onChange={handleChange}
                placeholder="e.g. Arjun Mehta"
                className="w-full rounded-[9px] border border-[#e4e2dc] px-3 py-2 text-[#151714] outline-none focus:border-[#151714]"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-[#555]">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-[9px] border border-[#e4e2dc] bg-white px-3 py-2 text-[#151714] outline-none focus:border-[#151714]"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="mb-1 block font-medium text-[#555]">Progress: {form.progress}%</label>
            </div>
            <input
              type="range"
              name="progress"
              min="0"
              max="100"
              value={form.progress}
              onChange={handleChange}
              className="w-full accent-[#151714]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#ece9e2]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[10px] border border-[#e4e2dc] bg-white px-4 py-2 font-mono text-[11px] text-[#555] hover:bg-[#f7f6f2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-[10px] bg-[#151714] px-5 py-2 font-mono text-[11px] text-white hover:bg-[#2a2c28] disabled:opacity-50"
            >
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Work Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const WorkOrders = ({ refreshKey }) => {
  const { token } = useAuthStore();
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const response = await ManufacturingService.getAll();
      setWorkOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching work orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWorkOrders();
    }
  }, [token, refreshKey]);

  const handleCreate = () => {
    setSelectedOrder(null);
    setShowModal(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleDelete = async (order) => {
    if (!window.confirm(`Delete work order ${order.workOrderNumber || order.title}?`)) return;
    try {
      await ManufacturingService.remove(order.id);
      setWorkOrders((prev) => prev.filter((o) => o.id !== order.id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete work order.");
    }
  };

  const handleQuickStatusChange = async (order, nextStatus, nextProgress) => {
    try {
      const payload = {
        productName: order.title,
        quantity: order.quantity,
        bomNumber: order.bomNumber,
        machineName: order.machineCode,
        operatorName: order.operatorName,
        dueDate: order.dueDate,
        status: nextStatus,
        progress: nextProgress,
      };
      const { data } = await ManufacturingService.update(order.id, payload);
      setWorkOrders((prev) => prev.map((o) => (o.id === order.id ? data : o)));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update work order status.");
    }
  };

  const filteredOrders = workOrders.filter((order) => {
    const matchesSearch =
      (order.workOrderNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.operatorName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.machineCode || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-[#f7f6f2] px-4 py-4 text-[#171815] sm:px-6 sm:py-[18px] lg:px-[30px]">

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="font-mono text-xs text-[#8a8f80]">
            Loading work orders...
          </span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[#e4e2dd] bg-white py-16 text-center">
          <span className="font-serif text-[18px] text-[#555]">No work orders found</span>
          <p className="mt-1 font-mono text-[11px] text-[#999]">
            {searchTerm || statusFilter !== "ALL"
              ? "Try adjusting your search or filters"
              : "Create a work order to get started"}
          </p>
        </div>
      ) : (
        <section className="space-y-3 sm:space-y-[15px]">
          {filteredOrders.map((order, index) => (
            <WorkOrderCard
              key={order.id || order.workOrderNumber || index}
              order={order}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleQuickStatusChange}
            />
          ))}
        </section>
      )}

      {showModal && (
        <WorkOrderModal
          order={selectedOrder}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            fetchWorkOrders();
          }}
        />
      )}
    </main>
  );
};

export default WorkOrders;
