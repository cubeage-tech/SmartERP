package com.cubeage.erp.superAdmin.mapper;

import com.cubeage.erp.superAdmin.dto.user.PlatformUserResponse;
import com.cubeage.erp.superAdmin.entity.PlatformUser;
import org.springframework.stereotype.Component;

@Component
public class PlatformUserMapper {
    public PlatformUserResponse toResponse(PlatformUser u) {
        return new PlatformUserResponse(u.getId(), u.getFullName(), u.getEmail(),
                u.getRole(), u.getIsActive(), u.getLastLoginAt(),
                u.getCreatedAt(), u.getUpdatedAt());
    }
}
