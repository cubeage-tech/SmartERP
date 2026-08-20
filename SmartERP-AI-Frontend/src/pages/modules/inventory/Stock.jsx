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

const filters = [
  "All",
  "In Stock",
  "Low Stock",
  "Out of Stock",
];

export default function Stock() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredStock = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return stockData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchText) ||
        item.sku.toLowerCase().includes(searchText) ||
        item.category.toLowerCase().includes(searchText) ||
        item.warehouse.toLowerCase().includes(searchText);

      const matchesFilter =
        filter === "All" || item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <section className="rounded-[15px] border border-[#e2e0d8] bg-[#fbfaf7] overflow-hidden">

      {/* =====================================================
          SEARCH + FILTER BAR
      ===================================================== */}

      <div className="h-[65px] px-[20px] flex items-center justify-between border-b border-[#e5e3dc]">

        {/* SEARCH */}

        <div className="relative w-[275px]">

          <Search
            size={14}
            className="
              absolute
              left-[11px]
              top-1/2
              -translate-y-1/2
              text-[#aaa9a1]
            "
          />

          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              h-[35px]
              pl-[32px]
              pr-3
              rounded-[8px]
              border
              border-[#deddd5]
              bg-[#f5f4ef]
              font-mono
              text-[10px]
              text-[#343630]
              placeholder:text-[#aaa9a1]
              outline-none
              focus:border-[#c8c6bd]
            "
          />

        </div>


        {/* FILTERS */}

        <div className="flex items-center gap-[5px]">

          {filters.map((item) => (

            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`
                h-[35px]
                px-[12px]
                rounded-[8px]
                border
                font-mono
                text-[9px]
                transition
                ${
                  filter === item
                    ? "border-[#d6d4ca] bg-[#eeece6] text-[#383a35]"
                    : "border-[#e2e0d8] bg-[#fbfaf7] text-[#898c84] hover:bg-[#f3f2ed]"
                }
              `}
            >
              {item}
            </button>

          ))}

        </div>

      </div>


      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[900px] border-collapse">

          <thead>

            <tr className="bg-[#f5f4ef] border-b border-[#e1dfd7]">

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

        <div className="
          py-12
          text-center
          font-mono
          text-[9px]
          text-[#999c95]
        ">
          No stock items found.
        </div>

      )}

    </section>
  );
}


/* ============================================================
   TABLE HEADER
============================================================ */
function Header({ children }) {
  return (
    <th
      className="
        px-[14px]
        py-[13px]
        text-left
        font-mono
        text-[9px]
        font-medium
        uppercase
        tracking-[0.12em]
        text-[#999c95]
        whitespace-nowrap
      "
    >
      {children}
    </th>
  );
}



/* ============================================================
   STOCK ROW
============================================================ */

function StockRow({ item }) {

  const statusStyle = {
    "In Stock": "bg-[#e1ebdf] text-[#3d5940]",
    "Low Stock": "bg-[#ece8dc] text-[#746a4d]",
    "Out of Stock": "bg-[#eadfdd] text-[#76534f]",
  };

  return (
    <tr className="
      h-[68px]
      border-b
      border-[#e5e3dc]
      last:border-0
      hover:bg-[#f8f7f2]
      transition
    ">

      {/* SKU */}

      <td className="px-[14px] py-[10px]">

        <span className="
          font-mono
          text-[9px]
          text-[#92958d]
          whitespace-nowrap
        ">
          {item.sku}
        </span>

      </td>


      {/* ITEM */}

      <td className="px-[14px] py-[10px] min-w-[155px]">

        <div className="
          font-serif
          text-[13px]
          leading-[1.25]
          text-[#181a17]
        ">
          {item.name}
        </div>

      </td>


      {/* CATEGORY */}

      <td className="px-[14px] py-[10px]">

        <span className="
          inline-flex
          rounded-[5px]
          border
          border-[#e1dfd7]
          bg-[#f0efea]
          px-[7px]
          py-[3px]
          font-mono
          text-[9px]
          text-[#777a73]
          whitespace-nowrap
        ">
          {item.category}
        </span>

      </td>


      {/* WAREHOUSE */}

      <td className="px-[14px] py-[10px]">

        <span className="
          font-mono
          text-[9px]
          text-[#777b73]
          whitespace-nowrap
        ">
          {item.warehouse}
        </span>

      </td>


      {/* QTY */}

      <td className="px-[14px] py-[10px]">

        <span className="
          font-mono
          text-[10px]
          font-medium
          text-[#222420]
        ">
          {item.qty}
        </span>

      </td>


      {/* MIN LEVEL */}

      <td className="px-[14px] py-[10px]">

        <span className="
          font-mono
          text-[9px]
          text-[#92958d]
        ">
          {item.minLevel}
        </span>

      </td>


      {/* UNIT */}

      <td className="px-[14px] py-[10px]">

        <span className="
          font-mono
          text-[9px]
          text-[#777a73]
        ">
          {item.unit}
        </span>

      </td>


      {/* VALUE */}

      <td className="px-[14px] py-[10px]">

        <span className="
          font-mono
          text-[10px]
          font-medium
          text-[#222420]
          whitespace-nowrap
        ">
          {item.value}
        </span>

      </td>


      {/* STATUS */}

      <td className="px-[14px] py-[10px]">

        <span
          className={`
            inline-flex
            rounded-[6px]
            px-[8px]
            py-[5px]
            font-mono
            text-[8px]
            uppercase
            tracking-[0.08em]
            whitespace-nowrap
            ${statusStyle[item.status]}
          `}
        >
          {item.status}
        </span>

      </td>

    </tr>
  );
}