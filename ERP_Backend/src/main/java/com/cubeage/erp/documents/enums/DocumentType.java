package com.cubeage.erp.documents.enums;

public enum DocumentType {
    VENDOR_INVOICE("Vendor Invoice"),
    SALES_ORDER("Sales Order"),
    CONTRACT("Contract"),
    HR_DOCUMENT("HR Document"),
    TAX_DOCUMENT("Tax Document"),
    REPORT("Report"),
    PURCHASE_ORDER("Purchase Order"),
    DELIVERY_NOTE("Delivery Note"),
    CREDIT_NOTE("Credit Note"),
    DEBIT_NOTE("Debit Note"),
    LEGAL_AGREEMENT("Legal Agreement"),
    OTHER("Other");

    private final String label;

    DocumentType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    @com.fasterxml.jackson.annotation.JsonCreator
    public static DocumentType fromString(String text) {
        if (text == null || text.isBlank()) return OTHER;
        for (DocumentType type : DocumentType.values()) {
            if (type.name().equalsIgnoreCase(text) || type.label.equalsIgnoreCase(text)
                    || type.name().replace("_", " ").equalsIgnoreCase(text)) {
                return type;
            }
        }
        return OTHER;
    }
}