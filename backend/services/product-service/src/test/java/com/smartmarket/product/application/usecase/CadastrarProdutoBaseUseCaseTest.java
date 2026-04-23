package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.ProdutoBase;
import com.smartmarket.product.application.port.out.ProdutoBaseDomainRepository;
import com.smartmarket.product.infrastructure.adapter.out.storage.ImageStorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CadastrarProdutoBaseUseCaseTest {

    @Mock
    private ProdutoBaseDomainRepository produtoRepository;

    @Mock
    private ImageStorageService imageStorageService;

    @InjectMocks
    private CadastrarProdutoBaseUseCase cadastrarProdutoBaseUseCase;

    @Test
    void shouldCreateProdutoBase_WithoutImage_WhenDataIsValid() {
        // Arrange
        ProdutoBase produto = new ProdutoBase();
        produto.setNome("Arroz");
        produto.setMarca("Tio João");

        when(produtoRepository.save(any(ProdutoBase.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        ProdutoBase saved = cadastrarProdutoBaseUseCase.execute(produto, null);

        // Assert
        assertThat(saved).isNotNull();
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getCriadoEm()).isNotNull();
        assertThat(saved.getAtualizadoEm()).isNotNull();
        assertThat(saved.isAtivo()).isTrue();
        assertThat(saved.getUrlImagem()).isNull();
        verify(produtoRepository).save(produto);
        verifyNoInteractions(imageStorageService);
    }

    @Test
    void shouldCreateProdutoBase_WithImage_WhenDataIsValid() {
        // Arrange
        ProdutoBase produto = new ProdutoBase();
        produto.setNome("Feijão");
        
        MultipartFile image = mock(MultipartFile.class);
        when(image.isEmpty()).thenReturn(false);
        when(image.getOriginalFilename()).thenReturn("feijao.png");
        when(imageStorageService.uploadImage(any(MultipartFile.class), anyString())).thenReturn("generated-image-name.png");
        
        when(produtoRepository.save(any(ProdutoBase.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        ProdutoBase saved = cadastrarProdutoBaseUseCase.execute(produto, image);

        // Assert
        assertThat(saved).isNotNull();
        assertThat(saved.getUrlImagem()).isEqualTo("generated-image-name.png");
        verify(imageStorageService).uploadImage(eq(image), eq(".png"));
        verify(produtoRepository).save(produto);
    }

    @Test
    void shouldCreateProdutoBase_WithDefaultExtension_WhenImageHasNoExtension() {
        // Arrange
        ProdutoBase produto = new ProdutoBase();
        produto.setNome("Leite");
        
        MultipartFile image = mock(MultipartFile.class);
        when(image.isEmpty()).thenReturn(false);
        when(image.getOriginalFilename()).thenReturn("leite-sem-extensao");
        when(imageStorageService.uploadImage(any(MultipartFile.class), anyString())).thenReturn("generated-image.jpg");
        
        when(produtoRepository.save(any(ProdutoBase.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        ProdutoBase saved = cadastrarProdutoBaseUseCase.execute(produto, image);

        // Assert
        assertThat(saved).isNotNull();
        verify(imageStorageService).uploadImage(eq(image), eq(".jpg"));
        verify(produtoRepository).save(produto);
    }

    @Test
    void shouldUpdateProdutoBase_WhenIdIsProvided() {
        // Arrange
        UUID existingId = UUID.randomUUID();
        ProdutoBase produto = new ProdutoBase();
        produto.setId(existingId);
        produto.setNome("Açúcar");

        when(produtoRepository.save(any(ProdutoBase.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        ProdutoBase saved = cadastrarProdutoBaseUseCase.execute(produto, null);

        // Assert
        assertThat(saved.getId()).isEqualTo(existingId);
        assertThat(saved.getCriadoEm()).isNull(); // UseCase only sets criadoEm if id is null
        assertThat(saved.getAtualizadoEm()).isNotNull();
        verify(produtoRepository).save(produto);
    }
}
