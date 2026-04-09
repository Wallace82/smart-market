package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.model.EncarteStatus;
import com.smartmarket.product.domain.repository.EncarteDigitalDomainRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AlterarStatusEncarteDigitalUseCase {

    private final EncarteDigitalDomainRepository repository;

    public AlterarStatusEncarteDigitalUseCase(EncarteDigitalDomainRepository repository) {
        this.repository = repository;
    }

    public EncarteDigital execute(UUID id, EncarteStatus novoStatus) {
        EncarteDigital encarteExistente = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Encarte digital não encontrado com ID: " + id));

        encarteExistente.setStatus(novoStatus);
        encarteExistente.setAtualizadoEm(LocalDateTime.now());

        return repository.save(encarteExistente);
    }
}
