package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.domain.repository.SupermercadoDomainRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AtualizarSupermercadoUseCase {

    private final SupermercadoDomainRepository repository;

    public AtualizarSupermercadoUseCase(SupermercadoDomainRepository repository) {
        this.repository = repository;
    }

    public Supermercado execute(UUID id, Supermercado supermercadoAtualizado) {
        Supermercado supermercadoExistente = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Supermercado não encontrado com ID: " + id));

        // Atualiza apenas os campos permitidos
        supermercadoExistente.setNomeFantasia(supermercadoAtualizado.getNomeFantasia());
        supermercadoExistente.setEndereco(supermercadoAtualizado.getEndereco());
        supermercadoExistente.setLatitude(supermercadoAtualizado.getLatitude());
        supermercadoExistente.setLongitude(supermercadoAtualizado.getLongitude());
        supermercadoExistente.setRaioAtuacao(supermercadoAtualizado.getRaioAtuacao());
        supermercadoExistente.setGestorId(supermercadoAtualizado.getGestorId()); // Pode ser alterado? Depende da regra de negócio.
        supermercadoExistente.setUrlLogomarca(supermercadoAtualizado.getUrlLogomarca());
        supermercadoExistente.setCorPrimariaHex(supermercadoAtualizado.getCorPrimariaHex());
        supermercadoExistente.setCorSecundariaHex(supermercadoAtualizado.getCorSecundariaHex());
        supermercadoExistente.setAtualizadoEm(LocalDateTime.now());

        return repository.save(supermercadoExistente);
    }
}
