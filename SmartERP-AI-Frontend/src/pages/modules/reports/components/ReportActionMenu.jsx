import React, { useState, useRef, useEffect } from "react";
import { 
  Eye, 
  Edit3, 
  Trash2, 
  Download, 
  Share2, 
  ChevronRight, 
  FileText, 
  FileSpreadsheet, 
  File 
} from "lucide-react";

export default function ReportActionMenu({
  report,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onExportFormat,
}) {
  const [open, setOpen] = useState(false);
  const [exportSubmenuOpen, setExportSubmenuOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, openUpward: false });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Position calculation and viewport collision avoidance
  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = 220;
    const menuWidth = 180;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight && rect.top > menuHeight;

    let top = openUpward ? rect.top - menuHeight : rect.bottom + 4;
    let left = rect.right - menuWidth;

    if (left < 10) left = 10;
    if (left + menuWidth > window.innerWidth - 10) {
      left = window.innerWidth - menuWidth - 10;
    }

    setDropdownPosition({ top, left, openUpward });
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!open) updatePosition();
    setOpen(!open);
    setExportSubmenuOpen(false);
  };

  // Close on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
        setExportSubmenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setExportSubmenuOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        title="Report Actions"
        aria-label="Report Actions"
        className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-[#e0ddd5] bg-white text-[#6b6964] transition hover:border-[#11140f] hover:bg-[#f5f4ef] hover:text-[#11140f] focus:outline-none"
      >
        <span className="font-bold text-[14px] leading-none mb-0.5">⋮</span>
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            zIndex: 9999,
          }}
          className="w-[180px] rounded-[10px] border border-[#e2e0d8] bg-white py-1.5 shadow-xl animate-in fade-in-50 zoom-in-95"
        >
          {/* 1. View */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onView(report);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 font-mono text-[11px] text-[#2d3129] transition hover:bg-[#f4f8f2] hover:text-[#3e5c38]"
          >
            <Eye size={13} className="text-[#8c9187]" />
            <span>View</span>
          </button>

          {/* 2. Edit */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onEdit(report);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 font-mono text-[11px] text-[#2d3129] transition hover:bg-[#f4f8f2] hover:text-[#3e5c38]"
          >
            <Edit3 size={13} className="text-[#8c9187]" />
            <span>Edit</span>
          </button>

          {/* 3. Delete */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete(report);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 font-mono text-[11px] text-[#c93b2b] transition hover:bg-[#fdf3f2]"
          >
            <Trash2 size={13} className="text-[#c93b2b]" />
            <span>Delete</span>
          </button>

          <div className="my-1 border-t border-[#f0eee8]" />

          {/* 4. Download */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDownload(report);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 font-mono text-[11px] text-[#2d3129] transition hover:bg-[#f4f8f2] hover:text-[#3e5c38]"
          >
            <Download size={13} className="text-[#8c9187]" />
            <span>Download</span>
          </button>

          {/* 5. Export with submenu */}
          <div
            className="relative"
            onMouseEnter={() => setExportSubmenuOpen(true)}
            onMouseLeave={() => setExportSubmenuOpen(false)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExportSubmenuOpen(!exportSubmenuOpen);
              }}
              className="flex w-full items-center justify-between px-3.5 py-2 font-mono text-[11px] text-[#2d3129] transition hover:bg-[#f4f8f2] hover:text-[#3e5c38]"
            >
              <div className="flex items-center gap-2.5">
                <Share2 size={13} className="text-[#8c9187]" />
                <span>Export</span>
              </div>
              <ChevronRight size={12} className="text-[#999b94]" />
            </button>

            {/* Submenu: EXACTLY CSV, PDF, Excel */}
            {exportSubmenuOpen && (
              <div
                style={{
                  position: "absolute",
                  left: "100%",
                  top: "-4px",
                  zIndex: 10000,
                }}
                className="w-[140px] rounded-[10px] border border-[#e2e0d8] bg-white py-1.5 shadow-2xl animate-in fade-in-50 zoom-in-95"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    setExportSubmenuOpen(false);
                    onExportFormat(report, "CSV");
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 font-mono text-[10px] text-[#2d3129] transition hover:bg-[#f4f8f2] hover:text-[#3e5c38]"
                >
                  <FileText size={12} className="text-[#5c7455]" />
                  <span>CSV</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    setExportSubmenuOpen(false);
                    onExportFormat(report, "PDF");
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 font-mono text-[10px] text-[#2d3129] transition hover:bg-[#f4f8f2] hover:text-[#3e5c38]"
                >
                  <File size={12} className="text-[#c93b2b]" />
                  <span>PDF</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    setExportSubmenuOpen(false);
                    onExportFormat(report, "EXCEL");
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 font-mono text-[10px] text-[#2d3129] transition hover:bg-[#f4f8f2] hover:text-[#3e5c38]"
                >
                  <FileSpreadsheet size={12} className="text-[#2b8a3e]" />
                  <span>Excel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
