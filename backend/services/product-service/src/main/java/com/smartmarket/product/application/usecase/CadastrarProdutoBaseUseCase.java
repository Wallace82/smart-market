package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.ProdutoBase;
import com.smartmarket.product.application.port.out.ProdutoBaseDomainRepository;
import com.smartmarket.product.infrastructure.adapter.out.storage.ImageStorageService;
import com.smartmarket.product.infrastructure.adapter.out.persistence.MarcaRepository;
import com.smartmarket.product.infrastructure.adapter.out.persistence.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CadastrarProdutoBaseUseCase {

    private final ProdutoBaseDomainRepository produtoRepository;
    private final ImageStorageService imageStorageService;
    private final MarcaRepository marcaRepository;
    private final CategoriaRepository categoriaRepository;

    public CadastrarProdutoBaseUseCase(ProdutoBaseDomainRepository produtoRepository, 
                                       ImageStorageService imageStorageService,
                                       MarcaRepository marcaRepository,
                                       CategoriaRepository categoriaRepository) {
        this.produtoRepository = produtoRepository;
        this.imageStorageService = imageStorageService;
        this.marcaRepository = marcaRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public ProdutoBase execute(ProdutoBase produto, MultipartFile imagem) {
        if (produto.getId() == null) {
            produto.setId(UUID.randomUUID());
            produto.setCriadoEm(LocalDateTime.now());
        }
        
        produto.setAtivo(true);
        produto.setAtualizadoEm(LocalDateTime.now());

        if (produto.getMarcaId() != null) {
            marcaRepository.findById(produto.getMarcaId()).ifPresent(marca -> {
                produto.setMarca(marca.getNome());
            });
        }
        
        if (produto.getCategoriaId() != null) {
            categoriaRepository.findById(produto.getCategoriaId()).ifPresent(categoria -> {
                produto.setCategoria(categoria.getNome());
            });
        }

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


