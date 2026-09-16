package com.cubeage.erp.purchase.mapper;

import com.cubeage.erp.purchase.dto.vendor.VendorResponse;
import com.cubeage.erp.purchase.dto.vendor.VendorSummaryResponse;
import com.cubeage.erp.purchase.entity.Vendor;
import org.springframework.stereotype.Component;

@Component
public class VendorMapper {

    public VendorResponse toResponse(Vendor vendor) {
        return new VendorResponse(
                vendor.getId(),
                vendor.getTenantId(),
                vendor.getVendorCode(),
                vendor.getVendorName(),
                vendor.getContactName(),
                vendor.getPhone(),
                vendor.getEmail(),
                vendor.getCity(),
                vendor.getAddress(),
                vendor.getCategory(),
                vendor.getGstin(),
                vendor.getPan(),
                vendor.getPaymentTerms(),
                vendor.getCreditLimit(),
                vendor.getRating(),
                vendor.getStatus(),

                vendor.getVendorType(),
                vendor.getWebsite(),
                vendor.getDescription(),

                vendor.getDesignation(),
                vendor.getAlternatePhone(),
                vendor.getContactWebsite(),

                vendor.getAddressLine2(),
                vendor.getCountry(),
                vendor.getState(),
                vendor.getPinCode(),

                vendor.getGstType(),
                vendor.getTan(),
                vendor.getCin(),
                vendor.getMsme(),
                vendor.getTaxState(),

                vendor.getCreditPeriodDays(),
                vendor.getCurrency(),
                vendor.getMinimumOrderValue(),
                vendor.getDeliveryDays(),
                vendor.getPurchaseCategory(),

                vendor.getAccountHolder(),
                vendor.getBankName(),
                vendor.getAccountNumber(),
                vendor.getIfsc(),
                vendor.getBankBranch(),
                vendor.getAccountType(),
                vendor.getUpiId(),

                vendor.getTags(),
                vendor.getNotes(),

                vendor.getCreatedAt(),
                vendor.getUpdatedAt()
        );
    }

    public VendorSummaryResponse toSummary(Vendor vendor) {
        return new VendorSummaryResponse(
                vendor.getId(),
                vendor.getVendorCode(),
                vendor.getVendorName(),
                vendor.getContactName(),
                vendor.getCity(),
                vendor.getCategory(),
                vendor.getCreditLimit(),
                vendor.getRating(),
                vendor.getStatus()
        );
    }
}