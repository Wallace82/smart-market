package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.application.port.out.SupermercadoDomainRepository;
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
class AtualizarSupermercadoUseCaseTest {

    @Mock
    private SupermercadoDomainRepository repository;

    @InjectMocks
    private AtualizarSupermercadoUseCase atualizarSupermercadoUseCase;

    @Test
    void shouldUpdateSupermarket_WhenIdExists() {
        // Arrange
        UUID id = UUID.randomUUID();
        Supermercado existente = new Supermercado();
        existente.setId(id);
        existente.setNomeFantasia("Antigo Nome");

        Supermercado atualizado = new Supermercado();
        atualizado.setNomeFantasia("Novo Nome");

        when(repository.findById(id)).thenReturn(Optional.of(existente));
        when(repository.save(any(Supermercado.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Supermercado result = atualizarSupermercadoUseCase.execute(id, atualizado);

        // Assert
        assertThat(result.getNomeFantasia()).isEqualTo("Novo Nome");
        assertThat(result.getAtualizadoEm()).isNotNull();
        verify(repository).save(existente);
    }

    @Test
    void shouldThrowException_WhenIdDoesNotExist() {
        // Arrange
        UUID id = UUID.randomUUID();
        Supermercado atualizado = new Supermercado();

        when(repository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> atualizarSupermercadoUseCase.execute(id, atualizado))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Supermercado não encontrado");

        verify(repository, never()).save(any());
    }
}

