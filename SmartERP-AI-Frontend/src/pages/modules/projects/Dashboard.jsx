import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProjectsService from "../../../core/services/modules/projects.service";
import storageService from "../../../core/services/storage.service";
import ProjectPlanning from "./ProjectPlanning";
import Tasks from "./Tasks";
import TimeTracking from "./TimeTracking";
import BudgetMonitoring from "./BudgetMonitoring";
import LeaveManagement from "../employee/LeaveManagement";
import NewProjectModal from "./NewProjectModal";
import ViewProjectModal from "./ViewProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    queryTab && ["projects", "tasks", "timeline", "budget", "leave"].includes(queryTab)
      ? queryTab
      : "projects"
  );

  useEffect(() => {
    if (queryTab && ["projects", "tasks", "timeline", "budget", "leave"].includes(queryTab)) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewProject, setViewProject] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteProject, setDeleteProject] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    const user = storageService.getUser();
    const role = String(user?.role || user?.roles?.[0] || "").toUpperCase().replace(/^ROLE_/, "");
    const AUTHORIZED_ROLES = ["SUPER_ADMIN", "TENANT_ADMIN", "PROJECT_MANAGER", "EXECUTIVE_OWNER"];

    if (!AUTHORIZED_ROLES.includes(role)) {
      return;
    }

    try {
      const { data } = await ProjectsService.getDashboard();
      setDashboardStats(data);
    } catch {
      // Non-blocking fallback for dashboard stats
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await ProjectsService.getAll();
      setProjects(data);
      setError("");
    } catch (requestError) {
      const responseData = requestError.response?.data;
      setError(responseData?.detail || responseData?.message || "Unable to load projects.");
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchDashboardData();
  }, []);

  const handleProjectCreated = async (form) => {
    const user = storageService.getUser();
    try {
      const { data } = await ProjectsService.create({
        projectCode: form.projectCode,
        name: form.projectName,
        description: form.description || null,
        customerName: form.client || null,
        managerUserId: Number.isInteger(Number(user?.id)) ? Number(user.id) : null,
        managerName: form.projectManager || user?.name,
        startDate: form.startDate,
        endDate: form.expectedEnd,
        priority: (() => {
          const VALID = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
          const resolved = (form.priority || "Medium")
            .toUpperCase()
            .replaceAll(" ", "_");
          return VALID.includes(resolved) ? resolved : "MEDIUM";
        })(),
        plannedBudget: Number(form.totalBudget),
      });
      setProjects((current) => [data, ...current]);
      fetchDashboardData();
      setNewProjectOpen(false);
      setError("");
    } catch (requestError) {
      const responseData = requestError.response?.data;
      setError(responseData?.detail || responseData?.message || responseData?.title || "Unable to create the project.");
    }
  };

  const handleViewProject = async (project) => {
    try {
      const { data } = await ProjectsService.getById(project.id);
      setViewProject(data);
    } catch {
      setViewProject(project);
    }
    setViewModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditProject(project);
  };

  const handleDeleteProjectPrompt = (project) => {
    setDeleteProject(project);
    setDeleteModalOpen(true);
  };

  const handleProjectUpdated = async (id, form) => {
    const user = storageService.getUser();
    try {
      const { data } = await ProjectsService.update(id, {
        name: form.projectName,
        description: form.description || null,
        managerUserId: Number.isInteger(Number(user?.id)) ? Number(user.id) : null,
        managerName: form.projectManager || user?.name,
        startDate: form.startDate,
        endDate: form.expectedEnd,
        status: (() => {
          const VALID = ["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED", "ARCHIVED"];
          const resolved = (form.status || "Planning")
            .toUpperCase()
            .replaceAll(" ", "_");
          return VALID.includes(resolved) ? resolved : "PLANNING";
        })(),
        priority: (() => {
          const VALID = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
          const resolved = (form.priority || "Medium")
            .toUpperCase()
            .replaceAll(" ", "_");
          return VALID.includes(resolved) ? resolved : "MEDIUM";
        })(),
        plannedBudget: Number(form.totalBudget),
        progressPercent: Number(form.initialProgress || 0),
      });

      setProjects((current) => current.map((p) => (p.id === id ? data : p)));
      fetchDashboardData();
      setEditProject(null);
      setError("");
    } catch (requestError) {
      const responseData = requestError.response?.data;
      setError(responseData?.detail || responseData?.message || responseData?.title || "Unable to update the project.");
    }
  };

  const handleConfirmDelete = async (id) => {
    try {
      setDeleting(true);
      await ProjectsService.remove(id);
      setProjects((current) => current.filter((p) => p.id !== id));
      fetchDashboardData();
      setDeleteModalOpen(false);
      setDeleteProject(null);
      setError("");
    } catch (requestError) {
      const responseData = requestError.response?.data;
      setError(responseData?.detail || responseData?.message || "Unable to delete the project.");
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = () => {
    try {
      const escapeCsv = (val) => {
        if (val == null) return "";
        const str = String(val);
        if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
          return `"${str.replaceAll('"', '""')}"`;
        }
        return str;
      };

      const headers = [
        "Project Code",
        "Name",
        "Status",
        "Priority",
        "Manager",
        "Start Date",
        "End Date",
        "Planned Budget",
        "Progress %"
      ];

      const rows = projects.map((p) => [
        escapeCsv(p.projectCode ?? ""),
        escapeCsv(p.name ?? ""),
        escapeCsv(p.status ?? ""),
        escapeCsv(p.priority ?? ""),
        escapeCsv(p.managerName ?? ""),
        escapeCsv(p.startDate ?? ""),
        escapeCsv(p.endDate ?? ""),
        escapeCsv(p.plannedBudget ?? 0),
        escapeCsv(p.progressPercent ?? 0),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "projects-export.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export projects to CSV:", err);
    }
  };

  const projectStats = useMemo(() => ({
    active: projects.filter((project) => !["COMPLETED", "CANCELLED"].includes(project.status)).length,
    budget: projects.reduce((total, project) => total + Number(project.plannedBudget || 0), 0),
  }), [projects]);

  const tabs = [
    { id: "projects", label: "PROJECTS", enabled: true },
    { id: "tasks", label: "TASKS", enabled: true },
    { id: "timeline", label: "TIMELINE", enabled: true },
    { id: "budget", label: "BUDGET", enabled: true },
    { id: "leave", label: "LEAVE", enabled: true },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "projects":
        return (
          <ProjectPlanning
            projects={projects}
            onView={handleViewProject}
            onEdit={handleEditProject}
            onDelete={handleDeleteProjectPrompt}
            onNewProject={() => setNewProjectOpen(true)}
          />
        );

      case "tasks":
        return <Tasks projects={projects} />;

      case "timeline":
        return <TimeTracking projects={projects} />;

      case "budget":
        return <BudgetMonitoring projects={projects} />;

      case "leave":
        return <LeaveManagement />;

      default:
        return (
          <ProjectPlanning
            projects={projects}
            onView={handleViewProject}
            onEdit={handleEditProject}
            onDelete={handleDeleteProjectPrompt}
            onNewProject={() => setNewProjectOpen(true)}
          />
        );
    }
  };

  return (
    <div className="projects-dashboard">

      {/* =====================================================
          COMMON PAGE HEADER
      ====================================================== */}
      <header className="projects-dashboard-header">

        <div>
          <div className="projects-eyebrow">
            WORK
          </div>

          <h1>
            Projects &amp; Tasks
          </h1>
        </div>

        <div className="projects-header-actions">

          <button
            type="button"
            className="projects-ai-btn"
          >
            ✦ Ask AI
          </button>

          <button
            type="button"
            className="projects-export-btn"
            onClick={handleExportCSV}
          >
            ↓ Export
          </button>

          <button
            type="button"
            className="projects-new-btn"
            onClick={() => setNewProjectOpen(true)}
          >
            + New Project
          </button>

        </div>

      </header>


      {/* =====================================================
          COMMON KPI CARDS
      ====================================================== */}
      <section className="projects-kpi-grid">

        <div className="projects-kpi-card">
          <strong>{dashboardStats?.activeProjects ?? (projects.filter((p) => !["COMPLETED", "CANCELLED"].includes(p.status)).length)}</strong>
          <span>ACTIVE PROJECTS</span>
          <small>
            {dashboardStats
              ? `${dashboardStats.totalProjects ?? 0} total (${dashboardStats.completedProjects ?? 0} completed)`
              : `${projectStats.active} total loaded`}
          </small>
        </div>

        <div className="projects-kpi-card">
          <strong>₹{Number(dashboardStats?.totalPlannedBudget ?? projectStats.budget).toLocaleString("en-IN")}</strong>
          <span>TOTAL BUDGET</span>
          <small>
            {dashboardStats
              ? `Spent: ₹${Number(dashboardStats.totalActualBudget ?? 0).toLocaleString("en-IN")}`
              : "From saved projects"}
          </small>
        </div>

        <div className="projects-kpi-card">
          <strong>{dashboardStats?.overdueTasks ?? 0}</strong>
          <span>OVERDUE TASKS</span>
          <small>
            {dashboardStats
              ? `${dashboardStats.atRiskProjects ?? 0} projects at risk`
              : "No task data loaded"}
          </small>
        </div>

        <div className="projects-kpi-card">
          <strong>{dashboardStats?.budgetUtilizationPercent != null ? `${Number(dashboardStats.budgetUtilizationPercent).toFixed(1)}%` : "0.0%"}</strong>
          <span>BUDGET UTILIZATION</span>
          <small>
            {dashboardStats
              ? "Based on actual spend"
              : "No historical data"}
          </small>
        </div>

      </section>


      {/* =====================================================
          PARENT MODULE NAVIGATION
      ====================================================== */}
      <nav
        className="projects-dashboard-tabs"
        aria-label="Projects module navigation"
      >

        {tabs.map((tab) => (

          <button
            key={tab.id}
            type="button"
            disabled={!tab.enabled}
            className={`projects-dashboard-tab ${
              activeTab === tab.id ? "active" : ""
            } ${!tab.enabled ? "disabled" : ""}`}
            onClick={() => {
              if (tab.enabled) {
                setActiveTab(tab.id);
                if (tab.id === "projects") {
                  setSearchParams({});
                } else {
                  setSearchParams({ tab: tab.id });
                }
              }
            }}
            aria-current={
              activeTab === tab.id ? "page" : undefined
            }
          >
            {tab.label}
          </button>

        ))}

      </nav>


      {/* =====================================================
          ACTIVE CHILD PAGE
      ====================================================== */}
      <main className="projects-dashboard-content">
        {error && <div className="projects-api-message">{error}</div>}
        {renderTabContent()}
      </main>

      {/* Create New Project Modal */}
      <NewProjectModal
        open={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        onCreate={handleProjectCreated}
      />

      {/* Edit Project Modal */}
      <NewProjectModal
        open={Boolean(editProject)}
        initialData={editProject}
        onClose={() => setEditProject(null)}
        onUpdate={handleProjectUpdated}
      />

      {/* View Project Details Modal */}
      <ViewProjectModal
        open={viewModalOpen}
        project={viewProject}
        onClose={() => {
          setViewModalOpen(false);
          setViewProject(null);
        }}
        onEdit={(proj) => {
          setViewModalOpen(false);
          setEditProject(proj);
        }}
      />

      {/* Delete Project Confirmation Modal */}
      <DeleteProjectModal
        open={deleteModalOpen}
        project={deleteProject}
        deleting={deleting}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteProject(null);
        }}
        onConfirm={handleConfirmDelete}
      />


      {/* =====================================================
          CSS
      ====================================================== */}
      <style>{`

        .projects-dashboard {
          width: 100%;
          min-height: 100%;
          box-sizing: border-box;

          padding:
            35px  35px 50px;

          background:
            #f5f4ef;

          color:
            #11140f;

          font-family:
            var(--sans),
            "DM Sans",
            system-ui,
            sans-serif;
        }


        /* ================= HEADER ================= */

        .projects-dashboard-header {
          display:
            flex;

          align-items:
            flex-end;

          justify-content:
            space-between;

          gap:
            24px;

          margin-bottom:
            24px;
        }


        .projects-eyebrow {
          margin-bottom:
            7px;

          font-size:
            9px;

          letter-spacing:
            1.6px;

          color:
            #99978f;
        }


        .projects-dashboard-header h1 {
          margin:
            0;

          font-family:
            var(--serif),
            "DM Serif Display",
            Georgia,
            serif;

          font-size:
            29px;

          line-height:
            1.1;

          font-weight:
            400;
        }


        .projects-header-actions {
          display:
            flex;

          align-items:
            center;

          gap:
            8px;
        }


        .projects-header-actions button {
          height:
            38px;

          padding:
            0 16px;

          border-radius:
            12px;

          font-family:
            var(--sans),
            "DM Sans",
            system-ui,
            sans-serif;

          font-size:
            9px;

          cursor:
            pointer;

          white-space:
            nowrap;
        }


        .projects-ai-btn {
          background:
            #edf1e8;

          border:
            1px solid #dfe6d9;

          color:
            #52614d;
        }


        .projects-export-btn {
          background:
            #fff;

          border:
            1px solid #e0ddd5;

          color:
            #44423e;
        }


        .projects-new-btn {
          background:
            #111410;

          border:
            1px solid #111410;

          color:
            #fff;
        }


        /* ================= KPI ================= */

        .projects-kpi-grid {
          display:
            grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap:
            12px;

          margin-bottom:
            18px;
        }


        .projects-kpi-card {
          min-height:
            103px;

          padding:
            18px;

          box-sizing:
            border-box;

          background:
            #fff;

          border:
            1px solid #e1dfd8;

          border-radius:
            14px;
        }


        .projects-kpi-card strong {
          display:
            block;

          margin-bottom:
            7px;

          font-family:
            var(--serif),
            "DM Serif Display",
            Georgia,
            serif;

          font-size:
            24px;

          line-height:
            1;

          font-weight:
            400;
        }


        .projects-kpi-card span {
          display:
            block;

          margin-bottom:
            7px;

          font-size:
            8px;

          letter-spacing:
            1px;

          color:
            #9f9a92;
        }


        .projects-kpi-card small {
          font-size:
            9px;

          color:
            #55524d;
        }


        /* ================= PARENT TABS ================= */

        .projects-dashboard-tabs {
          display:
            flex;

          align-items:
            center;

          gap:
            4px;

          margin-bottom:
            22px;

          padding-left:
            2px;

          overflow-x:
            auto;

          white-space:
            nowrap;

          scrollbar-width:
            none;
        }


        .projects-dashboard-tabs::-webkit-scrollbar {
          display:
            none;
        }


        .projects-dashboard-tab {
          height:
            42px;

          min-width:
            92px;

          padding:
            0 22px;

          border:
            1px solid transparent;

          border-radius:
            10px;

          background:
            transparent;

          color:
            #8d8981;

          font-family:
            monospace;

          font-size:
            10px;

          letter-spacing:
            1px;

          cursor:
            pointer;

          flex-shrink:
            0;

          transition:
            background .15s ease,
            border-color .15s ease,
            color .15s ease;
        }


        .projects-dashboard-tab:hover:not(.disabled) {
          color:
            #151713;
        }


        .projects-dashboard-tab.active {
          background:
            #fff;

          color:
            #11140f;

          border-color:
            #e3e0d9;

          box-shadow:
            0 2px 6px
            rgba(0, 0, 0, .06);
        }


        .projects-dashboard-tab.disabled {
          color:
            #bbb7b0;

          cursor:
            not-allowed;

          opacity:
            .7;
        }


        /* ================= CONTENT ================= */

        .projects-dashboard-content {
          width:
            100%;

          min-height:
            200px;
        }


        .projects-coming-soon {
          min-height:
            250px;

          display:
            grid;

          place-items:
            center;

          background:
            #fff;

          border:
            1px solid #e1dfd8;

          border-radius:
            15px;

          color:
            #99958d;

          font-family:
            monospace;

          font-size:
            10px;
        }


        button:focus-visible {
          outline:
            2px solid #a0b290;

          outline-offset:
            2px;
        }


        /* ================= RESPONSIVE ================= */

        @media (max-width: 1000px) {

          .projects-kpi-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

        }


        @media (max-width: 780px) {

          .projects-dashboard {
            padding:
              20px 16px 40px;
          }


          .projects-dashboard-header {
            align-items:
              flex-start;

            flex-direction:
              column;
          }


          .projects-header-actions {
            width:
              100%;
          }


          .projects-header-actions button {
            flex:
              1;
          }

        }


        @media (max-width: 560px) {

          .projects-kpi-grid {
            grid-template-columns:
              1fr;
          }


          .projects-header-actions {
            flex-wrap:
              wrap;
          }


          .projects-header-actions button {
            flex:
              1 1 calc(50% - 4px);
          }


          .projects-dashboard-header h1 {
            font-size:
              25px;
          }

        }

      `}</style>

    </div>
  );
};

export default Dashboard;