package com.cubeage.erp.settings.service;
import com.cubeage.erp.settings.dto.general.*;
import com.cubeage.erp.settings.entity.GeneralSettings;
import com.cubeage.erp.settings.mapper.SettingsMapper;
import com.cubeage.erp.settings.repository.GeneralSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Locale;
@Service @RequiredArgsConstructor @Transactional
public class GeneralSettingsService {
    private final GeneralSettingsRepository repository; private final SettingsMapper mapper;
    @Transactional(readOnly=true) public GeneralSettingsResponse get(Long tenantId) { return mapper.general(repository.findByTenantId(tenantId).orElseGet(() -> defaults(tenantId))); }
    public GeneralSettingsResponse update(Long tenantId, GeneralSettingsRequest r) {
        GeneralSettings s=repository.findByTenantId(tenantId).orElseGet(() -> defaults(tenantId));
        s.setCompanyName(r.companyName().trim());
        s.setLegalName(normalize(r.legalName()));
        s.setGstin(upper(r.gstin()));
        s.setPan(upper(r.pan()));
        s.setIndustry(normalize(r.industry()));
        s.setCurrency(r.currency().toUpperCase(Locale.ROOT));
        s.setTimezone(r.timezone().trim());
        s.setLocale(r.locale().trim());
        s.setDateFormat(r.dateFormat().trim());
        s.setFiscalYearStartMonth(r.fiscalYearStartMonth());
        s.setStreetAddress(normalize(r.streetAddress()));
        s.setCity(normalize(r.city()));
        s.setState(normalize(r.state()));
        s.setPinCode(normalize(r.pinCode()));
        return mapper.general(repository.save(s));
    }
    private GeneralSettings defaults(Long tenantId) { return GeneralSettings.builder().tenantId(tenantId).companyName("SmartERP Company")
            .currency("INR").timezone("Asia/Kolkata").locale("en-IN").dateFormat("dd/MM/yyyy").fiscalYearStartMonth(4).build(); }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String upper(String value) {
        String normalized = normalize(value);
        return normalized == null ? null : normalized.toUpperCase(Locale.ROOT);
    }
}
