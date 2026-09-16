package com.cubeage.erp.company.dto;

import com.cubeage.erp.company.enums.CompanyRecordStatus;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public final class CompanyManagementDtos {
    private CompanyManagementDtos() { }

    public record CompanyRequest(
            @NotBlank @Size(max = 160) String companyName,
            @NotBlank @Size(max = 30) String companyCode,
            @Size(max = 60) String companyType,
            @Size(max = 120) String industry,
            @Size(max = 80) String registrationNumber,
            @JsonAlias("taxGst") @Size(max = 20) String gstNumber,
            @Size(max = 15) String pan,
            @Size(max = 30) String cin,
            @Size(max = 255) String website,
            @Email @Size(max = 255) String email,
            @Size(max = 30) String phone,
            @Size(max = 255) String address,
            @Size(max = 255) String addressLine2,
            @Size(max = 80) String country,
            @Size(max = 80) String state,
            @Size(max = 80) String city,
            @Size(max = 12) String pincode,
            @Size(max = 60) String currency,
            @Size(max = 80) String timezone,
            @Size(max = 40) String financialYear,
            @Size(max = 500) String logoUrl,
            LocalDate foundedOn,
            CompanyRecordStatus status
    ) { }

    public record CompanyResponse(
            Long id, String companyName, String companyCode, String companyType, String industry,
            String registrationNumber, String gstNumber, String pan, String cin, String website,
            String email, String phone, String address, String addressLine2, String country,
            String state, String city, String pincode, String currency, String timezone,
            String financialYear, String logoUrl, LocalDate foundedOn, CompanyRecordStatus status,
            Instant createdAt, Instant updatedAt
    ) { }

    public record BranchRequest(
            @NotBlank @Size(max = 140) String branchName,
            @NotBlank @Size(max = 30) String branchCode,
            @NotBlank @Size(max = 60) String branchType,
            @Size(max = 160) String manager,
            @NotBlank @Size(max = 30) String contactNumber,
            @NotBlank @Email String email,
            @NotBlank @Size(max = 255) String address1,
            @Size(max = 255) String address2,
            @NotBlank @Size(max = 80) String country,
            @NotBlank @Size(max = 80) String state,
            @NotBlank @Size(max = 80) String city,
            @NotBlank @Size(max = 12) String pincode,
            @Size(max = 20) String gstNumber,
            CompanyRecordStatus status
    ) { }

    public record BranchResponse(
            Long id, Long companyId, String company, String branchName, String branchCode,
            String branchType, String manager, String contactNumber, String email,
            String address1, String address2, String country, String state, String city,
            String pincode, String gstNumber, CompanyRecordStatus status,
            Instant createdAt, Instant updatedAt
    ) { }

    public record CostCenterRequest(
            @NotBlank @Size(max = 30) String code,
            @NotBlank @Size(max = 140) String name,
            @Size(max = 500) String description,
            @PositiveOrZero BigDecimal budget,
            CompanyRecordStatus status
    ) { }

    public record CostCenterResponse(
            Long id, Long companyId, String code, String name, String description,
            BigDecimal budget, CompanyRecordStatus status, Instant createdAt, Instant updatedAt
    ) { }

    public record DepartmentRequest(
            @Positive Long branchId,
            @Size(max = 140) String branch,
            Long costCenterId,
            @NotBlank @Size(max = 140) String name,
            @NotBlank @Size(max = 30) String code,
            @Size(max = 160) String head,
            @NotBlank @Size(max = 80) String type,
            @Size(max = 500) String description,
            @PositiveOrZero Integer employees,
            CompanyRecordStatus status
    ) { }

    public record DepartmentResponse(
            Long id, Long companyId, Long branchId, String branch, Long costCenterId,
            String costCenter, String name, String code, String head, String type,
            String description, Integer employees, CompanyRecordStatus status,
            Instant createdAt, Instant updatedAt
    ) { }

    public record HolidayRequest(
            @NotBlank @Size(max = 140) String name,
            @NotNull LocalDate date,
            @NotBlank @Size(max = 60) String type,
            @JsonAlias("branch") @NotBlank @Size(max = 240) String appliesTo,
            @NotBlank @Pattern(regexp = "(?i)yes|no|true|false") String optional,
            CompanyRecordStatus status
    ) { }

    public record HolidayResponse(
            Long id, Long companyId, String name, LocalDate date, String day, String type,
            String appliesTo, String optional, CompanyRecordStatus status,
            Instant createdAt, Instant updatedAt
    ) { }

    public record ApprovalWorkflowRequest(
            @NotBlank @Size(max = 140) String title,
            @NotBlank @Size(max = 240) String trigger,
            @NotEmpty @Size(max = 20) List<@NotBlank @Size(max = 100) String> steps,
            CompanyRecordStatus status
    ) { }

    public record ApprovalWorkflowResponse(
            Long id, Long companyId, String title, String trigger, List<String> steps,
            CompanyRecordStatus status, Instant createdAt, Instant updatedAt
    ) { }

    public record CompanySettingsRequest(
            Map<String, Object> general,
            Map<String, Object> localization,
            Map<String, Object> workSchedule,
            Map<String, Object> leaveAndHolidays,
            List<Map<String, Object>> notifications,
            Map<String, Object> systemPreferences
    ) { }

    public record CompanySettingsResponse(
            Long companyId,
            Map<String, Object> general,
            Map<String, Object> localization,
            Map<String, Object> workSchedule,
            Map<String, Object> leaveAndHolidays,
            List<Map<String, Object>> notifications,
            Map<String, Object> systemPreferences,
            Instant updatedAt
    ) { }

    public record OrganizationNode(Long departmentId, String department, String head, int employees) { }

    public record OrganizationChartResponse(
            Long companyId, String companyName, String managingDirector, List<OrganizationNode> departments
    ) { }

    public record CompanyDashboardResponse(
            @Valid CompanyResponse company, long branches, long employees, long departments,
            String plan, CompanyRecordStatus status, OrganizationChartResponse organizationChart
    ) { }
}
