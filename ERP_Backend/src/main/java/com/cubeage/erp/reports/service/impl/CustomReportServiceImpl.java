package com.cubeage.erp.reports.service.impl;

import com.cubeage.erp.common.exception.ResourceNotFoundException;
import com.cubeage.erp.reports.dto.custom.*;
import com.cubeage.erp.reports.entity.CustomReport;
import com.cubeage.erp.reports.enums.ReportStatus;
import com.cubeage.erp.reports.mapper.CustomReportMapper;
import com.cubeage.erp.reports.repository.CustomReportRepository;
import com.cubeage.erp.reports.service.CustomReportService;
import com.cubeage.erp.security.SecurityUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomReportServiceImpl implements CustomReportService {

    private final CustomReportRepository repository;
    private final CustomReportMapper mapper;
    private final ObjectMapper objectMapper;

    @PersistenceContext
    private final EntityManager entityManager;

    private static final Map<String, Class<?>> TABLE_CLASS_MAP = new HashMap<>();
    static {
        TABLE_CLASS_MAP.put("Sales Orders", com.cubeage.erp.sales.entity.SalesOrder.class);
        TABLE_CLASS_MAP.put("Projects", com.cubeage.erp.projects.entity.Project.class);
        TABLE_CLASS_MAP.put("Stock Items", com.cubeage.erp.inventory.entity.InventoryItem.class);
        TABLE_CLASS_MAP.put("GL Entries", com.cubeage.erp.finance.entity.JournalEntry.class);
        TABLE_CLASS_MAP.put("Journal Vouchers", com.cubeage.erp.finance.entity.JournalEntry.class);
    }

    @Override
    public CustomReportResponse create(Long tenantId, CustomReportRequest r) {
        if (repository.existsByTenantIdAndNameIgnoreCase(tenantId, r.name())) {
            throw new IllegalArgumentException("Report with this name already exists");
        }

        CustomReport report = CustomReport.builder()
                .tenantId(tenantId)
                .name(r.name().trim())
                .module(r.module())
                .reportType(r.reportType())
                .description(r.description())
                .visibility(r.visibility())
                .createdBy(SecurityUtils.currentUser().getUsername())
                .dataSource(r.dataSource())
                .primaryTable(r.primaryTable())
                .selectedFieldsJson(mapper.serialize(r.selectedFields()))
                .filtersJson(mapper.serialize(r.filters()))
                .matchType(r.matchType())
                .dateField(r.dateField())
                .dateRange(r.dateRange())
                .fromDate(r.fromDate())
                .toDate(r.toDate())
                .groupByJson(mapper.serialize(r.groupBy()))
                .sortBy(r.sortBy())
                .sortDir(r.sortDir())
                .calculationsJson(mapper.serialize(r.calculations()))
                .vizType(r.vizType())
                .kpiEnabled(r.kpiEnabled())
                .kpisJson(mapper.serialize(r.kpis()))
                .schedEnabled(r.schedEnabled())
                .exportFormatsJson(mapper.serialize(r.exportFormats()))
                .exportIncludesJson(mapper.serialize(r.exportIncludes()))
                .sharedUsersJson(mapper.serialize(r.sharedUsers()))
                .status(ReportStatus.ACTIVE)
                .build();

        return mapper.toResponse(repository.save(report));
    }

    @Override
    public CustomReportResponse update(Long tenantId, Long id, CustomReportRequest r) {
        CustomReport report = repository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Custom report not found with id: " + id));

        if (r.name() != null && !r.name().equalsIgnoreCase(report.getName())) {
            if (repository.existsByTenantIdAndNameIgnoreCase(tenantId, r.name())) {
                throw new IllegalArgumentException("Report with this name already exists");
            }
            report.setName(r.name().trim());
        }

        if (r.module() != null) report.setModule(r.module());
        if (r.reportType() != null) report.setReportType(r.reportType());
        if (r.description() != null) report.setDescription(r.description());
        if (r.visibility() != null) report.setVisibility(r.visibility());
        if (r.dataSource() != null) report.setDataSource(r.dataSource());
        if (r.primaryTable() != null) report.setPrimaryTable(r.primaryTable());
        if (r.selectedFields() != null) report.setSelectedFieldsJson(mapper.serialize(r.selectedFields()));
        if (r.filters() != null) report.setFiltersJson(mapper.serialize(r.filters()));
        if (r.matchType() != null) report.setMatchType(r.matchType());
        if (r.dateField() != null) report.setDateField(r.dateField());
        if (r.dateRange() != null) report.setDateRange(r.dateRange());
        if (r.fromDate() != null) report.setFromDate(r.fromDate());
        if (r.toDate() != null) report.setToDate(r.toDate());
        if (r.groupBy() != null) report.setGroupByJson(mapper.serialize(r.groupBy()));
        if (r.sortBy() != null) report.setSortBy(r.sortBy());
        if (r.sortDir() != null) report.setSortDir(r.sortDir());
        if (r.calculations() != null) report.setCalculationsJson(mapper.serialize(r.calculations()));
        if (r.vizType() != null) report.setVizType(r.vizType());
        report.setKpiEnabled(r.kpiEnabled());
        if (r.kpis() != null) report.setKpisJson(mapper.serialize(r.kpis()));
        report.setSchedEnabled(r.schedEnabled());
        if (r.exportFormats() != null) report.setExportFormatsJson(mapper.serialize(r.exportFormats()));
        if (r.exportIncludes() != null) report.setExportIncludesJson(mapper.serialize(r.exportIncludes()));
        if (r.sharedUsers() != null) report.setSharedUsersJson(mapper.serialize(r.sharedUsers()));

        return mapper.toResponse(repository.save(report));
    }

    @Override
    @Transactional(readOnly = true)
    public CustomReportResponse get(Long tenantId, Long id) {
        CustomReport report = repository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Custom report not found with id: " + id));
        return mapper.toResponse(report);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomReportResponse> all(Long tenantId) {
        return repository.findByTenantIdOrderByCreatedAtDesc(tenantId).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void delete(Long tenantId, Long id) {
        CustomReport report = repository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Custom report not found with id: " + id));
        repository.delete(report);
    }

    @Override
    @Transactional(readOnly = true)
    public PreviewDataResponse getPreview(Long tenantId, Long id) {
        CustomReport report = repository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Custom report not found with id: " + id));

        List<String> fields = deserializeList(report.getSelectedFieldsJson(), new TypeReference<List<String>>() {});
        List<CustomReportRequest.FilterRow> filters = deserializeList(report.getFiltersJson(), new TypeReference<List<CustomReportRequest.FilterRow>>() {});
        List<String> groupBy = deserializeList(report.getGroupByJson(), new TypeReference<List<String>>() {});
        List<CustomReportRequest.CalculationRow> calculations = deserializeList(report.getCalculationsJson(), new TypeReference<List<CustomReportRequest.CalculationRow>>() {});

        return runPreviewQuery(
            tenantId,
            report.getPrimaryTable(),
            fields,
            filters,
            report.getMatchType(),
            report.getDateField(),
            report.getDateRange(),
            report.getFromDate(),
            report.getToDate(),
            groupBy,
            report.getSortBy(),
            report.getSortDir(),
            calculations
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PreviewDataResponse getPreviewDynamic(Long tenantId, CustomReportRequest r) {
        return runPreviewQuery(
            tenantId,
            r.primaryTable(),
            r.selectedFields(),
            r.filters(),
            r.matchType(),
            r.dateField(),
            r.dateRange(),
            r.fromDate(),
            r.toDate(),
            r.groupBy(),
            r.sortBy(),
            r.sortDir(),
            r.calculations()
        );
    }

    // ─── Query Builder & Mock Handler ───

    private PreviewDataResponse runPreviewQuery(
            Long tenantId, String primaryTable, List<String> selectedFields,
            List<CustomReportRequest.FilterRow> filters, String matchType,
            String dateField, String dateRange, LocalDate fromDate, LocalDate toDate,
            List<String> groupBy, String sortBy, String sortDir,
            List<CustomReportRequest.CalculationRow> calculations) {

        Class<?> entityClass = TABLE_CLASS_MAP.get(primaryTable);

        // Fallback to Mock Data Generator if table not implemented / mapped
        if (entityClass == null) {
            return generateMockPreview(primaryTable, selectedFields);
        }

        try {
            String tblNormalized = primaryTable.toLowerCase().replaceAll("[^a-z0-9]", "");
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<Object[]> query = cb.createQuery(Object[].class);
            Root<?> root = query.from(entityClass);

            // 1. Build selection fields / group expressions / aggregations
            List<Selection<?>> selections = new ArrayList<>();
            List<String> finalColumns = new ArrayList<>();

            boolean hasGroup = groupBy != null && !groupBy.isEmpty();
            boolean hasCalc = calculations != null && !calculations.isEmpty();

            if (hasGroup && hasCalc) {
                for (String g : groupBy) {
                    String prop = resolveFieldName(tblNormalized, g);
                    selections.add(root.get(prop).alias(g));
                    finalColumns.add(g);
                }
                for (CustomReportRequest.CalculationRow calc : calculations) {
                    String prop = resolveFieldName(tblNormalized, calc.field());
                    String func = calc.calc();
                    String alias = calc.alias() != null && !calc.alias().isBlank() ? calc.alias() : func + "(" + calc.field() + ")";
                    
                    Expression<? extends Number> path = root.get(prop);
                    if ("SUM".equalsIgnoreCase(func)) {
                        selections.add(cb.sum(path).alias(alias));
                    } else if ("AVG".equalsIgnoreCase(func)) {
                        selections.add(cb.avg(path).alias(alias));
                    } else if ("COUNT".equalsIgnoreCase(func)) {
                        selections.add(cb.count(path).alias(alias));
                    } else if ("MIN".equalsIgnoreCase(func)) {
                        selections.add(cb.min(path).alias(alias));
                    } else if ("MAX".equalsIgnoreCase(func)) {
                        selections.add(cb.max(path).alias(alias));
                    }
                    finalColumns.add(alias);
                }
            } else if (hasCalc) {
                for (CustomReportRequest.CalculationRow calc : calculations) {
                    String prop = resolveFieldName(tblNormalized, calc.field());
                    String func = calc.calc();
                    String alias = calc.alias() != null && !calc.alias().isBlank() ? calc.alias() : func + "(" + calc.field() + ")";
                    
                    Expression<? extends Number> path = root.get(prop);
                    if ("SUM".equalsIgnoreCase(func)) {
                        selections.add(cb.sum(path).alias(alias));
                    } else if ("AVG".equalsIgnoreCase(func)) {
                        selections.add(cb.avg(path).alias(alias));
                    } else if ("COUNT".equalsIgnoreCase(func)) {
                        selections.add(cb.count(path).alias(alias));
                    } else if ("MIN".equalsIgnoreCase(func)) {
                        selections.add(cb.min(path).alias(alias));
                    } else if ("MAX".equalsIgnoreCase(func)) {
                        selections.add(cb.max(path).alias(alias));
                    }
                    finalColumns.add(alias);
                }
            } else if (selectedFields != null && !selectedFields.isEmpty()) {
                for (String field : selectedFields) {
                    String prop = resolveFieldName(tblNormalized, field);
                    selections.add(root.get(prop).alias(field));
                    finalColumns.add(field);
                }
            } else {
                // select fallback ID
                selections.add(root.get("id").alias("Id"));
                finalColumns.add("Id");
            }

            query.multiselect(selections);

            // 2. Enforce Tenant Isolation Predicate
            Predicate tenantPredicate = cb.equal(root.get("tenantId"), tenantId);
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(tenantPredicate);

            // 3. User Filter Predicates
            if (filters != null && !filters.isEmpty()) {
                List<Predicate> filterPredicates = new ArrayList<>();
                for (CustomReportRequest.FilterRow filter : filters) {
                    if (filter.field() == null || filter.field().isBlank()) continue;
                    String prop = resolveFieldName(tblNormalized, filter.field());
                    String op = filter.operator();
                    String val = filter.value();

                    Path<String> path = root.get(prop);
                    if ("equals".equals(op)) {
                        filterPredicates.add(cb.equal(path, val));
                    } else if ("not equals".equals(op)) {
                        filterPredicates.add(cb.notEqual(path, val));
                    } else if ("contains".equals(op)) {
                        filterPredicates.add(cb.like(cb.lower(path), "%" + val.toLowerCase() + "%"));
                    } else if ("starts with".equals(op)) {
                        filterPredicates.add(cb.like(cb.lower(path), val.toLowerCase() + "%"));
                    } else if ("ends with".equals(op)) {
                        filterPredicates.add(cb.like(cb.lower(path), "%" + val.toLowerCase()));
                    } else if ("greater than".equals(op)) {
                        filterPredicates.add(cb.greaterThan(path, val));
                    } else if ("less than".equals(op)) {
                        filterPredicates.add(cb.lessThan(path, val));
                    } else if ("is empty".equals(op)) {
                        filterPredicates.add(cb.or(cb.isNull(path), cb.equal(path, "")));
                    } else if ("is not empty".equals(op)) {
                        filterPredicates.add(cb.and(cb.isNotNull(path), cb.notEqual(path, "")));
                    }
                }

                if (!filterPredicates.isEmpty()) {
                    if ("any".equalsIgnoreCase(matchType)) {
                        predicates.add(cb.or(filterPredicates.toArray(new Predicate[0])));
                    } else {
                        predicates.add(cb.and(filterPredicates.toArray(new Predicate[0])));
                    }
                }
            }

            // 4. Date Range Predicates
            if (dateField != null && !dateField.isBlank() && dateRange != null && !dateRange.isBlank()) {
                String prop = resolveFieldName(tblNormalized, dateField);
                if (!prop.isBlank()) {
                    Path<LocalDate> datePath = root.get(prop);
                    LocalDate start = null;
                    LocalDate end = null;
                    LocalDate now = LocalDate.now();

                    if ("This Week".equalsIgnoreCase(dateRange)) {
                        start = now.minusDays(now.getDayOfWeek().getValue() - 1);
                        end = start.plusDays(6);
                    } else if ("Last Week".equalsIgnoreCase(dateRange)) {
                        start = now.minusDays(now.getDayOfWeek().getValue() + 6);
                        end = start.plusDays(6);
                    } else if ("This Month".equalsIgnoreCase(dateRange)) {
                        start = now.withDayOfMonth(1);
                        end = now.withDayOfMonth(now.lengthOfMonth());
                    } else if ("Last Month".equalsIgnoreCase(dateRange)) {
                        start = now.minusMonths(1).withDayOfMonth(1);
                        end = now.minusMonths(1).withDayOfMonth(now.minusMonths(1).lengthOfMonth());
                    } else if ("This Quarter".equalsIgnoreCase(dateRange)) {
                        int quarter = (now.getMonthValue() - 1) / 3;
                        start = LocalDate.of(now.getYear(), quarter * 3 + 1, 1);
                        end = start.plusMonths(3).minusDays(1);
                    } else if ("Last Quarter".equalsIgnoreCase(dateRange)) {
                        int quarter = (now.getMonthValue() - 1) / 3 - 1;
                        int year = now.getYear();
                        if (quarter < 0) { quarter = 3; year--; }
                        start = LocalDate.of(year, quarter * 3 + 1, 1);
                        end = start.plusMonths(3).minusDays(1);
                    } else if ("This Year".equalsIgnoreCase(dateRange)) {
                        start = LocalDate.of(now.getYear(), 1, 1);
                        end = LocalDate.of(now.getYear(), 12, 31);
                    } else if ("Last Year".equalsIgnoreCase(dateRange)) {
                        start = LocalDate.of(now.getYear() - 1, 1, 1);
                        end = LocalDate.of(now.getYear() - 1, 12, 31);
                    } else if ("Custom".equalsIgnoreCase(dateRange)) {
                        start = fromDate;
                        end = toDate;
                    }

                    if (start != null) predicates.add(cb.greaterThanOrEqualTo(datePath, start));
                    if (end != null) predicates.add(cb.lessThanOrEqualTo(datePath, end));
                }
            }

            query.where(cb.and(predicates.toArray(new Predicate[0])));

            // 5. Group By
            if (hasGroup) {
                List<Expression<?>> groups = new ArrayList<>();
                for (String g : groupBy) {
                    groups.add(root.get(resolveFieldName(tblNormalized, g)));
                }
                query.groupBy(groups);
            }

            // 6. Sorting
            if (sortBy != null && !sortBy.isBlank()) {
                String sortProp = resolveFieldName(tblNormalized, sortBy);
                if ("desc".equalsIgnoreCase(sortDir)) {
                    query.orderBy(cb.desc(root.get(sortProp)));
                } else {
                    query.orderBy(cb.asc(root.get(sortProp)));
                }
            }

            // Execute (max 50 rows preview limit)
            TypedQuery<Object[]> q = entityManager.createQuery(query);
            q.setMaxResults(50);
            List<Object[]> results = q.getResultList();

            // 7. Parse output map rows
            List<Map<String, Object>> dataList = new ArrayList<>();
            for (Object row : results) {
                Map<String, Object> map = new LinkedHashMap<>();
                if (row instanceof Object[] rowArray) {
                    for (int i = 0; i < finalColumns.size(); i++) {
                        map.put(finalColumns.get(i), rowArray[i]);
                    }
                } else {
                    if (!finalColumns.isEmpty()) {
                        map.put(finalColumns.get(0), row);
                    }
                }
                dataList.add(map);
            }

            return new PreviewDataResponse(finalColumns, dataList, dataList.size());

        } catch (Exception e) {
            // Log and fallback to mock if query generation fails (e.g. database schema is not populated)
            System.err.println("Criteria Query failed: " + e.getMessage());
            return generateMockPreview(primaryTable, selectedFields);
        }
    }

    private String resolveFieldName(String tblNormalized, String fieldName) {
        if (fieldName == null) return "";
        String key = fieldName.toLowerCase().replaceAll("[^a-z0-9]", "");

        if ("salesorders".equals(tblNormalized)) {
            if (key.contains("number") || key.contains("no")) return "orderNumber";
            if (key.contains("quote") || key.contains("quotation")) return "quotationId";
            if (key.contains("custid") || key.contains("customerid")) return "customerId";
            if (key.contains("custname") || key.contains("customername")) return "customerName";
            if (key.contains("status")) return "status";
            if (key.contains("date")) return "orderDate";
            if (key.contains("subtotal")) return "subtotal";
            if (key.contains("tax")) return "taxAmount";
            if (key.contains("total") || key.contains("amount")) return "totalAmount";
            if (key.contains("created")) return "createdAt";
        }
        if ("stockitems".equals(tblNormalized)) {
            if (key.contains("sku")) return "sku";
            if (key.contains("name")) return "name";
            if (key.contains("cat")) return "category";
            if (key.contains("whcode") || key.contains("warehousecode")) return "warehouseCode";
            if (key.contains("whname") || key.contains("warehousename")) return "warehouseName";
            if (key.contains("qty") || key.contains("quantity")) return "quantity";
            if (key.contains("unit")) return "unit";
            if (key.contains("cost") || key.contains("price")) return "costPrice";
        }
        if ("projects".equals(tblNormalized)) {
            if (key.contains("code")) return "projectCode";
            if (key.contains("name")) return "name";
            if (key.contains("desc")) return "description";
            if (key.contains("cust") || key.contains("customer")) return "customerName";
            if (key.contains("mgr") || key.contains("manager")) return "managerName";
            if (key.contains("start")) return "startDate";
            if (key.contains("end")) return "endDate";
            if (key.contains("status")) return "status";
            if (key.contains("prior")) return "priority";
            if (key.contains("planned") || key.contains("budget")) return "plannedBudget";
            if (key.contains("actual")) return "actualBudget";
            if (key.contains("progress")) return "progressPercent";
        }
        if ("glentries".equals(tblNormalized) || "journalvouchers".equals(tblNormalized)) {
            if (key.contains("number") || key.contains("no")) return "entryNumber";
            if (key.contains("date")) return "entryDate";
            if (key.contains("desc")) return "description";
            if (key.contains("ref")) return "reference";
            if (key.contains("status")) return "status";
        }

        // Convert string to lowerCamelCase
        StringBuilder sb = new StringBuilder();
        boolean nextUpper = false;
        for (char c : fieldName.toCharArray()) {
            if (Character.isWhitespace(c) || c == '-' || c == '_') {
                nextUpper = true;
            } else if (Character.isLetterOrDigit(c)) {
                if (nextUpper) {
                    sb.append(Character.toUpperCase(c));
                    nextUpper = false;
                } else {
                    sb.append(Character.toLowerCase(c));
                }
            }
        }
        return sb.toString();
    }

    private PreviewDataResponse generateMockPreview(String primaryTable, List<String> selectedFields) {
        List<String> columns = selectedFields != null && !selectedFields.isEmpty() ? selectedFields : List.of("Id", "Name", "Category", "Status", "Date");
        List<Map<String, Object>> data = new ArrayList<>();

        for (int i = 1; i <= 5; i++) {
            Map<String, Object> row = new LinkedHashMap<>();
            for (String col : columns) {
                row.put(col, getMockValueForCol(primaryTable, col, i));
            }
            data.add(row);
        }

        return new PreviewDataResponse(columns, data, 5);
    }

    private Object getMockValueForCol(String table, String col, int index) {
        String key = col.toLowerCase().replaceAll("[^a-z0-9]", "");
        if (key.contains("id") || key.contains("number") || key.contains("no")) {
            return "MCK-" + table.substring(0, Math.min(3, table.length())).toUpperCase() + "-00" + index;
        }
        if (key.contains("name") || key.contains("cust") || key.contains("employee")) {
            String[] names = {"Priya Sharma", "Rohan Mehta", "Aditya Kumar", "Sneha Verma", "Vikram Nair"};
            return names[(index - 1) % names.length];
        }
        if (key.contains("status")) {
            String[] statuses = {"Active", "Pending", "Approved", "Completed", "Paid"};
            return statuses[(index - 1) % statuses.length];
        }
        if (key.contains("date") || key.contains("period")) {
            return LocalDate.now().minusDays(index).toString();
        }
        if (key.contains("amount") || key.contains("salary") || key.contains("budget") || key.contains("cost") || key.contains("price") || key.contains("value")) {
            return 15000.0 * index;
        }
        if (key.contains("qty") || key.contains("quantity") || key.contains("hours") || key.contains("days")) {
            return 5 * index;
        }
        return table + " " + col + " Value " + index;
    }

    private <T> List<T> deserializeList(String json, TypeReference<List<T>> typeReference) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, typeReference);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
