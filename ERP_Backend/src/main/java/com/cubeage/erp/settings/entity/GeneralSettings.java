package com.cubeage.erp.settings.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;

@Entity @Table(name = "general_settings", uniqueConstraints = @UniqueConstraint(name="uk_general_settings_tenant", columnNames="tenant_id"))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class GeneralSettings {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="tenant_id", nullable=false) private Long tenantId;
    @Column(nullable=false) private String companyName;
    private String legalName;
    @Column(length = 15) private String gstin;
    @Column(length = 10) private String pan;
    private String industry;
    @Column(nullable=false, length=10) private String currency;
    @Column(nullable=false, length=60) private String timezone;
    @Column(nullable=false, length=20) private String locale;
    @Column(nullable=false, length=30) private String dateFormat;
    @Column(nullable=false) private Integer fiscalYearStartMonth;
    private String streetAddress;
    private String city;
    private String state;
    @Column(length = 10) private String pinCode;
    @UpdateTimestamp @Column(nullable=false) private Instant updatedAt;
}
