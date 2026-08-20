import React, { useState } from "react";

const vendors = [
  {
    id: "V-0042",
    vendor: "Tata Steel Ltd",
    contact: "Ramesh Iyer",
    city: "Mumbai",
    category: "Raw Materials",
    creditLimit: "₹50L",
    rating: "4.8",
    status: "ACTIVE",
  },
  {
    id: "V-0041",
    vendor: "Hindustan Zinc",
    contact: "Pradeep Mehta",
    city: "Udaipur",
    category: "Raw Materials",
    creditLimit: "₹30L",
    rating: "4.5",
    status: "ACTIVE",
  },
  {
    id: "V-0040",
    vendor: "Sigma Components",
    contact: "Anil Kumar",
    city: "Pune",
    category: "Components",
    creditLimit: "₹15L",
    rating: "4.2",
    status: "ACTIVE",
  },
  {
    id: "V-0039",
    vendor: "Brindavan Fasteners",
    contact: "Suresh Nair",
    city: "Coimbatore",
    category: "Hardware",
    creditLimit: "₹8L",
    rating: "3.9",
    status: "ACTIVE",
  },
  {
    id: "V-0038",
    vendor: "Anand Packaging",
    contact: "Kavita Sharma",
    city: "Delhi",
    category: "Packaging",
    creditLimit: "₹12L",
    rating: "3.6",
    status: "INACTIVE",
  },
];

const headers = [
  "ID",
  "VENDOR",
  "CONTACT",
  "CITY",
  "CATEGORY",
  "CREDIT LIMIT",
  "RATING",
  "STATUS",
];

/* Same column sizing approach as Purchase Orders */
const gridColumns =
  "grid-cols-[140px_200px_140px_140px_160px_125px_150px_1fr]";

function Rating({ value }) {
  const filled = Math.round(Number(value));

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-[2px]">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-[11px] leading-none ${
              star <= filled ? "text-[#b2a477]" : "text-[#e4e2dc]"
            }`}
          >
            ●
          </span>
        ))}
      </div>

      <span className="text-[11px] leading-none text-[#999a94]">
        {value}
      </span>
    </div>
  );
}

function VendorRow({
  vendor,
  index,
  hoveredRow,
  setHoveredRow,
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
      {/* ID */}
      <div className="py-1 font-mono text-xs text-gray-400">
        {vendor.id}
      </div>

      {/* Vendor */}
      <div className="py-1 text-sm font-semibold text-gray-800">
        {vendor.vendor}
      </div>

      {/* Contact */}
      <div className="py-1 text-sm text-gray-500">
        {vendor.contact}
      </div>

      {/* City */}
      <div className="py-1 text-sm text-gray-500">
        {vendor.city}
      </div>

      {/* Category */}
      <div className="py-1">
        <span className="inline-flex rounded-[10px] border border-[#e4e2dd] bg-[#f5f4f0] px-[10px] py-[6px] text-[10px] leading-none text-[#777871]">
          {vendor.category}
        </span>
      </div>

      {/* Credit Limit */}
      <div className="py-1 text-sm text-gray-800">
        {vendor.creditLimit}
      </div>

      {/* Rating */}
      <div className="py-1">
        <Rating value={vendor.rating} />
      </div>

      {/* Status */}
      <div className="py-1">
        <span
          className={`inline-flex rounded-[10px] px-[11px] py-[7px] text-[10px] font-semibold leading-none tracking-[0.06em] ${
            vendor.status === "ACTIVE"
              ? "bg-[#dfe9db] text-[#50614b]"
              : "bg-[#e7e5df] text-[#77766f]"
          }`}
        >
          {vendor.status}
        </span>
      </div>
    </div>
  );
}

const Vendors = () => {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <main className="bg-[#f7f6f2] px-4 py-4 text-[#171815] sm:px-6 sm:py-[18px] lg:px-[30px]">
      <section className="overflow-hidden rounded-[18px] border border-[#e4e2dd] bg-white sm:rounded-[20px]">

        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-[#e4e2dd] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-[19px]">
          <h1 className="font-serif text-[19px] leading-none tracking-[-0.015em] text-[#171815] sm:text-[20px]">
            Vendor Directory
          </h1>

          <button
            type="button"
            className="w-full rounded-[15px] bg-[#151714] px-[18px] py-[11px] text-[11px] font-semibold leading-none text-white transition-all duration-200 hover:bg-[#292b27] hover:shadow-sm sm:w-auto"
          >
            + Add Vendor
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
              {headers.map((header) => (
                <div
                  key={header}
                  className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]"
                >
                  {header}
                </div>
              ))}
            </div>

            {/* Rows */}
            <div>
              {vendors.map((vendor, index) => (
                <VendorRow
                  key={vendor.id}
                  vendor={vendor}
                  index={index}
                  hoveredRow={hoveredRow}
                  setHoveredRow={setHoveredRow}
                />
              ))}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default Vendors;