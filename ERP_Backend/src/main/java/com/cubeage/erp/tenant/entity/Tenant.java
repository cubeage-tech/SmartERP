package com.cubeage.erp.tenant.entity;

import com.cubeage.erp.tenant.enums.TenantPlan;
import com.cubeage.erp.tenant.enums.TenantStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;

@Entity
@Table(name = "tenants", uniqueConstraints = @UniqueConstraint(name = "uk_tenant_code", columnNames = "code"))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Tenant {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 50)
    private String code;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String contactEmail;
    private String contactPhone;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private TenantStatus status;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private TenantPlan plan;
    @Column(nullable = false)
    private Integer maxUsers;
    @Column(nullable = false, length = 10)
    private String currency;
    @Column(nullable = false, length = 60)
    private String timezone;
    private Instant trialEndsAt;
    @CreationTimestamp @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp @Column(nullable = false)
    private Instant updatedAt;
}
