import React from "react";

const employees = [
    ["AM", "Arjun Mehta", "Managing Director", 5, "ON TRACK"],
    ["RS", "Rahul Sharma", "Finance Manager", 4, "ON TRACK"],
    ["AS", "Ananya Singh", "Sales Manager", 5, "ON TRACK"],
    ["DR", "Deepika Rao", "HR Manager", 4, "AT RISK"],
    ["VJ", "Vikram Joshi", "Ops Manager", 5, "AT RISK"],
];

const scores = [
    ["Finance", "4.6", "92%"],
    ["Sales", "4.2", "84%"],
    ["Operations", "3.9", "78%"],
    ["HR", "4.5", "90%"],
    ["IT", "4.1", "82%"],
];

function RatingDots({ rating }) {
    return (
        <div className="flex gap-1">

            {[1, 2, 3, 4, 5].map((dot) => (

                <span
                    key={dot}
                    className={`
                        h-3
                        w-3
                        rounded-[4px]
                        ${
                            dot <= rating
                                ? "bg-[#9caf8d]"
                                : "bg-[#e7e6df]"
                        }
                    `}
                />

            ))}

        </div>
    );
}

export default function PerformanceTracking() {
    return (
        <div className="
            grid
            grid-cols-1
            gap-5
            xl:grid-cols-2
        ">

            {/* REVIEWS */}

            <section className="
                rounded-[20px]
                border
                border-[#e3e0d9]
                bg-white
                p-6
            ">

                <h2 className="
                    font-serif
                    text-[21px]
                    text-[#11130f]
                ">
                    Q2 2026 Reviews
                </h2>

                <p className="
                    mt-1
                    font-mono
                    text-[10px]
                    text-[#969e9a]
                ">
                    Employee performance reviews
                </p>


                <div className="mt-5">

                    {employees.map(
                        (
                            [
                                initials,
                                name,
                                designation,
                                rating,
                                status,
                            ],
                            index
                        ) => (

                            <div
                                key={name}
                                className={`
                                    group
                                    flex
                                    items-center
                                    gap-4
                                    py-4
                                    transition-all
                                    duration-200
                                    hover:bg-[#f1f1ec]
                                    ${
                                        index !== employees.length - 1
                                            ? "border-b border-[#e8e6df]"
                                            : ""
                                    }
                                `}
                            >

                                <div className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#f0f2ed]
                                    text-[9px]
                                    text-[#667061]
                                ">
                                    {initials}
                                </div>


                                <div className="min-w-0 flex-1">

                                    <p className="
                                        truncate
                                        text-[13px]
                                        text-[#171916]
                                    ">
                                        {name}
                                    </p>

                                    <p className="
                                        mt-1
                                        truncate
                                        font-mono
                                        text-[9px]
                                        text-[#a0a39e]
                                    ">
                                        {designation}
                                    </p>

                                </div>


                                <RatingDots rating={rating} />


                                <span
                                    className={`
                                        hidden
                                        rounded-[10px]
                                        px-3
                                        py-1.5
                                        font-mono
                                        text-[8px]
                                        tracking-[0.08em]
                                        sm:inline-flex

                                        ${
                                            status === "ON TRACK"
                                                ? "bg-[#e3ebdf] text-[#53624f]"
                                                : "bg-[#eee9dc] text-[#806f4d]"
                                        }
                                    `}
                                >
                                    {status}
                                </span>

                            </div>

                        )
                    )}

                </div>

            </section>


            {/* DEPARTMENT SCORES */}

            <section className="
                rounded-[20px]
                border
                border-[#e3e0d9]
                bg-white
                p-6
            ">

                <h2 className="
                    font-serif
                    text-[21px]
                    text-[#11130f]
                ">
                    Department Scores
                </h2>

                <p className="
                    mt-1
                    font-mono
                    text-[10px]
                    text-[#969e9a]
                ">
                    Average performance by department
                </p>


                <div className="mt-7 space-y-6">

                    {scores.map(
                        ([department, score, percentage]) => (

                            <div
                                key={department}
                                className="flex items-center gap-4"
                            >

                                <div className="
                                    w-[90px]
                                    shrink-0
                                    font-mono
                                    text-[10px]
                                    text-[#92968f]
                                ">
                                    {department}
                                </div>


                                <div className="
                                    h-[9px]
                                    flex-1
                                    overflow-hidden
                                    rounded-full
                                    bg-[#efeee9]
                                ">

                                    <div
                                        className="
                                            h-full
                                            rounded-full
                                            bg-[#9caf8d]
                                        "
                                        style={{
                                            width: percentage,
                                        }}
                                    />

                                </div>


                                <div className="
                                    w-8
                                    text-right
                                    font-serif
                                    text-[16px]
                                    text-[#171916]
                                ">
                                    {score}
                                </div>

                            </div>

                        )
                    )}

                </div>

            </section>

        </div>
    );
}