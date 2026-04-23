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

@ExtendWith(MockitoExtension.class)
class AlterarStatusEncarteDigitalUseCaseTest {

    @Mock
    private EncarteDigitalDomainRepository repository;

    @InjectMocks
    private AlterarStatusEncarteDigitalUseCase useCase;

    @Test
    void shouldChangeStatus_WhenEncarteExists() {
        // Arrange
        UUID id = UUID.randomUUID();
        EncarteDigital encarte = new EncarteDigital();
        encarte.setId(id);
        encarte.setStatus(EncarteStatus.RASCUNHO);

        when(repository.findById(id)).thenReturn(Optional.of(encarte));
        when(repository.save(any(EncarteDigital.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        EncarteDigital result = useCase.execute(id, EncarteStatus.PUBLICADO);

        // Assert
        assertThat(result.getStatus()).isEqualTo(EncarteStatus.PUBLICADO);
        assertThat(result.getAtualizadoEm()).isNotNull();
        verify(repository).findById(id);
        verify(repository).save(encarte);
    }

    @Test
    void shouldThrowException_WhenEncarteDoesNotExist() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> useCase.execute(id, EncarteStatus.PUBLICADO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Encarte digital não encontrado com ID: " + id);

        verify(repository).findById(id);
        verify(repository, never()).save(any());
    }
}
