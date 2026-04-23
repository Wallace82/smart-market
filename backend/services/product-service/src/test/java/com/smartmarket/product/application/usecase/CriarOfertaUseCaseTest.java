package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.OfertaSupermercado;
import com.smartmarket.product.domain.model.ProdutoBase;
import com.smartmarket.product.application.port.out.OfertaDomainRepository;
import com.smartmarket.product.application.port.out.ProdutoBaseDomainRepository;
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
class CriarOfertaUseCaseTest {

    @Mock
    private OfertaDomainRepository ofertaRepository;

    @Mock
    private ProdutoBaseDomainRepository produtoRepository;

    @InjectMocks
    private CriarOfertaUseCase useCase;

    @Test
    void shouldCreateOferta_WhenDataIsValid() {
        // Arrange
        UUID supermercadoId = UUID.randomUUID();
        UUID produtoBaseId = UUID.randomUUID();
        ProdutoBase produtoBase = new ProdutoBase();
        produtoBase.setId(produtoBaseId);
        
        OfertaSupermercado oferta = new OfertaSupermercado();
        oferta.setPrecoAtual(java.math.BigDecimal.valueOf(10.0));

        when(produtoRepository.findById(produtoBaseId)).thenReturn(Optional.of(produtoBase));
        when(ofertaRepository.existsBySupermercadoIdAndProdutoBaseIdAndAtivoTrue(supermercadoId, produtoBaseId)).thenReturn(false);
        when(ofertaRepository.save(any(OfertaSupermercado.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        OfertaSupermercado result = useCase.execute(supermercadoId, produtoBaseId, oferta);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isNotNull();
        assertThat(result.getSupermercadoId()).isEqualTo(supermercadoId);
        assertThat(result.getProdutoBase()).isEqualTo(produtoBase);
        assertThat(result.isAtivo()).isTrue();
        assertThat(result.getCriadoEm()).isNotNull();
        verify(produtoRepository).findById(produtoBaseId);
        verify(ofertaRepository).existsBySupermercadoIdAndProdutoBaseIdAndAtivoTrue(supermercadoId, produtoBaseId);
        verify(ofertaRepository).save(oferta);
    }

    @Test
    void shouldThrowException_WhenProdutoBaseDoesNotExist() {
        // Arrange
        UUID supermercadoId = UUID.randomUUID();
        UUID produtoBaseId = UUID.randomUUID();
        when(produtoRepository.findById(produtoBaseId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> useCase.execute(supermercadoId, produtoBaseId, new OfertaSupermercado()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Produto Base não encontrado.");

        verify(ofertaRepository, never()).save(any());
    }

    @Test
    void shouldThrowException_WhenActiveOfertaAlreadyExists() {
        // Arrange
        UUID supermercadoId = UUID.randomUUID();
        UUID produtoBaseId = UUID.randomUUID();
        ProdutoBase produtoBase = new ProdutoBase();
        
        when(produtoRepository.findById(produtoBaseId)).thenReturn(Optional.of(produtoBase));
        when(ofertaRepository.existsBySupermercadoIdAndProdutoBaseIdAndAtivoTrue(supermercadoId, produtoBaseId)).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> useCase.execute(supermercadoId, produtoBaseId, new OfertaSupermercado()))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Já existe uma oferta ativa para este produto neste supermercado.");

        verify(ofertaRepository, never()).save(any());
    }
}
