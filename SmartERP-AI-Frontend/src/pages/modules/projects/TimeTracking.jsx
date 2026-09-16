import React, { useState, useEffect } from "react";
import ProjectsService from "../../../core/services/modules/projects.service";

const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const TimeTracking = ({ projects = [] }) => {
  const [timelineItems, setTimelineItems] = useState([]);
  const [months, setMonths] = useState(MONTH_NAMES.slice(0, 9));
  const [timelineTitle, setTimelineTitle] = useState("Project Timeline");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projects || projects.length === 0) {
      setTimelineItems([]);
      setTimelineTitle("Project Timeline");
      return;
    }

    setLoading(true);

    Promise.allSettled(
      projects.map((project) => ProjectsService.getGantt(project.id))
    )
      .then((results) => {
        const rawItems = [];

        results.forEach((res, index) => {
          const fallbackProject = projects[index];
          if (res.status === "fulfilled" && res.value?.data) {
            const data = res.value.data;
            const project = data.project || fallbackProject;
            const tasks = Array.isArray(data.tasks) ? data.tasks : [];
            const milestones = Array.isArray(data.milestones) ? data.milestones : [];

            if (tasks.length === 0 && milestones.length === 0) {
              if (project) {
                const isCompleted = ["COMPLETED", "completed"].includes(project.status);
                rawItems.push({
                  id: `prj-${project.id}`,
                  name: project.name,
                  startDate: project.startDate,
                  endDate: project.endDate,
                  progress: project.progressPercent ?? 0,
                  status: isCompleted ? "Completed" : "On Track",
                  statusClass: isCompleted ? "completed" : "on-track",
                });
              }
            } else {
              tasks.forEach((t) => {
                const isCompleted = ["COMPLETED", "completed"].includes(t.status);
                const isAtRisk = Boolean(t.atRisk);
                rawItems.push({
                  id: `task-${t.id}`,
                  name: t.title,
                  startDate: t.plannedStartDate || project?.startDate,
                  endDate: t.plannedEndDate || project?.endDate,
                  progress: t.progressPercent ?? 0,
                  status: isAtRisk ? "At Risk" : isCompleted ? "Completed" : "On Track",
                  statusClass: isAtRisk ? "at-risk" : isCompleted ? "completed" : "on-track",
                });
              });

              milestones.forEach((m) => {
                const isCompleted = ["COMPLETED", "completed"].includes(m.status);
                rawItems.push({
                  id: `ms-${m.id}`,
                  name: `◆ ${m.name}`,
                  startDate: m.plannedDate || project?.startDate,
                  endDate: m.plannedDate || project?.endDate,
                  progress: m.progressPercent ?? 0,
                  status: isCompleted ? "Completed" : "On Track",
                  statusClass: isCompleted ? "completed" : "on-track",
                });
              });
            }
          } else if (fallbackProject) {
            const isCompleted = ["COMPLETED", "completed"].includes(fallbackProject.status);
            rawItems.push({
              id: `prj-${fallbackProject.id}`,
              name: fallbackProject.name,
              startDate: fallbackProject.startDate,
              endDate: fallbackProject.endDate,
              progress: fallbackProject.progressPercent ?? 0,
              status: isCompleted ? "Completed" : "On Track",
              statusClass: isCompleted ? "completed" : "on-track",
            });
          }
        });

        const validDates = rawItems
          .flatMap((item) => [item.startDate ? new Date(item.startDate) : null, item.endDate ? new Date(item.endDate) : null])
          .filter((d) => d && !isNaN(d.getTime()));

        if (validDates.length === 0) {
          setTimelineItems([]);
          setMonths(MONTH_NAMES.slice(0, 9));
          setTimelineTitle("Project Timeline");
          return;
        }

        const minDate = new Date(Math.min(...validDates.map((d) => d.getTime())));
        const startYear = minDate.getFullYear();
        const startMonthIdx = minDate.getMonth();

        const dynamicMonths = [];
        for (let i = 0; i < 9; i++) {
          const mIdx = (startMonthIdx + i) % 12;
          dynamicMonths.push(MONTH_NAMES[mIdx]);
        }
        setMonths(dynamicMonths);

        const windowStart = new Date(startYear, startMonthIdx, 1).getTime();
        const windowEnd = new Date(startYear, startMonthIdx + 9, 0, 23, 59, 59).getTime();
        const totalWindowMs = Math.max(windowEnd - windowStart, 86400000);

        const endYear = new Date(windowEnd).getFullYear();
        const yearLabel = startYear === endYear ? `${startYear}` : `${startYear}–${endYear}`;
        setTimelineTitle(`Project Timeline — ${yearLabel}`);

        const positionedItems = rawItems.map((item) => {
          const s = item.startDate ? new Date(item.startDate).getTime() : windowStart;
          const e = item.endDate ? new Date(item.endDate).getTime() : s;
          const clampedStart = Math.max(windowStart, Math.min(windowEnd, s));
          const clampedEnd = Math.max(clampedStart, Math.min(windowEnd, e));

          const startPercent = ((clampedStart - windowStart) / totalWindowMs) * 100;
          const rawDurationPercent = ((Math.max(clampedEnd - clampedStart, 86400000)) / totalWindowMs) * 100;
          const widthPercent = Math.max(5, Math.min(100 - startPercent, rawDurationPercent));

          return {
            ...item,
            startPercent: Math.max(0, Math.min(95, startPercent)),
            widthPercent: Math.max(5, widthPercent),
          };
        });

        setTimelineItems(positionedItems);
      })
      .catch(() => {
        setTimelineItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projects]);

  return (
    <div className="timeline-page">
      <section className="timeline-card">
        <div className="timeline-card-header">
          <h2>{timelineTitle}</h2>

          <div className="timeline-legend">
            <span>
              <i className="legend-dot on-track" />
              On Track
            </span>

            <span>
              <i className="legend-dot at-risk" />
              At Risk
            </span>

            <span>
              <i className="legend-dot completed" />
              Completed
            </span>
          </div>
        </div>

        <div className="timeline-content">
          <div className="timeline-months">
            {months.map((month, idx) => (
              <span key={`${month}-${idx}`}>{month}</span>
            ))}
          </div>

          <div className="timeline-grid">
            {timelineItems.map((project) => (
              <div className="timeline-row" key={project.id || project.name}>
                <div className="timeline-project-name">{project.name}</div>

                <div className="timeline-track">
                  <div className="timeline-grid-lines">
                    {months.slice(0, -1).map((_, index) => (
                      <span key={index} />
                    ))}
                  </div>

                  <div
                    className={`timeline-bar ${project.statusClass}`}
                    style={{
                      left: `${project.startPercent}%`,
                      width: `${project.widthPercent}%`,
                    }}
                  >
                    <span>{project.progress}%</span>
                  </div>
                </div>

                <div
                  className={`timeline-status ${project.statusClass}`}
                >
                  {project.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .timeline-page {
          width: 100%;
          box-sizing: border-box;
          background: #f5f4ef;
          color: #11140f;
          font-family: var(--sans, "DM Sans", system-ui, sans-serif);
        }

        .timeline-card {
          width: 100%;
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 15px;
          overflow: hidden;
          box-sizing: border-box;
        }

        .timeline-card-header {
          min-height: 62px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          box-sizing: border-box;
          border-bottom: 1px solid #e4e1da;
        }

        .timeline-card-header h2 {
          margin: 0;
          font-family: var(
            --serif,
            "DM Serif Display",
            Georgia,
            serif
          );
          font-size: 18px;
          font-weight: 400;
          line-height: 1.1;
        }

        .timeline-legend {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 8px;
          color: #8d8981;
          white-space: nowrap;
        }

        .timeline-legend span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 3px;
          display: inline-block;
        }

        .legend-dot.on-track {
          background: #9fb591;
        }

        .legend-dot.at-risk {
          background: #ab9d70;
        }

        .legend-dot.completed {
          background: #c7d8bf;
        }

        .timeline-content {
          padding: 16px 20px 20px;
          box-sizing: border-box;
        }

        .timeline-months {
          margin-left: 150px;
          margin-right: 102px;
          display: grid;
          grid-template-columns: repeat(9, minmax(0, 1fr));
          align-items: center;
          gap: 0;
          color: #b0aba3;
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 0.3px;
        }

        .timeline-months span {
          text-align: center;
        }

        .timeline-grid {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .timeline-row {
          display: grid;
          grid-template-columns: 125px minmax(0, 1fr) 78px;
          align-items: center;
          gap: 10px;
          min-height: 38px;
        }

        .timeline-project-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: monospace;
          font-size: 9px;
          color: #6e6a63;
        }

        .timeline-track {
          position: relative;
          height: 34px;
          border-radius: 8px;
          background: #f2f1ed;
          overflow: hidden;
          box-sizing: border-box;
        }

        .timeline-grid-lines {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          pointer-events: none;
        }

        .timeline-grid-lines span {
          border-right: 1px solid #dedbd4;
        }

        .timeline-grid-lines span:last-child {
          border-right: 0;
        }

        .timeline-bar {
          position: absolute;
          top: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          padding: 0 8px;
          border-radius: 8px;
          box-sizing: border-box;
          min-width: 46px;
        }

        .timeline-bar span {
          font-family: monospace;
          font-size: 8px;
          color: #2f382d;
        }

        .timeline-bar.on-track {
          background: #b9c8b0;
        }

        .timeline-bar.at-risk {
          background: #b4aa80;
        }

        .timeline-bar.completed {
          background: #9fb591;
        }

        .timeline-status {
          min-height: 24px;
          padding: 0 9px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 0.6px;
          white-space: nowrap;
          box-sizing: border-box;
        }

        .timeline-status.on-track {
          background: #e8efe3;
          color: #5d7058;
        }

        .timeline-status.at-risk {
          background: #eee9dc;
          color: #8c7c4c;
        }

        .timeline-status.completed {
          background: #e5ede1;
          color: #5c7157;
        }

        @media (max-width: 900px) {
          .timeline-card-header {
            align-items: flex-start;
            flex-direction: column;
            justify-content: center;
            padding: 14px 16px;
          }

          .timeline-legend {
            flex-wrap: wrap;
          }

          .timeline-content {
            overflow-x: auto;
          }

          .timeline-months,
          .timeline-grid {
            min-width: 760px;
          }
        }

        @media (max-width: 600px) {
          .timeline-card-header h2 {
            font-size: 17px;
          }

          .timeline-content {
            padding-left: 14px;
            padding-right: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default TimeTracking;