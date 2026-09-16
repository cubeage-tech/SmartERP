package com.cubeage.erp.documents.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum DocumentStatus {
    ACTIVE,
    PENDING,
    APPROVED,
    REJECTED,
    ARCHIVED;

    @JsonCreator
    public static DocumentStatus fromString(String text) {
        if (text == null || text.isBlank()) {
            return null;
        }
        for (DocumentStatus status : DocumentStatus.values()) {
            if (status.name().equalsIgnoreCase(text.trim())) {
                return status;
            }
        }
        return ACTIVE;
    }
}