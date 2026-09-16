import React, { useState } from "react";

const initialCompanyInfo = {
  companyName: "Acme Manufacturing Ltd",
  legalName: "Acme Manufacturing Private Limited",
  gstin: "27AADCA3129H1ZX",
  pan: "AADCA3129H",
  industry: "Manufacturing",
  fiscalYear: "April — March",
  baseCurrency: "INR (₹)",
  timeZone: "Asia/Kolkata (IST)",
};

const initialAddress = {
  streetAddress: "Plot 14, MIDC Industrial Area",
  city: "Pune",
  state: "Maharashtra",
  pinCode: "411019",
};

function SettingField({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-[10px] block text-[10px] font-medium leading-none tracking-[0.16em] text-[#aaa9a3]">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={onChange}
        className="
          h-[40px]
          w-full
          rounded-[15px]
          font-sans
          border
          border-[#e4e2dd]
          bg-[#f5f4f0]
          px-4
          text-[13.5px]
          leading-none
          outline-none
          transition-all
          duration-200
          focus:border-[#bdbbb4]
          focus:bg-white
        "
      />
    </div>
  );
}

const GeneralSettings = () => {
  const [companyInfo, setCompanyInfo] = useState(initialCompanyInfo);
  const [address, setAddress] = useState(initialAddress);

  const handleCompanyChange = (field, value) => {
    setCompanyInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">

      {/* Company Information */}
      <section className="rounded-[20px] border border-[#e4e2dd] bg-white px-6 py-7 sm:px-[25px] sm:py-[14px]">
        <h2 className="mb-4 font-serif text-[20px]">
          Company Information
        </h2>

        <div className="grid grid-cols-1 gap-x-5 gap-y-3 md:grid-cols-2">

          <SettingField
            label="COMPANY NAME"
            value={companyInfo.companyName}
            onChange={(e) =>
              handleCompanyChange("companyName", e.target.value)
            }
          />

          <SettingField
            label="LEGAL NAME"
            value={companyInfo.legalName}
            onChange={(e) =>
              handleCompanyChange("legalName", e.target.value)
            }
          />

          <SettingField
            label="GSTIN"
            value={companyInfo.gstin}
            onChange={(e) =>
              handleCompanyChange("gstin", e.target.value)
            }
          />

          <SettingField
            label="PAN"
            value={companyInfo.pan}
            onChange={(e) =>
              handleCompanyChange("pan", e.target.value)
            }
          />

          <SettingField
            label="INDUSTRY"
            value={companyInfo.industry}
            onChange={(e) =>
              handleCompanyChange("industry", e.target.value)
            }
          />

          <SettingField
            label="FISCAL YEAR"
            value={companyInfo.fiscalYear}
            onChange={(e) =>
              handleCompanyChange("fiscalYear", e.target.value)
            }
          />

          <SettingField
            label="BASE CURRENCY"
            value={companyInfo.baseCurrency}
            onChange={(e) =>
              handleCompanyChange("baseCurrency", e.target.value)
            }
          />

          <SettingField
            label="TIME ZONE"
            value={companyInfo.timeZone}
            onChange={(e) =>
              handleCompanyChange("timeZone", e.target.value)
            }
          />

        </div>
      </section>

      {/* Address */}
      <section className="rounded-[20px] border border-[#e4e2dd] bg-white px-6 py-7 sm:px-[25px] sm:py-[14px]">
        <h2 className="mb-4 font-serif text-[20px]">
          Address
        </h2>

        <div className="grid grid-cols-1 gap-x-5 gap-y-3 md:grid-cols-2">

          <SettingField
            label="STREET ADDRESS"
            value={address.streetAddress}
            onChange={(e) =>
              handleAddressChange("streetAddress", e.target.value)
            }
          />

          <SettingField
            label="CITY"
            value={address.city}
            onChange={(e) =>
              handleAddressChange("city", e.target.value)
            }
          />

          <SettingField
            label="STATE"
            value={address.state}
            onChange={(e) =>
              handleAddressChange("state", e.target.value)
            }
          />

          <SettingField
            label="PIN CODE"
            value={address.pinCode}
            onChange={(e) =>
              handleAddressChange("pinCode", e.target.value)
            }
          />

        </div>
      </section>

    </div>
  );
};

export default GeneralSettings;