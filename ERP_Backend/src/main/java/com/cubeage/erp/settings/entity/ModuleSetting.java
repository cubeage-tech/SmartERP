package com.cubeage.erp.settings.entity;

import com.cubeage.erp.settings.enums.ModuleType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;

@Entity @Table(name="module_settings", uniqueConstraints=@UniqueConstraint(name="uk_module_setting", columnNames={"tenant_id","module"}))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ModuleSetting {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="tenant_id", nullable=false) private Long tenantId;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private ModuleType module;
    @Column(nullable=false) private Boolean enabled;
    @Column(name="config_json", columnDefinition="TEXT") private String configJson;
    @UpdateTimestamp @Column(nullable=false) private Instant updatedAt;
}
