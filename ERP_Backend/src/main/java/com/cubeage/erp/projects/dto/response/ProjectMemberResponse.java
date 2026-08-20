package com.cubeage.erp.projects.dto.response; import java.math.BigDecimal; import java.time.LocalDate;
public record ProjectMemberResponse(Long id,Long projectId,Long userId,String userName,String role,
 BigDecimal allocationPercent,LocalDate fromDate,LocalDate toDate,Boolean active) {}
