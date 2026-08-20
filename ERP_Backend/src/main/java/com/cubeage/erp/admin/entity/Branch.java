package com.cubeage.erp.admin.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "branches",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_branch_tenant_name",
                        columnNames = {
                                "tenant_id",
                                "name"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(nullable = false)
    private String name;

    private String address;

    private String currency;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}