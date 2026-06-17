package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.application.port.out.CampanhaDomainRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DeletarCampanhaUseCase {

    private final CampanhaDomainRepository repository;

    public DeletarCampanhaUseCase(CampanhaDomainRepository repository) {
        this.repository = repository;
    }

    public void execute(UUID id) {
        repository.deleteById(id);
    }
}
