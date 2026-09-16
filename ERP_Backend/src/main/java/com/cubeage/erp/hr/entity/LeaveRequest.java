package com.cubeage.erp.hr.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "hr_leave_requests")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "leave_code", length = 50)
    private String leaveCode;

    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "employee_name", length = 150)
    private String employeeName;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "leave_type", length = 100)
    private String leaveType;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "formatted_from", length = 50)
    private String formattedFrom;

    @Column(name = "formatted_to", length = 50)
    private String formattedTo;

    @Column(name = "days", length = 20)
    private String days;

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "contact_during_leave", length = 100)
    private String contactDuringLeave;

    @Column(name = "attachment_url", length = 255)
    private String attachmentUrl;

    @Column(name = "applied_on")
    private LocalDate appliedOn;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
