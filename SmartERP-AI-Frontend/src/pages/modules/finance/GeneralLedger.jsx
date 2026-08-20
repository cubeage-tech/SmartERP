import { useState } from "react";

const GeneralLedger = () => {

    const [period, setPeriod] = useState("Today");

    const entries = [
        {
            id: "JV-2026-0892",
            date: "08 Aug 2026",
            description:
                "Sales Invoice INV-2026-0318 – Hero MotoCorp",
            account: "Accounts Receivable",
            debit: "₹14,10,000",
            credit: "-",
            ref: "INV-318",
        },
        {
            id: "JV-2026-0891",
            date: "08 Aug 2026",
            description:
                "Payment received – Bajaj Auto Ltd",
            account: "Bank – HDFC Current",
            debit: "-",
            credit: "₹9,15,000",
            ref: "PAY-214",
        },
        {
            id: "JV-2026-0890",
            date: "07 Aug 2026",
            description:
                "Purchase Bill – Tata Steel Ltd",
            account: "Raw Material Purchases",
            debit: "₹18,40,000",
            credit: "-",
            ref: "BILL-128",
        },
        {
            id: "JV-2026-0889",
            date: "07 Aug 2026",
            description:
                "Salary disbursement – Aug 2026",
            account: "Salary & Wages",
            debit: "₹24,80,000",
            credit: "-",
            ref: "PR-082026",
        },
        {
            id: "JV-2026-0888",
            date: "06 Aug 2026",
            description:
                "Rent – Factory Pune MIDC",
            account: "Factory Rent",
            debit: "₹3,20,000",
            credit: "-",
            ref: "EXP-441",
        },
    ];


    return (
        <section
            className="
                overflow-hidden
                rounded-[20px]
                border
                border-[#e3e0d8]
                bg-white
            "
        >

            {/* =================================================
                HEADER
            ================================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-5
                    border-b
                    border-[#e4e1da]
                    px-6 py-6
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >

                <h2 className="font-serif text-[22px]">
                    General Ledger
                </h2>


                {/* PERIOD FILTER */}

                <div className="flex flex-wrap gap-2">

                    {["Today", "This Week", "This Month", "FY"].map(
                        (item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => setPeriod(item)}
                                className={`
                                    rounded-xl
                                    border
                                    px-4 py-2.5
                                    font-mono
                                    text-[11px]
                                    transition-all
                                    ${
                                        period === item
                                            ? "border-[#11130f] bg-[#11130f] text-white"
                                            : "border-[#e3e0d8] bg-white text-[#9aa1a7] hover:bg-[#f6f5f1]"
                                    }
                                `}
                            >
                                {item}
                            </button>
                        )
                    )}

                </div>

            </div>


            {/* =================================================
                DESKTOP TABLE
            ================================================== */}

            <div className="hidden overflow-x-auto lg:block">

                <table className="w-full border-collapse">

                    <thead>

                        <tr className="bg-[#f5f4f0]">

                            <TableHeader>JV #</TableHeader>
                            <TableHeader>DATE</TableHeader>
                            <TableHeader>DESCRIPTION</TableHeader>
                            <TableHeader>ACCOUNT</TableHeader>
                            <TableHeader align="right">DEBIT</TableHeader>
                            <TableHeader align="right">CREDIT</TableHeader>
                            <TableHeader align="right">REF</TableHeader>

                        </tr>

                    </thead>


                    <tbody>

                        {entries.map((entry) => (
                            <tr
                                key={entry.id}
                                className="
                                    border-t
                                    border-[#e5e2dc]
                                    transition-colors
                                    hover:bg-[#faf9f6]
                                "
                            >

                                <TableCell>
                                    <span className="text-[#82909a]">
                                        {entry.id}
                                    </span>
                                </TableCell>

                                <TableCell>
                                    {entry.date}
                                </TableCell>

                                <TableCell>
                                    {entry.description}
                                </TableCell>

                                <TableCell>
                                    <span className="text-[#65758a]">
                                        {entry.account}
                                    </span>
                                </TableCell>

                                <TableCell align="right">
                                    {entry.debit}
                                </TableCell>

                                <TableCell align="right">
                                    {entry.credit}
                                </TableCell>

                                <TableCell align="right">
                                    <span className="text-[#9da5aa]">
                                        {entry.ref}
                                    </span>
                                </TableCell>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>


            {/* =================================================
                MOBILE CARDS
            ================================================== */}

            <div className="divide-y divide-[#e5e2dc] lg:hidden">

                {entries.map((entry) => (
                    <div
                        key={entry.id}
                        className="space-y-4 p-5"
                    >

                        <div className="flex items-center justify-between">

                            <span className="font-mono text-[12px] text-[#7f8b94]">
                                {entry.id}
                            </span>

                            <span className="font-mono text-[11px] text-[#a0a6aa]">
                                {entry.date}
                            </span>

                        </div>


                        <p className="font-mono text-[13px] leading-6 text-[#293139]">
                            {entry.description}
                        </p>


                        <div>

                            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#a0a6aa]">
                                Account
                            </p>

                            <p className="mt-1 font-mono text-[12px] text-[#66768a]">
                                {entry.account}
                            </p>

                        </div>


                        <div className="grid grid-cols-2 gap-4">

                            <div>

                                <p className="font-mono text-[10px] uppercase text-[#a0a6aa]">
                                    Debit
                                </p>

                                <p className="mt-1 font-mono text-[12px]">
                                    {entry.debit}
                                </p>

                            </div>


                            <div>

                                <p className="font-mono text-[10px] uppercase text-[#a0a6aa]">
                                    Credit
                                </p>

                                <p className="mt-1 font-mono text-[12px]">
                                    {entry.credit}
                                </p>

                            </div>

                        </div>


                        <div className="font-mono text-[11px] text-[#a0a6aa]">
                            Ref: {entry.ref}
                        </div>

                    </div>
                ))}

            </div>

        </section>
    );
};


/* ================================================================
   TABLE HEADER
================================================================ */

const TableHeader = ({ children, align = "left" }) => {
    return (
        <th
            className={`
                px-6 py-4
                text-${align}
                font-mono
                text-[10px]
                font-normal
                uppercase
                tracking-[0.1em]
                text-[#9aa1a7]
            `}
        >
            {children}
        </th>
    );
};


/* ================================================================
   TABLE CELL
================================================================ */

const TableCell = ({ children, align = "left" }) => {
    return (
        <td
            className={`
                px-6 py-5
                text-${align}
                font-mono
                text-[12px]
                text-[#53616e]
            `}
        >
            {children}
        </td>
    );
};


export default GeneralLedger;