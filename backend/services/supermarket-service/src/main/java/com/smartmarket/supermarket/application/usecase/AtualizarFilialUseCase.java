package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.application.port.out.FilialDomainRepository;
import com.smartmarket.supermarket.domain.model.Filial;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AtualizarFilialUseCase {

    private final FilialDomainRepository repository;

    public AtualizarFilialUseCase(FilialDomainRepository repository) {
        this.repository = repository;
    }

    public Filial execute(UUID id, Filial filialAtualizada) {
        Filial existente = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Filial não encontrada com ID: " + id));

        existente.setNome(filialAtualizada.getNome());
        existente.setEndereco(filialAtualizada.getEndereco());
        existente.setCep(filialAtualizada.getCep());
        existente.setCidade(filialAtualizada.getCidade());
        existente.setEstado(filialAtualizada.getEstado());
        existente.setLatitude(filialAtualizada.getLatitude());
        existente.setLongitude(filialAtualizada.getLongitude());
        existente.setTelefone(filialAtualizada.getTelefone());
        existente.setEmail(filialAtualizada.getEmail());
        existente.setAtivo(filialAtualizada.isAtivo());
        existente.setAtualizadoEm(LocalDateTime.now());

        return repository.save(existente);
    }
}
