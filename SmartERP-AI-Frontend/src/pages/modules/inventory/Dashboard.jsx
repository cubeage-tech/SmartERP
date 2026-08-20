import React, { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";

const stockData = [
  {
    sku: "SKU-1042",
    name: "Steel Plate 10mm",
    category: "Raw Material",
    warehouse: "W1 – Main",
    qty: 840,
    minLevel: 200,
    unit: "kg",
    value: "₹4,20,000",
    status: "In Stock",
  },
  {
    sku: "SKU-1041",
    name: "Zinc Ingot",
    category: "Raw Material",
    warehouse: "W1 – Main",
    qty: 120,
    minLevel: 150,
    unit: "kg",
    value: "₹1,80,000",
    status: "Low Stock",
  },
  {
    sku: "SKU-1040",
    name: "M8 Hex Bolts (Box/200)",
    category: "Hardware",
    warehouse: "W2 – Stores",
    qty: 0,
    minLevel: 50,
    unit: "box",
    value: "₹0",
    status: "Out of Stock",
  },
  {
    sku: "SKU-1039",
    name: "Sigma Brackets A4",
    category: "Components",
    warehouse: "W1 – Main",
    qty: 340,
    minLevel: 100,
    unit: "pcs",
    value: "₹2,04,000",
    status: "In Stock",
  },
  {
    sku: "SKU-1038",
    name: "Hydraulic Oil 15W40",
    category: "Consumable",
    warehouse: "W2 – Stores",
    qty: 28,
    minLevel: 40,
    unit: "litre",
    value: "₹11,200",
    status: "Low Stock",
  },
  {
    sku: "SKU-1037",
    name: "Safety Gloves (pair)",
    category: "PPE",
    warehouse: "W2 – Stores",
    qty: 150,
    minLevel: 60,
    unit: "pair",
    value: "₹18,000",
    status: "In Stock",
  },
];

export default function Stock() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Stock");

  const filteredStock = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return stockData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchText) ||
        item.sku.toLowerCase().includes(searchText);

      const matchesFilter =
        filter === "All" || item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="min-h-full bg-[#f8f7f3] px-4 pb-10 pt-4 sm:px-5 lg:px-6">

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
            className="
              rounded-xl
              border border-[#e0ded6]
              bg-[#fbfaf7]
              px-4
              py-2.5
              font-mono
              text-[9px]
              text-[#666a63]
              transition
              hover:bg-[#f0efe9]
            "
          >
            Stock Take
          </button>

          <button
            type="button"
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-[#20231f]
              px-4
              py-2.5
              font-mono
              text-[9px]
              text-white
              transition
              hover:bg-[#343731]
            "
          >
            <Plus size={12} />
            Add Item
          </button>

        </div>
      </div>


      {/* KPI CARDS */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          value="368"
          label="TOTAL SKUs"
          description="Across 3 warehouses"
        />

        <StatCard
          value="₹2.44 Cr"
          label="STOCK VALUE"
          description="At cost price"
        />

        <StatCard
          value="12"
          label="LOW STOCK ITEMS"
          description="Need reorder"
        />

        <StatCard
          value="3"
          label="OUT OF STOCK"
          description="Urgent action needed"
        />

      </div>


      {/* TABS */}
      <div className="mb-5 flex items-center gap-1 border-b border-[#e2e0d8]">

        {[
          "Stock",
          "Warehouses",
          "Movements",
          "Replenishment",
        ].map((tab) => (

          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`
              rounded-t-lg
              px-4
              py-2.5
              font-mono
              text-[8px]
              uppercase
              tracking-[0.1em]
              transition
              ${
                activeTab === tab
                  ? "border border-b-0 border-[#dedcd4] bg-[#fbfaf7] text-[#30332e]"
                  : "text-[#9a9c95] hover:text-[#656961]"
              }
            `}
          >
            {tab}
          </button>

        ))}

      </div>


      {/* STOCK PANEL */}
      {activeTab === "Stock" ? (
        <div className="overflow-hidden rounded-2xl border border-[#e2e0d8] bg-[#fbfaf7]">

          {/* SEARCH + FILTERS */}
          <div className="flex flex-col gap-3 border-b border-[#e5e3dc] px-4 py-3.5 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:w-[275px]">

              <Search
                size={13}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-[#b0b1ab]
                "
              />

              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  h-[35px]
                  w-full
                  rounded-lg
                  border
                  border-[#e2e0d8]
                  bg-[#f5f4ef]
                  pl-8
                  pr-3
                  font-mono
                  text-[9px]
                  text-[#444740]
                  outline-none
                  placeholder:text-[#aaaBA5]
                  focus:border-[#c8c6bd]
                "
              />

            </div>


            <div className="flex flex-wrap gap-1.5">

              {[
                "All",
                "In Stock",
                "Low Stock",
                "Out of Stock",
              ].map((item) => (

                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`
                    rounded-lg
                    border
                    px-3
                    py-2
                    font-mono
                    text-[8px]
                    transition
                    ${
                      filter === item
                        ? "border-[#d2d0c7] bg-[#e9e8e1] text-[#373a35]"
                        : "border-[#e1dfd7] bg-[#fbfaf7] text-[#858880] hover:bg-[#f1f0ea]"
                    }
                  `}
                >
                  {item}
                </button>

              ))}

            </div>

          </div>


          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[920px] border-collapse">

              <thead>

                <tr className="border-b border-[#e1dfd7] bg-[#f4f3ee]">

                  <Header>SKU</Header>
                  <Header>ITEM NAME</Header>
                  <Header>CATEGORY</Header>
                  <Header>WAREHOUSE</Header>
                  <Header>QTY</Header>
                  <Header>MIN LEVEL</Header>
                  <Header>UNIT</Header>
                  <Header>VALUE</Header>
                  <Header>STATUS</Header>

                </tr>

              </thead>

              <tbody>

                {filteredStock.map((item) => (
                  <StockRow
                    key={item.sku}
                    item={item}
                  />
                ))}

              </tbody>

            </table>

          </div>


          {/* EMPTY STATE */}
          {filteredStock.length === 0 && (
            <div className="py-12 text-center font-mono text-[10px] text-[#999b94]">
              No stock items found.
            </div>
          )}

        </div>
      ) : (

        <div className="rounded-2xl border border-[#e2e0d8] bg-[#fbfaf7] px-6 py-12 text-center">

          <div className="font-serif text-[22px] text-[#30332e]">
            {activeTab}
          </div>

          <p className="mt-2 font-mono text-[9px] text-[#999b94]">
            This inventory section is ready for configuration.
          </p>

        </div>

      )}

    </div>
  );
}


/* -------------------------------- */
/* STAT CARD */
/* -------------------------------- */

function StatCard({
  value,
  label,
  description,
}) {
  return (
    <div
      className="
        min-h-[72px]
        rounded-xl
        border
        border-[#e2e0d8]
        bg-[#fbfaf7]
        px-3.5
        py-3
      "
    >

      <div className="font-serif text-[22px] leading-none text-[#20231f]">
        {value}
      </div>

      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#989a93]">
        {label}
      </div>

      <div className="mt-1 font-mono text-[10px] text-[#a5a69f]">
        {description}
      </div>

    </div>
  );
}


/* -------------------------------- */
/* TABLE HEADER */
/* -------------------------------- */

function Header({ children }) {
  return (
    <th
      className="
        px-3
        py-3
        text-left
        font-mono
        text-[9px]
        font-medium
        uppercase
        tracking-[0.1em]
        text-[#999b94]
      "
    >
      {children}
    </th>
  );
}


/* -------------------------------- */
/* STOCK ROW */
/* -------------------------------- */

function StockRow({ item }) {

  const statusStyle = {
    "In Stock": "bg-[#e1ebdf] text-[#3d5940]",
    "Low Stock": "bg-[#ece8dc] text-[#746a4d]",
    "Out of Stock": "bg-[#eadfdd] text-[#76534f]",
  };

  return (
    <tr
      className="
        border-b
        border-[#e5e3dc]
        transition
        hover:bg-[#f8f7f2]
      "
    >

      {/* SKU */}
<td className="px-3 py-3.5 font-mono text-[10px] text-[#777a73]">
  {item.sku}
</td>

{/* ITEM NAME */}
<td className="px-3 py-3.5">
  <div className="font-serif text-[14px] text-[#20231f]">
    {item.name}
  </div>
</td>

{/* CATEGORY */}
<td className="px-3 py-3.5">
  <span
    className="
      rounded-md
      border
      border-[#e1dfd7]
      bg-[#f0efea]
      px-2
      py-1
      font-mono
      text-[9px]
      text-[#777a73]
    "
  >
    {item.category}
  </span>
</td>

{/* WAREHOUSE */}
<td className="px-3 py-3.5 font-mono text-[10px] text-[#777b73]">
  {item.warehouse}
</td>

{/* QTY */}
<td className="px-3 py-3.5 font-mono text-[10px] font-medium text-[#292c27]">
  {item.qty}
</td>

{/* MIN LEVEL */}
<td className="px-3 py-3.5 font-mono text-[10px] text-[#8d9088]">
  {item.minLevel}
</td>

{/* UNIT */}
<td className="px-3 py-3.5 font-mono text-[10px] text-[#777a73]">
  {item.unit}
</td>

{/* VALUE */}
<td className="px-3 py-3.5 font-mono text-[10px] font-medium text-[#292c27]">
  {item.value}
</td>

{/* STATUS */}
<td className="px-3 py-3.5">
  <span
    className={`
      inline-flex
      rounded-lg
      px-2.5
      py-1.5
      font-mono
      text-[9px]
      uppercase
      tracking-[0.04em]
      ${statusStyle[item.status]}
    `}
  >
    {item.status}
  </span>
</td>

    </tr>
  );
}