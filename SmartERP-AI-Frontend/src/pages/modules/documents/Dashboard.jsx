import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  DOCUMENT_TYPES,
  documentsApi,
  downloadBlob,
} from "./documentsApi";

import "./documents.css";


const icons = {

  "Vendor Invoice": "📄",

  "Sales Order": "📝",

  "Contract": "📋",

  "HR Document": "👤",

  "Tax Document": "🧾",

  "Report": "📊",

};


const formatSize = (
  bytes = 0
) => {

  if (
    bytes >=
    1024 * 1024
  ) {

    return `${(
      bytes /
      1024 /
      1024
    ).toFixed(1)} MB`;
  }

  return `${Math.max(
    1,
    Math.round(
      bytes / 1024
    )
  )} KB`;
};


function KpiCard({
  value,
  label,
  helper,
}) {

  return (

    <div className="doc-kpi-card">

      <div className="doc-kpi-value">

        {value}

      </div>

      <div className="doc-kpi-label">

        {label}

      </div>

      <div className="doc-kpi-helper">

        {helper}

      </div>

    </div>
  );
}


function StatusBadge({
  status,
}) {

  const value =
    String(
      status || "active"
    ).toLowerCase();

  return (

    <span
      className={
        `doc-status doc-status--${value}`
      }
    >

      {value
        .replaceAll(
          "_",
          " "
        )
        .toUpperCase()}

    </span>
  );
}


