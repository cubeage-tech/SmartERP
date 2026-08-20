package com.cubeage.erp.sales.dto.request;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
public record CreateQuotationRequest(@NotNull Long customerId,@NotBlank String customerName,
        @NotNull @FutureOrPresent LocalDate validUntil,String notes,@NotEmpty List<@Valid Item> items) {
 public record Item(Long productId,@NotBlank String description,@NotNull @Positive BigDecimal quantity,
                    @NotNull @PositiveOrZero BigDecimal unitPrice,@NotNull @DecimalMin("0.0") @DecimalMax("100.0") BigDecimal taxRate) { }
}
