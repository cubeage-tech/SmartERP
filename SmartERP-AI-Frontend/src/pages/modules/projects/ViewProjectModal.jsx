import React, { useEffect } from "react";

const ViewProjectModal = ({ open, project, onClose, onEdit }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !project) return null;

  const statusClass = (project.status || "PLANNING").toLowerCase().replaceAll("_", "-");
  const priorityClass = (project.priority || "MEDIUM").toLowerCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-[720px] flex-col rounded-[20px] bg-[#f6f5f1] shadow-2xl overflow-hidden border border-[#e2dfd7]">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e3e0d9] bg-white px-7 py-5 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[11px] font-semibold text-[#88857f] bg-[#f1f0ec] px-2 py-0.5 rounded">
                {project.projectCode || "NO CODE"}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                statusClass === "active" || statusClass === "on-track"
                  ? "bg-[#e7eee2] text-[#4e6a4d]"
                  : statusClass === "completed"
                  ? "bg-[#e4eee3] text-[#3e5c38]"
                  : statusClass === "on-hold" || statusClass === "at-risk"
                  ? "bg-[#ece7d8] text-[#8c7c4c]"
                  : "bg-[#f1f1f4] text-[#6b6964]"
              }`}>
                {project.status || "PLANNING"}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#f0efeb] text-[#55534e]">
                {project.priority || "MEDIUM"}
              </span>
            </div>
            <h2 className="font-serif text-[24px] leading-tight text-[#11130f] m-0">
              {project.name || "Untitled Project"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(project);
                }}
                className="flex items-center gap-1.5 rounded-[10px] border border-[#e3e0d9] bg-white px-4 py-2 font-mono text-[11px] text-[#303531] transition hover:bg-[#f0efeb]"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#91a0a0] transition hover:bg-[#f0efeb] hover:text-[#11130f] text-xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-5">
          
          {/* Progress Card */}
          <div className="rounded-[14px] border border-[#e3e0d9] bg-white p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] font-semibold text-[#88857f] tracking-wide">
                PROJECT PROGRESS
              </span>
              <span className="font-serif text-[20px] text-[#11130f]">
                {project.progressPercent ?? 0}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-[#f1f0ec] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5b6e57] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(Math.max(project.progressPercent ?? 0, 0), 100)}%` }}
              />
            </div>
          </div>

          {/* Grid of Key Attributes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* General Info */}
            <div className="rounded-[14px] border border-[#e3e0d9] bg-white p-5 flex flex-col gap-3">
              <h3 className="font-mono text-[11px] font-semibold text-[#88857f] tracking-wide uppercase border-b border-[#f0efeb] pb-2 m-0">
                General Details
              </h3>
              
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#88857f] font-mono">Client:</span>
                <span className="font-medium text-[#11130f]">{project.customerName || "—"}</span>
              </div>
              
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#88857f] font-mono">Manager:</span>
                <span className="font-medium text-[#11130f]">{project.managerName || "—"}</span>
              </div>

              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#88857f] font-mono">Dates:</span>
                <span className="font-medium text-[#11130f]">
                  {project.startDate || "—"} → {project.endDate || "—"}
                </span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="rounded-[14px] border border-[#e3e0d9] bg-white p-5 flex flex-col gap-3">
              <h3 className="font-mono text-[11px] font-semibold text-[#88857f] tracking-wide uppercase border-b border-[#f0efeb] pb-2 m-0">
                Budget &amp; Spend
              </h3>
              
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#88857f] font-mono">Planned Budget:</span>
                <span className="font-semibold text-[#11130f]">
                  ₹{Number(project.plannedBudget || 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#88857f] font-mono">Actual Spent:</span>
                <span className="font-semibold text-[#5b6e57]">
                  ₹{Number(project.actualBudget || 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#88857f] font-mono">Variance:</span>
                <span className="font-medium text-[#88857f]">
                  ₹{Number((project.plannedBudget || 0) - (project.actualBudget || 0)).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

          </div>

          {/* Description */}
          {project.description && (
            <div className="rounded-[14px] border border-[#e3e0d9] bg-white p-5 flex flex-col gap-2">
              <h3 className="font-mono text-[11px] font-semibold text-[#88857f] tracking-wide uppercase border-b border-[#f0efeb] pb-2 m-0">
                Description
              </h3>
              <p className="text-[13px] text-[#444] leading-relaxed m-0 font-sans whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-[#e3e0d9] bg-white px-7 py-4 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] bg-[#11130f] px-6 py-2.5 font-mono text-[12px] text-white transition hover:bg-[#292c27]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewProjectModal;
