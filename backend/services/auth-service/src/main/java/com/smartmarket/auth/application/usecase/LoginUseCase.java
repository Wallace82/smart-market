package com.smartmarket.auth.application.usecase;

import com.smartmarket.auth.application.dto.AuthTokenResponseDTO;
import com.smartmarket.auth.application.dto.LoginRequestDTO;
import com.smartmarket.auth.domain.model.Usuario;
import com.smartmarket.auth.application.port.out.UsuarioDomainRepository;
import com.smartmarket.auth.infrastructure.adapter.out.security.JwtUtils;
import com.smartmarket.auth.infrastructure.adapter.out.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
public class LoginUseCase {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UsuarioDomainRepository usuarioRepository;

    public LoginUseCase(AuthenticationManager authenticationManager, JwtUtils jwtUtils, UsuarioDomainRepository usuarioRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.usuarioRepository = usuarioRepository;
    }

    public AuthTokenResponseDTO execute(LoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Atualiza a data do último login
        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        usuario.setUltimoLoginEm(LocalDateTime.now());
        usuarioRepository.save(usuario);

        // Mock de refresh token para satisfazer o contrato
        String refreshToken = UUID.randomUUID().toString();

        return new AuthTokenResponseDTO(
                jwt,
                refreshToken,
                jwtUtils.getJwtExpirationSecs()
        );
    }
}


