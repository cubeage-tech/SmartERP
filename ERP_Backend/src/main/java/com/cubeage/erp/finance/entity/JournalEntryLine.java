package com.cubeage.erp.finance.entity;

import com.cubeage.erp.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Table(name = "finance_journal_lines")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JournalEntryLine extends BaseEntity {
	@ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "journal_entry_id", nullable = false)
	private JournalEntry journalEntry;
	@Column(name = "account_code", nullable = false, length = 30) private String accountCode;
	@Column(name = "account_name", nullable = false, length = 120) private String accountName;
	@Column(nullable = false, precision = 19, scale = 2) private BigDecimal debit;
	@Column(nullable = false, precision = 19, scale = 2) private BigDecimal credit;
}
