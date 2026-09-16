package com.cubeage.erp.company.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Locale;

public enum CompanyRecordStatus {
    ACTIVE,
    INACTIVE;

    @JsonCreator
    public static CompanyRecordStatus from(String value) {
        if (value == null || value.isBlank()) return ACTIVE;
        return valueOf(value.trim().toUpperCase(Locale.ROOT));
    }
}
