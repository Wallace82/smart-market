package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.domain.repository.SupermercadoDomainRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ListarSupermercadoUseCase {

    private final SupermercadoDomainRepository repository;

    public ListarSupermercadoUseCase(SupermercadoDomainRepository repository) {
        this.repository = repository;
    }

    public List<Supermercado> buscarTodos(int page, int size) {
        return repository.findAll(page, size);
    }

    public Supermercado buscarPorId(UUID id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Supermercado não encontrado."));
    }

    public List<Supermercado> buscarPorGestorId(UUID gestorId) {
        return repository.findByGestorId(gestorId);
    }
}
