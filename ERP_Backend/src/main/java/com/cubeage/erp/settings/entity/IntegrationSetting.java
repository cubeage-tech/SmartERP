package com.cubeage.erp.settings.entity;

import com.cubeage.erp.settings.enums.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;

@Entity @Table(name="integration_settings", uniqueConstraints=@UniqueConstraint(name="uk_integration_setting", columnNames={"tenant_id","type","name"}))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class IntegrationSetting {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="tenant_id", nullable=false) private Long tenantId;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private IntegrationType type;
    @Column(nullable=false) private String name;
    @Column(name="config_json", columnDefinition="TEXT") private String configJson;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private IntegrationStatus status;
    @Column(nullable=false) private Boolean enabled;
    private Instant lastCheckedAt;
    private String lastError;
    @UpdateTimestamp @Column(nullable=false) private Instant updatedAt;
}
