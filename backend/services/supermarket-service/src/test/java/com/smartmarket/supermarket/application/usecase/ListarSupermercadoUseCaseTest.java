package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.domain.repository.SupermercadoDomainRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ListarSupermercadoUseCaseTest {

    @Mock
    private SupermercadoDomainRepository repository;

    @InjectMocks
    private ListarSupermercadoUseCase listarSupermercadoUseCase;

    @Test
    void shouldReturnSupermarketList_WhenSearchingAll() {
        // Arrange
        Supermercado supermercado = new Supermercado();
        when(repository.findAll(0, 20)).thenReturn(Collections.singletonList(supermercado));

        // Act
        List<Supermercado> result = listarSupermercadoUseCase.buscarTodos(0, 20);

        // Assert
        assertThat(result).hasSize(1);
        verify(repository).findAll(0, 20);
    }

    @Test
    void shouldReturnSupermarket_WhenIdExists() {
        // Arrange
        UUID id = UUID.randomUUID();
        Supermercado supermercado = new Supermercado();
        supermercado.setId(id);
        
        when(repository.findById(id)).thenReturn(Optional.of(supermercado));

        // Act
        Supermercado result = listarSupermercadoUseCase.buscarPorId(id);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(id);
    }

    @Test
    void shouldThrowException_WhenIdDoesNotExist() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> listarSupermercadoUseCase.buscarPorId(id))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Supermercado não encontrado");
    }

    @Test
    void shouldReturnSupermarkets_WhenSearchingByGestorId() {
        // Arrange
        UUID gestorId = UUID.randomUUID();
        Supermercado supermercado = new Supermercado();
        supermercado.setGestorId(gestorId);
        
        when(repository.findByGestorId(gestorId)).thenReturn(Collections.singletonList(supermercado));

        // Act
        List<Supermercado> result = listarSupermercadoUseCase.buscarPorGestorId(gestorId);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getGestorId()).isEqualTo(gestorId);
    }
}
