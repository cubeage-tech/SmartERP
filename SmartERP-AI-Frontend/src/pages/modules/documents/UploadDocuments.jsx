import {
  useState,
} from "react";

import {
  DOCUMENT_TYPES,
  documentsApi,
} from "./documentsApi";

import "./documents.css";


export default function UploadDocuments() {

  const [
    file,
    setFile
  ] = useState(null);


  const [
    title,
    setTitle
  ] = useState("");


  const [
    type,
    setType
  ] =
    useState(
      "VENDOR_INVOICE"
    );


  const [
    tags,
    setTags
  ] = useState("");


  const [
    ocrEnabled,
    setOcrEnabled
  ] = useState(true);


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    message,
    setMessage
  ] = useState("");


  const submit =
    async event => {

      event.preventDefault();

      setMessage("");


      if (!file) {

        setMessage(
          "Please select file."
        );

        return;
      }


      if (
        !title.trim()
      ) {

        setMessage(
          "Title is required."
        );

        return;
      }


      try {

        setLoading(
          true
        );


        const {
          data
        } =
          await documentsApi
            .upload({

              file,

              title,

              type,

              tags,

              ocrEnabled,

            });


        setMessage(

          `Document ${
            data.documentNumber
          } uploaded successfully.`

        );


        setFile(null);

        setTitle("");

        setTags("");


      } catch (
        error
      ) {

        setMessage(

          error
            ?.response
            ?.data
            ?.message ||

          "Document upload failed."

        );

      } finally {

        setLoading(
          false
        );

      }
    };


  return (

    <div className="documents-page">

      <div className="doc-title-row">

        <div>

          <div className="doc-eyebrow">

            DOCUMENTS

          </div>

          <h1>

            Upload Documents

          </h1>

          <p>

            Upload files and
            automatically process
            them using OCR.

          </p>

        </div>

      </div>


      <div className="upload-layout">

        <form
          className="upload-card"
          onSubmit={
            submit
          }
        >

          <label className="drop-zone">

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


            <div className="upload-icon">

              ↑

            </div>


            <strong>

              {
                file
                  ? file.name
                  : "Upload your document"
              }

            </strong>


            <span>

              PDF, Images,
              Word, Excel
              and business files

            </span>

          </label>


          <div className="form-grid">

            <label>

              Document Title

              <input

                value={
                  title
                }

                onChange={
                  event =>
                    setTitle(
                      event
                        .target
                        .value
                    )
                }

                placeholder=
                  "Tata Steel Purchase Bill — Aug 2026"

              />

            </label>


            <label>

              Document Type

              <select

                value={
                  type
                }

                onChange={
                  event =>
                    setType(
                      event
                        .target
                        .value
                    )
                }
              >

                {
                  DOCUMENT_TYPES

                    .filter(
                      item =>
                        item.value
                    )

                    .map(
                      item => (

                        <option
                          value={
                            item.value
                          }
                          key={
                            item.value
                          }
                        >

                          {
                            item.label
                          }

                        </option>

                      )
                    )
                }

              </select>

            </label>

          </div>


          <label>

            Tags

            <input

              value={
                tags
              }

              onChange={
                event =>
                  setTags(
                    event
                      .target
                      .value
                  )
              }

              placeholder=
                "purchase, finance"

            />

          </label>


          <label className="ocr-checkbox">

            <input

              type="checkbox"

              checked={
                ocrEnabled
              }

              onChange={
                event =>
                  setOcrEnabled(
                    event
                      .target
                      .checked
                  )
              }

            />


            <span>

              <strong>

                AI OCR Processing

              </strong>

              <small>

                Automatically extract
                searchable information.

              </small>

            </span>

          </label>


          {
            message && (

              <div className="form-message">

                {message}

              </div>

            )
          }


          <div className="form-actions">

            <button
              className=
                "doc-btn doc-btn-dark"

              disabled={
                loading
              }
            >

              {
                loading
                  ? "Uploading..."
                  : "↑ Upload"
              }

            </button>

          </div>

        </form>


        <div className="upload-info">

          <div className="doc-ai-icon">

            🤖

          </div>

          <h2>

            AI OCR Processing

          </h2>

          <p>

            SmartERP automatically
            processes uploaded
            business documents.

          </p>


          <div className="upload-info-list">

            <span>
              ✓ Smart indexing
            </span>

            <span>
              ✓ Invoice extraction
            </span>

            <span>
              ✓ GSTIN extraction
            </span>

            <span>
              ✓ HSN extraction
            </span>

            <span>
              ✓ Searchable text
            </span>

            <span>
              ✓ Manual review
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}