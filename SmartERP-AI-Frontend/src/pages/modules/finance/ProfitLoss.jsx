const ProfitLoss = () => {

    const rows = [
        {
            name: "Revenue from Operations",
            amount: "₹8,42,30,000"
        },
        {
            name: "Other Income",
            amount: "₹12,80,000"
        },
        {
            name: "Total Income",
            amount: "₹8,55,10,000",
            total: true
        },
        {
            name: "Cost of Goods Sold",
            amount: "₹5,18,40,000"
        },
        {
            name: "Employee Benefits",
            amount: "₹98,40,000"
        },
        {
            name: "Finance Costs",
            amount: "₹18,20,000"
        },
        {
            name: "Depreciation",
            amount: "₹22,10,000"
        },
        {
            name: "Other Expenses",
            amount: "₹84,60,000"
        },
        {
            name: "Total Expenses",
            amount: "₹6,41,70,000",
            total: true
        },
        {
            name: "Profit Before Tax",
            amount: "₹2,13,40,000",
            strong: true
        },
        {
            name: "Tax (25%)",
            amount: "₹53,35,000"
        },
        {
            name: "Net Profit",
            amount: "₹1,60,05,000",
            strong: true,
            final: true
        }
    ];


    return (
        <div className="
            grid
            grid-cols-1
            gap-5
            xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]
        ">

            {/* =================================================
                P&L STATEMENT
            ================================================== */}

            <div className="
                overflow-hidden
                rounded-[20px]
                border
                border-[#e3e0d9]
                bg-white
            ">

                {/* HEADER */}

                <div className="
                    flex
                    flex-col
                    gap-3
                    border-b
                    border-[#e3e0d9]
                    px-6
                    py-6
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <h2 className="
                        font-serif
                        text-[22px]
                        text-[#11130f]
                    ">
                        Profit &amp; Loss Statement
                    </h2>

                    <span className="
                        font-mono
                        text-[11px]
                        text-[#929999]
                    ">
                        FY 2026 (Apr – Aug)
                    </span>

                </div>


                {/* TABLE */}

                <div className="px-6 py-5">

                    {rows.map((row, index) => (

                        <div
                            key={row.name}
                            className={`
                                flex
                                min-h-[54px]
                                items-center
                                justify-between
                                gap-5
                                border-b
                                border-[#e7e4de]
                                px-0
                                py-3

                                ${
                                    row.total
                                        ? "rounded-lg bg-[#f5f4f0] px-4"
                                        : ""
                                }

                                ${
                                    row.strong
                                        ? "bg-[#f7f7f4] px-4"
                                        : ""
                                }

                                ${
                                    row.final
                                        ? "rounded-lg bg-[#f1f4ef] px-4"
                                        : ""
                                }

                                ${
                                    index === rows.length - 1
                                        ? "border-b-0"
                                        : ""
                                }
                            `}
                        >

                            <span className={`
                                font-mono
                                text-[13px]
                                ${
                                    row.strong
                                        ? "text-[#11130f]"
                                        : "text-[#7d8584]"
                                }
                            `}>
                                {row.name}
                            </span>


                            <span className={`
                                shrink-0
                                font-mono
                                text-[13px]
                                ${
                                    row.strong
                                        ? "text-[#11130f]"
                                        : "text-[#4f5958]"
                                }
                            `}>
                                {row.amount}
                            </span>

                        </div>

                    ))}

                </div>

            </div>


            {/* =================================================
                RIGHT SIDE
            ================================================== */}

            <div className="space-y-5">

                {/* AI INSIGHTS */}

                <div className="
                    rounded-[20px]
                    bg-[#11130f]
                    px-6
                    py-6
                    text-white
                ">

                    <p className="
                        font-mono
                        text-[11px]
                        tracking-[0.12em]
                        text-[#9caf8c]
                    ">
                        AI INSIGHTS
                    </p>


                    <ul className="
                        mt-5
                        space-y-5
                        font-mono
                        text-[12px]
                        leading-relaxed
                        text-[#aeb5ad]
                    ">

                        <li className="flex gap-3">
                            <span className="text-[#9caf8c]">●</span>

                            <span>
                                COGS at 61.5% of revenue — target is
                                58%. Investigate material wastage.
                            </span>
                        </li>


                        <li className="flex gap-3">
                            <span className="text-[#9caf8c]">●</span>

                            <span>
                                Receivables aging 28 days avg — follow
                                up with Hero MotoCorp on overdue INV.
                            </span>
                        </li>


                        <li className="flex gap-3">
                            <span className="text-[#9caf8c]">●</span>

                            <span>
                                Tax liability due Q3: ₹53.35L. Set up
                                advance tax payment schedule.
                            </span>
                        </li>

                    </ul>

                </div>


                {/* QUICK RATIOS */}

                <div className="
                    rounded-[20px]
                    border
                    border-[#e3e0d9]
                    bg-white
                    px-6
                    py-6
                ">

                    <p className="
                        font-mono
                        text-[11px]
                        tracking-[0.12em]
                        text-[#9ba2a2]
                    ">
                        QUICK RATIOS
                    </p>


                    <div className="mt-5">

                        <Ratio
                            name="Gross Margin"
                            value="38.5%"
                        />

                        <Ratio
                            name="Net Margin"
                            value="19.0%"
                        />

                        <Ratio
                            name="Current Ratio"
                            value="2.4x"
                        />

                        <Ratio
                            name="Debt-to-Equity"
                            value="0.38"
                            last
                        />

                    </div>

                </div>

            </div>

        </div>
    );
};


/* ================================================================
   RATIO
================================================================ */

const Ratio = ({
    name,
    value,
    last
}) => {

    return (
        <div className={`
            flex
            items-center
            justify-between
            py-4

            ${
                last
                    ? ""
                    : "border-b border-[#e5e2dc]"
            }
        `}>

            <span className="
                font-mono
                text-[12px]
                text-[#929999]
            ">
                {name}
            </span>

            <span className="
                font-serif
                text-[17px]
                text-[#11130f]
            ">
                {value}
            </span>

        </div>
    );
};


export default ProfitLoss;