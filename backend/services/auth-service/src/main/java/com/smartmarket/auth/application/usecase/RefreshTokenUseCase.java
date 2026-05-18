package com.smartmarket.auth.application.usecase;

import com.smartmarket.auth.application.dto.AuthTokenResponseDTO;
import com.smartmarket.auth.application.dto.RefreshTokenRequestDTO;
import com.smartmarket.auth.application.service.RefreshTokenService;
import com.smartmarket.auth.infrastructure.adapter.out.security.JwtUtils;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RefreshTokenUseCase {

    private final RefreshTokenService refreshTokenService;
    private final JwtUtils jwtUtils;

    public AuthTokenResponseDTO execute(RefreshTokenRequestDTO request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(token -> {
                    var user = token.getUsuario();
                    
                    List<String> roles = user.getPapeis().stream()
                            .map(p -> p.getNome().name())
                            .collect(Collectors.toList());

                    // Gera novo JWT manual (sem Authentication object)
                    String tokenStr = jwtUtils.generateTokenFromUsername(user.getEmail(), roles, user.getId());

                    return new AuthTokenResponseDTO(tokenStr, requestRefreshToken, jwtUtils.getJwtExpirationSecs());
                })
                .orElseThrow(() -> new RuntimeException("Refresh token não encontrado no banco!"));
    }
}
