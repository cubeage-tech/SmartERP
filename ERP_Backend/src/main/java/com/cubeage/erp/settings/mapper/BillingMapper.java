package com.cubeage.erp.settings.mapper;
import com.cubeage.erp.settings.dto.billing.*;
import com.cubeage.erp.settings.entity.*;
import org.springframework.stereotype.Component;
@Component
public class BillingMapper {
    public SubscriptionResponse subscription(Subscription s) { return new SubscriptionResponse(s.getId(),s.getPlan(),s.getStatus(),s.getAmount(),s.getCurrency(),s.getStartsAt(),s.getEndsAt(),Boolean.TRUE.equals(s.getAutoRenew())); }
    public BillingHistoryResponse billing(BillingHistory b) { return new BillingHistoryResponse(b.getId(),b.getInvoiceNumber(),b.getAmount(),b.getCurrency(),b.getStatus(),b.getPaidAt(),b.getCreatedAt()); }
}
