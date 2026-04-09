package com.smartmarket.supermarket.domain.repository;

import com.smartmarket.supermarket.domain.model.Supermercado;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SupermercadoDomainRepository {
    Optional<Supermercado> findById(UUID id);
    List<Supermercado> findAll(int page, int size);
    List<Supermercado> findByGestorId(UUID gestorId);
    boolean existsByCnpj(String cnpj);
    Supermercado save(Supermercado supermercado);
}
