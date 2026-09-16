package com.cubeage.erp.inventory.service.impl;

import com.cubeage.erp.inventory.dto.request.CreateWarehouseRequest;
import com.cubeage.erp.inventory.dto.response.WarehouseResponse;
import com.cubeage.erp.inventory.entity.Warehouse;
import com.cubeage.erp.inventory.repository.InventoryItemRepository;
import com.cubeage.erp.inventory.repository.WarehouseRepository;
import com.cubeage.erp.inventory.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Locale;

@Service @Transactional
public class WarehouseServiceImpl implements WarehouseService {
    private final WarehouseRepository repository;
    private final InventoryItemRepository itemRepository;

    public WarehouseServiceImpl(WarehouseRepository repository, InventoryItemRepository itemRepository) {
        this.repository = repository;
        this.itemRepository = itemRepository;
    }

    @Override @Transactional(readOnly = true)
    public List<WarehouseResponse> all(Long tenantId) {
        return repository.findByTenantIdAndActiveTrueOrderByCodeAsc(tenantId).stream().map(this::response).toList();
    }

    @Override
    public WarehouseResponse create(Long tenantId, CreateWarehouseRequest request) {
        String code = request.code().trim().toUpperCase(Locale.ROOT);
        if (repository.findByTenantIdAndCodeIgnoreCase(tenantId, code).isPresent()) throw new IllegalArgumentException("Warehouse code already exists: " + code);
        Warehouse warehouse = Warehouse.builder().tenantId(tenantId).code(code).name(request.name().trim())
                .location(request.location().trim()).area(request.area().trim()).capacityPercent(request.capacityPercent()).active(true).build();
        return response(repository.save(warehouse));
    }

    private WarehouseResponse response(Warehouse warehouse) {
        var items = itemRepository.findByTenantIdOrderByCreatedAtDesc(warehouse.getTenantId()).stream()
                .filter(item -> warehouse.getCode().equalsIgnoreCase(item.getWarehouseCode())).toList();
        return new WarehouseResponse(warehouse.getId(), warehouse.getCode(), warehouse.getName(), warehouse.getLocation(), warehouse.getArea(),
                warehouse.getCapacityPercent(), items.size(), items.stream().map(item -> item.getQuantity().multiply(item.getCostPrice()))
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add).toPlainString(), warehouse.isActive());
    }
}
