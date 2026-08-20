package com.cubeage.erp.projects.dto.request; import com.cubeage.erp.projects.enums.ProjectStatus;
public record ProjectSearchRequest(String keyword,ProjectStatus status,Long managerUserId,Long branchId,Long departmentId) {}
