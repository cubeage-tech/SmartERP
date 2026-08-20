import {
  useEffect,
  useState,
} from "react";

import {
  documentsApi,
  downloadBlob,
} from "./documentsApi";

import "./documents.css";


export default function VersionControl() {

  const [
    documents,
    setDocuments
  ] = useState([]);


  const [
    documentId,
    setDocumentId
  ] = useState("");


  const [
    versions,
    setVersions
  ] = useState([]);


  const [
    file,
    setFile
  ] = useState(null);


  const [
    reason,
    setReason
  ] = useState("");


  const [
    comments,
    setComments
  ] = useState("");


  useEffect(() => {

    documentsApi
      .documents()
      .then(
        response => {

          setDocuments(
            response.data
          );


          if (
            response
              .data
              .length
          ) {

            setDocumentId(

              String(
                response
                  .data[0]
                  .id
              )

            );
          }
        }
      );

  }, []);


  useEffect(() => {

    if (
      documentId
    ) {

      loadVersions();

    }

  }, [
    documentId
  ]);


  const loadVersions =
    async () => {

      const {
        data
      } =
        await documentsApi
          .versions(
            documentId
          );

      setVersions(
        data
      );
    };


  const uploadVersion =
    async event => {

      event.preventDefault();


      if (
        !file ||
        !documentId
      ) {
        return;
      }


      await documentsApi
        .uploadVersion(

          documentId,

          file,

          reason,

          comments

        );


      setFile(null);

      setReason("");

      setComments("");


      await loadVersions();
    };


  const restoreVersion =
    async versionId => {

      const confirm =
        window.confirm(
          "Restore this version?"
        );


      if (!confirm) {
        return;
      }


      await documentsApi
        .restoreVersion(

          documentId,

          versionId

        );


      await loadVersions();
    };


  const downloadVersion =
    async version => {

      const response =
        await documentsApi
          .downloadVersion(

            documentId,

            version.id

          );


      downloadBlob(

        response.data,

        version
          .originalFileName

      );
    };


  return (

    <div className="documents-page">

      <div className="doc-title-row">

        <div>

          <div className="doc-eyebrow">

            DOCUMENTS

          </div>

          <h1>

            Version Control

          </h1>

          <p>

            Manage document
            revision history.

          </p>

        </div>

      </div>


      <div className="version-selector">

        <label>

          Select Document

          <select

            value={
              documentId
            }

            onChange={
              event =>
                setDocumentId(
                  event
                    .target
                    .value
                )
            }
          >

            {
              documents.map(
                document => (

                  <option
                    value={
                      document.id
                    }
                    key={
                      document.id
                    }
                  >

                    {
                      document
                        .documentNumber
                    }
                    {" — "}
                    {
                      document.title
                    }

                  </option>

                )
              )
            }

          </select>

        </label>

      </div>


      <div className="version-grid">

        {/* HISTORY */}

        <div className="overview-panel">

          <h2>

            Version History

          </h2>


          <div className="version-list">

            {
              versions.map(
                version => (

                  <div
                    className=
                      "version-row"
                    key={
                      version.id
                    }
                  >

                    <div className="version-dot">

                      <span />

                    </div>


                    <div className="version-content">

                      <div className="version-header">

                        <strong>

                          Version{" "}
                          {
                            version
                              .versionNumber
                          }

                          {
                            version.current
                              ? " · Current"
                              : ""
                          }

                        </strong>


                        <small>

                          {
                            version
                              .createdAt

                              ? new Date(
                                  version
                                    .createdAt
                                )
                                  .toLocaleString()

                              : ""
                          }

                        </small>

                      </div>


                      <p>

                        {
                          version
                            .originalFileName
                        }

                      </p>


                      <div className="doc-meta">

                        <span>

                          By{" "}

                          {
                            version
                              .uploadedByName ||
                            "User"
                          }

                        </span>


                        {
                          version
                            .changeReason && (

                            <>

                              <span>
                                ·
                              </span>

                              <span>

                                {
                                  version
                                    .changeReason
                                }

                              </span>

                            </>

                          )
                        }

                      </div>


                      <div className="version-actions">

                        <button
                          className=
                            "doc-btn doc-btn-light"

                          onClick={
                            () =>
                              downloadVersion(
                                version
                              )
                          }
                        >

                          Download

                        </button>


                        {
                          !version.current && (

                            <button
                              className=
                                "doc-btn doc-btn-dark"

                              onClick={
                                () =>
                                  restoreVersion(
                                    version.id
                                  )
                              }
                            >

                              Restore

                            </button>

                          )
                        }

                      </div>

                    </div>

                  </div>

                )
              )
            }


            {
              !versions.length && (

                <div className="doc-empty">

                  No versions found.

                </div>

              )
            }

          </div>

        </div>


        {/* NEW VERSION */}

        <form
          className=
            "overview-panel version-form"

          onSubmit={
            uploadVersion
          }
        >

          <h2>

            Upload Revision

          </h2>


          <label>

            Revision File

            <input
              type="file"

              onChange={
                event =>
                  setFile(
                    event
                      .target
                      .files?.[0]
                  )
              }
            />

          </label>


          <label>

            Change Reason

            <input

              value={
                reason
              }

              onChange={
                event =>
                  setReason(
                    event
                      .target
                      .value
                  )
              }

              placeholder=
                "Updated commercial terms"

            />

          </label>


          <label>

            Comments

            <textarea

              rows="5"

              value={
                comments
              }

              onChange={
                event =>
                  setComments(
                    event
                      .target
                      .value
                  )
              }

              placeholder=
                "Describe changes..."

            />

          </label>


          <button
            className=
              "doc-btn doc-btn-dark"

            disabled={
              !file ||
              !documentId
            }
          >

            Upload New Version

          </button>

        </form>

      </div>

    </div>
  );
}