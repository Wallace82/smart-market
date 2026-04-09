package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.repository.EncarteDigitalDomainRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ListarEncartesDigitaisUseCase {

    private final EncarteDigitalDomainRepository repository;

    public ListarEncartesDigitaisUseCase(EncarteDigitalDomainRepository repository) {
        this.repository = repository;
    }

    public List<EncarteDigital> buscarTodos() {
        return repository.findAll();
    }

    public Optional<EncarteDigital> buscarPorId(UUID id) {
        return repository.findById(id);
    }

    public List<EncarteDigital> buscarPorSupermercado(UUID supermercadoId) {
        return repository.findBySupermercadoId(supermercadoId);
    }
}
