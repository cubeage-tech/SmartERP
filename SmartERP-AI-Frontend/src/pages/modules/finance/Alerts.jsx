import { useState, useEffect, useCallback } from "react";
import financeService from "../../../core/services/modules/finance.service";

const Alerts = ({ onDismiss: onParentDismiss }) => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dismissingId, setDismissingId] = useState(null);

    const fetchAlerts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await financeService.getActiveAlerts();
            setAlerts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Failed to load financial alerts");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    const dismissAlert = async (id) => {
        setDismissingId(id);
        setError("");
        try {
            await financeService.dismissAlert(id);
            setAlerts((current) => current.filter((a) => a.id !== id));
            if (onParentDismiss) onParentDismiss(id);
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Failed to dismiss alert on server");
        } finally {
            setDismissingId(null);
        }
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
                justify-between
                gap-5
            ">

                <div className="flex items-center gap-5">
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
                            Active audit scanning across journal entries and financial records.
                        </p>
                    </div>
                </div>

                <button
                    onClick={fetchAlerts}
                    title="Refresh Alerts"
                    className="
                        rounded-xl border border-[#333b30] bg-[#1a2018]
                        px-3 py-2 font-mono text-[11px] text-[#9caf8c]
                        transition hover:bg-[#252e22]
                    "
                >
                    ↻ Refresh
                </button>

            </div>

            {/* ERROR BANNER */}
            {error && (
                <div className="mb-4 flex items-center justify-between rounded-[16px] border border-[#f5c6c6] bg-[#fde8e8] px-5 py-3 text-[#a02020]">
                    <span className="font-mono text-[12px]">⚠️ {error}</span>
                    <button
                        onClick={fetchAlerts}
                        className="font-mono text-[11px] underline hover:no-underline"
                    >
                        Retry
                    </button>
                </div>
            )}


            {/* =====================================================
                ALERT LIST
            ====================================================== */}

            <div className="space-y-4">

                {loading ? (
                    <div className="
                        bg-white
                        border
                        border-[#e3e0d9]
                        rounded-[20px]
                        py-16
                        text-center
                        font-mono
                        text-[12px]
                        text-[#91a0a0]
                    ">
                        Scanning active alerts from backend...
                    </div>
                ) : alerts.length === 0 ? (

                    <div className="
                        bg-white
                        border
                        border-[#e3e0d9]
                        rounded-[20px]
                        py-16
                        text-center
                    ">

                        <div className="text-3xl mb-3 text-[#4caf50]">
                            ✓
                        </div>

                        <h3 className="
                            font-serif
                            text-[20px]
                            mb-2
                            text-[#11130f]
                        ">
                            No active alerts
                        </h3>

                        <p className="
                            font-mono
                            text-[12px]
                            text-[#929999]
                        ">
                            All finance alerts have been handled or none are currently open.
                        </p>

                    </div>

                ) : (

                    alerts.map((alert) => (

                        <AlertCard
                            key={alert.id}
                            alert={alert}
                            onDismiss={dismissAlert}
                            isDismissing={dismissingId === alert.id}
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
    onDismiss,
    isDismissing
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
                    font-semibold
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
                        {alert.status && (
                            <>
                                <span className="mx-2">·</span>
                                <span className="uppercase text-[#8d9696]">{alert.status}</span>
                            </>
                        )}
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
                    disabled={isDismissing}
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
                        disabled:opacity-50
                    "
                >
                    {isDismissing ? "Dismissing..." : "Dismiss"}
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