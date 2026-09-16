import React, { createContext, useContext, useState } from "react";
import PurchaseService from "../../../core/services/modules/purchase.service";

/* =========================================================
   COMMON STYLES
========================================================= */

const inputClass =
  "h-[34px] w-full rounded-[6px] border border-[#dcdcd7] bg-white px-3 text-[11px] text-[#33342f] outline-none placeholder:text-[#a4a49e] focus:border-[#171815]";

const labelClass =
  "mb-[6px] block text-[10px] font-semibold text-[#242520]";

const sectionClass =
  "rounded-[8px] border border-[#e4e2dd] bg-white p-4";

const VendorFormContext = createContext({ editMode: false });


/* =========================================================
   FIELD
========================================================= */

const Field = ({ label, required, children }) => {
  const { editMode } = useContext(VendorFormContext);

  return (
    <div>
      <label className={labelClass}>
        {label}{" "}
        {required && (
          <span className="text-[#171815]">*</span>
        )}
      </label>

      {React.isValidElement(children) && required && editMode
        ? React.cloneElement(children, { disabled: true })
        : children}
    </div>
  );
};


/* =========================================================
   SELECT
========================================================= */

const Select = ({
  placeholder,
  value,
  onChange,
  disabled = false,
  children,
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${inputClass} disabled:cursor-not-allowed disabled:bg-[#f1f0ec] disabled:text-[#888]`}
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  );
};


/* =========================================================
   DOCUMENT UPLOAD
========================================================= */

const DocumentUpload = ({
  title,
  file,
  onChange,
}) => {
  return (
    <div className="min-w-0">

      {/* Document title */}
      <div className="mb-2 text-center text-[10px] font-semibold text-[#242520]">
        {title}
      </div>

      {/* Upload area */}
      <label
        className="
          flex
          h-[105px]
          w-full
          cursor-pointer
          flex-col
          items-center
          justify-center
          rounded-[7px]
          border
          border-dashed
          border-[#bcbcb6]
          bg-white
          px-2
          text-center
          transition-colors
          hover:bg-[#f7f6f2]
        "
      >

        {/* Upload icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="mb-2 text-[#252620]"
        >
          <path
            d="M12 16V4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M7 9L12 4L17 9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M5 20H19"
            strokeLinecap="round"
          />
        </svg>

        {/* File selected */}
        {file ? (
          <>
            <span
              className="
                max-w-full
                truncate
                px-2
                text-[9px]
                font-semibold
                text-[#171815]
              "
            >
              {file.name}
            </span>

            <span className="mt-1 text-[8px] text-[#777871]">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </>
        ) : (
          <>
            <span className="text-[10px] font-medium text-[#33342f]">
              Upload file
            </span>

            <span className="mt-1 text-[8px] text-[#92938d]">
              PDF, JPG, PNG (Max 5MB)
            </span>
          </>
        )}

        {/* Actual file input */}
        <input
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];

            if (!selectedFile) return;

            /* 5 MB validation */
            if (selectedFile.size > 5 * 1024 * 1024) {
              alert("File size must be less than 5MB.");

              e.target.value = "";

              return;
            }

            onChange(selectedFile);
          }}
        />
      </label>

      {/* Remove selected file */}
      {file && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="
            mt-1
            w-full
            text-center
            text-[8px]
            text-[#8a5b5b]
            hover:underline
          "
        >
          Remove file
        </button>
      )}
    </div>
  );
};


/* =========================================================
   ADD VENDOR MODAL
========================================================= */

const AddVendorModal = ({ onClose, onSave, initialVendor = null, readOnly = false, editMode = false }) => {

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [form, setForm] = useState({

    /* Vendor Information */
    vendorName: "",
    vendorCode: "V-0000", // Auto-generated
    vendorType: "",
    category: "",
    status: "Active",
    website: "",
    description: "",

    /* Contact Information */
    contactName: "",
    designation: "",
    email: "",
    phone: "",
    alternatePhone: "",
    contactWebsite: "",

    /* Address */
    address1: "",
    address2: "",
    country: "India",
    state: "",
    city: "",
    pinCode: "",
    sameBilling: true,

    /* Tax */
    gstType: "",
    gstin: "",
    pan: "",
    tan: "",
    cin: "",
    msme: "",
    taxState: "",

    /* Purchase */
    creditLimit: "",
    creditPeriod: "",
    paymentTerms: "",
    currency: "INR - Indian Rupee",
    minimumOrderValue: "",
    deliveryDays: "",
    purchaseCategory: "",

    /* Bank */
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    branchName: "",
    accountType: "",
    upiId: "",

    /* Additional */
    rating: "",
    tags: "",
    notes: "",
    ...(initialVendor ? {
      ...Object.fromEntries(
        Object.entries(initialVendor).map(([key, value]) => [key, value ?? ""])
      ),
      address1: initialVendor.address1 || initialVendor.address || "",
      address2: initialVendor.address2 || initialVendor.addressLine2 || "",
      branchName: initialVendor.branchName || initialVendor.bankBranch || "",
      creditPeriod: initialVendor.creditPeriod || initialVendor.creditPeriodDays || "",
      currency: initialVendor.currency || "INR",
    } : {}),
  });


  /* =======================================================
     DOCUMENT STATE
  ======================================================= */

  const [documents, setDocuments] = useState({
    gstCertificate: null,
    panCard: null,
    cancelledCheque: null,
    vendorAgreement: null,
    msmeCertificate: null,
  });


  /* =======================================================
     UPDATE FORM
  ======================================================= */

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  /* =======================================================
     UPDATE DOCUMENT
  ======================================================= */

  const handleDocumentChange = (field, file) => {
    setDocuments((prev) => ({
      ...prev,
      [field]: file,
    }));
  };


  /* =======================================================
     SUBMIT
  ======================================================= */

const buildVendorPayload = (status) => ({
  /* Existing basic vendor fields */
  vendorName: form.vendorName.trim(),
  contactName: form.contactName.trim() || (status === "DRAFT" ? "Not assigned" : null),
  phone: form.phone || null,
  email: form.email || null,
  city: form.city || null,
  address: form.address1 || null,
  category: form.category || null,
  gstin: form.gstin || null,
  pan: form.pan || null,
  paymentTerms: form.paymentTerms || null,
  creditLimit: Number(form.creditLimit) || 0,
  rating: Number(form.rating) || 0,
  status,

  /* Vendor information */
  vendorType: form.vendorType || null,
  website: form.website || null,
  description: form.description || null,

  /* Contact information */
  designation: form.designation || null,
  alternatePhone: form.alternatePhone || null,
  contactWebsite: form.contactWebsite || null,

  /* Address */
  addressLine2: form.address2 || null,
  country: form.country || "India",
  state: form.state || null,
  pinCode: form.pinCode || null,

  /* Tax */
  gstType: form.gstType || null,
  tan: form.tan || null,
  cin: form.cin || null,
  msme: form.msme || null,
  taxState: form.taxState || null,

  /* Purchase */
  creditPeriodDays: Number.parseInt(form.creditPeriod, 10) || null,
  currency: form.currency?.split(" ")[0] || "INR",
  minimumOrderValue: Number(form.minimumOrderValue) || 0,
  deliveryDays: Number(form.deliveryDays) || null,
  purchaseCategory: form.purchaseCategory || null,

  /* Bank */
  accountHolder: form.accountHolder || null,
  bankName: form.bankName || null,
  accountNumber: form.accountNumber || null,
  ifsc: form.ifsc || null,
  bankBranch: form.branchName || null,
  accountType: form.accountType || null,
  upiId: form.upiId || null,

  /* Additional */
  tags: form.tags || null,
  notes: form.notes || null,
});

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.vendorName.trim()) {
    alert("Vendor name is required.");
    return;
  }

  if (!form.contactName.trim()) {
    alert("Contact name is required.");
    return;
  }

  try {
    const response = editMode
      ? await PurchaseService.updateVendor(initialVendor.id, buildVendorPayload(form.status.toUpperCase()))
      : await PurchaseService.createVendor(buildVendorPayload(form.status.toUpperCase()));

    if (Object.values(documents).some(Boolean)) {
      if (!editMode) {
        alert("Vendor saved. Document upload will be added after the Supabase Storage integration.");
      }
    }

    onSave(response.data);
  } catch (error) {
    console.error(editMode ? "Failed to update vendor:" : "Failed to create vendor:", error.response?.data || error);

    alert(
      error?.response?.data?.message ||
        `Unable to ${editMode ? "update" : "create"} vendor. Please check the entered information.`
    );
  }
};

