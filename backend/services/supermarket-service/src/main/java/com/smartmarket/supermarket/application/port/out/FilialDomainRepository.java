package com.smartmarket.supermarket.application.port.out;

import com.smartmarket.supermarket.domain.model.Filial;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FilialDomainRepository {
    Filial save(Filial filial);
    Optional<Filial> findById(UUID id);
    List<Filial> findBySupermercadoId(UUID supermercadoId);
    void deleteById(UUID id);
}
