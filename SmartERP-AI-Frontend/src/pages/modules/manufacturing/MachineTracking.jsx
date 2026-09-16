import React, { useEffect, useState } from "react";
import ManufacturingService from "../../../core/services/modules/manufacturing.service";

const statusStyles = {
  running: "bg-[#dfe9db] text-[#50614b]",
  maintenance: "bg-[#ebe7dc] text-[#756c4e]",
  idle: "bg-[#e7e5df] text-[#77766f]",
  down: "bg-[#f4dddd] text-[#8d5148]",
  off: "bg-[#eee] text-[#999]",
};

function MachineCard({ machine, onEdit, onDelete, onStatusChange }) {
  const statusKey = (machine.status || machine.statusType || "idle").toLowerCase();

  return (
    <article className="group rounded-[18px] border border-[#e4e2dd] bg-white p-4 transition-all duration-200 hover:border-[#d8d5ce] hover:shadow-[0_3px_12px_rgba(0,0,0,0.035)] sm:rounded-[20px] sm:p-5">
      {/* Machine Header */}
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[9px] leading-none tracking-[0.14em] text-[#a0a09a] sm:text-[10px]">
            {machine.code || `ID: ${machine.id}`}
          </p>

          <h2 className="mt-[8px] font-serif text-[19px] leading-[1.1] tracking-[-0.02em] text-[#171815] sm:mt-[9px] sm:text-[21px]">
            {machine.name}
          </h2>

          <p className="mt-[7px] font-mono text-[10px] leading-none text-[#999a94] sm:text-[11px]">
            {machine.floor || machine.shopFloor || "Main Floor"}
          </p>
        </div>

        {/* Status */}
        <span
          className={`shrink-0 rounded-[10px] px-2.5 py-[7px] font-mono text-[9px] leading-none tracking-[0.07em] sm:px-3 sm:text-[10px] ${
            statusStyles[statusKey] || statusStyles.idle
          }`}
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
            {machine.utilization ?? 0}%
          </span>
        </div>

        <div className="mt-[10px] h-[9px] overflow-hidden rounded-full bg-[#f0efeb] sm:mt-[11px] sm:h-[10px]">
          <div
            className="h-full rounded-full bg-[#a5bb98] transition-all duration-700 ease-out"
            style={{ width: `${Math.min(machine.utilization ?? 0, 100)}%` }}
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
            {machine.lastMaintenance || "-"}
          </p>
        </div>

        <div className="rounded-[14px] bg-[#f5f4f0] px-2.5 py-[14px] text-center transition-colors duration-200 group-hover:bg-[#f3f2ee] sm:rounded-[15px] sm:px-3 sm:py-[16px]">
          <p className="font-mono text-[8px] leading-none tracking-[0.12em] text-[#a0a09a] sm:text-[9px]">
            NEXT MAINT.
          </p>

          <p
            className={`mt-[9px] font-mono text-[10px] leading-none sm:mt-[10px] sm:text-[11px] ${
              statusKey === "maintenance"
                ? "text-[#766b48] font-bold"
                : "text-[#4e504b]"
            }`}
          >
            {machine.nextMaintenance || "-"}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-[#f0eee8] pt-3 text-[11px]">
        <div className="flex items-center gap-1.5">
          {machine.status !== "RUNNING" && (
            <button
              type="button"
              onClick={() => onStatusChange(machine, "RUNNING")}
              className="rounded-[8px] bg-[#dfe9db] px-2.5 py-1 font-mono text-[9px] font-semibold text-[#50614b] hover:bg-[#cde0c7]"
            >
              Set Running
            </button>
          )}

          {machine.status !== "MAINTENANCE" && (
            <button
              type="button"
              onClick={() => onStatusChange(machine, "MAINTENANCE")}
              className="rounded-[8px] bg-[#ebe7dc] px-2.5 py-1 font-mono text-[9px] font-semibold text-[#756c4e] hover:bg-[#ddd7c8]"
            >
              Maintenance
            </button>
          )}

          {machine.status === "RUNNING" && (
            <button
              type="button"
              onClick={() => onStatusChange(machine, "IDLE")}
              className="rounded-[8px] bg-[#e7e5df] px-2.5 py-1 font-mono text-[9px] font-semibold text-[#77766f] hover:bg-[#d8d6cf]"
            >
              Set Idle
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(machine)}
            className="rounded-[8px] border border-[#e4e2dc] bg-white px-2.5 py-1 font-mono text-[10px] text-[#555] hover:border-[#151714] hover:text-[#151714]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(machine)}
            className="rounded-[8px] border border-red-200 px-2.5 py-1 font-mono text-[10px] text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function MachineModal({ machine, onClose, onSave }) {
  const isEditing = Boolean(machine?.id);
  const [form, setForm] = useState({
    code: machine?.code || "",
    name: machine?.name || "",
    shopFloor: machine?.floor || machine?.shopFloor || "",
    status: machine?.status || "RUNNING",
    utilization: machine?.utilization ?? 0,
    lastMaintenance: machine?.lastMaintenance || "",
    nextMaintenance: machine?.nextMaintenance || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Machine name is required.");
      return;
    }
    if (!isEditing && !form.code.trim()) {
      setError("Machine code is required.");
      return;
    }
    if (!form.shopFloor.trim()) {
      setError("Shop floor location is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (isEditing) {
        const payload = {
          name: form.name.trim(),
          shopFloor: form.shopFloor.trim(),
          status: form.status,
          utilization: Number(form.utilization) || 0,
          lastMaintenance: form.lastMaintenance || null,
          nextMaintenance: form.nextMaintenance || null,
        };
        await ManufacturingService.updateMachine(machine.id, payload);
      } else {
        const payload = {
          code: form.code.trim(),
          name: form.name.trim(),
          shopFloor: form.shopFloor.trim(),
          status: form.status,
          utilization: Number(form.utilization) || 0,
          lastMaintenance: form.lastMaintenance || null,
          nextMaintenance: form.nextMaintenance || null,
        };
        await ManufacturingService.createMachine(payload);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save machine.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#ece9e2] pb-3">
          <h2 className="font-serif text-[18px] font-bold text-[#151714]">
            {isEditing ? `Edit Machine (${machine.code || machine.name})` : "Add New Machine"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#e4e2dc] bg-[#f7f6f2] text-[13px] text-[#777] hover:bg-[#ece9e2]"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 p-2.5 text-[11px] text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-[12px]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-medium text-[#555]">Machine Code *</label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                disabled={isEditing}
                placeholder="e.g. CNC-01"
                className="w-full rounded-[9px] border border-[#e4e2dc] px-3 py-2 text-[#151714] outline-none focus:border-[#151714] disabled:bg-[#f7f6f2] disabled:text-[#888]"
                required
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-[#555]">Machine Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. 5-Axis Milling Center"
                className="w-full rounded-[9px] border border-[#e4e2dc] px-3 py-2 text-[#151714] outline-none focus:border-[#151714]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-medium text-[#555]">Shop Floor *</label>
              <input
                type="text"
                name="shopFloor"
                value={form.shopFloor}
                onChange={handleChange}
                placeholder="e.g. Bay 2, Floor 1"
                className="w-full rounded-[9px] border border-[#e4e2dc] px-3 py-2 text-[#151714] outline-none focus:border-[#151714]"
                required
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-[#555]">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-[9px] border border-[#e4e2dc] bg-white px-3 py-2 text-[#151714] outline-none focus:border-[#151714]"
              >
                <option value="RUNNING">Running</option>
                <option value="IDLE">Idle</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="DOWN">Down</option>
                <option value="OFF">Off</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-medium text-[#555]">Last Maintenance</label>
              <input
                type="date"
                name="lastMaintenance"
                value={form.lastMaintenance}
                onChange={handleChange}
                className="w-full rounded-[9px] border border-[#e4e2dc] px-3 py-2 text-[#151714] outline-none focus:border-[#151714]"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-[#555]">Next Maintenance</label>
              <input
                type="date"
                name="nextMaintenance"
                value={form.nextMaintenance}
                onChange={handleChange}
                className="w-full rounded-[9px] border border-[#e4e2dc] px-3 py-2 text-[#151714] outline-none focus:border-[#151714]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="mb-1 block font-medium text-[#555]">Utilization: {form.utilization}%</label>
            </div>
            <input
              type="range"
              name="utilization"
              min="0"
              max="100"
              value={form.utilization}
              onChange={handleChange}
              className="w-full accent-[#151714]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#ece9e2]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[10px] border border-[#e4e2dc] bg-white px-4 py-2 font-mono text-[11px] text-[#555] hover:bg-[#f7f6f2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-[10px] bg-[#151714] px-5 py-2 font-mono text-[11px] text-white hover:bg-[#2a2c28] disabled:opacity-50"
            >
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Machine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const MachineTracking = ({ createRequest = 0 }) => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    if (createRequest > 0) {
      handleCreate();
    }
  }, [createRequest]);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const response = await ManufacturingService.getMachines();
      setMachines(response.data || []);
    } catch (error) {
      console.error("Error fetching machines:", error);
      setMachines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedMachine(null);
    setShowModal(true);
  };

  const handleEdit = (machine) => {
    setSelectedMachine(machine);
    setShowModal(true);
  };

  const handleDelete = async (machine) => {
    if (!window.confirm(`Delete machine ${machine.name || machine.code}?`)) return;
    try {
      await ManufacturingService.deleteMachine(machine.id);
      setMachines((prev) => prev.filter((m) => m.id !== machine.id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete machine.");
    }
  };

  const handleStatusChange = async (machine, nextStatus) => {
    try {
      const payload = {
        name: machine.name,
        shopFloor: machine.floor || machine.shopFloor || "Main Floor",
        status: nextStatus,
        utilization: machine.utilization ?? 0,
        lastMaintenance: machine.lastMaintenance || null,
        nextMaintenance: machine.nextMaintenance || null,
      };
      const { data } = await ManufacturingService.updateMachine(machine.id, payload);
      setMachines((prev) => prev.map((m) => (m.id === machine.id ? data : m)));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update machine status.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f6f2] px-4 py-4 text-[#171815] sm:px-6 sm:py-[18px] lg:px-[30px]">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="font-mono text-xs text-[#8a8f80]">
            Loading machines...
          </span>
        </div>
      ) : machines.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[#e4e2dd] bg-white py-16 text-center">
          <span className="font-serif text-[18px] text-[#555]">No machines found</span>
          <p className="mt-1 font-mono text-[11px] text-[#999]">
            Click '+ Add Machine' to add your first machine
          </p>
        </div>
      ) : (
        /* Machines Grid */
        <section className="grid grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-2 lg:gap-[20px] xl:grid-cols-3">
          {machines.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </section>
      )}

      {showModal && (
        <MachineModal
          machine={selectedMachine}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            fetchMachines();
          }}
        />
      )}
    </main>
  );
};

export default MachineTracking;
