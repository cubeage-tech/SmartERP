package com.cubeage.erp.finance.dto.journal;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record JournalEntryLineRequest(@NotBlank @Size(max = 30) String accountCode,
									  @NotBlank @Size(max = 120) String accountName,
									  @NotNull @DecimalMin("0") BigDecimal debit,
									  @NotNull @DecimalMin("0") BigDecimal credit) {
}
