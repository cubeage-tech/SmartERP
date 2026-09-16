package com.cubeage.erp.finance.dto.journal;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

public record CreateJournalEntryRequest(@NotNull LocalDate entryDate,
										@NotBlank @Size(max = 500) String description,
										@Size(max = 80) String reference,
										@NotEmpty @Size(min = 2) List<@Valid JournalEntryLineRequest> lines) {
}
