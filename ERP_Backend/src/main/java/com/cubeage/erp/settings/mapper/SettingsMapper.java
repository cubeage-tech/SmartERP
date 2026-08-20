package com.cubeage.erp.settings.mapper;
import com.cubeage.erp.settings.dto.general.GeneralSettingsResponse;
import com.cubeage.erp.settings.dto.module.ModuleSettingResponse;
import com.cubeage.erp.settings.dto.notification.NotificationPreferenceResponse;
import com.cubeage.erp.settings.dto.security.*;
import com.cubeage.erp.settings.entity.*;
import org.springframework.stereotype.Component;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.Locale;
@Component
public class SettingsMapper {
    public GeneralSettingsResponse general(GeneralSettings settings) {
        return new GeneralSettingsResponse(
                settings.getId(),
                settings.getTenantId(),
                settings.getCompanyName(),
                settings.getLegalName(),
                settings.getGstin(),
                settings.getPan(),
                settings.getIndustry(),
                settings.getFiscalYearStartMonth(),
                fiscalYearLabel(settings.getFiscalYearStartMonth()),
                settings.getCurrency(),
                settings.getTimezone(),
                settings.getLocale(),
                settings.getDateFormat(),
                settings.getStreetAddress(),
                settings.getCity(),
                settings.getState(),
                settings.getPinCode(),
                settings.getUpdatedAt()
        );
    }
    public NotificationPreferenceResponse notification(NotificationPreference p) { return new NotificationPreferenceResponse(p.getId(),p.getUserId(),p.getType(),Boolean.TRUE.equals(p.getEmailEnabled()),Boolean.TRUE.equals(p.getInAppEnabled()),Boolean.TRUE.equals(p.getSmsEnabled())); }
    public ModuleSettingResponse module(ModuleSetting s) { return new ModuleSettingResponse(s.getId(),s.getModule(),Boolean.TRUE.equals(s.getEnabled()),s.getConfigJson(),s.getUpdatedAt()); }
    public SecuritySettingsResponse security(SecuritySetting s) { return new SecuritySettingsResponse(s.getId(),Boolean.TRUE.equals(s.getMfaRequired()),s.getMinimumPasswordLength(),s.getPasswordExpiryDays(),s.getMaxLoginAttempts(),s.getSessionTimeoutMinutes(),Boolean.TRUE.equals(s.getIpRestrictionEnabled()),s.getUpdatedAt()); }
    public AuditLogResponse audit(AuditLog a) { return new AuditLogResponse(a.getId(),a.getActorUserId(),a.getAction(),a.getModule(),a.getEntityType(),a.getEntityId(),a.getDetails(),a.getIpAddress(),a.getCreatedAt()); }

    private String fiscalYearLabel(Integer startMonth) {
        if (startMonth == null) {
            return null;
        }
        Month start = Month.of(startMonth);
        Month end = start.minus(1);
        return start.getDisplayName(TextStyle.FULL, Locale.ENGLISH)
                + " – "
                + end.getDisplayName(TextStyle.FULL, Locale.ENGLISH);
    }
}
