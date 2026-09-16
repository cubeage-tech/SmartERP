package com.cubeage.erp.inventory.service.impl;

import com.cubeage.erp.inventory.dto.response.StockMovementResponse;
import com.cubeage.erp.inventory.repository.StockMovementRepository;
import com.cubeage.erp.inventory.service.StockMovementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class StockMovementServiceImpl implements StockMovementService {
    private final StockMovementRepository repository;

    public StockMovementServiceImpl(StockMovementRepository repository) {
        this.repository = repository;
    }

    @Override @Transactional(readOnly = true)
    public List<StockMovementResponse> recent(Long tenantId) {
        return repository.findTop50ByTenantIdOrderByMovementDateDescIdDesc(tenantId).stream()
                .map(movement -> new StockMovementResponse(movement.getId(), movement.getMovementDate(), movement.getSku(), movement.getItemName(),
                    movement.getType().name().replace('_', ' '), movement.getQuantity(), movement.getUnit(),
                        movement.getWarehouseCode() + " - " + movement.getWarehouseName(), movement.getReference())).toList();
    }
}
