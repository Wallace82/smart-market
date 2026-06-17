package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.application.port.out.CampanhaDomainRepository;
import com.smartmarket.supermarket.domain.model.Campanha;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AlterarStatusCampanhaUseCase {

    private final CampanhaDomainRepository repository;

    public AlterarStatusCampanhaUseCase(CampanhaDomainRepository repository) {
        this.repository = repository;
    }

    public Campanha execute(UUID id, String status) {
        Campanha campanha = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Campanha não encontrada"));
        campanha.setStatus(status);
        return repository.save(campanha);
    }
}
