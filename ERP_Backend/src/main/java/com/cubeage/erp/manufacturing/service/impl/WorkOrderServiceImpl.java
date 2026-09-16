package com.cubeage.erp.manufacturing.service.impl;

import com.cubeage.erp.common.exception.BadRequestException;
import com.cubeage.erp.common.exception.ResourceNotFoundException;
import com.cubeage.erp.manufacturing.dto.request.CreateWorkOrderRequest;
import com.cubeage.erp.manufacturing.dto.request.UpdateWorkOrderRequest;
import com.cubeage.erp.manufacturing.dto.response.WorkOrderResponse;
import com.cubeage.erp.manufacturing.entity.WorkOrder;
import com.cubeage.erp.manufacturing.enums.WorkOrderStatus;
import com.cubeage.erp.manufacturing.mapper.WorkOrderMapper;
import com.cubeage.erp.manufacturing.repository.WorkOrderRepository;
import com.cubeage.erp.company.repository.CompanyRepository;
import com.cubeage.erp.manufacturing.service.WorkOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkOrderServiceImpl implements WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final WorkOrderMapper mapper;
    private final CompanyRepository companyRepository;

    @Override
    public WorkOrderResponse create(Long tenantId, CreateWorkOrderRequest request) {
        validateProgress(request.progress());

        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        int progress = request.progress() == null ? 0 : request.progress();
        WorkOrderStatus status = request.status() == null ? WorkOrderStatus.PENDING : request.status();

        Long companyId = companyRepository.findByTenantIdOrderByName(effectiveTenantId)
                .stream()
                .findFirst()
                .map(company -> company.getId())
                .orElseGet(() -> companyRepository.findAll().stream()
                        .findFirst()
                        .map(company -> company.getId())
                        .orElse(1L));

        WorkOrder workOrder = WorkOrder.builder()
                .tenantId(effectiveTenantId)
                .companyId(companyId)
                .workOrderNumber(generateWorkOrderNumber(effectiveTenantId))
                .status(status)
                .title(request.productName().trim())
                .quantity(request.quantity())
                .bomNumber(normalize(request.bomNumber()))
                .machineCode(normalize(request.machineName()))
                .operatorName(normalize(request.operatorName()))
                .dueDate(request.dueDate())
                .progress(progress)
                .build();

        workOrder = workOrderRepository.save(workOrder);
        return mapper.toResponse(workOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkOrderResponse> getAll(Long tenantId) {
        Long effectiveId = tenantId != null ? tenantId : 1L;
        return workOrderRepository.findByTenantIdOrderByCreatedAtDesc(effectiveId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkOrderResponse> getByStatus(Long tenantId, WorkOrderStatus status) {
        Long effectiveId = tenantId != null ? tenantId : 1L;
        return workOrderRepository.findByTenantIdAndStatusOrderByCreatedAtDesc(effectiveId, status)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public WorkOrderResponse getById(Long tenantId, Long id) {
        return mapper.toResponse(getEntity(tenantId, id));
    }

    @Override
    public WorkOrderResponse update(Long tenantId, Long id, UpdateWorkOrderRequest request) {
        WorkOrder workOrder = getEntity(tenantId, id);

        if (request.productName() != null && !request.productName().isBlank()) {
            workOrder.setTitle(request.productName().trim());
        }
        if (request.quantity() != null) {
            workOrder.setQuantity(request.quantity());
        }
        if (request.bomNumber() != null) {
            workOrder.setBomNumber(normalize(request.bomNumber()));
        }
        if (request.machineName() != null) {
            workOrder.setMachineCode(normalize(request.machineName()));
        }
        if (request.operatorName() != null) {
            workOrder.setOperatorName(normalize(request.operatorName()));
        }
        if (request.dueDate() != null) {
            workOrder.setDueDate(request.dueDate());
        }
        if (request.status() != null) {
            workOrder.setStatus(request.status());
            if (request.status() == WorkOrderStatus.COMPLETED) {
                workOrder.setProgress(100);
            }
        }
        if (request.progress() != null) {
            validateProgress(request.progress());
            workOrder.setProgress(request.progress());
        }

        return mapper.toResponse(workOrderRepository.save(workOrder));
    }

    @Override
    public void delete(Long tenantId, Long id) {
        WorkOrder workOrder = getEntity(tenantId, id);
        workOrderRepository.delete(workOrder);
    }

    private WorkOrder getEntity(Long tenantId, Long id) {
        Long effectiveId = tenantId != null ? tenantId : 1L;
        return workOrderRepository.findByIdAndTenantId(id, effectiveId)
                .or(() -> workOrderRepository.findById(id))
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found: " + id));
    }

    private void validateProgress(Integer progress) {
        if (progress != null && (progress < 0 || progress > 100)) {
            throw new BadRequestException("Progress must be between 0 and 100");
        }
    }

    private String normalize(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    private synchronized String generateWorkOrderNumber(Long tenantId) {
        long count = workOrderRepository.countByTenantId(tenantId) + 1;
        return String.format("WO-%d-%04d", LocalDate.now().getYear(), count);
    }
}