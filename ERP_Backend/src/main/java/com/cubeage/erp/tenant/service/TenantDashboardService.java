package com.cubeage.erp.tenant.service;

import com.cubeage.erp.tenant.dto.dashboard.TenantDashboardResponse;
import com.cubeage.erp.tenant.entity.TenantSubscription;
import com.cubeage.erp.tenant.enums.TenantModuleStatus;
import com.cubeage.erp.tenant.enums.TenantStatus;
import com.cubeage.erp.tenant.enums.TenantUserStatus;
import com.cubeage.erp.tenant.repository.TenantModuleRepository;
import com.cubeage.erp.tenant.repository.TenantRepository;
import com.cubeage.erp.tenant.repository.TenantSubscriptionRepository;
import com.cubeage.erp.tenant.repository.TenantUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TenantDashboardService {

    private final TenantRepository tenantRepository;
    private final TenantUserRepository userRepository;
    private final TenantModuleRepository moduleRepository;
    private final TenantSubscriptionRepository subscriptionRepository;

    @Transactional(readOnly = true)
    public TenantDashboardResponse platform() {
        Instant now = Instant.now();

        Instant monthStart = YearMonth.now(ZoneOffset.UTC)
                .atDay(1)
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant();

        Instant nextMonthStart = YearMonth.now(ZoneOffset.UTC)
                .plusMonths(1)
                .atDay(1)
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant();

        List<TenantSubscription> subscriptions = subscriptionRepository.findAll();

        Map<String, BigDecimal> totalRevenueByCurrency =
                new HashMap<>();

        Map<String, BigDecimal> currentMonthRevenueByCurrency =
                new HashMap<>();

        long activeSubscriptions = 0;

        for (TenantSubscription subscription : subscriptions) {
            if (!Boolean.TRUE.equals(subscription.getActive())) {
                continue;
            }

            if (subscription.getEndsAt().isAfter(now)) {
                activeSubscriptions++;
            }

            String currency = subscription.getCurrency() == null
                    ? "UNKNOWN"
                    : subscription.getCurrency().toUpperCase();

            BigDecimal amount = subscription.getAmount() == null
                    ? BigDecimal.ZERO
                    : subscription.getAmount();

            totalRevenueByCurrency.merge(
                    currency,
                    amount,
                    BigDecimal::add
            );

            boolean startsThisMonth =
                    !subscription.getStartsAt().isBefore(monthStart)
                            && subscription.getStartsAt().isBefore(nextMonthStart);

            if (startsThisMonth) {
                currentMonthRevenueByCurrency.merge(
                        currency,
                        amount,
                        BigDecimal::add
                );
            }
        }

        long enabledModules = moduleRepository.findAll()
                .stream()
                .filter(module ->
                        module.getStatus() == TenantModuleStatus.ENABLED
                )
                .count();

        return new TenantDashboardResponse(
                tenantRepository.count(),
                tenantRepository.countByStatus(TenantStatus.ACTIVE),
                tenantRepository.countByStatus(TenantStatus.TRIAL),
                tenantRepository.countByStatus(TenantStatus.SUSPENDED),
                userRepository.countByStatus(TenantUserStatus.ACTIVE),
                enabledModules,
                activeSubscriptions,
                Map.copyOf(totalRevenueByCurrency),
                Map.copyOf(currentMonthRevenueByCurrency)
        );
    }
}