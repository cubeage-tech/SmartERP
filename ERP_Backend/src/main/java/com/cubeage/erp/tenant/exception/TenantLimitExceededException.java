package com.cubeage.erp.tenant.exception;

public class TenantLimitExceededException extends RuntimeException {

    public TenantLimitExceededException(String message) {
        super(message);
    }
}
