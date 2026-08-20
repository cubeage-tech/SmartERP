import { useState } from "react";

const Alerts = () => {

    const [alerts, setAlerts] = useState([
        {
            id: 1,
            level: "HIGH",
            type: "FRAUD",
            time: "2H AGO",
            title:
                "Duplicate vendor invoice detected: BILL-127 matches BILL-091 (Tata Steel)"
        },
        {
            id: 2,
            level: "MEDIUM",
            type: "ANOMALY",
            time: "1D AGO",
            title:
                "Unusual payment pattern: 3 payments to same bank account in 24h"
        },
        {
            id: 3,
            level: "LOW",
            type: "COMPLIANCE",
            time: "3D AGO",
            title:
                "GST filing due in 5 days — Q2 GSTR-1 not submitted"
        }
    ]);


    const dismissAlert = (id) => {

        setAlerts((currentAlerts) =>
            currentAlerts.filter((alert) => alert.id !== id)
        );

    };


    return (
        <div className="w-full">

            {/* =====================================================
                AI FRAUD MONITOR
            ====================================================== */}

            <div className="
                bg-[#11130f]
                rounded-[20px]
                px-6
                py-6
                mb-5
                flex
                items-center
                gap-5
            ">

                <div className="
                    w-12
                    h-12
                    rounded-[14px]
                    bg-[#22291f]
                    flex
                    items-center
                    justify-center
                    text-[#9caf8c]
                    text-xl
                    shrink-0
                ">
                    ♢
                </div>


                <div>

                    <h2 className="
                        font-serif
                        text-[20px]
                        text-white
                        mb-1
                    ">
                        AI Fraud &amp; Compliance Monitor
                    </h2>

                    <p className="
                        font-mono
                        text-[12px]
                        text-[#737a73]
                    ">
                        Scanning 892 journal entries and 38 vendor
                        payments this week.
                    </p>

                </div>

            </div>


            {/* =====================================================
                ALERT LIST
            ====================================================== */}

            <div className="space-y-4">

                {alerts.length === 0 ? (

                    <div className="
                        bg-white
                        border
                        border-[#e3e0d9]
                        rounded-[20px]
                        py-16
                        text-center
                    ">

                        <div className="text-3xl mb-3">
                            ✓
                        </div>

                        <h3 className="
                            font-serif
                            text-[20px]
                            mb-2
                        ">
                            No active alerts
                        </h3>

                        <p className="
                            font-mono
                            text-[12px]
                            text-[#929999]
                        ">
                            All finance alerts have been handled.
                        </p>

                    </div>

                ) : (

                    alerts.map((alert) => (

                        <AlertCard
                            key={alert.id}
                            alert={alert}
                            onDismiss={dismissAlert}
                        />

                    ))

                )}

            </div>

        </div>
    );
};


/* ================================================================
   ALERT CARD
================================================================ */

const AlertCard = ({
    alert,
    onDismiss
}) => {

    const levelStyles = {

        HIGH: {
            badge: "bg-[#f0e9e5] text-[#865044]",
            border: "border-[#decac4]"
        },

        MEDIUM: {
            badge: "bg-[#f2f0e9] text-[#8c7950]",
            border: "border-[#e4deca]"
        },

        LOW: {
            badge: "bg-[#ecebe5] text-[#77755f]",
            border: "border-[#deddd5]"
        }

    };


    const style =
        levelStyles[alert.level] || levelStyles.LOW;


    return (
        <div className={`
            bg-white
            border
            ${style.border}
            rounded-[20px]
            px-6
            py-6
            flex
            flex-col
            lg:flex-row
            lg:items-center
            justify-between
            gap-5
        `}>

            {/* LEFT */}

            <div className="
                flex
                items-start
                gap-5
                min-w-0
            ">

                {/* LEVEL */}

                <div className={`
                    shrink-0
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    font-mono
                    text-[10px]
                    ${style.badge}
                `}>
                    {alert.level}
                </div>


                {/* TEXT */}

                <div className="min-w-0">

                    <p className="
                        font-mono
                        text-[14px]
                        text-[#303531]
                        leading-relaxed
                        mb-2
                    ">
                        {alert.title}
                    </p>

                    <p className="
                        font-mono
                        text-[10px]
                        tracking-[0.08em]
                        text-[#a4aaa9]
                    ">
                        {alert.type}
                        <span className="mx-2">·</span>
                        {alert.time}
                    </p>

                </div>

            </div>


            {/* ACTIONS */}

            <div className="
                flex
                items-center
                gap-3
                shrink-0
                ml-[60px]
                lg:ml-0
            ">

                <button
                    onClick={() => onDismiss(alert.id)}
                    className="
                        px-4
                        py-2.5
                        rounded-xl
                        border
                        border-[#e3e0d9]
                        bg-white
                        font-mono
                        text-[11px]
                        text-[#9a9f9f]
                        hover:text-[#11130f]
                        hover:bg-[#f7f6f2]
                        transition
                    "
                >
                    Dismiss
                </button>

                <button
                    className="
                        px-5
                        py-2.5
                        rounded-xl
                        bg-[#11130f]
                        text-white
                        font-mono
                        text-[11px]
                        hover:bg-[#292c27]
                        transition
                    "
                >
                    Investigate →
                </button>

            </div>

        </div>
    );
};


export default Alerts;