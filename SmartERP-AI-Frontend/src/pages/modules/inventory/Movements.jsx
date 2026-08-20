import React from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowRight,
} from "lucide-react";



export default function Movements() {
  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#92978e]">
            INVENTORY
          </p>

          <h2 className="mt-1 font-serif text-[26px]">
            Stock Movements
          </h2>

          <p className="mt-2 font-mono text-[10px] text-[#969990]">
            Track all stock entering and leaving your warehouses.
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-[#20231f] px-4 py-2.5 font-mono text-[9px] text-white hover:bg-[#343731]"
        >
          + New Movement
        </button>

      </div>


      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

        <MovementCard
          icon={<ArrowDownToLine size={16} />}
          label="STOCK IN"
          value="1,248"
          detail="Units this month"
        />

        <MovementCard
          icon={<ArrowUpFromLine size={16} />}
          label="STOCK OUT"
          value="986"
          detail="Units this month"
        />

        <MovementCard
          icon={<ArrowRight size={16} />}
          label="TOTAL MOVEMENTS"
          value="2,234"
          detail="This month"
        />

      </div>


      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#e2e0d8] bg-[#fbfaf7]">

        <div className="border-b border-[#e5e3dc] px-5 py-4">

          <h3 className="font-serif text-[18px]">
            Recent Movements
          </h3>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            <thead>

              <tr className="border-b border-[#e1dfd7] bg-[#f4f3ee]">

                <Header>ID</Header>
                <Header>DATE</Header>
                <Header>ITEM</Header>
                <Header>TYPE</Header>
                <Header>QUANTITY</Header>
                <Header>WAREHOUSE</Header>
                <Header>REFERENCE</Header>

              </tr>

            </thead>

            <tbody>

              {movements.map((movement) => (
                <MovementRow
                  key={movement.id}
                  movement={movement}
                />
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}


/* MOVEMENT CARD */

function MovementCard({ icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border border-[#e2e0d8] bg-[#fbfaf7] p-5">

      <div className="flex items-center gap-2 text-[#858a82]">

        {icon}

        <span className="font-mono text-[8px] uppercase tracking-[0.12em]">
          {label}
        </span>

      </div>

      <p className="mt-3 font-serif text-[27px] leading-none">
        {value}
      </p>

      <p className="mt-2 font-mono text-[9px] text-[#9a9d95]">
        {detail}
      </p>

    </div>
  );
}


/* TABLE HEADER */

function Header({ children }) {
  return (
    <th className="px-4 py-3 text-left font-mono text-[8px] font-medium uppercase tracking-[0.12em] text-[#9b9d96]">
      {children}
    </th>
  );
}


/* MOVEMENT ROW */

function MovementRow({ movement }) {

  const isIn = movement.type === "Stock In";

  return (
    <tr className="border-b border-[#e5e3dc] last:border-b-0 hover:bg-[#f8f7f2]">

      <td className="px-4 py-4 font-mono text-[9px] text-[#777a73]">
        {movement.id}
      </td>

      <td className="whitespace-nowrap px-4 py-4 font-mono text-[9px] text-[#777a73]">
        {movement.date}
      </td>

      <td className="px-4 py-4">

        <div className="font-serif text-[14px]">
          {movement.item}
        </div>

        <div className="mt-1 font-mono text-[8px] text-[#999b94]">
          {movement.sku}
        </div>

      </td>

      <td className="px-4 py-4">

        <span
          className={`
            inline-flex
            items-center
            gap-1.5
            rounded-lg
            px-3
            py-2
            font-mono
            text-[8px]
            uppercase
            ${
              isIn
                ? "bg-[#e1ebdf] text-[#3d5940]"
                : "bg-[#eadfdd] text-[#76534f]"
            }
          `}
        >

          {isIn ? (
            <ArrowDownToLine size={11} />
          ) : (
            <ArrowUpFromLine size={11} />
          )}

          {movement.type}

        </span>

      </td>

      <td className="px-4 py-4">

        <span className="font-mono text-[11px] font-medium">
          {movement.quantity}
        </span>

        <span className="ml-1 font-mono text-[9px] text-[#999b94]">
          {movement.unit}
        </span>

      </td>

      <td className="px-4 py-4 font-mono text-[9px] text-[#777b73]">
        {movement.warehouse}
      </td>

      <td className="px-4 py-4 font-mono text-[9px] text-[#777b73]">
        {movement.reference}
      </td>

    </tr>
  );
}