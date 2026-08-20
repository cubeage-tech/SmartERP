package com.cubeage.erp.projects.dto.response; import java.math.BigDecimal; import java.time.LocalDate;
public record TimesheetResponse(Long id,Long projectId,Long taskId,Long userId,String userName,LocalDate workDate,
 BigDecimal hours,String description,String status,Long approvedByUserId,String approvedByName) {}
