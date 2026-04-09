package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.OfertaSupermercado;
import com.smartmarket.product.domain.model.ProdutoBase;
import com.smartmarket.product.domain.repository.OfertaDomainRepository;
import com.smartmarket.product.domain.repository.ProdutoBaseDomainRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CriarOfertaUseCase {

    private final OfertaDomainRepository ofertaRepository;
    private final ProdutoBaseDomainRepository produtoRepository;

    public CriarOfertaUseCase(OfertaDomainRepository ofertaRepository, ProdutoBaseDomainRepository produtoRepository) {
        this.ofertaRepository = ofertaRepository;
        this.produtoRepository = produtoRepository;
    }

    public OfertaSupermercado execute(UUID supermercadoId, UUID produtoBaseId, OfertaSupermercado oferta) {
        // 1. Verifica se o Produto Base existe
        ProdutoBase produtoBase = produtoRepository.findById(produtoBaseId)
                .orElseThrow(() -> new IllegalArgumentException("Produto Base não encontrado."));

        // 2. Valida regra RN-06.3: Não pode ter mais de uma oferta ativa para o mesmo produto
        boolean jaExisteOferta = ofertaRepository.existsBySupermercadoIdAndProdutoBaseIdAndAtivoTrue(supermercadoId, produtoBaseId);
        if (jaExisteOferta) {
            throw new IllegalStateException("Já existe uma oferta ativa para este produto neste supermercado.");
        }

        // 3. Monta a oferta e salva
        if (oferta.getId() == null) {
            oferta.setId(UUID.randomUUID());
            oferta.setCriadoEm(LocalDateTime.now());
        }
        
        oferta.setSupermercadoId(supermercadoId);
        oferta.setProdutoBase(produtoBase);
        oferta.setAtivo(true);
        oferta.setAtualizadoEm(LocalDateTime.now());

        return ofertaRepository.save(oferta);
    }
}
