package com.cubeage.erp.projects.dto.request;
import com.cubeage.erp.projects.enums.ProjectMemberRole; import jakarta.validation.constraints.*;
import java.math.BigDecimal; import java.time.LocalDate;
public record ProjectMemberRequest(@NotNull Long userId,String userName,@NotNull ProjectMemberRole role,
 @NotNull @DecimalMin("0.00") @DecimalMax("100.00") BigDecimal allocationPercent,
 LocalDate fromDate,LocalDate toDate) {}
