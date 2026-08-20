package com.cubeage.erp.superAdmin.service;

import com.cubeage.erp.superAdmin.dto.setting.*;

import java.util.List;

public interface SystemSettingService {
    SystemSettingResponse save(SystemSettingRequest request);
    SystemSettingResponse getByKey(String key);
    List<SystemSettingResponse> getAll();
    List<SystemSettingResponse> getByCategory(String category);
    void delete(Long id);
}
