package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.model.EncarteStatus;
import com.smartmarket.product.application.port.out.EncarteDigitalDomainRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Testes do AlterarStatusEncarteDigitalUseCase.
 *
 * Ciclo de vida do Encarte (RF-05.5): RASCUNHO → ATIVO → ENCERRADO
 */
@ExtendWith(MockitoExtension.class)
class AlterarStatusEncarteDigitalUseCaseTest {

    @Mock
    private EncarteDigitalDomainRepository repository;

    @InjectMocks
    private AlterarStatusEncarteDigitalUseCase useCase;

    @Test
    void shouldPublishEncarte_WhenRascunhoTransitionsToAtivo() {
        // Arrange
        UUID id = UUID.randomUUID();
        EncarteDigital encarte = new EncarteDigital();
        encarte.setId(id);
        encarte.setStatus(EncarteStatus.RASCUNHO);

        when(repository.findById(id)).thenReturn(Optional.of(encarte));
        when(repository.save(any(EncarteDigital.class))).thenAnswer(i -> i.getArgument(0));

        // Act — RASCUNHO → ATIVO (publicar encarte, RF-05.5)
        EncarteDigital result = useCase.execute(id, EncarteStatus.ATIVO);

        // Assert
        assertThat(result.getStatus()).isEqualTo(EncarteStatus.ATIVO);
        assertThat(result.getAtualizadoEm()).isNotNull();
        verify(repository).findById(id);
        verify(repository).save(encarte);
    }

    @Test
    void shouldCloseEncarte_WhenAtivoTransitionsToEncerrado() {
        // Arrange
        UUID id = UUID.randomUUID();
        EncarteDigital encarte = new EncarteDigital();
        encarte.setId(id);
        encarte.setStatus(EncarteStatus.ATIVO);

        when(repository.findById(id)).thenReturn(Optional.of(encarte));
        when(repository.save(any(EncarteDigital.class))).thenAnswer(i -> i.getArgument(0));

        // Act — ATIVO → ENCERRADO (encerrar encarte, RF-05.5)
        EncarteDigital result = useCase.execute(id, EncarteStatus.ENCERRADO);

        // Assert
        assertThat(result.getStatus()).isEqualTo(EncarteStatus.ENCERRADO);
        assertThat(result.getAtualizadoEm()).isNotNull();
        verify(repository).findById(id);
        verify(repository).save(encarte);
    }

    @Test
    void shouldThrowException_WhenTransitionIsInvalid() {
        // Arrange — RASCUNHO não pode ir direto para ENCERRADO (RF-05.5)
        UUID id = UUID.randomUUID();
        EncarteDigital encarte = new EncarteDigital();
        encarte.setId(id);
        encarte.setStatus(EncarteStatus.RASCUNHO);

        when(repository.findById(id)).thenReturn(Optional.of(encarte));

        // Act & Assert
        assertThatThrownBy(() -> useCase.execute(id, EncarteStatus.ENCERRADO))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Transição inválida");

        verify(repository).findById(id);
        verify(repository, never()).save(any());
    }

    @Test
    void shouldThrowException_WhenEncarteIsAlreadyEncerrado() {
        // Arrange — ENCERRADO é status terminal
        UUID id = UUID.randomUUID();
        EncarteDigital encarte = new EncarteDigital();
        encarte.setId(id);
        encarte.setStatus(EncarteStatus.ENCERRADO);

        when(repository.findById(id)).thenReturn(Optional.of(encarte));

        // Act & Assert
        assertThatThrownBy(() -> useCase.execute(id, EncarteStatus.ATIVO))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Transição inválida");

        verify(repository).findById(id);
        verify(repository, never()).save(any());
    }
}

