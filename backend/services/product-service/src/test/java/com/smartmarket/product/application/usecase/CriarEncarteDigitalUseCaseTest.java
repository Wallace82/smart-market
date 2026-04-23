package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.model.EncarteItem;
import com.smartmarket.product.domain.model.EncarteStatus;
import com.smartmarket.product.domain.model.OfertaSupermercado;
import com.smartmarket.product.application.port.out.EncarteDigitalDomainRepository;
import com.smartmarket.product.application.port.out.OfertaSupermercadoDomainRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CriarEncarteDigitalUseCaseTest {

    @Mock
    private EncarteDigitalDomainRepository encarteDigitalRepository;

    @Mock
    private OfertaSupermercadoDomainRepository ofertaSupermercadoRepository;

    @InjectMocks
    private CriarEncarteDigitalUseCase criarEncarteDigitalUseCase;

    @Test
    void shouldCreateEncarte_WhenDataIsValid() {
        // Arrange
        UUID supermercadoId = UUID.randomUUID();
        EncarteDigital encarte = new EncarteDigital();
        encarte.setSupermercadoId(supermercadoId);
        encarte.setTitulo("Ofertas de Fim de Ano");

        when(encarteDigitalRepository.save(any(EncarteDigital.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        EncarteDigital saved = criarEncarteDigitalUseCase.execute(encarte);

        // Assert
        assertThat(saved).isNotNull();
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getCriadoEm()).isNotNull();
        assertThat(saved.getAtualizadoEm()).isNotNull();
        assertThat(saved.getStatus()).isEqualTo(EncarteStatus.RASCUNHO);
        verify(encarteDigitalRepository).save(encarte);
    }

    @Test
    void shouldThrowException_WhenOfferDoesNotExist() {
        // Arrange
        UUID ofertaId = UUID.randomUUID();
        
        EncarteItem item = new EncarteItem();
        item.setOfertaId(ofertaId);
        
        EncarteDigital encarte = new EncarteDigital();
        encarte.setItens(Collections.singletonList(item));

        when(ofertaSupermercadoRepository.findById(ofertaId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> criarEncarteDigitalUseCase.execute(encarte))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Oferta com ID " + ofertaId + " não encontrada");

        verify(encarteDigitalRepository, never()).save(any());
    }
    
    @Test
    void shouldCreateEncarte_WithItems_WhenOffersExist() {
        // Arrange
        UUID ofertaId = UUID.randomUUID();
        
        EncarteItem item = new EncarteItem();
        item.setOfertaId(ofertaId);
        
        EncarteDigital encarte = new EncarteDigital();
        encarte.setItens(Collections.singletonList(item));

        when(ofertaSupermercadoRepository.findById(ofertaId)).thenReturn(Optional.of(new OfertaSupermercado()));
        when(encarteDigitalRepository.save(any(EncarteDigital.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        EncarteDigital saved = criarEncarteDigitalUseCase.execute(encarte);

        // Assert
        assertThat(saved).isNotNull();
        assertThat(saved.getItens().get(0).getEncarteId()).isEqualTo(saved.getId());
        verify(ofertaSupermercadoRepository).findById(ofertaId);
        verify(encarteDigitalRepository).save(encarte);
    }
}
