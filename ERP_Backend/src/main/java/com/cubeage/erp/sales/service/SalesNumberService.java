package com.cubeage.erp.sales.service;

import com.cubeage.erp.sales.entity.SalesDocumentSequence;
import com.cubeage.erp.sales.enums.SalesDocumentType;
import com.cubeage.erp.sales.repository.SalesDocumentSequenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;

@Service
@RequiredArgsConstructor
public class SalesNumberService {

    private final SalesDocumentSequenceRepository repository;

    @Transactional
    public String next(Long tenantId, SalesDocumentType documentType) {
        int year = Year.now().getValue();
        SalesDocumentSequence sequence = repository
                .findForUpdate(tenantId, documentType, year)
                .orElseGet(() -> repository.saveAndFlush(
                        SalesDocumentSequence.builder()
                                .tenantId(tenantId)
                                .documentType(documentType)
                                .documentYear(year)
                                .nextValue(1L)
                                .build()
                ));

        long value = sequence.getNextValue();
        sequence.setNextValue(value + 1);
        repository.save(sequence);

        return "%s-%d-%04d".formatted(documentType.getPrefix(), year, value);
    }
}
