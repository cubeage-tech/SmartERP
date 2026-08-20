package com.cubeage.erp.admin.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "permissions",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_permission",
                        columnNames = {
                                "module",
                                "action",
                                "scope"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String module;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Action action;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Scope scope;

    public enum Action {
        VIEW,
        CREATE,
        EDIT,
        DELETE,
        APPROVE
    }

    public enum Scope {
        OWN,
        TEAM,
        BRANCH,
        ALL
    }
}