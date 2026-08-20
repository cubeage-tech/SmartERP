import React from "react";

const departments = [
    ["Management", "6 staff", "₹18,40,000", "AVG: ₹3,06,666"],
    ["Finance", "18 staff", "₹14,80,000", "AVG: ₹82,222"],
    ["Sales", "34 staff", "₹22,60,000", "AVG: ₹66,470"],
    ["Operations", "82 staff", "₹28,80,000", "AVG: ₹35,121"],
    ["HR", "12 staff", "₹8,40,000", "AVG: ₹70,000"],
    ["IT", "9 staff", "₹5,40,000", "AVG: ₹60,000"],
];

export default function Payroll() {
    return (
        <div className="w-full">

            {/* PAYROLL SUMMARY */}

            <section className="
                mb-5
                flex
                flex-col
                gap-5
                rounded-[20px]
                bg-[#11130f]
                px-6
                py-7
                text-white
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">

                <div>

                    <p className="
                        font-mono
                        text-[9px]
                        uppercase
                        tracking-[0.12em]
                        text-[#8e9791]
                    ">
                        CURRENT PAYROLL
                    </p>

                    <h2 className="
                        mt-2
                        font-serif
                        text-[25px]
                    ">
                        August 2026 Payroll
                    </h2>

                    <p className="
                        mt-2
                        font-mono
                        text-[10px]
                        text-[#92998f]
                    ">
                        284 employees · Total: ₹98,40,000 · Due: 31 Aug 2026
                    </p>

                </div>


                <button
                    type="button"
                    className="
                        shrink-0
                        rounded-[14px]
                        bg-[#a5bb98]
                        px-5
                        py-3
                        font-mono
                        text-[10px]
                        text-[#172016]
                        transition-all
                        duration-200
                        hover:-translate-y-[1px]
                        hover:bg-[#b5c9a9]
                    "
                >
                    Process Payroll →
                </button>

            </section>


            {/* DEPARTMENT PAYROLL */}

            <section className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
                xl:grid-cols-3
            ">

                {departments.map(
                    ([name, staff, total, average]) => (

                        <div
                            key={name}
                            className="
                                group
                                rounded-[20px]
                                border
                                border-[#e3e0d9]
                                bg-white
                                px-5
                                py-6
                                transition-all
                                duration-200
                                hover:-translate-y-[2px]
                                hover:border-[#d2cfc7]
                                hover:bg-[#f1f1ec]
                                hover:shadow-[0_6px_18px_rgba(0,0,0,0.05)]
                            "
                        >

                            <div className="
                                flex
                                items-start
                                justify-between
                            ">

                                <h3 className="
                                    font-serif
                                    text-[19px]
                                    text-[#171916]
                                ">
                                    {name}
                                </h3>

                                <span className="
                                    font-mono
                                    text-[9px]
                                    text-[#a1a6ae]
                                ">
                                    {staff}
                                </span>

                            </div>

                            <div className="
                                mt-5
                                font-serif
                                text-[26px]
                                text-[#11130f]
                            ">
                                {total}
                            </div>

                            <p className="
                                mt-1
                                font-mono
                                text-[9px]
                                uppercase
                                tracking-[0.12em]
                                text-[#a1a6ae]
                            ">
                                {average}
                            </p>

                        </div>

                    )
                )}

            </section>

        </div>
    );
}