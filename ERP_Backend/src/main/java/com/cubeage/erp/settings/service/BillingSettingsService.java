package com.cubeage.erp.settings.service;
import com.cubeage.erp.settings.dto.billing.*;
import com.cubeage.erp.settings.entity.Subscription;
import com.cubeage.erp.settings.enums.SubscriptionStatus;
import com.cubeage.erp.settings.mapper.BillingMapper;
import com.cubeage.erp.settings.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;
@Service @RequiredArgsConstructor @Transactional
public class BillingSettingsService {
    private final SubscriptionRepository subscriptions; private final BillingHistoryRepository billing; private final BillingMapper mapper;
    @Transactional(readOnly=true) public SubscriptionResponse current(Long tenantId) { return subscriptions.findFirstByTenantIdAndStatusInOrderByCreatedAtDesc(tenantId,List.of(SubscriptionStatus.ACTIVE,SubscriptionStatus.TRIAL,SubscriptionStatus.PAST_DUE)).map(mapper::subscription).orElseThrow(() -> new IllegalArgumentException("Subscription not found")); }
    public SubscriptionResponse upgrade(Long tenantId,UpgradePlanRequest r) { subscriptions.findFirstByTenantIdAndStatusInOrderByCreatedAtDesc(tenantId,List.of(SubscriptionStatus.ACTIVE,SubscriptionStatus.TRIAL,SubscriptionStatus.PAST_DUE)).ifPresent(s -> {s.setStatus(SubscriptionStatus.CANCELLED);subscriptions.save(s);});Instant now=Instant.now();Subscription s=Subscription.builder().tenantId(tenantId).plan(r.plan()).status(SubscriptionStatus.ACTIVE).amount(r.amount()).currency(r.currency().toUpperCase()).startsAt(now).endsAt(now.plus(365,java.time.temporal.ChronoUnit.DAYS)).autoRenew(r.autoRenew()).build();return mapper.subscription(subscriptions.save(s)); }
    @Transactional(readOnly=true) public List<BillingHistoryResponse> history(Long tenantId) { return billing.findByTenantIdOrderByCreatedAtDesc(tenantId).stream().map(mapper::billing).toList(); }
}
