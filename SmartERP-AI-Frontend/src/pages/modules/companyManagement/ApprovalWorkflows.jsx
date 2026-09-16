import React, { useEffect, useState } from "react";
import CompanyManagementService from "../../../core/services/modules/companyManagement.service";
import useActiveCompany from "../../../core/hooks/useActiveCompany";

const ApprovalWorkflows = ({ companyId: providedCompanyId }) => {
  const activeCompany = useActiveCompany(providedCompanyId);
  const companyId = providedCompanyId || activeCompany.companyId;
  const [workflows, setWorkflows] = useState([
    {
      title: "Purchase Order Approval",
      trigger: "Amount > ₹25,000",
      steps: ["Requestor", "Manager", "Finance", "MD"],
      status: "ACTIVE",
    },
    {
      title: "Leave Request",
      trigger: "All requests",
      steps: ["Employee", "Manager", "HR"],
      status: "ACTIVE",
    },
    {
      title: "Expense Claim",
      trigger: "Amount > ₹5,000",
      steps: ["Employee", "Manager", "Finance"],
      status: "ACTIVE",
    },
    {
      title: "Sales Discount Override",
      trigger: "Discount > 10%",
      steps: ["Sales", "Sales Manager", "MD"],
      status: "ACTIVE",
    },
    {
      title: "New Vendor Onboarding",
      trigger: "New vendor",
      steps: ["Purchase", "Finance", "Admin"],
      status: "ACTIVE",
    },
    {
      title: "Asset Disposal",
      trigger: "Asset value > ₹50,000",
      steps: ["Requestor", "Operations", "Finance", "MD"],
      status: "INACTIVE",
    },
  ]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!companyId) {
      setWorkflows([]);
      return;
    }
    CompanyManagementService.getApprovalWorkflows(companyId)
      .then(({ data }) => {
        setWorkflows(data);
        setError("");
      })
      .catch((requestError) => setError(requestError.response?.data?.detail || "Unable to load approval workflows."));
  }, [companyId]);

  return (
    <div className="approval-content">

      {(error || activeCompany.error) && <div className="approval-api-message">{error || activeCompany.error}</div>}

      {/* ================= WORKFLOW LIST ================= */}

      <section className="workflow-list">

        {workflows.map((workflow) => (
          <div
            className="workflow-card"
            key={workflow.title}
          >

            <div className="workflow-content">

              <h2>
                {workflow.title}
              </h2>

              <div className="trigger">
                Trigger: &nbsp;
                {workflow.trigger}
              </div>

              <div className="workflow-steps">

                {workflow.steps.map((step, index) => (
                  <React.Fragment key={step}>

                    <div className="step">
                      {step}
                    </div>

                    {index < workflow.steps.length - 1 && (
                      <span className="arrow">
                        →
                      </span>
                    )}

                  </React.Fragment>
                ))}

              </div>

            </div>

            <span
              className={`workflow-status ${
                workflow.status === "ACTIVE"
                  ? "active"
                  : "inactive"
              }`}
            >
              {workflow.status}
            </span>

          </div>
        ))}

      </section>


      {/* ================= STYLES ================= */}

      <style>{`

        .approval-content {
          width: 100%;
        }

        .approval-api-message {
          margin-bottom: 12px; padding: 10px 14px; border: 1px solid #dfd8c9;
          border-radius: 10px; background: #fffaf0; color: #6b5b3e; font-size: 12px;
        }

        /* WORKFLOW LIST */

        .workflow-list {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        /* WORKFLOW CARD */

        .workflow-card {
          min-height: 94px;

          background: #fff;

          border: 1px solid #e1dfd8;
          border-radius: 14px;

          padding: 17px 15px;

          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          position: relative;

          box-sizing: border-box;
        }

        .workflow-content {
          display: flex;
          flex-direction: column;
          padding-right: 90px;
        }

        .workflow-card h2 {
          margin: 0 0 3px;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 14px;
          font-weight: 400;

          color: #11140f;
        }

        /* TRIGGER */

        .trigger {
          font-family: monospace;
          font-size: 8px;

          color: #99968e;

          margin-bottom: 11px;
        }

        /* STEPS */

        .workflow-steps {
          display: flex;
          align-items: center;
          gap: 7px;

          flex-wrap: wrap;
        }

        .step {
          min-width: 57px;
          height: 22px;

          padding: 0 9px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #f5f4ef;

          border: 1px solid #e0ddd5;

          border-radius: 6px;

          font-family: monospace;
          font-size: 7px;

          color: #77746d;

          box-sizing: border-box;
        }

        .arrow {
          font-family: monospace;
          font-size: 10px;

          color: #aaa69e;
        }

        /* STATUS */

        .workflow-status {
          position: absolute;

          top: 22px;
          right: 16px;

          padding: 5px 9px;

          border-radius: 8px;

          font-family: monospace;
          font-size: 8px;
        }

        .workflow-status.active {
          color: #63755c;
          background: #eaf1e6;
        }

        .workflow-status.inactive {
          color: #a09d94;
          background: #e9e7e1;
        }

        /* RESPONSIVE */

        @media (max-width: 700px) {

          .workflow-card {
            min-height: 115px;
          }

          .workflow-steps {
            flex-wrap: wrap;
          }

          .workflow-content {
            padding-right: 70px;
          }

        }

      `}</style>

    </div>
  );
};

export default ApprovalWorkflows;
