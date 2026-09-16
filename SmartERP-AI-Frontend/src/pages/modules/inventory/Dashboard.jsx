import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Search,
  Plus,
  X,
  AlertTriangle,
  SlidersHorizontal,
  ArrowLeftRight,
  ClipboardList,
  CheckCircle2,
  Check,
} from "lucide-react";
import AddNewItem from "./AddNewItem";
import Warehouses from "./Warehouses";
import Movements from "./Movements";
import Replenishment from "./Replenishment";
import InventoryService from "../../../core/services/modules/inventory.service";
import ActionMenu from "./modals/ActionMenu";
import EditItemModal from "./modals/EditItemModal";
import RestockModal from "./modals/RestockModal";
import AdjustStockModal from "./modals/AdjustStockModal";
import StockHistoryModal from "./modals/StockHistoryModal";
import TransferStockModal from "./modals/TransferStockModal";
import DeleteItemModal from "./modals/DeleteItemModal";

/* ============================================================
   CONSTANTS
============================================================ */

const STATUS_LABELS = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

const FILTER_TO_API = {
  All: null,
  "In Stock": "IN_STOCK",
  "Low Stock": "LOW_STOCK",
  "Out of Stock": "OUT_OF_STOCK",
};

const FILTERS = ["All", "In Stock", "Low Stock", "Out of Stock"];

const ADJUSTMENT_REASONS = [
  "Cycle Count Variance",
  "Damaged Goods Write-off",
  "Found Inventory",
  "Supplier Shortage Correction",
  "Internal Consumption",
  "Quality Inspection Adjustment",
  "Other",
];

/* ============================================================
   HELPERS
============================================================ */

