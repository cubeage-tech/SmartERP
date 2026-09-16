package com.cubeage.erp.inventory.service;

import com.cubeage.erp.inventory.dto.response.ReplenishmentRecommendationResponse;
import java.util.List;

public interface ReplenishmentService {
	List<ReplenishmentRecommendationResponse> recommendations(Long tenantId);
}
