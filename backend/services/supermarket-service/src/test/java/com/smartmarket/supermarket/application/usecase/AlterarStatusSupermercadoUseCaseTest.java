package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.domain.model.SupermercadoStatus;
import com.smartmarket.supermarket.domain.repository.SupermercadoDomainRepository;
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

@ExtendWith(MockitoExtension.class)
class AlterarStatusSupermercadoUseCaseTest {

    @Mock
    private SupermercadoDomainRepository repository;

    @InjectMocks
    private AlterarStatusSupermercadoUseCase alterarStatusSupermercadoUseCase;

    @Test
    void shouldChangeStatus_WhenIdExists() {
        // Arrange
        UUID id = UUID.randomUUID();
        Supermercado supermercado = new Supermercado();
        supermercado.setId(id);
        supermercado.setStatus(SupermercadoStatus.PENDENTE);

        when(repository.findById(id)).thenReturn(Optional.of(supermercado));
        when(repository.save(any(Supermercado.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Supermercado result = alterarStatusSupermercadoUseCase.execute(id, SupermercadoStatus.ATIVO);

        // Assert
        assertThat(result.getStatus()).isEqualTo(SupermercadoStatus.ATIVO);
        assertThat(result.getAtualizadoEm()).isNotNull();
        verify(repository).save(supermercado);
    }

    @Test
    void shouldThrowException_WhenIdDoesNotExist() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> alterarStatusSupermercadoUseCase.execute(id, SupermercadoStatus.ATIVO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Supermercado não encontrado");

        verify(repository, never()).save(any());
    }
}
