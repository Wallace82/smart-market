package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.model.EncarteStatus;
import com.smartmarket.product.domain.model.EncarteItem;
import com.smartmarket.product.application.port.out.EncarteDigitalDomainRepository;
import com.smartmarket.product.application.port.out.OfertaSupermercadoDomainRepository;
import com.smartmarket.product.application.port.in.CriarEncarteDigitalPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CriarEncarteDigitalUseCase implements CriarEncarteDigitalPort {

    private final EncarteDigitalDomainRepository encarteDigitalRepository;
    private final OfertaSupermercadoDomainRepository ofertaSupermercadoRepository;

    public CriarEncarteDigitalUseCase(EncarteDigitalDomainRepository encarteDigitalRepository, OfertaSupermercadoDomainRepository ofertaSupermercadoRepository) {
        this.encarteDigitalRepository = encarteDigitalRepository;
        this.ofertaSupermercadoRepository = ofertaSupermercadoRepository;
    }

    @Override
    public EncarteDigital execute(EncarteDigital encarteDigital) {
        log.info("Iniciando UseCase para criar Encarte Digital. Supermercado ID: {}", encarteDigital.getSupermercadoId());
        
        // Garantir que o ID sempre existe antes de usar
        if (encarteDigital.getId() == null) {
            encarteDigital.setId(UUID.randomUUID());
        }
        if (encarteDigital.getCriadoEm() == null) {
            encarteDigital.setCriadoEm(LocalDateTime.now());
        }
        encarteDigital.setAtualizadoEm(LocalDateTime.now());
        encarteDigital.setStatus(EncarteStatus.RASCUNHO); // Encartes sempre começam como rascunho

        // Validar se as ofertas existem
        if (encarteDigital.getItens() != null) {
            encarteDigital.setItens(encarteDigital.getItens().stream().peek(item -> {
                if (!ofertaSupermercadoRepository.findById(item.getOfertaId()).isPresent()) {
                    log.error("Tentativa de criar encarte com oferta inexistente: {}", item.getOfertaId());
                    throw new IllegalArgumentException("Oferta com ID " + item.getOfertaId() + " não encontrada.");
                }
                if (item.getId() == null) {
                    item.setId(UUID.randomUUID());
                }
                item.setEncarteId(encarteDigital.getId()); // Associa o item ao encarte
            }).collect(Collectors.toList()));
        }

        EncarteDigital saved = encarteDigitalRepository.save(encarteDigital);
        log.info("UseCase finalizado. Encarte Digital salvo com ID: {}", saved.getId());
        return saved;
    }
}

