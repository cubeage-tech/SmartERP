import React, { useState, useEffect } from "react";
import hrApi from "./hrApiClient";

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
                            dot <= (rating || 0)
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
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        hrApi.getPerformance()
            .then((res) => {
                setPerformanceData(res.data);
                setError(null);
            })
            .catch((err) => {
                console.error("Failed to load performance metrics:", err);
                setError(err.message || "Failed to load performance metrics");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const reviews = performanceData?.reviews || [];
    const scores = performanceData?.departmentScores || [];
    const reviewPeriod = performanceData?.reviewPeriod || "Q2 2026 Reviews";
    const description = performanceData?.description || "Employee performance reviews";

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
                    {loading ? "Loading Reviews..." : reviewPeriod}
                </h2>

                <p className="
                    mt-1
                    font-mono
                    text-[10px]
                    text-[#969e9a]
                ">
                    {loading ? "Fetching employee performance ratings..." : description}
                </p>

                {loading && (
                    <div className="py-12 text-center font-mono text-[11px] text-[#969e9a]">
                        Loading performance reviews from API...
                    </div>
                )}

                {!loading && error && (
                    <div className="py-12 text-center font-mono text-[11px] text-[#8a635b]">
                        Error loading reviews: {error}
                    </div>
                )}

                {!loading && !error && reviews.length === 0 && (
                    <div className="py-12 text-center font-mono text-[11px] text-[#969e9a]">
                        No performance reviews found in database.
                    </div>
                )}

                {!loading && !error && reviews.length > 0 && (
                    <div className="mt-5">

                        {reviews.map((review, index) => {
                            const initials = review.initials || (Array.isArray(review) ? review[0] : "EM");
                            const name = review.name || review.employeeName || (Array.isArray(review) ? review[1] : "—");
                            const designation = review.designation || (Array.isArray(review) ? review[2] : "—");
                            const rating = review.rating != null ? review.rating : (Array.isArray(review) ? review[3] : 5);
                            const status = review.status || (Array.isArray(review) ? review[4] : "ON TRACK");

                            return (
                                <div
                                    key={name || index}
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
                                            index !== reviews.length - 1
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
                            );
                        })}

                    </div>
                )}

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

                {loading && (
                    <div className="py-12 text-center font-mono text-[11px] text-[#969e9a]">
                        Loading department performance scores...
                    </div>
                )}

                {!loading && !error && scores.length === 0 && (
                    <div className="py-12 text-center font-mono text-[11px] text-[#969e9a]">
                        No department score metrics found.
                    </div>
                )}

                {!loading && scores.length > 0 && (
                    <div className="mt-7 space-y-6">

                        {scores.map((scoreItem, index) => {
                            const department = scoreItem.department || (Array.isArray(scoreItem) ? scoreItem[0] : "Department");
                            const score = scoreItem.score || (Array.isArray(scoreItem) ? scoreItem[1] : "0.0");
                            const percentage = scoreItem.percentage || (Array.isArray(scoreItem) ? scoreItem[2] : "0%");

                            return (
                                <div
                                    key={department || index}
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
                            );
                        })}

                    </div>
                )}

            </section>

        </div>
    );
}