package com.cubeage.erp.manufacturing.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public record UpdateBomRequest(
        @NotBlank(message = "Product name is required") String product,
        @NotBlank(message = "Version is required") String version,
        String notes,
        Map<String, Object> details
) {}