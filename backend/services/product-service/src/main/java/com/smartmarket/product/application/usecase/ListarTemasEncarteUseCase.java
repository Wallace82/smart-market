package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.TemaEncarte;
import com.smartmarket.product.domain.repository.TemaEncarteDomainRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ListarTemasEncarteUseCase {

    private final TemaEncarteDomainRepository repository;

    public ListarTemasEncarteUseCase(TemaEncarteDomainRepository repository) {
        this.repository = repository;
    }

    public List<TemaEncarte> buscarTodos() {
        return repository.findAll();
    }

    public Optional<TemaEncarte> buscarPorId(UUID id) {
        return repository.findById(id);
    }
}
