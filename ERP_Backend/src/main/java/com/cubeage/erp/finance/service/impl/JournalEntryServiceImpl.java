package com.cubeage.erp.finance.service.impl;

import com.cubeage.erp.finance.dto.journal.*;
import com.cubeage.erp.finance.entity.*;
import com.cubeage.erp.finance.enums.JournalStatus;
import com.cubeage.erp.finance.exception.AccountNotFoundException;
import com.cubeage.erp.finance.exception.InactiveAccountException;
import com.cubeage.erp.finance.exception.UnbalancedJournalException;
import com.cubeage.erp.finance.repository.AccountRepository;
import com.cubeage.erp.finance.repository.JournalEntryRepository;
import com.cubeage.erp.finance.service.AccountService;
import com.cubeage.erp.finance.service.JournalEntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class JournalEntryServiceImpl implements JournalEntryService {

    private final JournalEntryRepository repository;
    private final AccountRepository accountRepository;
    private final AccountService accountService;

    @Override
    public JournalEntryResponse create(Long tenantId, CreateJournalEntryRequest request) {
        if (request.lines() == null || request.lines().isEmpty()) {
            throw new IllegalArgumentException("Journal entry must contain at least two lines");
        }

        BigDecimal debit = request.lines().stream()
                .map(JournalEntryLineRequest::debit)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal credit = request.lines().stream()
                .map(JournalEntryLineRequest::credit)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (debit.compareTo(credit) != 0 || debit.signum() == 0) {
            throw new UnbalancedJournalException("Journal entry debit and credit totals must be equal and greater than zero");
        }

        // Ensure tenant has standard accounts initialized if new
        accountService.initDefaultAccountsIfEmpty(tenantId);

        // Validate that every journal line references a valid active account in this tenant
        for (JournalEntryLineRequest line : request.lines()) {
            if (line.accountCode() == null || line.accountCode().trim().isEmpty()) {
                throw new IllegalArgumentException("Line account code cannot be empty");
            }
            String code = line.accountCode().trim();
            Account account = accountRepository.findByTenantIdAndCodeIgnoreCase(tenantId, code)
                    .orElseThrow(() -> new AccountNotFoundException("Account code '" + code + "' not found for this tenant. Please register it in Chart of Accounts first."));

            if (!account.isActive()) {
                throw new InactiveAccountException("Account '" + code + "' (" + account.getName() + ") is inactive and cannot be used in new journal entries.");
            }
        }

        JournalEntry entry = JournalEntry.builder()
                .tenantId(tenantId)
                .entryNumber("JV-" + System.currentTimeMillis())
                .entryDate(request.entryDate())
                .description(request.description() != null ? request.description().trim() : "")
                .reference(request.reference())
                .status(JournalStatus.POSTED)
                .build();

        for (JournalEntryLineRequest line : request.lines()) {
            String code = line.accountCode().trim();
            Account account = accountRepository.findByTenantIdAndCodeIgnoreCase(tenantId, code).orElse(null);
            String resolvedName = (line.accountName() != null && !line.accountName().trim().isEmpty())
                    ? line.accountName().trim()
                    : (account != null ? account.getName() : code);

            entry.getLines().add(JournalEntryLine.builder()
                    .journalEntry(entry)
                    .accountCode(code)
                    .accountName(resolvedName)
                    .debit(line.debit() != null ? line.debit() : BigDecimal.ZERO)
                    .credit(line.credit() != null ? line.credit() : BigDecimal.ZERO)
                    .build());
        }

        return response(repository.save(entry));
    }

    @Override
    @Transactional(readOnly = true)
    public List<JournalEntryResponse> all(Long tenantId) {
        return repository.findByTenantIdOrderByEntryDateDescIdDesc(tenantId).stream().map(this::response).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public JournalEntryResponse getById(Long tenantId, Long id) {
        JournalEntry entry = repository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new com.cubeage.erp.finance.exception.JournalEntryNotFoundException(
                        "Journal entry with ID " + id + " not found for this tenant"
                ));
        return response(entry);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JournalEntryResponse> search(Long tenantId, java.time.LocalDate startDate, java.time.LocalDate endDate, String search, String accountCode, String status) {
        JournalStatus journalStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                journalStatus = JournalStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }
        java.time.LocalDate effectiveStart = (startDate != null) ? startDate : java.time.LocalDate.of(1970, 1, 1);
        java.time.LocalDate effectiveEnd = (endDate != null) ? endDate : java.time.LocalDate.of(2099, 12, 31);

        List<JournalEntry> entries;
        if (journalStatus != null) {
            entries = repository.findByTenantIdAndStatusAndEntryDateBetweenOrderByEntryDateDescIdDesc(
                    tenantId, journalStatus, effectiveStart, effectiveEnd
            );
        } else {
            entries = repository.findByTenantIdAndEntryDateBetweenOrderByEntryDateDescIdDesc(
                    tenantId, effectiveStart, effectiveEnd
            );
        }

        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim().toLowerCase(java.util.Locale.ROOT) : null;
        String cleanAccount = (accountCode != null && !accountCode.trim().isEmpty()) ? accountCode.trim() : null;

        if (cleanSearch != null || cleanAccount != null) {
            entries = entries.stream().filter(j -> {
                boolean matchSearch = true;
                if (cleanSearch != null) {
                    boolean num = j.getEntryNumber() != null && j.getEntryNumber().toLowerCase(java.util.Locale.ROOT).contains(cleanSearch);
                    boolean ref = j.getReference() != null && j.getReference().toLowerCase(java.util.Locale.ROOT).contains(cleanSearch);
                    boolean desc = j.getDescription() != null && j.getDescription().toLowerCase(java.util.Locale.ROOT).contains(cleanSearch);
                    matchSearch = num || ref || desc;
                }
                boolean matchAccount = true;
                if (cleanAccount != null) {
                    matchAccount = j.getLines().stream().anyMatch(l -> l.getAccountCode() != null && l.getAccountCode().equalsIgnoreCase(cleanAccount));
                }
                return matchSearch && matchAccount;
            }).toList();
        }

        return entries.stream().map(this::response).toList();
    }

    private JournalEntryResponse response(JournalEntry entry) {
        List<JournalEntryLineRequest> lines = entry.getLines().stream()
                .map(line -> new JournalEntryLineRequest(line.getAccountCode(), line.getAccountName(), line.getDebit(), line.getCredit()))
                .toList();
        BigDecimal debit = lines.stream().map(JournalEntryLineRequest::debit).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal credit = lines.stream().map(JournalEntryLineRequest::credit).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new JournalEntryResponse(
                entry.getId(),
                entry.getEntryNumber(),
                entry.getEntryDate(),
                entry.getDescription(),
                entry.getReference(),
                entry.getStatus().name(),
                debit,
                credit,
                lines
        );
    }
}
