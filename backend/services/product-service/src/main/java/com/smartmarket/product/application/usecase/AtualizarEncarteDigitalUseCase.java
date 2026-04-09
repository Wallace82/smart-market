package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.model.EncarteItem;
import com.smartmarket.product.domain.repository.EncarteDigitalDomainRepository;
import com.smartmarket.product.domain.repository.OfertaSupermercadoDomainRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AtualizarEncarteDigitalUseCase {

    private final EncarteDigitalDomainRepository encarteDigitalRepository;
    private final OfertaSupermercadoDomainRepository ofertaSupermercadoRepository;

    public AtualizarEncarteDigitalUseCase(EncarteDigitalDomainRepository encarteDigitalRepository, OfertaSupermercadoDomainRepository ofertaSupermercadoRepository) {
        this.encarteDigitalRepository = encarteDigitalRepository;
        this.ofertaSupermercadoRepository = ofertaSupermercadoRepository;
    }

    public EncarteDigital execute(UUID id, EncarteDigital encarteAtualizado) {
        EncarteDigital encarteExistente = encarteDigitalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Encarte digital não encontrado com ID: " + id));

        encarteExistente.setSupermercadoId(encarteAtualizado.getSupermercadoId());
        encarteExistente.setTemaId(encarteAtualizado.getTemaId());
        encarteExistente.setTitulo(encarteAtualizado.getTitulo());
        encarteExistente.setDataInicio(encarteAtualizado.getDataInicio());
        encarteExistente.setDataFim(encarteAtualizado.getDataFim());
        // Status não é atualizado diretamente aqui, mas por um caso de uso específico
        encarteExistente.setAtualizadoEm(LocalDateTime.now());

        // Atualizar itens do encarte
        if (encarteAtualizado.getItens() != null) {
            // Remove itens antigos que não estão na lista atualizada
            encarteExistente.getItens().removeIf(existingItem ->
                    encarteAtualizado.getItens().stream().noneMatch(newItem ->
                            newItem.getId() != null && newItem.getId().equals(existingItem.getId())
                    )
            );

            for (EncarteItem newItem : encarteAtualizado.getItens()) {
                if (!ofertaSupermercadoRepository.findById(newItem.getOfertaId()).isPresent()) {
                    throw new IllegalArgumentException("Oferta com ID " + newItem.getOfertaId() + " não encontrada.");
                }
                newItem.setEncarteId(encarteExistente.getId()); // Garante que o item está associado ao encarte correto

                if (newItem.getId() == null) { // Novo item
                    newItem.setId(UUID.randomUUID());
                    encarteExistente.getItens().add(newItem);
                } else { // Item existente, atualiza
                    encarteExistente.getItens().stream()
                            .filter(existingItem -> existingItem.getId().equals(newItem.getId()))
                            .findFirst()
                            .ifPresent(existingItem -> {
                                existingItem.setOfertaId(newItem.getOfertaId());
                                existingItem.setOrdemExibicao(newItem.getOrdemExibicao());
                                existingItem.setDestaque(newItem.isDestaque());
                            });
                }
            }
        }

        return encarteDigitalRepository.save(encarteExistente);
    }
}
