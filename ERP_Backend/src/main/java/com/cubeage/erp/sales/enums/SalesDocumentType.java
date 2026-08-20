package com.cubeage.erp.sales.enums;

public enum SalesDocumentType {
    QUOTATION("QT"),
    ORDER("SO"),
    INVOICE("INV");

    private final String prefix;

    SalesDocumentType(String prefix) {
        this.prefix = prefix;
    }

    public String getPrefix() {
        return prefix;
    }
}
