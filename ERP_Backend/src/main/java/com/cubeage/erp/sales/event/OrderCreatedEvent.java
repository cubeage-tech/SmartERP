package com.cubeage.erp.sales.event;
import java.time.Instant;
public record OrderCreatedEvent(Long tenantId,Long orderId,String orderNumber,Instant occurredAt) { }
