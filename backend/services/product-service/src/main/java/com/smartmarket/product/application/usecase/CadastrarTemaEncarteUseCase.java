package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.TemaEncarte;
import com.smartmarket.product.domain.repository.TemaEncarteDomainRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CadastrarTemaEncarteUseCase {

    private final TemaEncarteDomainRepository repository;

    public CadastrarTemaEncarteUseCase(TemaEncarteDomainRepository repository) {
        this.repository = repository;
    }

    public TemaEncarte execute(TemaEncarte temaEncarte) {
        if (temaEncarte.getId() == null) {
            temaEncarte.setId(UUID.randomUUID());
            temaEncarte.setCriadoEm(LocalDateTime.now());
        }
        return repository.save(temaEncarte);
    }
}