export default function Dashboard() {

  const [
    dashboard,
    setDashboard
  ] = useState(null);


  const [
    documents,
    setDocuments
  ] = useState([]);


  const [
    search,
    setSearch
  ] = useState("");


  const [
    type,
    setType
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(true);


  const loadDashboard =
    useCallback(
      async () => {

        const {
          data
        } =
          await documentsApi
            .dashboard();

        setDashboard(
          data
        );
      },
      []
    );


  const loadDocuments =
    useCallback(
      async () => {

        const {
          data
        } =
          await documentsApi
            .documents(
              search,
              type
            );

        setDocuments(
          data
        );
      },
      [
        search,
        type
      ]
    );


  useEffect(() => {

    Promise.all([
      loadDashboard(),
      loadDocuments(),
    ])
      .finally(
        () =>
          setLoading(
            false
          )
      );

  }, []);


  useEffect(() => {

    const timer =
      setTimeout(
        () => {

          loadDocuments();

        },
        250
      );

    return () =>
      clearTimeout(
        timer
      );

  }, [
    search,
    type
  ]);


  const download =
    async (
      document
    ) => {

      const response =
        await documentsApi
          .download(
            document.id
          );

      downloadBlob(
        response.data,
        document
          .originalFileName
      );
    };


  if (
    loading ||
    !dashboard
  ) {

    return (

      <div className="doc-loading">

        Loading documents...

      </div>
    );
  }


  return (

    <div className="documents-page">

      {/* Header */}

      <div className="doc-title-row">

        <div>

          <div className="doc-eyebrow">

            DOCUMENTS

          </div>

          <h1>

            Document Management

          </h1>

        </div>


        <div className="doc-header-actions">

          <button
            className=
              "doc-btn doc-btn-light"
          >

            ↑ Upload

          </button>


          <button
            className=
              "doc-btn doc-btn-dark"
          >

            + New Document

          </button>

        </div>

      </div>


      {/* OCR Banner */}

      <div className="doc-ai-banner">

        <div className="doc-ai-content">

          <div className="doc-ai-icon">

            🤖

          </div>


          <div>

            <strong>

              AI OCR Processing Active

            </strong>


            <p>

              {
                dashboard
                  .processingDocuments
              }
              {" "}
              document processing
              {" · "}

              {
                dashboard
                  .indexedDocuments
              }
              {" "}
              documents indexed
              {" · "}

              Smart search enabled

            </p>

          </div>

        </div>


        <div className="doc-active">

          <span />

          Active

        </div>

      </div>


      {/* KPI */}

      <div className="doc-kpi-grid">

        <KpiCard

          value={
            dashboard
              .totalDocuments
          }

          label=
            "TOTAL DOCUMENTS"

          helper={
            `↑ ${
              dashboard
                .documentsThisMonth
            } this month`
          }

        />


        <KpiCard

          value={
            `${Math.round(
              dashboard
                .ocrAccuracy ||
              0
            )}%`
          }

          label=
            "OCR ACCURACY"

          helper={
            `${
              dashboard
                .ocrExtractedCount
            }/${
              dashboard
                .totalDocuments
            } extracted`
          }

        />


        <KpiCard

          value={
            dashboard
              .pendingApprovalCount
          }

          label=
            "PENDING APPROVAL"

          helper={
            dashboard
              .nearestApprovalDueDate

              ? `Due by ${
                  new Date(
                    dashboard
                      .nearestApprovalDueDate
                  )
                    .toLocaleDateString(
                      "en-GB",
                      {
                        day:
                          "2-digit",

                        month:
                          "short",
                      }
                    )
                }`

              : "No pending approvals"
          }

        />


        <KpiCard

          value={
            `${Number(
              dashboard
                .storageUsedGb ||
              0
            ).toFixed(1)} GB`
          }

          label=
            "STORAGE USED"

          helper={
            `${Number(
              dashboard
                .storageRemainingGb ||
              0
            ).toFixed(1)}
            GB remaining`
          }

        />

      </div>


      {/* Figma Tabs */}

      <div className="doc-tabs">

        <button className="active">

          ALL DOCUMENTS

        </button>

        <button>

          PENDING APPROVAL

        </button>

        <button>

          MY UPLOADS

        </button>

        <button>

          OCR EXTRACTIONS

        </button>

      </div>


      {/* Search */}

      <div className="doc-filter-row">

        <div className="doc-search">

          <span>

            ⌕

          </span>

          <input

            value={search}

            onChange={
              event =>
                setSearch(
                  event
                    .target
                    .value
                )
            }

            placeholder=
              "Search documents, tags..."

          />

        </div>


        <div className="doc-filter-buttons">

          {
            DOCUMENT_TYPES
              .map(
                item => (

                  <button

                    key={
                      item.label
                    }

                    className={
                      type ===
                      item.value
                        ? "active"
                        : ""
                    }

                    onClick={
                      () =>
                        setType(
                          item.value
                        )
                    }
                  >

                    {item.label}

                  </button>

                )
              )
          }

        </div>

      </div>


      {/* Documents */}

      <div className="doc-list">

        {
          documents.map(
            document => (

              <div
                className=
                  "doc-row"
                key={
                  document.id
                }
              >

                <div className="doc-row-left">

                  <div className="doc-file-icon">

                    {
                      icons[
                        document.type
                      ] ||
                      "📄"
                    }

                  </div>


                  <div>

                    <h3>

                      {
                        document.title
                      }

                    </h3>


                    <div className="doc-meta">

                      <span>

                        {
                          document.type
                        }

                      </span>

                      <span>·</span>

                      <span>

                        {
                          formatSize(
                            document
                              .fileSize
                          )
                        }

                      </span>

                      <span>·</span>

                      <span>

                        {
                          document.createdAt

                            ? new Date(
                                document.createdAt
                              )
                                .toLocaleDateString(
                                  "en-GB",
                                  {
                                    day:
                                      "2-digit",

                                    month:
                                      "short",

                                    year:
                                      "numeric",
                                  }
                                )

                            : "—"
                        }

                      </span>


                      {
                        (
                          document.tags ||
                          ""
                        )
                          .split(",")
                          .map(
                            tag =>
                              tag.trim()
                          )
                          .filter(
                            Boolean
                          )
                          .map(
                            tag => (

                              <span
                                className=
                                  "doc-tag"
                                key={
                                  tag
                                }
                              >

                                {tag}

                              </span>

                            )
                          )
                      }

                    </div>

                  </div>

                </div>


                <div className="doc-row-right">

                  <span
                    className={
                      document
                        .ocrCompleted

                        ? "ocr-complete"

                        : "ocr-processing"
                    }
                  >

                    {
                      document
                        .ocrCompleted

                        ? "✓ OCR"

                        : "○ OCR..."
                    }

                  </span>


                  <StatusBadge

                    status={
                      document
                        .status
                    }

                  />


                  <button
                    className=
                      "download-button"
                    onClick={
                      () =>
                        download(
                          document
                        )
                    }
                  >

                    ↓

                  </button>

                </div>

              </div>

            )
          )
        }


        {
          !documents.length && (

            <div className="doc-empty">

              No documents found.

            </div>

          )
        }

      </div>

    </div>
  );
}