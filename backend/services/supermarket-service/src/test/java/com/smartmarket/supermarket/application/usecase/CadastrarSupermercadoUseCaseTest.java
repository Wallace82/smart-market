package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.domain.model.SupermercadoStatus;
import com.smartmarket.supermarket.application.port.out.SupermercadoDomainRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CadastrarSupermercadoUseCaseTest {

    @Mock
    private SupermercadoDomainRepository repository;

    @InjectMocks
    private CadastrarSupermercadoUseCase cadastrarSupermercadoUseCase;

    @Test
    void shouldCreateSupermarket_WhenDataIsValid() {
        // Arrange
        Supermercado supermercado = new Supermercado();
        supermercado.setCnpj("12345678000199");
        supermercado.setNomeFantasia("Mercado Teste");

        when(repository.existsByCnpj(supermercado.getCnpj())).thenReturn(false);
        when(repository.save(any(Supermercado.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Supermercado result = cadastrarSupermercadoUseCase.execute(supermercado);

        // Assert
        assertThat(result.getId()).isNotNull();
        assertThat(result.getStatus()).isEqualTo(SupermercadoStatus.PENDENTE);
        assertThat(result.getCriadoEm()).isNotNull();
        assertThat(result.getAtualizadoEm()).isNotNull();
        
        verify(repository).save(any(Supermercado.class));
    }

    @Test
    void shouldThrowException_WhenCnpjAlreadyExists() {
        // Arrange
        Supermercado supermercado = new Supermercado();
        supermercado.setCnpj("12345678000199");

        when(repository.existsByCnpj(supermercado.getCnpj())).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> cadastrarSupermercadoUseCase.execute(supermercado))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Já existe um supermercado cadastrado com este CNPJ");

        verify(repository, never()).save(any());
    }
}

