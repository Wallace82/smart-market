package com.smartmarket.client.application.usecase;

import com.smartmarket.client.domain.model.Cliente;
import com.smartmarket.client.domain.model.ClienteStatus;
import com.smartmarket.client.application.port.out.ClienteDomainRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CadastrarClienteUseCaseTest {

    @Mock
    private ClienteDomainRepository clienteRepository;

    @InjectMocks
    private CadastrarClienteUseCase cadastrarClienteUseCase;

    @Test
    void shouldRegisterClient_WhenDataIsValid() {
        // Arrange
        Cliente cliente = new Cliente();
        cliente.setAuthUserId(UUID.randomUUID());
        cliente.setNome("Jane Doe");
        cliente.setCpf("12345678900");
        cliente.setTelefone("11999999999");

        when(clienteRepository.existsByCpf(cliente.getCpf())).thenReturn(false);
        when(clienteRepository.save(any(Cliente.class))).thenAnswer(i -> {
            Cliente c = i.getArgument(0);
            c.setId(UUID.randomUUID()); // mock the DB saving and giving an ID
            return c;
        });

        // Act
        Cliente saved = cadastrarClienteUseCase.execute(cliente);

        // Assert
        assertThat(saved).isNotNull();
        assertThat(saved.getId()).isNotNull(); // Generated during save
        assertThat(saved.getCriadoEm()).isNotNull();
        assertThat(saved.getAtualizadoEm()).isNotNull();
        assertThat(saved.getStatus()).isEqualTo(ClienteStatus.ATIVO); // Default status
        verify(clienteRepository).save(cliente);
    }

    @Test
    void shouldThrowException_WhenCpfAlreadyExists() {
        // Arrange
        Cliente cliente = new Cliente();
        cliente.setCpf("12345678900");

        when(clienteRepository.existsByCpf(cliente.getCpf())).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> cadastrarClienteUseCase.execute(cliente))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("CPF já cadastrado");

        verify(clienteRepository, never()).save(any());
    }
}