function formatCurrency(value) {
  const num = Number(value ?? 0);
  if (isNaN(num)) return "₹0";
  return "₹" + num.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function safeNum(value) {
  const n = Number(value ?? 0);
  return isNaN(n) ? 0 : n;
}

function normalizeStatus(raw) {
  return String(raw ?? "").toUpperCase().replace(/ /g, "_");
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function Stock() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Stock");

  // Add / Edit mode
  const [showAddItem, setShowAddItem] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Stock list
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Warehouses list for dropdowns
  const [warehousesList, setWarehousesList] = useState([]);

  // KPI
  const [kpi, setKpi] = useState(null);
  const [kpiError, setKpiError] = useState(false);

  // View detail panel
  const [viewItem, setViewItem] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState(null);

  // Action Modals
  const [editTarget, setEditTarget] = useState(null);
  const [restockTarget, setRestockTarget] = useState(null);
  const [adjustTarget, setAdjustTarget] = useState(null);
  const [historyTarget, setHistoryTarget] = useState(null);
  const [transferTarget, setTransferTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Stock Take modal
  const [showStockTakeModal, setShowStockTakeModal] = useState(false);

  const searchTimer = useRef(null);

  /* ----------------------------------------------------------
     DATA FETCHING
  ---------------------------------------------------------- */

  const fetchItems = useCallback(async (searchVal, filterVal) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchVal && searchVal.trim()) params.search = searchVal.trim();
      const apiStatus = FILTER_TO_API[filterVal];
      if (apiStatus) params.status = apiStatus;

      const res = await InventoryService.getAll(
        Object.keys(params).length ? params : undefined
      );
      setItems(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setError("Failed to load inventory. Please try again.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboard = useCallback(async () => {
    setKpiError(false);
    try {
      const res = await InventoryService.getDashboard();
      setKpi(res?.data ?? null);
    } catch {
      setKpiError(true);
      setKpi(null);
    }
  }, []);

  const fetchWarehouses = useCallback(async () => {
    try {
      const res = await InventoryService.getWarehouses();
      setWarehousesList(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setWarehousesList([]);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchItems(search, filter);
    fetchDashboard();
    fetchWarehouses();
  }, [fetchItems, fetchDashboard, fetchWarehouses, search, filter]);

  // Initial load
  useEffect(() => {
    fetchItems(search, filter);
    fetchDashboard();
    fetchWarehouses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----------------------------------------------------------
     SEARCH — debounced 400 ms
  ---------------------------------------------------------- */

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchItems(val, filter);
    }, 400);
  };

  /* ----------------------------------------------------------
     STATUS FILTER
  ---------------------------------------------------------- */

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    fetchItems(search, newFilter);
  };

  /* ----------------------------------------------------------
     VIEW ITEM
  ---------------------------------------------------------- */

  const handleView = async (item) => {
    setViewItem(item);
    setViewLoading(true);
    setViewError(null);
    try {
      const res = await InventoryService.getById(item.id);
      setViewItem(res?.data ?? item);
    } catch {
      setViewError("Could not load item details.");
    } finally {
      setViewLoading(false);
    }
  };

  const closeView = () => {
    setViewItem(null);
    setViewError(null);
  };

  /* ----------------------------------------------------------
     ACTIONS HANDLERS
  ---------------------------------------------------------- */

  const handleEdit = (item) => {
    setEditTarget(item);
    setViewItem(null);
  };

  const handleRestock = (item) => {
    setRestockTarget(item);
    setViewItem(null);
  };

  const handleAdjust = (item) => {
    setAdjustTarget(item);
    setViewItem(null);
  };

  const handleHistory = (item) => {
    setHistoryTarget(item);
  };

  const handleTransfer = (item) => {
    setTransferTarget(item);
    setViewItem(null);
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
    setViewItem(null);
  };

  /* ----------------------------------------------------------
     ADD ITEM SAVED
  ---------------------------------------------------------- */

  const handleSaved = useCallback(() => {
    setShowAddItem(false);
    setEditItem(null);
    refresh();
  }, [refresh]);

  /* ----------------------------------------------------------
     KPI CARDS
  ---------------------------------------------------------- */

  const kpiCards = [
    {
      value: kpiError ? "—" : kpi === null ? "…" : String(safeNum(kpi.totalSkus)),
      label: "TOTAL SKUs",
      description: "Across all warehouses",
    },
    {
      value: kpiError ? "—" : kpi === null ? "…" : formatCurrency(kpi.stockValue),
      label: "STOCK VALUE",
      description: "At cost price",
    },
    {
      value: kpiError ? "—" : kpi === null ? "…" : String(safeNum(kpi.lowStockItems)),
      label: "LOW STOCK ITEMS",
      description: "Need reorder",
    },
    {
      value: kpiError ? "—" : kpi === null ? "…" : String(safeNum(kpi.outOfStockItems)),
      label: "OUT OF STOCK",
      description: "Urgent action needed",
    },
  ];

  /* ----------------------------------------------------------
     RENDER
  ---------------------------------------------------------- */

  return (
    <div className="min-h-full bg-[#f8f7f3] px-[35px] pb-[50px] pt-[35px]">

      {/* ---- ADD NEW ITEM MODAL ---- */}
      {showAddItem && (
        <AddNewItem
          isModal={true}
          initialData={editItem}
          onBack={() => { setShowAddItem(false); setEditItem(null); }}
          onCancel={() => { setShowAddItem(false); setEditItem(null); }}
          onSaved={handleSaved}
        />
      )}

      {/* ---- 1. EDIT ITEM MODAL ---- */}
      {editTarget && (
        <EditItemModal
          item={editTarget}
          warehouses={warehousesList}
          onClose={() => setEditTarget(null)}
          onSuccess={() => {
            setEditTarget(null);
            refresh();
          }}
        />
      )}

      {/* ---- 2. RESTOCK ITEM MODAL ---- */}
      {restockTarget && (
        <RestockModal
          item={restockTarget}
          warehouses={warehousesList}
          onClose={() => setRestockTarget(null)}
          onSuccess={() => {
            setRestockTarget(null);
            refresh();
          }}
        />
      )}

      {/* ---- 3. STOCK ADJUSTMENT MODAL ---- */}
      {adjustTarget && (
        <AdjustStockModal
          item={adjustTarget}
          onClose={() => setAdjustTarget(null)}
          onSuccess={() => {
            setAdjustTarget(null);
            refresh();
          }}
        />
      )}

      {/* ---- 4. STOCK HISTORY MODAL ---- */}
      {historyTarget && (
        <StockHistoryModal
          item={historyTarget}
          warehouses={warehousesList}
          onClose={() => setHistoryTarget(null)}
        />
      )}

      {/* ---- 5. STOCK TRANSFER MODAL ---- */}
      {transferTarget && (
        <TransferStockModal
          item={transferTarget}
          warehouses={warehousesList}
          onClose={() => setTransferTarget(null)}
          onSuccess={() => {
            setTransferTarget(null);
            refresh();
          }}
        />
      )}

      {/* ---- 6. DELETE ITEM MODAL ---- */}
      {deleteTarget && (
        <DeleteItemModal
          item={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={() => {
            setDeleteTarget(null);
            refresh();
          }}
        />
      )}

      {/* ---- STOCK TAKE MODAL ---- */}
      {showStockTakeModal && (
        <StockTakeModal
          warehouses={warehousesList}
          onClose={() => setShowStockTakeModal(false)}
          onStockUpdated={refresh}
        />
      )}

      {/* ---- VIEW DETAIL SIDE PANEL ---- */}
      {viewItem && (
        <ItemDetailPanel
          item={viewItem}
          loading={viewLoading}
          error={viewError}
          onClose={closeView}
          onEdit={() => handleEdit(viewItem)}
          onDelete={() => handleDelete(viewItem)}
          onAdjust={() => handleAdjust(viewItem)}
          onTransfer={() => handleTransfer(viewItem)}
        />
      )}

      {/* PAGE HEADER */}
      <div className="mb-5 flex items-end justify-between">

        <div>
          <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#a3a49d]">
            Inventory
          </div>

          <h1 className="font-serif text-[28px] leading-none text-[#20231f]">
            Inventory Control
          </h1>
        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            disabled
            className="
              flex items-center gap-1.5 rounded-xl border border-[#e0ded6] bg-[#fbfaf7]
              px-4 py-2.5 font-mono text-[9px] text-[#666a63] cursor-default
            "
          >
            <ClipboardList size={13} />
            Stock Take
          </button>

          <button
            type="button"
            onClick={() => { setEditItem(null); setShowAddItem(true); }}
            className="
              flex items-center gap-2 rounded-xl bg-[#20231f]
              px-4 py-2.5 font-mono text-[9px] text-white
              transition hover:bg-[#343731]
            "
          >
            <Plus size={12} />
            Add Item
          </button>

        </div>
      </div>


      {/* KPI CARDS */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <StatCard key={card.label} value={card.value} label={card.label} description={card.description} />
        ))}
      </div>


      {/* TABS */}
      <div className="mb-5 flex items-center gap-1 border-b border-[#e2e0d8] overflow-x-auto">
        {["Stock", "Warehouses", "Movements", "Replenishment"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`
              h-[42px] min-w-[92px] px-5 rounded-t-[10px] font-mono text-[10px]
              uppercase tracking-[0.1em] inline-flex items-center justify-center transition
              ${activeTab === tab
                ? "border border-b-0 border-[#dedcd4] bg-[#fbfaf7] text-[#30332e] font-semibold"
                : "text-[#9a9c95] hover:text-[#656961]"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>


      {/* TAB CONTENT */}
      {activeTab === "Stock" && (
        <StockPanel
          items={items}
          loading={loading}
          error={error}
          search={search}
          filter={filter}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onView={handleView}
          onEdit={handleEdit}
          onRestock={handleRestock}
          onAdjust={handleAdjust}
          onHistory={handleHistory}
          onTransfer={handleTransfer}
          onDelete={handleDelete}
          onRetry={() => fetchItems(search, filter)}
        />
      )}

      {activeTab === "Warehouses" && <Warehouses />}

      {activeTab === "Movements" && <Movements />}

      {activeTab === "Replenishment" && <Replenishment />}

    </div>
  );
}


/* ============================================================
   STOCK PANEL (tab = Stock)
============================================================ */

function StockPanel({
  items,
  loading,
  error,
  search,
  filter,
  onSearchChange,
  onFilterChange,
  onView,
  onEdit,
  onRestock,
  onAdjust,
  onHistory,
  onTransfer,
  onDelete,
  onRetry,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e2e0d8] bg-[#fbfaf7]">

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col gap-3 border-b border-[#e5e3dc] px-4 py-3.5 lg:flex-row lg:items-center lg:justify-between">

        <div className="relative w-full lg:w-[275px]">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0b1ab]"
          />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={onSearchChange}
            className="
              h-[35px] w-full rounded-lg border border-[#e2e0d8] bg-[#f5f4ef]
              pl-8 pr-3 font-mono text-[9px] text-[#444740] outline-none
              placeholder:text-[#aaaBA5] focus:border-[#c8c6bd]
            "
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onFilterChange(item)}
              className={`
                h-[35px] min-w-[70px] px-3.5 rounded-[8px] border font-mono text-[10px]
                tracking-[0.05em] inline-flex items-center justify-center transition
                ${filter === item
                  ? "border-[#d2d0c7] bg-[#e9e8e1] text-[#373a35] font-medium"
                  : "border-[#e1dfd7] bg-[#fbfaf7] text-[#858880] hover:bg-[#f1f0ea]"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>

      </div>


      {/* TABLE / LOADING / ERROR / EMPTY */}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="font-mono text-[10px] text-[#999b94]">Loading inventory…</div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16">
          <div className="font-mono text-[10px] text-[#b05a52]">{error}</div>
          <button
            type="button"
            onClick={onRetry}
            className="mt-1 rounded-lg border border-[#e0ded6] bg-[#fbfaf7] px-4 py-2 font-mono text-[9px] text-[#666a63] transition hover:bg-[#f0efe9]"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse">
              <thead>
                <tr className="border-b border-[#e1dfd7] bg-[#f4f3ee]">
                  <TableHeader>SKU</TableHeader>
                  <TableHeader>ITEM NAME</TableHeader>
                  <TableHeader>CATEGORY</TableHeader>
                  <TableHeader>WAREHOUSE</TableHeader>
                  <TableHeader>QTY</TableHeader>
                  <TableHeader>MIN LEVEL</TableHeader>
                  <TableHeader>UNIT</TableHeader>
                  <TableHeader>VALUE</TableHeader>
                  <TableHeader>STATUS</TableHeader>
                  <TableHeader className="text-right">ACTIONS</TableHeader>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <StockRow
                    key={item.id ?? item.sku}
                    item={item}
                    onEdit={onEdit}
                    onRestock={onRestock}
                    onAdjust={onAdjust}
                    onHistory={onHistory}
                    onTransfer={onTransfer}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {items.length === 0 && (
            <div className="py-12 text-center font-mono text-[10px] text-[#999b94]">
              No stock items found.
            </div>
          )}
        </>
      )}

    </div>
  );
}


/* ============================================================
   STAT CARD
============================================================ */

function StatCard({ value, label, description }) {
  return (
    <div className="min-h-72px rounded-xl border border-[#e2e0d8] bg-[#fbfaf7] px-3.5 py-3">
      <div className="font-serif text-[22px] leading-none text-[#20231f]">{value}</div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#989a93]">{label}</div>
      <div className="mt-1 font-mono text-[10px] text-[#a5a69f]">{description}</div>
    </div>
  );
}


/* ============================================================
   TABLE HEADER CELL
============================================================ */

function TableHeader({ children, className = "" }) {
  return (
    <th className={`px-3 py-3 text-left font-mono text-[9px] font-medium uppercase tracking-[0.1em] text-[#999b94] ${className}`}>
      {children}
    </th>
  );
}


/* ============================================================
   STOCK ROW
============================================================ */

function StockRow({
  item,
  onEdit,
  onRestock,
  onAdjust,
  onHistory,
  onTransfer,
  onDelete,
}) {
  const rawStatus = normalizeStatus(item.status);
  const labelText = STATUS_LABELS[rawStatus] ?? String(item.status ?? "");

  const statusStyle = {
    IN_STOCK: "bg-[#e1ebdf] text-[#3d5940]",
    LOW_STOCK: "bg-[#ece8dc] text-[#746a4d]",
    OUT_OF_STOCK: "bg-[#eadfdd] text-[#76534f]",
  };
  const badgeClass = statusStyle[rawStatus] ?? "bg-[#eee] text-[#555]";
  const isLowOrOut = rawStatus === "LOW_STOCK" || rawStatus === "OUT_OF_STOCK";

  return (
    <tr className="border-b border-[#e5e3dc] transition hover:bg-[#f8f7f2]">

      <td className="px-3 py-3.5 font-mono text-[10px] text-[#777a73]">{item.sku}</td>

      <td className="px-3 py-3.5">
        <div className="font-serif text-[14px] text-[#20231f]">{item.name}</div>
      </td>

      <td className="px-3 py-3.5">
        <span className="rounded-md border border-[#e1dfd7] bg-[#f0efea] px-2 py-1 font-mono text-[9px] text-[#777a73]">
          {item.category}
        </span>
      </td>

      <td className="px-3 py-3.5 font-mono text-[10px] text-[#777b73]">{item.warehouseName}</td>

      <td className="px-3 py-3.5 font-mono text-[10px] font-medium text-[#292c27]">
        {safeNum(item.quantity)}
      </td>

      <td className="px-3 py-3.5 font-mono text-[10px] text-[#8d9088]">
        {safeNum(item.minimumLevel)}
      </td>

      <td className="px-3 py-3.5 font-mono text-[10px] text-[#777a73]">{item.unit}</td>

      <td className="px-3 py-3.5 font-mono text-[10px] font-medium text-[#292c27]">
        {formatCurrency(item.stockValue)}
      </td>

      <td className="px-3 py-3.5">
        <span className={`inline-flex rounded-lg px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.04em] ${badgeClass}`}>
          {labelText}
        </span>
      </td>

      {/* ACTIONS */}
      <td className="px-3 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {isLowOrOut ? (
            <button
              type="button"
              onClick={() => onRestock(item)}
              className="
                inline-flex h-[28px] items-center justify-center rounded-[7px] border
                border-[#cbe3ca] bg-[#eef7ed] px-2.5 font-mono text-[10px] font-medium
                text-[#3d5940] transition hover:bg-[#e2f0e0]
              "
            >
              Restock
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="
                inline-flex h-[28px] items-center justify-center rounded-[7px] border
                border-[#deddd5] bg-[#fbfaf7] px-2.5 font-mono text-[10px]
                text-[#373a35] transition hover:bg-[#f0efe9]
              "
            >
              Edit
            </button>
          )}

          <ActionMenu
            item={item}
            onEdit={onEdit}
            onRestock={onRestock}
            onAdjust={onAdjust}
            onHistory={onHistory}
            onTransfer={onTransfer}
            onDelete={onDelete}
          />
        </div>
      </td>

    </tr>
  );
}


/* ============================================================
   ITEM DETAIL SIDE PANEL
============================================================ */

function ItemDetailPanel({
  item,
  loading,
  error,
  onClose,
  onEdit,
  onDelete,
  onAdjust,
  onTransfer,
}) {
  const rawStatus = normalizeStatus(item.status);
  const labelText = STATUS_LABELS[rawStatus] ?? String(item.status ?? "");
  const statusStyle = {
    IN_STOCK: "bg-[#e1ebdf] text-[#3d5940]",
    LOW_STOCK: "bg-[#ece8dc] text-[#746a4d]",
    OUT_OF_STOCK: "bg-[#eadfdd] text-[#76534f]",
  };
  const badgeClass = statusStyle[rawStatus] ?? "bg-[#eee] text-[#555]";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-[#fbfaf7] shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e3dc] px-5 py-4">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#a3a49d]">
              Item Details
            </div>
            <div className="mt-1 font-serif text-[18px] leading-tight text-[#20231f]">
              {item.name}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="
              inline-flex h-[32px] w-[32px] items-center justify-center
              rounded-[8px] border border-[#e2e0d8] bg-[#fbfaf7]
              text-[#777a73] transition hover:bg-[#f0efe9]
            "
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="font-mono text-[10px] text-[#999b94]">Loading…</span>
            </div>
          ) : error ? (
            <div className="rounded-[10px] border border-[#f5c6cb] bg-[#f8d7da] px-4 py-3 font-mono text-[10px] text-[#721c24]">
              {error}
            </div>
          ) : (
            <div className="space-y-4">

              {/* SKU + Status */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#9a9c95]">SKU: {item.sku}</span>
                <span className={`inline-flex rounded-lg px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.04em] ${badgeClass}`}>
                  {labelText}
                </span>
              </div>

              <div className="rounded-[12px] border border-[#e3e0d9] bg-white">
                <DetailRow label="Category" value={item.category} />
                <DetailRow label="Warehouse Code" value={item.warehouseCode} />
                <DetailRow label="Warehouse" value={item.warehouseName} />
                <DetailRow label="Unit" value={item.unit} />
                <DetailRow label="Current Quantity" value={`${safeNum(item.quantity)} ${item.unit}`} />
                <DetailRow label="Min Safety Level" value={`${safeNum(item.minimumLevel)} ${item.unit}`} />
                <DetailRow label="Cost Price" value={formatCurrency(item.costPrice)} />
                <DetailRow label="Total Stock Value" value={formatCurrency(item.stockValue)} last />
              </div>

              {/* Operations row */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={onAdjust}
                  className="
                    flex items-center justify-center gap-1.5 rounded-[9px] border
                    border-[#d0dcd0] bg-[#f2f7f1] py-2 font-mono text-[9px] font-medium
                    text-[#3a5438] transition hover:bg-[#e6f0e4]
                  "
                >
                  <SlidersHorizontal size={12} />
                  Adjust Stock
                </button>
                <button
                  type="button"
                  onClick={onTransfer}
                  className="
                    flex items-center justify-center gap-1.5 rounded-[9px] border
                    border-[#d0d6e2] bg-[#f2f4f8] py-2 font-mono text-[9px] font-medium
                    text-[#3a475d] transition hover:bg-[#e4e8f1]
                  "
                >
                  <ArrowLeftRight size={12} />
                  Transfer Warehouse
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer actions */}
        {!loading && !error && (
          <div className="flex gap-2 border-t border-[#e5e3dc] px-5 py-4">
            <button
              type="button"
              onClick={onEdit}
              className="
                flex-1 rounded-[10px] bg-[#20231f] py-2.5 font-mono text-[10px]
                text-white transition hover:bg-[#343731]
              "
            >
              Edit Item
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="
                rounded-[10px] border border-[#eadfdd] bg-[#fbfaf7] px-4 py-2.5
                font-mono text-[10px] text-[#a06060] transition hover:bg-[#f5eeed]
              "
            >
              Delete
            </button>
          </div>
        )}

      </div>
    </>
  );
}

function DetailRow({ label, value, last = false }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 ${last ? "" : "border-b border-[#f0efeb]"}`}>
      <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[#999b94]">{label}</span>
      <span className="font-mono text-[10px] text-[#222420]">{value ?? "—"}</span>
    </div>
  );
}





/* ============================================================
   STOCK TAKE MODAL & WORKFLOW
============================================================ */

function StockTakeModal({ warehouses, onClose, onStockUpdated }) {
  const [viewMode, setViewMode] = useState("list"); // "list", "create", "audit"
  const [stockTakes, setStockTakes] = useState([]);
  const [selectedTake, setSelectedTake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New stock take form state
  const [title, setTitle] = useState("Annual Physical Inventory Audit");
  const [whCode, setWhCode] = useState("");
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);

  // Count editing state for audit mode
  const [counts, setCounts] = useState({}); // { itemId: countedQty }
  const [savingCounts, setSavingCounts] = useState(false);

  const fetchStockTakes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await InventoryService.getStockTakes();
      setStockTakes(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setError("Could not load stock takes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockTakes();
    if (warehouses && warehouses.length > 0) {
      setWhCode(warehouses[0].code);
    }
  }, [fetchStockTakes, warehouses]);

  const handleOpenAudit = async (take) => {
    setLoading(true);
    try {
      const res = await InventoryService.getStockTakeById(take.id);
      setSelectedTake(res.data);
      const initialCounts = {};
      (res.data.items || []).forEach((it) => {
        if (it.countedQuantity != null) {
          initialCounts[it.id] = String(it.countedQuantity);
        }
      });
      setCounts(initialCounts);
      setViewMode("audit");
    } catch {
      setError("Failed to load stock take details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStockTake = async (e) => {
    e.preventDefault();
    if (!title.trim() || !whCode.trim()) return;

    const whObj = warehouses.find((w) => w.code === whCode) || {
      code: whCode,
      name: whCode + " Warehouse",
    };

    setCreating(true);
    setError(null);
    try {
      const res = await InventoryService.createStockTake({
        title: title.trim(),
        warehouseCode: whObj.code,
        warehouseName: whObj.name || whObj.code,
        scheduledDate: new Date().toISOString().split("T")[0],
        notes: notes.trim() || undefined,
      });
      fetchStockTakes();
      handleOpenAudit(res.data);
    } catch (err) {
      const res = err?.response?.data;
      setError(res?.detail || res?.message || "Failed to create stock take.");
    } finally {
      setCreating(false);
    }
  };

  const handleSaveCounts = async () => {
    if (!selectedTake) return;
    setSavingCounts(true);
    setError(null);
    try {
      const itemRequests = (selectedTake.items || []).map((it) => ({
        id: it.id,
        countedQuantity: counts[it.id] !== undefined && counts[it.id] !== ""
          ? Number(counts[it.id])
          : it.systemQuantity,
      }));

      const res = await InventoryService.updateStockTake(selectedTake.id, {
        title: selectedTake.title,
        items: itemRequests,
      });
      setSelectedTake(res.data);
    } catch (err) {
      const res = err?.response?.data;
      setError(res?.detail || res?.message || "Failed to save counts.");
    } finally {
      setSavingCounts(false);
    }
  };

  const handleFinalize = async () => {
    if (!selectedTake) return;
    if (!window.confirm("Finalize this stock take and update live inventory with counted quantities?")) {
      return;
    }

    setSavingCounts(true);
    setError(null);
    try {
      // 1. Save counts first
      const itemRequests = (selectedTake.items || []).map((it) => ({
        id: it.id,
        countedQuantity: counts[it.id] !== undefined && counts[it.id] !== ""
          ? Number(counts[it.id])
          : it.systemQuantity,
      }));
      await InventoryService.updateStockTake(selectedTake.id, { items: itemRequests });

      // 2. Finalize
      const res = await InventoryService.finalizeStockTake(selectedTake.id);
      setSelectedTake(res.data);
      if (onStockUpdated) onStockUpdated();
      fetchStockTakes();
    } catch (err) {
      const res = err?.response?.data;
      setError(res?.detail || res?.message || "Failed to finalize stock take.");
    } finally {
      setSavingCounts(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[60] flex max-h-[90vh] w-full max-w-[840px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[16px] border border-[#e2e0d8] bg-[#fbfaf7] shadow-xl overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e5e3dc] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#20231f] text-white">
              <ClipboardList size={16} />
            </div>
            <div>
              <h3 className="font-serif text-[18px] text-[#20231f]">Stock Take & Inventory Audit</h3>
              <p className="font-mono text-[9px] text-[#999b94]">
                Physical inventory counting, system variance reconciliation, and audit adjustment
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-[#999b94] hover:text-[#20231f]">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Nav / Tabs inside modal */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setViewMode("list"); setSelectedTake(null); }}
                className={`rounded-lg px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.05em] transition ${
                  viewMode === "list"
                    ? "bg-[#20231f] text-white"
                    : "border border-[#e2e0d8] bg-white text-[#777a73] hover:bg-[#f5f4ef]"
                }`}
              >
                Audits ({stockTakes.length})
              </button>

              <button
                type="button"
                onClick={() => setViewMode("create")}
                className={`rounded-lg px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.05em] transition ${
                  viewMode === "create"
                    ? "bg-[#20231f] text-white"
                    : "border border-[#e2e0d8] bg-white text-[#777a73] hover:bg-[#f5f4ef]"
                }`}
              >
                + New Audit
              </button>

              {selectedTake && (
                <button
                  type="button"
                  onClick={() => setViewMode("audit")}
                  className={`rounded-lg px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.05em] transition ${
                    viewMode === "audit"
                      ? "bg-[#20231f] text-white"
                      : "border border-[#e2e0d8] bg-white text-[#777a73] hover:bg-[#f5f4ef]"
                  }`}
                >
                  Count Sheet: {selectedTake.code}
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-[8px] border border-[#f5c6cb] bg-[#f8d7da] px-3 py-2 font-mono text-[10px] text-[#721c24]">
              {error}
            </div>
          )}

          {/* VIEW: LIST OF AUDITS */}
          {viewMode === "list" && (
            <div>
              {loading ? (
                <div className="py-12 text-center font-mono text-[10px] text-[#999b94]">
                  Loading audits…
                </div>
              ) : stockTakes.length === 0 ? (
                <div className="rounded-xl border border-[#e2e0d8] bg-white py-12 text-center font-mono text-[10px] text-[#999b94]">
                  No stock audits recorded yet. Click <strong>+ New Audit</strong> to start a physical count.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {stockTakes.map((st) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between rounded-xl border border-[#e2e0d8] bg-white p-4 transition hover:border-[#cfccc2]"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] font-semibold text-[#20231f]">{st.code}</span>
                          <span
                            className={`rounded px-1.5 py-0.5 font-mono text-[8px] uppercase ${
                              st.status === "COMPLETED"
                                ? "bg-[#e1ebdf] text-[#3d5940]"
                                : st.status === "IN_PROGRESS"
                                ? "bg-[#ece8dc] text-[#746a4d]"
                                : "bg-[#eee] text-[#666]"
                            }`}
                          >
                            {st.status}
                          </span>
                        </div>
                        <h4 className="mt-1 font-serif text-[15px] text-[#20231f]">{st.title}</h4>
                        <p className="mt-0.5 font-mono text-[8px] text-[#999b94]">
                          Warehouse: {st.warehouseCode} – {st.warehouseName} · Items: {st.totalItems} ·
                          Variance items: {st.varianceItems}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenAudit(st)}
                        className="rounded-lg bg-[#20231f] px-3.5 py-2 font-mono text-[9px] text-white transition hover:bg-[#343731]"
                      >
                        {st.status === "COMPLETED" ? "View Report" : "Count / Reconcile →"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: CREATE AUDIT */}
          {viewMode === "create" && (
            <form onSubmit={handleCreateStockTake} className="rounded-xl border border-[#e2e0d8] bg-white p-5 space-y-4">
              <h4 className="font-serif text-[16px] text-[#20231f]">Schedule New Stock Audit</h4>

              <div>
                <label className="block font-mono text-[9px] uppercase tracking-[0.08em] text-[#6b7268]">
                  Audit Title <span className="text-[#d9534f]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-[9px] border border-[#dedcd4] bg-[#fdfdfc] px-3 py-2 font-mono text-[11px] outline-none focus:border-[#11130f]"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] uppercase tracking-[0.08em] text-[#6b7268]">
                  Target Warehouse <span className="text-[#d9534f]">*</span>
                </label>
                {warehouses.length > 0 ? (
                  <select
                    value={whCode}
                    onChange={(e) => setWhCode(e.target.value)}
                    className="mt-1 w-full rounded-[9px] border border-[#dedcd4] bg-[#fdfdfc] px-3 py-2 font-mono text-[11px] outline-none focus:border-[#11130f]"
                  >
                    {warehouses.map((w) => (
                      <option key={w.code} value={w.code}>{w.code} – {w.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={whCode}
                    onChange={(e) => setWhCode(e.target.value)}
                    placeholder="e.g. W1"
                    required
                    className="mt-1 w-full rounded-[9px] border border-[#dedcd4] bg-[#fdfdfc] px-3 py-2 font-mono text-[11px] outline-none focus:border-[#11130f]"
                  />
                )}
                <p className="mt-1 font-mono text-[8px] text-[#999b94]">
                  All inventory SKUs currently located in this warehouse will be included in the audit sheet.
                </p>
              </div>

              <div>
                <label className="block font-mono text-[9px] uppercase tracking-[0.08em] text-[#6b7268]">
                  Notes / Audit Instructions
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Q1 annual physical verification..."
                  className="mt-1 w-full rounded-[9px] border border-[#dedcd4] bg-[#fdfdfc] px-3 py-2 font-mono text-[11px] outline-none focus:border-[#11130f]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className="rounded-[9px] border border-[#e2e0d8] bg-white px-4 py-2 font-mono text-[10px] text-[#666a63]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-1.5 rounded-[9px] bg-[#20231f] px-5 py-2 font-mono text-[10px] text-white disabled:opacity-50"
                >
                  {creating ? "Creating…" : "Generate Audit Sheet"}
                </button>
              </div>
            </form>
          )}

          {/* VIEW: AUDIT COUNT SHEET */}
          {viewMode === "audit" && selectedTake && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#e2e0d8] bg-white p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#20231f]">{selectedTake.code}</span>
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[8px] uppercase ${
                        selectedTake.status === "COMPLETED"
                          ? "bg-[#e1ebdf] text-[#3d5940]"
                          : "bg-[#ece8dc] text-[#746a4d]"
                      }`}
                    >
                      {selectedTake.status}
                    </span>
                  </div>
                  <h4 className="font-serif text-[16px] text-[#20231f]">{selectedTake.title}</h4>
                  <p className="font-mono text-[8px] text-[#999b94]">
                    Warehouse: {selectedTake.warehouseCode} · Items: {selectedTake.totalItems} ·
                    Variances: {selectedTake.varianceItems}
                  </p>
                </div>

                {selectedTake.status !== "COMPLETED" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={savingCounts}
                      onClick={handleSaveCounts}
                      className="rounded-[9px] border border-[#dedcd4] bg-white px-4 py-2 font-mono text-[10px] text-[#41453d] transition hover:bg-[#f5f4ef] disabled:opacity-50"
                    >
                      {savingCounts ? "Saving…" : "Save Draft"}
                    </button>
                    <button
                      type="button"
                      disabled={savingCounts}
                      onClick={handleFinalize}
                      className="flex items-center gap-1.5 rounded-[9px] bg-[#20231f] px-4 py-2 font-mono text-[10px] text-white transition hover:bg-[#343731] disabled:opacity-50"
                    >
                      <Check size={13} />
                      Finalize & Sync Inventory
                    </button>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto rounded-xl border border-[#e2e0d8] bg-white">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#e5e3dc] bg-[#f4f3ee] font-mono text-[8px] uppercase tracking-[0.08em] text-[#999b94]">
                      <th className="px-3 py-2.5 text-left">SKU</th>
                      <th className="px-3 py-2.5 text-left">Item Name</th>
                      <th className="px-3 py-2.5 text-right">System Qty</th>
                      <th className="px-3 py-2.5 text-right">Physical Count</th>
                      <th className="px-3 py-2.5 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedTake.items || []).map((it) => {
                      const systemQ = safeNum(it.systemQuantity);
                      const currentCount = counts[it.id] !== undefined
                        ? Number(counts[it.id])
                        : (it.countedQuantity != null ? safeNum(it.countedQuantity) : systemQ);
                      const varVal = currentCount - systemQ;

                      return (
                        <tr key={it.id} className="border-b border-[#f0efeb] font-mono text-[10px]">
                          <td className="px-3 py-2 text-[#777a73]">{it.sku}</td>
                          <td className="px-3 py-2 font-serif text-[12px] text-[#20231f]">{it.itemName}</td>
                          <td className="px-3 py-2 text-right font-medium text-[#666a63]">
                            {systemQ} {it.unit}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {selectedTake.status === "COMPLETED" ? (
                              <span className="font-semibold text-[#20231f]">
                                {safeNum(it.countedQuantity)} {it.unit}
                              </span>
                            ) : (
                              <input
                                type="number"
                                step="any"
                                min="0"
                                value={counts[it.id] !== undefined ? counts[it.id] : (it.countedQuantity ?? systemQ)}
                                onChange={(e) => setCounts({ ...counts, [it.id]: e.target.value })}
                                className="w-24 rounded border border-[#dedcd4] bg-[#fdfdfc] px-2 py-1 text-right font-mono text-[10px] outline-none focus:border-[#11130f]"
                              />
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <span
                              className={`font-semibold ${
                                varVal > 0
                                  ? "text-[#3d5940]"
                                  : varVal < 0
                                  ? "text-[#8c6257]"
                                  : "text-[#999b94]"
                              }`}
                            >
                              {varVal > 0 ? `+${varVal}` : varVal} {it.unit}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </>
  );
}