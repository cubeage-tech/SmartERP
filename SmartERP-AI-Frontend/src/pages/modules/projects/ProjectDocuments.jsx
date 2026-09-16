import React, { useState, useEffect } from "react";
import ProjectsService from "../../../core/services/modules/projects.service";

const ProjectDocuments = ({ projects: propProjects }) => {
  const [projects, setProjects] = useState(propProjects || []);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (propProjects && propProjects.length > 0) {
      setProjects(propProjects);
    } else {
      ProjectsService.getAll()
        .then((res) => {
          if (Array.isArray(res.data)) {
            setProjects(res.data);
          }
        })
        .catch(() => {});
    }
  }, [propProjects]);

  useEffect(() => {
    if (!projects || projects.length === 0) {
      setDocuments([]);
      return;
    }

    setLoading(true);
    setError("");

    Promise.allSettled(
      projects.map((project) => ProjectsService.getDocuments(project.id))
    )
      .then((results) => {
        const allDocs = [];
        results.forEach((res, index) => {
          if (res.status === "fulfilled" && Array.isArray(res.value?.data)) {
            const project = projects[index];
            res.value.data.forEach((d) => {
              allDocs.push({
                id: d.id,
                projectId: d.projectId,
                projectName: project?.name || `PRJ-${d.projectId}`,
                documentId: d.documentId,
                documentTitle: d.documentTitle || `Document #${d.documentId}`,
                taskId: d.taskId,
                linkedTask: d.taskId ? `Task #${d.taskId}` : "Project Level",
              });
            });
          }
        });
        setDocuments(allDocs);
      })
      .catch(() => {
        setError("Unable to load project documents.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projects]);

  return (
    <div className="documents-page">
      <div className="documents-inner">
        <section className="documents-card">
          <div className="documents-card-header">
            <h2>Project Documents</h2>
          </div>

          <div className="documents-table">
            <div className="documents-table-header">
              <span>#</span>
              <span>DOCUMENT</span>
              <span>PROJECT</span>
              <span>LINKED TASK</span>
              <span>DOCUMENT ID</span>
            </div>

            {documents.length > 0 ? (
              documents.map((item) => (
                <div className="documents-row" key={item.id}>
                  <span className="doc-id">#{item.id}</span>
                  <span className="doc-name">{item.documentTitle}</span>
                  <span>
                    <em className="doc-project-badge">{item.projectName}</em>
                  </span>
                  <span className="doc-task">{item.linkedTask}</span>
                  <span className="doc-ref">#{item.documentId}</span>
                </div>
              ))
            ) : (
              <div className="documents-empty">
                {loading ? "Loading documents..." : "No documents linked to projects."}
              </div>
            )}
          </div>
        </section>
      </div>

      <style>{`
        .documents-page {
          width: 100%;
          min-height: 100%;
          box-sizing: border-box;
          background: #f5f4ef;
          color: #11140f;
          font-family: var(--sans, "DM Sans", system-ui, sans-serif);
        }

        .documents-inner {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 0 44px;
          box-sizing: border-box;
        }

        .documents-card {
          width: 100%;
          overflow: hidden;
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 15px;
          box-sizing: border-box;
        }

        .documents-card-header {
          min-height: 62px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid #e4e1da;
          box-sizing: border-box;
        }

        .documents-card-header h2 {
          margin: 0;
          font-family: var(--serif, "DM Serif Display", Georgia, serif);
          font-size: 18px;
          font-weight: 400;
          line-height: 1.1;
        }

        .documents-table {
          width: 100%;
          box-sizing: border-box;
        }

        .documents-table-header {
          display: grid;
          grid-template-columns: 70px 2.5fr 1.5fr 1.5fr 1fr;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          border-bottom: 1px solid #eceae3;
          color: #a8a49c;
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 0.6px;
          box-sizing: border-box;
        }

        .documents-row {
          display: grid;
          grid-template-columns: 70px 2.5fr 1.5fr 1.5fr 1fr;
          align-items: center;
          gap: 12px;
          padding: 11px 20px;
          border-bottom: 1px solid #f0eee8;
          font-size: 10px;
          box-sizing: border-box;
        }

        .documents-row:last-child {
          border-bottom: 0;
        }

        .doc-id {
          font-family: monospace;
          color: #98938b;
          font-size: 9px;
        }

        .doc-name {
          font-weight: 500;
          color: #12140e;
        }

        .doc-project-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 7px;
          border-radius: 6px;
          background: #f1efe9;
          color: #726f67;
          font-family: monospace;
          font-size: 8px;
          font-style: normal;
        }

        .doc-task {
          color: #6a665e;
          font-family: monospace;
          font-size: 9px;
        }

        .doc-ref {
          font-family: monospace;
          color: #8c887f;
          font-size: 9px;
        }

        .documents-empty {
          padding: 32px 20px;
          text-align: center;
          color: #9c978e;
          font-family: monospace;
          font-size: 10px;
        }
      `}</style>
    </div>
  );
};

export default ProjectDocuments;
