package com.cubeage.erp.finance.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.finance.enums.JournalStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "finance_journal_entries", uniqueConstraints = @UniqueConstraint(name = "uk_finance_journal_tenant_number", columnNames = {"tenant_id", "entry_number"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JournalEntry extends BaseEntity {
	@Column(name = "tenant_id", nullable = false) private Long tenantId;
	@Column(name = "entry_number", nullable = false, length = 40) private String entryNumber;
	@Column(name = "entry_date", nullable = false) private LocalDate entryDate;
	@Column(nullable = false, length = 500) private String description;
	@Column(length = 80) private String reference;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private JournalStatus status;
	@OneToMany(mappedBy = "journalEntry", cascade = CascadeType.ALL, orphanRemoval = true)
	@Builder.Default private List<JournalEntryLine> lines = new ArrayList<>();
}
