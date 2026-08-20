package com.cubeage.erp.tenant.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;

@Entity
@Table(name = "tenant_domains", uniqueConstraints = @UniqueConstraint(name = "uk_tenant_domain", columnNames = "domain"))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class TenantDomain {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    @Column(nullable = false)
    private String domain;
    @Column(nullable = false)
    private Boolean primaryDomain;
    @Column(nullable = false)
    private Boolean verified;
    private Instant verifiedAt;
    @CreationTimestamp @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
