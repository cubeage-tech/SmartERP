import React, { useEffect, useState } from "react";
import hrApi from "./hrApiClient";

export default function Attendance() {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        hrApi.getAttendance()
            .then((res) => {
                setAttendanceRecords(Array.isArray(res.data) ? res.data : []);
                setError(null);
            })
            .catch((err) => {
                console.error("Failed to load attendance records:", err);
                setError(err.message || "Failed to load attendance records");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const rows = attendanceRecords.map((item) => [
        item.date || item.formattedDate || (item.attendanceDate ? String(item.attendanceDate) : "—"),
        item.checkIn || "-",
        item.checkOut || "-",
        item.hours || "—",
        item.status || "PRESENT",
    ]);

    return (
        <div className="w-full">

            <section className="
                overflow-hidden
                rounded-[20px]
                border
                border-[#e3e0d9]
                bg-white
            ">

                <div className="px-6 py-6">

                    <h2 className="
                        font-serif
                        text-[22px]
                        text-[#11130f]
                    ">
                        Attendance Log
                    </h2>

                    <p className="
                        mt-1
                        font-mono
                        text-[10px]
                        text-[#969e9a]
                    ">
                        Employee attendance and working hours
                    </p>

                </div>


                <div className="overflow-x-auto">

                    <div className="min-w-[800px]">

                        <div className="
                            grid
                            grid-cols-[24%_19%_19%_19%_19%]
                            border-y
                            border-[#e5e3dc]
                            bg-[#faf9f6]
                            px-6
                            py-4
                            font-mono
                            text-[9px]
                            uppercase
                            tracking-[0.13em]
                            text-[#a0a39e]
                        ">

                            <div>DATE</div>
                            <div>CHECK IN</div>
                            <div>CHECK OUT</div>
                            <div>HOURS</div>
                            <div>STATUS</div>

                        </div>

                        {/* LOADING STATE */}
                        {loading && (
                            <div className="px-6 py-12 text-center font-mono text-[11px] text-[#969e9a]">
                                Loading attendance log from API...
                            </div>
                        )}

                        {/* ERROR STATE */}
                        {!loading && error && (
                            <div className="px-6 py-12 text-center font-mono text-[11px] text-[#8a635b]">
                                Error loading attendance: {error}
                            </div>
                        )}

                        {/* EMPTY STATE */}
                        {!loading && !error && rows.length === 0 && (
                            <div className="px-6 py-12 text-center font-mono text-[11px] text-[#969e9a]">
                                No attendance records found in database.
                            </div>
                        )}

                        {/* ROWS */}
                        {!loading && !error && rows.map((row, idx) => (

                            <div
                                key={idx}
                                className="
                                    group
                                    grid
                                    grid-cols-[24%_19%_19%_19%_19%]
                                    items-center
                                    border-b
                                    border-[#e8e6df]
                                    px-6
                                    py-5
                                    last:border-b-0
                                    transition-all
                                    duration-200
                                    hover:bg-[#f1f1ec]
                                "
                            >

                                <div className="
                                    text-[12px]
                                    font-medium
                                    text-[#171916]
                                ">
                                    {row[0]}
                                </div>

                                <div className="
                                    text-[12px]
                                    text-[#69736c]
                                ">
                                    {row[1]}
                                </div>

                                <div className="
                                    text-[12px]
                                    text-[#69736c]
                                ">
                                    {row[2]}
                                </div>

                                <div className="
                                    font-serif
                                    text-[16px]
                                    text-[#171916]
                                ">
                                    {row[3]}
                                </div>

                                <div>

                                    <span
                                        className={`
                                            inline-flex
                                            rounded-[10px]
                                            px-3
                                            py-1.5
                                            text-[8px]
                                            tracking-[0.08em]

                                            ${
                                                row[4] === "PRESENT"
                                                    ? "bg-[#e3ebdf] text-[#53624f]"
                                                    : "bg-[#eee2df] text-[#8a635b]"
                                            }
                                        `}
                                    >
                                        {row[4]}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

        </div>
    );
}