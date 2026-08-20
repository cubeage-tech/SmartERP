package com.cubeage.erp.documents.enums;

public enum DocumentType {
    VENDOR_INVOICE("Vendor Invoice"),
    SALES_ORDER("Sales Order"),
    CONTRACT("Contract"),
    HR_DOCUMENT("HR Document"),
    TAX_DOCUMENT("Tax Document"),
    REPORT("Report");

    private final String label;

    DocumentType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}