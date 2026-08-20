package com.cubeage.erp.superAdmin.entity;

import com.cubeage.erp.superAdmin.enums.PlatformRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "sa_platform_users", uniqueConstraints = @UniqueConstraint(name = "uk_platform_user_email", columnNames = "email"))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class PlatformUser {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private PlatformRole role;

    @Column(nullable = false)
    private Boolean isActive;

    private Instant lastLoginAt;

    @CreationTimestamp @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp @Column(nullable = false)
    private Instant updatedAt;
}
