package com.cubeage.erp.finance.service.impl;

import com.cubeage.erp.finance.entity.Account;
import com.cubeage.erp.finance.entity.JournalEntry;
import com.cubeage.erp.finance.entity.JournalEntryLine;
import com.cubeage.erp.finance.enums.AccountType;
import com.cubeage.erp.finance.enums.JournalStatus;
import com.cubeage.erp.finance.repository.AccountRepository;
import com.cubeage.erp.finance.repository.JournalEntryRepository;
import com.cubeage.erp.finance.service.AccountService;
import com.cubeage.erp.finance.service.TallyExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TallyExportServiceImpl implements TallyExportService {

	private static final DateTimeFormatter TALLY_DATE_FMT = DateTimeFormatter.ofPattern("yyyyMMdd");

	private final AccountRepository accountRepository;
	private final JournalEntryRepository journalEntryRepository;
	private final AccountService accountService;

	@Override
	public String exportChartOfAccountsXml(Long tenantId) {
		accountService.initDefaultAccountsIfEmpty(tenantId);
		List<Account> accounts = accountRepository.findByTenantIdOrderByIdAsc(tenantId);

		StringBuilder xml = new StringBuilder();
		xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
		xml.append("<ENVELOPE>\n");
		xml.append("  <HEADER>\n");
		xml.append("    <TALLYREQUEST>Import Data</TALLYREQUEST>\n");
		xml.append("  </HEADER>\n");
		xml.append("  <BODY>\n");
		xml.append("    <IMPORTDATA>\n");
		xml.append("      <REQUESTDESC>\n");
		xml.append("        <REPORTNAME>All Masters</REPORTNAME>\n");
		xml.append("        <STATICVARIABLES>\n");
		xml.append("          <SVCURRENTCOMPANY>SmartERP</SVCURRENTCOMPANY>\n");
		xml.append("        </STATICVARIABLES>\n");
		xml.append("      </REQUESTDESC>\n");
		xml.append("      <REQUESTDATA>\n");

		for (Account acc : accounts) {
			String ledgerName = escapeXml(acc.getName());
			String parentGroup = escapeXml(mapToTallyGroup(acc));

			xml.append("        <TALLYMESSAGE xmlns:UDF=\"TallyUDF\">\n");
			xml.append("          <LEDGER NAME=\"").append(ledgerName).append("\" ACTION=\"Create\">\n");
			xml.append("            <NAME.LIST>\n");
			xml.append("              <NAME>").append(ledgerName).append("</NAME>\n");
			xml.append("            </NAME.LIST>\n");
			xml.append("            <PARENT>").append(parentGroup).append("</PARENT>\n");
			xml.append("            <OPENINGBALANCE>0.00</OPENINGBALANCE>\n");
			xml.append("            <ISBILLWISEON>No</ISBILLWISEON>\n");
			xml.append("            <ISCOSTCENTRESON>No</ISCOSTCENTRESON>\n");
			xml.append("          </LEDGER>\n");
			xml.append("        </TALLYMESSAGE>\n");
		}

		xml.append("      </REQUESTDATA>\n");
		xml.append("    </IMPORTDATA>\n");
		xml.append("  </BODY>\n");
		xml.append("</ENVELOPE>\n");

		return xml.toString();
	}

	@Override
	public String exportDaybookXml(Long tenantId, LocalDate startDate, LocalDate endDate) {
		LocalDate effectiveStart = (startDate != null) ? startDate : LocalDate.of(1970, 1, 1);
		LocalDate effectiveEnd = (endDate != null) ? endDate : LocalDate.of(2099, 12, 31);

		List<JournalEntry> entries = journalEntryRepository.findByTenantIdAndStatusAndEntryDateBetweenOrderByEntryDateDescIdDesc(
				tenantId, JournalStatus.POSTED, effectiveStart, effectiveEnd
		);

		StringBuilder xml = new StringBuilder();
		xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
		xml.append("<ENVELOPE>\n");
		xml.append("  <HEADER>\n");
		xml.append("    <TALLYREQUEST>Import Data</TALLYREQUEST>\n");
		xml.append("  </HEADER>\n");
		xml.append("  <BODY>\n");
		xml.append("    <IMPORTDATA>\n");
		xml.append("      <REQUESTDESC>\n");
		xml.append("        <REPORTNAME>Vouchers</REPORTNAME>\n");
		xml.append("        <STATICVARIABLES>\n");
		xml.append("          <SVCURRENTCOMPANY>SmartERP</SVCURRENTCOMPANY>\n");
		xml.append("        </STATICVARIABLES>\n");
		xml.append("      </REQUESTDESC>\n");
		xml.append("      <REQUESTDATA>\n");

		for (JournalEntry entry : entries) {
			String tallyDate = entry.getEntryDate().format(TALLY_DATE_FMT);
			String voucherNumber = escapeXml(entry.getEntryNumber());
			String narration = escapeXml(entry.getDescription());
			String reference = escapeXml(entry.getReference() != null ? entry.getReference() : "");

			xml.append("        <TALLYMESSAGE xmlns:UDF=\"TallyUDF\">\n");
			xml.append("          <VOUCHER VCHTYPE=\"Journal\" ACTION=\"Create\" OBJVIEW=\"Accounting Voucher View\">\n");
			xml.append("            <DATE>").append(tallyDate).append("</DATE>\n");
			xml.append("            <VOUCHERTYPENAME>Journal</VOUCHERTYPENAME>\n");
			xml.append("            <VOUCHERNUMBER>").append(voucherNumber).append("</VOUCHERNUMBER>\n");
			if (!reference.isEmpty()) {
				xml.append("            <REFERENCE>").append(reference).append("</REFERENCE>\n");
			}
			if (!narration.isEmpty()) {
				xml.append("            <NARRATION>").append(narration).append("</NARRATION>\n");
			}

			for (JournalEntryLine line : entry.getLines()) {
				String ledgerName = escapeXml(line.getAccountName());
				BigDecimal debit = line.getDebit() != null ? line.getDebit() : BigDecimal.ZERO;
				BigDecimal credit = line.getCredit() != null ? line.getCredit() : BigDecimal.ZERO;

				if (debit.compareTo(BigDecimal.ZERO) > 0) {
					// In Tally XML, Debits are represented with negative amounts and ISDEEMEDPOSITIVE = Yes
					BigDecimal tallyAmount = debit.negate().setScale(2, RoundingMode.HALF_UP);
					xml.append("            <ALLLEDGERENTRIES.LIST>\n");
					xml.append("              <LEDGERNAME>").append(ledgerName).append("</LEDGERNAME>\n");
					xml.append("              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>\n");
					xml.append("              <AMOUNT>").append(tallyAmount).append("</AMOUNT>\n");
					xml.append("            </ALLLEDGERENTRIES.LIST>\n");
				} else if (credit.compareTo(BigDecimal.ZERO) > 0) {
					// In Tally XML, Credits are represented with positive amounts and ISDEEMEDPOSITIVE = No
					BigDecimal tallyAmount = credit.setScale(2, RoundingMode.HALF_UP);
					xml.append("            <ALLLEDGERENTRIES.LIST>\n");
					xml.append("              <LEDGERNAME>").append(ledgerName).append("</LEDGERNAME>\n");
					xml.append("              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n");
					xml.append("              <AMOUNT>").append(tallyAmount).append("</AMOUNT>\n");
					xml.append("            </ALLLEDGERENTRIES.LIST>\n");
				}
			}

			xml.append("          </VOUCHER>\n");
			xml.append("        </TALLYMESSAGE>\n");
		}

		xml.append("      </REQUESTDATA>\n");
		xml.append("    </IMPORTDATA>\n");
		xml.append("  </BODY>\n");
		xml.append("</ENVELOPE>\n");

		return xml.toString();
	}

	private String mapToTallyGroup(Account account) {
		AccountType type = account.getType();
		String code = (account.getCode() != null) ? account.getCode().trim() : "";
		String lowerName = (account.getName() != null) ? account.getName().toLowerCase(Locale.ROOT) : "";

		if (type == AccountType.ASSET) {
			if (code.startsWith("15") || code.startsWith("16") || code.startsWith("17") || code.startsWith("18") || code.startsWith("19")
					|| lowerName.contains("equipment") || lowerName.contains("machinery") || lowerName.contains("property")
					|| lowerName.contains("hardware") || lowerName.contains("building") || lowerName.contains("vehicle")) {
				return "Fixed Assets";
			}
			if (code.startsWith("12") || lowerName.contains("inventory") || lowerName.contains("stock")) {
				return "Stock-in-Hand";
			}
			if (code.startsWith("11") || lowerName.contains("receivable") || lowerName.contains("debtor")) {
				return "Sundry Debtors";
			}
			if (code.equals("1001") || lowerName.contains("cash")) {
				return "Cash-in-Hand";
			}
			if (code.equals("1002") || lowerName.contains("bank") || lowerName.contains("hdfc") || lowerName.contains("sbi") || lowerName.contains("icici")) {
				return "Bank Accounts";
			}
			return "Current Assets";
		} else if (type == AccountType.LIABILITY) {
			if (code.startsWith("20") || lowerName.contains("payable") || lowerName.contains("creditor")) {
				return "Sundry Creditors";
			}
			if (code.startsWith("25") || code.startsWith("26") || code.startsWith("27")
					|| lowerName.contains("loan") || lowerName.contains("borrowing") || lowerName.contains("debenture")) {
				return "Secured Loans";
			}
			return "Current Liabilities";
		} else if (type == AccountType.EQUITY) {
			return "Capital Account";
		} else if (type == AccountType.REVENUE) {
			return "Sales Accounts";
		} else if (type == AccountType.EXPENSE) {
			if (code.startsWith("50") || lowerName.contains("office") || lowerName.contains("rent") || lowerName.contains("salary")) {
				return "Indirect Expenses";
			}
			return "Direct Expenses";
		}
		return "Current Assets";
	}

	private String escapeXml(String text) {
		if (text == null) {
			return "";
		}
		return text.replace("&", "&amp;")
				.replace("<", "&lt;")
				.replace(">", "&gt;")
				.replace("\"", "&quot;")
				.replace("'", "&apos;");
	}
}
