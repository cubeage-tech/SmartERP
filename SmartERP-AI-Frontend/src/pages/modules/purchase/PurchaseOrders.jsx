import { useEffect, useState } from "react";
import PurchaseService from "../../../core/services/modules/purchase.service";

const statusStyles = {
  draft: "bg-[#eeedf3] text-[#5b5870]",
  confirmed: "bg-[#dfe9db] text-[#50614b]",
  sent: "bg-[#eeedf3] text-[#5b5870]",
  in_progress: "bg-[#eeedf3] text-[#5b5870]",
  completed: "bg-[#dfe9db] text-[#3f513c]",
  cancelled: "bg-[#e7e5df] text-[#77766f] line-through",
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function StatusBadge({ status, type }) {
  return (
    <span
      className={`inline-flex items-center rounded-[10px] px-3 py-[7px] text-[10px] leading-none font-semibold tracking-[0.06em] transition-all duration-200 ${
        statusStyles[type] || "bg-[#eeedf3] text-[#5b5870]"
      }`}
    >
      {status}
    </span>
  );
}

function PurchaseOrderDetails({ order, onClose, onEdit, onDelete, onStatusUpdate }) {
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "DRAFT");
  const [statusSaving, setStatusSaving] = useState(false);
  const isConfirmed = order?.status?.trim().toUpperCase() === "CONFIRMED";

  if (!order) return null;

  const updateStatus = async () => {
    if (isConfirmed || selectedStatus === order.status) return;
    setStatusSaving(true);
    try {
      await onStatusUpdate(order, selectedStatus);
    } finally {
      setStatusSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#ece9e2] pb-4">
          <div>
            <p className="font-mono text-[10px] text-[#999]">{order.orderNumber}</p>
            <h2 className="mt-1 font-serif text-[21px] font-bold text-[#171815]">Purchase Order Details</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-[#e4e2dc] bg-[#f7f6f2] px-3 py-1.5 text-[#777]">✕</button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 text-[11px] sm:grid-cols-4">
          {[
            ["Vendor", order.vendorName],
            ["Status", order.status],
            ["Order Date", formatDate(order.orderDate)],
            ["Expected Delivery", formatDate(order.expectedDeliveryDate)],
            ["Actual Delivery", formatDate(order.actualDeliveryDate)],
            ["Delivery Location", order.deliveryLocation],
            ["Payment Terms", order.paymentTerms],
            ["Notes", order.notes],
            ["Subtotal", `₹${Number(order.subtotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`],
            ["Tax", `₹${Number(order.taxAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`],
            ["Total", `₹${Number(order.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`],
            ["Items", order.itemCount],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 border-b border-[#f0eee8] pb-2">
              <div className="text-[9px] uppercase tracking-wide text-[#999]">{label}</div>
              <div className="mt-1 break-words font-medium text-[#171815]">{value || "-"}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-[#e4e2dc] bg-[#faf9f7] p-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <label className="mb-1 block text-[9px] font-semibold uppercase tracking-wide text-[#999]">Update Status</label>
              <select
                value={selectedStatus}
                disabled={isConfirmed}
                onChange={(event) => setSelectedStatus(event.target.value)}
                className="rounded-[9px] border border-[#dcdad4] bg-white px-3 py-2 text-[11px] text-[#171815] outline-none focus:border-[#77766f] disabled:cursor-not-allowed disabled:bg-[#f0eee8] disabled:text-[#999]"
              >
                {['DRAFT', 'SENT', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => (
                  <option key={status} value={status}>{status.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              disabled={statusSaving || isConfirmed || selectedStatus === order.status}
              title={isConfirmed ? "Confirmed orders cannot update status" : "Update purchase order status"}
              onClick={updateStatus}
              className="rounded-[10px] bg-[#151714] px-4 py-2 text-[11px] text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {statusSaving ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>

        <h3 className="mb-2 mt-6 font-mono text-[10px] font-semibold tracking-wider text-[#999]">ORDER ITEMS</h3>
        <div className="overflow-x-auto rounded-xl border border-[#e4e2dc]">
          <table className="w-full min-w-[520px] text-left text-[11px]">
            <thead className="border-b border-[#e4e2dc] bg-[#f7f6f2]"><tr>
              {['Description', 'Quantity', 'Unit Price', 'Tax', 'Line Total'].map((heading) => <th key={heading} className="px-3 py-2 font-mono text-[9px] text-[#888]">{heading}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-[#f0eee8]">
              {(order.items || []).map((item) => <tr key={item.id || item.description}>
                <td className="px-3 py-2 font-medium text-[#171815]">{item.description}</td>
                <td className="px-3 py-2 text-[#555]">{item.quantity}</td>
                <td className="px-3 py-2 text-[#555]">₹{Number(item.unitPrice || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td className="px-3 py-2 text-[#555]">{item.taxRate ?? 0}%</td>
                <td className="px-3 py-2 font-medium text-[#171815]">₹{Number(item.lineTotal || item.quantity * item.unitPrice || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              </tr>)}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex justify-end gap-2 border-t border-[#ece9e2] pt-4">
          <button type="button" onClick={() => onEdit(order)} className="rounded-[10px] bg-[#151714] px-4 py-2 text-[11px] text-white">Edit Purchase Order</button>
          <button
            type="button"
            title="Delete purchase order"
            onClick={() => onDelete(order)}
            className="rounded-[10px] border border-red-200 px-4 py-2 text-[11px] text-red-600 hover:bg-red-50"
          >
            Delete Purchase Order
          </button>
          <button type="button" onClick={onClose} className="rounded-[10px] border border-[#e4e2dc] px-4 py-2 text-[11px] text-[#555]">Close</button>
        </div>
      </div>
    </div>
  );
}

function PurchaseOrderRow({
  order,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onView,
  onDelete,
  onConfirm,
  onGRN,
}) {
const statusType = order.status?.trim().toLowerCase();

const showGRN =
  statusType === "confirmed" ||
  statusType === "in_progress";

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        group relative grid
        grid-cols-[140px_200px_140px_140px_110px_125px_1fr]
        items-center
        border-b border-[#e4e2dd]
        px-6
        py-[23px]
        transition-colors
        duration-200
        last:border-b-0
        ${isHovered ? "bg-[#f7f6f2]" : "bg-white"}
      `}
    >
      {/* PO Number */}

      <div className="py-1 font-mono text-xs text-gray-400">
        {order.orderNumber}
      </div>

      {/* Vendor */}

      <div className="py-1 text-sm font-semibold text-gray-800">
        {order.vendorName}
      </div>

      {/* Date */}

      <div className="py-1 text-sm text-gray-500">
        {formatDate(order.orderDate)}
      </div>

      {/* Delivery */}

      <div className="py-1 text-sm text-gray-500">
        {formatDate(order.expectedDeliveryDate)}
      </div>

      {/* Items */}

      <div className="py-1 text-sm text-gray-500">
        {order.itemCount}
      </div>

      {/* Value */}

      <div className="py-1 text-sm font-semibold text-gray-800">
        ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
      </div>

      {/* Status */}

      <div className="flex items-center justify-between gap-3">

        <StatusBadge status={order.status} type={statusType} />

        <div
          className={`
            flex items-center gap-2
            transition-all
            duration-200
            ${
              isHovered
                ? "visible translate-x-0 opacity-100"
                : "invisible translate-x-1 opacity-0"
            }
          `}
        >

          {/* View */}

          <button
            type="button"
            onClick={() => onView(order.id)}
            className="shrink-0 rounded-[10px] border border-[#e2e0da] bg-transparent px-[11px] py-[7px] text-[9px] leading-none text-[#96958f] transition-all duration-200 hover:border-[#c9c7c0] hover:bg-white hover:text-[#555650]"
          >
            View
          </button>

          {statusType === "draft" && (
            <button
              type="button"
              onClick={() => onDelete(order)}
              className="shrink-0 rounded-[10px] border border-red-200 px-[11px] py-[7px] text-[9px] leading-none text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          )}

          {statusType === "sent" && (
            <button type="button" onClick={() => onConfirm(order)} className="shrink-0 rounded-[10px] bg-[#151714] px-[11px] py-[7px] text-[9px] leading-none text-white">
              Confirm
            </button>
          )}

          {showGRN && (
            <button
              type="button"
              onClick={() => onGRN(order)}
              className="shrink-0 rounded-[10px] bg-[#151714] px-[11px] py-[7px] text-[9px] leading-none text-white transition-all duration-200 hover:bg-[#292b27] hover:shadow-sm"
            >
              + GRN
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

const PurchaseOrders = ({ refreshTrigger, onEdit }) => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [viewOrderData, setViewOrderData] = useState(null);

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const response = await PurchaseService.getAllOrders();
        setPurchaseOrders(response.data || []);
      } catch (error) {
        console.error("Failed to load purchase orders:", error);
      }
    };

    fetchPurchaseOrders();
  }, [refreshTrigger]);

  const viewOrder = async (id) => {
    try {
      const { data } = await PurchaseService.getOrderById(id);
      setViewOrderData(data);
    } catch (error) {
      window.alert(error?.response?.data?.message || "Unable to load purchase order details.");
    }
  };

  const deleteOrder = async (order) => {
    if (!window.confirm(`Delete purchase order ${order.orderNumber}`)) return;
    try {
      await PurchaseService.deleteOrder(order.id);
      setPurchaseOrders((orders) => orders.filter((item) => item.id !== order.id));
      return true;
    } catch (error) {
      window.alert(error?.response?.data?.message || "Unable to delete purchase order.");
      return false;
    }
  };

  const confirmOrder = async (order) => {
    if (!window.confirm(`Confirm purchase order ${order.orderNumber}?`)) return;
    try {
      const { data } = await PurchaseService.updateOrder(order.id, { status: "CONFIRMED" });
      setPurchaseOrders((orders) => orders.map((item) => item.id === order.id ? data : item));
    } catch (error) {
      window.alert(error?.response?.data?.message || "Unable to confirm purchase order.");
    }
  };

  const updateOrderStatus = async (order, status) => {
    try {
      const { data } = await PurchaseService.updateOrder(order.id, { status });
      setPurchaseOrders((orders) => orders.map((item) => item.id === order.id ? data : item));
      setViewOrderData(data);
    } catch (error) {
      window.alert(error?.response?.data?.message || "Unable to update purchase order status.");
    }
  };

  const createGRNForOrder = async (order) => {
    if (!window.confirm(`Create Goods Receipt Note (GRN) for ${order.orderNumber}?`)) return;
    try {
      const { data: po } = await PurchaseService.getOrderById(order.id);
      const items = (po.items || []).map((item) => ({
        purchaseOrderItemId: item.id,
        productId: item.productId,
        description: item.description,
        orderedQuantity: Number(item.quantity),
        receivedQuantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      }));

      const res = await PurchaseService.createGRN({
        purchaseOrderId: po.id,
        vendorId: po.vendorId,
        vendorName: po.vendorName,
        receivedDate: new Date().toISOString().slice(0, 10),
        qualityStatus: "ACCEPTED",
        items,
      });

      window.alert(`Goods Receipt Note ${res.data.grnNumber} created successfully!`);
    } catch (error) {
      window.alert(error?.response?.data?.message || "Unable to create goods receipt.");
    }
  };

  return (
    <main className="bg-[#f7f6f2] px-4 py-4 text-[#171815] sm:px-6 sm:py-[18px] lg:px-[30px]">

      <section className="overflow-hidden rounded-[18px] border border-[#e4e2dd] bg-white sm:rounded-[20px]">

        <div className="overflow-x-auto">

          <div className="min-w-[1200px]">

            {/* Header */}

            <div className="grid grid-cols-[140px_200px_140px_140px_110px_125px_1fr] border-b border-[#e4e2dd] bg-[#f5f4f0] px-6 py-[4px]">

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                PO #
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                VENDOR
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                DATE
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                EXPECTED DELIVERY
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                ITEMS
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                VALUE
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                STATUS
              </div>

            </div>


            {/* Rows */}

            <div>

              {purchaseOrders.map((order, index) => (
                <PurchaseOrderRow
                  key={order.id}
                  order={order}
                  isHovered={hoveredRow === index}
                  onMouseEnter={() =>
                    setHoveredRow(index)
                  }
                  onMouseLeave={() =>
                    setHoveredRow(null)
                  }
                  onView={viewOrder}
                  onDelete={deleteOrder}
                  onConfirm={confirmOrder}
                  onGRN={createGRNForOrder}
                />
              ))}

            </div>

          </div>

        </div>

      </section>

      {viewOrderData && (
        <PurchaseOrderDetails
          order={viewOrderData}
          onClose={() => setViewOrderData(null)}
          onStatusUpdate={updateOrderStatus}
          onDelete={async (order) => {
            if (await deleteOrder(order)) setViewOrderData(null);
          }}
          onEdit={(order) => {
            setViewOrderData(null);
            onEdit(order);
          }}
        />
      )}

    </main>
  );
};

export default PurchaseOrders;
