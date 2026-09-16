package com.cubeage.erp.hr.controller;

import com.cubeage.erp.hr.dto.payroll.PayrollRequest;
import com.cubeage.erp.hr.dto.payroll.PayrollResponse;
import com.cubeage.erp.hr.dto.payroll.PayrollSummaryResponse;
import com.cubeage.erp.hr.service.PayrollService;
import com.cubeage.erp.security.SecurityUtils;
import com.cubeage.erp.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hr/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    private Long resolveTenantId(Long tenantId) {
        if (tenantId != null) {
            return tenantId;
        }
        Long contextTenantId = TenantContext.getTenantId();
        if (contextTenantId != null) {
            return contextTenantId;
        }
        try {
            return SecurityUtils.currentTenantId();
        } catch (Exception e) {
            return 1L;
        }
    }

    @GetMapping("/summary")
    public PayrollSummaryResponse getSummary(
            @RequestParam(required = false) Long tenantId
    ) {
        return payrollService.getPayrollSummary(resolveTenantId(tenantId));
    }

    @GetMapping
    public List<PayrollResponse> getPayrolls(
            @RequestParam(required = false) Long tenantId
    ) {
        return payrollService.getPayrolls(resolveTenantId(tenantId));
    }

    @PostMapping("/process")
    public ResponseEntity<PayrollResponse> processPayroll(
            @RequestParam(required = false) Long tenantId,
            @RequestBody(required = false) PayrollRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(payrollService.processPayroll(resolveTenantId(tenantId), request));
    }
}
