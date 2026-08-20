package com.cubeage.erp.superAdmin.exception;

public class SubscriptionNotFoundException extends RuntimeException {
    public SubscriptionNotFoundException(Long id) { super("Subscription not found: " + id); }
}
