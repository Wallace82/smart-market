package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.application.port.out.SupermercadoDomainRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ListarSupermercadoUseCase {

    private final SupermercadoDomainRepository repository;

    public ListarSupermercadoUseCase(SupermercadoDomainRepository repository) {
        this.repository = repository;
    }

    public List<Supermercado> buscarTodos(int page, int size) {
        return repository.findAll(page, size);
    }

    public Supermercado buscarPorId(UUID id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Supermercado não encontrado."));
    }

    public List<Supermercado> buscarPorGestorId(UUID gestorId) {
        return repository.findByGestorId(gestorId);
    }

    /**
     * RF-06.2: Supermercados próximos por GPS — raio padrão 3 km.
     */
    public List<Supermercado> buscarProximos(Double latitude, Double longitude, Integer radiusMeters) {
        return repository.findNearby(latitude, longitude, radiusMeters);
    }

    /**
     * RF-06.3: Supermercados por CEP ou bairro — fallback quando GPS negado.
     */
    public List<Supermercado> buscarPorLocalizacao(String cep, String bairro, int page, int size) {
        return repository.findByLocation(cep, bairro, page, size);
    }
}

