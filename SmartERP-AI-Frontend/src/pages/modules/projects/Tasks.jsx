import React, { useState, useEffect } from "react";
import ProjectsService from "../../../core/services/modules/projects.service";

const Tasks = ({ projects = [] }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projects || projects.length === 0) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError("");

    Promise.allSettled(
      projects.map((project) => ProjectsService.getTasks(project.id))
    )
      .then((results) => {
        const allTasks = [];
        results.forEach((res, index) => {
          if (res.status === "fulfilled" && Array.isArray(res.value?.data)) {
            const project = projects[index];
            res.value.data.forEach((t) => {
              const assignee = t.assignedToName || "Unassigned";
              const initials = (t.assignedToName || "U")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              const projectName = project?.name || `PRJ-${t.projectId}`;
              const priority = t.priority ? t.priority.toUpperCase() : "MEDIUM";
              const priorityClass = t.priority ? t.priority.toLowerCase() : "medium";
              const status = t.status ? t.status.toUpperCase().replaceAll("_", " ") : "TODO";
              const statusClass = t.status ? t.status.toLowerCase().replaceAll("_", "-") : "todo";

              allTasks.push({
                id: t.id,
                task: t.title,
                project: projectName,
                assignee,
                initials,
                due: t.plannedEndDate || "—",
                priority,
                priorityClass,
                status,
                statusClass,
              });
            });
          }
        });
        setTasks(allTasks);
      })
      .catch(() => {
        setError("Unable to load tasks.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projects]);

  return (
    <div className="tasks-page">
      <div className="tasks-inner">
        <section className="tasks-card">
          <div className="tasks-card-header">
            <h2>All Tasks</h2>

            <button type="button" className="tasks-summary-btn">
              ✦ AI Task Summary
            </button>
          </div>

          <div className="tasks-table">
            <div className="tasks-table-header">
              <span>#</span>
              <span>TASK</span>
              <span>PROJECT</span>
              <span>ASSIGNEE</span>
              <span>DUE</span>
              <span>PRIORITY</span>
              <span>STATUS</span>
            </div>

            {tasks.map((item) => (
              <div className="tasks-row" key={item.id}>
                <span className="task-id">#{item.id}</span>

                <span className="task-name">{item.task}</span>

                <span>
                  <em className="task-project-badge">{item.project}</em>
                </span>

                <span className="task-assignee">
                  <span className="assignee-avatar">{item.initials}</span>
                  {item.assignee}
                </span>

                <span className="task-due">{item.due}</span>

                <span>
                  <em className={`task-priority ${item.priorityClass}`}>
                    {item.priority}
                  </em>
                </span>

                <span>
                  <em className={`task-status ${item.statusClass}`}>
                    {item.status}
                  </em>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .tasks-page {
          width: 100%;
          min-height: 100%;
          box-sizing: border-box;
          background: #f5f4ef;
          color: #11140f;
          font-family: var(--sans, "DM Sans", system-ui, sans-serif);
        }

        .tasks-inner {
          width: 100%;
          max-width: 1440x;
          margin: 0 auto;
          padding: 0 0 44px;
          box-sizing: border-box;
        }

        .tasks-card {
          width: 100%;
          overflow: hidden;
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 15px;
          box-sizing: border-box;
        }

        .tasks-card-header {
          min-height: 62px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid #e4e1da;
        }

        .tasks-card-header h2 {
          margin: 0;
          font-family: var(--serif, "DM Serif Display", Georgia, serif);
          font-size: 18px;
          font-weight: 400;
        }

        .tasks-summary-btn {
          height: 31px;
          padding: 0 12px;
          border: 1px solid #dfe6d9;
          border-radius: 10px;
          background: #f3f6ef;
          color: #667160;
          font-family: monospace;
          font-size: 8px;
          cursor: pointer;
          white-space: nowrap;
        }

        .tasks-table {
          width: 100%;
          overflow-x: auto;
        }

        .tasks-table-header,
        .tasks-row {
          min-width: 920px;
          display: grid;
          grid-template-columns: 70px 2.7fr 1.35fr 1.5fr 1.05fr 1fr 1.25fr;
          align-items: center;
          column-gap: 8px;
          box-sizing: border-box;
        }

        .tasks-table-header {
          min-height: 39px;
          padding: 0 20px;
          background: #f5f4ef;
          border-bottom: 1px solid #e4e1da;
          color: #aaa69f;
          font-size: 7px;
          letter-spacing: 1px;
        }

        .tasks-row {
          min-height: 59px;
          padding: 0 20px;
          border-bottom: 1px solid #e5e2db;
          color: #8f8b84;
          font-family: monospace;
          font-size: 8px;
        }

        .tasks-row:last-child {
          border-bottom: 0;
        }

        .task-id {
          color: #b2ada5;
        }

        .task-name {
          color: #11140f;
          font-size: 10px;
        }

        .task-project-badge,
        .task-priority,
        .task-status {
          display: inline-flex;
          align-items: center;
          min-height: 21px;
          padding: 0 9px;
          border-radius: 9px;
          box-sizing: border-box;
          font-style: normal;
          white-space: nowrap;
        }

        .task-project-badge {
          background: #f5f3ee;
          border: 1px solid #e4e0d7;
          color: #77736d;
        }

        .task-assignee {
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .assignee-avatar {
          width: 20px;
          height: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #edf0e9;
          color: #778073;
          font-size: 6px;
        }

        .task-due {
          color: #98938b;
          white-space: nowrap;
        }

        .task-priority.high {
          background: #f3e9e8;
          color: #a26763;
        }

        .task-priority.medium {
          background: #f2eee4;
          color: #9a8755;
        }

        .task-priority.low {
          background: #eceae4;
          color: #7d7a71;
        }

        .task-status.in-progress {
          background: #edeaf1;
          color: #777089;
        }

        .task-status.pending {
          background: #eceaf1;
          color: #777089;
        }

        .task-status.completed {
          background: #e4eee3;
          color: #5d7359;
        }

        button:focus-visible {
          outline: 2px solid #a0b290;
          outline-offset: 2px;
        }
        @media (max-width: 780px) {
.tasks-card-header {
            align-items: flex-start;
            flex-direction: column;
            justify-content: center;
            padding: 14px 16px;
          }
        }

      `}</style>
    </div>
  );
};

export default Tasks;