import { useState } from "react";
import {
    Bot,
    ShoppingCart,
    CheckCircle2,
} from "lucide-react";

const ReplenishmentSection = () => {
    const [createdOrders, setCreatedOrders] = useState([]);

    const recommendations = [
        {
            id: "SKU-1041",
            name: "Zinc Ingot",
            status: "LOW STOCK",
            current: "120 kg",
            minimum: "150 kg",
            suggested: "450 kg",
            supplier: "Tata Steel Ltd",
        },
        {
            id: "SKU-1040",
            name: "M8 Hex Bolts (Box/200)",
            status: "OUT OF STOCK",
            current: "0 box",
            minimum: "50 box",
            suggested: "150 box",
            supplier: "Tata Steel Ltd",
        },
        {
            id: "SKU-1038",
            name: "Hydraulic Oil 15W40",
            status: "LOW STOCK",
            current: "28 litre",
            minimum: "40 litre",
            suggested: "120 litre",
            supplier: "Tata Steel Ltd",
        },
    ];

    const handleCreatePO = (item) => {
        setCreatedOrders((previous) => {
            if (previous.includes(item.id)) {
                return previous;
            }

            return [...previous, item.id];
        });
    };

    return (
        <section className="w-full">

            {/* =====================================================
                AI REORDER HEADER
            ====================================================== */}

            <div
                className="
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    bg-[#151815]
                    px-5
                    py-5
                "
            >

                {/* AI ICON */}

                <div
                    className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#30352d]
                        text-[#d8e4d2]
                    "
                >
                    <Bot size={19} strokeWidth={1.7} />
                </div>


                {/* TEXT */}

                <div className="min-w-0">

                    <h2
                        className="
                            font-serif
                            text-[17px]
                            leading-none
                            text-white
                        "
                    >
                        AI Reorder Recommendations
                    </h2>

                    <p
                        className="
                            mt-2
                            font-mono
                            text-[9px]
                            tracking-[0.02em]
                            text-[#9ca198]
                        "
                    >
                        Based on consumption trends and lead times, 3 items
                        need immediate attention.
                    </p>

                </div>

            </div>


            {/* =====================================================
                RECOMMENDATION LIST
            ====================================================== */}

            <div className="mt-3 space-y-3">

                {recommendations.map((item) => {

                    const orderCreated = createdOrders.includes(item.id);

                    return (
                        <div
                            key={item.id}
                            className="
                                rounded-2xl
                                border
                                border-[#e2e0d8]
                                bg-[#fbfaf7]
                                px-4
                                py-4
                                transition
                                hover:border-[#d4d1c8]
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-4
                                    lg:flex-row
                                    lg:items-center
                                    lg:justify-between
                                "
                            >

                                {/* =================================================
                                    LEFT SIDE
                                ================================================== */}

                                <div
                                    className="
                                        flex
                                        min-w-0
                                        items-start
                                        gap-4
                                    "
                                >

                                    {/* STATUS */}

                                    <div className="shrink-0 pt-1">

                                        <span
                                            className={`
                                                inline-flex
                                                rounded-md
                                                px-2
                                                py-1
                                                font-mono
                                                text-[8px]
                                                tracking-[0.08em]
                                                ${
                                                    item.status ===
                                                    "OUT OF STOCK"
                                                        ? "bg-[#f0e6e3] text-[#8c6257]"
                                                        : "bg-[#eeece4] text-[#817456]"
                                                }
                                            `}
                                        >
                                            {item.status}
                                        </span>

                                    </div>


                                    {/* ITEM DETAILS */}

                                    <div className="min-w-0">

                                        <h3
                                            className="
                                                font-serif
                                                text-[16px]
                                                leading-tight
                                                text-[#20221f]
                                            "
                                        >
                                            {item.name}
                                        </h3>


                                        <p
                                            className="
                                                mt-1
                                                font-mono
                                                text-[8px]
                                                text-[#9a9d95]
                                            "
                                        >
                                            {item.id}
                                            {" "}
                                            ·
                                            {" "}
                                            Current: {item.current}
                                            {" "}
                                            ·
                                            {" "}
                                            Min: {item.minimum}
                                        </p>

                                    </div>

                                </div>


                                {/* =================================================
                                    RIGHT SIDE
                                ================================================== */}

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-3
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-end
                                    "
                                >

                                    {/* SUGGESTION */}

                                    <div
                                        className="
                                            min-w-[130px]
                                            text-left
                                            sm:text-right
                                        "
                                    >

                                        <p
                                            className="
                                                font-mono
                                                text-[9px]
                                                font-medium
                                                text-[#20221f]
                                            "
                                        >
                                            Suggest: {item.suggested}
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                font-mono
                                                text-[8px]
                                                text-[#9a9d95]
                                            "
                                        >
                                            From: {item.supplier}
                                        </p>

                                    </div>


                                    {/* CREATE PO */}

                                    <button
                                        type="button"
                                        disabled={orderCreated}
                                        onClick={() =>
                                            handleCreatePO(item)
                                        }
                                        className={`
                                            flex
                                            h-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            px-4
                                            font-mono
                                            text-[9px]
                                            transition
                                            ${
                                                orderCreated
                                                    ? "cursor-default bg-[#e5e9e2] text-[#697064]"
                                                    : "bg-[#151815] text-white hover:bg-[#292d28]"
                                            }
                                        `}
                                    >

                                        {orderCreated ? (
                                            <>
                                                <CheckCircle2 size={13} />
                                                PO CREATED
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart size={13} />
                                                Create PO →
                                            </>
                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>
                    );
                })}

            </div>


            {/* =====================================================
                FOOTER
            ====================================================== */}

            <div
                className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-[#e2e0d8]
                    bg-[#f7f6f1]
                    px-4
                    py-3
                "
            >

                <p
                    className="
                        font-mono
                        text-[8px]
                        text-[#999c94]
                    "
                >
                    {createdOrders.length} of {recommendations.length} purchase
                    orders created
                </p>


                {createdOrders.length > 0 && (
                    <p
                        className="
                            flex
                            items-center
                            gap-1.5
                            font-mono
                            text-[8px]
                            text-[#697064]
                        "
                    >
                        <CheckCircle2 size={12} />
                        Purchase order ready
                    </p>
                )}

            </div>

        </section>
    );
};

export default ReplenishmentSection;