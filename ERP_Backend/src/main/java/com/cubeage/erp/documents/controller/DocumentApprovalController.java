package com.cubeage.erp.documents.controller;

import com.cubeage.erp.documents.dto.approval.DocumentApprovalRequest;
import com.cubeage.erp.documents.dto.approval.DocumentApprovalResponse;
import com.cubeage.erp.documents.service.DocumentApprovalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/documents/approvals")
@RequiredArgsConstructor
public class DocumentApprovalController {

    private final DocumentApprovalService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DocumentApprovalResponse create(
            @RequestHeader("X-Company-Id") Long companyId,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value = "X-User-Name", defaultValue = "User") String userName,
            @Valid @RequestBody DocumentApprovalRequest request
    ) {
        return service.create(companyId, userId, userName, request);
    }

    @GetMapping("/pending")
    public List<DocumentApprovalResponse> getPending(
            @RequestHeader("X-Company-Id") Long companyId
    ) {
        return service.getPending(companyId);
    }

    @GetMapping("/my-pending")
    public List<DocumentApprovalResponse> getMyPending(
            @RequestHeader("X-Company-Id") Long companyId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        return service.getMyPending(companyId, userId);
    }

    @PostMapping("/{id}/approve")
    public DocumentApprovalResponse approve(
            @RequestHeader("X-Company-Id") Long companyId,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        return service.approve(companyId, id, comment(body));
    }

    @PostMapping("/{id}/reject")
    public DocumentApprovalResponse reject(
            @RequestHeader("X-Company-Id") Long companyId,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        return service.reject(companyId, id, comment(body));
    }

    private String comment(Map<String, String> body) {
        return body == null ? null : body.get("comment");
    }
}