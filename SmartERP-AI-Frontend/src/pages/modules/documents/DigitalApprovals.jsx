import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  documentsApi,
} from "./documentsApi";

import "./documents.css";


export default function DigitalApprovals() {

  const [
    approvals,
    setApprovals
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const loadApprovals =
    useCallback(
      async () => {

        try {

          const {
            data
          } =
            await documentsApi
              .pendingApprovals();

          setApprovals(
            data
          );

        } finally {

          setLoading(
            false
          );

        }
      },
      []
    );


  useEffect(() => {

    loadApprovals();

  }, [
    loadApprovals
  ]);


  const approve =
    async id => {

      await documentsApi
        .approve(
          id
        );

      await loadApprovals();
    };


  const reject =
    async id => {

      const comment =
        window.prompt(
          "Reason for rejection",
          ""
        );

      if (
        comment === null
      ) {
        return;
      }

      await documentsApi
        .reject(
          id,
          comment
        );

      await loadApprovals();
    };


  return (

    <div className="documents-page">

      <div className="doc-title-row">

        <div>

          <div className="doc-eyebrow">

            DOCUMENTS

          </div>

          <h1>

            Digital Approvals

          </h1>

          <p>

            Review documents
            waiting for approval.

          </p>

        </div>

      </div>


      <div className="approval-summary">

        <div>

          <strong>

            {approvals.length}

          </strong>

          <span>

            Pending Approval

          </span>

        </div>

      </div>


      <div className="doc-list">

        {
          approvals.map(
            approval => (

              <div
                className=
                  "doc-row"
                key={
                  approval.id
                }
              >

                <div className="doc-row-left">

                  <div className="doc-file-icon">

                    📋

                  </div>


                  <div>

                    <h3>

                      {
                        approval
                          .documentTitle
                      }

                    </h3>


                    <div className="doc-meta">

                      <span>

                        {
                          approval
                            .documentType
                        }

                      </span>

                      <span>·</span>


                      <span>

                        Submitted by{" "}

                        {
                          approval
                            .submittedByName ||
                          "User"
                        }

                      </span>


                      <span>·</span>


                      <span>

                        {
                          approval
                            .submittedAt

                            ? new Date(
                                approval
                                  .submittedAt
                              )
                                .toLocaleDateString(
                                  "en-GB"
                                )

                            : "—"
                        }

                      </span>

                    </div>

                  </div>

                </div>


                <div className="approval-actions">

                  <span className="due-date">

                    Due:{" "}

                    {
                      approval
                        .dueDate

                        ? new Date(
                            approval
                              .dueDate
                          )
                            .toLocaleDateString(
                              "en-GB"
                            )

                        : "—"
                    }

                  </span>


                  <button
                    className=
                      "doc-btn doc-btn-light"
                  >

                    View Doc

                  </button>


                  <button
                    className=
                      "doc-btn approve-button"

                    onClick={
                      () =>
                        approve(
                          approval.id
                        )
                    }
                  >

                    Approve

                  </button>


                  <button
                    className=
                      "doc-btn reject-button"

                    onClick={
                      () =>
                        reject(
                          approval.id
                        )
                    }
                  >

                    Reject

                  </button>

                </div>

              </div>

            )
          )
        }


        {
          !loading &&
          !approvals.length && (

            <div className="doc-empty">

              No pending approvals.

            </div>

          )
        }

      </div>

    </div>
  );
}