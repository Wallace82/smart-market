package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.domain.model.SupermercadoStatus;
import com.smartmarket.supermarket.domain.repository.SupermercadoDomainRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CadastrarSupermercadoUseCase {

    private final SupermercadoDomainRepository repository;

    public CadastrarSupermercadoUseCase(SupermercadoDomainRepository repository) {
        this.repository = repository;
    }

    public Supermercado execute(Supermercado supermercado) {
        if (repository.existsByCnpj(supermercado.getCnpj())) {
            throw new IllegalArgumentException("Já existe um supermercado cadastrado com este CNPJ.");
        }

        if (supermercado.getId() == null) {
            supermercado.setId(UUID.randomUUID());
            supermercado.setCriadoEm(LocalDateTime.now());
        }

        supermercado.setStatus(SupermercadoStatus.PENDENTE); // Sempre começa como PENDENTE para aprovação do Admin
        supermercado.setAtualizadoEm(LocalDateTime.now());

        return repository.save(supermercado);
    }
}
