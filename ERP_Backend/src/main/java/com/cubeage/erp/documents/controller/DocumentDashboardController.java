package com.cubeage.erp.documents.controller;

import com.cubeage.erp.documents.dto.dashboard.DocumentDashboardResponse;
import com.cubeage.erp.documents.service.DocumentDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/documents/dashboard")
@RequiredArgsConstructor
public class DocumentDashboardController {

    private final DocumentDashboardService service;

    @GetMapping
    public DocumentDashboardResponse getDashboard(
            @RequestHeader("X-Company-Id") Long companyId
    ) {
        return service.getDashboard(companyId);
    }
}
