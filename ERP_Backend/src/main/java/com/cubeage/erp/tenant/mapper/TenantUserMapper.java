package com.cubeage.erp.tenant.mapper;

import com.cubeage.erp.admin.entity.User;
import com.cubeage.erp.tenant.dto.user.TenantUserResponse;
import com.cubeage.erp.tenant.entity.TenantUser;
import org.springframework.stereotype.Component;

@Component
public class TenantUserMapper {
    public TenantUserResponse toResponse(TenantUser membership, User user) {
        return new TenantUserResponse(membership.getId(), membership.getTenantId(), membership.getUserId(),
                user.getName(), user.getEmail(), membership.getStatus(), Boolean.TRUE.equals(membership.getOwner()),
                membership.getJoinedAt());
    }
}
