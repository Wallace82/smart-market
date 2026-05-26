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
public class AtualizarProdutoBaseUseCase {

    private final ProdutoBaseDomainRepository produtoRepository;
    private final ImageStorageService imageStorageService;
    private final MarcaRepository marcaRepository;
    private final CategoriaRepository categoriaRepository;

    public AtualizarProdutoBaseUseCase(ProdutoBaseDomainRepository produtoRepository, 
                                       ImageStorageService imageStorageService,
                                       MarcaRepository marcaRepository,
                                       CategoriaRepository categoriaRepository) {
        this.produtoRepository = produtoRepository;
        this.imageStorageService = imageStorageService;
        this.marcaRepository = marcaRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public ProdutoBase execute(UUID id, ProdutoBase dadosNovos, MultipartFile imagem) {
        ProdutoBase existente = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado com ID: " + id));

        existente.setNome(dadosNovos.getNome());
        existente.setDescricao(dadosNovos.getDescricao());
        existente.setEan(dadosNovos.getEan());
        existente.setUnidadeMedida(dadosNovos.getUnidadeMedida());
        existente.setPesoVolume(dadosNovos.getPesoVolume());
        existente.setCategoriaId(dadosNovos.getCategoriaId());
        existente.setAtivo(dadosNovos.isAtivo());
        existente.setAtualizadoEm(LocalDateTime.now());

        // Update brand id and resolve name
        existente.setMarcaId(dadosNovos.getMarcaId());
        if (dadosNovos.getMarcaId() != null) {
            marcaRepository.findById(dadosNovos.getMarcaId()).ifPresent(marca -> {
                existente.setMarca(marca.getNome());
            });
        } else {
            existente.setMarca(dadosNovos.getMarca());
        }

        // Update categoria id and resolve name
        if (dadosNovos.getCategoriaId() != null) {
            categoriaRepository.findById(dadosNovos.getCategoriaId()).ifPresent(categoria -> {
                existente.setCategoria(categoria.getNome());
            });
        } else {
            existente.setCategoria(dadosNovos.getCategoria());
        }

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
