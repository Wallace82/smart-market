package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.domain.model.SupermercadoStatus;
import com.smartmarket.supermarket.domain.repository.SupermercadoDomainRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AlterarStatusSupermercadoUseCase {

    private final SupermercadoDomainRepository repository;

    public AlterarStatusSupermercadoUseCase(SupermercadoDomainRepository repository) {
        this.repository = repository;
    }

    public Supermercado execute(UUID id, SupermercadoStatus novoStatus) {
        Supermercado supermercado = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Supermercado não encontrado com o ID fornecido."));

        supermercado.setStatus(novoStatus);
        supermercado.setAtualizadoEm(LocalDateTime.now());

        return repository.save(supermercado);
    }
}
