package com.cubeage.erp.manufacturing.mapper;

import com.cubeage.erp.manufacturing.dto.response.WorkOrderResponse;
import com.cubeage.erp.manufacturing.entity.WorkOrder;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class WorkOrderMapper {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy");

    public WorkOrderResponse toResponse(WorkOrder workOrder) {
        String statusType = switch (workOrder.getStatus()) {
            case IN_PROGRESS -> "progress";
            case COMPLETED -> "completed";
            case ON_HOLD -> "hold";
            case PENDING -> "pending";
            case CANCELLED -> "cancelled";
        };

        String formattedDue = workOrder.getDueDate() != null
                ? workOrder.getDueDate().format(DATE_FORMATTER)
                : "-";

        List<List<String>> details = List.of(
                List.of("Qty", workOrder.getQuantity() + " pcs"),
                List.of("BOM", workOrder.getBomNumber() != null ? workOrder.getBomNumber() : "-"),
                List.of("Machine", workOrder.getMachineCode() != null ? workOrder.getMachineCode() : "-"),
                List.of("Operator", workOrder.getOperatorName() != null ? workOrder.getOperatorName() : "-"),
                List.of("Due", formattedDue)
        );

        return new WorkOrderResponse(
                workOrder.getId(),
                workOrder.getWorkOrderNumber(),
                workOrder.getStatus(),
                statusType,
                workOrder.getTitle(),
                workOrder.getQuantity(),
                workOrder.getBomNumber(),
                workOrder.getMachineCode(),
                workOrder.getOperatorName(),
                workOrder.getDueDate(),
                workOrder.getProgress(),
                details,
                workOrder.getCreatedAt(),
                workOrder.getUpdatedAt()
        );
    }
}