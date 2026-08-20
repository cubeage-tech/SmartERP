const CashFlow = () => {

    const months = [
        {
            month: "MAR",
            operating: 72,
            investing: 30,
            financing: 12
        },
        {
            month: "APR",
            operating: 84,
            investing: 22,
            financing: 18
        },
        {
            month: "MAY",
            operating: 61,
            investing: 36,
            financing: 12
        },
        {
            month: "JUN",
            operating: 98,
            investing: 18,
            financing: 24
        },
        {
            month: "JUL",
            operating: 91,
            investing: 41,
            financing: 20
        },
        {
            month: "AUG",
            operating: 52,
            investing: 12,
            financing: 10
        }
    ];


    const maxValue = 100;


    return (
        <div className="
            rounded-[20px]
            border
            border-[#e3e0d9]
            bg-white
            px-6
            py-7
        ">

            {/* =================================================
                HEADER
            ================================================== */}

            <div className="
                flex
                flex-col
                gap-5
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">

                <h2 className="
                    font-serif
                    text-[22px]
                    text-[#11130f]
                ">
                    Cash Flow Statement
                </h2>


                {/* LEGEND */}

                <div className="
                    flex
                    flex-wrap
                    items-center
                    gap-5
                ">

                    <Legend
                        label="Operating"
                        className="bg-[#9caf8c]"
                    />

                    <Legend
                        label="Investing"
                        className="bg-[#aaa7ba]"
                    />

                    <Legend
                        label="Financing"
                        className="bg-[#b0a176]"
                    />

                </div>

            </div>


            {/* =================================================
                CHART
            ================================================== */}

            <div className="
                mt-10
                h-[310px]
                border-b
                border-[#e4e1db]
                px-1
            ">

                <div className="
                    flex
                    h-full
                    items-end
                    justify-between
                    gap-3
                    overflow-x-auto
                ">

                    {months.map((item) => (

                        <div
                            key={item.month}
                            className="
                                flex
                                min-w-[90px]
                                flex-1
                                flex-col
                                items-center
                                justify-end
                            "
                        >

                            {/* BARS */}

                            <div className="
                                flex
                                h-[255px]
                                w-full
                                items-end
                                justify-center
                                gap-[3px]
                            ">

                                {/* OPERATING */}

                                <div
                                    title={`Operating: ${item.operating}`}
                                    className="
                                        w-[28%]
                                        rounded-t-[5px]
                                        bg-[#9caf8c]
                                    "
                                    style={{
                                        height: `${(item.operating / maxValue) * 100}%`
                                    }}
                                />


                                {/* INVESTING */}

                                <div
                                    title={`Investing: ${item.investing}`}
                                    className="
                                        w-[28%]
                                        rounded-t-[5px]
                                        bg-[#aaa7ba]
                                    "
                                    style={{
                                        height: `${(item.investing / maxValue) * 100}%`
                                    }}
                                />


                                {/* FINANCING */}

                                <div
                                    title={`Financing: ${item.financing}`}
                                    className="
                                        w-[28%]
                                        rounded-t-[5px]
                                        bg-[#b0a176]
                                    "
                                    style={{
                                        height: `${(item.financing / maxValue) * 100}%`
                                    }}
                                />

                            </div>


                            {/* MONTH */}

                            <div className="
                                mt-3
                                font-mono
                                text-[10px]
                                text-[#a2a7a5]
                            ">
                                {item.month}
                            </div>

                        </div>

                    ))}

                </div>

            </div>


            {/* =================================================
                SUMMARY
            ================================================== */}

            <div className="
                grid
                grid-cols-1
                divide-y
                divide-[#e4e1db]
                pt-6
                sm:grid-cols-3
                sm:divide-x
                sm:divide-y-0
            ">

                <CashFlowSummary
                    value="+₹1.81 Cr"
                    label="OPERATING CASH FLOW"
                />

                <CashFlowSummary
                    value="-₹62 L"
                    label="INVESTING CASH FLOW"
                />

                <CashFlowSummary
                    value="-₹30 L"
                    label="FINANCING CASH FLOW"
                />

            </div>

        </div>
    );
};


/* ================================================================
   LEGEND
================================================================ */

const Legend = ({
    label,
    className
}) => {

    return (
        <div className="
            flex
            items-center
            gap-2
        ">

            <span className={`
                h-4
                w-4
                rounded-[5px]
                ${className}
            `} />

            <span className="
                font-mono
                text-[11px]
                text-[#929999]
            ">
                {label}
            </span>

        </div>
    );
};


/* ================================================================
   SUMMARY
================================================================ */

const CashFlowSummary = ({
    value,
    label
}) => {

    return (
        <div className="
            px-5
            py-4
            text-center
        ">

            <div className="
                font-serif
                text-[22px]
                text-[#9b8050]
            ">
                {value}
            </div>

            <div className="
                mt-2
                font-mono
                text-[10px]
                tracking-[0.12em]
                text-[#a0a6a5]
            ">
                {label}
            </div>

        </div>
    );
};


export default CashFlow;