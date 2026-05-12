package com.smartmarket.supermarket.application.port.out;

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

    /**
     * RF-06.2: Busca supermercados ATIVOS dentro do raio em metros via fórmula de Haversine.
     */
    List<Supermercado> findNearby(Double latitude, Double longitude, Integer radiusMeters);

    /**
     * RF-06.3: Busca supermercados ATIVOS por CEP ou nome de bairro (busca parcial no endereço).
     */
    List<Supermercado> findByLocation(String cep, String bairro, int page, int size);
}

