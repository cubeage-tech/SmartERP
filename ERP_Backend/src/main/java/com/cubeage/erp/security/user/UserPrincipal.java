package com.cubeage.erp.security.user;

import com.cubeage.erp.admin.entity.Permission;
import com.cubeage.erp.admin.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
public class UserPrincipal implements UserDetails {

    private final Long id;
    private final Long tenantId;
    private final String name;
    private final String username;
    private final String password;
    private final boolean active;
    private final Set<GrantedAuthority> authorities;

    private UserPrincipal(Long id, Long tenantId, String name, String username,
                          String password, boolean active, Set<GrantedAuthority> authorities) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.username = username;
        this.password = password;
        this.active = active;
        this.authorities = authorities;
    }

    public static UserPrincipal from(User user) {
        Set<GrantedAuthority> authorities = new LinkedHashSet<>();
        user.getRoles().forEach(role -> {
            String roleName = role.getName().toUpperCase().replace(' ', '_');
            authorities.add(new SimpleGrantedAuthority("ROLE_" + roleName));
            role.getPermissions().forEach(permission ->
                    authorities.add(new SimpleGrantedAuthority(permissionCode(permission))));
        });
        return new UserPrincipal(user.getId(), user.getTenantId(), user.getName(),
                user.getEmail(), user.getPasswordHash(), Boolean.TRUE.equals(user.getActive()), authorities);
    }

    private static String permissionCode(Permission permission) {
        return permission.getModule().toUpperCase() + "_" + permission.getAction().name()
                + "_" + permission.getScope().name();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return active; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return active; }

}
