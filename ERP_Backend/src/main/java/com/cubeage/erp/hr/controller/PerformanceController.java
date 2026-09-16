package com.cubeage.erp.hr.controller;

import com.cubeage.erp.hr.dto.performance.DepartmentScoreResponse;
import com.cubeage.erp.hr.dto.performance.PerformanceReviewRequest;
import com.cubeage.erp.hr.dto.performance.PerformanceReviewResponse;
import com.cubeage.erp.hr.dto.performance.PerformanceSummaryResponse;
import com.cubeage.erp.hr.service.PerformanceService;
import com.cubeage.erp.security.SecurityUtils;
import com.cubeage.erp.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hr/performance")
@RequiredArgsConstructor
public class PerformanceController {

    private final PerformanceService performanceService;

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

    @GetMapping
    public PerformanceSummaryResponse getPerformance(
            @RequestParam(required = false) Long tenantId
    ) {
        return performanceService.getSummary(resolveTenantId(tenantId));
    }

    @GetMapping("/summary")
    public PerformanceSummaryResponse getSummary(
            @RequestParam(required = false) Long tenantId
    ) {
        return performanceService.getSummary(resolveTenantId(tenantId));
    }

    @GetMapping("/reviews")
    public List<PerformanceReviewResponse> getReviews(
            @RequestParam(required = false) Long tenantId
    ) {
        return performanceService.getReviews(resolveTenantId(tenantId));
    }

    @GetMapping("/department-scores")
    public List<DepartmentScoreResponse> getDepartmentScores(
            @RequestParam(required = false) Long tenantId
    ) {
        return performanceService.getDepartmentScores(resolveTenantId(tenantId));
    }

    @PostMapping("/reviews")
    public ResponseEntity<PerformanceReviewResponse> addReview(
            @RequestParam(required = false) Long tenantId,
            @RequestBody PerformanceReviewRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(performanceService.addReview(resolveTenantId(tenantId), request));
    }
}
