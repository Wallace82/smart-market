package com.smartmarket.auth.application.usecase;

import com.smartmarket.auth.application.dto.AuthTokenResponseDTO;
import com.smartmarket.auth.application.dto.LoginRequestDTO;
import com.smartmarket.auth.domain.model.Usuario;
import com.smartmarket.auth.application.port.out.UsuarioDomainRepository;
import com.smartmarket.auth.infrastructure.adapter.out.security.JwtUtils;
import com.smartmarket.auth.infrastructure.adapter.out.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoginUseCaseTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UsuarioDomainRepository usuarioRepository;

    @InjectMocks
    private LoginUseCase loginUseCase;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldReturnAuthToken_WhenCredentialsAreValid() {
        // Arrange
        LoginRequestDTO request = new LoginRequestDTO("test@smartmarket.com", "password");
        
        Usuario usuario = new Usuario();
        usuario.setId(UUID.randomUUID());
        usuario.setEmail(request.getEmail());
        
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_CLIENTE");
        UserDetailsImpl userDetails = new UserDetailsImpl(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getSenhaHash(),
                usuario.getStatus(),
                Collections.singletonList(authority)
        );

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
                
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("mocked-jwt");
        when(jwtUtils.getJwtExpirationSecs()).thenReturn(3600L);
        
        when(usuarioRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(usuario));

        // Act
        AuthTokenResponseDTO response = loginUseCase.execute(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("mocked-jwt");
        assertThat(response.getExpiresIn()).isEqualTo(3600L);
        assertThat(response.getRefreshToken()).isNotNull();
        
        verify(usuarioRepository).save(usuario);
        assertThat(usuario.getUltimoLoginEm()).isNotNull();
    }

    @Test
    void shouldThrowException_WhenCredentialsAreInvalid() {
        // Arrange
        LoginRequestDTO request = new LoginRequestDTO("test@smartmarket.com", "wrongpassword");
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        assertThatThrownBy(() -> loginUseCase.execute(request))
                .isInstanceOf(BadCredentialsException.class);
                
        verifyNoInteractions(jwtUtils, usuarioRepository);
    }
}

