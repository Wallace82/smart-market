package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.ProdutoBase;
import com.smartmarket.product.domain.repository.ProdutoBaseDomainRepository;
import com.smartmarket.product.infrastructure.storage.ImageStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CadastrarProdutoBaseUseCase {

    private final ProdutoBaseDomainRepository produtoRepository;
    private final ImageStorageService imageStorageService;

    public CadastrarProdutoBaseUseCase(ProdutoBaseDomainRepository produtoRepository, ImageStorageService imageStorageService) {
        this.produtoRepository = produtoRepository;
        this.imageStorageService = imageStorageService;
    }

    public ProdutoBase execute(ProdutoBase produto, MultipartFile imagem) {
        if (produto.getId() == null) {
            produto.setId(UUID.randomUUID());
            produto.setCriadoEm(LocalDateTime.now());
        }
        
        produto.setAtivo(true);
        produto.setAtualizadoEm(LocalDateTime.now());

        if (imagem != null && !imagem.isEmpty()) {
            String extension = extrairExtensao(imagem.getOriginalFilename());
            String nomeArquivo = imageStorageService.uploadImage(imagem, extension);
            produto.setUrlImagem(nomeArquivo); // Salva apenas o nome do arquivo gerado
        }

        return produtoRepository.save(produto);
    }

    private String extrairExtensao(String nomeOriginal) {
        if (nomeOriginal != null && nomeOriginal.contains(".")) {
            return nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
        }
        return ".jpg";
    }
}
