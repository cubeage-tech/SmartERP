package com.cubeage.erp.settings.service;

import com.cubeage.erp.settings.dto.general.*;
import com.cubeage.erp.settings.repository.GeneralSettingsRepository;
import com.cubeage.erp.settings.mapper.SettingsMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class GeneralSettingsServiceTest {

    private GeneralSettingsRepository repository;
    private GeneralSettingsService service;

    @BeforeEach
    void setUp() {
        repository = mock(GeneralSettingsRepository.class);
        when(repository.findByTenantId(4L)).thenReturn(Optional.empty());
        when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        service = new GeneralSettingsService(repository, new SettingsMapper());
    }

    @Test
    void updateMapsTheCompanyInformationAndAddressDesignFields() {
        GeneralSettingsRequest request = new GeneralSettingsRequest(
                "Acme Manufacturing Ltd",
                "Acme Manufacturing Private Limited",
                "27aadca3129h1zx",
                "aadca3129h",
                "Manufacturing",
                "INR",
                "Asia/Kolkata",
                "en-IN",
                "dd/MM/yyyy",
                4,
                "Plot 14, MIDC Industrial Area",
                "Pune",
                "Maharashtra",
                "411019"
        );

        GeneralSettingsResponse response = service.update(4L, request);

        assertEquals("27AADCA3129H1ZX", response.gstin());
        assertEquals("AADCA3129H", response.pan());
        assertEquals("April – March", response.fiscalYearLabel());
        assertEquals("Plot 14, MIDC Industrial Area", response.streetAddress());
        assertEquals("Pune", response.city());
        assertEquals("Maharashtra", response.state());
        assertEquals("411019", response.pinCode());
        verify(repository).save(any());
    }
}
