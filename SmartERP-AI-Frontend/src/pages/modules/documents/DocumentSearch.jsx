import {
  useEffect,
  useState,
} from "react";

import {
  DOCUMENT_TYPES,
  documentsApi,
  downloadBlob,
} from "./documentsApi";

import "./documents.css";


export default function DocumentSearch() {

  const [
    search,
    setSearch
  ] = useState("");


  const [
    type,
    setType
  ] = useState("");


  const [
    documents,
    setDocuments
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(false);


  const runSearch =
    async () => {

      try {

        setLoading(
          true
        );

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

      } finally {

        setLoading(
          false
        );

      }
    };


  useEffect(() => {

    runSearch();

  }, [
    type
  ]);


  const download =
    async document => {

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


  return (

    <div className="documents-page">

      <div className="doc-title-row">

        <div>

          <div className="doc-eyebrow">

            DOCUMENTS

          </div>

          <h1>

            Document Search

          </h1>

          <p>

            Search documents,
            tags and indexed
            document content.

          </p>

        </div>

      </div>


      <div className="search-card">

        <form
          className="search-large"

          onSubmit={
            event => {

              event
                .preventDefault();

              runSearch();

            }
          }
        >

          <span>⌕</span>

          <input

            value={
              search
            }

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


          <button
            className=
              "doc-btn doc-btn-dark"
          >

            Search

          </button>

        </form>


        <div className="doc-filter-buttons">

          {
            DOCUMENT_TYPES.map(
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

                  {
                    item.label
                  }

                </button>

              )
            )
          }

        </div>

      </div>


      <div className="search-result-count">

        {
          loading
            ? "Searching..."

            : `${documents.length} document(s) found`
        }

      </div>


      <div className="doc-list">

        {
          documents.map(
            document => (

              <div
                className="doc-row"
                key={
                  document.id
                }
              >

                <div className="doc-row-left">

                  <div className="doc-file-icon">

                    📄

                  </div>


                  <div>

                    <h3>

                      {
                        document
                          .title
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
                          document
                            .originalFileName
                        }

                      </span>

                      <span>·</span>

                      <span>

                        {
                          document
                            .uploadedByName ||
                          "User"
                        }

                      </span>

                    </div>

                  </div>

                </div>


                <div className="doc-row-right">

                  <button
                    className=
                      "doc-btn doc-btn-light"

                    onClick={
                      () =>
                        download(
                          document
                        )
                    }
                  >

                    Download

                  </button>

                </div>

              </div>

            )
          )
        }


        {
          !loading &&
          !documents.length && (

            <div className="doc-empty">

              No matching
              documents found.

            </div>

          )
        }

      </div>

    </div>
  );
}