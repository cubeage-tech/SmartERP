package com.cubeage.erp.manufacturing.mapper;

import com.cubeage.erp.manufacturing.dto.response.BomDetailsResponse;
import com.cubeage.erp.manufacturing.dto.response.BomItemResponse;
import com.cubeage.erp.manufacturing.dto.response.BomResponse;
import com.cubeage.erp.manufacturing.entity.BillOfMaterial;
import com.cubeage.erp.manufacturing.entity.BomItem;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Component
public class BomMapper {

        private final ObjectMapper objectMapper;

        public BomMapper(ObjectMapper objectMapper) {
                this.objectMapper = objectMapper;
        }

    public BomResponse toResponse(BillOfMaterial bom) {
        String formattedCost = "₹" + String.format("%,.0f", bom.getTotalCost() != null ? bom.getTotalCost() : BigDecimal.ZERO);
        int componentCount = bom.getItems() != null ? bom.getItems().size() : 0;

        return new BomResponse(
                bom.getId(),
                bom.getBomNumber(),
                bom.getProductName(),
                bom.getVersion(),
                componentCount,
                bom.getTotalCost(),
                formattedCost,
                bom.getNotes(),
                bom.getUpdatedAt()
        );
    }

    public BomDetailsResponse toDetailsResponse(BillOfMaterial bom) {
        String formattedCost = "₹" + String.format("%,.0f", bom.getTotalCost() != null ? bom.getTotalCost() : BigDecimal.ZERO);

        List<BomItemResponse> itemResponses = bom.getItems() != null
                ? bom.getItems().stream().map(this::toItemResponse).toList()
                : List.of();

        return new BomDetailsResponse(
                bom.getId(),
                bom.getBomNumber(),
                bom.getProductName(),
                bom.getVersion(),
                itemResponses.size(),
                bom.getTotalCost(),
                formattedCost,
                bom.getNotes(),
                readDetails(bom.getDetailsJson()),
                itemResponses,
                bom.getCreatedAt(),
                bom.getUpdatedAt()
        );
    }

        private Map<String, Object> readDetails(String detailsJson) {
                if (detailsJson == null || detailsJson.isBlank()) return Map.of();
                try {
                        return objectMapper.readValue(detailsJson, new TypeReference<>() {});
                } catch (Exception exception) {
                        return Map.of();
                }
        }

    public BomItemResponse toItemResponse(BomItem item) {
        BigDecimal lineTotal = (item.getQuantity() != null && item.getUnitCost() != null)
                ? item.getQuantity().multiply(item.getUnitCost())
                : BigDecimal.ZERO;

        return new BomItemResponse(
                item.getId(),
                item.getProductId(),
                item.getDescription(),
                item.getQuantity(),
                item.getUnitCost(),
                lineTotal
        );
    }
}