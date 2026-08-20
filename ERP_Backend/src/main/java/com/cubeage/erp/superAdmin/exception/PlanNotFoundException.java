package com.cubeage.erp.superAdmin.exception;

public class PlanNotFoundException extends RuntimeException {
    public PlanNotFoundException(Long id) { super("Plan not found: " + id); }
}
