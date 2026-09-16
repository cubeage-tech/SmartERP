package com.cubeage.erp.purchase.service;

import com.cubeage.erp.common.exception.BadRequestException;
import com.cubeage.erp.common.exception.ResourceNotFoundException;
import com.cubeage.erp.purchase.dto.vendor.VendorRequest;
import com.cubeage.erp.purchase.dto.vendor.VendorResponse;
import com.cubeage.erp.purchase.dto.vendor.VendorSummaryResponse;
import com.cubeage.erp.purchase.entity.Vendor;
import com.cubeage.erp.purchase.mapper.VendorMapper;
import com.cubeage.erp.purchase.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cubeage.erp.purchase.repository.GoodsReceiptRepository;
import com.cubeage.erp.purchase.repository.PayableRepository;
import com.cubeage.erp.purchase.repository.PurchaseOrderRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VendorService {

    private final VendorRepository vendorRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final GoodsReceiptRepository goodsReceiptRepository;
    private final PayableRepository payableRepository;
    private final VendorMapper vendorMapper;

    public VendorResponse createVendor(Long tenantId, VendorRequest request) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        String vendorCode = generateVendorCode(effectiveTenantId);

        Vendor vendor = Vendor.builder()
                .tenantId(effectiveTenantId)
                .vendorCode(vendorCode)
                .vendorName(request.vendorName().trim())
                .contactName(request.contactName().trim())
                .phone(request.phone())
                .email(request.email())
                .city(request.city())
                .address(request.address())
                .category(request.category())
                .gstin(request.gstin())
                .pan(request.pan())
                .paymentTerms(request.paymentTerms())
                .creditLimit(
                        request.creditLimit() != null
                                ? request.creditLimit()
                                : BigDecimal.ZERO
                )
                .rating(
                        request.rating() != null
                                ? request.rating()
                                : BigDecimal.ZERO
                )
                .status(request.status())
                .build();

        applyExtendedDetails(vendor, request);

        return vendorMapper.toResponse(vendorRepository.save(vendor));
    }

    @Transactional(readOnly = true)
    public List<VendorSummaryResponse> listVendors(Long tenantId) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        return vendorRepository.findByTenantIdOrderByCreatedAtDesc(effectiveTenantId)
                .stream()
                .map(vendorMapper::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public VendorResponse getVendor(Long tenantId, Long id) {
        return vendorMapper.toResponse(requireVendor(tenantId, id));
    }

    public VendorResponse updateVendor(
            Long tenantId,
            Long id,
            VendorRequest request
    ) {
        Vendor vendor = requireVendor(tenantId, id);

        vendor.setVendorName(request.vendorName().trim());
        vendor.setContactName(request.contactName().trim());
        vendor.setPhone(request.phone());
        vendor.setEmail(request.email());
        vendor.setCity(request.city());
        vendor.setAddress(request.address());
        vendor.setCategory(request.category());
        vendor.setGstin(request.gstin());
        vendor.setPan(request.pan());
        vendor.setPaymentTerms(request.paymentTerms());
        vendor.setCreditLimit(
                request.creditLimit() != null
                        ? request.creditLimit()
                        : BigDecimal.ZERO
        );
        vendor.setRating(
                request.rating() != null
                        ? request.rating()
                        : BigDecimal.ZERO
        );
        vendor.setStatus(request.status());

        applyExtendedDetails(vendor, request);

        return vendorMapper.toResponse(vendorRepository.save(vendor));
    }

    private void applyExtendedDetails(Vendor vendor, VendorRequest request) {
        vendor.setVendorType(request.vendorType());
        vendor.setWebsite(request.website());
        vendor.setDescription(request.description());

        vendor.setDesignation(request.designation());
        vendor.setAlternatePhone(request.alternatePhone());
        vendor.setContactWebsite(request.contactWebsite());

        vendor.setAddressLine2(request.addressLine2());
        vendor.setCountry(request.country());
        vendor.setState(request.state());
        vendor.setPinCode(request.pinCode());

        vendor.setGstType(request.gstType());
        vendor.setTan(request.tan());
        vendor.setCin(request.cin());
        vendor.setMsme(request.msme());
        vendor.setTaxState(request.taxState());

        vendor.setCreditPeriodDays(request.creditPeriodDays());
        vendor.setCurrency(
                request.currency() != null && !request.currency().isBlank()
                        ? request.currency()
                        : "INR"
        );
        vendor.setMinimumOrderValue(
                request.minimumOrderValue() != null
                        ? request.minimumOrderValue()
                        : BigDecimal.ZERO
        );
        vendor.setDeliveryDays(request.deliveryDays());
        vendor.setPurchaseCategory(request.purchaseCategory());

        vendor.setAccountHolder(request.accountHolder());
        vendor.setBankName(request.bankName());
        vendor.setAccountNumber(request.accountNumber());
        vendor.setIfsc(request.ifsc());
        vendor.setBankBranch(request.bankBranch());
        vendor.setAccountType(request.accountType());
        vendor.setUpiId(request.upiId());

        vendor.setTags(request.tags());
        vendor.setNotes(request.notes());
    }

    public void deleteVendor(Long tenantId, Long id) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        Vendor vendor = requireVendor(tenantId, id);
                if (purchaseOrderRepository.countByTenantIdAndVendorId(effectiveTenantId, id) > 0) {
                        throw new IllegalArgumentException("Vendor cannot be deleted because it has purchase orders");
                }
        try {
            goodsReceiptRepository.deleteAll(
                    goodsReceiptRepository.findByTenantIdAndVendorId(effectiveTenantId, id));
            goodsReceiptRepository.flush();
            payableRepository.deleteAll(
                    payableRepository.findByTenantIdAndVendorId(effectiveTenantId, id));
            payableRepository.flush();
            purchaseOrderRepository.deleteAll(
                    purchaseOrderRepository.findByTenantIdAndVendorId(effectiveTenantId, id));
            purchaseOrderRepository.flush();
            vendorRepository.delete(vendor);
            vendorRepository.flush();
        } catch (DataIntegrityViolationException exception) {
            throw new IllegalArgumentException("Vendor cannot be deleted because it is still referenced by another record");
        }
    }

    private String generateVendorCode(Long tenantId) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        long nextNumber = vendorRepository.countByTenantId(effectiveTenantId) + 1;

        for (int attempts = 0; attempts < 100; attempts++) {
            String candidate = "V-%04d".formatted(nextNumber + attempts);

            if (!vendorRepository.existsByTenantIdAndVendorCode(
                    effectiveTenantId,
                    candidate
            )) {
                return candidate;
            }
        }

        throw new BadRequestException(
                "Unable to generate a unique vendor code. Please try again."
        );
    }

    private Vendor requireVendor(Long tenantId, Long id) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        return vendorRepository.findByIdAndTenantId(id, effectiveTenantId)
                .or(() -> vendorRepository.findById(id))
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vendor not found: " + id
                        )
                );
    }
}