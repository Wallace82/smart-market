package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.ProdutoBase;
import com.smartmarket.product.application.port.out.ProdutoBaseDomainRepository;
import com.smartmarket.product.infrastructure.adapter.out.storage.ImageStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AtualizarProdutoBaseUseCase {

    private final ProdutoBaseDomainRepository produtoRepository;
    private final ImageStorageService imageStorageService;

    public AtualizarProdutoBaseUseCase(ProdutoBaseDomainRepository produtoRepository, ImageStorageService imageStorageService) {
        this.produtoRepository = produtoRepository;
        this.imageStorageService = imageStorageService;
    }

    public ProdutoBase execute(UUID id, ProdutoBase dadosNovos, MultipartFile imagem) {
        ProdutoBase existente = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado com ID: " + id));

        existente.setNome(dadosNovos.getNome());
        existente.setMarca(dadosNovos.getMarca());
        existente.setDescricao(dadosNovos.getDescricao());
        existente.setUnidadeMedida(dadosNovos.getUnidadeMedida());
        existente.setPesoVolume(dadosNovos.getPesoVolume());
        existente.setCategoriaId(dadosNovos.getCategoriaId());
        existente.setAtivo(dadosNovos.isAtivo());
        existente.setAtualizadoEm(LocalDateTime.now());

        if (imagem != null && !imagem.isEmpty()) {
            String extension = extrairExtensao(imagem.getOriginalFilename());
            String nomeArquivo = imageStorageService.uploadImage(imagem, extension);
            existente.setUrlImagem(nomeArquivo);
        }

        return produtoRepository.save(existente);
    }

    private String extrairExtensao(String nomeOriginal) {
        if (nomeOriginal != null && nomeOriginal.contains(".")) {
            return nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
        }
        return ".jpg";
    }
}
