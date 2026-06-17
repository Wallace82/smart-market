package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.application.port.out.CampanhaDomainRepository;
import com.smartmarket.supermarket.domain.model.Campanha;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class IncrementarConversoesUseCase {

    private final CampanhaDomainRepository repository;

    public IncrementarConversoesUseCase(CampanhaDomainRepository repository) {
        this.repository = repository;
    }

    public Campanha execute(UUID id) {
        Campanha campanha = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Campanha não encontrada"));
        campanha.setConversoes(campanha.getConversoes() + 1);
        return repository.save(campanha);
    }
}
