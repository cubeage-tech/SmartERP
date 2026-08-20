package com.cubeage.erp.settings.dto.general;
import java.time.Instant;

public record GeneralSettingsResponse(
        Long id,
        Long tenantId,
        String companyName,
        String legalName,
        String gstin,
        String pan,
        String industry,
        Integer fiscalYearStartMonth,
        String fiscalYearLabel,
        String currency,
        String timezone,
        String locale,
        String dateFormat,
        String streetAddress,
        String city,
        String state,
        String pinCode,
        Instant updatedAt
) { }
