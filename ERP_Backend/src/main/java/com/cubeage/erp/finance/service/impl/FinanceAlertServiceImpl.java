package com.cubeage.erp.finance.service.impl;

import com.cubeage.erp.finance.dto.alert.FinanceAlertResponse;
import com.cubeage.erp.finance.enums.AlertStatus;
import com.cubeage.erp.finance.repository.FinanceAlertRepository;
import com.cubeage.erp.finance.service.FinanceAlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor @Transactional
public class FinanceAlertServiceImpl implements FinanceAlertService {
	private final FinanceAlertRepository repository;
	@Override @Transactional(readOnly = true)
	public List<FinanceAlertResponse> active(Long tenantId) {
		return repository.findByTenantIdAndStatusOrderByCreatedAtDesc(tenantId, AlertStatus.OPEN).stream()
				.map(alert -> new FinanceAlertResponse(alert.getId(), alert.getSeverity().name(), alert.getType().name(), alert.getTime(), alert.getTitle(), alert.getStatus().name())).toList();
	}
	@Override public void dismiss(Long tenantId, Long id) {
		repository.findByIdAndTenantId(id, tenantId).ifPresent(alert -> { alert.setStatus(AlertStatus.DISMISSED); repository.save(alert); });
	}
}
