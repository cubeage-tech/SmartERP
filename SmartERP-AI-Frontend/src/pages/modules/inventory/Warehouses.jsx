import React from "react";

const warehouses = [
  {
    code: "W1",
    name: "Main Warehouse",
    location: "Pune MIDC",
    area: "12,000 sqft",
    capacity: 78,
    skus: 234,
    value: "₹82 L",
  },
  {
    code: "W2",
    name: "Stores",
    location: "Pune MIDC",
    area: "4,000 sqft",
    capacity: 45,
    skus: 86,
    value: "₹18 L",
  },
  {
    code: "W3",
    name: "Finished Goods",
    location: "Pune MIDC",
    area: "8,000 sqft",
    capacity: 62,
    skus: 48,
    value: "₹1.4 Cr",
  },
];

export default function Warehouses() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {warehouses.map((warehouse) => (
          <WarehouseCard
            key={warehouse.code}
            warehouse={warehouse}
          />
        ))}
      </div>
    </div>
  );
}

function WarehouseCard({ warehouse }) {
  return (
    <div
      className="
        min-h-[202px]
        rounded-[15px]
        border
        border-[#e1dfd8]
        bg-[#fbfaf7]
        px-[18px]
        py-[17px]
      "
    >
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <div
            className="
              font-mono
              text-[8px]
              leading-none
              tracking-[0.12em]
              text-[#9a9c95]
            "
          >
            {warehouse.code}
          </div>

          <h3
            className="
              mt-[6px]
              font-serif
              text-[17px]
              leading-none
              text-[#222420]
            "
          >
            {warehouse.name}
          </h3>
        </div>

        <span
          className="
            mt-[16px]
            rounded-[7px]
            bg-[#e2ebde]
            px-[9px]
            py-[5px]
            font-mono
            text-[7px]
            uppercase
            leading-none
            tracking-[0.08em]
            text-[#63755d]
          "
        >
          Active
        </span>
      </div>

      {/* LOCATION */}
      <div
        className="
          mt-[7px]
          font-mono
          text-[8px]
          leading-none
          text-[#969990]
        "
      >
        {warehouse.location}
        <span className="mx-[5px] text-[#c5c5bf]">
          ·
        </span>
        {warehouse.area}
      </div>

      {/* CAPACITY */}
      <div className="mt-[20px]">
        <div className="flex items-center justify-between">
          <span
            className="
              font-mono
              text-[8px]
              leading-none
              text-[#92958d]
            "
          >
            Capacity used
          </span>

          <span
            className="
              font-mono
              text-[8px]
              leading-none
              text-[#73766e]
            "
          >
            {warehouse.capacity}%
          </span>
        </div>

        <div
          className="
            mt-[8px]
            h-[6px]
            w-full
            overflow-hidden
            rounded-full
            bg-[#ebeae4]
          "
        >
          <div
            className="h-full rounded-full bg-[#91a985]"
            style={{
              width: `${warehouse.capacity}%`,
            }}
          />
        </div>
      </div>

      {/* BOTTOM STATS */}
      <div className="mt-[15px] grid grid-cols-2 gap-[9px]">
        <div
          className="
            h-[56px]
            rounded-[11px]
            bg-[#f1f0eb]
            px-[11px]
            py-[9px]
          "
        >
          <div
            className="
              font-serif
              text-[18px]
              leading-none
              text-[#242622]
            "
          >
            {warehouse.skus}
          </div>

          <div
            className="
              mt-[5px]
              font-mono
              text-[7px]
              uppercase
              leading-none
              tracking-[0.08em]
              text-[#999c94]
            "
          >
            SKUs
          </div>
        </div>

        <div
          className="
            h-[56px]
            rounded-[11px]
            bg-[#f1f0eb]
            px-[11px]
            py-[9px]
          "
        >
          <div
            className="
              font-serif
              text-[18px]
              leading-none
              text-[#242622]
            "
          >
            {warehouse.value}
          </div>

          <div
            className="
              mt-[5px]
              font-mono
              text-[7px]
              uppercase
              leading-none
              tracking-[0.08em]
              text-[#999c94]
            "
          >
            VALUE
          </div>
        </div>
      </div>
    </div>
  );
}