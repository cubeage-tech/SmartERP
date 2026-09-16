import React, { useState, useRef, useEffect } from "react";

const ProjectActionMenu = ({ project, onView, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
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

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="project-action-menu-container" ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        className="project-action-trigger"
        aria-label="Project Actions"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "30px",
          height: "30px",
          borderRadius: "8px",
          border: "1px solid #e1dfd8",
          background: open ? "#f0efeb" : "#ffffff",
          color: "#55534e",
          cursor: "pointer",
          fontSize: "16px",
          lineHeight: 1,
          transition: "all 0.15s ease",
        }}
      >
        ⋮
      </button>

      {open && (
        <div
          className="project-dropdown-menu"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            zIndex: 50,
            minWidth: "140px",
            background: "#ffffff",
            border: "1px solid #e2dfd7",
            borderRadius: "10px",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
            padding: "4px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {/* 1. View */}
          <button
            type="button"
            className="project-menu-item"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              if (onView) onView(project);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              padding: "7px 10px",
              background: "transparent",
              border: "none",
              borderRadius: "6px",
              color: "#303531",
              fontSize: "12px",
              fontFamily: "var(--sans, 'DM Sans', sans-serif)",
              textAlign: "left",
              cursor: "pointer",
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f4f8f2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>View</span>
          </button>

          {/* 2. Edit */}
          <button
            type="button"
            className="project-menu-item"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              if (onEdit) onEdit(project);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              padding: "7px 10px",
              background: "transparent",
              border: "none",
              borderRadius: "6px",
              color: "#303531",
              fontSize: "12px",
              fontFamily: "var(--sans, 'DM Sans', sans-serif)",
              textAlign: "left",
              cursor: "pointer",
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f4f8f2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Edit</span>
          </button>

          {/* 3. Delete */}
          <button
            type="button"
            className="project-menu-item project-menu-item-danger"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              if (onDelete) onDelete(project);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              padding: "7px 10px",
              background: "transparent",
              border: "none",
              borderRadius: "6px",
              color: "#d9534f",
              fontSize: "12px",
              fontFamily: "var(--sans, 'DM Sans', sans-serif)",
              textAlign: "left",
              cursor: "pointer",
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fff1f0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d9534f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectActionMenu;
