import React, { useCallback, useEffect, useState } from "react";
import PurchaseService from "../../../core/services/modules/purchase.service";
import AddVendorModal from "./AddVendorModal";

const headers = [
  "ID",
  "VENDOR",
  "CONTACT",
  "CITY",
  "CATEGORY",
  "CREDIT LIMIT",
  "RATING",
  "STATUS",
  "ACTIONS",
];

const gridColumns =
  "grid-cols-[120px_180px_140px_130px_140px_130px_130px_110px_90px]";

function Rating({ value }) {
  const filled = Math.round(Number(value || 0));

  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= filled ? "text-[#b2a477]" : "text-[#e4e2dc]"
          }
        >
          ●
        </span>
      ))}
    </div>
  );
}

function VendorRow({
  vendor,
  index,
  hoveredRow,
  setHoveredRow,
  openActionId,
  setOpenActionId,
  onView,
  onEdit,
  onDelete,
}) {
  const isHovered = hoveredRow === index;
  const actionsOpen = openActionId === vendor.id;

  return (
    <div
      onMouseEnter={() => setHoveredRow(index)}
      onMouseLeave={() => setHoveredRow(null)}
      className={`relative grid ${gridColumns} items-center border-b border-[#e4e2dd] px-6 py-[18px] ${
        isHovered ? "bg-[#f7f6f2]" : "bg-white"
      }`}
    >
      <div className="font-mono text-xs text-gray-400">
        {vendor.vendorCode}
      </div>

      <div className="text-sm font-semibold text-gray-800">
        {vendor.vendorName}
      </div>

      <div className="text-sm text-gray-500">{vendor.contactName}</div>
      <div className="text-sm text-gray-500">{vendor.city || "-"}</div>

      <div>
        <span className="rounded-[10px] border border-[#e4e2dd] bg-[#f5f4f0] px-[10px] py-[6px] text-[10px] text-[#777871]">
          {vendor.category || "-"}
        </span>
      </div>

      <div className="text-sm text-gray-800">
        ₹{Number(vendor.creditLimit || 0).toLocaleString("en-IN")}
      </div>

      <Rating value={vendor.rating} />

      <div>
        <span
          className={`rounded-[10px] px-[11px] py-[7px] text-[10px] font-semibold ${
            vendor.status === "ACTIVE"
              ? "bg-[#dfe9db] text-[#50614b]"
              : "bg-[#e7e5df] text-[#77766f]"
          }`}
        >
          {vendor.status}
        </span>
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label={`Actions for ${vendor.vendorName}`}
          onClick={() =>
            setOpenActionId(actionsOpen ? null : vendor.id)
          }
          className="rounded-md px-3 py-1 text-lg hover:bg-[#ecebe7]"
        >
          ⋮
        </button>

        {actionsOpen && (
          <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-[#e4e2dd] bg-white py-1 shadow-lg">
            <button
              type="button"
              onClick={() => {
                setOpenActionId(null);
                onView(vendor.id);
              }}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-[#f7f6f2]"
            >
              View
            </button>

            <button
              type="button"
              onClick={() => {
                setOpenActionId(null);
                onEdit(vendor.id);
              }}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-[#f7f6f2]"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => {
                setOpenActionId(null);
                onDelete(vendor.id);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const emptyToNull = (value) =>
  typeof value === "string" && !value.trim() ? null : value;

function VendorDetailsModal({
  vendor,
  mode,
  onClose,
  onSaved,
}) {
  const [editing, setEditing] = useState(mode === "edit");
  const [form, setForm] = useState({ ...vendor });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.vendorName?.trim() || !form.contactName?.trim()) {
      setError("Vendor name and contact name are required.");
      return;
    }

    const {
      id,
      tenantId,
      vendorCode,
      createdAt,
      updatedAt,
      ...payload
    } = form;

    try {
      setSaving(true);

      const response = await PurchaseService.updateVendor(id, {
        ...payload,
        vendorName: form.vendorName.trim(),
        contactName: form.contactName.trim(),
        phone: emptyToNull(form.phone),
        email: emptyToNull(form.email),
        city: emptyToNull(form.city),
        address: emptyToNull(form.address),
        category: emptyToNull(form.category),
        gstin: emptyToNull(form.gstin),
        pan: emptyToNull(form.pan),
        paymentTerms: emptyToNull(form.paymentTerms),
        creditLimit: Number(form.creditLimit || 0),
        rating: Number(form.rating || 0),
        minimumOrderValue: Number(form.minimumOrderValue || 0),
        creditPeriodDays:
          Number.parseInt(form.creditPeriodDays, 10) || null,
        deliveryDays:
          Number.parseInt(form.deliveryDays, 10) || null,
      });

      onSaved(response.data);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to update vendor."
      );
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, field, type = "text" }) => (
    <label className="block text-sm">
      <span className="mb-1 block text-[#555650]">{label}</span>

      {editing ? (
        <input
          type={type}
          value={form[field] ?? ""}
          onChange={(event) => updateField(field, event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      ) : (
        <p className="min-h-10 rounded-lg bg-[#f7f6f2] px-3 py-2">
          {vendor[field] || "-"}
        </p>
      )}
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
      <div className="mx-auto my-6 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-[#999a94]">
              {vendor.vendorCode}
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              {editing ? "Edit Vendor" : "Vendor Details"}
            </h2>
          </div>

          <button type="button" onClick={onClose} className="text-lg text-gray-500">
            ✕
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Vendor Name" field="vendorName" />
            <Field label="Contact Name" field="contactName" />
            <Field label="Email" field="email" type="email" />
            <Field label="Phone" field="phone" />
            <Field label="Category" field="category" />
            <Field label="City" field="city" />
            <Field label="Address" field="address" />
            <Field label="State" field="state" />
            <Field label="GSTIN" field="gstin" />
            <Field label="PAN" field="pan" />
            <Field label="Payment Terms" field="paymentTerms" />
            <Field label="Currency" field="currency" />
            <Field label="Credit Limit" field="creditLimit" type="number" />
            <Field label="Rating" field="rating" type="number" />
          </div>

          <label className="mt-4 block text-sm">
            <span className="mb-1 block text-[#555650]">Status</span>

            {editing ? (
              <select
                value={form.status || "ACTIVE"}
                onChange={(event) => updateField("status", event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="BLACKLISTED">Blacklisted</option>
              </select>
            ) : (
              <p className="rounded-lg bg-[#f7f6f2] px-3 py-2">
                {vendor.status}
              </p>
            )}
          </label>

          <label className="mt-4 block text-sm">
            <span className="mb-1 block text-[#555650]">Internal Notes</span>

            {editing ? (
              <textarea
                rows="4"
                value={form.notes ?? ""}
                onChange={(event) => updateField("notes", event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            ) : (
              <p className="min-h-20 rounded-lg bg-[#f7f6f2] px-3 py-2">
                {vendor.notes || "-"}
              </p>
            )}
          </label>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm">
              Close
            </button>

            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-lg bg-[#171815] px-4 py-2 text-sm text-white"
              >
                Edit Vendor
              </button>
            ) : (
              <button
                disabled={saving}
                type="submit"
                className="rounded-lg bg-[#171815] px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [openActionId, setOpenActionId] = useState(null);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorMode, setVendorMode] = useState("view");

  const fetchVendors = useCallback(async () => {
    try {
      setError("");

      const response = await PurchaseService.getAllVendors();
      setVendors(response.data || []);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to load vendors."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const openVendor = async (id, mode) => {
    try {
      const response = await PurchaseService.getVendorById(id);
      setSelectedVendor(response.data);
      setVendorMode(mode);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to load vendor details."
      );
    }
  };

  const deleteVendor = async (id) => {
    const vendor = vendors.find((item) => item.id === id);
    if (!vendor || !window.confirm(`Delete vendor ${vendor.vendorName}? Vendors with purchase orders cannot be deleted.`)) return;

    try {
      await PurchaseService.deleteVendor(id);
      setVendors((current) => current.filter((item) => item.id !== id));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to delete vendor.");
    }
  };

  const refreshAfterChange = async () => {
    setSelectedVendor(null);
    setShowAddVendor(false);
    setLoading(true);
    await fetchVendors();
  };

  return (
    <main className="bg-[#f7f6f2] px-4 py-4 text-[#171815] sm:px-6 lg:px-[30px]">
      <section className="overflow-visible rounded-[18px] border border-[#e4e2dd] bg-white">
        <header className="flex items-center justify-between border-b border-[#e4e2dd] px-6 py-5">
          <h1 className="font-serif text-xl">Vendor Directory</h1>

          <button
            type="button"
            onClick={() => setShowAddVendor(true)}
            className="rounded-[15px] bg-[#151714] px-5 py-3 text-[11px] font-semibold text-white"
          >
            + Add Vendor
          </button>
        </header>

        {error && (
          <div className="mx-6 mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <div className="min-w-[1320px]">
            <div className={`grid ${gridColumns} border-b border-[#e4e2dd] bg-[#f5f4f0] px-6 py-2`}>
              {headers.map((header) => (
                <div
                  key={header}
                  className="text-[9px] font-medium tracking-[0.1em] text-[#9b9b95]"
                >
                  {header}
                </div>
              ))}
            </div>

            {loading ? (
              <div className="px-6 py-10 text-center text-sm text-gray-400">
                Loading vendors...
              </div>
            ) : vendors.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-gray-400">
                No vendors found.
              </div>
            ) : (
              vendors.map((vendor, index) => (
                <VendorRow
                  key={vendor.id}
                  vendor={vendor}
                  index={index}
                  hoveredRow={hoveredRow}
                  setHoveredRow={setHoveredRow}
                  openActionId={openActionId}
                  setOpenActionId={setOpenActionId}
                  onView={(id) => openVendor(id, "view")}
                  onEdit={(id) => openVendor(id, "edit")}
                  onDelete={deleteVendor}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {showAddVendor && (
        <AddVendorModal
          onClose={() => setShowAddVendor(false)}
          onSave={refreshAfterChange}
        />
      )}

      {selectedVendor && (
        vendorMode === "view" ? (
          <AddVendorModal
            initialVendor={selectedVendor}
            readOnly
            onClose={() => setSelectedVendor(null)}
            onSave={() => setSelectedVendor(null)}
          />
        ) : (
          <AddVendorModal
            initialVendor={selectedVendor}
            editMode
            onClose={() => setSelectedVendor(null)}
            onSave={refreshAfterChange}
          />
        )
      )}

    </main>
  );
};

export default Vendors;