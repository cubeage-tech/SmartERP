import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Edit3,
  PackagePlus,
  SlidersHorizontal,
  History,
  ArrowLeftRight,
  Trash2,
} from "lucide-react";

export default function ActionMenu({
  item,
  onEdit,
  onRestock,
  onAdjust,
  onHistory,
  onTransfer,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Click outside and Escape handler
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleAction = (actionFn) => {
    setOpen(false);
    if (actionFn) actionFn(item);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Item actions"
        className="
          inline-flex h-[28px] w-[28px] items-center justify-center rounded-[7px]
          border border-[#deddd5] bg-[#fbfaf7] text-[#777a73]
          transition hover:bg-[#f0efe9] hover:text-[#11130f] focus:outline-none
        "
      >
        <MoreVertical size={14} />
      </button>

      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="
            absolute right-0 top-full z-[100] mt-1.5 min-w-[170px]
            rounded-[10px] border border-[#e2e0d8] bg-white p-1
            shadow-lg ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95
          "
        >
          {/* 1. Edit Item */}
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onEdit)}
            className="
              flex w-full items-center gap-2 rounded-[6px] px-2.5 py-1.5
              font-mono text-[11px] text-[#333630] transition hover:bg-[#f5f4ef]
            "
          >
            <Edit3 size={13} className="text-[#777a73]" />
            <span>Edit Item</span>
          </button>

          {/* 2. Restock */}
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onRestock)}
            className="
              flex w-full items-center gap-2 rounded-[6px] px-2.5 py-1.5
              font-mono text-[11px] text-[#333630] transition hover:bg-[#f5f4ef]
            "
          >
            <PackagePlus size={13} className="text-[#3d5940]" />
            <span>Restock</span>
          </button>

          {/* 3. Adjust Stock */}
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onAdjust)}
            className="
              flex w-full items-center gap-2 rounded-[6px] px-2.5 py-1.5
              font-mono text-[11px] text-[#333630] transition hover:bg-[#f5f4ef]
            "
          >
            <SlidersHorizontal size={13} className="text-[#777a73]" />
            <span>Adjust Stock</span>
          </button>

          {/* 4. View Stock History */}
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onHistory)}
            className="
              flex w-full items-center gap-2 rounded-[6px] px-2.5 py-1.5
              font-mono text-[11px] text-[#333630] transition hover:bg-[#f5f4ef]
            "
          >
            <History size={13} className="text-[#777a73]" />
            <span>View Stock History</span>
          </button>

          {/* 5. Transfer Stock */}
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onTransfer)}
            className="
              flex w-full items-center gap-2 rounded-[6px] px-2.5 py-1.5
              font-mono text-[11px] text-[#333630] transition hover:bg-[#f5f4ef]
            "
          >
            <ArrowLeftRight size={13} className="text-[#777a73]" />
            <span>Transfer Stock</span>
          </button>

          <div className="my-1 border-t border-[#f0efeb]" />

          {/* 6. Delete Item */}
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onDelete)}
            className="
              flex w-full items-center gap-2 rounded-[6px] px-2.5 py-1.5
              font-mono text-[11px] text-[#b05a52] transition hover:bg-[#fdf2f2] hover:text-[#9e3a32]
            "
          >
            <Trash2 size={13} />
            <span>Delete Item</span>
          </button>
        </div>
      )}
    </div>
  );
}
