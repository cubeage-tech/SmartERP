package com.cubeage.erp.company.service;

import com.cubeage.erp.admin.repository.UserRepository;
import com.cubeage.erp.common.exception.ResourceNotFoundException;
import com.cubeage.erp.company.dto.CompanyManagementDtos.*;
import com.cubeage.erp.company.entity.Branch;
import com.cubeage.erp.company.entity.Company;
import com.cubeage.erp.company.enums.CompanyRecordStatus;
import com.cubeage.erp.company.repository.*;
import com.cubeage.erp.tenant.repository.TenantSubscriptionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CompanyManagementServiceTest {
    private CompanyRepository companies;
    private CompanyBranchRepository branches;
    private CompanyDepartmentRepository departments;
    private CostCenterRepository costCenters;
    private HolidayRepository holidays;
    private ApprovalWorkflowRepository workflows;
    private CompanySettingsRepository settings;
    private UserRepository users;
    private TenantSubscriptionRepository subscriptions;
    private CompanyManagementService service;

    @BeforeEach
    void setUp() {
        companies = mock(CompanyRepository.class);
        branches = mock(CompanyBranchRepository.class);
        departments = mock(CompanyDepartmentRepository.class);
        costCenters = mock(CostCenterRepository.class);
        holidays = mock(HolidayRepository.class);
        workflows = mock(ApprovalWorkflowRepository.class);
        settings = mock(CompanySettingsRepository.class);
        users = mock(UserRepository.class);
        subscriptions = mock(TenantSubscriptionRepository.class);
        when(companies.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(branches.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        service = new CompanyManagementService(companies, branches, departments, costCenters, holidays,
                workflows, settings, users, subscriptions, new ObjectMapper());
    }

    @Test
    void createCompanyNormalizesIdentifiersAndFrontendAliases() {
        CompanyRequest request = new CompanyRequest(" Acme Manufacturing Ltd ", " acme001 ",
                "Private Limited", "Manufacturing", "REG-1", "27aadca3129h1zx", "aadca3129h",
                "u28100mh2010ptc204826", "https://acme.example", "INFO@ACME.EXAMPLE", "+91 20 1234",
                "MIDC, Pune", null, "India", "Maharashtra", "Pune", "411019", "INR (₹)",
                "IST (UTC+5:30)", "April – March", null, LocalDate.of(2010, 4, 12), null);

        CompanyResponse response = service.createCompany(4L, request);

        assertEquals("Acme Manufacturing Ltd", response.companyName());
        assertEquals("ACME001", response.companyCode());
        assertEquals("27AADCA3129H1ZX", response.gstNumber());
        assertEquals("AADCA3129H", response.pan());
        assertEquals("info@acme.example", response.email());
        assertEquals(CompanyRecordStatus.ACTIVE, response.status());
        verify(companies).existsByTenantIdAndCodeIgnoreCase(4L, "ACME001");
    }

    @Test
    void duplicateCompanyCodeIsRejectedWithinTenant() {
        when(companies.existsByTenantIdAndCodeIgnoreCase(4L, "ACME001")).thenReturn(true);
        CompanyRequest request = minimalCompany("ACME001");

        assertThrows(IllegalArgumentException.class, () -> service.createCompany(4L, request));
        verify(companies, never()).save(any());
    }

    @Test
    void departmentCannotReferenceBranchFromAnotherTenantOrCompany() {
        Company company = Company.builder().id(9L).tenantId(4L).name("Acme").code("ACME").build();
        when(companies.findByIdAndTenantId(9L, 4L)).thenReturn(Optional.of(company));
        when(branches.findByIdAndTenantIdAndCompanyId(12L, 4L, 9L)).thenReturn(Optional.empty());
        DepartmentRequest request = new DepartmentRequest(12L, null, null, "Finance", "FIN", "Rahul",
                "Finance", null, 18, CompanyRecordStatus.ACTIVE);

        assertThrows(ResourceNotFoundException.class,
                () -> service.createDepartment(4L, 9L, request));
        verify(departments, never()).save(any());
    }

    @Test
    void dashboardUsesTenantCountsAndCompanyScopedStructureCounts() {
        Company company = Company.builder().id(9L).tenantId(4L).name("Acme").code("ACME")
                .status(CompanyRecordStatus.ACTIVE).build();
        when(companies.findByIdAndTenantId(9L, 4L)).thenReturn(Optional.of(company));
        when(branches.countByTenantIdAndCompanyId(4L, 9L)).thenReturn(4L);
        when(departments.countByTenantIdAndCompanyId(4L, 9L)).thenReturn(7L);
        when(users.countByTenantId(4L)).thenReturn(284L);
        when(settings.findByTenantIdAndCompanyId(4L, 9L)).thenReturn(Optional.empty());

        CompanyDashboardResponse response = service.dashboard(4L, 9L);

        assertEquals(4L, response.branches());
        assertEquals(7L, response.departments());
        assertEquals(284L, response.employees());
        assertEquals("Starter", response.plan());
    }

    @Test
    void branchDeletionIsBlockedWhileDepartmentsUseIt() {
        Company company = Company.builder().id(9L).tenantId(4L).name("Acme").code("ACME").build();
        Branch branch = Branch.builder().id(12L).tenantId(4L).company(company).name("Pune").code("PUN").build();
        when(branches.findByIdAndTenantIdAndCompanyId(12L, 4L, 9L)).thenReturn(Optional.of(branch));
        when(departments.existsByTenantIdAndCompanyIdAndBranchId(4L, 9L, 12L)).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> service.deleteBranch(4L, 9L, 12L));
        verify(branches, never()).delete(any());
    }

    private CompanyRequest minimalCompany(String code) {
        return new CompanyRequest(
                "Acme", code, null, null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null, null, null,
                null, CompanyRecordStatus.ACTIVE);
    }
}
