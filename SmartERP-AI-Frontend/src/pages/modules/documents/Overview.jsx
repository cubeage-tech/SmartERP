import {
  useEffect,
  useState,
} from "react";

import {
  documentsApi,
} from "./documentsApi";

import "./documents.css";


function Metric({
  label,
  helper,
  value,
}) {

  return (

    <div className="overview-metric">

      <div>

        <span>

          {label}

        </span>


        {
          helper && (

            <small>

              {helper}

            </small>

          )
        }

      </div>


      <strong>

        {value}

      </strong>

    </div>
  );
}


export default function Overview() {

  const [
    latest,
    setLatest
  ] = useState(null);


  const [
    stats,
    setStats
  ] = useState(null);


  useEffect(() => {

    Promise.all([

      documentsApi
        .latestOcr(),

      documentsApi
        .ocrStats(),

    ])
      .then(
        ([
          latestResponse,
          statsResponse,
        ]) => {

          setLatest(
            latestResponse.data
          );

          setStats(
            statsResponse.data
          );
        }
      );

  }, []);


  if (!stats) {

    return (

      <div className="doc-loading">

        Loading OCR overview...

      </div>
    );
  }


  return (

    <div className="documents-page">

      <div className="doc-title-row">

        <div>

          <div className="doc-eyebrow">

            DOCUMENTS

          </div>

          <h1>

            OCR Extractions

          </h1>

        </div>

      </div>


      <div className="overview-grid">

        {/* Latest Extraction */}

        <div className="overview-panel">

          <h2>

            Latest Extraction

          </h2>


          {
            latest ? (

              <>

                <div className="extraction-card">

                  <div className="extraction-title">

                    DOCUMENT:{" "}

                    {
                      latest
                        .documentTitle
                        ?.toUpperCase()
                    }

                  </div>


                  <Metric
                    label="Vendor"
                    value={
                      latest
                        .vendorName ||
                      "—"
                    }
                  />


                  <Metric
                    label=
                      "Invoice No."
                    value={
                      latest
                        .invoiceNumber ||
                      "—"
                    }
                  />


                  <Metric
                    label="Date"
                    value={
                      latest
                        .invoiceDate ||
                      "—"
                    }
                  />


                  <Metric
                    label="Amount"
                    value={
                      latest.amount

                        ? `₹${Number(
                            latest.amount
                          )
                            .toLocaleString(
                              "en-IN"
                            )}`

                        : "—"
                    }
                  />


                  <Metric
                    label="GSTIN"
                    value={
                      latest.gstin ||
                      "—"
                    }
                  />


                  <Metric
                    label=
                      "HSN Code"
                    value={
                      latest.hsnCode ||
                      "—"
                    }
                  />

                </div>


                <div className="extraction-footer">

                  <span>

                    {
                      Number(
                        latest
                          .confidence ||
                        0
                      )
                        .toFixed(
                          1
                        )
                    }
                    % confidence

                  </span>


                  <button
                    className=
                      "doc-btn doc-btn-light"
                  >

                    Auto-post to GL →

                  </button>

                </div>

              </>

            ) : (

              <div className="doc-empty">

                No OCR extraction.

              </div>

            )
          }

        </div>


        {/* OCR Stats */}

        <div className="overview-panel">

          <h2>

            OCR Stats

          </h2>


          <div className="ocr-stats">

            <Metric

              label=
                "Documents Processed"

              helper={
                `This month: ${
                  stats
                    .processedThisMonth
                }`
              }

              value={
                stats
                  .documentsProcessed
              }

            />


            <Metric

              label=
                "Avg. Accuracy"

              helper={
                `Target: ${
                  stats
                    .targetAccuracy
                }%`
              }

              value={
                `${Number(
                  stats
                    .averageAccuracy ||
                  0
                ).toFixed(1)}%`
              }

            />


            <Metric

              label=
                "Auto-posted to GL"

              helper={
                `${
                  stats
                    .autoPostedDocuments
                }/${
                  stats
                    .documentsProcessed
                } docs`
              }

              value={
                `${Math.round(
                  stats
                    .autoPostedToGlPercent ||
                  0
                )}%`
              }

            />


            <Metric

              label=
                "Manual Review"

              helper=
                "Flagged for verification"

              value={
                stats
                  .manualReviewCount
              }

            />

          </div>

        </div>

      </div>

    </div>
  );
}