const handleSaveDraft = async () => {
  if (!form.vendorName.trim()) {
    alert("Enter at least a vendor name before saving a draft.");
    return;
  }

  try {
    const response = editMode
      ? await PurchaseService.updateVendor(initialVendor.id, buildVendorPayload(form.status.toUpperCase()))
      : await PurchaseService.createVendor(buildVendorPayload("DRAFT"));

    onSave(response.data);
  } catch (error) {
    console.error("Failed to save vendor:", error.response?.data || error);

    alert(
      error?.response?.data?.message ||
        "Unable to save vendor draft."
    );
  }
};

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        overflow-y-auto
        bg-black/30
        p-3
        sm:p-5
      "
    >

      <div className="mx-auto min-h-full max-w-[1200px] overflow-hidden rounded-[18px] bg-[#f7f6f2] shadow-2xl">

        {/* =================================================
            MODAL
        ================================================= */}

        <div className="rounded-[10px] bg-[#f7f6f2] shadow-2xl">


          {/* =================================================
              HEADER
          ================================================= */}

          <div
            className="
              flex
              flex-col
              gap-4
              border-b
              border-[#e4e2dd]
              bg-[#f7f6f2]
              px-5
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:px-6
            "
          >

            {/* Header left */}

            <div>

              <button
                type="button"
                onClick={onClose}
                className="
                  mb-3
                  text-[11px]
                  text-[#555650]
                  transition-colors
                  hover:text-black
                "
              >
                ← Back to Vendors
              </button>


              <h1
                className="
                  font-serif
                  text-[22px]
                  font-semibold
                  tracking-[-0.02em]
                  text-[#171815]
                "
              >
                {readOnly ? "Vendor Details" : editMode ? "Edit Vendor" : "Add New Vendor"}
              </h1>


              <p className="mt-1 text-[11px] text-[#858680]">
                {readOnly ? "View vendor information" : editMode ? "Update vendor information" : "Create a new vendor / supplier"}
              </p>

            </div>


            {/* Header buttons */}

            {!readOnly && !editMode && <div className="flex gap-3">

              <button
                type="button"
                onClick={handleSaveDraft}
                className="
                  rounded-[6px]
                  border
                  border-[#999a94]
                  bg-white
                  px-5
                  py-3
                  text-[11px]
                  font-semibold
                  transition-colors
                  hover:bg-[#f1f0ec]
                "
              >
                {editMode ? "Save Changes" : "▣  Save Draft"}
              </button>


              <button
                type="submit"
                form="vendor-form"
                className="
                  rounded-[6px]
                  bg-[#11120f]
                  px-6
                  py-3
                  text-[11px]
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-[#292b27]
                "
              >
                {editMode ? "Save Changes" : "+  Add Vendor"}
              </button>

            </div>}

          </div>


          {/* =================================================
              FORM
          ================================================= */}

          <VendorFormContext.Provider value={{ editMode }}>
          <form
            id="vendor-form"
            onSubmit={handleSubmit}
            className={`space-y-[10px] p-4 sm:p-5 ${readOnly ? "pointer-events-none" : ""}`}
          >


            {/* =================================================
                1. VENDOR INFORMATION
            ================================================= */}

            <section className={sectionClass}>

              <h2 className="mb-4 text-[11px] font-bold tracking-[0.08em]">
                1. &nbsp; VENDOR INFORMATION
              </h2>


              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">


                <Field
                  label="Vendor Name"
                  required
                >
                  <input
                    className={inputClass}
                    placeholder="Enter vendor name"
                    value={form.vendorName}
                    onChange={(e) =>
                      updateField(
                        "vendorName",
                        e.target.value
                      )
                    }
                  />
                </Field>


                <Field
                  label="Vendor Code"
                  required
                >
                  <input
                    className={`${inputClass} bg-[#f7f6f2]`}
                    value={form.vendorCode}
                    readOnly
                  />

                  <p className="mt-1 text-[9px] text-[#8b8c86]">
                    Auto-generated
                  </p>
                </Field>


                <Field
                  label="Vendor Type"
                  required
                >
                  <Select
                    placeholder="Select vendor type"
                    value={form.vendorType}
                    onChange={(e) =>
                      updateField(
                        "vendorType",
                        e.target.value
                      )
                    }
                  >
                    <option value="Manufacturer">
                      Manufacturer
                    </option>

                    <option value="Distributor">
                      Distributor
                    </option>

                    <option value="Supplier">
                      Supplier
                    </option>

                    <option value="Service Provider">
                      Service Provider
                    </option>
                  </Select>
                </Field>


                <Field
                  label="Category"
                  required
                >
                  <Select
                    placeholder="Select category"
                    value={form.category}
                    onChange={(e) =>
                      updateField(
                        "category",
                        e.target.value
                      )
                    }
                  >
                    <option value="Raw Materials">
                      Raw Materials
                    </option>

                    <option value="Components">
                      Components
                    </option>

                    <option value="Hardware">
                      Hardware
                    </option>

                    <option value="Packaging">
                      Packaging
                    </option>

                    <option value="Services">
                      Services
                    </option>
                  </Select>
                </Field>


                <Field
                  label="Status"
                  required
                >
                  <Select
                    placeholder="Select status"
                    value={form.status}
                    onChange={(e) =>
                      updateField(
                        "status",
                        e.target.value
                      )
                    }
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </Select>
                </Field>


                <Field label="Website">
                  <input
                    className={inputClass}
                    placeholder="Enter website"
                    value={form.website}
                    onChange={(e) =>
                      updateField(
                        "website",
                        e.target.value
                      )
                    }
                  />
                </Field>


                <div className="md:col-span-2">

                  <Field label="Description">

                    <textarea
                      rows="3"
                      maxLength="500"
                      className="
                        w-full
                        resize-none
                        rounded-[6px]
                        border
                        border-[#dcdcd7]
                        px-3
                        py-2
                        text-[11px]
                        outline-none
                        placeholder:text-[#a4a49e]
                        focus:border-[#171815]
                      "
                      placeholder="Enter vendor description..."
                      value={form.description}
                      onChange={(e) =>
                        updateField(
                          "description",
                          e.target.value
                        )
                      }
                    />

                    <div className="text-right text-[9px] text-[#888982]">
                      {form.description.length}/500
                    </div>

                  </Field>

                </div>

              </div>

            </section>


            {/* =================================================
                2. CONTACT INFORMATION
            ================================================= */}

            <section className={sectionClass}>

              <h2 className="mb-4 text-[11px] font-bold tracking-[0.08em]">
                2. &nbsp; CONTACT INFORMATION
              </h2>


              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">


                <Field
                  label="Primary Contact Name"
                  required
                >
                  <input
                    className={inputClass}
                    placeholder="Enter contact name"
                    value={form.contactName}
                    onChange={(e) =>
                      updateField(
                        "contactName",
                        e.target.value
                      )
                    }
                  />
                </Field>


                <Field label="Designation">

                  <input
                    className={inputClass}
                    placeholder="Enter designation"
                    value={form.designation}
                    onChange={(e) =>
                      updateField(
                        "designation",
                        e.target.value
                      )
                    }
                  />

                </Field>


                <Field
                  label="Email"
                  required
                >
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={(e) =>
                      updateField(
                        "email",
                        e.target.value
                      )
                    }
                  />
                </Field>


                <Field
                  label="Phone Number"
                  required
                >
                  <input
                    className={inputClass}
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={(e) =>
                      updateField(
                        "phone",
                        e.target.value
                      )
                    }
                  />
                </Field>


                <Field label="Alternate Phone">

                  <input
                    className={inputClass}
                    placeholder="Enter alternate phone"
                    value={form.alternatePhone}
                    onChange={(e) =>
                      updateField(
                        "alternatePhone",
                        e.target.value
                      )
                    }
                  />

                </Field>


                <Field label="Website">

                  <input
                    className={inputClass}
                    placeholder="Enter website"
                    value={form.contactWebsite}
                    onChange={(e) =>
                      updateField(
                        "contactWebsite",
                        e.target.value
                      )
                    }
                  />

                </Field>

              </div>

            </section>


            {/* =================================================
                3. ADDRESS
            ================================================= */}

 <section className={sectionClass}>
  <h2 className="mb-4 text-[11px] font-bold tracking-[0.08em]">
    3. &nbsp; ADDRESS
  </h2>

  {/* Address Lines */}
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <Field label="Address Line 1" required>
      <input
        className={inputClass}
        placeholder="Enter address line 1"
        value={form.address1}
        onChange={(e) =>
          updateField("address1", e.target.value)
        }
      />
    </Field>

    <Field label="Address Line 2">
      <input
        className={inputClass}
        placeholder="Enter address line 2"
        value={form.address2}
        onChange={(e) =>
          updateField("address2", e.target.value)
        }
      />
    </Field>
  </div>

  {/* Country / State / City / PIN */}
  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <Field label="Country" required>
      <Select
        placeholder="Select country"
        value={form.country}
        onChange={(e) =>
          updateField("country", e.target.value)
        }
      >
        <option value="India">India</option>
      </Select>
    </Field>

    <Field label="State" required>
      <Select
        placeholder="Select state"
        value={form.state}
        onChange={(e) =>
          updateField("state", e.target.value)
        }
      >
        <option value="Maharashtra">Maharashtra</option>
        <option value="Gujarat">Gujarat</option>
        <option value="Karnataka">Karnataka</option>
        <option value="Delhi">Delhi</option>
        <option value="Rajasthan">Rajasthan</option>
      </Select>
    </Field>

    <Field label="City" required>
      <Select
        placeholder="Select city"
        value={form.city}
        onChange={(e) =>
          updateField("city", e.target.value)
        }
      >
        <option value="Mumbai">Mumbai</option>
        <option value="Pune">Pune</option>
        <option value="Delhi">Delhi</option>
        <option value="Udaipur">Udaipur</option>
        <option value="Coimbatore">Coimbatore</option>
      </Select>
    </Field>

    <Field label="PIN / Zip Code" required>
      <input
        className={inputClass}
        placeholder="Enter pin code"
        value={form.pinCode}
        onChange={(e) =>
          updateField("pinCode", e.target.value)
        }
      />
    </Field>
  </div>

  {/* Billing Address */}
  <label className="mt-3 flex items-center gap-2 text-[10px]">
    <input
      type="checkbox"
      checked={form.sameBilling}
      onChange={(e) =>
        updateField("sameBilling", e.target.checked)
      }
      className="accent-black"
    />

    Billing address same as registered address
  </label>
</section>


            {/* =================================================
                4. TAX & LEGAL
            ================================================= */}

            <section className={sectionClass}>

              <h2 className="mb-4 text-[11px] font-bold tracking-[0.08em]">
                4. &nbsp; TAX & LEGAL INFORMATION
              </h2>


              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">


                <Field
                  label="GST Registration Type"
                  required
                >
                  <Select
                    placeholder="Select registration type"
                    value={form.gstType}
                    onChange={(e) =>
                      updateField(
                        "gstType",
                        e.target.value
                      )
                    }
                  >
                    <option value="Regular">
                      Regular
                    </option>

                    <option value="Composition">
                      Composition
                    </option>

                    <option value="Unregistered">
                      Unregistered
                    </option>
                  </Select>
                </Field>


                <Field label="GSTIN">

                  <input
                    className={inputClass}
                    placeholder="Enter GSTIN"
                    value={form.gstin}
                    onChange={(e) =>
                      updateField(
                        "gstin",
                        e.target.value
                      )
                    }
                  />

                </Field>


                <Field
                  label="PAN"
                  required
                >
                  <input
                    className={inputClass}
                    placeholder="Enter PAN"
                    value={form.pan}
                    onChange={(e) =>
                      updateField(
                        "pan",
                        e.target.value
                      )
                    }
                  />
                </Field>


                <Field label="TAN">

                  <input
                    className={inputClass}
                    placeholder="Enter TAN"
                    value={form.tan}
                    onChange={(e) =>
                      updateField(
                        "tan",
                        e.target.value
                      )
                    }
                  />

                </Field>


                <Field label="CIN">

                  <input
                    className={inputClass}
                    placeholder="Enter CIN"
                    value={form.cin}
                    onChange={(e) =>
                      updateField(
                        "cin",
                        e.target.value
                      )
                    }
                  />

                </Field>


                <Field label="MSME Registration No.">

                  <input
                    className={inputClass}
                    placeholder="Enter MSME registration no."
                    value={form.msme}
                    onChange={(e) =>
                      updateField(
                        "msme",
                        e.target.value
                      )
                    }
                  />

                </Field>


                <Field
                  label="Tax Region / State"
                  required
                >
                  <Select
                    placeholder="Select state"
                    value={form.taxState}
                    onChange={(e) =>
                      updateField(
                        "taxState",
                        e.target.value
                      )
                    }
                  >
                    <option value="Maharashtra">
                      Maharashtra
                    </option>

                    <option value="Gujarat">
                      Gujarat
                    </option>

                    <option value="Karnataka">
                      Karnataka
                    </option>
                  </Select>
                </Field>

              </div>

            </section>


            {/* =================================================
                5. PURCHASE & CREDIT
            ================================================= */}

            <section className={sectionClass}>

              <h2 className="mb-4 text-[11px] font-bold tracking-[0.08em]">
                5. &nbsp; PURCHASE & CREDIT INFORMATION
              </h2>


              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">


                <Field
                  label="Credit Limit"
                  required
                >

                  <div className="relative">

                    <span className="absolute left-3 top-[9px] text-[11px]">
                      ₹
                    </span>

                    <input
                      className={`${inputClass} pl-7`}
                      placeholder="Enter credit limit"
                      value={form.creditLimit}
                      onChange={(e) =>
                        updateField(
                          "creditLimit",
                          e.target.value
                        )
                      }
                    />

                  </div>

                </Field>


                <Field
                  label="Credit Period"
                  required
                >
                  <Select
                    placeholder="Select credit period"
                    value={form.creditPeriod}
                    onChange={(e) =>
                      updateField(
                        "creditPeriod",
                        e.target.value
                      )
                    }
                  >
                    <option value="15 Days">
                      15 Days
                    </option>

                    <option value="30 Days">
                      30 Days
                    </option>

                    <option value="45 Days">
                      45 Days
                    </option>

                    <option value="60 Days">
                      60 Days
                    </option>
                  </Select>
                </Field>


                <Field
                  label="Payment Terms"
                  required
                >
                  <Select
                    placeholder="Select payment terms"
                    value={form.paymentTerms}
                    onChange={(e) =>
                      updateField(
                        "paymentTerms",
                        e.target.value
                      )
                    }
                  >
                    <option value="Advance">
                      Advance
                    </option>

                    <option value="Net 30">
                      Net 30
                    </option>

                    <option value="Net 45">
                      Net 45
                    </option>

                    <option value="Net 60">
                      Net 60
                    </option>
                  </Select>
                </Field>


                <Field
                  label="Currency"
                  required
                >
                  <Select
                    placeholder="Select currency"
                    value={form.currency}
                    onChange={(e) =>
                      updateField(
                        "currency",
                        e.target.value
                      )
                    }
                  >
                    <option value="INR - Indian Rupee">
                      INR - Indian Rupee
                    </option>

                    <option value="USD - US Dollar">
                      USD - US Dollar
                    </option>
                  </Select>
                </Field>


                <Field label="Minimum Order Value">

                  <div className="relative">

                    <span className="absolute left-3 top-[9px] text-[11px]">
                      ₹
                    </span>

                    <input
                      className={`${inputClass} pl-7`}
                      placeholder="Enter minimum order value"
                      value={form.minimumOrderValue}
                      onChange={(e) =>
                        updateField(
                          "minimumOrderValue",
                          e.target.value
                        )
                      }
                    />

                  </div>

                </Field>


                <Field label="Preferred Delivery Days">

                  <input
                    className={inputClass}
                    placeholder="Enter days"
                    value={form.deliveryDays}
                    onChange={(e) =>
                      updateField(
                        "deliveryDays",
                        e.target.value
                      )
                    }
                  />

                </Field>


                <Field label="Purchase Category">

                  <Select
                    placeholder="Select or add categories"
                    value={form.purchaseCategory}
                    onChange={(e) =>
                      updateField(
                        "purchaseCategory",
                        e.target.value
                      )
                    }
                  >
                    <option value="Raw Materials">
                      Raw Materials
                    </option>

                    <option value="Components">
                      Components
                    </option>

                    <option value="Packaging">
                      Packaging
                    </option>
                  </Select>

                </Field>

              </div>

            </section>


            {/* =================================================
                6. BANK & PAYMENT
            ================================================= */}

            <section className={sectionClass}>

              <h2 className="mb-4 text-[11px] font-bold tracking-[0.08em]">
                6. &nbsp; BANK & PAYMENT DETAILS
              </h2>


              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">


                <Field
                  label="Account Holder Name"
                  required
                >
                  <input
                    className={inputClass}
                    placeholder="Enter account holder name"
                    value={form.accountHolder}
                    onChange={(e) =>
                      updateField(
                        "accountHolder",
                        e.target.value
                      )
                    }
                  />
                </Field>


                <Field
                  label="Bank Name"
                  required
                >
                  <input
                    className={inputClass}
                    placeholder="Enter bank name"
                    value={form.bankName}
                    onChange={(e) =>
                      updateField(
                        "bankName",
                        e.target.value
                      )
                    }
                  />
                </Field>


                <Field
                  label="Account Number"
                  required
                >
                  <input
                    className={inputClass}
                    placeholder="Enter account number"
                    value={form.accountNumber}
                    onChange={(e) =>
                      updateField(
                        "accountNumber",
                        e.target.value
                      )
                    }
                  />
                </Field>


                <Field
                  label="IFSC Code"
                  required
                >
                  <input
                    className={inputClass}
                    placeholder="Enter IFSC code"
                    value={form.ifsc}
                    onChange={(e) =>
                      updateField(
                        "ifsc",
                        e.target.value
                      )
                    }
                  />
                </Field>


                <Field label="Branch Name">

                  <input
                    className={inputClass}
                    placeholder="Enter branch name"
                    value={form.branchName}
                    onChange={(e) =>
                      updateField(
                        "branchName",
                        e.target.value
                      )
                    }
                  />

                </Field>


                <Field label="Account Type">

                  <Select
                    placeholder="Select account type"
                    value={form.accountType}
                    onChange={(e) =>
                      updateField(
                        "accountType",
                        e.target.value
                      )
                    }
                  >
                    <option value="Current">
                      Current
                    </option>

                    <option value="Savings">
                      Savings
                    </option>
                  </Select>

                </Field>


                <Field label="UPI ID">

                  <input
                    className={inputClass}
                    placeholder="Enter UPI ID (optional)"
                    value={form.upiId}
                    onChange={(e) =>
                      updateField(
                        "upiId",
                        e.target.value
                      )
                    }
                  />

                </Field>

              </div>

            </section>


            {/* =================================================
                7. DOCUMENTS & ADDITIONAL INFORMATION
            ================================================= */}

            <section className={sectionClass}>

              <h2 className="mb-5 text-[11px] font-bold tracking-[0.08em]">
                7. &nbsp; DOCUMENTS & ADDITIONAL INFORMATION
              </h2>


              {/* Documents */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                  lg:grid-cols-5
                "
              >

                <DocumentUpload
                  title="GST Certificate"
                  file={documents.gstCertificate}
                  onChange={(file) =>
                    handleDocumentChange(
                      "gstCertificate",
                      file
                    )
                  }
                />


                <DocumentUpload
                  title="PAN Card"
                  file={documents.panCard}
                  onChange={(file) =>
                    handleDocumentChange(
                      "panCard",
                      file
                    )
                  }
                />


                <DocumentUpload
                  title="Cancelled Cheque"
                  file={documents.cancelledCheque}
                  onChange={(file) =>
                    handleDocumentChange(
                      "cancelledCheque",
                      file
                    )
                  }
                />


                <DocumentUpload
                  title="Vendor Agreement"
                  file={documents.vendorAgreement}
                  onChange={(file) =>
                    handleDocumentChange(
                      "vendorAgreement",
                      file
                    )
                  }
                />


                <DocumentUpload
                  title="MSME Certificate"
                  file={documents.msmeCertificate}
                  onChange={(file) =>
                    handleDocumentChange(
                      "msmeCertificate",
                      file
                    )
                  }
                />

              </div>


              {/* Additional information */}

              <div
                className="
                  mt-6
                  grid
                  grid-cols-1
                  gap-5
                  md:grid-cols-3
                "
              >


                {/* Rating */}

                <Field label="Vendor Rating">

                  <div className="flex items-center gap-2">

                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() =>
                            updateField(
                              "rating",
                              String(star)
                            )
                          }
                          className={`
                            text-[20px]
                            leading-none
                            transition-colors
                            ${
                              Number(form.rating) >=
                              star
                                ? "text-[#b2a477]"
                                : "text-[#d4d2cb]"
                            }
                          `}
                        >
                          ☆
                        </button>
                      )
                    )}

                    <span className="ml-1 text-[9px] text-[#999a94]">
                      (Optional)
                    </span>

                  </div>

                </Field>


                {/* Tags */}

                <Field label="Tags">

                  <input
                    className={inputClass}
                    placeholder="Select or add tags"
                    value={form.tags}
                    onChange={(e) =>
                      updateField(
                        "tags",
                        e.target.value
                      )
                    }
                  />

                </Field>


                {/* Internal notes */}

                <Field label="Internal Notes">

                  <textarea
                    rows="3"
                    maxLength="500"
                    className="
                      w-full
                      resize-none
                      rounded-[6px]
                      border
                      border-[#dcdcd7]
                      px-3
                      py-2
                      text-[11px]
                      outline-none
                      placeholder:text-[#a4a49e]
                      focus:border-[#171815]
                    "
                    placeholder="Enter internal notes..."
                    value={form.notes}
                    onChange={(e) =>
                      updateField(
                        "notes",
                        e.target.value
                      )
                    }
                  />

                  <div className="text-right text-[9px] text-[#888982]">
                    {form.notes.length}/500
                  </div>

                </Field>

              </div>

            </section>


            {/* =================================================
                BOTTOM BUTTONS
            ================================================= */}

            <div
              className="
                flex
                flex-col
                justify-end
                gap-3
                pb-2
                pt-2
                sm:flex-row
              "
            >

              {!readOnly && <button
                type="button"
                onClick={onClose}
                className="
                  rounded-[6px]
                  border
                  border-[#d4d3cd]
                  bg-white
                  px-6
                  py-3
                  text-[11px]
                  font-semibold
                  transition-colors
                  hover:bg-[#f1f0ec]
                "
              >
                Cancel
              </button>}


              {!readOnly && !editMode && <button
                type="button"
                onClick={handleSaveDraft}
                className="
                  rounded-[6px]
                  border
                  border-[#d4d3cd]
                  bg-white
                  px-6
                  py-3
                  text-[11px]
                  font-semibold
                  transition-colors
                  hover:bg-[#f1f0ec]
                "
              >
                {editMode ? "Save Changes" : "▣  Save Draft"}
              </button>}


              {!readOnly && <button
                type="submit"
                className="
                  rounded-[6px]
                  bg-[#11120f]
                  px-6
                  py-3
                  text-[11px]
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-[#292b27]
                "
              >
                {editMode ? "Save Changes" : "+  Add Vendor"}
              </button>}

            </div>

          </form>
          </VendorFormContext.Provider>

        </div>

      </div>

    </div>
  );
};


export default AddVendorModal;