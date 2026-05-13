package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.application.port.out.FilialDomainRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DeletarFilialUseCase {

    private final FilialDomainRepository repository;

    public DeletarFilialUseCase(FilialDomainRepository repository) {
        this.repository = repository;
    }

    public void execute(UUID id) {
        repository.deleteById(id);
    }
}
