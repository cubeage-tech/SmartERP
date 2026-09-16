import React, { useEffect, useState } from "react";
import PurchaseService from "../../../core/services/modules/purchase.service";

/* =========================================================
   COMMON INPUT STYLE
========================================================= */

const inputClass =
  "h-[40px] w-full min-w-0 rounded-[9px] border border-[#dcdad4] bg-white px-3 text-[11px] outline-none transition focus:border-[#77766f] focus:ring-1 focus:ring-[#eceae4]";

/* =========================================================
   CURRENCIES
========================================================= */

const currencies = [
  {
    code: "INR",
    label: "INR - Indian Rupee",
  },
  {
    code: "USD",
    label: "USD - US Dollar",
  },
  {
    code: "EUR",
    label: "EUR - Euro",
  },
  {
    code: "GBP",
    label: "GBP - British Pound",
  },
  {
    code: "AED",
    label: "AED - UAE Dirham",
  },
];

/* =========================================================
   CURRENCY FORMATTER
========================================================= */

const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
};

/* =========================================================
   CREATE PURCHASE ORDER
========================================================= */

const CreatePurchaseOrder = ({
  vendors = [],
  onClose,
  onSave,
  editOrder = null,
}) => {
  const isEditing = Boolean(editOrder?.id);
  /* =====================================================
     FORM
  ===================================================== */

  const [form, setForm] = useState({

    poDate: new Date().toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric",}),
    vendorId: "",
    company: "",
    branch: "",
    purchaseType: "Material",
    currency: "INR",
    referenceNo: "",
    quotationDate: "",
    deliveryDate: "",
    deliveryLocation: "Pune",
    warehouse: "Main Warehouse",
    shippingAddress: "",
    shippingMethod: "Road",
    freightTerms: "Paid by Supplier",
    paymentTerms: "Net 30 Days",
    creditPeriod: "30",
    paymentMethod: "Bank Transfer",
    notes: "",
  });

  /* =====================================================
     ITEMS
  ===================================================== */

  const [items, setItems] = useState([
    {
      id: 1,
      name: "",
      description: "",
      sku: "",
      qty: 1,
      uom: "Nos",
      rate: 0,
      discount: 0,
      tax: 18,
    },
  ]);

const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    if (!editOrder) return;
    setForm((previous) => ({
      ...previous,
      poDate: editOrder.orderDate || previous.poDate,
      vendorId: String(editOrder.vendorId || ""),
      deliveryDate: editOrder.expectedDeliveryDate || "",
      deliveryLocation: editOrder.deliveryLocation || "",
      paymentTerms: editOrder.paymentTerms || previous.paymentTerms,
      notes: editOrder.notes || "",
    }));
    setItems((editOrder.items || []).map((item, index) => ({
      id: item.id || index + 1,
      name: item.description || "",
      description: item.description || "",
      sku: "",
      qty: Number(item.quantity) || 0,
      uom: "Nos",
      rate: Number(item.unitPrice) || 0,
      discount: 0,
      tax: Number(item.taxRate) || 0,
    })));
    setSelectedVendor(vendors.find((vendor) => vendor.id === editOrder.vendorId) || {
      vendorName: editOrder.vendorName,
      vendorCode: "-",
    });
  }, [editOrder, vendors]);

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleVendorChange = async (e) => {
  const vendorId = e.target.value;

  setForm((prev) => ({
    ...prev,
    vendorId,
  }));

  if (!vendorId) {
    setSelectedVendor(null);
    return;
  }

  try {
    const response = await PurchaseService.getVendorById(vendorId);
    const vendor = response.data;

    setSelectedVendor(vendor);

    setForm((prev) => ({
      ...prev,
      vendorId,
      shippingAddress: vendor?.address || "",
      paymentTerms: vendor?.paymentTerms || prev.paymentTerms,
    }));
  } catch (error) {
    console.error("Failed to load vendor details:", error);
    setSelectedVendor(null);
  }
};

  /* =====================================================
     ITEM CHANGE
  ===================================================== */

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }

        let updatedValue = value;

        /* Quantity */
        if (field === "qty") {
          const numericValue = Number(value);

          updatedValue =
            Number.isFinite(numericValue) &&
            numericValue >= 0
              ? numericValue
              : 0;
        }

        /* Rate */
        if (field === "rate") {
          const numericValue = Number(value);

          updatedValue =
            Number.isFinite(numericValue) &&
            numericValue >= 0
              ? numericValue
              : 0;
        }

        /* Discount */
        if (field === "discount") {
          const numericValue = Number(value);

          updatedValue = Math.min(
            100,
            Math.max(
              0,
              Number.isFinite(numericValue)
                ? numericValue
                : 0
            )
          );
        }

        /* Tax */
        if (field === "tax") {
          const numericValue = Number(value);

          updatedValue =
            Number.isFinite(numericValue) &&
            numericValue >= 0
              ? numericValue
              : 0;
        }

        return {
          ...item,
          [field]: updatedValue,
        };
      })
    );
  };

  /* =====================================================
     ADD ITEM
  ===================================================== */

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        description: "",
        sku: "",
        qty: 1,
        uom: "Nos",
        rate: 0,
        discount: 0,
        tax: 18,
      },
    ]);
  };

  /* =====================================================
     REMOVE ITEM
  ===================================================== */

  const removeItem = (id) => {
    if (items.length === 1) {
      return;
    }

    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  /* =====================================================
     TOTALS
  ===================================================== */

  const subtotal = items.reduce(
    (total, item) => {
      const qty = Math.max(
        0,
        Number(item.qty || 0)
      );

      const rate = Math.max(
        0,
        Number(item.rate || 0)
      );

      return total + qty * rate;
    },
    0
  );

  const totalDiscount = items.reduce(
    (total, item) => {
      const qty = Math.max(
        0,
        Number(item.qty || 0)
      );

      const rate = Math.max(
        0,
        Number(item.rate || 0)
      );

      const discount = Math.min(
        100,
        Math.max(
          0,
          Number(item.discount || 0)
        )
      );

      const amount = qty * rate;

      return (
        total +
        (amount * discount) / 100
      );
    },
    0
  );

  const taxableAmount =
    subtotal - totalDiscount;

  const taxAmount = items.reduce(
    (total, item) => {
      const qty = Math.max(
        0,
        Number(item.qty || 0)
      );

      const rate = Math.max(
        0,
        Number(item.rate || 0)
      );

      const discount = Math.min(
        100,
        Math.max(
          0,
          Number(item.discount || 0)
        )
      );

      const tax = Math.max(
        0,
        Number(item.tax || 0)
      );

      const amount = qty * rate;

      const discountedAmount =
        amount -
        (amount * discount) / 100;

      return (
        total +
        (discountedAmount * tax) / 100
      );
    },
    0
  );

  const grandTotal =
    taxableAmount + taxAmount;

 /* =====================================================
   SAVE / SUBMIT
===================================================== */

const savePurchaseOrder = async (submitForApproval = false) => {
  if (!selectedVendor) {
    alert("Please select a vendor.");
    return;
  }

  if (!form.deliveryDate) {
    alert("Please select an expected delivery date.");
    return;
  }

    const payload = {
    vendorId: Number(form.vendorId),
    vendorName: selectedVendor.vendorName,
    expectedDeliveryDate: form.deliveryDate,
    deliveryLocation: form.deliveryLocation,
    paymentTerms: form.paymentTerms,
    notes: form.notes,
      items: items.map((item) => ({
      productId: null,
      description: item.description || item.name,
      quantity: Number(item.qty),
      unitPrice: Number(item.rate),
      taxRate: Number(item.tax),
    })),
  };

  try {
    const response = isEditing
      ? await PurchaseService.updateOrder(editOrder.id, {
          expectedDeliveryDate: payload.expectedDeliveryDate,
          deliveryLocation: payload.deliveryLocation,
          paymentTerms: payload.paymentTerms,
          notes: payload.notes,
          ...(editOrder.status === "DRAFT" ? { items: payload.items } : {}),
        })
      : await PurchaseService.createOrder(payload);

    let finalOrder = response.data;

    // If Submit for Approval was clicked,
    // change the newly created PO from DRAFT -> SENT.
    if (submitForApproval && !isEditing) {
      const updateResponse = await PurchaseService.updateOrder(response.data.id, {
        status: "SENT",
      });

      finalOrder = updateResponse.data;
    }

    alert(
      submitForApproval
        ? "Purchase order submitted for approval."
        : "Purchase order saved as draft."
    );

    // Send the final backend response to Dashboard
    onSave(finalOrder);
  } catch (error) {
    console.error("Failed to save purchase order:", error);

    alert(
      error?.response?.data?.message ||
        "Failed to save purchase order."
    );
  }
};

/* =====================================================
   FORM SUBMIT
===================================================== */

const handleSubmit = (e) => {
  e.preventDefault();

  // Form submit means Submit for Approval
  savePurchaseOrder(true);
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="flex max-h-[94vh] w-full max-w-[1250px] flex-col overflow-hidden rounded-[18px] bg-[#f7f6f2] shadow-2xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#e4e2dd] bg-white px-6 py-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.14em] text-[#999a94]">
              PURCHASE ORDERS
            </p>
            <h2 className="mt-1 font-serif text-[23px] font-semibold text-[#171815]">
              {isEditing ? "Edit Purchase Order" : "Create Purchase Order"}
            </h2>
          </div>
          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-[11px] border border-[#d9d7d1] bg-white px-5 py-2.5 text-[11px] font-semibold text-[#252622] transition hover:bg-[#f5f4f0]"
            >
              Cancel
            </button>

<button
  type="button"
  onClick={() => savePurchaseOrder(false)}
  className="rounded-[11px] border border-[#d9d7d1] bg-white px-5 py-2.5 text-[11px] font-semibold text-[#252622] transition hover:bg-[#f5f4f0]"
>
  {isEditing ? "Save Changes" : "Save Draft"}
</button>

<button
  type="button"
  onClick={() => savePurchaseOrder(true)}
  className="rounded-[11px] bg-[#151714] px-5 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#292b27]"
>
  {isEditing ? "Save & Submit" : "Submit for Approval"}
</button>

          </div>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="overflow-y-auto px-5 py-5">

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <section className="rounded-[14px] border border-[#e4e2dd] bg-white p-4">

              <h3 className="mb-4 text-[11px] font-bold tracking-[0.08em]">
                1. BASIC INFORMATION
              </h3>

              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">

                <Field
                  label="PO Date *"
                  name="poDate"
                  value={form.poDate}
                  onChange={handleChange}
                />

                {/* VENDOR */}

                <div className="min-w-0 w-full">

                  <label className="mb-1.5 block h-[13px] text-[10px] font-semibold text-[#252622]">
                    Vendor *
                  </label>

                  <div className="relative">

                    <select
                      name="vendorId"
                      value={form.vendorId}
                      onChange={handleVendorChange}
                      className={`${inputClass} appearance-none pr-9`}
                    >

                      <option value="">
                        Select Vendor
                      </option>

                      {vendors.map((vendor) => (
                        <option
                          key={vendor.id}
                          value={vendor.id}
                        >
                          {vendor.vendorName}
                        </option>
                      ))}

                    </select>

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#777871]">
                      ▼
                    </span>

                  </div>
                </div>

                <Field
                  label="Vendor Code"
                  value={selectedVendor?.vendorCode || ""}
                  readOnly
                />

                <SelectField
                  label="Company *"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  options={[
                    "SmartERP Industries",
                    "SmartERP Manufacturing",
                  ]}
                  placeholder="Select Company"
                />

                <SelectField
                  label="Branch *"
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  options={[
                    "Pune",
                    "Mumbai",
                    "Delhi",
                  ]}
                  placeholder="Select Branch"
                />

                <SelectField
                  label="Purchase Type *"
                  name="purchaseType"
                  value={form.purchaseType}
                  onChange={handleChange}
                  options={[
                    "Material",
                    "Service",
                    "Asset",
                  ]}
                />

                <SelectField
                  label="Currency *"
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  options={currencies.map(
                    (item) => item.code
                  )}
                />

                <Field
                  label="Reference No."
                  name="referenceNo"
                  value={form.referenceNo}
                  onChange={handleChange}
                  placeholder="Enter Reference No."
                />

              </div>
            </section>

            {/* =================================================
                VENDOR DETAILS
            ================================================= */}

            <section className="rounded-[14px] border border-[#e4e2dd] bg-white p-4">

              <h3 className="mb-4 text-[11px] font-bold tracking-[0.08em]">
                2. VENDOR DETAILS
              </h3>

              {selectedVendor ? (

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">

                  <div className="min-w-0">

                    <div className="text-[15px] font-semibold text-[#171815]">
                      {selectedVendor.vendorName}
                    </div>

                    <span className="mt-2 inline-flex rounded-[7px] bg-[#151714] px-2.5 py-1 text-[9px] text-white">
                      {selectedVendor.vendorCode}
                    </span>

                  </div>

                  <VendorDetail
                    label="Contact Person"
                    value={selectedVendor.contactName}
                  />

                  <VendorDetail
                    label="Phone"
                    value={selectedVendor.phone}
                  />

                  <VendorDetail
                    label="Email"
                    value={selectedVendor.email}
                  />

                  <VendorDetail
                    label="GSTIN"
                    value={selectedVendor.gstin}
                  />

                  <VendorDetail
                    label="Billing Address"
                    value={selectedVendor.address}
                  />

                  <VendorDetail
                    label="PAN"
                    value={selectedVendor.pan}
                  />

                  <VendorDetail
                    label="Payment Terms"
                    value={selectedVendor.paymentTerms}
                  />

                  <VendorDetail
                    label="Credit Limit"
                    value={selectedVendor.creditLimit}
                  />

                </div>

              ) : (

                <div className="rounded-[10px] border border-dashed border-[#d5d3cd] bg-[#faf9f6] p-6 text-center text-[11px] text-[#999a94]">
                  Select a vendor above to view vendor details.
                </div>

              )}

            </section>

            {/* =================================================
                DELIVERY INFORMATION
            ================================================= */}

            <section className="rounded-[14px] border border-[#e4e2dd] bg-white p-4">

              <h3 className="mb-4 text-[11px] font-bold tracking-[0.08em]">
                3. DELIVERY INFORMATION
              </h3>

              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">

                <Field
                  label="Expected Delivery Date *"
                  name="deliveryDate"
                  type="date"
                  value={form.deliveryDate}
                  onChange={handleChange}
                />

                <SelectField
                  label="Delivery Location *"
                  name="deliveryLocation"
                  value={form.deliveryLocation}
                  onChange={handleChange}
                  options={[
                    "Pune",
                    "Mumbai",
                    "Delhi",
                    "Udaipur",
                  ]}
                />

                <SelectField
                  label="Warehouse *"
                  name="warehouse"
                  value={form.warehouse}
                  onChange={handleChange}
                  options={[
                    "Main Warehouse",
                    "Raw Material Warehouse",
                    "Finished Goods Warehouse",
                  ]}
                />

                <div className="min-w-0 w-full">

                  <label className="mb-1.5 block h-[13px] text-[10px] font-semibold">
                    Shipping Address *
                  </label>

                  <input
                    type="text"
                    name="shippingAddress"
                    value={form.shippingAddress}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Shipping address"
                  />

                </div>

                <SelectField
                  label="Shipping Method"
                  name="shippingMethod"
                  value={form.shippingMethod}
                  onChange={handleChange}
                  options={[
                    "Road",
                    "Rail",
                    "Air",
                    "Courier",
                  ]}
                />

                <SelectField
                  label="Freight Terms"
                  name="freightTerms"
                  value={form.freightTerms}
                  onChange={handleChange}
                  options={[
                    "Paid by Supplier",
                    "Paid by Buyer",
                  ]}
                />

              </div>
            </section>

            {/* =================================================
                ITEMS
            ================================================= */}

            <section className="rounded-[14px] border border-[#e4e2dd] bg-white p-4">

              <div className="mb-4 flex items-center justify-between">

                <h3 className="text-[11px] font-bold tracking-[0.08em]">
                  4. ITEMS / PRODUCTS
                </h3>

                <button
                  type="button"
                  onClick={addItem}
                  className="rounded-[9px] bg-[#151714] px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-[#292b27]"
                >
                  + Add Item
                </button>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px] border-collapse">

                  <thead>

                    <tr className="bg-[#f5f4f0]">

                      {[
                        "#",
                        "Item / Product",
                        "Description",
                        "SKU / Code",
                        "Qty",
                        "UOM",
                        "Rate",
                        "Disc. %",
                        "Tax %",
                        "Amount",
                        "Action",
                      ].map((heading) => (

                        <th
                          key={heading}
                          className="border border-[#e4e2dd] px-2 py-2 text-left text-[9px] font-semibold text-[#777871]"
                        >
                          {heading}
                        </th>

                      ))}

                    </tr>

                  </thead>

                  <tbody>

                    {items.map((item, index) => {

                      const qty = Math.max(
                        0,
                        Number(item.qty || 0)
                      );

                      const rate = Math.max(
                        0,
                        Number(item.rate || 0)
                      );

                      const discount = Math.min(
                        100,
                        Math.max(
                          0,
                          Number(item.discount || 0)
                        )
                      );

                      const amount =
                        qty * rate -
                        (qty *
                          rate *
                          discount) /
                          100;

                      return (

                        <tr key={item.id}>

                          {/* NUMBER */}

                          <td className="w-[40px] border border-[#e4e2dd] px-2 py-2 text-[10px]">
                            {index + 1}
                          </td>

                          {/* ITEM */}

                          <td className="w-[150px] border border-[#e4e2dd] p-1">

                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="Item"
                              className="h-[36px] w-full min-w-0 rounded-[7px] border border-transparent px-2 text-[10px] outline-none focus:border-[#dcdad4]"
                            />

                          </td>

                          {/* DESCRIPTION */}

                          <td className="w-[180px] border border-[#e4e2dd] p-1">

                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Description"
                              className="h-[36px] w-full min-w-0 rounded-[7px] border border-transparent px-2 text-[10px] outline-none focus:border-[#dcdad4]"
                            />

                          </td>

                          {/* SKU */}

                          <td className="w-[120px] border border-[#e4e2dd] p-1">

                            <input
                              type="text"
                              value={item.sku}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "sku",
                                  e.target.value
                                )
                              }
                              placeholder="SKU"
                              className="h-[36px] w-full min-w-0 rounded-[7px] border border-transparent px-2 text-[10px] outline-none focus:border-[#dcdad4]"
                            />

                          </td>

                          {/* QUANTITY */}

                          <td className="w-[85px] border border-[#e4e2dd] p-1">

                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={item.qty}
                              onChange={(e) => {

                                const value =
                                  e.target.value;

                                if (value === "") {
                                  updateItem(
                                    item.id,
                                    "qty",
                                    0
                                  );

                                  return;
                                }

                                updateItem(
                                  item.id,
                                  "qty",
                                  Math.max(
                                    0,
                                    Number(value)
                                  )
                                );

                              }}
                              onKeyDown={(e) => {

                                if (
                                  e.key === "-" ||
                                  e.key === "e"
                                ) {
                                  e.preventDefault();
                                }

                              }}
                              className="h-[36px] w-full rounded-[7px] border border-transparent px-2 text-[10px] outline-none focus:border-[#dcdad4]"
                            />

                          </td>

                          {/* UOM */}

                          <td className="w-[90px] border border-[#e4e2dd] p-1">

                            <div className="relative">

                              <select
                                value={item.uom}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "uom",
                                    e.target.value
                                  )
                                }
                                className="h-[36px] w-full appearance-none rounded-[7px] border border-transparent bg-white px-2 pr-6 text-[10px] outline-none focus:border-[#dcdad4]"
                              >
                                <option>
                                  Nos
                                </option>

                                <option>
                                  Kg
                                </option>

                                <option>
                                  Ton
                                </option>

                                <option>
                                  Meter
                                </option>

                                <option>
                                  Box
                                </option>
                              </select>

                              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-[#777871]">
                                ▼
                              </span>

                            </div>

                          </td>

                          {/* RATE */}

                          <td className="w-[110px] border border-[#e4e2dd] p-1">

                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "rate",
                                  e.target.value
                                )
                              }
                              className="h-[36px] w-full rounded-[7px] border border-transparent px-2 text-[10px] outline-none focus:border-[#dcdad4]"
                            />

                          </td>

                          {/* DISCOUNT */}

                          <td className="w-[85px] border border-[#e4e2dd] p-1">

                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={item.discount}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "discount",
                                  e.target.value
                                )
                              }
                              className="h-[36px] w-full rounded-[7px] border border-transparent px-2 text-[10px] outline-none focus:border-[#dcdad4]"
                            />

                          </td>

                          {/* TAX */}

                          <td className="w-[75px] border border-[#e4e2dd] p-1">

                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.tax}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "tax",
                                  e.target.value
                                )
                              }
                              className="h-[36px] w-full rounded-[7px] border border-transparent px-2 text-[10px] outline-none focus:border-[#dcdad4]"
                            />

                          </td>

                          {/* AMOUNT */}

                          <td className="w-[130px] border border-[#e4e2dd] px-2 py-2 text-[10px] font-semibold">

                            {formatCurrency(
                              amount,
                              form.currency
                            )}

                          </td>

                          {/* DELETE */}

                          <td className="w-[60px] border border-[#e4e2dd] p-1 text-center">

                            <button
                              type="button"
                              onClick={() =>
                                removeItem(item.id)
                              }
                              className="rounded-[6px] px-2 py-1 text-[14px] text-[#999a94] transition hover:bg-[#f5f4f0] hover:text-red-500"
                            >
                              ×
                            </button>

                          </td>

                        </tr>

                      );
                    })}

                  </tbody>

                </table>

              </div>

              {/* =================================================
                  TOTALS
              ================================================= */}

              <div className="mt-4 flex justify-end">

                <div className="w-full max-w-[320px] rounded-[10px] bg-[#f5f4f0] p-4">

                  <SummaryRow
                    label="Subtotal"
                    value={subtotal}
                    currency={form.currency}
                  />

                  <SummaryRow
                    label="Discount"
                    value={totalDiscount}
                    currency={form.currency}
                  />

                  <SummaryRow
                    label="Taxable Amount"
                    value={taxableAmount}
                    currency={form.currency}
                  />

                  <SummaryRow
                    label="Tax"
                    value={taxAmount}
                    currency={form.currency}
                  />

                  <div className="my-2 border-t border-[#dcdad4]" />

                  <div className="flex justify-between text-[12px] font-bold text-[#171815]">

                    <span>
                      GRAND TOTAL
                    </span>

                    <span>
                      {formatCurrency(
                        grandTotal,
                        form.currency
                      )}
                    </span>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                PAYMENT TERMS
            ================================================= */}

            <section className="rounded-[14px] border border-[#e4e2dd] bg-white p-4">

              <h3 className="mb-4 text-[11px] font-bold tracking-[0.08em]">
                5. PAYMENT TERMS
              </h3>

              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">

                <SelectField
                  label="Payment Terms"
                  name="paymentTerms"
                  value={form.paymentTerms}
                  onChange={handleChange}
                  options={[
                    "Net 15 Days",
                    "Net 30 Days",
                    "Net 45 Days",
                    "Net 60 Days",
                  ]}
                />

                <Field
                  label="Credit Period (Days)"
                  name="creditPeriod"
                  value={form.creditPeriod}
                  onChange={handleChange}
                  type="number"
                />

                <SelectField
                  label="Payment Method"
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  options={[
                    "Bank Transfer",
                    "Cheque",
                    "UPI",
                    "Cash",
                  ]}
                />

              </div>

            </section>

            {/* =================================================
                NOTES
            ================================================= */}

            <section className="rounded-[14px] border border-[#e4e2dd] bg-white p-4">

              <h3 className="mb-4 text-[11px] font-bold tracking-[0.08em]">
                6. NOTES & COMMENTS
              </h3>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Enter internal notes..."
                className="min-h-[90px] w-full resize-none rounded-[9px] border border-[#dcdad4] bg-white px-3 py-2.5 text-[11px] outline-none transition focus:border-[#77766f] focus:ring-1 focus:ring-[#eceae4]"
              />

            </section>

          </form>

        </div>

      </div>

    </div>
  );
};

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly = false,
}) {
  return (
    <div className="min-w-0 w-full">

      <label className="mb-1.5 block h-[13px] text-[10px] font-semibold text-[#252622]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${inputClass} ${
          readOnly
            ? "bg-[#f5f4f0] text-[#777871]"
            : ""
        }`}
      />

    </div>
  );
}

/* =========================================================
   SELECT FIELD
========================================================= */

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
}) {
  return (
    <div className="min-w-0 w-full">

      <label className="mb-1.5 block h-[13px] text-[10px] font-semibold text-[#252622]">
        {label}
      </label>

      <div className="relative">

        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`${inputClass} appearance-none pr-9`}
        >

          {placeholder && (
            <option value="">
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}

        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#777871]">
          ▼
        </span>

      </div>

    </div>
  );
}

/* =========================================================
   VENDOR DETAIL
========================================================= */

function VendorDetail({
  label,
  value,
}) {
  return (
    <div className="min-w-0">

      <div className="mb-1 text-[9px] font-semibold text-[#999a94]">
        {label}
      </div>

      <div className="break-words whitespace-pre-line text-[10px] text-[#3f403c]">
        {value || "-"}
      </div>

    </div>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({
  label,
  value,
  currency,
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-4 text-[10px] text-[#777871]">

      <span>
        {label}
      </span>

      <span className="font-medium text-[#3f403c]">
        {formatCurrency(
          value,
          currency
        )}
      </span>

    </div>
  );
}

export default CreatePurchaseOrder;