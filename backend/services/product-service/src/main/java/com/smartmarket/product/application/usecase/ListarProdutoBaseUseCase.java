package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.ProdutoBase;
import com.smartmarket.product.domain.repository.ProdutoBaseDomainRepository;
import com.smartmarket.product.infrastructure.storage.ImageStorageService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListarProdutoBaseUseCase {

    private final ProdutoBaseDomainRepository produtoRepository;
    private final ImageStorageService imageStorageService;

    public ListarProdutoBaseUseCase(ProdutoBaseDomainRepository produtoRepository, ImageStorageService imageStorageService) {
        this.produtoRepository = produtoRepository;
        this.imageStorageService = imageStorageService;
    }

    public List<ProdutoBase> execute(int page, int size) {
        List<ProdutoBase> produtos = produtoRepository.findAll(page, size);
        produtos.forEach(this::enriquecerUrlImagem);
        return produtos;
    }

    public List<ProdutoBase> buscarPorNome(String nome) {
        List<ProdutoBase> produtos = produtoRepository.findByNomeContainingIgnoreCase(nome);
        produtos.forEach(this::enriquecerUrlImagem);
        return produtos;
    }

    private void enriquecerUrlImagem(ProdutoBase produto) {
        if (produto.getUrlImagem() != null && !produto.getUrlImagem().startsWith("http")) {
            produto.setUrlImagem(imageStorageService.getPublicUrl(produto.getUrlImagem()));
        }
    }
}
