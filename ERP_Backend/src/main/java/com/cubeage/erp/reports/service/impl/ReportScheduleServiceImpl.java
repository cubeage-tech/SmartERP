package com.cubeage.erp.reports.service.impl;

import com.cubeage.erp.common.exception.ResourceNotFoundException;
import com.cubeage.erp.reports.dto.schedule.ReportScheduleRequest;
import com.cubeage.erp.reports.dto.schedule.ReportScheduleResponse;
import com.cubeage.erp.reports.entity.CustomReport;
import com.cubeage.erp.reports.entity.Report;
import com.cubeage.erp.reports.entity.ReportSchedule;
import com.cubeage.erp.reports.mapper.ReportScheduleMapper;
import com.cubeage.erp.reports.repository.CustomReportRepository;
import com.cubeage.erp.reports.repository.ReportRepository;
import com.cubeage.erp.reports.repository.ReportScheduleRepository;
import com.cubeage.erp.reports.service.ReportScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportScheduleServiceImpl implements ReportScheduleService {

    private final ReportScheduleRepository repository;
    private final CustomReportRepository customReportRepository;
    private final ReportRepository reportRepository;
    private final ReportScheduleMapper mapper;

    @Override
    public ReportScheduleResponse create(Long tenantId, ReportScheduleRequest r) {
        if (r.endDate() != null && r.endDate().isBefore(r.startDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        if (Boolean.TRUE.equals(r.active())) {
            if (r.isCustom()) {
                if (repository.existsByTenantIdAndIsCustomAndCustomReport_IdAndActiveTrue(tenantId, r.reportId())) {
                    throw new IllegalArgumentException("An active schedule already exists for this custom report");
                }
            } else {
                if (repository.existsByTenantIdAndIsCustomAndReport_IdAndActiveTrue(tenantId, r.reportId())) {
                    throw new IllegalArgumentException("An active schedule already exists for this standard report");
                }
            }
        }

        ReportSchedule.ReportScheduleBuilder builder = ReportSchedule.builder()
                .tenantId(tenantId)
                .isCustom(r.isCustom())
                .frequency(r.frequency())
                .dayOfWeek(r.dayOfWeek())
                .timeOfDay(r.timeOfDay())
                .recipients(r.recipients())
                .format(r.format())
                .startDate(r.startDate())
                .endDate(r.endDate())
                .active(r.active());

        if (r.isCustom()) {
            CustomReport cr = customReportRepository.findByIdAndTenantId(r.reportId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Custom report not found with id: " + r.reportId()));
            builder.customReport(cr);
        } else {
            Report rep = reportRepository.findById(r.reportId())
                .orElseThrow(() -> new ResourceNotFoundException("Standard report template not found with id: " + r.reportId()));
            builder.report(rep);
        }

        return mapper.toResponse(repository.save(builder.build()));
    }

    @Override
    public ReportScheduleResponse update(Long tenantId, Long id, ReportScheduleRequest r) {
        ReportSchedule schedule = repository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Report schedule not found with id: " + id));

        if (r.startDate() != null && r.endDate() != null && r.endDate().isBefore(r.startDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        if (Boolean.TRUE.equals(r.active()) && !Boolean.TRUE.equals(schedule.getActive())) {
            if (schedule.getIsCustom()) {
                if (repository.existsByTenantIdAndIsCustomAndCustomReport_IdAndActiveTrue(tenantId, schedule.getCustomReport().getId())) {
                    throw new IllegalArgumentException("An active schedule already exists for this custom report");
                }
            } else {
                if (repository.existsByTenantIdAndIsCustomAndReport_IdAndActiveTrue(tenantId, schedule.getReport().getId())) {
                    throw new IllegalArgumentException("An active schedule already exists for this standard report");
                }
            }
        }

        if (r.frequency() != null) schedule.setFrequency(r.frequency());
        schedule.setDayOfWeek(r.dayOfWeek());
        if (r.timeOfDay() != null) schedule.setTimeOfDay(r.timeOfDay());
        if (r.recipients() != null) schedule.setRecipients(r.recipients());
        if (r.format() != null) schedule.setFormat(r.format());
        if (r.startDate() != null) schedule.setStartDate(r.startDate());
        if (r.endDate() != null) schedule.setEndDate(r.endDate());
        if (r.active() != null) schedule.setActive(r.active());

        return mapper.toResponse(repository.save(schedule));
    }

    @Override
    @Transactional(readOnly = true)
    public ReportScheduleResponse get(Long tenantId, Long id) {
        ReportSchedule schedule = repository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Report schedule not found with id: " + id));
        return mapper.toResponse(schedule);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportScheduleResponse> all(Long tenantId) {
        return repository.findByTenantId(tenantId).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void delete(Long tenantId, Long id) {
        ReportSchedule schedule = repository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Report schedule not found with id: " + id));
        repository.delete(schedule);
    }
}
