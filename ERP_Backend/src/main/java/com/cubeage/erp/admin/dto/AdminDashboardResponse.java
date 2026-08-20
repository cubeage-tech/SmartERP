package com.cubeage.erp.admin.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalUsers;

    private long activeUsers;

    private long totalRoles;

    private long totalPermissions;

    private long totalBranches;

    private long totalDepartments;
}