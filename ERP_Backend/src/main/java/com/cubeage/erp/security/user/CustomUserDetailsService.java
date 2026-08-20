package com.cubeage.erp.security.user;

import com.cubeage.erp.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String[] identity = username.split(":", 2);
        if (identity.length != 2) {
            throw new UsernameNotFoundException("Username must use tenantId:email format");
        }
        Long tenantId;
        try {
            tenantId = Long.valueOf(identity[0]);
        } catch (NumberFormatException exception) {
            throw new UsernameNotFoundException("Invalid tenant identity");
        }
        return userRepository.findByTenantIdAndEmailIgnoreCase(tenantId, identity[1])
                .filter(user -> Boolean.TRUE.equals(user.getActive()))
                .map(UserPrincipal::from)
                .orElseThrow(() -> new UsernameNotFoundException("Active user not found"));
    }

    public UserPrincipal loadById(Long id) {
        return userRepository.findById(id)
                .filter(user -> Boolean.TRUE.equals(user.getActive()))
                .map(UserPrincipal::from)
                .orElseThrow(() -> new UsernameNotFoundException("Active user not found"));
    }

}
