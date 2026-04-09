package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.TemaEncarte;
import com.smartmarket.product.domain.repository.TemaEncarteDomainRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AtualizarTemaEncarteUseCase {

    private final TemaEncarteDomainRepository repository;

    public AtualizarTemaEncarteUseCase(TemaEncarteDomainRepository repository) {
        this.repository = repository;
    }

    public TemaEncarte execute(UUID id, TemaEncarte temaAtualizado) {
        TemaEncarte temaExistente = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tema de encarte não encontrado com ID: " + id));

        temaExistente.setNome(temaAtualizado.getNome());
        temaExistente.setUrlBackgroundDecorativo(temaAtualizado.getUrlBackgroundDecorativo());
        temaExistente.setCorFundoHex(temaAtualizado.getCorFundoHex());
        temaExistente.setAtivo(temaAtualizado.isAtivo());

        return repository.save(temaExistente);
    }
}
