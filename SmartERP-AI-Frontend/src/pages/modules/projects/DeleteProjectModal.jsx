import React, { useEffect } from "react";

const DeleteProjectModal = ({ open, project, onClose, onConfirm, deleting }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !deleting) onClose();
    };
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, deleting]);

  if (!open || !project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !deleting) onClose();
      }}
    >
      <div className="relative w-full max-w-[460px] rounded-[18px] bg-white shadow-2xl border border-[#e2dfd7] overflow-hidden p-6 flex flex-col gap-4">
        
        {/* Warning Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1f0] border border-[#ffccc7] text-[#d9534f]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <h3 className="font-serif text-[18px] text-[#11130f] m-0">Delete Project</h3>
            <p className="font-mono text-[11px] text-[#88857f] m-0">This action cannot be undone</p>
          </div>
        </div>

        {/* Project Details */}
        <div className="rounded-[12px] bg-[#fcfbf9] border border-[#e8e6df] p-3.5 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-[#88857f] font-mono">Project:</span>
            <span className="font-semibold text-[#11130f]">{project.name}</span>
          </div>
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-[#88857f] font-mono">Code:</span>
            <span className="font-mono text-[11px] text-[#55534e] bg-[#f0efeb] px-1.5 py-0.5 rounded">
              {project.projectCode || "—"}
            </span>
          </div>
          {project.customerName && (
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#88857f] font-mono">Client:</span>
              <span className="text-[#55534e]">{project.customerName}</span>
            </div>
          )}
        </div>

        <p className="text-[12px] text-[#666] leading-relaxed m-0 font-sans">
          Are you sure you want to permanently delete <strong className="text-[#11130f]">{project.name}</strong>? All associated tasks, milestones, and budget records will also be removed.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            disabled={deleting}
            onClick={onClose}
            className="rounded-[10px] border border-[#e3e0d9] bg-white px-4 py-2 font-mono text-[12px] text-[#303531] transition hover:bg-[#f0efeb] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={() => onConfirm(project.id)}
            className="flex items-center gap-2 rounded-[10px] bg-[#d9534f] px-4 py-2 font-mono text-[12px] text-white transition hover:bg-[#c9302c] disabled:opacity-50"
          >
            {deleting ? (
              <>
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              "Delete Project"
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteProjectModal;
