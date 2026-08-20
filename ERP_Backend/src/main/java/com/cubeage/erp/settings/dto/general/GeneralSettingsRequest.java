package com.cubeage.erp.settings.dto.general;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.*;

public record GeneralSettingsRequest(
        @NotBlank @Size(max = 160) String companyName,
        @Size(max = 200) String legalName,
        @JsonAlias("taxId")
        @Pattern(
                regexp = "^$|^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]$",
                message = "must be a valid GSTIN"
        )
        String gstin,
        @Pattern(
                regexp = "^$|^[A-Z]{5}[0-9]{4}[A-Z]$",
                message = "must be a valid PAN"
        )
        String pan,
        @Size(max = 120) String industry,
        @NotBlank @Pattern(regexp = "^[A-Z]{3}$") String currency,
        @NotBlank @Size(max = 60) String timezone,
        @NotBlank @Size(max = 20) String locale,
        @NotBlank @Size(max = 30) String dateFormat,
        @NotNull @Min(1) @Max(12) Integer fiscalYearStartMonth,
        @Size(max = 255) String streetAddress,
        @Size(max = 100) String city,
        @Size(max = 100) String state,
        @Pattern(regexp = "^$|^[1-9][0-9]{5}$", message = "must be a valid six-digit PIN code")
        String pinCode
) { }
