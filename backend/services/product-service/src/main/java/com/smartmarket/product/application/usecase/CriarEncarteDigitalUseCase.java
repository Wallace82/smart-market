package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.model.EncarteStatus;
import com.smartmarket.product.domain.model.EncarteItem;
import com.smartmarket.product.domain.repository.EncarteDigitalDomainRepository;
import com.smartmarket.product.domain.repository.OfertaSupermercadoDomainRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CriarEncarteDigitalUseCase {

    private final EncarteDigitalDomainRepository encarteDigitalRepository;
    private final OfertaSupermercadoDomainRepository ofertaSupermercadoRepository;

    public CriarEncarteDigitalUseCase(EncarteDigitalDomainRepository encarteDigitalRepository, OfertaSupermercadoDomainRepository ofertaSupermercadoRepository) {
        this.encarteDigitalRepository = encarteDigitalRepository;
        this.ofertaSupermercadoRepository = ofertaSupermercadoRepository;
    }

    public EncarteDigital execute(EncarteDigital encarteDigital) {
        if (encarteDigital.getId() == null) {
            encarteDigital.setId(UUID.randomUUID());
            encarteDigital.setCriadoEm(LocalDateTime.now());
        }
        encarteDigital.setAtualizadoEm(LocalDateTime.now());
        encarteDigital.setStatus(EncarteStatus.RASCUNHO); // Encartes sempre começam como rascunho

        // Validar se as ofertas existem
        if (encarteDigital.getItens() != null) {
            encarteDigital.setItens(encarteDigital.getItens().stream().peek(item -> {
                if (!ofertaSupermercadoRepository.findById(item.getOfertaId()).isPresent()) {
                    throw new IllegalArgumentException("Oferta com ID " + item.getOfertaId() + " não encontrada.");
                }
                item.setEncarteId(encarteDigital.getId()); // Associa o item ao encarte
            }).collect(Collectors.toList()));
        }

        return encarteDigitalRepository.save(encarteDigital);
    }
}
