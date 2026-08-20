import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:8080/api/v1",
});

api.interceptors.request.use((config) => {

  const token =
    localStorage.getItem("accessToken");

  config.headers["X-Company-Id"] =
    localStorage.getItem("companyId") || "1";

  config.headers["X-User-Id"] =
    localStorage.getItem("userId") || "1";

  config.headers["X-User-Name"] =
    localStorage.getItem("userName") || "Arjun";

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});


export const DOCUMENT_TYPES = [

  {
    value: "",
    label: "All",
  },

  {
    value: "VENDOR_INVOICE",
    label: "Vendor Invoice",
  },

  {
    value: "SALES_ORDER",
    label: "Sales Order",
  },

  {
    value: "CONTRACT",
    label: "Contract",
  },

  {
    value: "HR_DOCUMENT",
    label: "HR Document",
  },

  {
    value: "TAX_DOCUMENT",
    label: "Tax Document",
  },

  {
    value: "REPORT",
    label: "Report",
  },

];


export const documentsApi = {

  dashboard: () =>
    api.get(
      "/documents/dashboard"
    ),


  documents: (
    search = "",
    type = ""
  ) =>
    api.get(
      "/documents",
      {
        params: {

          ...(search
            ? { search }
            : {}),

          ...(type
            ? { type }
            : {}),

        },
      }
    ),


  getById: (id) =>
    api.get(
      `/documents/${id}`
    ),


  myUploads: () =>
    api.get(
      "/documents/my-uploads"
    ),


  upload: ({
    file,
    title,
    type,
    tags,
    ocrEnabled = true,
  }) => {

    const form =
      new FormData();

    form.append(
      "file",
      file
    );

    form.append(
      "title",
      title
    );

    form.append(
      "type",
      type
    );

    if (tags) {
      form.append(
        "tags",
        tags
      );
    }

    form.append(
      "ocrEnabled",
      String(ocrEnabled)
    );

    return api.post(
      "/documents/upload",
      form,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );
  },


  download: (id) =>
    api.get(
      `/documents/${id}/download`,
      {
        responseType: "blob",
      }
    ),


  pendingApprovals: () =>
    api.get(
      "/documents/approvals/pending"
    ),


  approve: (
    id,
    comment = ""
  ) =>
    api.post(
      `/documents/approvals/${id}/approve`,
      {
        comment,
      }
    ),


  reject: (
    id,
    comment = ""
  ) =>
    api.post(
      `/documents/approvals/${id}/reject`,
      {
        comment,
      }
    ),


  ocrExtractions: () =>
    api.get(
      "/documents/ocr"
    ),


  latestOcr: () =>
    api.get(
      "/documents/ocr/latest"
    ),


  ocrStats: () =>
    api.get(
      "/documents/ocr/stats"
    ),


  processOcr: (
    documentId
  ) =>
    api.post(
      `/documents/ocr/${documentId}/process`
    ),


  versions: (
    documentId
  ) =>
    api.get(
      `/documents/${documentId}/versions`
    ),


  uploadVersion: (
    documentId,
    file,
    changeReason,
    comments
  ) => {

    const form =
      new FormData();

    form.append(
      "file",
      file
    );

    if (changeReason) {
      form.append(
        "changeReason",
        changeReason
      );
    }

    if (comments) {
      form.append(
        "comments",
        comments
      );
    }

    return api.post(
      `/documents/${documentId}/versions`,
      form,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );
  },


  restoreVersion: (
    documentId,
    versionId
  ) =>
    api.post(
      `/documents/${documentId}/versions/${versionId}/restore`
    ),


  downloadVersion: (
    documentId,
    versionId
  ) =>
    api.get(
      `/documents/${documentId}/versions/${versionId}/download`,
      {
        responseType: "blob",
      }
    ),

};


export const downloadBlob = (
  blob,
  fileName
) => {

  const url =
    URL.createObjectURL(
      blob
    );

  const anchor =
    document.createElement(
      "a"
    );

  anchor.href = url;

  anchor.download =
    fileName ||
    "document";

  anchor.click();

  URL.revokeObjectURL(
    url
  );
};