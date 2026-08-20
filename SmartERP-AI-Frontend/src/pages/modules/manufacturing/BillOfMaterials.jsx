import React, { useState } from "react";

const bomData = [
  {
    id: "BOM-042",
    product: "Steel Frame Assembly A",
    version: "v2.1",
    components: 8,
    cost: "₹4,240",
    updated: "12 Jul 2026",
  },
  {
    id: "BOM-041",
    product: "Bracket Kit M8",
    version: "v1.3",
    components: 3,
    cost: "₹420",
    updated: "05 Jun 2026",
  },
  {
    id: "BOM-039",
    product: "Drive Shaft Assembly",
    version: "v3.0",
    components: 12,
    cost: "₹8,800",
    updated: "20 Jul 2026",
  },
  {
    id: "BOM-038",
    product: "Zinc Cast Housing B",
    version: "v1.0",
    components: 5,
    cost: "₹1,850",
    updated: "01 Aug 2026",
  },
];

const BillOfMaterials = () => {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <main className="bg-[#f7f6f2] px-4 py-4 text-[#171815] sm:px-6 sm:py-[18px] lg:px-[30px]">
      {/* BOM Container */}
      <section className="overflow-hidden rounded-[18px] border border-[#e4e2dd] bg-white sm:rounded-[20px]">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-[#e4e2dd] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-[19px]">
          <h1 className="font-serif text-[19px] leading-none tracking-[-0.015em] text-[#171815] sm:text-[20px]">
            Bill of Materials
          </h1>

          <button
            type="button"
            className="w-full rounded-[15px] bg-[#151714] px-[18px] py-[11px] font-mono text-[11px] leading-none text-white transition-all duration-200 hover:bg-[#292b27] hover:shadow-sm sm:w-auto"
          >
            + New BOM
          </button>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Table Header */}
            <div className="grid grid-cols-[120px_320px_91px_111px_101px_1fr] border-b border-[#e4e2dd] bg-[#f5f4f0] px-6 py-[8px]">
              <div className="font-mono text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                BOM #
              </div>

              <div className="font-mono text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                PRODUCT
              </div>

              <div className="font-mono text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                VERSION
              </div>

              <div className="font-mono text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                COMPONENTS
              </div>

              <div className="font-mono text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                UNIT COST
              </div>

              <div className="font-mono text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]">
                LAST UPDATED
              </div>
            </div>

            {/* Rows */}
            <div>
              {bomData.map((bom, index) => {
                const isHovered = hoveredRow === index;

                return (
                  <div
                    key={bom.id}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`
                      group relative grid
                      grid-cols-[120px_320px_111px_101px_95px_1fr]
                      items-center
                      px-6
                      py-[16px]
                      transition-colors
                      duration-200
                      ${
                        index !== bomData.length - 1
                          ? "border-b border-[#e4e2dd]"
                          : ""
                      }
                      ${isHovered ? "bg-[#f7f6f2]" : "bg-white"}
                    `}
                  >
                    {/* BOM ID */}
                    <div className="font-mono text-[11px] leading-none text-[#999a94]">
                      {bom.id}
                    </div>

                    {/* Product */}
                    <div className="font-serif text-[18px] leading-none tracking-[-0.015em] text-[#171815]">
                      {bom.product}
                    </div>

                    {/* Version */}
                    <div>
                      <span className="inline-flex rounded-[10px] bg-[#f0eff3] px-[11px] py-[6px] font-mono text-[10px] leading-none tracking-[0.04em] text-[#59576d]">
                        {bom.version}
                      </span>
                    </div>

                    {/* Components */}
                    <div className="font-mono text-[12px] leading-none text-[#171815]">
                      {bom.components}
                    </div>

                    {/* Cost */}
                    <div className="font-mono text-[12px] leading-none text-[#171815]">
                      {bom.cost}
                    </div>

                    {/* Updated + Explode */}
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[11px] leading-none text-[#999a94]">
                        {bom.updated}
                      </span>

                      <button
                        type="button"
                        className={`
                          ml-24
                          shrink-0
                          rounded-[10px]
                          border
                          border-[#e2e0da]
                          px-[11px]
                          py-[7px]
                          font-mono
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
                        Explode →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BillOfMaterials;