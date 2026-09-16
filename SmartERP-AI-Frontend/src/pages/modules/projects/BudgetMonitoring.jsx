import React, { useState, useEffect } from "react";
import ProjectsService from "../../../core/services/modules/projects.service";

const BudgetMonitoring = ({ projects = [] }) => {
  const [budgetData, setBudgetData] = useState([]);
  const [summary, setSummary] = useState({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projects || projects.length === 0) {
      setBudgetData([]);
      setSummary({ totalBudget: 0, totalSpent: 0, remaining: 0 });
      return;
    }

    setLoading(true);

    Promise.allSettled(
      projects.map((project) => ProjectsService.getBudget(project.id))
    )
      .then((results) => {
        let sumPlanned = 0;
        let sumSpent = 0;

        const merged = projects.map((project, index) => {
          const res = results[index];
          let planned = Number(project.plannedBudget || 0);
          let spent = Number(project.actualBudget || 0);
          let variance = planned - spent;
          let utilPercent = planned > 0 ? (spent / planned) * 100 : 0;
          let overThreshold = false;

          if (res.status === "fulfilled" && res.value?.data) {
            const b = res.value.data;
            planned = Number(b.plannedBudget ?? planned);
            spent = Number(b.actualBudget ?? spent);
            variance = Number(b.variance ?? (planned - spent));
            utilPercent = Number(b.utilizationPercent ?? utilPercent);
            overThreshold = Boolean(b.overBudgetThreshold);
          }

          sumPlanned += planned;
          sumSpent += spent;

          const isCompleted = ["COMPLETED", "completed"].includes(project.status);
          const status = overThreshold
            ? "At Risk"
            : isCompleted
            ? "Completed"
            : "On Track";
          const statusClass = overThreshold
            ? "at-risk"
            : isCompleted
            ? "completed"
            : "on-track";

          return {
            id: project.id,
            name: project.name,
            manager: project.managerName || "Unassigned",
            status,
            statusClass,
            spent: `₹${spent.toLocaleString("en-IN")}`,
            budget: `₹${planned.toLocaleString("en-IN")}`,
            used: Number(utilPercent.toFixed(1)),
            remaining: `₹${Math.max(0, variance).toLocaleString("en-IN")}`,
          };
        });

        setSummary({
          totalBudget: sumPlanned,
          totalSpent: sumSpent,
          remaining: sumPlanned - sumSpent,
        });
        setBudgetData(merged);
      })
      .catch(() => {
        setBudgetData([]);
        setSummary({ totalBudget: 0, totalSpent: 0, remaining: 0 });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projects]);

  return (
    <div className="budget-page">
      <div className="budget-content">
        <section className="budget-summary">
          <div className="budget-summary-card">
            <strong>₹{Number(summary.totalBudget).toLocaleString("en-IN")}</strong>
            <span>TOTAL BUDGET</span>
          </div>

          <div className="budget-summary-card">
            <strong>₹{Number(summary.totalSpent).toLocaleString("en-IN")}</strong>
            <span>TOTAL SPENT</span>
          </div>

          <div className="budget-summary-card">
            <strong>₹{Number(summary.remaining).toLocaleString("en-IN")}</strong>
            <span>REMAINING</span>
          </div>
        </section>

        <section className="budget-project-list">
          {budgetData.map((project) => (
            <article className="budget-project-card" key={project.id || project.name}>
              <div className="budget-project-header">
                <div>
                  <h2>{project.name}</h2>
                  <p>{project.manager}</p>
                </div>

                <span className={`budget-status ${project.statusClass}`}>
                  {project.status}
                </span>
              </div>

              <div className="budget-spend-row">
                <strong>{project.spent}</strong>
                <span>/ {project.budget}</span>
              </div>

              <div className="budget-progress-track">
                <div
                  className={`budget-progress-fill ${project.statusClass}`}
                  style={{ width: `${Math.min(Math.max(project.used, 0), 100)}%` }}
                />
              </div>

              <div className="budget-project-footer">
                <span>{project.used}% used</span>
                <span>Remaining: {project.remaining}</span>
              </div>
            </article>
          ))}
        </section>
      </div>

      <style>{`
        .budget-page {
          width: 100%;
          box-sizing: border-box;
          background: #f5f4ef;
          color: #11140f;
          font-family: var(--sans, "DM Sans", system-ui, sans-serif);
        }

        /* Parent Dashboard controls the outer page margin. */
        .budget-content {
          width: 100%;
          max-width: none;
          margin: 0;
          padding: 0 0 36px;
          box-sizing: border-box;
        }

        .budget-summary {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 10px;
          box-sizing: border-box;
        }

        .budget-summary-card {
          width: 100%;
          min-height: 82px;
          padding: 16px 18px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 14px;
        }

        .budget-summary-card strong {
          margin-bottom: 6px;
          font-family: var(--serif, "DM Serif Display", Georgia, serif);
          font-size: 22px;
          line-height: 1;
          font-weight: 400;
        }

        .budget-summary-card span {
          font-size: 8px;
          letter-spacing: 1px;
          color: #a19d95;
        }

        .budget-project-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-sizing: border-box;
        }

        .budget-project-card {
          width: 100%;
          padding: 20px 20px 18px;
          box-sizing: border-box;
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 15px;
        }

        .budget-project-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .budget-project-header h2 {
          margin: 0 0 5px;
          font-family: var(--serif, "DM Serif Display", Georgia, serif);
          font-size: 18px;
          line-height: 1.15;
          font-weight: 400;
        }

        .budget-project-header p {
          margin: 0;
          font-family: monospace;
          font-size: 8px;
          color: #a29d95;
        }

        .budget-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 24px;
          padding: 0 10px;
          border-radius: 9px;
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 0.6px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .budget-status.on-track {
          background: #e7eee2;
          color: #5d7058;
        }

        .budget-status.at-risk {
          background: #eee9dc;
          color: #8b7b4b;
        }

        .budget-status.completed {
          background: #e4ece1;
          color: #5b7157;
        }

        .budget-spend-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 14px;
        }

        .budget-spend-row strong {
          font-family: var(--serif, "DM Serif Display", Georgia, serif);
          font-size: 22px;
          line-height: 1;
          font-weight: 400;
        }

        .budget-spend-row span {
          font-family: monospace;
          font-size: 8px;
          color: #b0aba4;
        }

        .budget-progress-track {
          width: 100%;
          height: 9px;
          margin-bottom: 10px;
          overflow: hidden;
          border-radius: 6px;
          background: #f0efeb;
        }

        .budget-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: #a2b793;
        }

        .budget-progress-fill.at-risk {
          background: #ad9f70;
        }

        .budget-progress-fill.completed {
          background: #a79b72;
        }

        .budget-project-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 8px;
          color: #a09b93;
        }

        .budget-project-footer span + span::before {
          content: "·";
          margin-right: 8px;
          color: #beb9b1;
        }

        @media (max-width: 900px) {
          .budget-summary {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .budget-summary-card {
            min-height: 76px;
          }

          .budget-project-card {
            padding: 16px 16px 15px;
          }

          .budget-project-header {
            gap: 12px;
          }

          .budget-project-header h2 {
            font-size: 17px;
          }

          .budget-project-footer {
            flex-wrap: wrap;
          }

          .budget-project-footer span + span::before {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default BudgetMonitoring;