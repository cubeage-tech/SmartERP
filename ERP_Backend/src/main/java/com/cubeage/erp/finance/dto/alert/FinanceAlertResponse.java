package com.cubeage.erp.finance.dto.alert;

public record FinanceAlertResponse(Long id, String level, String type, String time, String title, String status) {
}
