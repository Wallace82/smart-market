package com.smartmarket.auth.application.usecase;

import com.smartmarket.auth.application.dto.RegistroUsuarioRequestDTO;
import com.smartmarket.auth.domain.model.Papel;
import com.smartmarket.auth.domain.model.PapelNome;
import com.smartmarket.auth.domain.model.Usuario;
import com.smartmarket.auth.application.port.out.PapelDomainRepository;
import com.smartmarket.auth.application.port.out.UsuarioDomainRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrarUsuarioUseCaseTest {

    @Mock
    private UsuarioDomainRepository usuarioRepository;

    @Mock
    private PapelDomainRepository papelRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private RegistrarUsuarioUseCase registrarUsuarioUseCase;

    @Test
    void shouldRegisterUser_WhenDataIsValid() {
        // Arrange
        RegistroUsuarioRequestDTO request = new RegistroUsuarioRequestDTO();
        request.setNome("John Doe");
        request.setEmail("john@example.com");
        request.setSenha("password");
        request.setPapel("ROLE_GESTOR");

        when(usuarioRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.getSenha())).thenReturn("encodedPassword");
        
        Papel papel = new Papel(null, PapelNome.ROLE_GESTOR, "Gestor");
        when(papelRepository.findByNome(PapelNome.ROLE_GESTOR)).thenReturn(Optional.of(papel));

        // Act
        registrarUsuarioUseCase.execute(request);

        // Assert
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void shouldThrowException_WhenEmailIsAlreadyInUse() {
        // Arrange
        RegistroUsuarioRequestDTO request = new RegistroUsuarioRequestDTO();
        request.setEmail("existing@example.com");

        when(usuarioRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(new Usuario()));

        // Act & Assert
        assertThatThrownBy(() -> registrarUsuarioUseCase.execute(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("E-mail já está em uso");

        verifyNoInteractions(passwordEncoder, papelRepository);
        verify(usuarioRepository, never()).save(any());
    }
}

