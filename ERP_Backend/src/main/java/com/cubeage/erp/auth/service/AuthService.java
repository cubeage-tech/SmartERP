package com.cubeage.erp.auth.service;

import com.cubeage.erp.admin.repository.UserRepository;
import com.cubeage.erp.auth.dto.ChangePasswordRequest;
import com.cubeage.erp.auth.dto.LoginRequest;
import com.cubeage.erp.auth.dto.LoginResponse;
import com.cubeage.erp.auth.dto.RefreshTokenRequest;
import com.cubeage.erp.auth.entity.RefreshToken;
import com.cubeage.erp.auth.repository.RefreshTokenRepository;
import com.cubeage.erp.common.exception.BadRequestException;
import com.cubeage.erp.common.exception.UnauthorizedException;
import com.cubeage.erp.security.jwt.JwtService;
import com.cubeage.erp.security.user.CustomUserDetailsService;
import com.cubeage.erp.security.user.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.security.jwt.expiration-ms:3600000}")
    private long accessTokenExpiryMs;

    @Value("${app.security.refresh-token.expiration-ms:604800000}")
    private long refreshTokenExpiryMs;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        UserPrincipal principal = (UserPrincipal) userDetailsService
                .loadUserByUsername(request.getTenantId() + ":" + request.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), principal.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String accessToken = jwtService.generateToken(principal);
        String refreshToken = createRefreshToken(principal.getId(), principal.getTenantId());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiryMs / 1000)
                .userId(principal.getId())
                .tenantId(principal.getTenantId())
                .name(principal.getName())
                .email(principal.getUsername())
                .build();
    }

    @Transactional
    public LoginResponse refresh(RefreshTokenRequest request) {
        RefreshToken stored = refreshTokenRepository
                .findByTokenAndRevokedFalse(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired refresh token"));

        if (stored.getExpiresAt().isBefore(Instant.now())) {
            stored.setRevoked(true);
            throw new UnauthorizedException("Refresh token expired");
        }

        stored.setRevoked(true);

        UserPrincipal principal = userDetailsService.loadById(stored.getUserId());
        String accessToken = jwtService.generateToken(principal);
        String newRefreshToken = createRefreshToken(principal.getId(), principal.getTenantId());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiryMs / 1000)
                .userId(principal.getId())
                .tenantId(principal.getTenantId())
                .name(principal.getName())
                .email(principal.getUsername())
                .build();
    }

    @Transactional
    public void logout(UserPrincipal principal) {
        refreshTokenRepository.revokeAllByUserId(principal.getId());
    }

    @Transactional
    public void changePassword(UserPrincipal principal, ChangePasswordRequest request) {
        var user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        refreshTokenRepository.revokeAllByUserId(user.getId());
    }

    private String createRefreshToken(Long userId, Long tenantId) {
        RefreshToken token = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .userId(userId)
                .tenantId(tenantId)
                .expiresAt(Instant.now().plusMillis(refreshTokenExpiryMs))
                .build();
        return refreshTokenRepository.save(token).getToken();
    }
}
