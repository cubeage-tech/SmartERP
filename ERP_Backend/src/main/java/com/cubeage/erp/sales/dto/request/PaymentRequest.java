package com.cubeage.erp.sales.dto.request;
import com.cubeage.erp.sales.enums.PaymentMethod;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;
public record PaymentRequest(@NotNull @Positive BigDecimal amount,@NotNull PaymentMethod method,
                             @NotBlank String reference,Instant paidAt,String notes) { }
