package com.cubeage.erp.manufacturing.service.impl;

import com.cubeage.erp.manufacturing.dto.response.ManufacturingDashboardResponse;
import com.cubeage.erp.manufacturing.enums.MachineStatus;
import com.cubeage.erp.manufacturing.enums.WorkOrderStatus;
import com.cubeage.erp.manufacturing.repository.MachineRepository;
import com.cubeage.erp.manufacturing.repository.WorkOrderRepository;
import com.cubeage.erp.manufacturing.service.ManufacturingDashboardService;
import com.cubeage.erp.manufacturing.service.QualityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ManufacturingDashboardServiceImpl implements ManufacturingDashboardService {

    private final WorkOrderRepository workOrderRepository;
    private final MachineRepository machineRepository;
    private final QualityService qualityService;

    @Override
    public ManufacturingDashboardResponse getDashboard(Long tenantId) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        long activeWorkOrders = workOrderRepository.countByTenantIdAndStatus(effectiveTenantId, WorkOrderStatus.IN_PROGRESS);

        long completingToday = workOrderRepository.findByTenantIdAndStatusOrderByCreatedAtDesc(effectiveTenantId, WorkOrderStatus.IN_PROGRESS)
                .stream()
                .filter(wo -> wo.getDueDate() != null && wo.getDueDate().equals(LocalDate.now()))
                .count();

        long downMachines = machineRepository.countByTenantIdAndStatus(effectiveTenantId, MachineStatus.MAINTENANCE)
                + machineRepository.countByTenantIdAndStatus(effectiveTenantId, MachineStatus.DOWN);

        double avgUtilization = machineRepository.findByTenantIdOrderByCodeAsc(effectiveTenantId)
                .stream()
                .mapToInt(m -> m.getUtilization() != null ? m.getUtilization() : 0)
                .average()
                .orElse(0.0);

        var qualitySummary = qualityService.getQualityControlSummary(effectiveTenantId);
        double passRate = qualitySummary.passRate() != null ? qualitySummary.passRate() : 0.0;

        List<ManufacturingDashboardResponse.StatCardDto> stats = List.of(
                new ManufacturingDashboardResponse.StatCardDto(
                        String.valueOf(activeWorkOrders),
                        "ACTIVE WOS",
                        completingToday + " completing today",
                        "positive"
                ),
                new ManufacturingDashboardResponse.StatCardDto(
                        String.format("%.0f%%", avgUtilization),
                        "OEE",
                        "Overall Equipment Effectiveness",
                        "positive"
                ),
                new ManufacturingDashboardResponse.StatCardDto(
                        String.format("%.1f%%", passRate),
                        "QUALITY RATE",
                        String.format("%.1f%% rejection rate", qualitySummary.rejectionRate() != null ? qualitySummary.rejectionRate() : 0.0),
                        "positive"
                ),
                new ManufacturingDashboardResponse.StatCardDto(
                        String.valueOf(downMachines),
                        "MACHINE DOWN",
                        downMachines > 0 ? downMachines + " machine(s) offline" : "All machines operational",
                        downMachines > 0 ? "danger" : "positive"
                )
        );

        return new ManufacturingDashboardResponse(stats);
    }
}