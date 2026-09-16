import { useEffect, useState } from "react";
import PurchaseService from "../../../core/services/modules/purchase.service";

const qualityStyles = {
  ACCEPTED: "bg-[#dfe9db] text-[#50614b]",
  ON_HOLD: "bg-[#ebe7dc] text-[#756c4e]",
  REJECTED: "bg-[#f4dddd] text-[#8d5148]",
};

const gridColumns =
  "grid-cols-[140px_160px_200px_150px_110px_125px_1fr]";

function GoodsReceiptRow({
  grn,
  index,
  hoveredRow,
  setHoveredRow,
  onView,
  onDelete,
}) {
  const isHovered = hoveredRow === index;

  return (
    <div
      onMouseEnter={() => setHoveredRow(index)}
      onMouseLeave={() => setHoveredRow(null)}
      className={`
        group relative grid
        ${gridColumns}
        items-center
        border-b border-[#e4e2dd]
        px-6
        py-[18px]
        transition-colors
        duration-200
        last:border-b-0
        ${isHovered ? "bg-[#f7f6f2]" : "bg-white"}
      `}
    >
      {/* GRN */}
      <div className="py-1 text-xs text-gray-400">
        {grn.grnNumber}
      </div>

      {/* PO */}
      <div className="py-1 text-xs font-mono text-[#53664a]">
        {grn.orderNumber ||
          (grn.purchaseOrderId ? `PO #${grn.purchaseOrderId}` : "-")}
      </div>

      {/* Vendor */}
      <div className="py-1 text-sm font-semibold text-gray-800">
        {grn.vendorName}
      </div>

      {/* Received Date */}
      <div className="py-1 text-sm text-gray-500">
        {grn.receivedDate}
      </div>

      {/* Items */}
      <div className="py-1 text-sm text-gray-500">
        {grn.itemCount}
      </div>

      {/* Value */}
      <div className="py-1 text-sm font-semibold text-gray-800">
        ₹{Number(grn.totalValue ?? 0).toLocaleString("en-IN")}
      </div>

      {/* Quality + Details */}
      <div className="flex items-center gap-3">
        <span
          className={`
            inline-flex
            shrink-0
            rounded-[10px]
            px-3
            py-[7px]
            text-[10px]
            font-semibold
            leading-none
            tracking-[0.06em]
            ${
              qualityStyles[grn.qualityStatus] ||
              "bg-[#e7e5df] text-[#77766f]"
            }
          `}
        >
          {grn.qualityStatus}
        </span>

        <button
          type="button"
          onClick={() => onView(grn.id)}
          className={`
            ml-16
            shrink-0
            rounded-[10px]
            border
            border-[#e2e0da]
            bg-transparent
            px-3
            py-1.5
            text-[10px]
            leading-none
            text-[#96958f]
            transition-all
            duration-200
            ${
              isHovered
                ? "visible translate-x-0 opacity-100"
                : "invisible translate-x-1 opacity-0"
            }
            hover:border-[#c9c7c0]
            hover:bg-white
            hover:text-[#555650]
          `}
        >
          Details
        </button>

        <button
          type="button"
          onClick={() => onDelete(grn)}
          className="h-7 shrink-0 rounded-[8px] border border-red-200 px-2.5 text-[10px] leading-none text-red-600 transition-colors hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

const GoodsReceipts = () => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [goodsReceipts, setGoodsReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [receiptItems, setReceiptItems] = useState([]);
  const [receivedDate, setReceivedDate] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const fetchGoodsReceipts = async () => {
      try {
        const response = await PurchaseService.getAllGRNs();
        setGoodsReceipts(response.data);
      } catch (error) {
        console.error("Failed to load GRNs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoodsReceipts();
  }, []);

  const openCreate = async () => {
    try {
      const { data } = await PurchaseService.getAllOrders();

      setOrders(
        data.filter((order) =>
          ["CONFIRMED", "IN_PROGRESS"].includes(order.status)
        )
      );

      setSelectedOrder(null);
      setReceiptItems([]);
      setReceivedDate("");
      setShowCreate(true);
    } catch (error) {
      window.alert(
        error?.response?.data?.message ||
          "Unable to load purchase orders."
      );
    }
  };

  const selectOrder = async (id) => {
    if (!id) {
      setSelectedOrder(null);
      setReceiptItems([]);
      setReceivedDate("");
      return;
    }

    try {
      const { data } = await PurchaseService.getOrderById(id);

      setSelectedOrder(data);

      const today = new Date().toISOString().slice(0, 10);

      /*
       * GRN date cannot be before PO date.
       * Default to whichever is later:
       * - today's date
       * - purchase order date
       */
      const defaultReceivedDate =
        data.orderDate > today ? data.orderDate : today;

      setReceivedDate(defaultReceivedDate);

      setReceiptItems(
        (data.items || []).map((item) => ({
          ...item,
          receivedQuantity: item.quantity,
        }))
      );
    } catch (error) {
      window.alert(
        error?.response?.data?.message ||
          "Unable to load purchase order details."
      );
    }
  };

  const saveReceipt = async (event) => {
    event.preventDefault();

    const items = receiptItems.filter(
      (item) => Number(item.receivedQuantity) > 0
    );

    if (!selectedOrder || !items.length) {
      return;
    }

    if (!receivedDate) {
      window.alert("Please select a received date.");
      return;
    }

    if (receivedDate < selectedOrder.orderDate) {
      window.alert(
        "Received date cannot be before the purchase order date."
      );
      return;
    }

    try {
      const { data } = await PurchaseService.createGRN({
        purchaseOrderId: selectedOrder.id,
        vendorId: selectedOrder.vendorId,
        vendorName: selectedOrder.vendorName,
        receivedDate,
        qualityStatus: "ACCEPTED",

        items: items.map((item) => ({
          purchaseOrderItemId: item.id,
          productId: item.productId,
          description: item.description,
          orderedQuantity: Number(item.quantity),
          receivedQuantity: Number(item.receivedQuantity),
          unitPrice: Number(item.unitPrice),
        })),
      });

      setGoodsReceipts((receipts) => [data, ...receipts]);

      setShowCreate(false);
      setSelectedOrder(null);
      setReceiptItems([]);
      setReceivedDate("");
    } catch (error) {
      window.alert(
        error?.response?.data?.message ||
          "Unable to create goods receipt."
      );
    }
  };

  const viewReceipt = async (id) => {
    try {
      const { data } = await PurchaseService.getGRNById(id);
      setSelectedReceipt(data);
    } catch (error) {
      window.alert(
        error?.response?.data?.message ||
          "Unable to load goods receipt details."
      );
    }
  };

  const deleteReceipt = async (grn) => {
    if (!window.confirm(`Delete goods receipt ${grn.grnNumber}?`)) {
      return;
    }

    try {
      await PurchaseService.deleteGRN(grn.id);

      setGoodsReceipts((receipts) =>
        receipts.filter((item) => item.id !== grn.id)
      );
    } catch (error) {
      window.alert(
        error?.response?.data?.message ||
          "Unable to delete goods receipt."
      );
    }
  };

  return (
    <main className="bg-[#f7f6f2] px-4 py-4 text-[#171815] sm:px-6 sm:py-[18px] lg:px-[30px]">
      <section className="overflow-hidden rounded-[18px] border border-[#e4e2dd] bg-white sm:rounded-[20px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e4e2dd] px-4 py-4 sm:px-6 sm:py-[19px]">
          <h1 className="font-serif text-[19px] leading-none tracking-[-0.015em] text-[#171815] sm:text-[20px]">
            Goods Receipt Notes
          </h1>

          <button
            type="button"
            onClick={openCreate}
            className="rounded bg-[#151714] px-3 py-2 text-xs text-white"
          >
            Create GRN
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Table Header */}
            <div
              className={`
                grid
                ${gridColumns}
                border-b
                border-[#e4e2dd]
                bg-[#f5f4f0]
                px-6
                py-[4px]
              `}
            >
              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                GRN #
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                PO #
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                VENDOR
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                RECEIVED DATE
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                ITEMS
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                VALUE
              </div>

              <div className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                QUALITY
              </div>
            </div>

            {/* Rows */}
            <div>
              {loading ? (
                <div className="px-6 py-10 text-center text-sm text-gray-400">
                  Loading goods receipts...
                </div>
              ) : goodsReceipts.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-gray-400">
                  No goods receipts found.
                </div>
              ) : (
                goodsReceipts.map((grn, index) => (
                  <GoodsReceiptRow
                    key={grn.grnNumber}
                    grn={grn}
                    index={index}
                    hoveredRow={hoveredRow}
                    setHoveredRow={setHoveredRow}
                    onView={viewReceipt}
                    onDelete={deleteReceipt}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Create GRN Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={saveReceipt}
            className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
          >
            <h2 className="mb-4 text-lg font-semibold">
              Create Goods Receipt
            </h2>

            {/* Purchase Order */}
            <select
              required
              defaultValue=""
              className="mb-3 w-full border p-2"
              onChange={(e) => selectOrder(e.target.value)}
            >
              <option value="" disabled>
                Select confirmed purchase order
              </option>

              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.orderNumber} — {order.vendorName}
                </option>
              ))}
            </select>

            {/* Received Date */}
            {selectedOrder && (
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Received Date
                </label>

                <input
                  type="date"
                  required
                  min={selectedOrder.orderDate}
                  value={receivedDate}
                  onChange={(e) => setReceivedDate(e.target.value)}
                  className="w-full border p-2"
                />
              </div>
            )}

            {/* Items */}
            {receiptItems.map((item, index) => (
              <label
                key={item.id}
                className="mb-2 flex items-center justify-between gap-3 text-sm"
              >
                <span>
                  {item.description} (ordered: {item.quantity})
                </span>

                <input
                  className="w-24 border p-1"
                  type="number"
                  min="0"
                  max={item.quantity}
                  step="0.0001"
                  value={item.receivedQuantity}
                  onChange={(e) =>
                    setReceiptItems((items) =>
                      items.map((value, i) =>
                        i === index
                          ? {
                              ...value,
                              receivedQuantity: e.target.value,
                            }
                          : value
                      )
                    )
                  }
                />
              </label>
            ))}

            {/* Actions */}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCreate(false);
                  setSelectedOrder(null);
                  setReceiptItems([]);
                  setReceivedDate("");
                }}
                className="border px-3 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!selectedOrder || !receivedDate}
                className="bg-[#151714] px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Create GRN
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#ece9e2] pb-4">
              <div>
                <p className="font-mono text-[10px] text-[#999]">{selectedReceipt.grnNumber}</p>
                <h2 className="mt-1 font-serif text-[21px] font-bold text-[#171815]">Goods Receipt Details</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                aria-label="Close goods receipt details"
                className="rounded-lg border border-[#e4e2dc] bg-[#f7f6f2] px-3 py-1.5 text-[#777]"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-[11px] sm:grid-cols-4">
              {[
                ["Vendor", selectedReceipt.vendorName],
                ["Received Date", selectedReceipt.receivedDate],
                ["Quality", selectedReceipt.qualityStatus],
                ["Items", selectedReceipt.itemCount ?? selectedReceipt.items?.length],
                ["Total", `₹${Number(selectedReceipt.totalValue ?? 0).toLocaleString("en-IN")}`],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 border-b border-[#f0eee8] pb-2">
                  <div className="text-[9px] uppercase tracking-wide text-[#999]">{label}</div>
                  <div className="mt-1 break-words font-medium text-[#171815]">{value || "-"}</div>
                </div>
              ))}
            </div>

            <h3 className="mb-2 mt-6 font-mono text-[10px] font-semibold tracking-wider text-[#999]">RECEIVED ITEMS</h3>
            <div className="overflow-x-auto rounded-xl border border-[#e4e2dc]">
              <table className="w-full min-w-[420px] text-left text-[11px]">
                <thead className="border-b border-[#e4e2dc] bg-[#f7f6f2]">
                  <tr>
                    {["Description", "Ordered", "Received", "Unit Price"].map((heading) => (
                      <th key={heading} className="px-3 py-2 font-mono text-[9px] text-[#888]">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eee8]">
                  {(selectedReceipt.items || []).map((item) => (
                    <tr key={item.id || item.description}>
                      <td className="px-3 py-2 font-medium text-[#171815]">{item.description}</td>
                      <td className="px-3 py-2 text-[#555]">{item.orderedQuantity ?? item.quantity ?? "-"}</td>
                      <td className="px-3 py-2 text-[#555]">{item.receivedQuantity ?? "-"}</td>
                      <td className="px-3 py-2 text-[#555]">₹{Number(item.unitPrice || 0).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex justify-end border-t border-[#ece9e2] pt-4">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="rounded-[10px] border border-[#e4e2dc] px-4 py-2 text-[11px] text-[#555]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default GoodsReceipts;