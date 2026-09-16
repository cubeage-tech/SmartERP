package com.cubeage.erp.manufacturing.service.impl;

import com.cubeage.erp.common.exception.ResourceNotFoundException;
import com.cubeage.erp.manufacturing.dto.request.CreateBomRequest;
import com.cubeage.erp.manufacturing.dto.request.UpdateBomRequest;
import com.cubeage.erp.manufacturing.dto.response.BomDetailsResponse;
import com.cubeage.erp.manufacturing.dto.response.BomResponse;
import com.cubeage.erp.manufacturing.entity.BillOfMaterial;
import com.cubeage.erp.manufacturing.entity.BomItem;
import com.cubeage.erp.manufacturing.mapper.BomMapper;
import com.cubeage.erp.manufacturing.repository.BillOfMaterialRepository;
import com.cubeage.erp.manufacturing.service.BomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Map;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BomServiceImpl implements BomService {

    private final BillOfMaterialRepository bomRepository;
    private final BomMapper mapper;
    private final ObjectMapper objectMapper;

    @Override
    public BomResponse create(Long tenantId, CreateBomRequest request) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        BigDecimal totalCost = request.items().stream()
                .map(i -> i.unitCost().multiply(i.quantity()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BillOfMaterial bom = BillOfMaterial.builder()
                .tenantId(effectiveTenantId)
                .bomNumber(generateBomNumber(effectiveTenantId))
                .productName(request.product().trim())
                .version(request.version().trim())
                .totalCost(totalCost)
                .notes(request.notes())
                .detailsJson(writeDetails(request.details()))
                .items(new ArrayList<>())
                .build();

        List<BomItem> items = request.items().stream()
                .map(item -> BomItem.builder()
                        .billOfMaterial(bom)
                        .productId(item.productId())
                        .description(item.description().trim())
                        .quantity(item.quantity())
                        .unitCost(item.unitCost())
                        .build())
                .toList();

        bom.getItems().addAll(items);
        return mapper.toResponse(bomRepository.save(bom));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BomResponse> getAll(Long tenantId) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        return bomRepository.findByTenantIdOrderByCreatedAtDesc(effectiveTenantId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BomDetailsResponse getById(Long tenantId, Long id) {
        return mapper.toDetailsResponse(getEntity(tenantId, id));
    }

    @Override
    public BomResponse update(Long tenantId, Long id, UpdateBomRequest request) {
        BillOfMaterial bom = getEntity(tenantId, id);
        bom.setProductName(request.product().trim());
        bom.setVersion(request.version().trim());
        if (request.notes() != null) {
            bom.setNotes(request.notes());
        }
        if (request.details() != null) {
            bom.setDetailsJson(writeDetails(request.details()));
            replaceItemsFromDetails(bom, request.details());
        }
        return mapper.toResponse(bomRepository.save(bom));
    }

    @Override
    public void delete(Long tenantId, Long id) {
        BillOfMaterial bom = getEntity(tenantId, id);
        bomRepository.delete(bom);
    }

    private BillOfMaterial getEntity(Long tenantId, Long id) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        return bomRepository.findByIdAndTenantId(id, effectiveTenantId)
                .or(() -> bomRepository.findById(id))
                .orElseThrow(() -> new ResourceNotFoundException("BOM not found: " + id));
    }

    private synchronized String generateBomNumber(Long tenantId) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        long count = bomRepository.countByTenantId(effectiveTenantId) + 1;
        return String.format("BOM-%03d", count);
    }

    private String writeDetails(Object details) {
        try {
            return details == null ? null : objectMapper.writeValueAsString(details);
        } catch (JsonProcessingException exception) {
            throw new IllegalArgumentException("Unable to save BOM details", exception);
        }
    }

    @SuppressWarnings("unchecked")
    private void replaceItemsFromDetails(BillOfMaterial bom, Map<String, Object> details) {
        Object componentsValue = details.get("components");
        if (!(componentsValue instanceof List<?> components)) return;

        List<BomItem> items = components.stream()
                .filter(Map.class::isInstance)
                .map(value -> (Map<String, Object>) value)
                .map(component -> BomItem.builder()
                        .billOfMaterial(bom)
                        .productId(toLong(component.get("productId")))
                        .description(String.valueOf(component.getOrDefault("name", component.getOrDefault("description", "Component"))))
                        .quantity(toDecimal(component.get("qty"), component.get("quantity")))
                        .unitCost(toDecimal(component.get("unitCost"), null))
                        .build())
                .toList();

        bom.getItems().clear();
        bom.getItems().addAll(items);
                bom.setTotalCost(items.stream()
                    .map(item -> item.getQuantity().multiply(item.getUnitCost()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add));
    }

    private BigDecimal toDecimal(Object primary, Object fallback) {
        Object value = primary != null ? primary : fallback;
        return value == null ? BigDecimal.ZERO : new BigDecimal(String.valueOf(value));
    }

    private Long toLong(Object value) {
        return value == null ? null : Long.valueOf(String.valueOf(value));
    }
}