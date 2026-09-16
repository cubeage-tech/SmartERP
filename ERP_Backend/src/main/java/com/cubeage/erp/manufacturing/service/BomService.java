package com.cubeage.erp.manufacturing.service;

import com.cubeage.erp.manufacturing.dto.request.CreateBomRequest;
import com.cubeage.erp.manufacturing.dto.request.UpdateBomRequest;
import com.cubeage.erp.manufacturing.dto.response.BomDetailsResponse;
import com.cubeage.erp.manufacturing.dto.response.BomResponse;

import java.util.List;

public interface BomService {

    BomResponse create(Long tenantId, CreateBomRequest request);

    List<BomResponse> getAll(Long tenantId);

    BomDetailsResponse getById(Long tenantId, Long id);

    BomResponse update(Long tenantId, Long id, UpdateBomRequest request);

    void delete(Long tenantId, Long id);
}