package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.application.port.out.CampanhaDomainRepository;
import com.smartmarket.supermarket.domain.model.Campanha;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ListarCampanhasPorSupermercadoUseCase {

    private final CampanhaDomainRepository repository;

    public ListarCampanhasPorSupermercadoUseCase(CampanhaDomainRepository repository) {
        this.repository = repository;
    }

    public List<Campanha> execute(UUID supermercadoId) {
        return repository.findBySupermercadoId(supermercadoId);
    }
}
