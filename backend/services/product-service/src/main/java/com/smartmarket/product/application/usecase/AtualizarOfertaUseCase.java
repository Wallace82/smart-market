package com.smartmarket.product.application.usecase;
 
import com.smartmarket.product.domain.model.OfertaSupermercado;
import com.smartmarket.product.domain.model.ProdutoBase;
import com.smartmarket.product.application.port.out.OfertaDomainRepository;
import com.smartmarket.product.application.port.out.ProdutoBaseDomainRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.time.LocalDateTime;
import java.util.UUID;
 
@Service
public class AtualizarOfertaUseCase {
 
    private final OfertaDomainRepository ofertaRepository;
    private final ProdutoBaseDomainRepository produtoRepository;
 
    public AtualizarOfertaUseCase(OfertaDomainRepository ofertaRepository, ProdutoBaseDomainRepository produtoRepository) {
        this.ofertaRepository = ofertaRepository;
        this.produtoRepository = produtoRepository;
    }
 
    @Transactional
    public OfertaSupermercado execute(UUID id, UUID produtoBaseId, OfertaSupermercado dadosAtualizados) {
        OfertaSupermercado existente = ofertaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Oferta não encontrada para o ID: " + id));
 
        // 1. Atualizar Produto se alterado
        if (produtoBaseId != null && (existente.getProdutoBase() == null || !existente.getProdutoBase().getId().equals(produtoBaseId))) {
            ProdutoBase produtoBase = produtoRepository.findById(produtoBaseId)
                    .orElseThrow(() -> new IllegalArgumentException("Produto Base não encontrado."));
            
            // RN-06.3: Não pode ter mais de uma oferta ativa para o mesmo produto
            boolean jaExisteOferta = ofertaRepository.existsBySupermercadoIdAndProdutoBaseIdAndAtivoTrue(existente.getSupermercadoId(), produtoBaseId);
            if (jaExisteOferta) {
                throw new IllegalStateException("Já existe uma oferta ativa para este produto neste supermercado.");
            }
            existente.setProdutoBase(produtoBase);
        }
 
        // 2. Atualizar campos financeiros e datas
        existente.setPrecoAtual(dadosAtualizados.getPrecoAtual());
        existente.setPrecoPromocional(dadosAtualizados.getPrecoPromocional());
        existente.setDataInicioPromocao(dadosAtualizados.getDataInicioPromocao());
        existente.setDataFimPromocao(dadosAtualizados.getDataFimPromocao());
        
        existente.setAtivo(dadosAtualizados.isAtivo());
        existente.setSuperOferta(dadosAtualizados.isSuperOferta());
        existente.setAtualizadoEm(LocalDateTime.now());
 
        return ofertaRepository.save(existente);
    }
}
