package com.cubeage.erp.superAdmin.exception;

public class PlatformUserNotFoundException extends RuntimeException {
    public PlatformUserNotFoundException(Long id) { super("Platform user not found: " + id); }
}
