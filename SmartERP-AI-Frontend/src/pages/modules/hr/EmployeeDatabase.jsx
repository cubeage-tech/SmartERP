import React from "react";

const employees = [
    {
        id: "EMP-0142",
        initials: "AM",
        name: "Arjun Mehta",
        department: "Management",
        designation: "Managing Director",
        branch: "HQ – Mumbai",
        joined: "01 Apr 2010",
        salary: "₹2,80,000",
        status: "ACTIVE",
    },
    {
        id: "EMP-0141",
        initials: "RS",
        name: "Rahul Sharma",
        department: "Finance",
        designation: "Finance Manager",
        branch: "HQ – Mumbai",
        joined: "15 Jun 2015",
        salary: "₹1,40,000",
        status: "ACTIVE",
    },
    {
        id: "EMP-0140",
        initials: "AS",
        name: "Ananya Singh",
        department: "Sales",
        designation: "Sales Manager",
        branch: "West – Pune",
        joined: "01 Mar 2018",
        salary: "₹1,20,000",
        status: "ACTIVE",
    },
    {
        id: "EMP-0139",
        initials: "DR",
        name: "Deepika Rao",
        department: "HR",
        designation: "HR Manager",
        branch: "HQ – Mumbai",
        joined: "10 Aug 2016",
        salary: "₹1,10,000",
        status: "ACTIVE",
    },
    {
        id: "EMP-0138",
        initials: "VJ",
        name: "Vikram Joshi",
        department: "Operations",
        designation: "Ops Manager",
        branch: "Factory – Pune",
        joined: "20 Jan 2014",
        salary: "₹1,30,000",
        status: "ACTIVE",
    },
    {
        id: "EMP-0137",
        initials: "AK",
        name: "Aditya Kumar",
        department: "IT",
        designation: "Software Engineer",
        branch: "HQ – Mumbai",
        joined: "04 Sep 2022",
        salary: "₹85,000",
        status: "ACTIVE",
    },
];

export default function EmployeeDatabase() {
    return (
        <div className="w-full">

            <div className="
                overflow-hidden
                rounded-[20px]
                border
                border-[#e3e0d9]
                bg-white
            ">

                {/* TITLE */}

                <div className="px-6 py-6">

                    <h2 className="
                        font-serif
                        text-[22px]
                        text-[#11130f]
                    ">
                        Employee Database
                    </h2>

                    <p className="
                        mt-1
                        font-mono
                        text-[10px]
                        text-[#969e9a]
                    ">
                        Manage employee records and information
                    </p>

                </div>


                {/* TABLE */}

                <div className="w-full overflow-x-auto">

                    <div className="min-w-[1050px]">

                        {/* HEADER */}

                        <div className="
                            grid
                            grid-cols-[10%_20%_12%_17%_13%_11%_10%_7%]
                            border-y
                            border-[#e5e3dc]
                            bg-[#faf9f6]
                            px-6
                            py-4
                            font-mono
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-[0.12em]
                            text-[#a0a39e]
                        ">

                            <div>ID</div>
                            <div>EMPLOYEE</div>
                            <div>DEPARTMENT</div>
                            <div>DESIGNATION</div>
                            <div>BRANCH</div>
                            <div>JOINED</div>
                            <div>SALARY</div>
                            <div>STATUS</div>

                        </div>


                        {/* ROWS */}

                        {employees.map((employee) => (

                            <div
                                key={employee.id}
                                className="
                                    group
                                    grid
                                    grid-cols-[10%_20%_12%_17%_13%_11%_10%_7%]
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
                                    text-[11px]
                                    text-[#a1a6ae]
                                ">
                                    {employee.id}
                                </div>


                                <div className="flex items-center gap-3">

                                    <div className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-[#dfe4da]
                                        bg-[#f1f3ee]
                                        text-[9px]
                                        text-[#5e675a]
                                    ">
                                        {employee.initials}
                                    </div>

                                    <p className="
                                        truncate
                                        font-serif
                                        text-[15px]
                                        text-[#171916]
                                    ">
                                        {employee.name}
                                    </p>

                                </div>


                                <div className="text-[11px] text-[#68716a]">
                                    {employee.department}
                                </div>


                                <div className="text-[11px] text-[#68716a]">
                                    {employee.designation}
                                </div>


                                <div className="text-[11px] text-[#858b85]">
                                    {employee.branch}
                                </div>


                                <div className="text-[10px] text-[#858b85]">
                                    {employee.joined}
                                </div>


                                <div className="
                                    text-[12px]
                                    font-medium
                                    text-[#171916]
                                ">
                                    {employee.salary}
                                </div>


                                <div>

                                    <span className="
                                        inline-flex
                                        rounded-[10px]
                                        bg-[#e3ebdf]
                                        px-3
                                        py-1.5
                                        text-[8px]
                                        tracking-[0.08em]
                                        text-[#53624f]
                                    ">
                                        {employee.status}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}