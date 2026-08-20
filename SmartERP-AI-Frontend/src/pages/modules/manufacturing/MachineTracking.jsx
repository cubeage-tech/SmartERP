import React from "react";

const machines = [
  {
    id: "CNC-01",
    name: "CNC Machining Centre 1",
    floor: "Shop Floor A",
    status: "RUNNING",
    statusType: "running",
    utilization: 86,
    lastMaintenance: "01 Aug 2026",
    nextMaintenance: "01 Sep 2026",
  },
  {
    id: "CNC-02",
    name: "CNC Machining Centre 2",
    floor: "Shop Floor A",
    status: "RUNNING",
    statusType: "running",
    utilization: 62,
    lastMaintenance: "15 Jul 2026",
    nextMaintenance: "15 Aug 2026",
  },
  {
    id: "CNC-03",
    name: "CNC Machining Centre 3",
    floor: "Shop Floor B",
    status: "MAINTENANCE",
    statusType: "maintenance",
    utilization: 0,
    lastMaintenance: "20 Jun 2026",
    nextMaintenance: "12 Aug 2026",
  },
  {
    id: "PRESS-01",
    name: "Hydraulic Press 200T",
    floor: "Shop Floor B",
    status: "IDLE",
    statusType: "idle",
    utilization: 44,
    lastMaintenance: "10 Jul 2026",
    nextMaintenance: "10 Sep 2026",
  },
  {
    id: "LATHE-01",
    name: "CNC Lathe L450",
    floor: "Shop Floor A",
    status: "RUNNING",
    statusType: "running",
    utilization: 78,
    lastMaintenance: "25 Jul 2026",
    nextMaintenance: "25 Sep 2026",
  },
];

const statusStyles = {
  running: "bg-[#dfe9db] text-[#50614b]",
  maintenance: "bg-[#ebe7dc] text-[#756c4e]",
  idle: "bg-[#e7e5df] text-[#77766f]",
};

function MachineCard({ machine }) {
  return (
    <article className="group rounded-[18px] border border-[#e4e2dd] bg-white p-4 transition-all duration-200 hover:border-[#d8d5ce] hover:shadow-[0_3px_12px_rgba(0,0,0,0.035)] sm:rounded-[20px] sm:p-5">
      {/* Machine Header */}
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[9px] leading-none tracking-[0.14em] text-[#a0a09a] sm:text-[10px]">
            {machine.id}
          </p>

          <h2 className="mt-[8px] font-serif text-[19px] leading-[1.1] tracking-[-0.02em] text-[#171815] sm:mt-[9px] sm:text-[21px]">
            {machine.name}
          </h2>

          <p className="mt-[7px] font-mono text-[10px] leading-none text-[#999a94] sm:text-[11px]">
            {machine.floor}
          </p>
        </div>

        {/* Status */}
        <span
          className={`shrink-0 rounded-[10px] px-2.5 py-[7px] font-mono text-[9px] leading-none tracking-[0.07em] transition-transform duration-200 group-hover:scale-[1.02] sm:px-3 sm:text-[10px] ${statusStyles[machine.statusType]}`}
        >
          {machine.status}
        </span>
      </div>

      {/* Utilization */}
      <div className="mt-[15px] sm:mt-[16px]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] leading-none tracking-[0.13em] text-[#a0a09a] sm:text-[10px]">
            UTILIZATION
          </span>

          <span className="font-mono text-[10px] leading-none text-[#5c5d58] sm:text-[11px]">
            {machine.utilization}%
          </span>
        </div>

        <div className="mt-[10px] h-[9px] overflow-hidden rounded-full bg-[#f0efeb] sm:mt-[11px] sm:h-[10px]">
          <div
            className="h-full rounded-full bg-[#a5bb98] transition-all duration-700 ease-out"
            style={{ width: `${machine.utilization}%` }}
          />
        </div>
      </div>

      {/* Maintenance */}
      <div className="mt-[17px] grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 sm:mt-[20px] sm:gap-[15px]">
        <div className="rounded-[14px] bg-[#f5f4f0] px-2.5 py-[14px] text-center transition-colors duration-200 group-hover:bg-[#f3f2ee] sm:rounded-[15px] sm:px-3 sm:py-[16px]">
          <p className="font-mono text-[8px] leading-none tracking-[0.12em] text-[#a0a09a] sm:text-[9px]">
            LAST MAINT.
          </p>

          <p className="mt-[9px] font-mono text-[10px] leading-none text-[#4e504b] sm:mt-[10px] sm:text-[11px]">
            {machine.lastMaintenance}
          </p>
        </div>

        <div className="rounded-[14px] bg-[#f5f4f0] px-2.5 py-[14px] text-center transition-colors duration-200 group-hover:bg-[#f3f2ee] sm:rounded-[15px] sm:px-3 sm:py-[16px]">
          <p className="font-mono text-[8px] leading-none tracking-[0.12em] text-[#a0a09a] sm:text-[9px]">
            NEXT MAINT.
          </p>

          <p
            className={`mt-[9px] font-mono text-[10px] leading-none sm:mt-[10px] sm:text-[11px] ${
              machine.statusType === "maintenance"
                ? "text-[#766b48]"
                : "text-[#4e504b]"
            }`}
          >
            {machine.nextMaintenance}
          </p>
        </div>
      </div>
    </article>
  );
}

const MachineTracking = () => {
  return (
    <main className="bg-[#f7f6f2] px-4 py-4 text-[#171815] sm:px-6 sm:py-[18px] lg:px-[30px]">
      {/* Machines Grid */}
      <section className="grid grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-2 lg:gap-[20px] xl:grid-cols-3">
        {machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </section>
    </main>
  );
};

export default MachineTracking;