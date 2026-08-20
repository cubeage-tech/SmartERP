package com.cubeage.erp.tenant.controller;

import com.cubeage.erp.tenant.dto.tenant.*;
import com.cubeage.erp.tenant.enums.TenantStatus;
import com.cubeage.erp.tenant.service.TenantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/v1/tenants") @RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class TenantController {
    private final TenantService service;
    @PostMapping public ResponseEntity<TenantResponse> create(@Valid @RequestBody CreateTenantRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request)); }
    @GetMapping public List<TenantSummaryResponse> list(@RequestParam(required = false) TenantStatus status) { return service.list(status); }
    @GetMapping("/{id}") public TenantResponse get(@PathVariable Long id) { return service.get(id); }
    @PutMapping("/{id}") public TenantResponse update(@PathVariable Long id, @Valid @RequestBody UpdateTenantRequest request) { return service.update(id, request); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { service.delete(id); }
}
