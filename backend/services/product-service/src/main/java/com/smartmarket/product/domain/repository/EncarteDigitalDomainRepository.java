package com.smartmarket.product.domain.repository;

import com.smartmarket.product.domain.model.EncarteDigital;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EncarteDigitalDomainRepository {
    EncarteDigital save(EncarteDigital encarteDigital);
    Optional<EncarteDigital> findById(UUID id);
    List<EncarteDigital> findAll();
    List<EncarteDigital> findBySupermercadoId(UUID supermercadoId);
    void deleteById(UUID id);
}
