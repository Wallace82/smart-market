package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.application.port.out.CampanhaDomainRepository;
import com.smartmarket.supermarket.domain.model.Campanha;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CadastrarCampanhaUseCase {

    private final CampanhaDomainRepository repository;

    public CadastrarCampanhaUseCase(CampanhaDomainRepository repository) {
        this.repository = repository;
    }

    public Campanha execute(Campanha campanha) {
        if (campanha.getId() == null) {
            campanha.setId(UUID.randomUUID());
        }
        return repository.save(campanha);
    }
}
