package com.cubeage.erp.company.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "company_management_settings")
@Getter 
@Setter 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class CompanySettings {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    @Lob @Column(name = "general_json", columnDefinition = "TEXT")
    private String generalJson;
    @Lob @Column(name = "localization_json", columnDefinition = "TEXT")
    private String localizationJson;
    @Lob @Column(name = "work_schedule_json", columnDefinition = "TEXT")
    private String workScheduleJson;
    @Lob @Column(name = "leave_holidays_json", columnDefinition = "TEXT")
    private String leaveHolidaysJson;
    @Lob @Column(name = "notifications_json", columnDefinition = "TEXT")
    private String notificationsJson;
    @Lob @Column(name = "system_preferences_json", columnDefinition = "TEXT")
    private String systemPreferencesJson;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
