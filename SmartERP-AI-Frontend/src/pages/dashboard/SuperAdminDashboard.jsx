import React, { useEffect, useMemo, useState } from "react";
import RoleDashboardService from "../../core/services/modules/roleDashboard.service";

const SuperAdminDashboard = () => {
    const [period, setPeriod] = useState("6M");
    const [hoverIndex, setHoverIndex] = useState(null);
    const [animationStarted, setAnimationStarted] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationStarted(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setError("");

                const response =
                    await RoleDashboardService.getSuperAdminDashboard();

                setDashboardData(response.data);
            } catch (requestError) {
                console.error(
                    "Unable to load Super Admin dashboard:",
                    requestError
                );

                setError(
                    requestError?.response?.data?.message ||
                    "Unable to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    /* =========================================================
       KPI DATA
    ========================================================= */

const formatAmount = (amount, currency = "INR") => {
    const value = Number(amount || 0);

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(value);
};

const revenueByCurrency =
    dashboardData?.currentMonthRevenueByCurrency || {};

const totalRevenueByCurrency =
    dashboardData?.totalSubscriptionRevenueByCurrency || {};

const primaryCurrency =
    Object.keys(revenueByCurrency)[0] ||
    Object.keys(totalRevenueByCurrency)[0] ||
    "INR";

const kpis = dashboardData
    ? [
        {
            label: "TOTAL TENANTS",
            value: Number(
                dashboardData.totalTenants || 0
            ).toLocaleString("en-IN"),
            change: `${dashboardData.activeTenants || 0} active`,
            positive: true,
        },
        {
            label: "TRIAL TENANTS",
            value: Number(
                dashboardData.trialTenants || 0
            ).toLocaleString("en-IN"),
            change: `${dashboardData.suspendedTenants || 0} suspended`,
            positive: dashboardData.suspendedTenants === 0,
        },
        {
            label: "ACTIVE USERS",
            value: Number(
                dashboardData.activeUsers || 0
            ).toLocaleString("en-IN"),
            change: "Across all tenants",
            positive: true,
        },
        {
            label: "ACTIVE SUBSCRIPTIONS",
            value: Number(
                dashboardData.activeSubscriptions || 0
            ).toLocaleString("en-IN"),
            change: "Currently valid",
            positive: true,
        },
        {
            label: "REVENUE THIS MONTH",
            value: formatAmount(
                revenueByCurrency[primaryCurrency],
                primaryCurrency
            ),
            change: primaryCurrency,
            positive: true,
        },
        {
            label: "ENABLED MODULES",
            value: Number(
                dashboardData.enabledModules || 0
            ).toLocaleString("en-IN"),
            change: "Tenant module assignments",
            positive: true,
        },
    ]
    : [];

    /* =========================================================
       REVENUE DATA
    ========================================================= */

    const revenueData = {
        "3M": [
            39.1,
            40.2,
            41.0,
            40.4,
            39.8,
            41.3,
            43.2,
            44.5,
            46.1,
            47.3,
            48.6,
        ],

        "6M": [
            37.8,
            38.6,
            39.1,
            38.9,
            38.3,
            39.0,
            40.5,
            42.0,
            43.0,
            44.2,
            45.1,
            46.0,
            46.8,
            47.7,
            48.6,
        ],

        "1Y": [
            31.8,
            32.4,
            33.1,
            34.0,
            34.8,
            35.5,
            36.4,
            37.0,
            36.5,
            37.2,
            38.0,
            39.1,
            40.0,
            41.2,
            42.0,
            43.1,
            44.2,
            45.3,
            46.2,
            47.4,
            48.6,
        ],
    };

    const data = revenueData[period];

    /* =========================================================
       SVG CHART
    ========================================================= */

    const chartWidth = 1000;
    const chartHeight = 280;

    const points = useMemo(() => {
        const min = Math.min(...data);
        const max = Math.max(...data);

        const topPadding = 35;
        const bottomPadding = 45;

        const usableHeight =
            chartHeight - topPadding - bottomPadding;

        return data.map((value, index) => {
            const x =
                (index / (data.length - 1)) *
                chartWidth;

            const normalized =
                (value - min) / (max - min || 1);

            const y =
                chartHeight -
                bottomPadding -
                normalized * usableHeight;

            return {
                x,
                y,
                value,
            };
        });
    }, [data]);

    const linePath = points
        .map((point, index) => {
            if (index === 0) {
                return `M ${point.x} ${point.y}`;
            }

            const previous = points[index - 1];

            const controlX =
                (previous.x + point.x) / 2;

            return `
                C
                ${controlX} ${previous.y},
                ${controlX} ${point.y},
                ${point.x} ${point.y}
            `;
        })
        .join(" ");

    const areaPath = `
        ${linePath}
        L ${chartWidth} ${chartHeight}
        L 0 ${chartHeight}
        Z
    `;

    /* =========================================================
       CHART HOVER
    ========================================================= */

    const handleChartMouseMove = (event) => {
        const rect =
            event.currentTarget.getBoundingClientRect();

        const mouseX =
            event.clientX - rect.left;

        const percentage =
            mouseX / rect.width;

        let index = Math.round(
            percentage * (data.length - 1)
        );

        index = Math.max(
            0,
            Math.min(index, data.length - 1)
        );

        setHoverIndex(index);
    };

    const handleChartMouseLeave = () => {
        setHoverIndex(null);
    };

    /* =========================================================
       AI INSIGHTS
    ========================================================= */

    const insights = [
        "Cash flow projected ↘8.4% in 30 days — review receivables",
        "3 invoices overdue · ₹4.2L outstanding",
        "West region sales declining — 3 key accounts at risk",
        "7 SKUs approaching reorder point this week",
    ];

    /* =========================================================
       PENDING APPROVALS
    ========================================================= */

    const approvals = [
        {
            title: "PO-0481 · Prism Industries",
            subtitle: "Purchase Order",
            amount: "₹2.4L",
            dot: "bg-[#a96d66]",
        },
        {
            title: "Leave · Aditya Kumar · 3 days",
            subtitle: "Leave Approval",
            amount: "—",
            dot: "bg-[#9db38c]",
        },
        {
            title: "EXP-0092 · Marketing",
            subtitle: "Expense Claim",
            amount: "₹18,400",
            dot: "bg-[#b0a06b]",
        },
        {
            title: "SO-0841 discount override",
            subtitle: "Sales Override",
            amount: "₹1.2L",
            dot: "bg-[#b0a06b]",
        },
    ];

    return (
        <div className="min-h-screen w-full bg-[#f6f5f1] px-4 py-6 font-mono text-[#11130f] sm:px-6 lg:px-7">

            <div className="mx-auto w-full max-w-[1540px]">

                {loading && (
    <div className="rounded-[16px] border border-[#e3e1db] bg-white px-5 py-4 text-sm text-[#6d7069]">
        Loading platform dashboard…
    </div>
)}

{error && (
    <div className="mb-6 rounded-[16px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
        {error}
    </div>
)}

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <header className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">

                    <div>

                        <p className="mb-2 text-[11px] uppercase tracking-[1.8px] text-[#979991]">
                            GOOD EVENING,
                        </p>

                        <h1 className="font-serif text-[34px] font-normal leading-none tracking-[-1.5px] sm:text-[38px]">
                            Arjun Mehta
                        </h1>

                        <p className="mt-3 text-[11px] tracking-[0.5px] text-[#999b95] sm:text-[13px]">
                            Business Overview
                            <span className="mx-2">·</span>
                            Acme Manufacturing Ltd
                        </p>

                    </div>


                    {/* HEADER ACTIONS */}

                    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

                        <div className="flex h-[43px] flex-1 items-center justify-center gap-2 rounded-[14px] border border-[#d6ddd0] bg-[#edf0e8] px-4 text-[11px] tracking-[1px] text-[#68715e] sm:flex-none">

                            <span className="h-2 w-2 animate-pulse rounded-full bg-[#b5c6a7]" />

                            AI ACTIVE

                        </div>

                    </div>

                </header>


                {/* =====================================================
                    KPI CARDS
                ===================================================== */}

                <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

                    {kpis.map((kpi, index) => (

                        <div
                            key={kpi.label}
                            className={`min-h-[135px] rounded-[19px] border border-[#e3e1db] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(30,30,25,0.06)] ${
                                animationStarted
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-3 opacity-0"
                            }`}
                            style={{
                                transitionDelay:
                                    `${index * 70}ms`,
                            }}
                        >

                            <p className="text-[9px] uppercase tracking-[1.5px] text-[#999b95]">
                                {kpi.label}
                            </p>

                            <p className="mt-3 whitespace-nowrap font-serif text-[27px] font-normal tracking-[-1px]">
                                {kpi.value}
                            </p>

                            <p
                                className={`mt-5 text-[10px] tracking-[0.3px] ${
                                    kpi.positive
                                        ? "text-[#68715e]"
                                        : "text-[#a96d67]"
                                }`}
                            >
                                {kpi.change}
                            </p>

                        </div>

                    ))}

                </section>


                {/* =====================================================
                    REVENUE + AI INSIGHTS
                ===================================================== */}

                <section className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2.35fr)_minmax(330px,1fr)]">

                    {/* =================================================
                        REVENUE
                    ================================================= */}

                    <div className="min-h-[480px] overflow-hidden rounded-[20px] border border-[#e2e0da] bg-white p-5 sm:p-6">

                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">

                            <div>

                                <p className="mb-1 text-[10px] uppercase tracking-[1.5px] text-[#999b95]">
                                    REVENUE OVERVIEW
                                </p>

                                <p className="font-serif text-[20px] tracking-[-0.5px]">

                                    ₹48.6M MTD

                                    <span className="ml-2 text-[#a4aa7c]">
                                        ↑12.4%
                                    </span>

                                </p>

                            </div>


                            {/* PERIOD */}

                            <div className="flex items-center gap-1 self-end sm:self-auto">

                                {["3M", "6M", "1Y"].map(
                                    (item) => (

                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => {
                                                setPeriod(item);
                                                setHoverIndex(null);
                                            }}
                                            className={`rounded-[10px] px-3 py-2 text-[10px] transition-all duration-200 ${
                                                period === item
                                                    ? "bg-[#151713] text-white"
                                                    : "text-[#999b95] hover:text-[#22251f]"
                                            }`}
                                        >
                                            {item}
                                        </button>

                                    )
                                )}

                            </div>

                        </div>


                        {/* CHART */}

                        <div
                            className="relative mt-4 h-[320px] w-full cursor-crosshair sm:h-[350px]"
                            onMouseMove={
                                handleChartMouseMove
                            }
                            onMouseLeave={
                                handleChartMouseLeave
                            }
                        >

                            <svg
                                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                                preserveAspectRatio="none"
                                className="h-full w-full overflow-visible"
                            >

                                <defs>

                                    <linearGradient
                                        id="revenueGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >

                                        <stop
                                            offset="0%"
                                            stopColor="#66745a"
                                            stopOpacity="0.15"
                                        />

                                        <stop
                                            offset="100%"
                                            stopColor="#66745a"
                                            stopOpacity="0"
                                        />

                                    </linearGradient>

                                </defs>


                                {/* AREA */}

                                <path
                                    d={areaPath}
                                    fill="url(#revenueGradient)"
                                    className="opacity-80"
                                />


                                {/* LINE */}

                                <path
                                    key={period}
                                    d={linePath}
                                    fill="none"
                                    stroke="#5d6b51"
                                    strokeWidth="2.4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    pathLength="1"
                                    className="animate-[drawRevenue_1.5s_ease-out_forwards]"
                                />


                                {/* HOVER */}

                                {hoverIndex !== null && (
                                    <>
                                        <line
                                            x1={
                                                points[
                                                    hoverIndex
                                                ].x
                                            }
                                            y1="15"
                                            x2={
                                                points[
                                                    hoverIndex
                                                ].x
                                            }
                                            y2={
                                                chartHeight -
                                                25
                                            }
                                            stroke="#bfc0ba"
                                            strokeWidth="1"
                                        />

                                        <circle
                                            cx={
                                                points[
                                                    hoverIndex
                                                ].x
                                            }
                                            cy={
                                                points[
                                                    hoverIndex
                                                ].y
                                            }
                                            r="6"
                                            fill="#66745a"
                                            stroke="#ffffff"
                                            strokeWidth="3"
                                        />
                                    </>
                                )}

                            </svg>


                            {/* TOOLTIP */}

                            {hoverIndex !== null && (
                                <div
                                    className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-[12px] bg-[#151713] px-3 py-2.5 shadow-xl"
                                    style={{
                                        left: `${
                                            (points[
                                                hoverIndex
                                            ].x /
                                                chartWidth) *
                                            100
                                        }%`,
                                        top: `${
                                            (points[
                                                hoverIndex
                                            ].y /
                                                chartHeight) *
                                            100
                                        }%`,
                                    }}
                                >

                                    <p className="mb-1 text-[11px] text-white">
                                        {hoverIndex + 1}
                                    </p>

                                    <p className="text-[10px] text-[#82906f]">
                                        ₹
                                        {points[
                                            hoverIndex
                                        ].value.toFixed(1)}
                                        M
                                    </p>

                                </div>
                            )}

                        </div>

                    </div>


                    {/* =================================================
                        AI INSIGHTS
                    ================================================= */}

                    <aside className="flex min-h-[480px] flex-col rounded-[20px] border border-[#242721] bg-[#141612] p-5 text-[#aeb5a5] sm:p-6">

                        <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[1.4px] text-[#a8b28f]">

                            <div className="flex h-[31px] w-[31px] items-center justify-center rounded-[10px] border border-[#394130] bg-[#20251d] text-[#aebc8c]">
                                ✦
                            </div>

                            AI INSIGHTS FOR SUPER ADMIN

                        </div>


                        <div className="mt-5 flex flex-col gap-3">

                            {insights.map(
                                (insight, index) => (

                                    <div
                                        key={index}
                                        className="flex min-h-[72px] gap-3 rounded-[15px] border border-[#2b2e29] bg-[#1c1f1a] p-3.5 text-[12px] leading-[1.55] transition-all duration-200 hover:translate-x-1 hover:bg-[#22251f]"
                                    >

                                        <span className="text-[17px] leading-none text-[#6c7b5d]">
                                            •
                                        </span>

                                        <span className="text-[#9da398]">
                                            {insight}
                                        </span>

                                    </div>

                                )
                            )}

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                alert(
                                    "AI Assistant opened"
                                )
                            }
                            className="mt-auto border-t border-[#242721] pt-5 text-center text-[10px] tracking-[1px] text-[#84916f] transition-colors duration-200 hover:text-[#c1caaa]"
                        >
                            OPEN AI ASSISTANT →
                        </button>

                    </aside>

                </section>


                {/* =====================================================
                    PENDING APPROVALS
                ===================================================== */}

                <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,3.2fr)_minmax(290px,1fr)]">

                    {/* =================================================
                        PENDING APPROVALS
                    ================================================= */}

                    <div className="overflow-hidden rounded-[20px] border border-[#e2e0da] bg-white">

                        <div className="flex min-h-[70px] items-center justify-between border-b border-[#e6e4de] px-5">

                            <h2 className="font-serif text-[20px] font-normal">
                                Pending Approvals
                            </h2>

                            <span className="rounded-[12px] bg-[#f2eded] px-3 py-1.5 text-[10px] text-[#a17c76]">
                                4 waiting
                            </span>

                        </div>


                        {approvals.map(
                            (approval, index) => (

                                <div
                                    key={index}
                                    className="flex min-h-[84px] items-center border-b border-[#e6e4de] px-5 transition-colors duration-200 last:border-b-0 hover:bg-[#fafaf7]"
                                >

                                    <span
                                        className={`mr-5 h-[11px] w-[11px] shrink-0 rounded-full ${approval.dot}`}
                                    />


                                    <div className="min-w-0 flex-1">

                                        <p className="mb-1 text-[13px] text-[#171914] sm:text-[14px]">
                                            {approval.title}
                                        </p>

                                        <p className="text-[10px] text-[#a1a39d] sm:text-[11px]">
                                            {approval.subtitle}
                                        </p>

                                    </div>


                                    <p className="ml-4 whitespace-nowrap font-serif text-[15px] text-[#171914] sm:text-[17px]">
                                        {approval.amount}
                                    </p>

                                </div>

                            )
                        )}

                    </div>

                </section>

            </div>


            {/* =========================================================
                TAILWIND ARBITRARY ANIMATION
            ========================================================= */}

            <style>
                {`
                    @keyframes drawRevenue {
                        from {
                            stroke-dasharray: 1;
                            stroke-dashoffset: 1;
                        }

                        to {
                            stroke-dasharray: 1;
                            stroke-dashoffset: 0;
                        }
                    }
                `}
            </style>

        </div>
    );
};

export default SuperAdminDashboard;