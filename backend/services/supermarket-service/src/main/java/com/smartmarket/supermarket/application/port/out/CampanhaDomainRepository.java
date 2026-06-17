package com.smartmarket.supermarket.application.port.out;

import com.smartmarket.supermarket.domain.model.Campanha;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CampanhaDomainRepository {
    Campanha save(Campanha campanha);
    Optional<Campanha> findById(UUID id);
    List<Campanha> findBySupermercadoId(UUID supermercadoId);
    void deleteById(UUID id);
}
