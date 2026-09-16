package com.cubeage.erp.manufacturing.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record CreateBomRequest(
        @NotBlank(message = "Product name is required") String product,
        @NotBlank(message = "Version is required") String version,
        String notes,
        Map<String, Object> details,
        @NotEmpty(message = "BOM items cannot be empty") List<@Valid Item> items
) {
    public record Item(
            Long productId,
            @NotBlank(message = "Description is required") String description,
            @NotNull @Positive BigDecimal quantity,
            @NotNull @PositiveOrZero BigDecimal unitCost
    ) {}
}