package com.cubeage.erp.company.service;

import com.cubeage.erp.admin.repository.UserRepository;
import com.cubeage.erp.common.exception.ResourceNotFoundException;
import com.cubeage.erp.company.dto.CompanyManagementDtos.*;
import com.cubeage.erp.company.entity.*;
import com.cubeage.erp.company.enums.CompanyRecordStatus;
import com.cubeage.erp.company.repository.*;
import com.cubeage.erp.tenant.entity.TenantSubscription;
import com.cubeage.erp.tenant.repository.TenantSubscriptionRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.time.format.TextStyle;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class CompanyManagementService {
    private final CompanyRepository companies;
    private final CompanyBranchRepository branches;
    private final CompanyDepartmentRepository departments;
    private final CostCenterRepository costCenters;
    private final HolidayRepository holidays;
    private final ApprovalWorkflowRepository workflows;
    private final CompanySettingsRepository settings;
    private final UserRepository users;
    private final TenantSubscriptionRepository subscriptions;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public List<CompanyResponse> companies(Long tenantId) {
        return companies.findByTenantIdOrderByName(tenantId).stream().map(this::companyResponse).toList();
    }

    @Transactional(readOnly = true)
    public CompanyResponse company(Long tenantId, Long id) {
        return companyResponse(requireCompany(tenantId, id));
    }

    public CompanyResponse createCompany(Long tenantId, CompanyRequest request) {
        String code = upper(request.companyCode());
        if (companies.existsByTenantIdAndCodeIgnoreCase(tenantId, code)) {
            throw new IllegalArgumentException("Company code already exists");
        }
        Company company = Company.builder().tenantId(tenantId).build();
        apply(company, request, code);
        return companyResponse(companies.save(company));
    }

    public CompanyResponse updateCompany(Long tenantId, Long id, CompanyRequest request) {
        Company company = requireCompany(tenantId, id);
        String code = upper(request.companyCode());
        if (companies.existsByTenantIdAndCodeIgnoreCaseAndIdNot(tenantId, code, id)) {
            throw new IllegalArgumentException("Company code already exists");
        }
        apply(company, request, code);
        return companyResponse(companies.save(company));
    }

    public void deleteCompany(Long tenantId, Long id) {
        Company company = requireCompany(tenantId, id);
        settings.findByTenantIdAndCompanyId(tenantId, id).ifPresent(settings::delete);
        workflows.deleteByTenantIdAndCompanyId(tenantId, id);
        holidays.deleteByTenantIdAndCompanyId(tenantId, id);
        departments.deleteByTenantIdAndCompanyId(tenantId, id);
        costCenters.deleteByTenantIdAndCompanyId(tenantId, id);
        branches.deleteByTenantIdAndCompanyId(tenantId, id);
        companies.delete(company);
    }

    @Transactional(readOnly = true)
    public List<BranchResponse> branches(Long tenantId, Long companyId) {
        requireCompany(tenantId, companyId);
        return branches.findByTenantIdAndCompanyIdOrderByName(tenantId, companyId).stream()
                .map(this::branchResponse).toList();
    }

    @Transactional(readOnly = true)
    public BranchResponse branch(Long tenantId, Long companyId, Long id) {
        return branchResponse(requireBranch(tenantId, companyId, id));
    }

    public BranchResponse createBranch(Long tenantId, Long companyId, BranchRequest request) {
        Company company = requireCompany(tenantId, companyId);
        String code = upper(request.branchCode());
        if (branches.existsByTenantIdAndCompanyIdAndCodeIgnoreCase(tenantId, companyId, code)) {
            throw new IllegalArgumentException("Branch code already exists for this company");
        }
        Branch branch = Branch.builder().tenantId(tenantId).company(company).build();
        apply(branch, request, code);
        return branchResponse(branches.save(branch));
    }

    public BranchResponse updateBranch(Long tenantId, Long companyId, Long id, BranchRequest request) {
        Branch branch = requireBranch(tenantId, companyId, id);
        String code = upper(request.branchCode());
        if (branches.existsByTenantIdAndCompanyIdAndCodeIgnoreCaseAndIdNot(tenantId, companyId, code, id)) {
            throw new IllegalArgumentException("Branch code already exists for this company");
        }
        apply(branch, request, code);
        return branchResponse(branches.save(branch));
    }

    public void deleteBranch(Long tenantId, Long companyId, Long id) {
        Branch branch = requireBranch(tenantId, companyId, id);
        if (departments.existsByTenantIdAndCompanyIdAndBranchId(tenantId, companyId, id)) {
            throw new IllegalStateException("Branch cannot be deleted while departments are assigned to it");
        }
        branches.delete(branch);
    }

    @Transactional(readOnly = true)
    public List<CostCenterResponse> costCenters(Long tenantId, Long companyId) {
        requireCompany(tenantId, companyId);
        return costCenters.findByTenantIdAndCompanyIdOrderByCode(tenantId, companyId).stream()
                .map(this::costCenterResponse).toList();
    }

    @Transactional(readOnly = true)
    public CostCenterResponse costCenter(Long tenantId, Long companyId, Long id) {
        return costCenterResponse(requireCostCenter(tenantId, companyId, id));
    }

    public CostCenterResponse createCostCenter(Long tenantId, Long companyId, CostCenterRequest request) {
        Company company = requireCompany(tenantId, companyId);
        String code = upper(request.code());
        if (costCenters.existsByTenantIdAndCompanyIdAndCodeIgnoreCase(tenantId, companyId, code)) {
            throw new IllegalArgumentException("Cost center code already exists for this company");
        }
        CostCenter center = CostCenter.builder().tenantId(tenantId).company(company).build();
        apply(center, request, code);
        return costCenterResponse(costCenters.save(center));
    }

    public CostCenterResponse updateCostCenter(Long tenantId, Long companyId, Long id, CostCenterRequest request) {
        CostCenter center = requireCostCenter(tenantId, companyId, id);
        String code = upper(request.code());
        if (costCenters.existsByTenantIdAndCompanyIdAndCodeIgnoreCaseAndIdNot(tenantId, companyId, code, id)) {
            throw new IllegalArgumentException("Cost center code already exists for this company");
        }
        apply(center, request, code);
        return costCenterResponse(costCenters.save(center));
    }

    public void deleteCostCenter(Long tenantId, Long companyId, Long id) {
        CostCenter center = requireCostCenter(tenantId, companyId, id);
        if (departments.existsByTenantIdAndCompanyIdAndCostCenterId(tenantId, companyId, id)) {
            throw new IllegalStateException("Cost center cannot be deleted while departments are assigned to it");
        }
        costCenters.delete(center);
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> departments(Long tenantId, Long companyId) {
        requireCompany(tenantId, companyId);
        return departments.findByTenantIdAndCompanyIdOrderByName(tenantId, companyId).stream()
                .map(this::departmentResponse).toList();
    }

    @Transactional(readOnly = true)
    public DepartmentResponse department(Long tenantId, Long companyId, Long id) {
        return departmentResponse(requireDepartment(tenantId, companyId, id));
    }

    public DepartmentResponse createDepartment(Long tenantId, Long companyId, DepartmentRequest request) {
        Company company = requireCompany(tenantId, companyId);
        String code = upper(request.code());
        if (departments.existsByTenantIdAndCompanyIdAndCodeIgnoreCase(tenantId, companyId, code)) {
            throw new IllegalArgumentException("Department code already exists for this company");
        }
        Department department = Department.builder().tenantId(tenantId).company(company).build();
        apply(department, request, tenantId, companyId, code);
        return departmentResponse(departments.save(department));
    }

    public DepartmentResponse updateDepartment(Long tenantId, Long companyId, Long id, DepartmentRequest request) {
        Department department = requireDepartment(tenantId, companyId, id);
        String code = upper(request.code());
        if (departments.existsByTenantIdAndCompanyIdAndCodeIgnoreCaseAndIdNot(tenantId, companyId, code, id)) {
            throw new IllegalArgumentException("Department code already exists for this company");
        }
        apply(department, request, tenantId, companyId, code);
        return departmentResponse(departments.save(department));
    }

    public void deleteDepartment(Long tenantId, Long companyId, Long id) {
        departments.delete(requireDepartment(tenantId, companyId, id));
    }

    @Transactional(readOnly = true)
    public List<HolidayResponse> holidays(Long tenantId, Long companyId, int year,
                                           String type, String appliesTo, CompanyRecordStatus status, String search) {
        requireCompany(tenantId, companyId);
        return holidays.findByTenantIdAndCompanyIdAndDateBetweenOrderByDate(
                        tenantId, companyId, LocalDate.of(year, 1, 1), LocalDate.of(year, 12, 31)).stream()
                .filter(item -> blank(type) || "All Types".equalsIgnoreCase(type) || type.equalsIgnoreCase(item.getType()))
                .filter(item -> blank(appliesTo) || "All Branches".equalsIgnoreCase(appliesTo) || item.getAppliesTo().toLowerCase(Locale.ROOT)
                        .contains(appliesTo.toLowerCase(Locale.ROOT)))
                .filter(item -> status == null || status == item.getStatus())
                .filter(item -> blank(search) || item.getName().toLowerCase(Locale.ROOT)
                        .contains(search.toLowerCase(Locale.ROOT)))
                .map(this::holidayResponse).toList();
    }

    public HolidayResponse createHoliday(Long tenantId, Long companyId, HolidayRequest request) {
        Company company = requireCompany(tenantId, companyId);
        if (holidays.existsByTenantIdAndCompanyIdAndNameIgnoreCaseAndDate(
                tenantId, companyId, clean(request.name()), request.date())) {
            throw new IllegalArgumentException("Holiday already exists on this date");
        }
        Holiday holiday = Holiday.builder().tenantId(tenantId).company(company).build();
        apply(holiday, request);
        return holidayResponse(holidays.save(holiday));
    }

    @Transactional(readOnly = true)
    public HolidayResponse holiday(Long tenantId, Long companyId, Long id) {
        return holidayResponse(requireHoliday(tenantId, companyId, id));
    }

    public HolidayResponse updateHoliday(Long tenantId, Long companyId, Long id, HolidayRequest request) {
        Holiday holiday = requireHoliday(tenantId, companyId, id);
        if (holidays.existsByTenantIdAndCompanyIdAndNameIgnoreCaseAndDateAndIdNot(
                tenantId, companyId, clean(request.name()), request.date(), id)) {
            throw new IllegalArgumentException("Holiday already exists on this date");
        }
        apply(holiday, request);
        return holidayResponse(holidays.save(holiday));
    }

    public void deleteHoliday(Long tenantId, Long companyId, Long id) {
        holidays.delete(requireHoliday(tenantId, companyId, id));
    }

    // ── Export ─────────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public byte[] exportHolidaysCsv(Long tenantId, Long companyId, int year) {
        requireCompany(tenantId, companyId);
        List<Holiday> list = holidays.findByTenantIdAndCompanyIdAndDateBetweenOrderByDate(
                tenantId, companyId, LocalDate.of(year, 1, 1), LocalDate.of(year, 12, 31));
        StringBuilder sb = new StringBuilder();
        sb.append("name,date,type,applies_to,optional,status\n");
        for (Holiday h : list) {
            sb.append(csvEscape(h.getName())).append(',')
              .append(h.getDate()).append(',')
              .append(csvEscape(h.getType())).append(',')
              .append(csvEscape(h.getAppliesTo())).append(',')
              .append(Boolean.TRUE.equals(h.getOptional()) ? "yes" : "no").append(',')
              .append(h.getStatus().name().toLowerCase(Locale.ROOT)).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    // ── Import ─────────────────────────────────────────────────────────────────
    public record HolidayImportResult(int imported, int skipped, List<String> errors) {}

    public HolidayImportResult importHolidaysCsv(Long tenantId, Long companyId, InputStream csvStream) {
        requireCompany(tenantId, companyId);
        int imported = 0, skipped = 0;
        List<String> errors = new ArrayList<>();
        Set<String> validTypes = Set.of("Public Holiday", "Regional Holiday", "Optional Holiday", "Company Holiday");
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(csvStream, StandardCharsets.UTF_8))) {
            String header = reader.readLine();
            if (header == null) throw new IllegalArgumentException("CSV file is empty");
            // Normalise header: strip BOM, lowercase, trim
            String[] cols = header.replaceFirst("\uFEFF", "").split(",");
            int iName = -1, iDate = -1, iType = -1, iAppliesTo = -1, iOptional = -1, iStatus = -1;
            for (int i = 0; i < cols.length; i++) {
                switch (cols[i].trim().toLowerCase(Locale.ROOT)) {
                    case "name"       -> iName      = i;
                    case "date"       -> iDate      = i;
                    case "type"       -> iType      = i;
                    case "applies_to", "appliesto", "branch" -> iAppliesTo = i;
                    case "optional"   -> iOptional  = i;
                    case "status"     -> iStatus    = i;
                }
            }
            if (iName == -1 || iDate == -1 || iType == -1)
                throw new IllegalArgumentException("CSV must have columns: name, date, type (and optionally applies_to, optional, status)");
            String line;
            int row = 1;
            while ((line = reader.readLine()) != null) {
                row++;
                if (line.isBlank()) continue;
                String[] cells = parseCsvRow(line);
                try {
                    String name = cell(cells, iName);
                    String dateStr = cell(cells, iDate);
                    String type = cell(cells, iType);
                    if (name.isBlank()) { errors.add("Row " + row + ": name is required"); skipped++; continue; }
                    if (dateStr.isBlank()) { errors.add("Row " + row + ": date is required"); skipped++; continue; }
                    if (type.isBlank()) { errors.add("Row " + row + ": type is required"); skipped++; continue; }
                    if (!validTypes.contains(type)) {
                        errors.add("Row " + row + ": invalid type '" + type + "'"); skipped++; continue;
                    }
                    LocalDate date;
                    try { date = LocalDate.parse(dateStr); }
                    catch (DateTimeParseException ex) {
                        errors.add("Row " + row + ": date '" + dateStr + "' must be YYYY-MM-DD"); skipped++; continue;
                    }
                    String appliesTo = iAppliesTo >= 0 ? cell(cells, iAppliesTo) : "All Branches";
                    if (appliesTo.isBlank()) appliesTo = "All Branches";
                    String optional = iOptional >= 0 ? cell(cells, iOptional) : "no";
                    String statusStr = iStatus >= 0 ? cell(cells, iStatus) : "active";
                    CompanyRecordStatus status;
                    try { status = CompanyRecordStatus.from(statusStr.isBlank() ? "active" : statusStr); }
                    catch (IllegalArgumentException ex) { status = CompanyRecordStatus.ACTIVE; }
                    // Skip duplicates silently (same logic as createHoliday)
                    if (holidays.existsByTenantIdAndCompanyIdAndNameIgnoreCaseAndDate(tenantId, companyId, name.trim(), date)) {
                        errors.add("Row " + row + ": '" + name + "' on " + date + " already exists (skipped)"); skipped++; continue;
                    }
                    HolidayRequest req = new HolidayRequest(name.trim(), date, type.trim(), appliesTo.trim(), optional, status);
                    createHoliday(tenantId, companyId, req);
                    imported++;
                } catch (Exception ex) {
                    errors.add("Row " + row + ": " + ex.getMessage());
                    skipped++;
                }
            }
        } catch (IOException ex) {
            throw new IllegalArgumentException("Failed to read CSV: " + ex.getMessage(), ex);
        }
        return new HolidayImportResult(imported, skipped, errors);
    }

    private static String csvEscape(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    /** Very simple CSV row parser – handles double-quoted fields. */
    private static String[] parseCsvRow(String line) {
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (inQuotes) {
                if (c == '"' && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    current.append('"'); i++;
                } else if (c == '"') {
                    inQuotes = false;
                } else {
                    current.append(c);
                }
            } else {
                if (c == '"') { inQuotes = true; }
                else if (c == ',') { result.add(current.toString()); current.setLength(0); }
                else { current.append(c); }
            }
        }
        result.add(current.toString());
        return result.toArray(new String[0]);
    }

    private static String cell(String[] cells, int index) {
        if (index < 0 || index >= cells.length) return "";
        return cells[index].trim();
    }

    @Transactional(readOnly = true)
    public List<ApprovalWorkflowResponse> workflows(Long tenantId, Long companyId) {
        requireCompany(tenantId, companyId);
        return workflows.findByTenantIdAndCompanyIdOrderByTitle(tenantId, companyId).stream()
                .map(this::workflowResponse).toList();
    }

    @Transactional(readOnly = true)
    public ApprovalWorkflowResponse workflow(Long tenantId, Long companyId, Long id) {
        return workflowResponse(requireWorkflow(tenantId, companyId, id));
    }

    public ApprovalWorkflowResponse createWorkflow(Long tenantId, Long companyId,
                                                    ApprovalWorkflowRequest request) {
        Company company = requireCompany(tenantId, companyId);
        if (workflows.existsByTenantIdAndCompanyIdAndTitleIgnoreCase(tenantId, companyId, clean(request.title()))) {
            throw new IllegalArgumentException("Approval workflow title already exists");
        }
        ApprovalWorkflow workflow = ApprovalWorkflow.builder().tenantId(tenantId).company(company).build();
        apply(workflow, request);
        return workflowResponse(workflows.save(workflow));
    }

    public ApprovalWorkflowResponse updateWorkflow(Long tenantId, Long companyId, Long id,
                                                    ApprovalWorkflowRequest request) {
        ApprovalWorkflow workflow = requireWorkflow(tenantId, companyId, id);
        if (workflows.existsByTenantIdAndCompanyIdAndTitleIgnoreCaseAndIdNot(
                tenantId, companyId, clean(request.title()), id)) {
            throw new IllegalArgumentException("Approval workflow title already exists");
        }
        apply(workflow, request);
        return workflowResponse(workflows.save(workflow));
    }

    public void deleteWorkflow(Long tenantId, Long companyId, Long id) {
        workflows.delete(requireWorkflow(tenantId, companyId, id));
    }

    @Transactional(readOnly = true)
    public CompanySettingsResponse settings(Long tenantId, Long companyId) {
        Company company = requireCompany(tenantId, companyId);
        return settings.findByTenantIdAndCompanyId(tenantId, companyId)
                .map(this::settingsResponse).orElseGet(() -> defaultSettings(company));
    }

    public CompanySettingsResponse updateSettings(Long tenantId, Long companyId, CompanySettingsRequest request) {
        Company company = requireCompany(tenantId, companyId);
        CompanySettings current = settings.findByTenantIdAndCompanyId(tenantId, companyId)
                .orElseGet(() -> CompanySettings.builder().tenantId(tenantId).company(company).build());
        CompanySettingsResponse existing = current.getId() == null ? defaultSettings(company) : settingsResponse(current);
        current.setGeneralJson(write(request.general() == null ? existing.general() : request.general()));
        current.setLocalizationJson(write(request.localization() == null ? existing.localization() : request.localization()));
        current.setWorkScheduleJson(write(request.workSchedule() == null ? existing.workSchedule() : request.workSchedule()));
        current.setLeaveHolidaysJson(write(request.leaveAndHolidays() == null ? existing.leaveAndHolidays() : request.leaveAndHolidays()));
        current.setNotificationsJson(write(request.notifications() == null ? existing.notifications() : request.notifications()));
        current.setSystemPreferencesJson(write(request.systemPreferences() == null ? existing.systemPreferences() : request.systemPreferences()));
        return settingsResponse(settings.save(current));
    }

    @Transactional(readOnly = true)
    public OrganizationChartResponse organizationChart(Long tenantId, Long companyId) {
        Company company = requireCompany(tenantId, companyId);
        List<OrganizationNode> nodes = departments.findByTenantIdAndCompanyIdOrderByName(tenantId, companyId)
                .stream().map(item -> new OrganizationNode(item.getId(), item.getName(), item.getHeadName(),
                        item.getEmployeeCount())).toList();
        String director = settings.findByTenantIdAndCompanyId(tenantId, companyId)
                .map(this::settingsResponse).map(CompanySettingsResponse::general)
                .map(general -> Objects.toString(general.get("managingDirector"), ""))
                .orElse("");
        return new OrganizationChartResponse(companyId, company.getName(), director, nodes);
    }

    @Transactional(readOnly = true)
    public CompanyDashboardResponse dashboard(Long tenantId, Long companyId) {
        Company company = requireCompany(tenantId, companyId);
        String plan = subscriptions.findFirstByTenantIdAndActiveTrueOrderByCreatedAtDesc(tenantId)
                .map(TenantSubscription::getPlan).map(Enum::name).map(this::titleCase).orElse("Starter");
        return new CompanyDashboardResponse(companyResponse(company),
                branches.countByTenantIdAndCompanyId(tenantId, companyId), users.countByTenantId(tenantId),
                departments.countByTenantIdAndCompanyId(tenantId, companyId), plan, company.getStatus(),
                organizationChart(tenantId, companyId));
    }

    private void apply(Company company, CompanyRequest request, String code) {
        company.setName(clean(request.companyName())); company.setCode(code);
        company.setCompanyType(cleanNullable(request.companyType())); company.setIndustry(cleanNullable(request.industry()));
        company.setRegistrationNumber(cleanNullable(request.registrationNumber())); company.setGstNumber(upperNullable(request.gstNumber()));
        company.setPan(upperNullable(request.pan())); company.setCin(upperNullable(request.cin()));
        company.setWebsite(cleanNullable(request.website())); company.setEmail(lowerNullable(request.email()));
        company.setPhone(cleanNullable(request.phone())); company.setAddressLine1(cleanNullable(request.address()));
        company.setAddressLine2(cleanNullable(request.addressLine2())); company.setCountry(cleanNullable(request.country()));
        company.setState(cleanNullable(request.state())); company.setCity(cleanNullable(request.city()));
        company.setPinCode(cleanNullable(request.pincode())); company.setCurrency(cleanNullable(request.currency()));
        company.setTimezone(cleanNullable(request.timezone())); company.setFinancialYear(cleanNullable(request.financialYear()));
        company.setLogoUrl(cleanNullable(request.logoUrl())); company.setFoundedOn(request.foundedOn());
        company.setStatus(status(request.status()));
    }

    private void apply(Branch branch, BranchRequest request, String code) {
        branch.setName(clean(request.branchName())); branch.setCode(code); branch.setBranchType(clean(request.branchType()));
        branch.setManagerName(cleanNullable(request.manager())); branch.setContactNumber(clean(request.contactNumber()));
        branch.setEmail(lowerNullable(request.email())); branch.setAddressLine1(clean(request.address1()));
        branch.setAddressLine2(cleanNullable(request.address2())); branch.setCountry(clean(request.country()));
        branch.setState(clean(request.state())); branch.setCity(clean(request.city())); branch.setPinCode(clean(request.pincode()));
        branch.setGstNumber(upperNullable(request.gstNumber())); branch.setStatus(status(request.status()));
    }

    private void apply(CostCenter center, CostCenterRequest request, String code) {
        center.setCode(code); center.setName(clean(request.name())); center.setDescription(cleanNullable(request.description()));
        center.setBudget(request.budget()); center.setStatus(status(request.status()));
    }

    private void apply(Department department, DepartmentRequest request, Long tenantId, Long companyId, String code) {
        Branch branch;
        if (request.branchId() != null) {
            branch = requireBranch(tenantId, companyId, request.branchId());
        } else if (!blank(request.branch())) {
            branch = branches.findByTenantIdAndCompanyIdAndNameIgnoreCase(tenantId, companyId, clean(request.branch()))
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        } else {
            throw new IllegalArgumentException("branchId or branch is required");
        }
        CostCenter center = request.costCenterId() == null ? null
                : requireCostCenter(tenantId, companyId, request.costCenterId());
        department.setBranch(branch); department.setCostCenter(center); department.setName(clean(request.name()));
        department.setCode(code); department.setHeadName(cleanNullable(request.head()));
        department.setDepartmentType(clean(request.type())); department.setDescription(cleanNullable(request.description()));
        department.setEmployeeCount(request.employees() == null ? 0 : request.employees());
        department.setStatus(status(request.status()));
    }

    private void apply(Holiday holiday, HolidayRequest request) {
        holiday.setName(clean(request.name())); holiday.setDate(request.date()); holiday.setType(clean(request.type()));
        holiday.setAppliesTo(clean(request.appliesTo()));
        holiday.setOptional("yes".equalsIgnoreCase(request.optional()) || "true".equalsIgnoreCase(request.optional()));
        holiday.setStatus(status(request.status()));
    }

    private void apply(ApprovalWorkflow workflow, ApprovalWorkflowRequest request) {
        workflow.setTitle(clean(request.title())); workflow.setTriggerExpression(clean(request.trigger()));
        workflow.setSteps(request.steps().stream().map(this::clean).toList()); workflow.setStatus(status(request.status()));
    }

    private Company requireCompany(Long tenantId, Long id) {
        return companies.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
    }
    private Branch requireBranch(Long tenantId, Long companyId, Long id) {
        return branches.findByIdAndTenantIdAndCompanyId(id, tenantId, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
    }
    private CostCenter requireCostCenter(Long tenantId, Long companyId, Long id) {
        return costCenters.findByIdAndTenantIdAndCompanyId(id, tenantId, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Cost center not found"));
    }
    private Department requireDepartment(Long tenantId, Long companyId, Long id) {
        return departments.findByIdAndTenantIdAndCompanyId(id, tenantId, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }
    private Holiday requireHoliday(Long tenantId, Long companyId, Long id) {
        return holidays.findByIdAndTenantIdAndCompanyId(id, tenantId, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Holiday not found"));
    }
    private ApprovalWorkflow requireWorkflow(Long tenantId, Long companyId, Long id) {
        return workflows.findByIdAndTenantIdAndCompanyId(id, tenantId, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Approval workflow not found"));
    }

    private CompanyResponse companyResponse(Company item) {
        return new CompanyResponse(item.getId(), item.getName(), item.getCode(), item.getCompanyType(), item.getIndustry(),
                item.getRegistrationNumber(), item.getGstNumber(), item.getPan(), item.getCin(), item.getWebsite(),
                item.getEmail(), item.getPhone(), item.getAddressLine1(), item.getAddressLine2(), item.getCountry(),
                item.getState(), item.getCity(), item.getPinCode(), item.getCurrency(), item.getTimezone(),
                item.getFinancialYear(), item.getLogoUrl(), item.getFoundedOn(), item.getStatus(), item.getCreatedAt(), item.getUpdatedAt());
    }
    private BranchResponse branchResponse(Branch item) {
        return new BranchResponse(item.getId(), item.getCompany().getId(), item.getCompany().getName(), item.getName(),
                item.getCode(), item.getBranchType(), item.getManagerName(), item.getContactNumber(), item.getEmail(),
                item.getAddressLine1(), item.getAddressLine2(), item.getCountry(), item.getState(), item.getCity(),
                item.getPinCode(), item.getGstNumber(), item.getStatus(), item.getCreatedAt(), item.getUpdatedAt());
    }
    private CostCenterResponse costCenterResponse(CostCenter item) {
        return new CostCenterResponse(item.getId(), item.getCompany().getId(), item.getCode(), item.getName(),
                item.getDescription(), item.getBudget(), item.getStatus(), item.getCreatedAt(), item.getUpdatedAt());
    }
    private DepartmentResponse departmentResponse(Department item) {
        CostCenter center = item.getCostCenter();
        return new DepartmentResponse(item.getId(), item.getCompany().getId(), item.getBranch().getId(), item.getBranch().getName(),
                center == null ? null : center.getId(), center == null ? null : center.getCode(), item.getName(), item.getCode(),
                item.getHeadName(), item.getDepartmentType(), item.getDescription(), item.getEmployeeCount(), item.getStatus(),
                item.getCreatedAt(), item.getUpdatedAt());
    }
    private HolidayResponse holidayResponse(Holiday item) {
        return new HolidayResponse(item.getId(), item.getCompany().getId(), item.getName(), item.getDate(),
                item.getDate().getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH), item.getType(), item.getAppliesTo(),
                Boolean.TRUE.equals(item.getOptional()) ? "Yes" : "No", item.getStatus(), item.getCreatedAt(), item.getUpdatedAt());
    }
    private ApprovalWorkflowResponse workflowResponse(ApprovalWorkflow item) {
        return new ApprovalWorkflowResponse(item.getId(), item.getCompany().getId(), item.getTitle(), item.getTriggerExpression(),
                List.copyOf(item.getSteps()), item.getStatus(), item.getCreatedAt(), item.getUpdatedAt());
    }

    private CompanySettingsResponse settingsResponse(CompanySettings item) {
        return new CompanySettingsResponse(item.getCompany().getId(), readMap(item.getGeneralJson()),
                readMap(item.getLocalizationJson()), readMap(item.getWorkScheduleJson()), readMap(item.getLeaveHolidaysJson()),
                readList(item.getNotificationsJson()), readMap(item.getSystemPreferencesJson()), item.getUpdatedAt());
    }

    private CompanySettingsResponse defaultSettings(Company company) {
        Map<String, Object> general = map("companyName", company.getName(), "companyCode", company.getCode(),
                "orgType", Objects.toString(company.getIndustry(), ""), "orgStatus", titleCase(company.getStatus().name()),
                "defaultBranch", "", "defaultDept", "", "financialYear", Objects.toString(company.getFinancialYear(), "2026 - 2027"),
                "currency", Objects.toString(company.getCurrency(), "INR - Indian Rupee (₹)"),
                "currencySymbol", "₹", "numberFormat", "1,23,456.78", "taxCalc", "Exclusive", "gstApplicable", true,
                "dateFormat", "DD/MM/YYYY", "timeFormat", "12 Hours (hh:mm AM/PM)", "timezone", "(GMT+05:30) Asia/Kolkata",
                "weekStarts", "Monday", "autoGenId", true, "idPrefix", "CMP-", "idLength", "4 Digits",
                "nextId", "CMP-0001", "docUpload", true, "auditLogs", true, "dataExport", true,
                "maintenanceMode", false, "showInactive", false);
        Map<String, Object> localization = map("country", Objects.toString(company.getCountry(), "India"),
                "state", Objects.toString(company.getState(), ""), "city", Objects.toString(company.getCity(), ""),
                "timezone", Objects.toString(company.getTimezone(), "(GMT+05:30) Asia/Kolkata"),
                "currency", "INR - Indian Rupee (₹)", "dateFormat", "DD/MM/YYYY", "timeFormat", "12 Hours (hh:mm AM/PM)",
                "currencyPos", "1,234.56 (Left)", "weekStarts", "Monday", "language", "English",
                "numberFormat", "1,23,456.78", "measurement", "Metric (kg, cm, m)");
        Map<String, Object> work = map("workDays", List.of("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"),
                "startTime", "09:00 AM", "endTime", "06:00 PM", "breakDuration", 60, "breakStart", "01:00 PM",
                "weeklyHours", 48, "branchSchedule", true);
        Map<String, Object> leave = map("holidayCalendar", "India - 2026", "weekendPolicy", "Saturday & Sunday",
                "branchHolidays", true, "holidayApproval", true, "autoCarry", true, "notifyHolidays", true,
                "upcomingReminder", 3, "reminderUnit", "Days Before", "annualAllowed", 3, "maxCarry", 10,
                "forwardLeaves", true, "optionalHolidays", true, "approvalRequired", true, "encashmentAllowed", true);
        List<Map<String, Object>> notifications = List.of(
                map("key", "holiday", "label", "Holiday Reminders", "email", true, "inApp", true, "sms", false, "reminder", "3 Days Before"),
                map("key", "approval", "label", "Approval Notifications", "email", true, "inApp", true, "sms", false, "reminder", "Instant"),
                map("key", "newUser", "label", "New User Notifications", "email", true, "inApp", false, "sms", false, "reminder", "Instant"),
                map("key", "leaveNotif", "label", "Leave Notifications", "email", true, "inApp", true, "sms", false, "reminder", "1 Day Before"),
                map("key", "attendance", "label", "Attendance Alerts", "email", true, "inApp", true, "sms", false, "reminder", "Instant"),
                map("key", "payroll", "label", "Payroll Notifications", "email", true, "inApp", true, "sms", false, "reminder", "Instant"),
                map("key", "system", "label", "System Announcements", "email", true, "inApp", true, "sms", false, "reminder", "Instant"));
        Map<String, Object> system = map("pageSize", 10, "theme", "Light", "dashboardAnalytics", true, "auditLogs", true,
                "sessionTimeout", 30, "docUpload", true, "dataExport", true, "autoBackup", true, "backupFreq", "Daily",
                "backupRetention", 30, "twoFactor", true, "passwordExpiry", 50, "minPwdLength", 8, "loginAttempts", 5,
                "strongPwd", true, "approvalNewUsers", true, "approvalCompanyChanges", true, "defaultApprovalLevels", 2,
                "escalateApprovals", true, "escalateAfter", 2, "maintenanceMode", false,
                "maintenanceMsg", "System is under maintenance. Please try again soon.", "showInactive", false, "purgeAfter", 180);
        return new CompanySettingsResponse(company.getId(), general, localization, work, leave, notifications, system, null);
    }

    private Map<String, Object> readMap(String json) {
        if (blank(json)) return new LinkedHashMap<>();
        try { return objectMapper.readValue(json, new TypeReference<LinkedHashMap<String, Object>>() { }); }
        catch (JsonProcessingException exception) { throw new IllegalStateException("Stored company settings are invalid", exception); }
    }
    private List<Map<String, Object>> readList(String json) {
        if (blank(json)) return new ArrayList<>();
        try { return objectMapper.readValue(json, new TypeReference<ArrayList<Map<String, Object>>>() { }); }
        catch (JsonProcessingException exception) { throw new IllegalStateException("Stored notification settings are invalid", exception); }
    }
    private String write(Object value) {
        try { return objectMapper.writeValueAsString(value); }
        catch (JsonProcessingException exception) { throw new IllegalArgumentException("Company settings contain unsupported values", exception); }
    }
    private Map<String, Object> map(Object... values) {
        Map<String, Object> result = new LinkedHashMap<>();
        for (int i = 0; i < values.length; i += 2) result.put((String) values[i], values[i + 1]);
        return result;
    }
    private CompanyRecordStatus status(CompanyRecordStatus status) { return status == null ? CompanyRecordStatus.ACTIVE : status; }
    private String clean(String value) { return value.trim(); }
    private String cleanNullable(String value) { return blank(value) ? null : value.trim(); }
    private String upper(String value) { return clean(value).toUpperCase(Locale.ROOT); }
    private String upperNullable(String value) { return blank(value) ? null : upper(value); }
    private String lowerNullable(String value) { return blank(value) ? null : clean(value).toLowerCase(Locale.ROOT); }
    private boolean blank(String value) { return value == null || value.isBlank(); }
    private String titleCase(String value) {
        String lower = value.toLowerCase(Locale.ROOT);
        return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
    }
}
