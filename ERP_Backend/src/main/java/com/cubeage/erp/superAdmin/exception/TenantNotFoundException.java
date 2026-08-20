package com.cubeage.erp.superAdmin.exception;

public class TenantNotFoundException extends RuntimeException {
    public TenantNotFoundException(Long id) { super("Tenant not found: " + id); }
    public TenantNotFoundException(String code) { super("Tenant not found: " + code); }
}
